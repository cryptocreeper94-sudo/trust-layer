import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { 
  ArrowLeft, Sparkles, Clock, Map, Users, Sword, Wand2, Cog, Cpu, Rocket, Atom,
  ChevronLeft, ChevronRight, Lock, Unlock, Star, Zap, Shield, Crown, Scale, Vote, Handshake, Swords
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";
import stoneAgeImg from "@assets/generated_images/stone_age_village_scene.png";
import medievalImg from "@assets/generated_images/medieval_fantasy_kingdom.png";
import industrialImg from "@assets/generated_images/industrial_steampunk_city.png";
import cyberpunkImg from "@assets/generated_images/cyberpunk_neon_city.png";
import spaceImg from "@assets/generated_images/deep_space_station.png";
import quantumImg from "@assets/generated_images/quantum_dimension_realm.png";

interface Era {
  id: string;
  name: string;
  subtitle: string;
  year: string;
  img: string;
  icon: any;
  color: string;
  description: string;
  mechanics: string[];
  resources: string[];
  classes: string[];
  governance: string;
  politics: string[];
  unlockRequirement: string;
  isLocked: boolean;
}

const ERAS: Era[] = [
  {
    id: "stone",
    name: "Dawn Age",
    subtitle: "The First Light",
    year: "50,000 BCE",
    img: stoneAgeImg,
    icon: Map,
    color: "from-amber-600 to-orange-700",
    description: "Where every journey begins. Primitive tribes struggle for survival against megafauna and the elements. Master fire, craft basic tools, and unite the first clans.",
    mechanics: ["Survival crafting", "Tribal politics", "Beast taming", "Cave exploration"],
    resources: ["Flint", "Hide", "Bone", "Sacred herbs"],
    classes: ["Hunter", "Shaman", "Chieftain"],
    governance: "Tribal Councils",
    politics: ["Elder councils", "Ritual challenges", "Blood oaths", "Territory disputes"],
    unlockRequirement: "Starting Era - Always Available",
    isLocked: false,
  },
  {
    id: "medieval",
    name: "Age of Crowns",
    subtitle: "Steel and Sorcery",
    year: "1200 CE",
    img: medievalImg,
    icon: Sword,
    color: "from-violet-600 to-purple-700",
    description: "Kingdoms rise and fall. Magic awakens in ancient bloodlines. Knights quest for glory while dark forces gather in shadow. Choose your allegiance wisely.",
    mechanics: ["Kingdom building", "Magic systems", "Siege warfare", "Dragon hunting"],
    resources: ["Gold", "Iron", "Mana crystals", "Dragon scales"],
    classes: ["Knight", "Mage", "Assassin", "Cleric"],
    governance: "Feudal Monarchy",
    politics: ["Royal succession", "Noble houses", "Holy orders", "Peasant revolts"],
    unlockRequirement: "Complete Dawn Age: Chapter 1",
    isLocked: true,
  },
  {
    id: "industrial",
    name: "Iron Epoch",
    subtitle: "Gears of Progress",
    year: "1885 CE",
    img: industrialImg,
    icon: Cog,
    color: "from-amber-500 to-yellow-600",
    description: "Steam power transforms civilization. Clockwork automatons walk alongside humans. Airship pirates rule the skies while inventors race to unlock forbidden sciences.",
    mechanics: ["Invention crafting", "Airship combat", "Factory management", "Automaton companions"],
    resources: ["Coal", "Brass", "Aether", "Cogwheels"],
    classes: ["Engineer", "Aeronaut", "Investigator", "Automancer"],
    governance: "Industrial Parliament",
    politics: ["Labor unions", "Trade wars", "Colonial powers", "Revolutionary cells"],
    unlockRequirement: "Reach Level 20 in Age of Crowns",
    isLocked: true,
  },
  {
    id: "cyber",
    name: "Neon Dominion",
    subtitle: "Chrome and Code",
    year: "2087 CE",
    img: cyberpunkImg,
    icon: Cpu,
    color: "from-cyan-500 to-blue-600",
    description: "Megacorporations rule the sprawl. Hack the grid, upgrade your chrome, and survive the digital underground. The line between human and machine blurs.",
    mechanics: ["Hacking minigames", "Cybernetic upgrades", "Street racing", "Corporate espionage"],
    resources: ["Credits", "Neurolink chips", "Synthetic blood", "Data shards"],
    classes: ["Netrunner", "Street Samurai", "Techie", "Fixer"],
    governance: "Corporate Oligarchy",
    politics: ["Megacorp boards", "Street gangs", "Underground resistance", "AI rights movement"],
    unlockRequirement: "Acquire 3 Chrono Keys",
    isLocked: true,
  },
  {
    id: "space",
    name: "Stellar Exodus",
    subtitle: "Among the Stars",
    year: "3500 CE",
    img: spaceImg,
    icon: Rocket,
    color: "from-indigo-500 to-violet-600",
    description: "Humanity spans the galaxy. Alien civilizations offer alliance or annihilation. Command starships, establish colonies, and uncover the secrets of ancient precursors.",
    mechanics: ["Space exploration", "Fleet command", "Diplomacy", "Planet terraforming"],
    resources: ["Plasma cores", "Xenominerals", "Dark matter", "Precursor artifacts"],
    classes: ["Commander", "Xenobiologist", "Pilot", "Psionic"],
    governance: "Galactic Federation",
    politics: ["Interstellar treaties", "Alien diplomacy", "Colony independence", "Fleet admiralty"],
    unlockRequirement: "Unite 5 Factions Across Eras",
    isLocked: true,
  },
  {
    id: "quantum",
    name: "The Infinite",
    subtitle: "Beyond Reality",
    year: "∞",
    img: quantumImg,
    icon: Atom,
    color: "from-pink-500 to-purple-600",
    description: "Reality itself becomes malleable. Transcend physical form, manipulate probability, and explore dimensions beyond comprehension. The final frontier is consciousness itself.",
    mechanics: ["Reality manipulation", "Dimensional travel", "Probability crafting", "Cosmic entities"],
    resources: ["Quantum flux", "Thought essence", "Void fragments", "Pure potential"],
    classes: ["Architect", "Oracle", "Void Walker", "Ascended"],
    governance: "Collective Consciousness",
    politics: ["Reality councils", "Dimensional accords", "Thought wars", "Existence debates"],
    unlockRequirement: "Master All Previous Eras",
    isLocked: true,
  },
];

export default function EraCodex() {
  const [selectedEra, setSelectedEra] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const goToPrev = () => {
    setSelectedEra(prev => (prev === 0 ? ERAS.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedEra(prev => (prev === ERAS.length - 1 ? 0 : prev + 1));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) goToNext();
      else goToPrev();
    }
  };

  const era = ERAS[selectedEra];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2">
          <Link href="/genesis" className="flex items-center gap-1 sm:gap-2 text-gray-400 hover:text-white transition-colors shrink-0">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs sm:text-sm hidden xs:inline">Genesis</span>
          </Link>
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <img src={darkwaveLogo} alt="DarkWave" className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="font-display font-bold text-sm sm:text-base">Era Codex</span>
          </div>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-[10px] sm:text-xs shrink-0">
            <Clock className="w-3 h-3 mr-1" />
            {ERAS.length} Eras
          </Badge>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-14">
        {/* Era Display */}
        <div 
          className="relative h-[70vh] min-h-[500px]"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={era.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <img 
                src={era.img} 
                alt={era.name} 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Era Info Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={era.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${era.color}`}>
                    <era.icon className="w-5 h-5 text-white" />
                  </div>
                  <Badge className={`bg-gradient-to-r ${era.color} text-white border-0`}>
                    {era.year}
                  </Badge>
                  {era.isLocked ? (
                    <Badge className="bg-gray-800 text-gray-400 border-gray-700">
                      <Lock className="w-3 h-3 mr-1" />
                      Locked
                    </Badge>
                  ) : (
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      <Unlock className="w-3 h-3 mr-1" />
                      Available
                    </Badge>
                  )}
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-2">
                  {era.name}
                </h1>
                <p className="text-lg sm:text-xl text-gray-300 mb-4">{era.subtitle}</p>
                <p className="text-gray-400 max-w-xl mb-6">{era.description}</p>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>{era.unlockRequirement}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <div className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 flex flex-col gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrev}
              className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white border border-white/10 backdrop-blur-sm"
              data-testid="button-era-prev"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white border border-white/10 backdrop-blur-sm"
              data-testid="button-era-next"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          {/* Era Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {ERAS.map((e, i) => (
              <button
                key={e.id}
                onClick={() => setSelectedEra(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === selectedEra
                    ? "bg-white scale-125"
                    : e.isLocked
                    ? "bg-gray-700"
                    : "bg-white/30 hover:bg-white/50"
                }`}
                data-testid={`button-era-dot-${i}`}
              />
            ))}
          </div>
        </div>

        {/* Era Details */}
        <section className="px-4 py-10 bg-gradient-to-b from-black to-purple-950/20">
          <div className="max-w-6xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {/* Mechanics */}
              <GlassCard className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Cog className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold">Core Mechanics</h3>
                </div>
                <ul className="space-y-2">
                  {era.mechanics.map((m, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      {m}
                    </li>
                  ))}
                </ul>
              </GlassCard>

              {/* Resources */}
              <GlassCard className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold">Resources</h3>
                </div>
                <ul className="space-y-2">
                  {era.resources.map((r, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      {r}
                    </li>
                  ))}
                </ul>
              </GlassCard>

              {/* Classes */}
              <GlassCard className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-purple-400" />
                  <h3 className="font-bold">Character Classes</h3>
                </div>
                <ul className="space-y-2">
                  {era.classes.map((c, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      {c}
                    </li>
                  ))}
                </ul>
              </GlassCard>

              {/* Governance */}
              <GlassCard className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Scale className="w-5 h-5 text-pink-400" />
                  <h3 className="font-bold">{era.governance}</h3>
                </div>
                <ul className="space-y-2">
                  {era.politics.map((p, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                      {p}
                    </li>
                  ))}
                </ul>
              </GlassCard>

              {/* Status */}
              <GlassCard className={`p-5 ${era.isLocked ? "opacity-60" : ""}`}>
                <div className="flex items-center gap-2 mb-4">
                  {era.isLocked ? (
                    <Lock className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Unlock className="w-5 h-5 text-green-400" />
                  )}
                  <h3 className="font-bold">Status</h3>
                </div>
                {era.isLocked ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500">This era is locked</p>
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <p className="text-xs text-gray-400">{era.unlockRequirement}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-green-400">Ready to explore!</p>
                    <Button className={`w-full bg-gradient-to-r ${era.color}`} disabled>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Coming Soon
                    </Button>
                  </div>
                )}
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Timeline Overview */}
        <section className="px-4 py-10 bg-gradient-to-b from-purple-950/20 to-black">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-display font-bold text-center mb-8">The Timeline</h2>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 via-purple-500 to-pink-500 hidden md:block" />
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {ERAS.map((e, i) => (
                  <button
                    key={e.id}
                    onClick={() => setSelectedEra(i)}
                    className={`relative text-center group transition-all duration-300 ${
                      i === selectedEra ? "scale-105" : "opacity-60 hover:opacity-100"
                    }`}
                    data-testid={`button-timeline-${e.id}`}
                  >
                    {/* Node */}
                    <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center border-2 transition-all ${
                      i === selectedEra
                        ? `bg-gradient-to-br ${e.color} border-white shadow-lg`
                        : e.isLocked
                        ? "bg-gray-800 border-gray-700"
                        : "bg-gray-900 border-gray-600 group-hover:border-white/50"
                    }`}>
                      {e.isLocked ? (
                        <Lock className="w-4 h-4 text-gray-500" />
                      ) : (
                        <e.icon className="w-5 h-5 text-white" />
                      )}
                    </div>
                    
                    <p className="mt-2 text-xs font-bold">{e.name}</p>
                    <p className="text-[10px] text-gray-500">{e.year}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Living World Vision */}
        <section className="px-4 py-16 bg-gradient-to-b from-black via-purple-950/10 to-black">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-pink-500/20 text-pink-300 border-pink-500/30">
                <Scale className="w-3 h-3 mr-1" />
                Living Political Simulation
              </Badge>
              <h2 className="text-3xl font-display font-bold mb-4">A World That Breathes</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                This isn't just a game with quests. It's a living microcosm of civilization itself - 
                with all its drama, politics, and pursuit of peace.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <GlassCard className="p-5 text-center">
                <Vote className="w-8 h-8 mx-auto mb-3 text-cyan-400" />
                <h3 className="font-bold mb-2">Player Councils</h3>
                <p className="text-sm text-gray-400">
                  Elected governing bodies run each realm. Campaign, vote, and shape policy.
                </p>
              </GlassCard>

              <GlassCard className="p-5 text-center">
                <Handshake className="w-8 h-8 mx-auto mb-3 text-green-400" />
                <h3 className="font-bold mb-2">Treaties & Alliances</h3>
                <p className="text-sm text-gray-400">
                  Formal agreements between factions. Trade pacts, non-aggression, or full alliance.
                </p>
              </GlassCard>

              <GlassCard className="p-5 text-center">
                <Swords className="w-8 h-8 mx-auto mb-3 text-red-400" />
                <h3 className="font-bold mb-2">Coups & Revolutions</h3>
                <p className="text-sm text-gray-400">
                  Overthrow corrupt leaders. Nothing is permanent. Power must be earned and defended.
                </p>
              </GlassCard>

              <GlassCard className="p-5 text-center">
                <Crown className="w-8 h-8 mx-auto mb-3 text-amber-400" />
                <h3 className="font-bold mb-2">Peace Summits</h3>
                <p className="text-sm text-gray-400">
                  Multi-faction negotiations. Work towards lasting peace - or plot the next war.
                </p>
              </GlassCard>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                The world evolves whether you're playing or not. Real-world timing. Real consequences.
              </p>
            </div>
          </div>
        </section>

        {/* Chrono Key Teaser */}
        <section className="px-4 py-16 bg-gradient-to-b from-black to-purple-950/30">
          <div className="max-w-2xl mx-auto text-center">
            <GlassCard className="p-8 border-2 border-purple-500/30">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-display font-bold mb-4">Chrono Keys</h2>
              <p className="text-gray-400 mb-6">
                Legendary achievements that unlock passage through time. 
                Earn them by mastering each era, and carry your legacy across all of history.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-black/30 rounded-lg p-3">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-amber-400" />
                  <p className="text-xs text-gray-500">Permanent NFT</p>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <Zap className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
                  <p className="text-xs text-gray-500">Era Access</p>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <Star className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                  <p className="text-xs text-gray-500">Unique Powers</p>
                </div>
              </div>
              <Link href="/genesis">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Become a Founding Creator
                </Button>
              </Link>
            </GlassCard>
          </div>
        </section>

        {/* AI Demo CTA */}
        <section className="px-4 py-10 bg-gradient-to-b from-purple-950/30 to-black">
          <div className="max-w-2xl mx-auto text-center">
            <Badge className="mb-4 bg-pink-500/20 text-pink-300 border-pink-500/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Try It Now
            </Badge>
            <h2 className="text-2xl font-display font-bold mb-4">Experience the AI</h2>
            <p className="text-gray-400 mb-6">
              See how the emotion-driven scenario generator creates morally complex situations with no "right" answers.
            </p>
            <Link href="/scenario-generator">
              <Button className="bg-gradient-to-r from-pink-600 to-purple-600">
                <Zap className="w-4 h-4 mr-2" />
                Launch Scenario Generator
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-white/5 text-center">
        <p className="text-sm text-gray-500">
          DarkWave Chronicles • Community-Built Universe
        </p>
      </footer>
    </div>
  );
}
