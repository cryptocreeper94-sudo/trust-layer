import { db } from "./db";
import { eq, sql, and, desc } from "drizzle-orm";
import { chroniclesGameState, playerChoices, playerPersonalities, chronicleAccounts } from "@shared/schema";
import OpenAI from "openai";
import { SEASON_ZERO_QUESTS, STARTER_FACTIONS, STARTER_NPCS, ERA_SETTINGS, ERAS } from "./chronicles-service";
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
  return req.chroniclesUser?.id || req.chroniclesAccount?.userId || req.chroniclesAccount?.id || req.query?.userId as string || null;
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
      const allInvolved = [...new Set([...(npcInvolved ? [npcInvolved] : []), ...involvedNpcs])];
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
}
