import { db } from "./db";
import { eq, sql, and, desc } from "drizzle-orm";
import { chroniclesGameState, playerChoices, playerPersonalities, chronicleAccounts, landPlots, cityZones, chatUsers, chatChannels, chatMessages, voiceSamples, voiceMessages, userCredits, creditTransactions } from "@shared/schema";
import OpenAI from "openai";
import { SEASON_ZERO_QUESTS, STARTER_FACTIONS, STARTER_NPCS, ERA_SETTINGS, ERAS, WORLD_ZONES, ZONE_ACTIVITIES, NPC_SCHEDULES, MINIGAME_CONFIGS, getWorldTimeInfo, getZoneAmbientState, getAllZonesForEra } from "./chronicles-service";
import { zonePresence, minigameSessions } from "@shared/schema";
import { generateToken, hashPassword, generateTrustLayerId } from "./trustlayer-sso";
import type { Express, Request, Response, NextFunction } from "express";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const DIFFICULTY_XP: Record<string, number> = { easy: 100, medium: 250, hard: 500 };
const DIFFICULTY_SHELLS: Record<string, number> = { easy: 50, medium: 150, hard: 300 };

const ALL_ACHIEVEMENTS = [
  { id: "first_decision", name: "First Steps", description: "Made your first decision", icon: "🎯" },
  { id: "level_5", name: "Rising Star", description: "Reached level 5", icon: "⭐" },
  { id: "level_10", name: "Veteran", description: "Reached level 10", icon: "🏆" },
  { id: "explorer", name: "Explorer", description: "Completed situations in all 3 eras", icon: "🗺️" },
  { id: "social_butterfly", name: "Social Butterfly", description: "Spoken to 5+ NPCs", icon: "🦋" },
  { id: "faction_member", name: "Faction Member", description: "Joined a faction", icon: "⚔️" },
  { id: "streak_3", name: "Dedicated", description: "3 day streak", icon: "🔥" },
  { id: "streak_7", name: "Unstoppable", description: "7 day streak", icon: "💎" },
  { id: "ten_decisions", name: "Seasoned", description: "Made 10 decisions", icon: "📜" },
  { id: "hundred_shells", name: "Shell Collector", description: "Earned 100+ shells", icon: "🐚" },
];

async function isChroniclesAuthenticated(req: any, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const sessionToken = authHeader.substring(7);

    const [account] = await db.select().from(chronicleAccounts)
      .where(eq(chronicleAccounts.sessionToken, sessionToken))
      .limit(1);

    if (!account) {
      return res.status(401).json({ error: "Invalid session" });
    }

    if (!account.isActive) {
      return res.status(401).json({ error: "Account disabled" });
    }

    if (account.sessionExpiresAt && new Date(account.sessionExpiresAt) < new Date()) {
      return res.status(401).json({ error: "Session expired" });
    }

    req.chroniclesAccount = account;
    req.user = {
      id: account.id,
      claims: { sub: account.id },
      email: account.email
    };

    return next();
  } catch (error: any) {
    console.error("Chronicles play auth error:", error.message || error);
    return res.status(401).json({ error: "Authentication required" });
  }
}

const getPlayUserId = (req: any): string | null => {
  return req.chroniclesUser?.id || req.chroniclesAccount?.userId || req.chroniclesAccount?.id || null;
};

const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));

export function registerChroniclesPlayRoutes(app: Express) {

  app.get("/api/chronicles/play/state", isChroniclesAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getPlayUserId(req);
      if (!userId) return res.status(401).json({ error: "Authentication required" });

      let [state] = await db.select().from(chroniclesGameState)
        .where(eq(chroniclesGameState.userId, userId))
        .limit(1);

      if (!state) {
        const [created] = await db.insert(chroniclesGameState).values({
          userId,
          name: req.chroniclesAccount?.username || "Traveler",
        }).returning();
        state = created;
      }

      const nextLevelXp = state.level * 1000;
      const xpProgress = (state.experience / nextLevelXp) * 100;

      let recentLog: any[] = [];
      try {
        const parsed = JSON.parse(state.gameLog || '[]');
        recentLog = Array.isArray(parsed) ? parsed.slice(-10) : [];
      } catch { recentLog = []; }

      const completedSet = new Set(state.completedSituations || []);
      const totalSeasonQuests = SEASON_ZERO_QUESTS.length;
      const completedSeasonQuests = SEASON_ZERO_QUESTS.filter(q => completedSet.has(q.id)).length;
      const seasonProgress = Math.round((completedSeasonQuests / totalSeasonQuests) * 100);
      const seasonComplete = completedSeasonQuests >= totalSeasonQuests;

      const eraProgress: Record<string, { total: number; completed: number; pct: number }> = {};
      for (const era of ["modern", "medieval", "wildwest"]) {
        const eraQuests = SEASON_ZERO_QUESTS.filter(q => q.era === era);
        const eraCompleted = eraQuests.filter(q => completedSet.has(q.id)).length;
        eraProgress[era] = { total: eraQuests.length, completed: eraCompleted, pct: Math.round((eraCompleted / eraQuests.length) * 100) };
      }

      const eraUnlocks = {
        modern: { unlocked: true, requiredLevel: 1 },
        medieval: { unlocked: state.level >= 3, requiredLevel: 3 },
        wildwest: { unlocked: state.level >= 5, requiredLevel: 5 },
      };

      res.json({
        gameState: state,
        state,
        nextLevelXp,
        xpProgress,
        recentLog,
        seasonProgress,
        seasonComplete,
        totalSeasonQuests,
        completedSeasonQuests,
        eraProgress,
        eraUnlocks,
      });
    } catch (error: any) {
      console.error("Get play state error:", error);
      res.status(500).json({ error: error.message || "Failed to get game state" });
    }
  });

  app.post("/api/chronicles/play/scenario", isChroniclesAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getPlayUserId(req);
      if (!userId) return res.status(401).json({ error: "Authentication required" });

      const { era } = req.body;
      if (!era || !ERA_SETTINGS[era]) {
        return res.status(400).json({ error: "Invalid era" });
      }

      const [state] = await db.select().from(chroniclesGameState)
        .where(eq(chroniclesGameState.userId, userId))
        .limit(1);

      if (!state) return res.status(404).json({ error: "Game state not found" });

      const eraLevelRequirements: Record<string, number> = { modern: 1, medieval: 3, wildwest: 5 };
      const requiredLevel = eraLevelRequirements[era] || 1;
      if (state.level < requiredLevel) {
        return res.status(403).json({ 
          error: `You need to reach level ${requiredLevel} to unlock the ${ERA_SETTINGS[era]?.worldDescription ? era : "unknown"} era`,
          requiredLevel,
          currentLevel: state.level,
        });
      }

      const completedSet = new Set(state.completedSituations || []);

      const available = SEASON_ZERO_QUESTS.filter(q => {
        if (q.era !== era) return false;
        if (completedSet.has(q.id)) return false;
        if (q.prerequisite && !completedSet.has(q.prerequisite)) return false;
        return true;
      });

      let situation: any;
      let isGenerated = false;
      if (available.length > 0) {
        const arrival = available.filter(q => q.category === "arrival");
        if (arrival.length > 0) {
          situation = arrival[0];
        } else {
          situation = available[Math.floor(Math.random() * available.length)];
        }
      } else {
        isGenerated = true;
        const completedQuests = SEASON_ZERO_QUESTS.filter(q => q.era === era && completedSet.has(q.id));
        const recentTitles = completedQuests.slice(-5).map(q => q.title).join(", ");
        const eraNpcs = STARTER_NPCS.filter(n => n.era === era).map(n => `${n.name} (${n.title})`).join(", ");
        const relationships = state.npcRelationships ? JSON.parse(state.npcRelationships || '{}') : {};
        const relSummary = Object.entries(relationships)
          .filter(([k]) => STARTER_NPCS.some(n => n.name === k && n.era === era))
          .map(([k, v]: [string, any]) => `${k}: ${v > 0 ? 'ally' : v < 0 ? 'rival' : 'neutral'} (${v})`)
          .join(", ") || "No established relationships yet";
        try {
          const genRes = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: `You generate DAILY LIFE SITUATIONS for DarkWave Chronicles — a parallel life simulation, NOT an RPG.

ERA: ${era} — ${ERA_SETTINGS[era].worldDescription}
ATMOSPHERE: ${ERA_SETTINGS[era].atmosphere}
KEY NPCs: ${eraNpcs}
PLAYER RELATIONSHIPS: ${relSummary}
PLAYER LEVEL: ${state.level} | Decisions: ${state.decisionsRecorded}
RECENT SITUATIONS: ${recentTitles || "None yet"}

RULES:
- Create a situation that HAPPENS TO the player, not a quest or mission
- Life throws things at people — relationships, crises, opportunities, moral dilemmas, community needs
- NO right or wrong answer. Every choice reveals character, not morality.
- Weave in real historical/educational context naturally (don't lecture — make learning organic)
- Reference NPCs and existing relationships when appropriate
- Make it feel like a real day in a real parallel life
- Vary the categories: life_event, encounter, crisis, opportunity, moral_dilemma, community, partnership, conflict

Return JSON:
{
  "id": "daily_${era}_${Date.now()}",
  "title": "Short evocative title",
  "description": "2-3 sentences. Vivid, personal, immersive. The player is IN this moment.",
  "difficulty": "easy|medium|hard",
  "category": "one of the categories above",
  "npcInvolved": "NPC name or null",
  "educationalTheme": "One sentence about the real-world knowledge woven in"
}`
              },
              { role: "user", content: `Generate a fresh, unique daily situation for this player. Make it something they haven't seen before — not a repeat of: ${recentTitles}. Player stats — Wisdom: ${state.wisdom}, Courage: ${state.courage}, Compassion: ${state.compassion}, Cunning: ${state.cunning}, Influence: ${state.influence}.` }
            ],
            response_format: { type: "json_object" },
            max_completion_tokens: 600,
          });
          situation = JSON.parse(genRes.choices[0]?.message?.content || '{}');
          if (!situation.id) situation.id = `daily_${era}_${Date.now()}`;
          if (!situation.difficulty) situation.difficulty = "medium";
        } catch {
          situation = {
            id: `daily_${era}_${Date.now()}`,
            title: "A New Day Unfolds",
            description: "Life in this era doesn't pause. Something unexpected crosses your path today — how you respond is entirely up to you.",
            difficulty: "medium",
            category: "life_event",
          };
        }
      }

      const difficulty = situation.difficulty || "medium";
      const xpReward = DIFFICULTY_XP[difficulty] || 250;
      const shellsReward = DIFFICULTY_SHELLS[difficulty] || 150;

      const eraSetting = ERA_SETTINGS[era];
      const npcContext = situation.npcInvolved
        ? STARTER_NPCS.find(n => n.name === situation.npcInvolved)
        : null;
      const npcDetail = npcContext
        ? `\nKEY NPC IN THIS SCENE: ${npcContext.name} — ${npcContext.title}. Personality: ${npcContext.personality}. Backstory: ${npcContext.backstory}. Write them as a real person with their own agenda.`
        : "";
      const eduContext = situation.educationalTheme
        ? `\nEDUCATIONAL THREAD: Weave in this real knowledge naturally (don't lecture): "${situation.educationalTheme}"`
        : "";
      const relationships = state.npcRelationships ? JSON.parse(state.npcRelationships || '{}') : {};
      const npcRelNote = npcContext && relationships[npcContext.name] !== undefined
        ? `\nPLAYER'S RELATIONSHIP WITH ${npcContext.name.toUpperCase()}: Score ${relationships[npcContext.name]} (${relationships[npcContext.name] > 5 ? "strong ally" : relationships[npcContext.name] > 0 ? "friendly" : relationships[npcContext.name] < -5 ? "enemy" : relationships[npcContext.name] < 0 ? "tense" : "neutral"}). Reference this relationship naturally in how the NPC interacts with the player.`
        : "";

      let scenario;
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are the narrative engine for DarkWave Chronicles — a parallel life simulation where the player is THEMSELVES living in another era. NOT an RPG. No heroes, no villains, no right answers. Just life.

ERA: ${era} — ${eraSetting.worldDescription}
ATMOSPHERE: ${eraSetting.atmosphere}
${npcDetail}${npcRelNote}${eduContext}

PLAYER:
- Level ${state.level} | Wisdom ${state.wisdom} | Courage ${state.courage} | Compassion ${state.compassion} | Cunning ${state.cunning} | Influence ${state.influence}
- ${state.decisionsRecorded} decisions made so far

PHILOSOPHY — READ CAREFULLY:
- This is a MIRROR, not a game. Choices reveal who the player IS, not who they should be.
- There are NO right or wrong answers — only authentic human responses
- Each choice reflects a different WAY OF BEING — pragmatic, compassionate, bold, cautious, cunning, principled
- NEVER judge choices. NEVER hint that one is "better." Present them equally.
- NPCs are REAL PEOPLE with their own goals, not quest-givers. They react based on relationship history.
- The player's choice WILL affect their relationship with any involved NPC

Write a rich, immersive scene. Make the player feel PRESENT. Describe sights, sounds, smells. Then offer exactly 4 choices that each feel like something a real person might actually do.

Return JSON:
{
  "title": "scenario title",
  "description": "2-3 vivid paragraphs — cinematic, personal, immersive",
  "educationalNote": "One fascinating real-world fact the player learns from this situation (optional, only if natural)",
  "choices": [
    { "id": "a", "text": "What you DO (first person, natural)", "hint": "The value or instinct this reflects" },
    { "id": "b", "text": "...", "hint": "..." },
    { "id": "c", "text": "...", "hint": "..." },
    { "id": "d", "text": "...", "hint": "..." }
  ]
}`
            },
            {
              role: "user",
              content: `Situation: "${situation.title}" — ${situation.description}`
            }
          ],
          response_format: { type: "json_object" },
          max_completion_tokens: 1500,
        });

        scenario = JSON.parse(response.choices[0]?.message?.content || '{}');
      } catch {
        scenario = {
          title: situation.title,
          description: situation.description,
          choices: [
            { id: "a", text: "Take decisive action", hint: "Shows courage and determination" },
            { id: "b", text: "Seek more information first", hint: "Shows wisdom and caution" },
            { id: "c", text: "Try to help everyone involved", hint: "Shows compassion and empathy" },
            { id: "d", text: "Find a clever workaround", hint: "Shows cunning and resourcefulness" },
          ],
        };
      }

      res.json({
        scenario: {
          id: situation.id,
          title: scenario.title || situation.title,
          description: scenario.description || situation.description,
          choices: scenario.choices || [],
          educationalNote: scenario.educationalNote || undefined,
          difficulty,
          era,
          shellsReward,
          xpReward,
          npcInvolved: situation.npcInvolved || undefined,
          category: situation.category || undefined,
          isGenerated,
        },
        generated: isGenerated,
      });
    } catch (error: any) {
      console.error("Generate scenario error:", error);
      res.status(500).json({ error: error.message || "Failed to generate scenario" });
    }
  });

  app.post("/api/chronicles/play/decide", isChroniclesAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getPlayUserId(req);
      if (!userId) return res.status(401).json({ error: "Authentication required" });

      const { scenarioId, choiceId, choiceText, era } = req.body;
      if (!scenarioId || !choiceId || !choiceText) {
        return res.status(400).json({ error: "scenarioId, choiceId, and choiceText are required" });
      }

      const [state] = await db.select().from(chroniclesGameState)
        .where(eq(chroniclesGameState.userId, userId))
        .limit(1);

      if (!state) return res.status(404).json({ error: "Game state not found" });

      const quest = SEASON_ZERO_QUESTS.find(q => q.id === scenarioId);
      const difficulty = quest?.difficulty || "medium";
      const baseXp = DIFFICULTY_XP[difficulty] || 250;
      const baseShells = DIFFICULTY_SHELLS[difficulty] || 150;

      let consequences = "";
      let statChanges = { wisdom: 0, courage: 0, compassion: 0, cunning: 0, influence: 0 };
      let npcRelChanges: Record<string, number> = {};
      let xpEarned = baseXp;
      let shellsEarned = baseShells;
      let educationalInsight = "";

      const involvedNpcs = (quest as any)?.relationshipImpact || [];
      const npcInvolved = (quest as any)?.npcInvolved || null;
      const allInvolvedSet = new Set<string>([...(npcInvolved ? [npcInvolved] : []), ...involvedNpcs]);
      const allInvolved = Array.from(allInvolvedSet);
      const npcListStr = allInvolved.length > 0
        ? `NPCs INVOLVED: ${allInvolved.join(", ")}. Your response MUST include relationship changes for each.`
        : "No specific NPCs involved.";

      try {
        const eraSetting = ERA_SETTINGS[era || state.currentEra] || ERA_SETTINGS.modern;
        const currentRels = JSON.parse(state.npcRelationships || '{}');
        const relContext = allInvolved.map(n => `${n}: ${currentRels[n] || 0}`).join(", ");

        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You analyze choices in DarkWave Chronicles — a parallel life simulation. NOT an RPG.

ERA: ${era || state.currentEra} — ${eraSetting.worldDescription}
${npcListStr}
${relContext ? `CURRENT RELATIONSHIP SCORES: ${relContext}` : ""}
${(quest as any)?.educationalTheme ? `EDUCATIONAL CONTEXT: ${(quest as any).educationalTheme}` : ""}

PHILOSOPHY: There are no right or wrong choices. Every choice reveals character. Do NOT praise or punish — simply narrate what happens BECAUSE of the choice. NPC reactions should be realistic — some will agree with the choice, others won't. That's life.

Return JSON:
{
  "consequences": "2-3 vivid sentences of what happens next. Include NPC reactions if involved. Show REAL consequences — actions have ripple effects.",
  "statChanges": { "wisdom": -5 to 5, "courage": -5 to 5, "compassion": -5 to 5, "cunning": -5 to 5, "influence": -5 to 5 },
  "npcRelChanges": { ${allInvolved.map(n => `"${n}": -3 to 3`).join(", ")} },
  "educationalInsight": "One sentence connecting this moment to a real historical/life lesson (make it fascinating, not preachy)",
  "xpEarned": ${baseXp},
  "shellsEarned": ${baseShells}
}`
            },
            {
              role: "user",
              content: `Situation: "${quest?.title || scenarioId}". The player chose: "${choiceText}". Player stats: Wisdom ${state.wisdom}, Courage ${state.courage}, Compassion ${state.compassion}, Cunning ${state.cunning}, Influence ${state.influence}. Level ${state.level}, ${state.decisionsRecorded} decisions so far.`
            }
          ],
          response_format: { type: "json_object" },
          max_completion_tokens: 700,
        });

        const analysis = JSON.parse(response.choices[0]?.message?.content || '{}');
        consequences = analysis.consequences || "Your choice echoes through time...";
        if (analysis.statChanges) {
          statChanges = {
            wisdom: clamp(analysis.statChanges.wisdom || 0, -5, 5),
            courage: clamp(analysis.statChanges.courage || 0, -5, 5),
            compassion: clamp(analysis.statChanges.compassion || 0, -5, 5),
            cunning: clamp(analysis.statChanges.cunning || 0, -5, 5),
            influence: clamp(analysis.statChanges.influence || 0, -5, 5),
          };
        }
        if (analysis.npcRelChanges) {
          npcRelChanges = analysis.npcRelChanges;
        }
        educationalInsight = analysis.educationalInsight || "";
        xpEarned = analysis.xpEarned || baseXp;
        shellsEarned = analysis.shellsEarned || baseShells;
      } catch {
        consequences = "Your decision ripples through the world, its full impact yet to be revealed...";
      }

      const newExperience = state.experience + xpEarned;
      const newShells = state.shellsEarned + shellsEarned;
      const newWisdom = clamp(state.wisdom + statChanges.wisdom, 0, 100);
      const newCourage = clamp(state.courage + statChanges.courage, 0, 100);
      const newCompassion = clamp(state.compassion + statChanges.compassion, 0, 100);
      const newCunning = clamp(state.cunning + statChanges.cunning, 0, 100);
      const newInfluence = clamp(state.influence + statChanges.influence, 0, 100);
      const newDecisions = state.decisionsRecorded + 1;

      const completedSituations = [...(state.completedSituations || [])];
      if (!completedSituations.includes(scenarioId)) {
        completedSituations.push(scenarioId);
      }

      let newLevel = state.level;
      let leveledUp = false;
      while (newExperience >= newLevel * 1000) {
        newLevel++;
        leveledUp = true;
      }

      const currentRels = JSON.parse(state.npcRelationships || '{}');
      for (const [npcName, change] of Object.entries(npcRelChanges)) {
        const delta = clamp(Number(change) || 0, -3, 3);
        currentRels[npcName] = clamp((currentRels[npcName] || 0) + delta, -20, 20);
      }

      let gameLog: any[] = [];
      try { gameLog = JSON.parse(state.gameLog || '[]'); } catch { gameLog = []; }
      const questTitle = quest?.title || SEASON_ZERO_QUESTS.find(q => q.id === scenarioId)?.title || scenarioId;
      gameLog.push({
        type: "decision",
        action: questTitle,
        message: consequences.substring(0, 120),
        title: questTitle,
        description: consequences,
        era: era || state.currentEra,
        timestamp: new Date().toISOString(),
        xpEarned,
        shellsEarned,
        statChanges,
        npcRelChanges: Object.keys(npcRelChanges).length > 0 ? npcRelChanges : undefined,
        educationalInsight: educationalInsight || undefined,
      });
      if (gameLog.length > 50) gameLog = gameLog.slice(-50);

      const now = new Date();
      let newStreak = state.currentStreak;
      let longestStreak = state.longestStreak;
      if (state.lastPlayedAt) {
        const lastPlayed = new Date(state.lastPlayedAt);
        const diffHours = (now.getTime() - lastPlayed.getTime()) / (1000 * 60 * 60);
        if (diffHours >= 20 && diffHours <= 48) {
          newStreak++;
        } else if (diffHours > 48) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }
      if (newStreak > longestStreak) longestStreak = newStreak;

      const [updatedState] = await db.update(chroniclesGameState).set({
        experience: newExperience,
        shellsEarned: newShells,
        wisdom: newWisdom,
        courage: newCourage,
        compassion: newCompassion,
        cunning: newCunning,
        influence: newInfluence,
        decisionsRecorded: newDecisions,
        situationsCompleted: completedSituations.length,
        completedSituations,
        level: newLevel,
        gameLog: JSON.stringify(gameLog),
        npcRelationships: JSON.stringify(currentRels),
        currentStreak: newStreak,
        longestStreak,
        lastPlayedAt: now,
        currentEra: era || state.currentEra,
        updatedAt: now,
      }).where(eq(chroniclesGameState.userId, userId)).returning();

      const existingAchievements = new Set(state.achievements || []);
      const newAchievements: string[] = [];

      const checkAchievement = (id: string, condition: boolean) => {
        if (!existingAchievements.has(id) && condition) newAchievements.push(id);
      };

      checkAchievement("first_decision", newDecisions >= 1);
      checkAchievement("level_5", newLevel >= 5);
      checkAchievement("level_10", newLevel >= 10);

      const completedEras = new Set(completedSituations.map(s => {
        const q = SEASON_ZERO_QUESTS.find(quest => quest.id === s);
        return q?.era;
      }).filter(Boolean));
      checkAchievement("explorer", completedEras.size >= 3);

      checkAchievement("social_butterfly", (updatedState?.npcsSpokenTo || []).length >= 5);
      checkAchievement("faction_member", (updatedState?.factionsJoined || []).length >= 1);
      checkAchievement("streak_3", newStreak >= 3);
      checkAchievement("streak_7", newStreak >= 7);
      checkAchievement("ten_decisions", newDecisions >= 10);
      checkAchievement("hundred_shells", newShells >= 100);

      if (newAchievements.length > 0) {
        const allAchievements = [...(state.achievements || []), ...newAchievements];
        await db.update(chroniclesGameState).set({
          achievements: allAchievements,
        }).where(eq(chroniclesGameState.userId, userId));
      }

      res.json({
        success: true,
        consequences,
        statChanges,
        npcRelChanges: Object.keys(npcRelChanges).length > 0 ? npcRelChanges : undefined,
        educationalInsight: educationalInsight || undefined,
        xpEarned,
        shellsEarned,
        newLevel: leveledUp ? newLevel : undefined,
        newAchievements,
        updatedState,
      });
    } catch (error: any) {
      console.error("Process decision error:", error);
      res.status(500).json({ error: error.message || "Failed to process decision" });
    }
  });

  app.get("/api/chronicles/play/achievements", isChroniclesAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getPlayUserId(req);
      if (!userId) return res.status(401).json({ error: "Authentication required" });

      const [state] = await db.select().from(chroniclesGameState)
        .where(eq(chroniclesGameState.userId, userId))
        .limit(1);

      const earnedSet = new Set(state?.achievements || []);

      const achievements = ALL_ACHIEVEMENTS.map(a => ({
        ...a,
        earned: earnedSet.has(a.id),
        earnedAt: earnedSet.has(a.id) ? state?.updatedAt?.toISOString() : undefined,
      }));

      res.json({ achievements });
    } catch (error: any) {
      console.error("Get achievements error:", error);
      res.status(500).json({ error: error.message || "Failed to get achievements" });
    }
  });

  app.get("/api/chronicles/play/leaderboard", async (_req: Request, res: Response) => {
    try {
      const players = await db.select({
        name: chroniclesGameState.name,
        level: chroniclesGameState.level,
        experience: chroniclesGameState.experience,
        currentEra: chroniclesGameState.currentEra,
        situationsCompleted: chroniclesGameState.situationsCompleted,
      }).from(chroniclesGameState)
        .orderBy(desc(chroniclesGameState.level), desc(chroniclesGameState.experience))
        .limit(20);

      const leaderboard = players.map((p, i) => ({
        rank: i + 1,
        name: p.name.length > 3 ? p.name.substring(0, 3) + "..." : p.name,
        level: p.level,
        experience: p.experience,
        era: p.currentEra,
        situationsCompleted: p.situationsCompleted,
      }));

      res.json({ leaderboard });
    } catch (error: any) {
      console.error("Get leaderboard error:", error);
      res.status(500).json({ error: error.message || "Failed to get leaderboard" });
    }
  });

  app.post("/api/chronicles/play/npc-chat", isChroniclesAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getPlayUserId(req);
      if (!userId) return res.status(401).json({ error: "Authentication required" });

      const { npcId, message, era } = req.body;
      if (!npcId || !message) {
        return res.status(400).json({ error: "npcId and message are required" });
      }

      const npc = STARTER_NPCS.find(n => n.name === npcId || n.factionId === npcId);
      if (!npc) {
        return res.status(404).json({ error: "NPC not found" });
      }

      const [state] = await db.select().from(chroniclesGameState)
        .where(eq(chroniclesGameState.userId, userId))
        .limit(1);

      if (!state) return res.status(404).json({ error: "Game state not found" });

      const isFirstChat = !(state.npcsSpokenTo || []).includes(npcId);

      let personality: any = {};
      try { personality = JSON.parse(npc.personality); } catch {}

      const eraSetting = ERA_SETTINGS[era || npc.era] || ERA_SETTINGS.modern;

      let npcResponse = "";
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are ${npc.name}, ${npc.title}, in the ${era || npc.era} era of DarkWave Chronicles.

PERSONALITY: ${personality.traits?.join(", ") || "complex"}
GOALS: ${personality.goals?.join(", ") || "mysterious"}
FEARS: ${personality.fears?.join(", ") || "unknown"}
SPEAKING STYLE: ${personality.speakingStyle || "natural"}
BACKSTORY: ${npc.backstory}

WORLD: ${eraSetting.worldDescription}
ATMOSPHERE: ${eraSetting.atmosphere}

Stay completely in character. Respond naturally as ${npc.name} would. Keep responses 2-4 sentences.`
            },
            { role: "user", content: message }
          ],
          max_completion_tokens: 300,
        });
        npcResponse = response.choices[0]?.message?.content || "...";
      } catch {
        npcResponse = `*${npc.name} regards you thoughtfully* That's an interesting thought. Perhaps we should discuss this further another time.`;
      }

      let xpEarned = 0;
      if (isFirstChat) {
        xpEarned = 10;
        const updatedNpcs = [...(state.npcsSpokenTo || []), npcId];
        await db.update(chroniclesGameState).set({
          npcsSpokenTo: updatedNpcs,
          experience: state.experience + 10,
          updatedAt: new Date(),
        }).where(eq(chroniclesGameState.userId, userId));
      }

      res.json({
        response: npcResponse,
        npcName: npc.name,
        npcTitle: npc.title,
        xpEarned,
      });
    } catch (error: any) {
      console.error("NPC chat error:", error);
      res.status(500).json({ error: error.message || "Failed to chat with NPC" });
    }
  });

  app.get("/api/chronicles/city/plots", isChroniclesAuthenticated, async (req: any, res: Response) => {
    try {
      const era = (req.query.era as string) || "modern";
      const userId = getPlayUserId(req);

      const plots = await db.select().from(landPlots)
        .where(eq(landPlots.zoneId, `city_${era}`));

      if (plots.length === 0) {
        const defaultPlots = generateDefaultCityPlots(era);
        const inserted = await db.insert(landPlots).values(defaultPlots).returning();
        return res.json({ plots: inserted.map(p => formatPlot(p, userId)) });
      }

      res.json({ plots: plots.map(p => formatPlot(p, userId)) });
    } catch (error: any) {
      console.error("Get city plots error:", error);
      res.status(500).json({ error: error.message || "Failed to get city plots" });
    }
  });

  app.post("/api/chronicles/city/build", isChroniclesAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getPlayUserId(req);
      if (!userId) return res.status(401).json({ error: "Authentication required" });

      const { plotId, buildingId, era } = req.body;
      if (!plotId || !buildingId || !era) {
        return res.status(400).json({ error: "plotId, buildingId, and era are required" });
      }

      const [plot] = await db.select().from(landPlots).where(eq(landPlots.id, plotId)).limit(1);
      if (!plot) return res.status(404).json({ error: "Plot not found" });
      if (plot.ownerId && plot.ownerId !== userId) return res.status(403).json({ error: "This plot is already owned by someone else" });
      if (plot.buildingData) return res.status(400).json({ error: "This plot already has a building" });

      const catalog: Record<string, any[]> = {
        modern: [
          { id: "coffee_shop", name: "Coffee Shop", emoji: "☕", type: "shop", tier: "free", cost: 0 },
          { id: "tech_startup", name: "Tech Startup", emoji: "💻", type: "shop", tier: "free", cost: 0 },
          { id: "boutique", name: "Boutique", emoji: "👗", type: "shop", tier: "premium", cost: 500 },
          { id: "restaurant", name: "Restaurant", emoji: "🍽️", type: "shop", tier: "premium", cost: 750 },
          { id: "art_gallery", name: "Art Gallery", emoji: "🖼️", type: "shop", tier: "premium", cost: 600 },
          { id: "coworking", name: "Co-Working Space", emoji: "🏢", type: "office", tier: "premium", cost: 800 },
          { id: "penthouse", name: "Penthouse Suite", emoji: "🏙️", type: "residential", tier: "elite", cost: 2000 },
          { id: "nightclub", name: "Nightclub", emoji: "🎵", type: "entertainment", tier: "elite", cost: 1500 },
        ],
        medieval: [
          { id: "market_stall", name: "Market Stall", emoji: "🏪", type: "shop", tier: "free", cost: 0 },
          { id: "cottage", name: "Cottage", emoji: "🏠", type: "residential", tier: "free", cost: 0 },
          { id: "tavern", name: "Tavern", emoji: "🍺", type: "shop", tier: "premium", cost: 500 },
          { id: "blacksmith", name: "Blacksmith", emoji: "⚒️", type: "shop", tier: "premium", cost: 600 },
          { id: "apothecary", name: "Apothecary", emoji: "⚗️", type: "shop", tier: "premium", cost: 450 },
          { id: "guild_hall", name: "Guild Hall", emoji: "🏛️", type: "office", tier: "premium", cost: 900 },
          { id: "castle_tower", name: "Castle Tower", emoji: "🏰", type: "monument", tier: "elite", cost: 2500 },
          { id: "cathedral", name: "Cathedral", emoji: "⛪", type: "monument", tier: "elite", cost: 2000 },
        ],
        wildwest: [
          { id: "general_store", name: "General Store", emoji: "🏬", type: "shop", tier: "free", cost: 0 },
          { id: "homestead", name: "Homestead", emoji: "🏚️", type: "residential", tier: "free", cost: 0 },
          { id: "saloon", name: "Saloon", emoji: "🥃", type: "shop", tier: "premium", cost: 500 },
          { id: "sheriffs_office", name: "Sheriff's Office", emoji: "⭐", type: "office", tier: "premium", cost: 600 },
          { id: "assay_office", name: "Assay Office", emoji: "⚖️", type: "shop", tier: "premium", cost: 450 },
          { id: "telegraph", name: "Telegraph Office", emoji: "📡", type: "office", tier: "premium", cost: 700 },
          { id: "bank", name: "Frontier Bank", emoji: "🏦", type: "office", tier: "elite", cost: 2000 },
          { id: "ranch", name: "Grand Ranch", emoji: "🐄", type: "residential", tier: "elite", cost: 1800 },
        ],
      };

      const building = (catalog[era] || []).find((b: any) => b.id === buildingId);
      if (!building) return res.status(400).json({ error: "Invalid building type" });

      const isPremium = plot.plotSize === "premium";
      if (!isPremium && building.tier !== "free") {
        return res.status(400).json({ error: "Non-premium plots only allow free buildings" });
      }

      if (building.cost > 0) {
        const [state] = await db.select().from(chroniclesGameState)
          .where(eq(chroniclesGameState.userId, userId)).limit(1);
        if (!state || state.shellsEarned < building.cost) {
          return res.status(400).json({ error: `Not enough shells. Need ${building.cost}, have ${state?.shellsEarned || 0}` });
        }
        await db.update(chroniclesGameState).set({
          shellsEarned: state.shellsEarned - building.cost,
          updatedAt: new Date(),
        }).where(eq(chroniclesGameState.userId, userId));
      }

      const [updated] = await db.update(landPlots).set({
        ownerId: userId,
        ownerType: "player",
        buildingData: JSON.stringify({ id: building.id, name: building.name, emoji: building.emoji, type: building.type, tier: building.tier }),
        isForSale: false,
        purchasedAt: new Date(),
      }).where(eq(landPlots.id, plotId)).returning();

      res.json({
        success: true,
        plot: formatPlot(updated, userId),
        building,
        shellsSpent: building.cost,
      });
    } catch (error: any) {
      console.error("Build error:", error);
      res.status(500).json({ error: error.message || "Failed to build" });
    }
  });

  app.get("/api/chronicles/city/leaderboard", async (_req: Request, res: Response) => {
    try {
      const allPlots = await db.select().from(landPlots);
      const ownerCounts: Record<string, { count: number; ownerId: string }> = {};
      for (const plot of allPlots) {
        if (plot.ownerId && plot.ownerType === "player" && plot.buildingData) {
          ownerCounts[plot.ownerId] = ownerCounts[plot.ownerId] || { count: 0, ownerId: plot.ownerId };
          ownerCounts[plot.ownerId].count++;
        }
      }
      const sorted = Object.values(ownerCounts).sort((a, b) => b.count - a.count).slice(0, 10);

      const leaderboard = [];
      for (const entry of sorted) {
        const [state] = await db.select({ name: chroniclesGameState.name, currentEra: chroniclesGameState.currentEra })
          .from(chroniclesGameState).where(eq(chroniclesGameState.userId, entry.ownerId)).limit(1);
        leaderboard.push({
          name: state?.name || "Builder",
          buildings: entry.count,
          era: state?.currentEra || "modern",
        });
      }

      res.json({ leaderboard });
    } catch (error: any) {
      console.error("City leaderboard error:", error);
      res.status(500).json({ error: error.message || "Failed to get leaderboard" });
    }
  });

  app.get("/api/chronicles/play/progress", isChroniclesAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getPlayUserId(req);
      if (!userId) return res.status(401).json({ error: "Authentication required" });

      const [state] = await db.select().from(chroniclesGameState)
        .where(eq(chroniclesGameState.userId, userId)).limit(1);

      const completedSet = new Set<string>(state?.completedSituations || []);
      const totalQuests = SEASON_ZERO_QUESTS.length;
      const completedQuests = SEASON_ZERO_QUESTS.filter(q => completedSet.has(q.id)).length;

      const playerPlots = state ? await db.select().from(landPlots)
        .where(eq(landPlots.ownerId, userId)) : [];
      const cityBuildsCount = playerPlots.filter(p => p.buildingData).length;

      const hasOnboarded = !!state;
      const hasDecisions = (state?.decisionsRecorded || 0) > 0;
      const hasMultipleEras = (() => {
        const eras = new Set<string>();
        for (const id of (state?.completedSituations || [])) {
          const q = SEASON_ZERO_QUESTS.find(quest => quest.id === id);
          if (q) eras.add(q.era);
        }
        return eras.size >= 2;
      })();
      const hasCityBuild = cityBuildsCount > 0;
      const hasNpcRelationships = (() => {
        try {
          const rels = JSON.parse(state?.npcRelationships || '{}');
          return Object.keys(rels).length > 0;
        } catch { return false; }
      })();

      const chapters: Record<string, "completed" | "current" | "locked"> = {
        awakening: hasOnboarded ? "completed" : "current",
        foundation: hasOnboarded ? (cityBuildsCount > 0 ? "completed" : "current") : "locked",
        play: hasOnboarded ? (hasDecisions ? (completedQuests >= totalQuests ? "completed" : "current") : "current") : "locked",
        world: hasOnboarded ? (hasNpcRelationships ? "completed" : "current") : "locked",
        city: hasOnboarded ? (hasCityBuild ? "completed" : "current") : "locked",
        connections: hasNpcRelationships && hasMultipleEras ? "current" : "locked",
        exploration: (state?.level || 1) >= 3 ? "current" : "locked",
        legacy: (state?.level || 1) >= 10 ? "current" : "locked",
      };

      res.json({
        chapters,
        stats: {
          totalQuests,
          completedQuests,
          cityBuildsCount,
          level: state?.level || 1,
          decisionsRecorded: state?.decisionsRecorded || 0,
          npcsSpokenTo: (state?.npcsSpokenTo || []).length,
          factionsJoined: (state?.factionsJoined || []).length,
        },
      });
    } catch (error: any) {
      console.error("Get progress error:", error);
      res.status(500).json({ error: error.message || "Failed to get progress" });
    }
  });
}

function generateDefaultCityPlots(era: string) {
  const plots = [];
  const zoneId = `city_${era}`;

  for (let i = 0; i < 6; i++) {
    plots.push({
      zoneId,
      plotX: i,
      plotY: 0,
      plotSize: "premium" as const,
      basePrice: 1000,
      currentPrice: 1000,
      isForSale: true,
    });
  }

  for (let i = 0; i < 12; i++) {
    plots.push({
      zoneId,
      plotX: i,
      plotY: i % 4 + 1,
      plotSize: "standard" as const,
      basePrice: 0,
      currentPrice: 0,
      isForSale: true,
    });
  }

  const npcBuildings: Record<string, Array<{ idx: number; building: any; ownerName: string }>> = {
    modern: [
      { idx: 0, building: { id: "coffee_shop", name: "Coffee Shop", emoji: "☕", type: "shop", tier: "premium" }, ownerName: "City NPC" },
      { idx: 2, building: { id: "tech_startup", name: "Tech Startup", emoji: "💻", type: "shop", tier: "premium" }, ownerName: "City NPC" },
    ],
    medieval: [
      { idx: 1, building: { id: "tavern", name: "Tavern", emoji: "🍺", type: "shop", tier: "premium" }, ownerName: "Town NPC" },
      { idx: 3, building: { id: "blacksmith", name: "Blacksmith", emoji: "⚒️", type: "shop", tier: "premium" }, ownerName: "Town NPC" },
    ],
    wildwest: [
      { idx: 0, building: { id: "saloon", name: "Saloon", emoji: "🥃", type: "shop", tier: "premium" }, ownerName: "Town NPC" },
      { idx: 4, building: { id: "sheriffs_office", name: "Sheriff's Office", emoji: "⭐", type: "office", tier: "premium" }, ownerName: "Town NPC" },
    ],
  };

  for (const npc of (npcBuildings[era] || [])) {
    if (plots[npc.idx]) {
      plots[npc.idx] = {
        ...plots[npc.idx],
        ownerId: "npc",
        ownerType: "npc" as any,
        buildingData: JSON.stringify(npc.building),
        isForSale: false,
      } as any;
    }
  }

  return plots;
}

function formatPlot(plot: any, userId: string | null) {
  const building = plot.buildingData ? (() => {
    try { return JSON.parse(plot.buildingData); } catch { return null; }
  })() : null;

  return {
    id: plot.id,
    x: plot.plotX,
    z: plot.plotY,
    type: plot.plotSize === "premium" ? "town_square" : "commercial",
    owner: plot.ownerId || undefined,
    ownerName: plot.ownerType === "npc" ? "Town NPC" : (plot.ownerId === userId ? "You" : (plot.ownerId ? "Another Player" : undefined)),
    isOwner: plot.ownerId === userId,
    building,
    isPremium: plot.plotSize === "premium",
    price: plot.currentPrice || 0,
  };
}

export function registerChroniclesChatRoutes(app: Express) {

  app.post("/api/chronicles/chat/link", async (req: any, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Authorization required" });
      }
      const token = authHeader.split(" ")[1];
      let decoded: any;
      try {
        const jwt = await import("jsonwebtoken");
        decoded = jwt.default.verify(token, process.env.CHRONICLES_JWT_SECRET || "chronicles-secret-key-2024");
      } catch {
        return res.status(401).json({ error: "Invalid token" });
      }

      const accountId = decoded.accountId;
      const [account] = await db.select().from(chronicleAccounts)
        .where(eq(chronicleAccounts.id, accountId)).limit(1);
      if (!account) return res.status(404).json({ error: "Chronicles account not found" });

      const chatUsername = `chr_${account.username}`.toLowerCase().replace(/[^a-z0-9_]/g, '');
      const [existing] = await db.select().from(chatUsers)
        .where(eq(chatUsers.username, chatUsername)).limit(1);

      if (existing) {
        const chatToken = generateToken(existing.id, existing.trustLayerId || '');
        return res.json({
          success: true,
          chatToken,
          chatUser: { id: existing.id, username: existing.username, displayName: existing.displayName, avatarColor: existing.avatarColor },
        });
      }

      const trustLayerId = generateTrustLayerId();
      const passwordHash = await hashPassword(`chronicles_${accountId}_${Date.now()}`);
      const avatarColors = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];
      const avatarColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

      const [state] = await db.select().from(chroniclesGameState)
        .where(eq(chroniclesGameState.userId, accountId)).limit(1);
      const displayName = state?.name || account.username;

      const [newChatUser] = await db.insert(chatUsers).values({
        username: chatUsername,
        email: `${chatUsername}@chronicles.darkwave.io`,
        passwordHash,
        displayName,
        avatarColor,
        role: "member",
        trustLayerId,
      }).returning();

      const chatToken = generateToken(newChatUser.id, trustLayerId);

      res.json({
        success: true,
        chatToken,
        chatUser: { id: newChatUser.id, username: newChatUser.username, displayName: newChatUser.displayName, avatarColor: newChatUser.avatarColor },
        isNew: true,
      });
    } catch (error: any) {
      console.error("Chronicles chat link error:", error);
      res.status(500).json({ error: error.message || "Failed to link chat" });
    }
  });

  app.get("/api/chronicles/chat/channels", async (_req: Request, res: Response) => {
    try {
      const channels = await db.select().from(chatChannels)
        .where(eq(chatChannels.category, "chronicles"));

      const eraMap: Record<string, string> = {
        "chronicles-modern": "modern",
        "chronicles-medieval": "medieval",
        "chronicles-wildwest": "wildwest",
        "chronicles-general": "general",
        "chronicles-voice": "voice",
      };

      const formatted = channels.map(ch => ({
        id: ch.id,
        name: ch.name,
        description: ch.description,
        era: eraMap[ch.name] || "general",
        isVoice: ch.name === "chronicles-voice",
      }));

      res.json({ success: true, channels: formatted });
    } catch (error: any) {
      console.error("Get chronicles channels error:", error);
      res.status(500).json({ error: error.message || "Failed to get channels" });
    }
  });

  app.get("/api/chronicles/chat/messages/:channelId", async (req: Request, res: Response) => {
    try {
      const { channelId } = req.params;
      const limit = Math.min(50, Number(req.query.limit ?? 30));

      const msgs = await db.select({
        id: chatMessages.id,
        channelId: chatMessages.channelId,
        content: chatMessages.content,
        createdAt: chatMessages.createdAt,
        username: chatUsers.username,
        displayName: chatUsers.displayName,
        avatarColor: chatUsers.avatarColor,
      })
        .from(chatMessages)
        .innerJoin(chatUsers, eq(chatMessages.userId, chatUsers.id))
        .where(eq(chatMessages.channelId, channelId))
        .orderBy(desc(chatMessages.createdAt))
        .limit(limit);

      res.json({ success: true, messages: msgs.reverse() });
    } catch (error: any) {
      console.error("Get chronicles messages error:", error);
      res.status(500).json({ error: error.message || "Failed to get messages" });
    }
  });

  app.post("/api/chronicles/chat/messages/:channelId", async (req: any, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ error: "Auth required" });

      const { channelId } = req.params;
      const { content, chatUserId } = req.body;

      if (!content || !chatUserId) {
        return res.status(400).json({ error: "Content and chatUserId are required" });
      }

      const [user] = await db.select().from(chatUsers)
        .where(eq(chatUsers.id, chatUserId)).limit(1);
      if (!user) return res.status(404).json({ error: "Chat user not found" });

      const [msg] = await db.insert(chatMessages).values({
        channelId,
        userId: chatUserId,
        content,
      }).returning();

      res.json({
        success: true,
        message: {
          id: msg.id,
          channelId: msg.channelId,
          content: msg.content,
          createdAt: msg.createdAt,
          username: user.username,
          displayName: user.displayName,
          avatarColor: user.avatarColor,
        },
      });
    } catch (error: any) {
      console.error("Send chronicles message error:", error);
      res.status(500).json({ error: error.message || "Failed to send message" });
    }
  });

  app.get("/api/chronicles/voice/status", async (req: any, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Authorization required" });
      }
      const token = authHeader.split(" ")[1];
      let decoded: any;
      try {
        const jwt = await import("jsonwebtoken");
        decoded = jwt.default.verify(token, process.env.CHRONICLES_JWT_SECRET || "chronicles-secret-key-2024");
      } catch {
        return res.status(401).json({ error: "Invalid token" });
      }

      const accountId = decoded.accountId;

      const samples = await db.select().from(voiceSamples)
        .where(eq(voiceSamples.userId, accountId));

      const readySamples = samples.filter(s => s.cloneStatus === "ready");
      const processingSamples = samples.filter(s => s.cloneStatus === "processing");
      const pendingSamples = samples.filter(s => s.cloneStatus === "pending");

      const [credits] = await db.select().from(userCredits)
        .where(eq(userCredits.userId, accountId)).limit(1);

      res.json({
        success: true,
        voice: {
          totalSamples: samples.length,
          readyCount: readySamples.length,
          processingCount: processingSamples.length,
          pendingCount: pendingSamples.length,
          isReady: readySamples.length > 0,
          activeCloneId: readySamples[0]?.voiceCloneId || null,
          provider: readySamples[0]?.voiceCloneProvider || null,
        },
        credits: {
          balance: credits?.creditBalance || 0,
          voiceCloneCost: 50,
          voiceMessageCost: 5,
        },
      });
    } catch (error: any) {
      console.error("Voice status error:", error);
      res.status(500).json({ error: error.message || "Failed to get voice status" });
    }
  });

  app.post("/api/chronicles/voice/train", async (req: any, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Authorization required" });
      }
      const token = authHeader.split(" ")[1];
      let decoded: any;
      try {
        const jwt = await import("jsonwebtoken");
        decoded = jwt.default.verify(token, process.env.CHRONICLES_JWT_SECRET || "chronicles-secret-key-2024");
      } catch {
        return res.status(401).json({ error: "Invalid token" });
      }

      const accountId = decoded.accountId;
      const { transcriptText } = req.body;

      const [credits] = await db.select().from(userCredits)
        .where(eq(userCredits.userId, accountId)).limit(1);

      const cloneCost = 50;
      if (!credits || credits.creditBalance < cloneCost) {
        return res.status(400).json({
          error: `Not enough credits. Need ${cloneCost}, have ${credits?.creditBalance || 0}`,
          creditsNeeded: cloneCost,
          currentBalance: credits?.creditBalance || 0,
        });
      }

      const [sample] = await db.insert(voiceSamples).values({
        userId: accountId,
        transcriptText: transcriptText || "Voice training sample",
        cloneStatus: "pending",
      }).returning();

      await db.update(userCredits).set({
        creditBalance: credits.creditBalance - cloneCost,
        lifetimeCreditsSpent: credits.lifetimeCreditsSpent + cloneCost,
        updatedAt: new Date(),
      }).where(eq(userCredits.userId, accountId));

      await db.insert(creditTransactions).values({
        userId: accountId,
        type: "usage",
        amount: -cloneCost,
        balanceAfter: credits.creditBalance - cloneCost,
        description: "Voice clone training initiated",
        category: "voice_clone",
      });

      res.json({
        success: true,
        sample: {
          id: sample.id,
          status: sample.cloneStatus,
          creditsSpent: cloneCost,
        },
      });
    } catch (error: any) {
      console.error("Voice train error:", error);
      res.status(500).json({ error: error.message || "Failed to start voice training" });
    }
  });

  const STARTER_CITIES = [
    { id: "nashville", name: "Nashville", state: "TN", desc: "Music City — where creativity meets Southern hospitality", zone: "Downtown Nashville" },
    { id: "austin", name: "Austin", state: "TX", desc: "Live Music Capital — keep it weird, keep it real", zone: "Downtown Austin" },
    { id: "denver", name: "Denver", state: "CO", desc: "Mile High City — where the mountains meet ambition", zone: "LoDo District" },
    { id: "portland", name: "Portland", state: "OR", desc: "Rose City — sustainability meets innovation", zone: "Pearl District" },
    { id: "atlanta", name: "Atlanta", state: "GA", desc: "The A — culture, hip-hop, and Southern charm", zone: "Midtown Atlanta" },
    { id: "chicago", name: "Chicago", state: "IL", desc: "The Windy City — deep dish dreams and lakefront living", zone: "River North" },
    { id: "seattle", name: "Seattle", state: "WA", desc: "Emerald City — tech, coffee, and Pacific Northwest vibes", zone: "Capitol Hill" },
    { id: "miami", name: "Miami", state: "FL", desc: "Magic City — art deco, ocean breeze, Latin fusion", zone: "Wynwood" },
    { id: "new_york", name: "New York", state: "NY", desc: "The Big Apple — if you can make it here...", zone: "Brooklyn Heights" },
    { id: "los_angeles", name: "Los Angeles", state: "CA", desc: "City of Angels — dreams, sun, and endless possibility", zone: "Silver Lake" },
    { id: "new_orleans", name: "New Orleans", state: "LA", desc: "The Big Easy — jazz, soul food, and deep history", zone: "French Quarter" },
    { id: "philadelphia", name: "Philadelphia", state: "PA", desc: "City of Brotherly Love — where it all began", zone: "Old City" },
    { id: "san_francisco", name: "San Francisco", state: "CA", desc: "The Golden City — innovation on the bay", zone: "Mission District" },
    { id: "detroit", name: "Detroit", state: "MI", desc: "Motor City — resilience, rebirth, and Motown", zone: "Midtown Detroit" },
    { id: "phoenix", name: "Phoenix", state: "AZ", desc: "Valley of the Sun — desert dreams and desert storms", zone: "Roosevelt Row" },
  ];

  const STARTER_ITEMS = [
    { id: "phone", name: "Smartphone", emoji: "📱", desc: "Your connection to the world", category: "essential" },
    { id: "keys", name: "House Keys", emoji: "🔑", desc: "Keys to your new starter home", category: "essential" },
    { id: "wallet", name: "Digital Wallet", emoji: "💳", desc: "500 Echoes loaded and ready", category: "essential" },
    { id: "backpack", name: "Backpack", emoji: "🎒", desc: "For carrying supplies", category: "gear" },
    { id: "journal", name: "Chronicle Journal", emoji: "📓", desc: "Records your decisions and legacy", category: "special" },
    { id: "compass", name: "Portal Compass", emoji: "🧭", desc: "Points toward era portals when they unlock", category: "special" },
  ];

  app.get("/api/chronicles/portal-entry/status", isChroniclesAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getPlayUserId(req);
      if (!userId) return res.status(401).json({ error: "Auth required" });

      let [state] = await db.select().from(chroniclesGameState)
        .where(eq(chroniclesGameState.userId, userId)).limit(1);

      if (!state) {
        const [created] = await db.insert(chroniclesGameState).values({
          userId,
          name: req.chroniclesAccount?.username || "Traveler",
        }).returning();
        state = created;
      }

      res.json({
        portalCompleted: state.portalCompleted,
        homeCity: state.homeCity,
        echoBalance: state.echoBalance,
        level: state.level,
        cities: STARTER_CITIES,
      });
    } catch (error: any) {
      console.error("Portal status error:", error);
      res.status(500).json({ error: "Failed to get portal status" });
    }
  });

  app.post("/api/chronicles/portal-entry/enter", isChroniclesAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getPlayUserId(req);
      if (!userId) return res.status(401).json({ error: "Auth required" });
      const { cityId } = req.body;

      const city = STARTER_CITIES.find(c => c.id === cityId);
      if (!city) return res.status(400).json({ error: "Invalid city" });

      let [state] = await db.select().from(chroniclesGameState)
        .where(eq(chroniclesGameState.userId, userId)).limit(1);

      if (!state) {
        const [created] = await db.insert(chroniclesGameState).values({
          userId,
          name: req.chroniclesAccount?.username || "Traveler",
        }).returning();
        state = created;
      }

      if (state.portalCompleted) {
        return res.json({ alreadyCompleted: true, homeCity: state.homeCity, echoBalance: state.echoBalance });
      }

      const starterInventory = JSON.stringify(STARTER_ITEMS);
      const now = new Date();
      const arrivalLog = JSON.stringify([{
        title: "Stepped Through the Portal",
        description: `You arrived in ${city.name}, ${city.state}. A new life begins in the ${city.zone}.`,
        xpEarned: 100,
        shellsEarned: 0,
        timestamp: now.toISOString(),
      }, {
        title: "Received Starter Kit",
        description: "Portal Compass, Chronicle Journal, Backpack, and 500 Echoes",
        xpEarned: 0,
        shellsEarned: 0,
        timestamp: now.toISOString(),
      }]);

      const [updated] = await db.update(chroniclesGameState)
        .set({
          portalCompleted: true,
          homeCity: cityId,
          echoBalance: 500,
          inventory: starterInventory,
          experience: (state.experience || 0) + 100,
          lastOfflineCheck: now,
          lastPlayedAt: now,
          gameLog: arrivalLog,
          updatedAt: now,
        })
        .where(eq(chroniclesGameState.userId, userId))
        .returning();

      const playerName = req.chroniclesAccount?.firstName || req.chroniclesAccount?.username || "Traveler";

      res.json({
        success: true,
        city,
        playerName,
        echoBalance: 500,
        inventory: STARTER_ITEMS,
        xpEarned: 100,
        cinematic: `The portal light fades behind you. You blink against the sudden warmth of a ${city.state === "FL" || city.state === "TX" || city.state === "AZ" ? "blazing" : "gentle"} afternoon sun. The sounds of ${city.name} wash over you — ${
          city.id === "nashville" ? "distant guitar strings drifting from Broadway, the hum of traffic on 2nd Avenue" :
          city.id === "austin" ? "live music bleeding from Sixth Street, the click of food truck windows opening" :
          city.id === "new_york" ? "taxi horns blaring, the rumble of the subway beneath your feet, a thousand conversations" :
          city.id === "los_angeles" ? "palm trees rustling in the breeze, the distant roar of the 405" :
          city.id === "chicago" ? "the L train rattling overhead, wind off the lake carrying the scent of deep dish" :
          city.id === "miami" ? "reggaeton pulsing from a passing car, ocean salt on the breeze" :
          city.id === "seattle" ? "rain on the pavement, espresso machines hissing, ferry horns in the distance" :
          city.id === "denver" ? "the crisp mountain air, skateboards on concrete, craft beer conversations" :
          city.id === "portland" ? "bicycle bells, the aroma of artisan coffee, street musicians finding their groove" :
          city.id === "atlanta" ? "trap beats from passing cars, cicadas in the peach trees, construction cranes turning" :
          city.id === "new_orleans" ? "brass bands echoing through the Quarter, the sweet smell of beignets and chicory coffee" :
          city.id === "philadelphia" ? "cheesesteaks sizzling, church bells ringing, the echo of history in cobblestone streets" :
          city.id === "san_francisco" ? "cable car bells clanging, fog rolling through the Golden Gate, tech chatter in every cafe" :
          city.id === "detroit" ? "Motown rhythms from an open window, the hum of electric vehicles, the pulse of rebirth" :
          "the city alive around you, full of possibility"
        }. You check your pocket — a phone, house keys to a place in the ${city.zone}, and a digital wallet showing 500 Echoes. Your new life starts now.`,
      });
    } catch (error: any) {
      console.error("Portal entry error:", error);
      res.status(500).json({ error: error.message || "Failed to enter portal" });
    }
  });

  app.get("/api/chronicles/world/offline-summary", isChroniclesAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getPlayUserId(req);
      if (!userId) return res.status(401).json({ error: "Auth required" });

      const [state] = await db.select().from(chroniclesGameState)
        .where(eq(chroniclesGameState.userId, userId)).limit(1);

      if (!state || !state.lastOfflineCheck) {
        return res.json({ events: [], timePassed: 0, summary: null });
      }

      const lastCheck = new Date(state.lastOfflineCheck);
      const now = new Date();
      const hoursOffline = Math.floor((now.getTime() - lastCheck.getTime()) / (1000 * 60 * 60));

      if (hoursOffline < 1) {
        return res.json({ events: [], timePassed: 0, summary: null });
      }

      const pendingEvents: any[] = [];
      const city = STARTER_CITIES.find(c => c.id === state.homeCity) || STARTER_CITIES[0];

      if (hoursOffline >= 4) {
        pendingEvents.push({
          id: `offline_mail_${Date.now()}`,
          type: "mail",
          title: "You have mail",
          description: `While you were away, a letter arrived at your place in ${city.zone}. Looks like a community notice about upcoming changes in the neighborhood.`,
          echoReward: 5,
          timestamp: now.toISOString(),
        });
      }

      if (hoursOffline >= 8) {
        pendingEvents.push({
          id: `offline_neighbor_${Date.now()}`,
          type: "neighbor",
          title: "Neighbor stopped by",
          description: `Your neighbor knocked while you were out. They left a note: "Wanted to introduce myself. Hope to catch you around!"`,
          echoReward: 10,
          timestamp: now.toISOString(),
        });
      }

      if (hoursOffline >= 12) {
        pendingEvents.push({
          id: `offline_opportunity_${Date.now()}`,
          type: "opportunity",
          title: "Local opportunity",
          description: `A flyer was left on your door about a community project looking for volunteers in ${city.name}. Could be a way to meet people and build reputation.`,
          echoReward: 15,
          timestamp: now.toISOString(),
        });
      }

      if (hoursOffline >= 24) {
        pendingEvents.push({
          id: `offline_event_${Date.now()}`,
          type: "city_event",
          title: `${city.name} City Event`,
          description: `A ${["block party", "street festival", "community market", "neighborhood cleanup", "local concert"][Math.floor(Math.random() * 5)]} happened in ${city.zone} while you were away. Word is it was quite the scene.`,
          echoReward: 25,
          timestamp: now.toISOString(),
        });
      }

      const summary = hoursOffline >= 4
        ? `You've been away for ${hoursOffline >= 24 ? `${Math.floor(hoursOffline / 24)} day${Math.floor(hoursOffline / 24) > 1 ? "s" : ""} and ${hoursOffline % 24} hours` : `${hoursOffline} hours`}. Life in ${city.name} kept moving without you.`
        : null;

      await db.update(chroniclesGameState)
        .set({
          lastOfflineCheck: now,
          pendingEvents: JSON.stringify(pendingEvents),
          offlineSummary: summary,
          updatedAt: now,
        })
        .where(eq(chroniclesGameState.userId, userId));

      res.json({
        events: pendingEvents,
        timePassed: hoursOffline,
        summary,
        city: city.name,
      });
    } catch (error: any) {
      console.error("Offline summary error:", error);
      res.status(500).json({ error: "Failed to get offline summary" });
    }
  });

  app.post("/api/chronicles/world/acknowledge-events", isChroniclesAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getPlayUserId(req);
      if (!userId) return res.status(401).json({ error: "Auth required" });

      const { eventIds } = req.body;
      if (!Array.isArray(eventIds)) return res.status(400).json({ error: "Invalid event IDs" });

      const [state] = await db.select().from(chroniclesGameState)
        .where(eq(chroniclesGameState.userId, userId)).limit(1);
      if (!state) return res.status(404).json({ error: "No game state" });

      const pending = JSON.parse(state.pendingEvents || '[]');
      const acknowledged = pending.filter((e: any) => eventIds.includes(e.id));
      const remaining = pending.filter((e: any) => !eventIds.includes(e.id));
      const totalEchoes = acknowledged.reduce((sum: number, e: any) => sum + (e.echoReward || 0), 0);

      const existingLog = JSON.parse(state.gameLog || '[]');
      const newEntries = acknowledged.map((e: any) => ({
        title: e.title,
        description: e.description,
        xpEarned: 0,
        shellsEarned: 0,
        timestamp: new Date().toISOString(),
      }));

      await db.update(chroniclesGameState)
        .set({
          pendingEvents: JSON.stringify(remaining),
          echoBalance: (state.echoBalance || 0) + totalEchoes,
          offlineSummary: null,
          gameLog: JSON.stringify([...existingLog, ...newEntries].slice(-50)),
          updatedAt: new Date(),
        })
        .where(eq(chroniclesGameState.userId, userId));

      res.json({ success: true, echoesEarned: totalEchoes, newBalance: (state.echoBalance || 0) + totalEchoes });
    } catch (error: any) {
      console.error("Acknowledge events error:", error);
      res.status(500).json({ error: "Failed to acknowledge events" });
    }
  });

  app.post("/api/chronicles/economy/spend", isChroniclesAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getPlayUserId(req);
      if (!userId) return res.status(401).json({ error: "Auth required" });

      const { amount, itemId, itemName, category } = req.body;
      if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid amount" });

      const [state] = await db.select().from(chroniclesGameState)
        .where(eq(chroniclesGameState.userId, userId)).limit(1);
      if (!state) return res.status(404).json({ error: "No game state" });
      if ((state.echoBalance || 0) < amount) return res.status(400).json({ error: "Insufficient Echoes", balance: state.echoBalance });

      const inventory = JSON.parse(state.inventory || '[]');
      if (itemId) {
        inventory.push({ id: itemId, name: itemName || itemId, category: category || "purchase", acquiredAt: new Date().toISOString() });
      }

      const existingLog = JSON.parse(state.gameLog || '[]');
      existingLog.push({
        title: `Purchased ${itemName || "item"}`,
        description: `Spent ${amount} Echoes${category ? ` at the ${category}` : ""}`,
        xpEarned: 10,
        shellsEarned: 0,
        timestamp: new Date().toISOString(),
      });

      await db.update(chroniclesGameState)
        .set({
          echoBalance: (state.echoBalance || 0) - amount,
          inventory: JSON.stringify(inventory),
          experience: (state.experience || 0) + 10,
          gameLog: JSON.stringify(existingLog.slice(-50)),
          updatedAt: new Date(),
        })
        .where(eq(chroniclesGameState.userId, userId));

      res.json({ success: true, newBalance: (state.echoBalance || 0) - amount, inventory });
    } catch (error: any) {
      console.error("Economy spend error:", error);
      res.status(500).json({ error: "Failed to process purchase" });
    }
  });

  // ============================================
  // FAITH & SPIRITUAL LIFE SYSTEM
  // ============================================

  const SACRED_TEXTS: Record<string, any[]> = {
    cepher: [
      { id: "genesis", book: "Bere'shiyth (Genesis)", category: "torah", chapters: 50, description: "The beginning of all things — creation, the fall, the flood, and the patriarchs." },
      { id: "exodus", book: "Shemoth (Exodus)", category: "torah", chapters: 40, description: "The deliverance from Egypt, the giving of the Torah at Sinai, and the building of the Tabernacle." },
      { id: "leviticus", book: "Vayiqra (Leviticus)", category: "torah", chapters: 27, description: "The laws of holiness, sacrifice, and priestly service." },
      { id: "numbers", book: "Bemidbar (Numbers)", category: "torah", chapters: 36, description: "The wilderness wanderings and the counting of Israel." },
      { id: "deuteronomy", book: "Devariym (Deuteronomy)", category: "torah", chapters: 34, description: "Moses' final words and the renewal of the covenant before entering the Promised Land." },
      { id: "joshua", book: "Yahusha (Joshua)", category: "history", chapters: 24, description: "The conquest and settlement of the land of Canaan." },
      { id: "judges", book: "Shophetiym (Judges)", category: "history", chapters: 21, description: "The cycle of faithfulness and rebellion in the time of the judges." },
      { id: "ruth", book: "Ruth", category: "history", chapters: 4, description: "A story of loyalty, redemption, and the lineage of King David." },
      { id: "1samuel", book: "Shemu'el Ri'shon (1 Samuel)", category: "history", chapters: 31, description: "The rise of the monarchy — Samuel, Saul, and David." },
      { id: "2samuel", book: "Shemu'el Sheniy (2 Samuel)", category: "history", chapters: 24, description: "David's reign and the establishment of Jerusalem." },
      { id: "psalms", book: "Tehilliym (Psalms)", category: "poetry", chapters: 150, description: "Songs of praise, lament, wisdom, and prophecy — the prayer book of Israel." },
      { id: "proverbs", book: "Mishley (Proverbs)", category: "wisdom", chapters: 31, description: "Wisdom for daily living — the fear of YAHUAH is the beginning of knowledge." },
      { id: "ecclesiastes", book: "Qoheleth (Ecclesiastes)", category: "wisdom", chapters: 12, description: "The search for meaning — vanity of vanities, all is vanity." },
      { id: "song", book: "Shiyr HaShiyriym (Song of Songs)", category: "wisdom", chapters: 8, description: "A love poem expressing the deepest human and divine intimacy." },
      { id: "isaiah", book: "Yesha'yahu (Isaiah)", category: "prophets", chapters: 66, description: "Prophecies of judgment, redemption, and the coming Messiah." },
      { id: "jeremiah", book: "Yirmeyahu (Jeremiah)", category: "prophets", chapters: 52, description: "The weeping prophet's warnings before the destruction of Jerusalem." },
      { id: "ezekiel", book: "Yechezq'el (Ezekiel)", category: "prophets", chapters: 48, description: "Visions of divine glory, judgment, and the restoration of Israel." },
      { id: "daniel", book: "Daniy'el (Daniel)", category: "prophets", chapters: 12, description: "Prophecies of empires, the end times, and faithfulness under persecution." },
      { id: "matthew", book: "Mattithyahu (Matthew)", category: "gospels", chapters: 28, description: "The Gospel of the Kingdom — Yahusha as the promised Messiah." },
      { id: "mark", book: "Marqus (Mark)", category: "gospels", chapters: 16, description: "The Gospel of action — the servant Messiah who came to give his life." },
      { id: "luke", book: "Luqas (Luke)", category: "gospels", chapters: 24, description: "The Gospel of compassion — Yahusha as the Son of Man for all people." },
      { id: "john", book: "Yochanon (John)", category: "gospels", chapters: 21, description: "The Gospel of divinity — In the beginning was the Word." },
      { id: "acts", book: "Ma'asiym (Acts)", category: "gospels", chapters: 28, description: "The birth of the early assembly and the spread of the Good News." },
      { id: "romans", book: "Romaiym (Romans)", category: "letters", chapters: 16, description: "Paul's masterwork on salvation by grace through faith." },
      { id: "revelation", book: "Chizayon (Revelation)", category: "prophecy", chapters: 22, description: "The unveiling of the end times and the triumph of the Lamb." },
      { id: "enoch", book: "Chanok (1 Enoch)", category: "cepher_exclusive", chapters: 108, description: "The Book of the Watchers, the Parables, and the astronomical writings. Quoted by Jude. Reveals the fallen angels, the origin of nephilim, and the coming judgment." },
      { id: "2enoch", book: "Chanok Sheniy (2 Enoch)", category: "cepher_exclusive", chapters: 68, description: "The Secrets of Enoch — his journey through the seven heavens and the creation narrative as told by the Most High." },
      { id: "jubilees", book: "Yovheliym (Jubilees)", category: "cepher_exclusive", chapters: 50, description: "The Little Genesis — a detailed retelling of creation through Moses, organized by jubilee cycles. Reveals the sacred calendar and the war between the spirits of truth and falsehood." },
      { id: "jasher", book: "Yashar (Jasher)", category: "cepher_exclusive", chapters: 91, description: "The Book of the Upright — referenced in Joshua and 2 Samuel. A detailed history from Adam through the Judges, filling in gaps the other books leave silent." },
      { id: "wisdom", book: "Chokmah Shlomoh (Wisdom of Solomon)", category: "cepher_exclusive", chapters: 19, description: "Deep wisdom on righteousness, the nature of wisdom itself, and the destiny of the faithful." },
      { id: "sirach", book: "Sirach (Ecclesiasticus)", category: "cepher_exclusive", chapters: 51, description: "Practical wisdom for daily living — the fear of the Most High applied to every aspect of life." },
      { id: "tobit", book: "Toviyahu (Tobit)", category: "cepher_exclusive", chapters: 14, description: "A story of faith, healing, and angelic intervention in the life of a righteous family." },
      { id: "2esdras", book: "Ezra Reviy'iy (2 Esdras / 4 Ezra)", category: "cepher_exclusive", chapters: 16, description: "Apocalyptic visions given to Ezra — prophecies of the end times, the coming Messiah, and the restoration of all things." },
      { id: "baruch", book: "Baruk (Baruch)", category: "cepher_exclusive", chapters: 6, description: "The words of Jeremiah's scribe — prayers of repentance and the promise of return from exile." },
      { id: "maccabees1", book: "Makkabiym Ri'shon (1 Maccabees)", category: "cepher_exclusive", chapters: 16, description: "The revolt against Greek oppression and the rededication of the Temple — the origin of Chanukah." },
      { id: "maccabees2", book: "Makkabiym Sheniy (2 Maccabees)", category: "cepher_exclusive", chapters: 15, description: "Miraculous accounts of divine intervention during the Maccabean revolt." },
    ],
  };

  const CONGREGATIONS: Record<string, any[]> = {
    modern: [
      { id: "community_chapel", name: "Community Chapel", type: "non-denominational", description: "A welcoming congregation focused on studying the complete scriptures, including the books most churches leave out. Ursula leads weekly Cepher study groups here.", schedule: "Sunday 10am, Wednesday 7pm", leader: "Ursula" },
      { id: "city_cathedral", name: "City Cathedral", type: "traditional", description: "The grand cathedral downtown where generations have worshipped. Traditional liturgy, powerful organ music, and a sense of sacred history.", schedule: "Sunday 8am & 11am", leader: "Pastor Morrison" },
      { id: "storefront_church", name: "Cornerstone Fellowship", type: "charismatic", description: "A vibrant storefront church in the heart of the neighborhood. Energetic worship, passionate preaching, and a tight-knit community that takes care of its own.", schedule: "Sunday 11am, Friday 7pm", leader: "Pastor Williams" },
      { id: "home_fellowship", name: "Home Fellowship Group", type: "house_church", description: "A small gathering in someone's living room. No formal structure — just people reading scripture together, sharing meals, and being real about life.", schedule: "Thursday 7pm", leader: "Various" },
    ],
    medieval: [
      { id: "village_chapel", name: "The Village Chapel", type: "parish", description: "The stone chapel at the heart of the village where the faithful gather for mass. Simple but sacred, with hand-painted icons and candlelight.", schedule: "Daily Matins, Sunday High Mass", leader: "Father Thomas" },
      { id: "abbey_scriptorium", name: "The Abbey Scriptorium", type: "monastic", description: "Sister Ursula's hidden sanctuary within the abbey walls. Monks copy manuscripts by candlelight while she guards texts that the Church has tried to suppress.", schedule: "Night prayers, secret study sessions", leader: "Sister Ursula" },
      { id: "forest_shrine", name: "The Forest Shrine", type: "celtic", description: "A sacred grove where the old Celtic Christian traditions live on — prayers that honor creation, rituals that predate Rome's influence, and the complete scriptures.", schedule: "Solstice gatherings, dawn prayers", leader: "Brother Aidan" },
      { id: "cathedral", name: "The Grand Cathedral", type: "cathedral", description: "The bishop's seat of power. Magnificent stained glass, soaring arches, and political intrigue behind every confession.", schedule: "Daily hours, Sunday solemn mass", leader: "Bishop Renault" },
    ],
    wildwest: [
      { id: "frontier_church", name: "Frontier Church", type: "frontier", description: "A whitewashed wooden church on the edge of town. Mother Ursula preaches here on Sundays, and her sermons draw people from miles around — she teaches from the complete Cepher, not just the approved texts.", schedule: "Sunday 10am", leader: "Mother Ursula" },
      { id: "camp_meeting", name: "Revival Camp Meeting", type: "revival", description: "A tent meeting ground outside town where traveling preachers set up for week-long revivals. Singing, testifying, and the kind of preaching that makes you feel every word in your bones.", schedule: "Seasonal revivals", leader: "Traveling evangelists" },
      { id: "mission", name: "San Miguel Mission", type: "mission", description: "An old Spanish mission with thick adobe walls, a bell tower, and centuries of prayer soaked into the stone. A place of refuge for anyone — outlaw or saint.", schedule: "Daily vespers, Sunday mass", leader: "Padre Esteban" },
      { id: "prayer_circle", name: "Settlers' Prayer Circle", type: "informal", description: "An informal gathering around a campfire where frontier families pray together, share scripture, and support each other through the hardships of frontier life.", schedule: "Nightly around sundown", leader: "Community" },
    ],
  };

  const COMMUNITY_EVENTS: Record<string, any[]> = {
    modern: [
      { id: "potluck", name: "Community Potluck", type: "fellowship", description: "Monthly gathering after service where everyone brings a dish and shares a meal together.", echoReward: 15, faithXp: 20 },
      { id: "bible_study", name: "Cepher Study Group", type: "study", description: "Ursula's deep-dive into the books most people have never read — tonight: the Book of Enoch and the Watchers.", echoReward: 25, faithXp: 40 },
      { id: "food_bank", name: "Food Bank Volunteering", type: "service", description: "Serving the community by helping at the local food bank — faith in action.", echoReward: 30, faithXp: 35 },
      { id: "prayer_vigil", name: "Evening Prayer Vigil", type: "prayer", description: "A quiet evening of communal prayer and meditation on scripture.", echoReward: 10, faithXp: 30 },
      { id: "youth_night", name: "Youth Night", type: "fellowship", description: "Games, music, and real conversations about faith and life for the younger generation.", echoReward: 15, faithXp: 15 },
      { id: "baptism", name: "Baptism Ceremony", type: "ceremony", description: "A sacred immersion ceremony at the river — a public declaration of faith.", echoReward: 50, faithXp: 100, minFaithLevel: 3 },
    ],
    medieval: [
      { id: "feast_day", name: "Saint's Feast Day", type: "festival", description: "The village celebrates with food, music, and stories of the saints. The whole community comes together.", echoReward: 20, faithXp: 25 },
      { id: "manuscript_study", name: "Secret Manuscript Reading", type: "study", description: "Sister Ursula opens the hidden library for those brave enough to read the forbidden books — tonight: Jubilees.", echoReward: 35, faithXp: 50 },
      { id: "pilgrimage", name: "Local Pilgrimage", type: "journey", description: "Walk the ancient pilgrim's path to the holy well, praying at each station along the way.", echoReward: 25, faithXp: 40 },
      { id: "almsgiving", name: "Almsgiving Day", type: "service", description: "Distribution of bread and coin to the poor at the abbey gates.", echoReward: 20, faithXp: 30 },
      { id: "vespers", name: "Evening Vespers", type: "prayer", description: "Candlelit evening prayers with Gregorian chant echoing through stone corridors.", echoReward: 10, faithXp: 20 },
      { id: "ordination", name: "Ordination Ceremony", type: "ceremony", description: "A solemn ceremony of dedication — committing your life to sacred service.", echoReward: 75, faithXp: 120, minFaithLevel: 5 },
    ],
    wildwest: [
      { id: "sunday_dinner", name: "Sunday Dinner on the Ground", type: "fellowship", description: "After Mother Ursula's sermon, the whole community spreads blankets and shares food. The best conversations happen here.", echoReward: 15, faithXp: 20 },
      { id: "cepher_reading", name: "Cepher Reading by Firelight", type: "study", description: "Mother Ursula reads from the Book of Jasher by campfire light, drawing connections to the frontier life.", echoReward: 30, faithXp: 45 },
      { id: "barn_raising", name: "Community Barn Raising", type: "service", description: "The whole community comes together to build a barn for a family in need — faith is what you do, not just what you say.", echoReward: 35, faithXp: 35 },
      { id: "hymn_sing", name: "Evening Hymn Sing", type: "prayer", description: "Gather on the church porch as the sun sets, singing old hymns that carry across the frontier.", echoReward: 10, faithXp: 20 },
      { id: "healing_prayer", name: "Healing Prayer Service", type: "prayer", description: "Mother Ursula lays hands on the sick and prays. Whether it's faith or frontier grit, people get better.", echoReward: 20, faithXp: 40 },
      { id: "dedication", name: "Frontier Dedication", type: "ceremony", description: "A dedication ceremony under the open sky — committing your land, your work, and your life to something greater.", echoReward: 60, faithXp: 100, minFaithLevel: 4 },
    ],
  };

  // GET /api/chronicles/faith/status
  app.get("/api/chronicles/faith/status", isChroniclesAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getPlayUserId(req);
      if (!userId) return res.status(401).json({ error: "Authentication required" });

      const [state] = await db.select().from(chroniclesGameState)
        .where(eq(chroniclesGameState.userId, userId))
        .limit(1);

      if (!state) return res.status(404).json({ error: "Game state not found" });

      const era = state.currentEra || "modern";
      const sacredTextsRead = JSON.parse(state.sacredTextsRead || '[]');
      const spiritualJournal = JSON.parse(state.spiritualJournal || '[]');
      const congregations = CONGREGATIONS[era] || [];
      const events = (COMMUNITY_EVENTS[era] || []).filter(e => !e.minFaithLevel || (state.faithLevel || 0) >= e.minFaithLevel);
      const relationships = JSON.parse(state.npcRelationships || '{}');
      const eraUrsulaNames: Record<string, string> = { modern: "Ursula", medieval: "Sister Ursula", wildwest: "Mother Ursula" };
      const ursulaName = eraUrsulaNames[era] || "Ursula";
      const ursulaRelationship = relationships[ursulaName] || 0;

      const now = new Date();
      const lastService = state.lastServiceAt ? new Date(state.lastServiceAt) : null;
      const lastPrayer = state.lastPrayerAt ? new Date(state.lastPrayerAt) : null;
      const canAttendService = !lastService || (now.getTime() - lastService.getTime()) > 4 * 3600000;
      const canPray = !lastPrayer || (now.getTime() - lastPrayer.getTime()) > 1800000;

      res.json({
        faithLevel: state.faithLevel || 0,
        faithXpToNext: ((state.faithLevel || 0) + 1) * 100,
        spiritualPath: state.spiritualPath,
        sacredTextsRead,
        totalTexts: SACRED_TEXTS.cepher.length,
        servicesAttended: state.servicesAttended || 0,
        congregationId: state.congregationId,
        prayerStreak: state.prayerStreak || 0,
        canAttendService,
        canPray,
        congregations,
        upcomingEvents: events,
        ursulaRelationship,
        ursulaName,
        era,
        recentJournal: spiritualJournal.slice(-5),
      });
    } catch (error: any) {
      console.error("Faith status error:", error);
      res.status(500).json({ error: "Failed to load faith status" });
    }
  });

  // GET /api/chronicles/faith/sacred-texts
  app.get("/api/chronicles/faith/sacred-texts", isChroniclesAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getPlayUserId(req);
      if (!userId) return res.status(401).json({ error: "Authentication required" });

      const [state] = await db.select().from(chroniclesGameState)
        .where(eq(chroniclesGameState.userId, userId))
        .limit(1);

      if (!state) return res.status(404).json({ error: "Game state not found" });

      const sacredTextsRead = JSON.parse(state.sacredTextsRead || '[]');
      const category = (req.query.category as string) || "all";

      let texts = SACRED_TEXTS.cepher;
      if (category !== "all") {
        texts = texts.filter(t => t.category === category);
      }

      res.json({
        texts: texts.map(t => ({
          ...t,
          read: sacredTextsRead.includes(t.id),
        })),
        categories: ["torah", "history", "poetry", "wisdom", "prophets", "gospels", "letters", "prophecy", "cepher_exclusive"],
        totalRead: sacredTextsRead.length,
        totalTexts: SACRED_TEXTS.cepher.length,
      });
    } catch (error: any) {
      console.error("Sacred texts error:", error);
      res.status(500).json({ error: "Failed to load sacred texts" });
    }
  });

  // POST /api/chronicles/faith/read-text - Read a sacred text passage (AI-generated)
  app.post("/api/chronicles/faith/read-text", isChroniclesAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getPlayUserId(req);
      if (!userId) return res.status(401).json({ error: "Authentication required" });

      const { textId } = req.body;
      if (!textId) return res.status(400).json({ error: "Text ID required" });

      const text = SACRED_TEXTS.cepher.find(t => t.id === textId);
      if (!text) return res.status(404).json({ error: "Sacred text not found" });

      const [state] = await db.select().from(chroniclesGameState)
        .where(eq(chroniclesGameState.userId, userId))
        .limit(1);

      if (!state) return res.status(404).json({ error: "Game state not found" });

      const era = state.currentEra || "modern";
      const eraUrsulaNames: Record<string, string> = { modern: "Ursula", medieval: "Sister Ursula", wildwest: "Mother Ursula" };
      const ursulaName = eraUrsulaNames[era] || "Ursula";
      const isCepherExclusive = text.category === "cepher_exclusive";

      let passage;
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are generating a reading experience for "${text.book}" from the Cepher Bible in DarkWave Chronicles.

The player is reading this text in the ${era} era. ${ursulaName} is their spiritual guide.

${isCepherExclusive ? `IMPORTANT: This is one of the books EXCLUDED from most modern Bibles but preserved in the Cepher. ${ursulaName} considers these texts essential to understanding the full picture of scripture. Treat this text with deep reverence and scholarly accuracy.` : ""}

Generate a meaningful passage and ${ursulaName}'s commentary on it. The passage should feel authentic to the actual biblical text (using the sacred names: YAHUAH, Yahusha, Ruach HaQodesh). ${ursulaName}'s commentary should draw connections between the ancient text and the player's life, making it personally relevant.

Return JSON:
{
  "passageTitle": "Chapter/section title",
  "passage": "2-3 paragraphs of the sacred text in reverent, authentic style using the sacred names",
  "ursulaCommentary": "${ursulaName}'s personal insight connecting this passage to the player's journey (2-3 sentences, in her voice)",
  "reflectionQuestion": "A penetrating question ${ursulaName} poses to the player for personal reflection",
  "historicalContext": "One fascinating historical/scholarly fact about this text (1-2 sentences)"
}`
            },
            { role: "user", content: `Generate a reading from ${text.book}: "${text.description}"` }
          ],
          response_format: { type: "json_object" },
          max_completion_tokens: 1000,
        });
        passage = JSON.parse(response.choices[0]?.message?.content || '{}');
      } catch {
        passage = {
          passageTitle: `From ${text.book}`,
          passage: text.description,
          ursulaCommentary: `${ursulaName} looks at you thoughtfully. "This text has much to teach us, if we have ears to hear."`,
          reflectionQuestion: "What does this passage stir in your heart?",
          historicalContext: `This text is part of the Cepher's ${text.chapters}-chapter collection.`,
        };
      }

      const sacredTextsRead = JSON.parse(state.sacredTextsRead || '[]');
      const isNew = !sacredTextsRead.includes(textId);
      if (isNew) {
        sacredTextsRead.push(textId);
      }

      const faithXpGained = isNew ? (isCepherExclusive ? 30 : 15) : 5;
      const echoReward = isNew ? (isCepherExclusive ? 20 : 10) : 0;
      const newFaithXp = (state.faithLevel || 0) * 100 + faithXpGained;
      const newFaithLevel = Math.floor(newFaithXp / 100);

      const journal = JSON.parse(state.spiritualJournal || '[]');
      journal.push({
        type: "reading",
        textId,
        book: text.book,
        passageTitle: passage.passageTitle,
        timestamp: new Date().toISOString(),
      });

      await db.update(chroniclesGameState)
        .set({
          sacredTextsRead: JSON.stringify(sacredTextsRead),
          faithLevel: newFaithLevel,
          echoBalance: (state.echoBalance || 0) + echoReward,
          spiritualJournal: JSON.stringify(journal.slice(-100)),
          experience: (state.experience || 0) + faithXpGained,
          updatedAt: new Date(),
        })
        .where(eq(chroniclesGameState.userId, userId));

      res.json({
        passage,
        text,
        isNew,
        faithXpGained,
        echoReward,
        faithLevel: newFaithLevel,
        totalTextsRead: sacredTextsRead.length,
      });
    } catch (error: any) {
      console.error("Read text error:", error);
      res.status(500).json({ error: "Failed to read sacred text" });
    }
  });

  // POST /api/chronicles/faith/attend-service
  app.post("/api/chronicles/faith/attend-service", isChroniclesAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getPlayUserId(req);
      if (!userId) return res.status(401).json({ error: "Authentication required" });

      const { congregationId } = req.body;

      const [state] = await db.select().from(chroniclesGameState)
        .where(eq(chroniclesGameState.userId, userId))
        .limit(1);

      if (!state) return res.status(404).json({ error: "Game state not found" });

      const era = state.currentEra || "modern";
      const congregations = CONGREGATIONS[era] || [];
      const congregation = congregations.find(c => c.id === congregationId);
      if (!congregation) return res.status(404).json({ error: "Congregation not found" });

      const now = new Date();
      const lastService = state.lastServiceAt ? new Date(state.lastServiceAt) : null;
      if (lastService && (now.getTime() - lastService.getTime()) < 4 * 3600000) {
        return res.status(429).json({ error: "You've attended a service recently. Come back later." });
      }

      const eraUrsulaNames: Record<string, string> = { modern: "Ursula", medieval: "Sister Ursula", wildwest: "Mother Ursula" };
      const ursulaName = eraUrsulaNames[era] || "Ursula";
      const isUrsulaLed = congregation.leader === ursulaName || congregation.leader === "Sister Ursula" || congregation.leader === "Mother Ursula";

      let serviceExperience;
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `Generate an immersive worship service experience at "${congregation.name}" (${congregation.type}) in the ${era} era of DarkWave Chronicles.

${congregation.description}

${isUrsulaLed ? `${ursulaName} is leading this service. She teaches from the complete Cepher Bible, including the books most don't know about. Her teaching style is warm, deeply insightful, and personally challenging. She uses the sacred names (YAHUAH, Yahusha).` : `The service is led by ${congregation.leader}.`}

Make it feel like the player is THERE. Sights, sounds, atmosphere. The service should feel authentic to the era and denomination.

Return JSON:
{
  "title": "Service title or theme",
  "atmosphere": "1-2 sentences describing the sights, sounds, and feeling of arriving",
  "sermon": "2-3 paragraphs of the teaching/sermon — make it personally meaningful, not generic",
  "communityMoment": "A brief scene of fellowship — a conversation, a shared meal, a moment of connection with another worshipper",
  "personalInsight": "A thought that stays with the player after the service (1-2 sentences)",
  "scriptureReference": "The scripture passage referenced in the teaching"
}`
            },
            { role: "user", content: `Generate a worship service experience. Player faith level: ${state.faithLevel}, services attended: ${state.servicesAttended}` }
          ],
          response_format: { type: "json_object" },
          max_completion_tokens: 1200,
        });
        serviceExperience = JSON.parse(response.choices[0]?.message?.content || '{}');
      } catch {
        serviceExperience = {
          title: "A Gathering of the Faithful",
          atmosphere: `The ${congregation.name} fills with the warmth of gathered souls.`,
          sermon: "The teaching today speaks of perseverance and the faithfulness of the Most High through all seasons of life.",
          communityMoment: "After the service, someone extends a hand of welcome and invites you to stay for fellowship.",
          personalInsight: "You leave with a renewed sense of purpose.",
          scriptureReference: "Tehilliym (Psalms) 23",
        };
      }

      const faithXpGained = isUrsulaLed ? 50 : 30;
      const echoReward = 20;
      const newServicesAttended = (state.servicesAttended || 0) + 1;

      const relationships = JSON.parse(state.npcRelationships || '{}');
      if (isUrsulaLed) {
        relationships[ursulaName] = clamp((relationships[ursulaName] || 0) + 2, -20, 20);
      }

      const journal = JSON.parse(state.spiritualJournal || '[]');
      journal.push({
        type: "service",
        congregation: congregation.name,
        title: serviceExperience.title,
        timestamp: new Date().toISOString(),
      });

      const newFaithXp = (state.faithLevel || 0) * 100 + faithXpGained;
      const newFaithLevel = Math.floor(newFaithXp / 100);

      await db.update(chroniclesGameState)
        .set({
          servicesAttended: newServicesAttended,
          lastServiceAt: now,
          congregationId,
          faithLevel: newFaithLevel,
          echoBalance: (state.echoBalance || 0) + echoReward,
          npcRelationships: JSON.stringify(relationships),
          spiritualJournal: JSON.stringify(journal.slice(-100)),
          experience: (state.experience || 0) + faithXpGained,
          updatedAt: new Date(),
        })
        .where(eq(chroniclesGameState.userId, userId));

      res.json({
        service: serviceExperience,
        congregation,
        faithXpGained,
        echoReward,
        faithLevel: newFaithLevel,
        servicesAttended: newServicesAttended,
        ursulaRelationshipChange: isUrsulaLed ? 2 : 0,
      });
    } catch (error: any) {
      console.error("Attend service error:", error);
      res.status(500).json({ error: "Failed to attend service" });
    }
  });

  // POST /api/chronicles/faith/pray
  app.post("/api/chronicles/faith/pray", isChroniclesAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getPlayUserId(req);
      if (!userId) return res.status(401).json({ error: "Authentication required" });

      const { intention } = req.body;

      const [state] = await db.select().from(chroniclesGameState)
        .where(eq(chroniclesGameState.userId, userId))
        .limit(1);

      if (!state) return res.status(404).json({ error: "Game state not found" });

      const now = new Date();
      const lastPrayer = state.lastPrayerAt ? new Date(state.lastPrayerAt) : null;
      if (lastPrayer && (now.getTime() - lastPrayer.getTime()) < 1800000) {
        return res.status(429).json({ error: "Take time to reflect on your last prayer before praying again." });
      }

      const era = state.currentEra || "modern";
      const eraUrsulaNames: Record<string, string> = { modern: "Ursula", medieval: "Sister Ursula", wildwest: "Mother Ursula" };
      const ursulaName = eraUrsulaNames[era] || "Ursula";

      const lastPrayerDate = lastPrayer ? lastPrayer.toDateString() : null;
      const todayStr = now.toDateString();
      const yesterdayStr = new Date(now.getTime() - 86400000).toDateString();
      let newStreak = state.prayerStreak || 0;
      if (lastPrayerDate === todayStr) {
        // already prayed today, no streak change
      } else if (lastPrayerDate === yesterdayStr) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }

      let prayerResponse;
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `Generate a prayer and meditation moment for a player in the ${era} era of DarkWave Chronicles.

${intention ? `The player's prayer intention: "${intention}"` : "The player is praying without a specific intention — seeking peace and guidance."}

Prayer streak: ${newStreak} days. Faith level: ${state.faithLevel}.

Create an intimate, reverent moment. Use the sacred names (YAHUAH, Yahusha) naturally. Include a scripture from the Cepher that relates to their intention or state of mind. This should feel personal and genuine, not formulaic.

Return JSON:
{
  "atmosphere": "A brief description of the prayer setting and moment (1-2 sentences)",
  "prayer": "A heartfelt prayer in first person — what rises from the heart (2-3 sentences)",
  "scripture": "A comforting or guiding scripture passage from the Cepher",
  "scriptureSource": "Book and chapter reference",
  "innerPeace": "What the player feels after praying (1-2 sentences — warmth, clarity, peace, conviction)",
  "ursulaWhisper": "${ursulaName}'s gentle encouragement if she's nearby, or null if the player is alone"
}`
            },
            { role: "user", content: intention ? `Prayer intention: ${intention}` : "Seeking peace and guidance" }
          ],
          response_format: { type: "json_object" },
          max_completion_tokens: 600,
        });
        prayerResponse = JSON.parse(response.choices[0]?.message?.content || '{}');
      } catch {
        prayerResponse = {
          atmosphere: "A quiet moment of stillness settles over you.",
          prayer: "YAHUAH, I come before you seeking wisdom and peace. Guide my steps in this world.",
          scripture: "Trust in YAHUAH with all your heart, and lean not on your own understanding.",
          scriptureSource: "Mishley (Proverbs) 3:5",
          innerPeace: "A gentle warmth fills your chest. You feel heard.",
          ursulaWhisper: null,
        };
      }

      const faithXpGained = 15 + Math.min(newStreak * 2, 20);
      const echoReward = newStreak >= 7 ? 10 : 5;

      const journal = JSON.parse(state.spiritualJournal || '[]');
      journal.push({
        type: "prayer",
        intention: intention || "general",
        streak: newStreak,
        timestamp: new Date().toISOString(),
      });

      const newFaithXp = (state.faithLevel || 0) * 100 + faithXpGained;
      const newFaithLevel = Math.floor(newFaithXp / 100);

      await db.update(chroniclesGameState)
        .set({
          prayerStreak: newStreak,
          lastPrayerAt: now,
          faithLevel: newFaithLevel,
          echoBalance: (state.echoBalance || 0) + echoReward,
          wisdom: (state.wisdom || 10) + (newStreak >= 7 ? 1 : 0),
          spiritualJournal: JSON.stringify(journal.slice(-100)),
          experience: (state.experience || 0) + faithXpGained,
          updatedAt: new Date(),
        })
        .where(eq(chroniclesGameState.userId, userId));

      res.json({
        prayer: prayerResponse,
        faithXpGained,
        echoReward,
        prayerStreak: newStreak,
        faithLevel: newFaithLevel,
        wisdomGained: newStreak >= 7 ? 1 : 0,
      });
    } catch (error: any) {
      console.error("Prayer error:", error);
      res.status(500).json({ error: "Failed to process prayer" });
    }
  });

  // POST /api/chronicles/faith/attend-event
  app.post("/api/chronicles/faith/attend-event", isChroniclesAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getPlayUserId(req);
      if (!userId) return res.status(401).json({ error: "Authentication required" });

      const { eventId } = req.body;
      if (!eventId) return res.status(400).json({ error: "Event ID required" });

      const [state] = await db.select().from(chroniclesGameState)
        .where(eq(chroniclesGameState.userId, userId))
        .limit(1);

      if (!state) return res.status(404).json({ error: "Game state not found" });

      const era = state.currentEra || "modern";
      const events = COMMUNITY_EVENTS[era] || [];
      const event = events.find(e => e.id === eventId);
      if (!event) return res.status(404).json({ error: "Event not found" });

      if (event.minFaithLevel && (state.faithLevel || 0) < event.minFaithLevel) {
        return res.status(403).json({ error: `Requires faith level ${event.minFaithLevel}`, currentLevel: state.faithLevel });
      }

      let eventExperience;
      try {
        const eraUrsulaNames: Record<string, string> = { modern: "Ursula", medieval: "Sister Ursula", wildwest: "Mother Ursula" };
        const ursulaName = eraUrsulaNames[era] || "Ursula";

        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `Generate an immersive community event experience for "${event.name}" (${event.type}) in the ${era} era.

${event.description}

Make the player feel PRESENT at this gathering. Include other community members, conversations, moments of genuine human connection. This is life simulation — make it feel real.

Return JSON:
{
  "narrative": "2-3 vivid paragraphs describing the player's experience at the event",
  "highlight": "The most memorable moment (1-2 sentences)",
  "connection": "A meaningful interaction with another person at the event",
  "takeaway": "What the player carries with them from this experience"
}`
            },
            { role: "user", content: `Generate community event experience. Player faith level: ${state.faithLevel}, era: ${era}` }
          ],
          response_format: { type: "json_object" },
          max_completion_tokens: 800,
        });
        eventExperience = JSON.parse(response.choices[0]?.message?.content || '{}');
      } catch {
        eventExperience = {
          narrative: `You arrive at ${event.name} and find a warm welcome. ${event.description}`,
          highlight: "A moment of genuine connection with the community.",
          connection: "Someone reaches out and shares their story with you.",
          takeaway: "You leave feeling more connected to the people around you.",
        };
      }

      const journal = JSON.parse(state.spiritualJournal || '[]');
      journal.push({
        type: "event",
        eventId,
        name: event.name,
        timestamp: new Date().toISOString(),
      });

      const faithXpGained = event.faithXp || 20;
      const echoReward = event.echoReward || 15;
      const newFaithXp = (state.faithLevel || 0) * 100 + faithXpGained;
      const newFaithLevel = Math.floor(newFaithXp / 100);

      await db.update(chroniclesGameState)
        .set({
          faithLevel: newFaithLevel,
          echoBalance: (state.echoBalance || 0) + echoReward,
          compassion: (state.compassion || 10) + (event.type === "service" ? 1 : 0),
          influence: (state.influence || 10) + (event.type === "ceremony" ? 1 : 0),
          spiritualJournal: JSON.stringify(journal.slice(-100)),
          experience: (state.experience || 0) + faithXpGained,
          updatedAt: new Date(),
        })
        .where(eq(chroniclesGameState.userId, userId));

      res.json({
        event: eventExperience,
        eventInfo: event,
        faithXpGained,
        echoReward,
        faithLevel: newFaithLevel,
      });
    } catch (error: any) {
      console.error("Attend event error:", error);
      res.status(500).json({ error: "Failed to attend event" });
    }
  });

  // POST /api/chronicles/faith/talk-to-ursula - Direct conversation with Ursula
  app.post("/api/chronicles/faith/talk-to-ursula", isChroniclesAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getPlayUserId(req);
      if (!userId) return res.status(401).json({ error: "Authentication required" });

      const { message } = req.body;
      if (!message) return res.status(400).json({ error: "Message required" });

      const [state] = await db.select().from(chroniclesGameState)
        .where(eq(chroniclesGameState.userId, userId))
        .limit(1);

      if (!state) return res.status(404).json({ error: "Game state not found" });

      const era = state.currentEra || "modern";
      const eraUrsulaNames: Record<string, string> = { modern: "Ursula", medieval: "Sister Ursula", wildwest: "Mother Ursula" };
      const ursulaName = eraUrsulaNames[era] || "Ursula";
      const ursulaData = STARTER_NPCS.find(n => n.name === ursulaName);
      const relationships = JSON.parse(state.npcRelationships || '{}');
      const relScore = relationships[ursulaName] || 0;

      let reply;
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are ${ursulaName} in the ${era} era of DarkWave Chronicles.

${ursulaData?.backstory || "A keeper of sacred texts who guides seekers toward truth."}

PERSONALITY: ${ursulaData?.personality || "Compassionate, scholarly, deeply spiritual"}

RELATIONSHIP WITH PLAYER: ${relScore > 5 ? "Deep trust and friendship" : relScore > 0 ? "Growing warmth" : relScore < -5 ? "Guarded and cautious" : relScore < 0 ? "Slightly wary" : "Neutral but open"}

YOUR KNOWLEDGE: You know the complete Cepher Bible — all 87 books. You can quote from Enoch, Jubilees, Jasher, Wisdom of Solomon, Sirach, Tobit, 2 Esdras, Baruch, Maccabees, and all the standard texts. You use the sacred names: YAHUAH (the Most High), Yahusha (the Messiah), Ruach HaQodesh (the Holy Spirit). You believe the removed books were suppressed for political reasons, not theological ones.

SPEAKING STYLE: Warm, deeply thoughtful, quotes scripture naturally, asks questions that pierce the heart. You don't preach at people — you walk with them. You meet people where they are.

${era === "medieval" ? "You speak with medieval formality but genuine warmth. You're cautious about who you share the hidden texts with." : era === "wildwest" ? "You're frontier-tough but tender-hearted. Plain-spoken wisdom. You've buried your husband and kept preaching. You don't suffer fools but you love everyone." : "You're a former professor who left academia for truth. Approachable, intellectually rigorous, spiritually grounded."}

Respond as ${ursulaName} in character. Keep responses 2-4 sentences. Be genuine, not preachy. If the player asks about scripture, quote from the Cepher (including the hidden books when relevant).`
            },
            { role: "user", content: message }
          ],
          max_completion_tokens: 300,
        });
        reply = response.choices[0]?.message?.content || `${ursulaName} considers your words thoughtfully.`;
      } catch {
        reply = `${ursulaName} nods slowly. "That's a profound question. Let me think on it and we can talk more."`;
      }

      relationships[ursulaName] = clamp((relationships[ursulaName] || 0) + 1, -20, 20);

      await db.update(chroniclesGameState)
        .set({
          npcRelationships: JSON.stringify(relationships),
          updatedAt: new Date(),
        })
        .where(eq(chroniclesGameState.userId, userId));

      res.json({
        reply,
        ursulaName,
        relationshipScore: relationships[ursulaName],
      });
    } catch (error: any) {
      console.error("Talk to Ursula error:", error);
      res.status(500).json({ error: "Failed to talk to Ursula" });
    }
  });

  // =====================================================
  // LIVING WORLD SYSTEM ROUTES
  // =====================================================

  app.get("/api/chronicles/world/zones/:era", isChroniclesAuthenticated, async (req: any, res: Response) => {
    try {
      const era = req.params.era;
      if (!["modern", "medieval", "wildwest"].includes(era)) {
        return res.status(400).json({ error: "Invalid era" });
      }
      const zones = getAllZonesForEra(era);
      const time = getWorldTimeInfo(era);

      const userId = getPlayUserId(req);
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      const activePresence = await db.select().from(zonePresence)
        .where(and(eq(zonePresence.era, era), eq(zonePresence.isActive, true)));

      const playerCounts: Record<string, number> = {};
      for (const p of activePresence) {
        const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
        if (p.lastHeartbeat > fiveMinAgo) {
          playerCounts[p.zoneId] = (playerCounts[p.zoneId] || 0) + 1;
        }
      }

      const myPresence = activePresence.find(p => p.userId === userId);

      res.json({
        era,
        time,
        zones: zones.map(z => ({
          ...z,
          playersHere: playerCounts[z.id] || 0,
          isCurrentZone: myPresence?.zoneId === z.id,
        })),
        currentZone: myPresence?.zoneId || null,
      });
    } catch (error: any) {
      console.error("Get world zones error:", error);
      res.status(500).json({ error: "Failed to get world zones" });
    }
  });

  app.get("/api/chronicles/world/zone/:era/:zoneId", isChroniclesAuthenticated, async (req: any, res: Response) => {
    try {
      const { era, zoneId } = req.params;
      if (!["modern", "medieval", "wildwest"].includes(era)) {
        return res.status(400).json({ error: "Invalid era" });
      }

      const ambient = getZoneAmbientState(era, zoneId);
      if (!ambient) {
        return res.status(404).json({ error: "Zone not found" });
      }

      const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
      const activePlayers = await db.select().from(zonePresence)
        .where(and(
          eq(zonePresence.era, era),
          eq(zonePresence.zoneId, zoneId),
          eq(zonePresence.isActive, true),
        ));

      const recentPlayers = activePlayers.filter(p => p.lastHeartbeat > fiveMinAgo);
      const userId = getPlayUserId(req);
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      const state = await db.select().from(chroniclesGameState).where(eq(chroniclesGameState.userId, userId));
      const playerLevel = state[0]?.level || 1;
      const relationships = state[0]?.npcRelationships ? JSON.parse(state[0].npcRelationships as string) : {};

      res.json({
        ...ambient,
        activities: ambient.activities.map(a => ({
          ...a,
          isAvailable: playerLevel >= a.requiredLevel,
          minigameConfig: a.minigameType ? MINIGAME_CONFIGS[a.minigameType] : undefined,
        })),
        npcsPresent: ambient.npcsPresent.map(n => ({
          ...n,
          relationshipScore: relationships[n.name] || 0,
        })),
        playersPresent: recentPlayers.filter(p => p.userId !== userId).map(p => ({
          odActivity: p.activity,
          since: p.enteredAt,
        })),
        playerCount: recentPlayers.length,
      });
    } catch (error: any) {
      console.error("Get zone detail error:", error);
      res.status(500).json({ error: "Failed to get zone" });
    }
  });

  app.post("/api/chronicles/world/enter-zone", isChroniclesAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getPlayUserId(req);
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      const { era, zoneId } = req.body;
      if (!era || !zoneId) return res.status(400).json({ error: "era and zoneId required" });

      const zones = WORLD_ZONES[era];
      if (!zones?.find(z => z.id === zoneId)) {
        return res.status(400).json({ error: "Invalid zone" });
      }

      await db.update(zonePresence)
        .set({ isActive: false })
        .where(and(eq(zonePresence.userId, userId), eq(zonePresence.isActive, true)));

      await db.insert(zonePresence).values({
        userId,
        era,
        zoneId,
        isActive: true,
      });

      await db.update(chroniclesGameState)
        .set({ currentZone: zoneId, updatedAt: new Date() })
        .where(eq(chroniclesGameState.userId, userId));

      const ambient = getZoneAmbientState(era, zoneId);

      let arrivalNarrative = "";
      try {
        const zone = WORLD_ZONES[era]?.find(z => z.id === zoneId);
        const time = getWorldTimeInfo(era);
        const npcsHere = ambient?.npcsPresent || [];
        const activitiesHere = ambient?.activities || [];

        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{
            role: "system",
            content: `You are narrating a living world scene in a ${era} era parallel life simulation. The player just walked into ${zone?.name}. Describe what they see happening — the ambient life, people doing things, sounds, smells. This is a LIVING scene already in progress. 2-3 vivid sentences. Present tense.

TIME: ${time.period} (${time.hour}:${String(time.minute).padStart(2, "0")})
ZONE: ${zone?.name} — ${zone?.description}
${npcsHere.length > 0 ? `NPCs HERE: ${npcsHere.map(n => `${n.name} (${n.activity})`).join(", ")}` : "No notable people around."}
${activitiesHere.length > 0 ? `ACTIVITIES HAPPENING: ${activitiesHere.map(a => `${a.name} — ${a.description}`).join("; ")}` : ""}

Write the scene as if the player is stepping into it. The world doesn't stop for them — they're joining what's already happening.`
          }],
          max_completion_tokens: 200,
        });
        arrivalNarrative = response.choices[0]?.message?.content || "";
      } catch {
        const zone = WORLD_ZONES[era]?.find(z => z.id === zoneId);
        arrivalNarrative = `You arrive at ${zone?.name}. ${zone?.description}.`;
      }

      const gameLog = JSON.parse((await db.select().from(chroniclesGameState).where(eq(chroniclesGameState.userId, userId)))[0]?.gameLog as string || "[]");
      gameLog.unshift({
        timestamp: new Date().toISOString(),
        type: "zone_enter",
        message: `Arrived at ${WORLD_ZONES[era]?.find(z => z.id === zoneId)?.name}`,
      });
      if (gameLog.length > 50) gameLog.length = 50;
      await db.update(chroniclesGameState)
        .set({ gameLog: JSON.stringify(gameLog), updatedAt: new Date() })
        .where(eq(chroniclesGameState.userId, userId));

      res.json({
        zoneId,
        arrivalNarrative,
        ambient,
      });
    } catch (error: any) {
      console.error("Enter zone error:", error);
      res.status(500).json({ error: "Failed to enter zone" });
    }
  });

  app.post("/api/chronicles/world/heartbeat", isChroniclesAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getPlayUserId(req);
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      await db.update(zonePresence)
        .set({ lastHeartbeat: new Date() })
        .where(and(eq(zonePresence.userId, userId), eq(zonePresence.isActive, true)));
      res.json({ ok: true });
    } catch (error: any) {
      res.status(500).json({ error: "Heartbeat failed" });
    }
  });

  app.post("/api/chronicles/world/do-activity", isChroniclesAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getPlayUserId(req);
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      const { activityId, era } = req.body;
      if (!activityId || !era) return res.status(400).json({ error: "activityId and era required" });

      const eraPrefix = era === "modern" ? "mod_" : era === "medieval" ? "med_" : "ww_";
      const activity = ZONE_ACTIVITIES.find(a => a.id === activityId && a.id.startsWith(eraPrefix));
      if (!activity) return res.status(404).json({ error: "Activity not found" });

      if (activity.activityType === "minigame" && activity.minigameType) {
        return res.json({
          type: "minigame",
          minigameType: activity.minigameType,
          config: MINIGAME_CONFIGS[activity.minigameType],
          activity,
        });
      }

      const state = await db.select().from(chroniclesGameState).where(eq(chroniclesGameState.userId, userId));
      if (!state[0]) return res.status(404).json({ error: "No game state" });
      const playerLevel = state[0].level || 1;
      if (playerLevel < activity.requiredLevel) {
        return res.status(403).json({ error: `Requires level ${activity.requiredLevel}` });
      }

      let narrative = "";
      try {
        const time = getWorldTimeInfo(era);
        const npcContext = activity.npcNames.length > 0
          ? `NPCs involved: ${activity.npcNames.join(", ")}. Write them in character.`
          : "";

        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{
            role: "system",
            content: `You are narrating a ${era} era living world activity. The player is participating in: "${activity.name}" — ${activity.description}. Time: ${time.period}. ${npcContext}
${activity.toolsInvolved ? `Tools/equipment involved: ${activity.toolsInvolved.join(", ")}` : ""}

Write 2-3 vivid sentences of what happens. Include sensory details. If NPCs are present, show them reacting naturally. The activity should feel authentic to the era. End with a sense of accomplishment or progression.`
          }],
          max_completion_tokens: 200,
        });
        narrative = response.choices[0]?.message?.content || `You participate in ${activity.name}.`;
      } catch {
        narrative = `You spend time at ${activity.name}. ${activity.description}`;
      }

      const newEchoes = (state[0].echoBalance || 0) + activity.echoReward;
      const newExperience = (state[0].experience || 0) + activity.xpReward;

      const gameLog = JSON.parse(state[0].gameLog as string || "[]");
      gameLog.unshift({
        timestamp: new Date().toISOString(),
        type: "activity",
        message: `${activity.emoji} ${activity.name}: +${activity.echoReward} Echoes, +${activity.xpReward} XP`,
      });
      if (gameLog.length > 50) gameLog.length = 50;

      await db.update(chroniclesGameState)
        .set({
          echoBalance: newEchoes,
          experience: newExperience,
          gameLog: JSON.stringify(gameLog),
          currentActivity: activity.name,
          updatedAt: new Date(),
        })
        .where(eq(chroniclesGameState.userId, userId));

      res.json({
        type: "activity_complete",
        narrative,
        rewards: { echoes: activity.echoReward, xp: activity.xpReward },
        activity,
      });
    } catch (error: any) {
      console.error("Do activity error:", error);
      res.status(500).json({ error: "Failed to do activity" });
    }
  });

  app.post("/api/chronicles/world/minigame/submit", isChroniclesAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getPlayUserId(req);
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      const { gameType, score, era, zoneId } = req.body;
      if (!gameType || score === undefined || !era) {
        return res.status(400).json({ error: "gameType, score, and era required" });
      }

      const config = MINIGAME_CONFIGS[gameType];
      if (!config) return res.status(400).json({ error: "Invalid game type" });

      const clampedScore = Math.min(Math.max(0, score), config.maxScore);
      const echosEarned = Math.round(clampedScore * config.echoMultiplier);
      const xpEarned = Math.round(clampedScore * 0.2);

      const existing = await db.select().from(minigameSessions)
        .where(and(eq(minigameSessions.userId, userId), eq(minigameSessions.gameType, gameType)))
        .orderBy(desc(minigameSessions.highScore))
        .limit(1);

      const previousHigh = existing[0]?.highScore || 0;
      const isNewHigh = clampedScore > previousHigh;

      await db.insert(minigameSessions).values({
        userId,
        era,
        zoneId: zoneId || "unknown",
        gameType,
        score: clampedScore,
        highScore: isNewHigh ? clampedScore : previousHigh,
        result: clampedScore >= 80 ? "excellent" : clampedScore >= 50 ? "good" : "practice",
        echosEarned,
      });

      const state = await db.select().from(chroniclesGameState).where(eq(chroniclesGameState.userId, userId));
      if (state[0]) {
        const newEchoes = (state[0].echoBalance || 0) + echosEarned;
        const newExperience = (state[0].experience || 0) + xpEarned;

        const gameLog = JSON.parse(state[0].gameLog as string || "[]");
        gameLog.unshift({
          timestamp: new Date().toISOString(),
          type: "minigame",
          message: `${config.emoji} ${config.name}: Score ${clampedScore}${isNewHigh ? " (NEW HIGH SCORE!)" : ""} — +${echosEarned} Echoes`,
        });
        if (gameLog.length > 50) gameLog.length = 50;

        await db.update(chroniclesGameState)
          .set({
            echoBalance: newEchoes,
            experience: newExperience,
            gameLog: JSON.stringify(gameLog),
            updatedAt: new Date(),
          })
          .where(eq(chroniclesGameState.userId, userId));
      }

      res.json({
        score: clampedScore,
        highScore: isNewHigh ? clampedScore : previousHigh,
        isNewHighScore: isNewHigh,
        echosEarned,
        xpEarned,
        result: clampedScore >= 80 ? "excellent" : clampedScore >= 50 ? "good" : "practice",
        gameName: config.name,
      });
    } catch (error: any) {
      console.error("Minigame submit error:", error);
      res.status(500).json({ error: "Failed to submit score" });
    }
  });

  app.get("/api/chronicles/world/minigame/scores/:gameType", isChroniclesAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getPlayUserId(req);
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      const { gameType } = req.params;
      const config = MINIGAME_CONFIGS[gameType];
      if (!config) return res.status(400).json({ error: "Invalid game type" });

      const sessions = await db.select().from(minigameSessions)
        .where(and(eq(minigameSessions.userId, userId), eq(minigameSessions.gameType, gameType)))
        .orderBy(desc(minigameSessions.playedAt))
        .limit(10);

      const highScore = sessions.reduce((max, s) => Math.max(max, s.score), 0);
      const totalEchoes = sessions.reduce((sum, s) => sum + s.echosEarned, 0);

      res.json({
        gameType,
        gameName: config.name,
        sessions,
        highScore,
        totalEchoes,
        gamesPlayed: sessions.length,
      });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to get scores" });
    }
  });

  // =====================================================
  // TUTORIAL PROGRESS
  // =====================================================

  app.post("/api/chronicles/tutorial/progress", isChroniclesAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getPlayUserId(req);
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      const { step, completed } = req.body;

      const updates: any = { updatedAt: new Date() };
      if (typeof step === "number") updates.tutorialStep = step;
      if (typeof completed === "boolean") updates.tutorialCompleted = completed;

      await db.update(chroniclesGameState)
        .set(updates)
        .where(eq(chroniclesGameState.userId, userId));

      res.json({ success: true, step, completed });
    } catch (error: any) {
      console.error("Tutorial progress error:", error);
      res.status(500).json({ error: "Failed to update tutorial" });
    }
  });

  app.get("/api/chronicles/tutorial/status", isChroniclesAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getPlayUserId(req);
      if (!userId) return res.status(401).json({ error: "Authentication required" });
      const state = await db.select().from(chroniclesGameState).where(eq(chroniclesGameState.userId, userId));
      if (!state[0]) return res.json({ tutorialStep: 0, tutorialCompleted: false });
      res.json({
        tutorialStep: state[0].tutorialStep || 0,
        tutorialCompleted: state[0].tutorialCompleted || false,
      });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to get tutorial status" });
    }
  });
}
