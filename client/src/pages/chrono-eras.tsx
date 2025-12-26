import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { 
  Clock, Users, Sword, Crown, Cog, Cpu, Rocket, Map, Sparkles,
  Filter, Grid, List, X, ChevronRight, Lock, Unlock, Star, Flame,
  Building, Heart, Coins, Shield, Brain, Globe, Compass, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Footer } from "@/components/footer";
import { ChronoLayout, HoloCard, CTABanner, chronoStyles } from "@/components/chrono-ui";
import { usePageAnalytics } from "@/hooks/use-analytics";

import fantasyWorld from "@assets/generated_images/fantasy_sci-fi_world_landscape.png";
import medievalKingdom from "@assets/generated_images/medieval_fantasy_kingdom.png";
import quantumRealm from "@assets/generated_images/quantum_dimension_realm.png";
import deepSpace from "@assets/generated_images/deep_space_station.png";
import cyberpunkCity from "@assets/generated_images/cyberpunk_neon_city.png";
import egyptianKingdom from "@assets/generated_images/ancient_egyptian_kingdom_sunset.png";
import wildWest from "@assets/generated_images/wild_west_frontier_town.png";
import victorianLondon from "@assets/generated_images/victorian_london_street_scene.png";
import greekAthens from "@assets/generated_images/ancient_greek_athens_parthenon.png";
import vikingFjord from "@assets/generated_images/viking_longship_fjord_scene.png";
import renaissanceFlorence from "@assets/generated_images/renaissance_florence_italy_scene.png";
import romanColosseum from "@assets/generated_images/roman_empire_colosseum_gladiators.png";
import feudalJapan from "@assets/generated_images/feudal_japan_samurai_castle.png";
import stoneAgeVillage from "@assets/generated_images/stone_age_village_scene.png";
import industrialCity from "@assets/generated_images/industrial_steampunk_city.png";

interface Era {
  id: string;
  name: string;
  subtitle: string;
  period: string;
  year: string;
  epoch: string;
  image: string;
  color: string;
  description: string;
  features: string[];
  classes: string[];
  governance: string;
}

const EPOCHS = ["All", "Prehistoric", "Ancient", "Classical", "Medieval", "Early Modern", "Industrial", "Modern", "Future"];

const ALL_ERAS: Era[] = [
  {
    id: "stone",
    name: "Dawn Age",
    subtitle: "The First Light",
    period: "Prehistoric",
    year: "50,000 BCE",
    epoch: "Prehistoric",
    image: stoneAgeVillage,
    color: "from-amber-600 to-orange-700",
    description: "Where every journey begins. Primitive tribes struggle for survival against megafauna and the elements.",
    features: ["Survival crafting", "Tribal politics", "Beast taming", "Cave exploration"],
    classes: ["Hunter", "Shaman", "Chieftain"],
    governance: "Tribal Councils"
  },
  {
    id: "egyptian",
    name: "Egyptian Dynasty",
    subtitle: "Children of the Nile",
    period: "Ancient",
    year: "2500 BCE",
    epoch: "Ancient",
    image: egyptianKingdom,
    color: "from-yellow-500 to-amber-600",
    description: "Build monuments to eternity. Navigate the courts of pharaohs. Unlock the mysteries of the pyramids.",
    features: ["Monument building", "Divine politics", "Trade routes", "Tomb exploration"],
    classes: ["Priest", "Scribe", "Warrior", "Architect"],
    governance: "Divine Monarchy"
  },
  {
    id: "greek",
    name: "Greek Golden Age",
    subtitle: "Birthplace of Democracy",
    period: "Classical",
    year: "450 BCE",
    epoch: "Classical",
    image: greekAthens,
    color: "from-blue-400 to-cyan-500",
    description: "Philosophy, democracy, and warfare. Debate in the agora. Fight in the phalanx. Shape Western civilization.",
    features: ["Philosophy debates", "Olympic games", "Naval warfare", "City-state politics"],
    classes: ["Philosopher", "Hoplite", "Politician", "Merchant"],
    governance: "Athenian Democracy"
  },
  {
    id: "roman",
    name: "Roman Empire",
    subtitle: "Eternal Glory",
    period: "Classical",
    year: "100 CE",
    epoch: "Classical",
    image: romanColosseum,
    color: "from-red-600 to-rose-700",
    description: "All roads lead to Rome. Conquer, govern, or entertain. The greatest empire the world has ever known.",
    features: ["Gladiatorial combat", "Senate politics", "Military conquest", "Engineering"],
    classes: ["Gladiator", "Senator", "Legionary", "Engineer"],
    governance: "Imperial Senate"
  },
  {
    id: "viking",
    name: "Viking Age",
    subtitle: "Norse Raiders",
    period: "Medieval",
    year: "900 CE",
    epoch: "Medieval",
    image: vikingFjord,
    color: "from-slate-500 to-gray-700",
    description: "Sail the fjords. Raid distant shores. Seek glory in Valhalla. The age of exploration and conquest.",
    features: ["Longship voyages", "Raiding parties", "Norse mythology", "Settlement building"],
    classes: ["Viking", "Skald", "Jarl", "Berserker"],
    governance: "Thing Assembly"
  },
  {
    id: "medieval",
    name: "Age of Crowns",
    subtitle: "Steel and Sorcery",
    period: "Medieval",
    year: "1200 CE",
    epoch: "Medieval",
    image: medievalKingdom,
    color: "from-violet-600 to-purple-700",
    description: "Kingdoms rise and fall. Knights quest for glory while dark forces gather. Choose your allegiance wisely.",
    features: ["Kingdom building", "Siege warfare", "Jousting tournaments", "Castle intrigue"],
    classes: ["Knight", "Mage", "Assassin", "Cleric"],
    governance: "Feudal Monarchy"
  },
  {
    id: "feudaljapan",
    name: "Feudal Japan",
    subtitle: "Way of the Warrior",
    period: "Medieval",
    year: "1600 CE",
    epoch: "Medieval",
    image: feudalJapan,
    color: "from-rose-400 to-pink-600",
    description: "Follow the bushido code. Serve your daimyo or forge your own path. Honor above all.",
    features: ["Samurai duels", "Ninja stealth", "Tea ceremonies", "Castle sieges"],
    classes: ["Samurai", "Ninja", "Ronin", "Geisha"],
    governance: "Shogunate"
  },
  {
    id: "renaissance",
    name: "Renaissance",
    subtitle: "Rebirth of Wonder",
    period: "Early Modern",
    year: "1500 CE",
    epoch: "Early Modern",
    image: renaissanceFlorence,
    color: "from-amber-400 to-yellow-500",
    description: "Art, science, and intrigue in the courts of Florence. Patron the masters. Scheme with the Medicis.",
    features: ["Art patronage", "Scientific discovery", "Court politics", "Banking empires"],
    classes: ["Artist", "Scholar", "Merchant Prince", "Condottiero"],
    governance: "City Republics"
  },
  {
    id: "wildwest",
    name: "Wild West",
    subtitle: "Frontier Justice",
    period: "Industrial",
    year: "1870 CE",
    epoch: "Industrial",
    image: wildWest,
    color: "from-orange-500 to-amber-700",
    description: "The frontier calls. Outlaws, lawmen, and fortune seekers carve out their destiny in the untamed West.",
    features: ["Gunfights", "Gold prospecting", "Railroad expansion", "Frontier towns"],
    classes: ["Sheriff", "Outlaw", "Prospector", "Rancher"],
    governance: "Frontier Law"
  },
  {
    id: "victorian",
    name: "Victorian London",
    subtitle: "Fog and Mystery",
    period: "Industrial",
    year: "1888 CE",
    epoch: "Industrial",
    image: victorianLondon,
    color: "from-gray-600 to-slate-800",
    description: "Navigate the fog-shrouded streets. Industry and innovation clash with ancient secrets and dark dealings.",
    features: ["Detective work", "Industrial espionage", "High society", "Underground networks"],
    classes: ["Detective", "Industrialist", "Aristocrat", "Inventor"],
    governance: "Constitutional Monarchy"
  },
  {
    id: "industrial",
    name: "Iron Epoch",
    subtitle: "Gears of Progress",
    period: "Industrial",
    year: "1885 CE",
    epoch: "Industrial",
    image: industrialCity,
    color: "from-zinc-500 to-zinc-700",
    description: "Steam power transforms civilization. Airship pirates rule the skies while inventors race to unlock forbidden sciences.",
    features: ["Invention crafting", "Airship combat", "Factory management", "Automaton companions"],
    classes: ["Engineer", "Aeronaut", "Investigator", "Automancer"],
    governance: "Industrial Parliament"
  },
  {
    id: "cyber",
    name: "Neon Dominion",
    subtitle: "Chrome and Code",
    period: "Future",
    year: "2087 CE",
    epoch: "Future",
    image: cyberpunkCity,
    color: "from-cyan-500 to-blue-600",
    description: "Megacorporations rule. Hackers fight for freedom. Augment your body, protect your mind. The future is now.",
    features: ["Hacking", "Cybernetic augmentation", "Corporate espionage", "Street warfare"],
    classes: ["Netrunner", "Solo", "Fixer", "Corpo"],
    governance: "Corporate Oligarchy"
  },
  {
    id: "space",
    name: "Stellar Exodus",
    subtitle: "Beyond the Stars",
    period: "Future",
    year: "2300 CE",
    epoch: "Future",
    image: deepSpace,
    color: "from-indigo-500 to-purple-600",
    description: "Humanity spreads across the cosmos. Explore strange worlds. Build stellar empires. The final frontier awaits.",
    features: ["Space exploration", "Alien diplomacy", "Colony building", "Starship combat"],
    classes: ["Captain", "Explorer", "Diplomat", "Engineer"],
    governance: "Galactic Federation"
  },
];

function EraModal({ era, onClose }: { era: Era; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        onClick={e => e.stopPropagation()}
        className="relative max-w-2xl w-full bg-gray-900/95 border border-white/10 rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: '0 0 80px rgba(168,85,247,0.3)' }}
      >
        <div className="relative h-56">
          <img src={era.image} alt={era.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white transition-colors"
            data-testid={`button-close-${era.id}`}
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-6 right-6">
            <Badge className={`mb-2 bg-gradient-to-r ${era.color} text-white border-0`}>
              {era.period} • {era.year}
            </Badge>
            <h3 className="text-3xl font-bold text-white">{era.name}</h3>
            <p className="text-white/60">{era.subtitle}</p>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <p className="text-white/80 text-lg leading-relaxed">{era.description}</p>
          
          <div>
            <h4 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-3">Core Features</h4>
            <div className="flex flex-wrap gap-2">
              {era.features.map((feature, i) => (
                <Badge key={i} variant="outline" className="border-white/20 text-white/70">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-3">Classes</h4>
              <div className="space-y-2">
                {era.classes.map((cls, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/70">
                    <Star className="w-3 h-3 text-amber-400" />
                    {cls}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-3">Governance</h4>
              <div className="flex items-center gap-2 text-white/70">
                <Crown className="w-4 h-4 text-purple-400" />
                {era.governance}
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-white/10">
            <Link href="/community">
              <Button className="w-full rounded-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600" data-testid={`join-era-${era.id}`}>
                <Heart className="w-4 h-4" />
                Join Waitlist for Early Access
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ChronoEras() {
  usePageAnalytics();
  const [selectedEpoch, setSelectedEpoch] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEra, setSelectedEra] = useState<Era | null>(null);
  
  const filteredEras = ALL_ERAS.filter(era => {
    const matchesEpoch = selectedEpoch === "All" || era.epoch === selectedEpoch;
    const matchesSearch = era.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          era.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          era.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEpoch && matchesSearch;
  });
  
  return (
    <ChronoLayout currentPage="/eras">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src={fantasyWorld} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              <Globe className="w-3 h-3 mr-1" /> The ChronoVerse
            </Badge>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 text-white">
              Era Explorer
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              70+ historical periods. Each running as its own living world.
              Choose where your legacy begins.
            </p>
          </motion.div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                placeholder="Search eras..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                data-testid="input-search-eras"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {EPOCHS.map((epoch) => (
                <Button
                  key={epoch}
                  variant={selectedEpoch === epoch ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedEpoch(epoch)}
                  className={`whitespace-nowrap ${selectedEpoch === epoch ? 'bg-purple-600' : 'border-white/20 hover:bg-white/10'}`}
                  data-testid={`filter-${epoch.toLowerCase()}`}
                >
                  {epoch}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="text-sm text-white/50 mb-6">
            Showing {filteredEras.length} of {ALL_ERAS.length} eras
          </div>
        </div>
      </section>

      <section className="py-12 px-4 pb-32">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEras.map((era, i) => (
              <motion.div
                key={era.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <HoloCard 
                  image={era.image} 
                  onClick={() => setSelectedEra(era)}
                  className="aspect-[3/4]"
                >
                  <div className="p-5 h-full flex flex-col justify-end">
                    <Badge className={`w-fit mb-2 bg-gradient-to-r ${era.color} text-white border-0 text-[10px]`}>
                      {era.year}
                    </Badge>
                    <h3 className="font-bold text-white text-lg mb-1">{era.name}</h3>
                    <p className="text-white/60 text-sm mb-2">{era.subtitle}</p>
                    <p className="text-white/40 text-xs line-clamp-2">{era.description}</p>
                  </div>
                </HoloCard>
              </motion.div>
            ))}
          </div>
          
          {filteredEras.length === 0 && (
            <div className="text-center py-16">
              <p className="text-white/50 text-lg">No eras found matching your criteria.</p>
              <Button 
                variant="outline" 
                className="mt-4 border-white/20"
                onClick={() => { setSelectedEpoch("All"); setSearchQuery(""); }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedEra && (
          <EraModal era={selectedEra} onClose={() => setSelectedEra(null)} />
        )}
      </AnimatePresence>

      <CTABanner
        title="Can't Decide?"
        subtitle="Join the waitlist and get early access to explore all eras when we launch."
        primaryAction={{ label: "Join Waitlist", href: "/community" }}
        backgroundImage={quantumRealm}
      />

      <Footer />
      
      <style>{chronoStyles}</style>
    </ChronoLayout>
  );
}
