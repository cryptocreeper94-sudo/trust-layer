/**
 * DarkWave Chronicles - Game Service
 * Backend service for the Chronicles parallel life experience
 */

import { createHash } from "crypto";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import OpenAI from "openai";

// Initialize OpenAI for NPC AI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Era definitions
export const ERAS = {
  ancient: { name: "Ancient Era", years: "3000 BCE - 500 CE", color: "#8B4513" },
  medieval: { name: "Medieval Era", years: "500 - 1500 CE", color: "#4A5568" },
  renaissance: { name: "Renaissance", years: "1400 - 1700 CE", color: "#D4AF37" },
  industrial: { name: "Industrial Age", years: "1760 - 1914 CE", color: "#6B7280" },
  modern: { name: "Modern Era", years: "1914 - 2000 CE", color: "#3B82F6" },
  future: { name: "Future Age", years: "2100+ CE", color: "#8B5CF6" },
} as const;

// Faction definitions for Season Zero
export const STARTER_FACTIONS = [
  {
    id: "house_of_crowns",
    name: "House of Crowns",
    description: "The royal bloodlines seeking to maintain order through hereditary rule. They value tradition, stability, and the chain of command.",
    ideology: "order",
    color: "#D4AF37",
    iconEmoji: "👑",
    era: "medieval",
  },
  {
    id: "shadow_council",
    name: "The Shadow Council",
    description: "A secretive organization pulling strings from behind the scenes. They believe true power lies in information and manipulation.",
    ideology: "chaos",
    color: "#4A5568",
    iconEmoji: "🗝️",
    era: "medieval",
  },
  {
    id: "merchant_guild",
    name: "Merchant's Guild",
    description: "The economic powerhouse controlling trade routes. They seek balance through commerce and believe wealth equals influence.",
    ideology: "balance",
    color: "#10B981",
    iconEmoji: "⚖️",
    era: "medieval",
  },
  {
    id: "innovators_circle",
    name: "Innovator's Circle",
    description: "Forward-thinking visionaries pushing the boundaries of knowledge. They believe progress is the only path to salvation.",
    ideology: "progress",
    color: "#3B82F6",
    iconEmoji: "🔮",
    era: "medieval",
  },
  {
    id: "old_faith",
    name: "The Old Faith",
    description: "Keepers of ancient traditions and sacred rites. They protect the old ways and resist change that threatens their beliefs.",
    ideology: "tradition",
    color: "#8B4513",
    iconEmoji: "🌿",
    era: "medieval",
  },
];

// Season Zero quests
export const SEASON_ZERO_QUESTS = [
  {
    id: "arrival",
    title: "Arrival in the Realm",
    description: "You awaken in a strange land with no memory of how you arrived. A mysterious figure offers guidance...",
    era: "medieval",
    difficulty: "easy",
    shellsReward: "50",
    experienceReward: 100,
    category: "main_story",
  },
  {
    id: "faction_choice",
    title: "The Faction Choice",
    description: "Five powers vie for control. Each offers a path, each demands loyalty. Choose wisely, for this decision will shape your destiny.",
    era: "medieval",
    difficulty: "medium",
    shellsReward: "100",
    experienceReward: 200,
    category: "main_story",
    prerequisite: "arrival",
  },
  {
    id: "first_council",
    title: "The First Council",
    description: "Your faction calls a meeting. War is brewing. Your voice could tip the balance...",
    era: "medieval",
    difficulty: "medium",
    shellsReward: "150",
    experienceReward: 300,
    category: "faction",
    prerequisite: "faction_choice",
  },
  {
    id: "shadows_whisper",
    title: "Shadows Whisper",
    description: "An informant approaches with secrets that could change everything. But can they be trusted?",
    era: "medieval",
    difficulty: "hard",
    shellsReward: "200",
    experienceReward: 400,
    category: "side_quest",
  },
];

// NPC templates for Season Zero
export const STARTER_NPCS = [
  {
    name: "Lord Aldric",
    title: "High Chancellor",
    era: "medieval",
    factionId: "house_of_crowns",
    personality: JSON.stringify({
      traits: ["authoritative", "calculating", "honorable"],
      goals: ["maintain order", "preserve the realm"],
      fears: ["chaos", "loss of control"],
      speakingStyle: "formal and measured",
    }),
    backstory: "Once a mere steward, Aldric rose through cunning and loyalty to become the realm's most powerful advisor.",
  },
  {
    name: "Sera Nightwhisper",
    title: "The Silent Blade",
    era: "medieval",
    factionId: "shadow_council",
    personality: JSON.stringify({
      traits: ["mysterious", "pragmatic", "intelligent"],
      goals: ["gather information", "manipulate outcomes"],
      fears: ["exposure", "betrayal"],
      speakingStyle: "cryptic and suggestive",
    }),
    backstory: "No one knows Sera's true origin. She simply appeared one day, knowing secrets that should have been impossible.",
  },
  {
    name: "Marcus Goldhand",
    title: "Guildmaster",
    era: "medieval",
    factionId: "merchant_guild",
    personality: JSON.stringify({
      traits: ["pragmatic", "jovial", "shrewd"],
      goals: ["expand trade", "accumulate wealth"],
      fears: ["bankruptcy", "losing influence"],
      speakingStyle: "friendly but calculating",
    }),
    backstory: "From humble beginnings as a dock worker, Marcus built an empire of trade that now spans the realm.",
  },
];

export interface ChroniclesService {
  // Character management
  createCharacter(userId: string, name: string, era?: string): Promise<any>;
  getCharacter(userId: string): Promise<any>;
  getCharacterStats(characterId: string): Promise<any>;
  
  // Quest system
  getAvailableQuests(characterId: string): Promise<any[]>;
  startQuest(characterId: string, questId: string): Promise<any>;
  makeDecision(characterId: string, questId: string, decisionId: string): Promise<any>;
  completeQuest(characterId: string, questId: string): Promise<any>;
  
  // NPC interactions
  talkToNpc(characterId: string, npcId: string, message: string): Promise<any>;
  getNpcDisposition(characterId: string, npcId: string): Promise<any>;
  
  // Faction system
  joinFaction(characterId: string, factionId: string): Promise<any>;
  getFactionStanding(characterId: string): Promise<any[]>;
  
  // Chronicle Proofs (blockchain attestation)
  createChronicleProof(characterId: string, proofType: string, title: string, decisionData: any): Promise<any>;
  getChronicleProofs(characterId: string): Promise<any[]>;
  
  // Season management
  getCurrentSeason(): Promise<any>;
  getSeasonLeaderboard(): Promise<any[]>;
}

class ChroniclesGameService implements ChroniclesService {
  
  async createCharacter(userId: string, name: string, era = "medieval") {
    const character = {
      id: `chr_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      userId,
      name,
      era,
      level: 1,
      experience: 0,
      wisdom: 10,
      courage: 10,
      compassion: 10,
      cunning: 10,
      influence: 10,
      shellsEarned: "0",
      questsCompleted: 0,
      decisionsRecorded: 0,
      createdAt: new Date(),
    };
    
    console.log(`[Chronicles] Created character: ${name} for user ${userId}`);
    return character;
  }
  
  async getCharacter(userId: string) {
    // In production, query database
    return null;
  }
  
  async getCharacterStats(characterId: string) {
    return {
      level: 1,
      experience: 0,
      nextLevelXp: 1000,
      attributes: {
        wisdom: 10,
        courage: 10,
        compassion: 10,
        cunning: 10,
        influence: 10,
      },
      shellsEarned: "0",
      questsCompleted: 0,
      decisionsRecorded: 0,
    };
  }
  
  async getAvailableQuests(characterId: string) {
    return SEASON_ZERO_QUESTS.filter(q => !q.prerequisite);
  }
  
  async startQuest(characterId: string, questId: string) {
    const quest = SEASON_ZERO_QUESTS.find(q => q.id === questId);
    if (!quest) throw new Error("Quest not found");
    
    return {
      id: `qi_${Date.now()}`,
      characterId,
      questId,
      status: "active",
      progress: 0,
      startedAt: new Date(),
      quest,
    };
  }
  
  async makeDecision(characterId: string, questId: string, decisionId: string) {
    const decisionHash = createHash("sha256")
      .update(`${characterId}:${questId}:${decisionId}:${Date.now()}`)
      .digest("hex");
    
    return {
      success: true,
      decisionId,
      decisionHash,
      consequences: "Your choice ripples through the realm...",
      attributeChanges: {
        courage: Math.floor(Math.random() * 3) - 1,
        wisdom: Math.floor(Math.random() * 3) - 1,
      },
    };
  }
  
  async completeQuest(characterId: string, questId: string) {
    const quest = SEASON_ZERO_QUESTS.find(q => q.id === questId);
    if (!quest) throw new Error("Quest not found");
    
    return {
      success: true,
      questId,
      shellsAwarded: quest.shellsReward,
      experienceAwarded: quest.experienceReward,
      completedAt: new Date(),
    };
  }
  
  async talkToNpc(characterId: string, npcId: string, message: string) {
    const npc = STARTER_NPCS.find(n => n.name.toLowerCase().replace(/\s+/g, '_') === npcId);
    if (!npc) throw new Error("NPC not found");
    
    const personality = JSON.parse(npc.personality);
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are ${npc.name}, ${npc.title} in a medieval fantasy world. 
Personality traits: ${personality.traits.join(", ")}
Speaking style: ${personality.speakingStyle}
Goals: ${personality.goals.join(", ")}
Backstory: ${npc.backstory}

Stay in character. Be concise (2-3 sentences max). Your faction is important to you.`
          },
          { role: "user", content: message }
        ],
        max_tokens: 150,
      });
      
      const aiResponse = response.choices[0]?.message?.content || "The NPC regards you silently.";
      
      // Generate AI proof hash
      const proofHash = createHash("sha256")
        .update(`ai:${npcId}:${message}:${aiResponse}:${Date.now()}`)
        .digest("hex");
      
      return {
        npc: { name: npc.name, title: npc.title },
        response: aiResponse,
        aiProofHash: proofHash,
        aiModel: "gpt-4o",
        verified: true,
      };
    } catch (error) {
      console.error("[Chronicles] NPC AI error:", error);
      return {
        npc: { name: npc.name, title: npc.title },
        response: "The NPC seems distracted and doesn't respond.",
        error: true,
      };
    }
  }
  
  async getNpcDisposition(characterId: string, npcId: string) {
    return {
      npcId,
      disposition: 50,
      rank: "neutral",
    };
  }
  
  async joinFaction(characterId: string, factionId: string) {
    const faction = STARTER_FACTIONS.find(f => f.id === factionId);
    if (!faction) throw new Error("Faction not found");
    
    return {
      success: true,
      faction,
      message: `You have pledged your loyalty to ${faction.name}. May your path be true.`,
    };
  }
  
  async getFactionStanding(characterId: string) {
    return STARTER_FACTIONS.map(f => ({
      faction: f,
      reputation: 0,
      rank: "neutral",
    }));
  }
  
  async createChronicleProof(characterId: string, proofType: string, title: string, decisionData: any) {
    const proofHash = createHash("sha256")
      .update(`proof:${characterId}:${proofType}:${JSON.stringify(decisionData)}:${Date.now()}`)
      .digest("hex");
    
    // In production, this would record to blockchain
    const proof = {
      id: `proof_${Date.now()}`,
      characterId,
      proofType,
      title,
      decisionData: JSON.stringify(decisionData),
      transactionHash: `0x${proofHash}`,
      guardianSignature: `sig_${proofHash.substring(0, 32)}`,
      shellsAwarded: "10",
      isSoulbound: true,
      createdAt: new Date(),
    };
    
    console.log(`[Chronicles] Created proof: ${title} - ${proof.transactionHash}`);
    return proof;
  }
  
  async getChronicleProofs(characterId: string) {
    return [];
  }
  
  async getCurrentSeason() {
    return {
      id: "season_zero",
      name: "Season Zero: The Awakening",
      description: "The first season of DarkWave Chronicles. Establish your legacy.",
      seasonNumber: 0,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-04-11"),
      totalShellsPool: "100000",
      totalDwcPool: "10000",
      participantCount: 0,
      questsAvailable: SEASON_ZERO_QUESTS.length,
      isActive: true,
    };
  }
  
  async getSeasonLeaderboard() {
    return [];
  }
}

export const chroniclesService = new ChroniclesGameService();
