/**
 * Chronicles - Game Service
 * Backend service for the Chronicles parallel life experience
 * Season Zero: 3 Playable Eras - Modern, Medieval, Wild West
 */

import { createHash } from "crypto";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const ERAS = {
  modern: { name: "Modern Era", years: "2000 - 2025 CE", color: "#3B82F6" },
  medieval: { name: "Medieval Era", years: "500 - 1500 CE", color: "#4A5568" },
  wildwest: { name: "Wild West Era", years: "1850 - 1900 CE", color: "#D97706" },
} as const;

export const ERA_SETTINGS: Record<string, { worldDescription: string; atmosphere: string }> = {
  modern: {
    worldDescription: "A sprawling modern metropolis where corporations, activists, tech disruptors, underground networks, and old-money dynasties battle for influence. Skyscrapers cast long shadows over street-level hustlers. Digital surveillance watches everything — or does it?",
    atmosphere: "neon-lit streets, glass towers, coffee shops buzzing with conspiracies, data centers humming with secrets",
  },
  medieval: {
    worldDescription: "A vast kingdom where noble houses, shadow operatives, merchant caravans, scholarly innovators, and druidic keepers of the old faith clash for dominion. Castle walls echo with whispered plots while taverns overflow with rumors of war.",
    atmosphere: "torchlit stone corridors, bustling market squares, dark forests, imposing castle battlements",
  },
  wildwest: {
    worldDescription: "The untamed frontier where law is what you make it. Railroad barons, outlaw gangs, frontier marshals, indigenous nations, and prospectors all stake their claim on a land that belongs to no one — and everyone. Dust, gunsmoke, and opportunity fill the air.",
    atmosphere: "sun-scorched dusty streets, creaking saloon doors, distant canyon echoes, campfires under vast starry skies",
  },
};

// ============================================
// FACTIONS - 5 per era (15 total for Season 0)
// ============================================

export const STARTER_FACTIONS = [
  // MEDIEVAL FACTIONS
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

  // MODERN ERA FACTIONS
  {
    id: "nexus_corp",
    name: "Nexus Corporation",
    description: "A mega-corporation that controls data, AI, and digital infrastructure. They believe technology should govern society for maximum efficiency.",
    ideology: "order",
    color: "#06B6D4",
    iconEmoji: "🏢",
    era: "modern",
  },
  {
    id: "signal_underground",
    name: "The Signal Underground",
    description: "Hackers, whistleblowers, and digital anarchists fighting corporate control. They weaponize transparency and believe information should be free.",
    ideology: "chaos",
    color: "#EF4444",
    iconEmoji: "📡",
    era: "modern",
  },
  {
    id: "civic_alliance",
    name: "Civic Alliance",
    description: "Community organizers, local politicians, and grassroots leaders. They believe real change happens from the ground up through democratic participation.",
    ideology: "balance",
    color: "#8B5CF6",
    iconEmoji: "🤝",
    era: "modern",
  },
  {
    id: "genesis_labs",
    name: "Genesis Labs",
    description: "Biotech pioneers and transhumanists pushing the limits of human potential. They see evolution as a choice, not a process.",
    ideology: "progress",
    color: "#22C55E",
    iconEmoji: "🧬",
    era: "modern",
  },
  {
    id: "old_guard",
    name: "The Old Guard",
    description: "Established families, legacy institutions, and traditionalists. They've held power for generations and have no intention of letting go.",
    ideology: "tradition",
    color: "#78716C",
    iconEmoji: "🏛️",
    era: "modern",
  },

  // WILD WEST ERA FACTIONS
  {
    id: "iron_star",
    name: "The Iron Star",
    description: "Federal marshals and lawmen bringing order to the frontier. They represent the long arm of the law — even when the nearest courthouse is 200 miles away.",
    ideology: "order",
    color: "#A1A1AA",
    iconEmoji: "⭐",
    era: "wildwest",
  },
  {
    id: "black_canyon_gang",
    name: "Black Canyon Gang",
    description: "Outlaws, bandits, and desperados who live outside the law. They rob trains, rustle cattle, and answer to no one. Freedom at any cost.",
    ideology: "chaos",
    color: "#1C1917",
    iconEmoji: "🤠",
    era: "wildwest",
  },
  {
    id: "pacific_railroad",
    name: "Pacific Railroad Company",
    description: "The railroad is coming, and with it comes civilization — or exploitation. They buy land, hire labor, and reshape the frontier in iron and steam.",
    ideology: "balance",
    color: "#B45309",
    iconEmoji: "🚂",
    era: "wildwest",
  },
  {
    id: "prospectors_union",
    name: "Prospector's Union",
    description: "Gold hunters, miners, and fortune seekers. They dig, pan, and blast their way to wealth. Every strike could change everything.",
    ideology: "progress",
    color: "#EAB308",
    iconEmoji: "⛏️",
    era: "wildwest",
  },
  {
    id: "first_nations",
    name: "The First Nations",
    description: "Indigenous peoples defending their ancestral lands and way of life. They hold ancient wisdom, deep connections to the land, and a fierce determination to survive.",
    ideology: "tradition",
    color: "#DC2626",
    iconEmoji: "🦅",
    era: "wildwest",
  },
];

// ============================================
// QUESTS - Season Zero (all 3 eras)
// ============================================

export const SEASON_ZERO_QUESTS = [
  // MEDIEVAL QUESTS
  {
    id: "med_arrival",
    title: "Arrival in the Realm",
    description: "You awaken in a strange land with no memory of how you arrived. A mysterious figure offers guidance...",
    era: "medieval",
    difficulty: "easy",
    shellsReward: "50",
    experienceReward: 100,
    category: "main_story",
  },
  {
    id: "med_faction_choice",
    title: "The Faction Choice",
    description: "Five powers vie for control. Each offers a path, each demands loyalty. Choose wisely, for this decision will shape your destiny.",
    era: "medieval",
    difficulty: "medium",
    shellsReward: "100",
    experienceReward: 200,
    category: "main_story",
    prerequisite: "med_arrival",
  },
  {
    id: "med_first_council",
    title: "The First Council",
    description: "Your faction calls a meeting. War is brewing. Your voice could tip the balance...",
    era: "medieval",
    difficulty: "medium",
    shellsReward: "150",
    experienceReward: 300,
    category: "faction",
    prerequisite: "med_faction_choice",
  },
  {
    id: "med_shadows_whisper",
    title: "Shadows Whisper",
    description: "An informant approaches with secrets that could change everything. But can they be trusted?",
    era: "medieval",
    difficulty: "hard",
    shellsReward: "200",
    experienceReward: 400,
    category: "side_quest",
  },
  {
    id: "med_castle_siege",
    title: "The Siege of Thornhold",
    description: "An enemy faction marches on the castle. Defend the walls, rally the troops, or negotiate a truce — the choice is yours.",
    era: "medieval",
    difficulty: "hard",
    shellsReward: "300",
    experienceReward: 500,
    category: "main_story",
    prerequisite: "med_first_council",
  },
  {
    id: "med_merchant_run",
    title: "The Merchant's Road",
    description: "A caravan needs protection on a dangerous route. Bandits lurk in the forest, but the reward is worth the risk.",
    era: "medieval",
    difficulty: "medium",
    shellsReward: "120",
    experienceReward: 250,
    category: "side_quest",
  },
  {
    id: "med_ancient_tome",
    title: "The Lost Tome",
    description: "Rumors speak of a forbidden book hidden beneath the old library. Its knowledge could shift the balance of power forever.",
    era: "medieval",
    difficulty: "hard",
    shellsReward: "250",
    experienceReward: 450,
    category: "side_quest",
  },

  // MODERN ERA QUESTS
  {
    id: "mod_new_city",
    title: "Welcome to the City",
    description: "You arrive in a gleaming metropolis of glass and steel. Your phone buzzes with a message from an unknown number: 'We've been expecting you.'",
    era: "modern",
    difficulty: "easy",
    shellsReward: "50",
    experienceReward: 100,
    category: "main_story",
  },
  {
    id: "mod_faction_choice",
    title: "Choose Your Side",
    description: "Five organizations reach out, each promising a different future. A corporate recruiter, a hacktivist, a community leader, a biotech visionary, and a legacy patriarch. Who do you trust?",
    era: "modern",
    difficulty: "medium",
    shellsReward: "100",
    experienceReward: 200,
    category: "main_story",
    prerequisite: "mod_new_city",
  },
  {
    id: "mod_data_heist",
    title: "The Data Breach",
    description: "Someone has leaked classified corporate data. Nexus Corp wants it buried. The Underground wants it public. You have 24 hours before it goes viral.",
    era: "modern",
    difficulty: "hard",
    shellsReward: "250",
    experienceReward: 400,
    category: "main_story",
    prerequisite: "mod_faction_choice",
  },
  {
    id: "mod_election",
    title: "The City Election",
    description: "Election day approaches. Three candidates, three visions for the city. Your endorsement — and your actions — could swing the outcome.",
    era: "modern",
    difficulty: "medium",
    shellsReward: "200",
    experienceReward: 350,
    category: "faction",
    prerequisite: "mod_faction_choice",
  },
  {
    id: "mod_startup",
    title: "The Startup Pitch",
    description: "You have an idea that could change everything. A venture capital firm is listening — but their terms come with strings attached.",
    era: "modern",
    difficulty: "medium",
    shellsReward: "150",
    experienceReward: 300,
    category: "side_quest",
  },
  {
    id: "mod_blackout",
    title: "City Blackout",
    description: "The power grid fails across the entire city. Is it sabotage or system failure? In the darkness, old alliances fracture and new ones form.",
    era: "modern",
    difficulty: "hard",
    shellsReward: "300",
    experienceReward: 500,
    category: "main_story",
    prerequisite: "mod_data_heist",
  },
  {
    id: "mod_protest",
    title: "The March",
    description: "Thousands take to the streets demanding change. Do you lead, follow, observe, or oppose? Every choice carries consequences.",
    era: "modern",
    difficulty: "medium",
    shellsReward: "120",
    experienceReward: 250,
    category: "side_quest",
  },

  // WILD WEST QUESTS
  {
    id: "ww_ride_into_town",
    title: "Ride Into Town",
    description: "Your horse is tired, your canteen is empty, and the town of Dust Creek appears on the horizon. A stranger tips his hat as you dismount. 'You look like trouble,' he says.",
    era: "wildwest",
    difficulty: "easy",
    shellsReward: "50",
    experienceReward: 100,
    category: "main_story",
  },
  {
    id: "ww_faction_choice",
    title: "Pick Your Posse",
    description: "The marshal offers a badge. The gang offers freedom. The railroad offers money. The miners offer gold. The Elders offer wisdom. Every path leads somewhere different.",
    era: "wildwest",
    difficulty: "medium",
    shellsReward: "100",
    experienceReward: 200,
    category: "main_story",
    prerequisite: "ww_ride_into_town",
  },
  {
    id: "ww_train_robbery",
    title: "The Train Job",
    description: "A train carrying a fortune in gold is crossing Black Canyon tomorrow. The gang wants it. The marshals want to stop them. The railroad just wants it delivered. Whose side are you on?",
    era: "wildwest",
    difficulty: "hard",
    shellsReward: "300",
    experienceReward: 500,
    category: "main_story",
    prerequisite: "ww_faction_choice",
  },
  {
    id: "ww_gold_strike",
    title: "Gold Strike!",
    description: "A prospector stumbles into town raving about a massive gold vein in the hills. Within hours, everyone wants in. Claims are being staked, and tensions are rising fast.",
    era: "wildwest",
    difficulty: "medium",
    shellsReward: "200",
    experienceReward: 350,
    category: "faction",
    prerequisite: "ww_faction_choice",
  },
  {
    id: "ww_showdown",
    title: "High Noon",
    description: "A rival has called you out. The whole town gathers in the street. There's no backing down now. But is a bullet the only answer?",
    era: "wildwest",
    difficulty: "hard",
    shellsReward: "250",
    experienceReward: 450,
    category: "main_story",
    prerequisite: "ww_train_robbery",
  },
  {
    id: "ww_cattle_drive",
    title: "The Long Drive",
    description: "500 head of cattle need to reach the railhead 200 miles north. Rustlers, river crossings, and rattlesnakes stand in your way. The pay is good — if you survive.",
    era: "wildwest",
    difficulty: "medium",
    shellsReward: "150",
    experienceReward: 300,
    category: "side_quest",
  },
  {
    id: "ww_sacred_land",
    title: "Sacred Ground",
    description: "The railroad wants to blast through ancient burial grounds. The First Nations won't allow it. Both sides are arming up. Can you find a path that doesn't end in bloodshed?",
    era: "wildwest",
    difficulty: "hard",
    shellsReward: "350",
    experienceReward: 600,
    category: "side_quest",
  },
];

// ============================================
// NPCs - 3+ per era (9+ total for Season 0)
// ============================================

export const STARTER_NPCS = [
  // MEDIEVAL NPCs
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

  // MODERN ERA NPCs
  {
    name: "Dr. Elena Voss",
    title: "Chief Innovation Officer, Nexus Corp",
    era: "modern",
    factionId: "nexus_corp",
    personality: JSON.stringify({
      traits: ["brilliant", "cold", "visionary"],
      goals: ["advance AI development", "consolidate corporate power"],
      fears: ["obsolescence", "losing to competitors"],
      speakingStyle: "precise, clinical, and confident",
    }),
    backstory: "A former MIT prodigy who built Nexus Corp's AI division from scratch. She sees humanity as a problem to be optimized.",
  },
  {
    name: "Kai 'Ghost' Reeves",
    title: "Lead Hacktivist",
    era: "modern",
    factionId: "signal_underground",
    personality: JSON.stringify({
      traits: ["idealistic", "rebellious", "paranoid"],
      goals: ["expose corporate corruption", "protect digital freedom"],
      fears: ["surveillance", "being caught"],
      speakingStyle: "fast, slang-heavy, uses tech metaphors",
    }),
    backstory: "A self-taught coder who grew up in the system. After exposing a city corruption scandal at 16, Ghost became the Underground's most wanted — and most respected — voice.",
  },
  {
    name: "Mayor Diana Reyes",
    title: "City Mayor, Civic Alliance",
    era: "modern",
    factionId: "civic_alliance",
    personality: JSON.stringify({
      traits: ["charismatic", "compassionate", "politically savvy"],
      goals: ["win re-election", "improve the city for everyone"],
      fears: ["corruption scandals", "losing public trust"],
      speakingStyle: "warm, diplomatic, uses 'we' language",
    }),
    backstory: "The daughter of immigrants who became the city's youngest mayor. She fights for the people — but politics demands compromise.",
  },

  // WILD WEST NPCs
  {
    name: "Marshal Jake Colton",
    title: "Federal Marshal",
    era: "wildwest",
    factionId: "iron_star",
    personality: JSON.stringify({
      traits: ["stoic", "fair", "relentless"],
      goals: ["bring law to the frontier", "protect the innocent"],
      fears: ["becoming what he hunts", "failing the badge"],
      speakingStyle: "slow, deliberate, few words but each one counts",
    }),
    backstory: "A Civil War veteran who turned to the law when the fighting ended. He's tracked outlaws from Kansas to California and never lost a man he was hunting.",
  },
  {
    name: "Rattlesnake Rosa",
    title: "Gang Leader",
    era: "wildwest",
    factionId: "black_canyon_gang",
    personality: JSON.stringify({
      traits: ["fearless", "cunning", "loyal to her crew"],
      goals: ["pull the biggest heist in frontier history", "keep her gang alive"],
      fears: ["betrayal from within", "the noose"],
      speakingStyle: "sharp-tongued, colorful language, dark humor",
    }),
    backstory: "Born into poverty, Rosa took her first horse at 14 and never looked back. Now she runs the most feared outfit west of the Rockies, and she does it with style.",
  },
  {
    name: "Chief Running Bear",
    title: "Elder of the Wind River People",
    era: "wildwest",
    factionId: "first_nations",
    personality: JSON.stringify({
      traits: ["wise", "patient", "fiercely protective"],
      goals: ["preserve ancestral lands", "ensure his people's survival"],
      fears: ["the iron road destroying sacred places", "losing the old ways"],
      speakingStyle: "thoughtful, uses nature metaphors, speaks with gravity",
    }),
    backstory: "Running Bear has led his people through decades of encroachment. He seeks peace but prepares for war, knowing the white man's promises are written in sand.",
  },
];

// ============================================
// ERA BUILDING TEMPLATES
// ============================================

export const ERA_BUILDING_TEMPLATES = [
  // MEDIEVAL BUILDINGS
  { era: "medieval", buildingType: "house", displayName: "Cottage", iconEmoji: "🏠", colorClass: "bg-amber-700", description: "A humble thatched-roof dwelling", baseCost: 0, unlockLevel: 0 },
  { era: "medieval", buildingType: "tree", displayName: "Oak Tree", iconEmoji: "🌳", colorClass: "bg-green-700", description: "A sturdy oak providing shade", baseCost: 10, unlockLevel: 0 },
  { era: "medieval", buildingType: "garden", displayName: "Herb Garden", iconEmoji: "🌿", colorClass: "bg-emerald-600", description: "Medicinal herbs and flowers", baseCost: 25, unlockLevel: 0 },
  { era: "medieval", buildingType: "pond", displayName: "Well", iconEmoji: "🪣", colorClass: "bg-blue-700", description: "A stone well for fresh water", baseCost: 50, unlockLevel: 1 },
  { era: "medieval", buildingType: "path", displayName: "Cobblestone Path", iconEmoji: "🪨", colorClass: "bg-stone-500", description: "Worn cobblestone walkway", baseCost: 5, unlockLevel: 0 },
  { era: "medieval", buildingType: "wall", displayName: "Stone Wall", iconEmoji: "🧱", colorClass: "bg-slate-600", description: "Defensive stone barrier", baseCost: 15, unlockLevel: 0 },
  { era: "medieval", buildingType: "shop", displayName: "Market Stall", iconEmoji: "🏪", colorClass: "bg-purple-700", description: "Trade goods with visitors", baseCost: 100, unlockLevel: 2 },
  { era: "medieval", buildingType: "workshop", displayName: "Blacksmith", iconEmoji: "⚒️", colorClass: "bg-orange-700", description: "Forge weapons and tools", baseCost: 150, unlockLevel: 3 },
  { era: "medieval", buildingType: "monument", displayName: "Stone Cross", iconEmoji: "⛪", colorClass: "bg-yellow-600", description: "A sacred monument", baseCost: 500, unlockLevel: 5 },
  { era: "medieval", buildingType: "tower", displayName: "Watch Tower", iconEmoji: "🗼", colorClass: "bg-gray-600", description: "Guard tower for defense", baseCost: 300, unlockLevel: 4 },
  { era: "medieval", buildingType: "tavern", displayName: "Tavern", iconEmoji: "🍺", colorClass: "bg-amber-800", description: "A gathering place for ale and stories", baseCost: 200, unlockLevel: 3 },
  { era: "medieval", buildingType: "farm", displayName: "Farm Plot", iconEmoji: "🌾", colorClass: "bg-yellow-700", description: "Grow crops to feed your estate", baseCost: 75, unlockLevel: 1 },

  // MODERN ERA BUILDINGS
  { era: "modern", buildingType: "house", displayName: "Apartment", iconEmoji: "🏢", colorClass: "bg-blue-600", description: "A sleek modern apartment", baseCost: 0, unlockLevel: 0 },
  { era: "modern", buildingType: "tree", displayName: "City Tree", iconEmoji: "🌲", colorClass: "bg-green-500", description: "Urban landscaping tree", baseCost: 10, unlockLevel: 0 },
  { era: "modern", buildingType: "garden", displayName: "Rooftop Garden", iconEmoji: "🌻", colorClass: "bg-emerald-500", description: "A green space above the city", baseCost: 25, unlockLevel: 0 },
  { era: "modern", buildingType: "pond", displayName: "Fountain", iconEmoji: "⛲", colorClass: "bg-cyan-500", description: "A modern water feature", baseCost: 50, unlockLevel: 1 },
  { era: "modern", buildingType: "path", displayName: "Sidewalk", iconEmoji: "🛤️", colorClass: "bg-gray-400", description: "Paved pedestrian walkway", baseCost: 5, unlockLevel: 0 },
  { era: "modern", buildingType: "wall", displayName: "Security Fence", iconEmoji: "🔒", colorClass: "bg-zinc-500", description: "Electrified perimeter fence", baseCost: 15, unlockLevel: 0 },
  { era: "modern", buildingType: "shop", displayName: "Coffee Shop", iconEmoji: "☕", colorClass: "bg-amber-600", description: "A trendy cafe with Wi-Fi", baseCost: 100, unlockLevel: 2 },
  { era: "modern", buildingType: "workshop", displayName: "Tech Lab", iconEmoji: "💻", colorClass: "bg-violet-600", description: "Cutting-edge R&D facility", baseCost: 150, unlockLevel: 3 },
  { era: "modern", buildingType: "monument", displayName: "Art Installation", iconEmoji: "🎨", colorClass: "bg-pink-500", description: "A striking modern art piece", baseCost: 500, unlockLevel: 5 },
  { era: "modern", buildingType: "tower", displayName: "Cell Tower", iconEmoji: "📡", colorClass: "bg-sky-600", description: "Communication relay tower", baseCost: 300, unlockLevel: 4 },
  { era: "modern", buildingType: "tavern", displayName: "Lounge Bar", iconEmoji: "🍸", colorClass: "bg-rose-600", description: "A hip bar for networking", baseCost: 200, unlockLevel: 3 },
  { era: "modern", buildingType: "farm", displayName: "Solar Array", iconEmoji: "☀️", colorClass: "bg-yellow-500", description: "Clean energy for the district", baseCost: 75, unlockLevel: 1 },

  // WILD WEST BUILDINGS
  { era: "wildwest", buildingType: "house", displayName: "Homestead", iconEmoji: "🏚️", colorClass: "bg-amber-800", description: "A frontier log cabin", baseCost: 0, unlockLevel: 0 },
  { era: "wildwest", buildingType: "tree", displayName: "Cactus", iconEmoji: "🌵", colorClass: "bg-green-600", description: "Hardy desert plant", baseCost: 10, unlockLevel: 0 },
  { era: "wildwest", buildingType: "garden", displayName: "Corral", iconEmoji: "🐎", colorClass: "bg-orange-600", description: "Horse pen and hitching post", baseCost: 25, unlockLevel: 0 },
  { era: "wildwest", buildingType: "pond", displayName: "Water Trough", iconEmoji: "🪣", colorClass: "bg-blue-500", description: "A wooden water trough", baseCost: 50, unlockLevel: 1 },
  { era: "wildwest", buildingType: "path", displayName: "Dirt Trail", iconEmoji: "👣", colorClass: "bg-amber-500", description: "A well-worn dusty trail", baseCost: 5, unlockLevel: 0 },
  { era: "wildwest", buildingType: "wall", displayName: "Split-Rail Fence", iconEmoji: "🪵", colorClass: "bg-yellow-800", description: "Rustic wooden fence", baseCost: 15, unlockLevel: 0 },
  { era: "wildwest", buildingType: "shop", displayName: "General Store", iconEmoji: "🏬", colorClass: "bg-red-700", description: "Supplies, ammunition, and provisions", baseCost: 100, unlockLevel: 2 },
  { era: "wildwest", buildingType: "workshop", displayName: "Gunsmith", iconEmoji: "🔫", colorClass: "bg-gray-700", description: "Firearms and repairs", baseCost: 150, unlockLevel: 3 },
  { era: "wildwest", buildingType: "monument", displayName: "Totem Pole", iconEmoji: "🪶", colorClass: "bg-red-800", description: "A carved tribal monument", baseCost: 500, unlockLevel: 5 },
  { era: "wildwest", buildingType: "tower", displayName: "Windmill", iconEmoji: "🌀", colorClass: "bg-sky-700", description: "Pumps water for the ranch", baseCost: 300, unlockLevel: 4 },
  { era: "wildwest", buildingType: "tavern", displayName: "Saloon", iconEmoji: "🥃", colorClass: "bg-amber-900", description: "Whiskey, poker, and trouble", baseCost: 200, unlockLevel: 3 },
  { era: "wildwest", buildingType: "farm", displayName: "Ranch", iconEmoji: "🐄", colorClass: "bg-lime-700", description: "Raise cattle and horses", baseCost: 75, unlockLevel: 1 },
];

// ============================================
// CITY ZONE TEMPLATES per ERA
// ============================================

export const ERA_CITY_ZONES = [
  // MEDIEVAL ZONES
  { era: "medieval", name: "Castle Ward", description: "The fortified heart of the kingdom, home to nobles and the royal court", zoneType: "civic", gridX: 0, gridY: 0, width: 4, height: 4, totalPlots: 16, architectureStyle: "medieval" },
  { era: "medieval", name: "Market Square", description: "A bustling bazaar where merchants hawk their wares", zoneType: "commercial", gridX: 4, gridY: 0, width: 4, height: 4, totalPlots: 16, architectureStyle: "medieval" },
  { era: "medieval", name: "Peasant Quarter", description: "Simple homes and workshops of the common folk", zoneType: "residential", gridX: 0, gridY: 4, width: 4, height: 4, totalPlots: 16, architectureStyle: "medieval" },
  { era: "medieval", name: "Temple Grove", description: "Sacred grounds where the Old Faith tends ancient groves", zoneType: "nature", gridX: 4, gridY: 4, width: 4, height: 4, totalPlots: 16, architectureStyle: "medieval" },
  { era: "medieval", name: "Artisan's Row", description: "Workshops and craft halls lining a busy street", zoneType: "mixed", gridX: 8, gridY: 0, width: 4, height: 4, totalPlots: 16, architectureStyle: "medieval" },

  // MODERN ZONES
  { era: "modern", name: "Downtown Core", description: "The gleaming corporate district of glass towers and power", zoneType: "commercial", gridX: 0, gridY: 0, width: 4, height: 4, totalPlots: 16, architectureStyle: "modern" },
  { era: "modern", name: "Tech Campus", description: "Innovation hub where startups and labs push the boundaries", zoneType: "civic", gridX: 4, gridY: 0, width: 4, height: 4, totalPlots: 16, architectureStyle: "modern" },
  { era: "modern", name: "Midtown Residential", description: "Apartments and condos where the city sleeps", zoneType: "residential", gridX: 0, gridY: 4, width: 4, height: 4, totalPlots: 16, architectureStyle: "modern" },
  { era: "modern", name: "Central Park", description: "A green oasis in the concrete jungle", zoneType: "nature", gridX: 4, gridY: 4, width: 4, height: 4, totalPlots: 16, architectureStyle: "modern" },
  { era: "modern", name: "The Underground", description: "A hidden network of clubs, markets, and meeting places", zoneType: "mixed", gridX: 8, gridY: 0, width: 4, height: 4, totalPlots: 16, architectureStyle: "modern" },

  // WILD WEST ZONES
  { era: "wildwest", name: "Main Street", description: "The dusty heart of town — saloon, general store, and the marshal's office", zoneType: "commercial", gridX: 0, gridY: 0, width: 4, height: 4, totalPlots: 16, architectureStyle: "wildwest" },
  { era: "wildwest", name: "Railroad Depot", description: "Where the iron horse meets the frontier. Commerce flows through here", zoneType: "civic", gridX: 4, gridY: 0, width: 4, height: 4, totalPlots: 16, architectureStyle: "wildwest" },
  { era: "wildwest", name: "Settler's Row", description: "Homesteads and cabins for families carving a life from the land", zoneType: "residential", gridX: 0, gridY: 4, width: 4, height: 4, totalPlots: 16, architectureStyle: "wildwest" },
  { era: "wildwest", name: "Sacred Valley", description: "Ancestral lands of the First Nations, rich with history and spirit", zoneType: "nature", gridX: 4, gridY: 4, width: 4, height: 4, totalPlots: 16, architectureStyle: "wildwest" },
  { era: "wildwest", name: "Mining Camp", description: "Tents, pickaxes, and dreams of gold in the foothills", zoneType: "mixed", gridX: 8, gridY: 0, width: 4, height: 4, totalPlots: 16, architectureStyle: "wildwest" },
];

// ============================================
// SERVICE IMPLEMENTATION
// ============================================

export interface ChroniclesService {
  createCharacter(userId: string, name: string, era?: string): Promise<any>;
  getCharacter(userId: string): Promise<any>;
  getCharacterStats(characterId: string): Promise<any>;
  getAvailableQuests(characterId: string): Promise<any[]>;
  getQuestsForEra(era: string): any[];
  startQuest(characterId: string, questId: string): Promise<any>;
  makeDecision(characterId: string, questId: string, decisionId: string): Promise<any>;
  completeQuest(characterId: string, questId: string): Promise<any>;
  talkToNpc(characterId: string, npcId: string, message: string, era?: string): Promise<any>;
  getNpcDisposition(characterId: string, npcId: string): Promise<any>;
  joinFaction(characterId: string, factionId: string): Promise<any>;
  getFactionStanding(characterId: string): Promise<any[]>;
  getFactionsForEra(era: string): any[];
  getNpcsForEra(era: string): any[];
  createChronicleProof(characterId: string, proofType: string, title: string, decisionData: any): Promise<any>;
  getChronicleProofs(characterId: string): Promise<any[]>;
  getCurrentSeason(): Promise<any>;
  getSeasonLeaderboard(): Promise<any[]>;
}

class ChroniclesGameService implements ChroniclesService {

  async createCharacter(userId: string, name: string, era = "modern") {
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

    console.log(`[Chronicles] Created character: ${name} in ${era} for user ${userId}`);
    return character;
  }

  async getCharacter(userId: string) {
    return null;
  }

  async getCharacterStats(characterId: string) {
    return {
      level: 1,
      experience: 0,
      nextLevelXp: 1000,
      attributes: { wisdom: 10, courage: 10, compassion: 10, cunning: 10, influence: 10 },
      shellsEarned: "0",
      questsCompleted: 0,
      decisionsRecorded: 0,
    };
  }

  getQuestsForEra(era: string) {
    return SEASON_ZERO_QUESTS.filter(q => q.era === era);
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
      consequences: "Your choice ripples through the world...",
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

  async talkToNpc(characterId: string, npcId: string, message: string, era?: string) {
    const npc = STARTER_NPCS.find(n => {
      const nameKey = n.name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_');
      return nameKey === npcId || n.name.toLowerCase().replace(/\s+/g, '_') === npcId;
    });
    if (!npc) throw new Error("NPC not found");

    const personality = JSON.parse(npc.personality);
    const eraSetting = ERA_SETTINGS[npc.era] || ERA_SETTINGS.medieval;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are ${npc.name}, ${npc.title} in the ${ERAS[npc.era as keyof typeof ERAS]?.name || npc.era}.
Setting: ${eraSetting.worldDescription}
Atmosphere: ${eraSetting.atmosphere}
Personality traits: ${personality.traits.join(", ")}
Speaking style: ${personality.speakingStyle}
Goals: ${personality.goals.join(", ")}
Backstory: ${npc.backstory}

Stay in character. Be concise (2-3 sentences max). Your faction is important to you. Speak in a way appropriate for your era.`
          },
          { role: "user", content: message }
        ],
        max_tokens: 150,
      });

      const aiResponse = response.choices[0]?.message?.content || "The NPC regards you silently.";

      const proofHash = createHash("sha256")
        .update(`ai:${npcId}:${message}:${aiResponse}:${Date.now()}`)
        .digest("hex");

      return {
        npc: { name: npc.name, title: npc.title, era: npc.era },
        response: aiResponse,
        aiProofHash: proofHash,
        aiModel: "gpt-4o",
        verified: true,
      };
    } catch (error) {
      console.error("[Chronicles] NPC AI error:", error);
      return {
        npc: { name: npc.name, title: npc.title, era: npc.era },
        response: "The NPC seems distracted and doesn't respond.",
        error: true,
      };
    }
  }

  async getNpcDisposition(characterId: string, npcId: string) {
    return { npcId, disposition: 50, rank: "neutral" };
  }

  getFactionsForEra(era: string) {
    return STARTER_FACTIONS.filter(f => f.era === era);
  }

  getNpcsForEra(era: string) {
    return STARTER_NPCS.filter(n => n.era === era);
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
      description: "The first season of Chronicles. Three eras. Fifteen factions. Your legend begins.",
      seasonNumber: 0,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-06-01"),
      totalShellsPool: "100000",
      totalDwcPool: "10000",
      participantCount: 0,
      questsAvailable: SEASON_ZERO_QUESTS.length,
      erasAvailable: Object.keys(ERAS).length,
      isActive: true,
    };
  }

  async getSeasonLeaderboard() {
    return [];
  }
}

export const chroniclesService = new ChroniclesGameService();
