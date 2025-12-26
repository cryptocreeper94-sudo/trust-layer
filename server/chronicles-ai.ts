/**
 * =====================================================
 * DARKWAVE CHRONICLES - PERSONALITY AI ENGINE
 * =====================================================
 * 
 * This engine powers the "Parallel Self" experience in DarkWave Chronicles.
 * The AI learns from player choices, beliefs, and emotional responses to
 * become a personalized representation of the player in the fantasy world.
 * 
 * CORE PHILOSOPHY:
 * - The player IS the hero, not just controlling one
 * - The AI adapts its responses based on who the player actually is
 * - Every choice shapes how the world perceives and reacts to the player
 * - The "Many Lenses" design means reality itself shifts based on beliefs
 * 
 * 5-AXIS EMOTION SYSTEM:
 * Each axis ranges from -100 to +100
 * 1. Courage ↔ Fear: How the player faces danger and uncertainty
 * 2. Hope ↔ Despair: Outlook on the future and possibilities
 * 3. Trust ↔ Suspicion: Relationship with NPCs and institutions
 * 4. Passion ↔ Apathy: Emotional investment in causes and people
 * 5. Wisdom ↔ Recklessness: Decision-making approach
 * 
 * BELIEF SYSTEM LAYER:
 * - Worldview: optimist / realist / pessimist
 * - Choice Tendencies: How you naturally approach decisions (NO moral labels)
 * - Core Values: justice, freedom, power, knowledge, love, loyalty, etc.
 * - Faction Affinity: Game-world political leanings
 * 
 * IMPORTANT: This system does NOT judge choices as "good" or "evil"
 * It only observes patterns in how you make decisions. Free will, not morality.
 * 
 * USAGE:
 * 1. Create or load player personality profile
 * 2. Generate scenarios that adapt to their personality
 * 3. Process choices and update personality model
 * 4. AI responses reflect who the player has become
 */

import OpenAI from "openai";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";
import { 
  playerPersonalities, 
  playerChoices, 
  chroniclesConversations,
  type PlayerPersonality,
  type InsertPlayerPersonality 
} from "@shared/schema";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

// Archetypes based on personality patterns
const ARCHETYPES = {
  guardian: { 
    name: "The Guardian",
    description: "Protector of the innocent, defender of justice",
    traits: ["high courage", "high trust", "values: justice, protection"]
  },
  seeker: {
    name: "The Seeker", 
    description: "Pursuer of truth, knowledge above all",
    traits: ["high wisdom", "balanced trust", "values: knowledge, truth"]
  },
  rebel: {
    name: "The Rebel",
    description: "Challenger of authority, freedom fighter",
    traits: ["high passion", "low trust", "values: freedom, change"]
  },
  sage: {
    name: "The Sage",
    description: "Wise counselor, patient strategist",
    traits: ["high wisdom", "balanced emotions", "values: wisdom, peace"]
  },
  champion: {
    name: "The Champion",
    description: "Bold warrior, inspirer of hope",
    traits: ["high courage", "high hope", "values: honor, glory"]
  },
  shadow: {
    name: "The Shadow",
    description: "Master of secrets, pragmatic survivor",
    traits: ["high suspicion", "balanced fear", "values: survival, power"]
  },
  healer: {
    name: "The Healer",
    description: "Compassionate soul, restorer of broken things",
    traits: ["high hope", "high trust", "values: love, healing"]
  },
  wanderer: {
    name: "The Wanderer",
    description: "Free spirit, seeker of experience",
    traits: ["balanced all", "values: freedom, adventure"]
  }
};

const CORE_VALUES = [
  "justice", "freedom", "power", "knowledge", "love", 
  "loyalty", "honor", "survival", "peace", "adventure",
  "truth", "family", "wealth", "glory", "vengeance"
];

// Choice Tendencies - NO moral judgment, just patterns of decision-making
// This system observes HOW you choose, not WHETHER choices are "right"
const CHOICE_TENDENCIES = {
  // Structure Preference: How you relate to rules and systems
  structure: ["follows_structure", "adapts_to_context", "challenges_systems"],
  // Priority Focus: What drives your decisions
  priority: ["self_focused", "inner_circle", "greater_whole", "principles_first"],
  // Action Style: How you approach action
  action: ["cautious_observer", "balanced_responder", "bold_initiator"],
};

// Legacy alias for backwards compatibility (but we'll phase this out)
const MORAL_ALIGNMENTS = [
  "follows_structure", "adapts_to_context", "challenges_systems",
  "self_focused", "inner_circle", "greater_whole", 
  "principles_first", "balanced", "independent"
];

export interface EmotionalState {
  courageFear: number;
  hopeDespair: number;
  trustSuspicion: number;
  passionApathy: number;
  wisdomRecklessness: number;
}

export interface ScenarioContext {
  era: string;
  location: string;
  situation: string;
  npcPresent?: string;
  previousChoices?: string[];
}

export interface GeneratedScenario {
  description: string;
  options: string[];
  emotionalWeight: Partial<EmotionalState>;
  scenarioType: "moral_dilemma" | "combat" | "social" | "exploration";
}

export interface AIResponse {
  message: string;
  emotionalTone: string;
  personalityInsight?: string;
}

/**
 * Chronicles Personality AI Engine
 */
export const chroniclesAI = {
  /**
   * Get or create a player's personality profile
   */
  async getOrCreatePersonality(userId: string, playerName?: string): Promise<PlayerPersonality> {
    const existing = await db
      .select()
      .from(playerPersonalities)
      .where(eq(playerPersonalities.userId, userId))
      .limit(1);
    
    if (existing[0]) {
      return existing[0];
    }
    
    const result = await db
      .insert(playerPersonalities)
      .values({
        userId,
        playerName: playerName || "Hero",
        coreValues: [],
      })
      .returning();
    
    return result[0];
  },

  /**
   * Get a player's current emotional state
   */
  getEmotionalState(personality: PlayerPersonality): EmotionalState {
    return {
      courageFear: personality.courageFear,
      hopeDespair: personality.hopeDespair,
      trustSuspicion: personality.trustSuspicion,
      passionApathy: personality.passionApathy,
      wisdomRecklessness: personality.wisdomRecklessness,
    };
  },

  /**
   * Describe the emotional state in human-readable terms
   */
  describeEmotionalState(state: EmotionalState): string {
    const descriptions: string[] = [];
    
    if (state.courageFear > 30) descriptions.push("courageous and bold");
    else if (state.courageFear < -30) descriptions.push("cautious and fearful");
    
    if (state.hopeDespair > 30) descriptions.push("hopeful about the future");
    else if (state.hopeDespair < -30) descriptions.push("shadowed by despair");
    
    if (state.trustSuspicion > 30) descriptions.push("trusting of others");
    else if (state.trustSuspicion < -30) descriptions.push("suspicious and guarded");
    
    if (state.passionApathy > 30) descriptions.push("passionate and driven");
    else if (state.passionApathy < -30) descriptions.push("detached and apathetic");
    
    if (state.wisdomRecklessness > 30) descriptions.push("wise and measured");
    else if (state.wisdomRecklessness < -30) descriptions.push("reckless and impulsive");
    
    return descriptions.length > 0 
      ? descriptions.join(", ") 
      : "emotionally balanced";
  },

  /**
   * Predict archetype based on personality
   */
  predictArchetype(personality: PlayerPersonality): keyof typeof ARCHETYPES {
    const state = this.getEmotionalState(personality);
    const values = personality.coreValues || [];
    
    if (state.courageFear > 40 && state.trustSuspicion > 20 && values.includes("justice")) {
      return "guardian";
    }
    if (state.wisdomRecklessness > 40 && values.includes("knowledge")) {
      return "seeker";
    }
    if (state.passionApathy > 30 && state.trustSuspicion < -20 && values.includes("freedom")) {
      return "rebel";
    }
    if (state.wisdomRecklessness > 50 && state.passionApathy > -20) {
      return "sage";
    }
    if (state.courageFear > 40 && state.hopeDespair > 30) {
      return "champion";
    }
    if (state.trustSuspicion < -30 && values.includes("survival")) {
      return "shadow";
    }
    if (state.hopeDespair > 40 && state.trustSuspicion > 30 && values.includes("love")) {
      return "healer";
    }
    return "wanderer";
  },

  /**
   * Generate a scenario adapted to the player's personality
   */
  async generateScenario(
    personality: PlayerPersonality, 
    context: ScenarioContext
  ): Promise<GeneratedScenario> {
    const emotionalState = this.describeEmotionalState(this.getEmotionalState(personality));
    const archetype = ARCHETYPES[this.predictArchetype(personality)];
    
    const systemPrompt = `You are the DarkWave Chronicles narrative AI. Generate scenarios that challenge and explore the player's personality.

PLAYER PROFILE:
- Name: ${personality.parallelSelfName || personality.playerName}
- Archetype: ${archetype.name} - ${archetype.description}
- Emotional State: ${emotionalState}
- Worldview: ${personality.worldview}
- Choice Tendency: ${personality.moralAlignment.replace("_", " ")}
- Core Values: ${(personality.coreValues || []).join(", ") || "undefined"}
- Decision Style: ${personality.decisionStyle}
- Conflict Approach: ${personality.conflictApproach}

CONTEXT:
- Era: ${context.era}
- Location: ${context.location}
- Situation: ${context.situation}
${context.npcPresent ? `- NPC Present: ${context.npcPresent}` : ""}

Generate a scenario that:
1. Tests their core values or challenges their worldview
2. Offers 4 meaningful choices that reflect different approaches
3. Has real consequences based on their archetype
4. Adapts to their decision style

Respond in JSON format:
{
  "description": "Vivid narrative description of the scenario (2-3 paragraphs)",
  "options": ["Choice 1", "Choice 2", "Choice 3", "Choice 4"],
  "scenarioType": "moral_dilemma|combat|social|exploration",
  "emotionalWeight": {
    "courageFear": number (-20 to 20),
    "hopeDespair": number (-20 to 20),
    "trustSuspicion": number (-20 to 20),
    "passionApathy": number (-20 to 20),
    "wisdomRecklessness": number (-20 to 20)
  }
}`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Generate a scenario for this player." }
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 1500,
      });

      const content = response.choices[0]?.message?.content || "{}";
      return JSON.parse(content);
    } catch (error) {
      console.error("Scenario generation error:", error);
      return {
        description: "You stand at a crossroads, uncertain of your path.",
        options: ["Press forward boldly", "Proceed with caution", "Seek another way", "Wait and observe"],
        emotionalWeight: {},
        scenarioType: "exploration"
      };
    }
  },

  /**
   * Process a player's choice and update their personality
   */
  async processChoice(
    personalityId: string,
    scenario: GeneratedScenario,
    chosenOption: string,
    choiceReasoning?: string,
    era?: string
  ): Promise<{ updatedPersonality: PlayerPersonality; insight: string }> {
    const personality = await db
      .select()
      .from(playerPersonalities)
      .where(eq(playerPersonalities.id, personalityId))
      .limit(1);
    
    if (!personality[0]) {
      throw new Error("Personality not found");
    }

    const analyzePrompt = `Analyze this player's choice and determine personality impact.

CURRENT STATE:
${JSON.stringify(this.getEmotionalState(personality[0]))}

SCENARIO: ${scenario.description}
OPTIONS: ${scenario.options.join(" | ")}
CHOSEN: ${chosenOption}
${choiceReasoning ? `REASONING: ${choiceReasoning}` : ""}

Respond in JSON:
{
  "emotionalShift": {
    "courageFear": number (-15 to 15),
    "hopeDespair": number (-15 to 15),
    "trustSuspicion": number (-15 to 15),
    "passionApathy": number (-15 to 15),
    "wisdomRecklessness": number (-15 to 15)
  },
  "alignmentHint": "string describing any moral alignment shift",
  "insight": "What this choice reveals about the player (1-2 sentences)"
}`;

    let emotionalShift = scenario.emotionalWeight || {};
    let insight = "Your choice has been noted.";

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You analyze player choices in a fantasy RPG to understand their personality." },
          { role: "user", content: analyzePrompt }
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 500,
      });

      const analysis = JSON.parse(response.choices[0]?.message?.content || "{}");
      emotionalShift = analysis.emotionalShift || emotionalShift;
      insight = analysis.insight || insight;
    } catch (error) {
      console.error("Choice analysis error:", error);
    }

    const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));
    
    const newState = {
      courageFear: clamp(personality[0].courageFear + (emotionalShift.courageFear || 0), -100, 100),
      hopeDespair: clamp(personality[0].hopeDespair + (emotionalShift.hopeDespair || 0), -100, 100),
      trustSuspicion: clamp(personality[0].trustSuspicion + (emotionalShift.trustSuspicion || 0), -100, 100),
      passionApathy: clamp(personality[0].passionApathy + (emotionalShift.passionApathy || 0), -100, 100),
      wisdomRecklessness: clamp(personality[0].wisdomRecklessness + (emotionalShift.wisdomRecklessness || 0), -100, 100),
    };

    await db.insert(playerChoices).values({
      personalityId,
      scenarioType: scenario.scenarioType,
      scenarioDescription: scenario.description,
      era: era || null,
      optionsPresented: scenario.options,
      chosenOption,
      choiceReasoning: choiceReasoning || null,
      emotionalImpact: JSON.stringify(emotionalShift),
    });

    const updated = await db
      .update(playerPersonalities)
      .set({
        ...newState,
        totalChoicesMade: sql`${playerPersonalities.totalChoicesMade} + 1`,
        lastInteractionAt: new Date(),
        predictedArchetype: ARCHETYPES[this.predictArchetype({ ...personality[0], ...newState })].name,
        updatedAt: new Date(),
      })
      .where(eq(playerPersonalities.id, personalityId))
      .returning();

    return { updatedPersonality: updated[0], insight };
  },

  /**
   * Generate an AI response as the player's parallel self
   */
  async generateParallelSelfResponse(
    personality: PlayerPersonality,
    userMessage: string,
    context?: { era?: string; situation?: string }
  ): Promise<AIResponse> {
    const emotionalState = this.describeEmotionalState(this.getEmotionalState(personality));
    const archetype = ARCHETYPES[this.predictArchetype(personality)];

    const systemPrompt = `You ARE ${personality.parallelSelfName || personality.playerName}, the player's parallel self in DarkWave Chronicles.

YOUR IDENTITY:
- Archetype: ${archetype.name} - ${archetype.description}
- Emotional State: ${emotionalState}
- Worldview: ${personality.worldview}
- Choice Tendency: ${personality.moralAlignment.replace("_", " ")}
- Core Values: ${(personality.coreValues || []).join(", ") || "honor, adventure"}
- Decision Style: ${personality.decisionStyle}
- Conflict Approach: ${personality.conflictApproach}

${context?.era ? `CURRENT ERA: ${context.era}` : ""}
${context?.situation ? `SITUATION: ${context.situation}` : ""}

INSTRUCTIONS:
- Respond as if you ARE this person - their parallel self in another reality
- Your responses should reflect their personality, values, and emotional state
- Speak in first person, with their voice and perspective
- Be authentic to who they are, not generic
- Keep responses conversational but meaningful (2-4 sentences typically)`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        max_completion_tokens: 300,
      });

      return {
        message: response.choices[0]?.message?.content || "I sense a disturbance in my thoughts...",
        emotionalTone: emotionalState,
        personalityInsight: `Speaking as ${archetype.name}`,
      };
    } catch (error) {
      console.error("Parallel self response error:", error);
      return {
        message: "The connection to your parallel self wavers momentarily...",
        emotionalTone: "uncertain",
      };
    }
  },

  /**
   * Generate a personality summary
   */
  async generatePersonalitySummary(personality: PlayerPersonality): Promise<string> {
    const archetype = ARCHETYPES[this.predictArchetype(personality)];
    const emotionalState = this.describeEmotionalState(this.getEmotionalState(personality));

    const prompt = `Create a 2-3 sentence personality summary for this Chronicles player:

Archetype: ${archetype.name}
Emotional State: ${emotionalState}
Worldview: ${personality.worldview}
Choice Pattern: ${personality.moralAlignment}
Values: ${(personality.coreValues || []).join(", ")}
Choices Made: ${personality.totalChoicesMade}

Write it as if describing a legendary hero - poetic but insightful.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "user", content: prompt }
        ],
        max_completion_tokens: 200,
      });

      return response.choices[0]?.message?.content || `A ${archetype.name.toLowerCase()} walks the paths of destiny.`;
    } catch (error) {
      return `A ${archetype.name.toLowerCase()} walks the paths of destiny, their ${emotionalState} spirit guiding them.`;
    }
  },

  /**
   * Update core values based on observed patterns
   */
  async updateCoreValues(
    personalityId: string, 
    newValues: string[]
  ): Promise<PlayerPersonality> {
    const validValues = newValues.filter(v => CORE_VALUES.includes(v)).slice(0, 5);
    
    const updated = await db
      .update(playerPersonalities)
      .set({
        coreValues: validValues,
        updatedAt: new Date(),
      })
      .where(eq(playerPersonalities.id, personalityId))
      .returning();
    
    return updated[0];
  },

  ARCHETYPES,
  CORE_VALUES,
  MORAL_ALIGNMENTS,
};

export default chroniclesAI;
