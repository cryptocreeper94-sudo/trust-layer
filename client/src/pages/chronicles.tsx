import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, Users, Brain, Shield, Crown, Sparkles, Heart, Eye, Map, Coins, 
  ChevronRight, ChevronLeft, ArrowLeft, Star, Flame, Target, Compass,
  Globe, Zap, History, Theater, Sword, BookOpen, Building, Rocket,
  Info, X, Play, Volume2, VolumeX
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/footer";
import { usePageAnalytics } from "@/hooks/use-analytics";

import fantasyWorld from "@assets/generated_images/fantasy_sci-fi_world_landscape.png";
import medievalKingdom from "@assets/generated_images/medieval_fantasy_kingdom.png";
import quantumRealm from "@assets/generated_images/quantum_dimension_realm.png";
import deepSpace from "@assets/generated_images/deep_space_station.png";
import cyberpunkCity from "@assets/generated_images/cyberpunk_neon_city.png";
import fantasyHeroes from "@assets/generated_images/fantasy_character_heroes.png";
import fantasyLands from "@assets/generated_images/fantasy_lands_and_realms.png";
import stoneAgeVillage from "@assets/generated_images/stone_age_village_scene.png";
import industrialCity from "@assets/generated_images/industrial_steampunk_city.png";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

import egyptianKingdom from "@assets/generated_images/ancient_egyptian_kingdom_sunset.png";
import wildWest from "@assets/generated_images/wild_west_frontier_town.png";
import victorianLondon from "@assets/generated_images/victorian_london_street_scene.png";
import greekAthens from "@assets/generated_images/ancient_greek_athens_parthenon.png";
import vikingFjord from "@assets/generated_images/viking_longship_fjord_scene.png";
import renaissanceFlorence from "@assets/generated_images/renaissance_florence_italy_scene.png";
import romanColosseum from "@assets/generated_images/roman_empire_colosseum_gladiators.png";
import feudalJapan from "@assets/generated_images/feudal_japan_samurai_castle.png";

import heroVideo from "@assets/generated_videos/fantasy_world_cinematic_flyover.mp4";

const CORE_FEATURES = [
  {
    id: "realtime",
    title: "Real-Time Persistent World",
    subtitle: "24/7 - The World Never Sleeps",
    description: "The world runs in real-time. 24-hour days. When you sleep, work, or step away - life continues. Events unfold. Relationships change. Opportunities pass. Just like real life.",
    longDescription: "This isn't a game you pause. It's a life you live. Every second that passes in your world, passes here. Miss a day? The world moved without you. That's the point. Real stakes. Real time. Real consequences.",
    icon: Clock,
    image: deepSpace,
    color: "from-cyan-500 to-blue-600",
    size: "large"
  },
  {
    id: "you",
    title: "YOU Are The Character",
    subtitle: "Not Role-Playing. BEING.",
    description: "This is YOU stepping into a fantasy realm as yourself. Your personality, emotions, beliefs, faith, values. First-person. You don't control a puppet - you ARE the person.",
    longDescription: "Strip away the avatar. This is your actual self - your psychology, your moral compass, your decision-making patterns - placed into a fantasy world. How would YOU navigate ancient Rome? What would YOU do during the French Revolution? Find out.",
    icon: Eye,
    image: fantasyHeroes,
    color: "from-purple-500 to-pink-600",
    size: "large"
  },
  {
    id: "morality",
    title: "No Good. No Evil.",
    subtitle: "Only Perspective",
    description: "No alignment system. No karma meter. Everything is in the eye of the beholder. One person's freedom fighter is another's terrorist.",
    longDescription: "We removed the moral judgment. There's no game telling you what's right or wrong. Actions have consequences based on relationships and perspectives - not artificial game-imposed morality. Just like real life.",
    icon: Shield,
    image: medievalKingdom,
    color: "from-amber-500 to-red-600",
    size: "medium"
  },
  {
    id: "political",
    title: "Political Simulation",
    subtitle: "Alliances. Coups. Power.",
    description: "Bad actors reveal themselves through choices. Organic alliances form. Political groups emerge from player behavior, not scripts.",
    longDescription: "Governments form. Dictatorships rise. Democracies emerge. Coups happen. All based on real player behavior. This is a social experiment - watching how human psychology shapes civilization when people actually control it.",
    icon: Crown,
    image: cyberpunkCity,
    color: "from-red-500 to-orange-600",
    size: "medium"
  },
  {
    id: "ai",
    title: "AI-Driven Souls",
    subtitle: "Every Entity Thinks & Feels",
    description: "Each person has unique emotional responses. Beliefs shape behavior. The full spectrum of human psychology, emulated through AI.",
    longDescription: "Every NPC runs on a dynamic psychological model. Some are emotional. Some rational. Some chaotic. Their beliefs, fears, ambitions, and traumas shape every interaction. You're not reading scripts - you're engaging with simulated consciousness.",
    icon: Brain,
    image: quantumRealm,
    color: "from-violet-500 to-purple-600",
    size: "medium"
  },
  {
    id: "eras",
    title: "70+ Historical Eras",
    subtitle: "All of Human History",
    description: "From dinosaurs to space colonies. Stone Age to Cyberpunk. Victorian London to the Wild West. Every era you've ever dreamed of living in.",
    longDescription: "This isn't 4-6 generic time periods. This is EVERY recognizable historical moment. Biblical times. Egyptian dynasties. Roman gladiators. Viking raids. Renaissance art. Civil Rights movement. All accessible. All playable. All yours.",
    icon: Compass,
    image: fantasyLands,
    color: "from-emerald-500 to-teal-600",
    size: "medium"
  },
  {
    id: "community",
    title: "Community-Built World",
    subtitle: "Your Creations. Your Property.",
    description: "Developers submit ideas. Approved content becomes real. Creators OWN their creations like real estate. Can be traded or LOST.",
    longDescription: "This world is built BY players FOR players. Submit an idea. If approved, it becomes real content - and you OWN it. Like actual property. It can be traded, sold, or lost. Real stakes in a virtual world.",
    icon: Users,
    image: fantasyWorld,
    color: "from-blue-500 to-indigo-600",
    size: "medium"
  },
  {
    id: "economy",
    title: "DWC Blockchain Economy",
    subtitle: "Real Currency. Real Value.",
    description: "Trade with DarkWave Coin. Every transaction is blockchain-verified. Buy, sell, trade - with real cryptocurrency that has real value.",
    longDescription: "DWC isn't play money. It's real blockchain currency on DarkWave Smart Chain. Buy gear from other players. Trade resources across eras. Every transaction is stamped, tracked, and auditable. A real economy with a fantasy skin.",
    icon: Coins,
    image: deepSpace,
    color: "from-yellow-500 to-amber-600",
    size: "medium"
  }
];

const EPOCHS = [
  {
    id: "prehistoric",
    name: "Prehistoric",
    period: "Before Written History",
    image: stoneAgeVillage,
    eras: ["Time of Dinosaurs", "Stone Age", "Bronze Age", "Iron Age", "Cro-Magnon"],
    incentive: "Pristine resources, untouched elements",
    color: "from-amber-600 to-orange-700"
  },
  {
    id: "ancient",
    name: "Ancient World",
    period: "3000 BCE - 500 CE",
    image: egyptianKingdom,
    eras: ["Egyptian Dynasties", "Greek Golden Age", "Roman Empire", "Persian Empire", "Han Dynasty"],
    incentive: "Lost knowledge, mystical artifacts",
    color: "from-yellow-500 to-amber-600"
  },
  {
    id: "classical",
    name: "Classical Era",
    period: "Mediterranean Glory",
    image: greekAthens,
    eras: ["Athenian Democracy", "Spartan Warriors", "Alexander's Conquest", "Roman Republic"],
    incentive: "Philosophy, democracy, military might",
    color: "from-blue-400 to-cyan-500"
  },
  {
    id: "roman",
    name: "Roman Empire",
    period: "Eternal Rome",
    image: romanColosseum,
    eras: ["Republic Era", "Imperial Glory", "Gladiatorial Games", "Fall of Rome"],
    incentive: "Engineering, conquest, political power",
    color: "from-red-600 to-rose-700"
  },
  {
    id: "viking",
    name: "Viking Age",
    period: "Norse Raiders",
    image: vikingFjord,
    eras: ["Fjord Settlements", "Raider Voyages", "Valhalla Legends", "Norse Exploration"],
    incentive: "Exploration, combat, mythology",
    color: "from-slate-500 to-gray-700"
  },
  {
    id: "medieval",
    name: "Medieval",
    period: "500 CE - 1500 CE",
    image: medievalKingdom,
    eras: ["Dark Ages", "Crusades", "High Medieval", "Black Death", "Feudal Japan"],
    incentive: "Political power, land ownership",
    color: "from-stone-500 to-stone-700"
  },
  {
    id: "feudaljapan",
    name: "Feudal Japan",
    period: "Way of the Samurai",
    image: feudalJapan,
    eras: ["Samurai Era", "Shogunate Rule", "Ninja Clans", "Edo Period"],
    incentive: "Honor, martial arts, tradition",
    color: "from-rose-400 to-pink-600"
  },
  {
    id: "renaissance",
    name: "Renaissance",
    period: "Rebirth of Culture",
    image: renaissanceFlorence,
    eras: ["Medici Florence", "Da Vinci Era", "Artistic Revolution", "Scientific Dawn"],
    incentive: "Art, innovation, cultural influence",
    color: "from-amber-400 to-yellow-500"
  },
  {
    id: "victorian",
    name: "Victorian Era",
    period: "Industrial Empire",
    image: victorianLondon,
    eras: ["Sherlock Holmes London", "Jack the Ripper", "Industrial Revolution", "British Empire"],
    incentive: "Manufacturing, wealth, technology",
    color: "from-gray-600 to-slate-800"
  },
  {
    id: "wildwest",
    name: "Wild West",
    period: "American Frontier",
    image: wildWest,
    eras: ["Gold Rush", "Cowboy Era", "Outlaw Days", "Railroad Expansion"],
    incentive: "Freedom, adventure, frontier justice",
    color: "from-orange-500 to-amber-700"
  },
  {
    id: "industrial",
    name: "Industrial Age",
    period: "Age of Machines",
    image: industrialCity,
    eras: ["Factory Era", "Gilded Age", "Steam Power", "Urban Revolution"],
    incentive: "Manufacturing, wealth accumulation",
    color: "from-zinc-500 to-zinc-700"
  },
  {
    id: "modern",
    name: "Modern Movements",
    period: "1920 - 2000",
    image: cyberpunkCity,
    eras: ["Roaring Twenties", "Civil Rights", "Hippie Era", "Cold War"],
    incentive: "Social change, technology access",
    color: "from-purple-500 to-violet-700"
  },
  {
    id: "future",
    name: "Future & Beyond",
    period: "Tomorrow's World",
    image: quantumRealm,
    eras: ["Cyberpunk Cities", "Space Colonies", "AI Revolution", "Interstellar Age"],
    incentive: "Ultimate technology, space travel",
    color: "from-cyan-400 to-blue-600"
  }
];

const DEFINITIONS: Record<string, { term: string; definition: string }> = {
  "persistent": { term: "Persistent World", definition: "A game world that continues to exist and evolve even when you're not playing. Events happen, economies shift, and relationships change 24/7." },
  "era": { term: "Era", definition: "A specific historical time period you can choose to live in. Each era has unique fashion, architecture, events, and opportunities." },
  "dwc": { term: "DWC (DarkWave Coin)", definition: "The cryptocurrency used within Chronicles. Real blockchain tokens with real value that can be traded, spent, and earned through gameplay." },
  "epoch": { term: "Epoch", definition: "A major division of historical time containing multiple related eras. Example: The Medieval Epoch contains Dark Ages, Crusades, and High Medieval eras." },
  "echoes": { term: "Temporal Echoes", definition: "Narrative connections between eras - artifacts, legends, and stories that reference events from other time periods without creating causal paradoxes." }
};

function DefinitionModal({ term, onClose }: { term: string; onClose: () => void }) {
  const def = DEFINITIONS[term];
  if (!def) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="relative max-w-md w-full bg-gray-900/95 border border-white/10 rounded-2xl p-6 shadow-2xl"
        style={{ boxShadow: '0 0 60px rgba(168,85,247,0.2)' }}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
          data-testid="button-close-definition"
        >
          <X className="w-5 h-5" />
        </button>
        <Badge className="mb-3 bg-purple-500/20 text-purple-400 border-purple-500/30">
          <BookOpen className="w-3 h-3 mr-1" /> Definition
        </Badge>
        <h3 className="text-xl font-bold text-white mb-2">{def.term}</h3>
        <p className="text-white/70 leading-relaxed">{def.definition}</p>
      </motion.div>
    </motion.div>
  );
}

function InfoTooltip({ termKey, children }: { termKey: string; children: React.ReactNode }) {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <span 
        className="inline-flex items-center gap-1 cursor-help border-b border-dashed border-white/30 hover:border-purple-400 transition-colors"
        onClick={() => setShowModal(true)}
        data-testid={`tooltip-${termKey}`}
      >
        {children}
        <Info className="w-3 h-3 text-purple-400" />
      </span>
      <AnimatePresence>
        {showModal && <DefinitionModal term={termKey} onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </>
  );
}

function FeatureCard({ feature, index }: { feature: typeof CORE_FEATURES[0]; index: number }) {
  const [showDetail, setShowDetail] = useState(false);
  const Icon = feature.icon;
  const isLarge = feature.size === "large";
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.08 }}
        whileHover={{ scale: 1.02, y: -4 }}
        onClick={() => setShowDetail(true)}
        className={`relative overflow-hidden rounded-2xl border border-white/10 group cursor-pointer ${
          isLarge ? "md:col-span-2 md:row-span-2" : ""
        }`}
        style={{ 
          boxShadow: '0 0 40px rgba(0,0,0,0.5)',
          minHeight: isLarge ? '400px' : '280px'
        }}
        data-testid={`card-feature-${feature.id}`}
      >
        <img 
          src={feature.image} 
          alt={feature.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
        
        <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
            backgroundSize: '200% 200%',
            animation: 'shimmer 2s infinite linear',
          }}
        />
        
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <Info className="w-4 h-4 text-white" />
          </div>
        </div>
        
        <div className="relative z-10 p-6 h-full flex flex-col justify-end">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg backdrop-blur-sm`}
            style={{ boxShadow: `0 0 30px rgba(255,255,255,0.1)` }}
          >
            <Icon className="w-7 h-7 text-white" />
          </div>
          
          <Badge className="w-fit mb-2 bg-white/10 text-white/80 border-white/20 text-[10px]">
            {feature.subtitle}
          </Badge>
          
          <h3 className={`font-bold text-white mb-2 ${isLarge ? 'text-2xl md:text-3xl' : 'text-lg'}`}>
            {feature.title}
          </h3>
          
          <p className={`text-white/70 leading-relaxed ${isLarge ? 'text-sm md:text-base' : 'text-xs'}`}>
            {feature.description}
          </p>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {showDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setShowDetail(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              onClick={e => e.stopPropagation()}
              className="relative max-w-2xl w-full bg-gray-900/95 border border-white/10 rounded-3xl overflow-hidden"
              style={{ boxShadow: '0 0 80px rgba(168,85,247,0.3)' }}
            >
              <div className="relative h-48">
                <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                <button 
                  onClick={() => setShowDetail(false)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white transition-colors"
                  data-testid={`button-close-${feature.id}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 -mt-16 relative z-10 shadow-xl`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <Badge className="mb-3 bg-white/10 text-white/80 border-white/20">
                  {feature.subtitle}
                </Badge>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-white/80 leading-relaxed text-lg">{feature.longDescription}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function EpochCard({ epoch, index }: { epoch: typeof EPOCHS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.03, y: -8 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 group cursor-pointer flex-shrink-0 w-[280px] h-[380px]"
      style={{ boxShadow: '0 0 40px rgba(0,0,0,0.5)' }}
      data-testid={`card-epoch-${epoch.id}`}
    >
      <img 
        src={epoch.image} 
        alt={epoch.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, transparent, rgba(168,85,247,0.2), transparent)`,
          boxShadow: 'inset 0 0 40px rgba(168,85,247,0.1)',
        }}
      />
      
      <div className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, transparent, rgba(168,85,247,0.8), transparent)` }}
      />
      
      <div className="relative z-10 p-5 h-full flex flex-col justify-end">
        <Badge className={`w-fit mb-2 bg-gradient-to-r ${epoch.color} text-white border-0 text-[9px] shadow-lg`}>
          {epoch.period}
        </Badge>
        <h4 className="font-bold text-white text-xl mb-2">{epoch.name}</h4>
        <div className="flex flex-wrap gap-1 mb-3">
          {epoch.eras.slice(0, 3).map((era, i) => (
            <span key={i} className="text-[10px] text-white/60 bg-white/5 px-2 py-0.5 rounded-full">
              {era}
            </span>
          ))}
          {epoch.eras.length > 3 && (
            <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
              +{epoch.eras.length - 3} more
            </span>
          )}
        </div>
        <p className="text-xs text-white/50">{epoch.incentive}</p>
      </div>
    </motion.div>
  );
}

export default function Chronicles() {
  usePageAnalytics();
  const [epochScrollPos, setEpochScrollPos] = useState(0);
  const [videoMuted, setVideoMuted] = useState(true);
  
  const scrollEpochs = (direction: 'left' | 'right') => {
    const container = document.getElementById('epoch-carousel');
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({ left: direction === 'right' ? scrollAmount : -scrollAmount, behavior: 'smooth' });
    }
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden overflow-y-auto selection:bg-primary/20 selection:text-primary w-full max-w-full">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0" data-testid="link-home">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-purple-500/50 text-purple-400 bg-purple-500/10 text-[10px] sm:text-xs whitespace-nowrap animate-pulse">
              <Sparkles className="w-3 h-3 mr-1" /> Coming 2026
            </Badge>
            <Link href="/" data-testid="link-back">
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 hover:bg-white/5 px-2">
                <ArrowLeft className="w-3 h-3" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center justify-center pt-14 overflow-hidden">
        <div className="absolute inset-0">
          <video 
            autoPlay 
            loop 
            muted={videoMuted}
            playsInline
            className="w-full h-full object-cover"
            poster={fantasyWorld}
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70" />
        </div>
        
        <div className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(168,85,247,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(6,182,212,0.4) 0%, transparent 50%)',
          }}
        />
        
        <button
          onClick={() => setVideoMuted(!videoMuted)}
          className="absolute bottom-8 right-8 z-20 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-all"
          data-testid="button-toggle-sound"
        >
          {videoMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Badge className="mb-6 px-3 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 text-white text-xs sm:text-sm backdrop-blur-sm max-w-full whitespace-normal text-center leading-tight">
              <Flame className="w-4 h-4 mr-2 text-orange-400 animate-pulse flex-shrink-0" />
              <span className="hidden sm:inline">The Flagship Product of DarkWave Smart Chain</span>
              <span className="sm:hidden">DarkWave Flagship Product</span>
            </Badge>
            
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-display font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
                DarkWave
              </span>
              <br />
              <span className="text-white drop-shadow-2xl">Chronicles</span>
            </h1>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <p className="text-2xl md:text-4xl font-bold text-white mb-2">
                Not A Game. <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">A Life.</span>
              </p>
              <p className="text-lg md:text-xl text-white/70 mb-8 max-w-3xl mx-auto leading-relaxed">
                A real-time life simulator where YOU are the character. Your beliefs. Your emotions. <span className="text-white font-semibold">Your Legacy.</span>
                <br className="hidden md:block" />
                The world moves whether you're there or not. As real as it gets without being your actual life.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/crowdfund">
                <Button size="lg" className="rounded-full gap-2 text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all" data-testid="button-support-development">
                  <Heart className="w-5 h-5" />
                  Support Development
                </Button>
              </Link>
              <Link href="/presale">
                <Button size="lg" variant="outline" className="rounded-full gap-2 text-lg px-8 py-6 border-white/20 hover:bg-white/10 backdrop-blur-sm" data-testid="button-get-dwc">
                  <Coins className="w-5 h-5" />
                  Get DWC Tokens
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronRight className="w-10 h-10 text-white/40 rotate-90" />
        </motion.div>
      </section>

      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-purple-950/10 to-background pointer-events-none" />
        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              <Target className="w-3 h-3 mr-1" /> Core Philosophy
            </Badge>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              <InfoTooltip termKey="persistent">Not a Game You Play.</InfoTooltip> A Life You Live.
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              This isn't escapism. It's exploration. Understand your real life by living a parallel one.
              <br />Every choice matters. Every action echoes. Every moment is yours.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
            {CORE_FEATURES.map((feature, i) => (
              <FeatureCard key={feature.id} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(168,85,247,0.3) 0%, transparent 50%)',
          }}
        />
        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/30">
              <History className="w-3 h-3 mr-1" /> 70+ Historical Eras
            </Badge>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Where Will Your Story Begin?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              From the dawn of humanity to the edges of the galaxy. Every <InfoTooltip termKey="era">era</InfoTooltip> you've dreamed of living in.
              <br />Each runs as its own universe - shaped by the players who choose it.
            </p>
          </motion.div>
          
          <div className="relative">
            <button
              onClick={() => scrollEpochs('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/90 transition-all shadow-xl hidden md:flex"
              data-testid="button-scroll-left"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div 
              id="epoch-carousel"
              className="flex gap-5 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-hide px-4 md:px-12"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {EPOCHS.map((epoch, i) => (
                <div key={epoch.id} className="snap-center">
                  <EpochCard epoch={epoch} index={i} />
                </div>
              ))}
            </div>
            
            <button
              onClick={() => scrollEpochs('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/90 transition-all shadow-xl hidden md:flex"
              data-testid="button-scroll-right"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-white/50 text-sm mt-8"
          >
            Each <InfoTooltip termKey="epoch">epoch</InfoTooltip> contains multiple eras. <InfoTooltip termKey="echoes">Echoes</InfoTooltip> connect them through artifacts and legends.
          </motion.p>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-3xl border border-white/10"
            style={{ boxShadow: '0 0 80px rgba(245,158,11,0.15)' }}
          >
            <img 
              src={deepSpace} 
              alt="DWC Economy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/70" />
            
            <div className="relative z-10 p-8 md:p-16 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30">
                  <Coins className="w-3 h-3 mr-1" /> Blockchain Economy
                </Badge>
                
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white">
                  Real Currency.<br />Real Economy.<br />Real Stakes.
                </h2>
                
                <p className="text-white/70 mb-6 leading-relaxed">
                  <InfoTooltip termKey="dwc">DWC</InfoTooltip> isn't play money. It's real cryptocurrency on DarkWave Smart Chain. 
                  Every transaction is blockchain-verified, stamped, and auditable.
                </p>
                
                <ul className="space-y-3 mb-8">
                  {[
                    "Buy gear and supplies from other players",
                    "Trade resources gathered across eras",
                    "Own property with real blockchain deeds",
                    "Earn through missions and achievements",
                    "Full audit trail on every transaction"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white/80">
                      <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <Zap className="w-3 h-3 text-amber-400" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                
                <Link href="/presale">
                  <Button size="lg" className="rounded-full gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-lg" data-testid="button-join-presale">
                    <Coins className="w-5 h-5" />
                    Join Token Presale
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Commerce", desc: "Buy, sell, trade", icon: Building },
                  { label: "Ownership", desc: "Real blockchain deeds", icon: Shield },
                  { label: "Earnings", desc: "Skill-based rewards", icon: Star },
                  { label: "Audit Trail", desc: "Full transparency", icon: BookOpen }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                  >
                    <item.icon className="w-8 h-8 text-amber-400 mb-2" />
                    <h4 className="font-bold text-white">{item.label}</h4>
                    <p className="text-xs text-white/50">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-3xl border border-white/10"
            style={{ boxShadow: '0 0 60px rgba(168,85,247,0.2)' }}
          >
            <img 
              src={fantasyHeroes} 
              alt="Join the Journey"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/60" />
            
            <div className="relative z-10 p-8 md:p-16">
              <div className="max-w-2xl">
                <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/30">
                  <Users className="w-3 h-3 mr-1" /> Community-Built
                </Badge>
                
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white">
                  Built By The Community.<br />For The Community.
                </h2>
                
                <p className="text-white/70 mb-6 leading-relaxed">
                  Submit your ideas. If approved, they become REAL content in the game world - and you OWN it. 
                  Like actual property. It can be traded, sold, or lost. Real stakes in a virtual world.
                </p>
                
                <p className="text-white/60 mb-8 text-sm border-l-2 border-purple-500/50 pl-4">
                  Right now, it's one developer with a laptop and a vision. With your support, we'll build the 
                  infrastructure, the servers, and the team needed to bring this to life.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/crowdfund">
                    <Button size="lg" className="rounded-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg" data-testid="button-back-project">
                      <Heart className="w-5 h-5" />
                      Back This Project
                    </Button>
                  </Link>
                  <Link href="/developers">
                    <Button size="lg" variant="outline" className="rounded-full gap-2 border-white/20 hover:bg-white/10" data-testid="button-join-developers">
                      <Users className="w-5 h-5" />
                      Join as Developer
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-cyan-950/10 to-transparent">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
              <span className="text-white">You don't play a character.</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                You become one.
              </span>
            </h2>
            
            <p className="text-2xl text-muted-foreground mb-4">
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent font-bold">Live Your Legacy.</span>
            </p>
            
            <p className="text-lg text-white/50 mb-10 max-w-2xl mx-auto">
              As real as it gets without being your actual life.
            </p>
            
            <Link href="/crowdfund">
              <Button size="lg" className="rounded-full gap-2 text-xl px-10 py-7 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all" data-testid="button-join-journey">
                <Sparkles className="w-6 h-6" />
                Join the Journey
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
      
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% -200%; }
          100% { background-position: 200% 200%; }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
