import { motion } from "framer-motion";
import { 
  Clock, Users, Brain, Shield, Crown, 
  Sparkles, Heart, Eye, Map, Coins, ChevronRight,
  ArrowLeft, Star, Flame, Target, Compass
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
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

const FEATURES = [
  {
    id: "realtime",
    title: "Real-Time Persistent World",
    subtitle: "24/7 - The World Never Sleeps",
    description: "The game runs in real-time. 24-hour days. When you sleep, work, or step away - the world continues without you. Events unfold. Relationships change. Opportunities pass. Just like real life.",
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
    icon: Eye,
    image: fantasyHeroes,
    color: "from-purple-500 to-pink-600",
    size: "large"
  },
  {
    id: "morality",
    title: "No Good. No Evil.",
    subtitle: "Only Perspective",
    description: "No alignment system. No karma. Everything is in the eye of the beholder. One man's freedom fighter is another man's terrorist. Actions have consequences based on relationships - not game-imposed morality.",
    icon: Shield,
    image: medievalKingdom,
    color: "from-amber-500 to-red-600",
    size: "medium"
  },
  {
    id: "political",
    title: "Political Simulation",
    subtitle: "Alliances. Coups. Power.",
    description: "Bad actors reveal themselves through choices. Organic alliances form. Political groups emerge from player behavior. Coups, power struggles, and conflicts arise naturally.",
    icon: Crown,
    image: cyberpunkCity,
    color: "from-red-500 to-orange-600",
    size: "medium"
  },
  {
    id: "ai",
    title: "AI-Driven Souls",
    subtitle: "Every Entity Thinks & Feels",
    description: "Each person has unique emotional responses. Some react emotionally, some rationally. Beliefs shape behavior. The full spectrum of human psychology, emulated through AI.",
    icon: Brain,
    image: quantumRealm,
    color: "from-violet-500 to-purple-600",
    size: "medium"
  },
  {
    id: "eras",
    title: "Era System & Time Travel",
    subtitle: "From Cro-Magnon to Beyond",
    description: "Choose your starting era. Progress through time. Discover artifacts that transport you to different periods. Complete quests to return. Your home era is your base.",
    icon: Compass,
    image: fantasyLands,
    color: "from-emerald-500 to-teal-600",
    size: "medium"
  },
  {
    id: "community",
    title: "Community-Built World",
    subtitle: "Your Creations. Your Property.",
    description: "Developers submit ideas. Approved content becomes real. Creators OWN their creations like real estate. Properties can be traded or LOST. Real stakes.",
    icon: Users,
    image: fantasyWorld,
    color: "from-blue-500 to-indigo-600",
    size: "medium"
  },
  {
    id: "rewards",
    title: "DWC Token Rewards",
    subtitle: "Play. Earn. Own.",
    description: "Certain missions reward you with actual DarkWave Coin (DWC) - real blockchain tokens with real value. Your time investment translates to tangible rewards.",
    icon: Coins,
    image: deepSpace,
    color: "from-yellow-500 to-amber-600",
    size: "medium"
  }
];

const ERAS = [
  { id: "cromagnon", name: "Dawn of Humanity", period: "Cro-Magnon Era", image: fantasyLands },
  { id: "ancient", name: "Ancient Civilizations", period: "Bronze & Iron Age", image: medievalKingdom },
  { id: "medieval", name: "Age of Kingdoms", period: "Medieval Period", image: fantasyWorld },
  { id: "renaissance", name: "Age of Enlightenment", period: "Renaissance", image: cyberpunkCity },
  { id: "industrial", name: "Age of Machines", period: "Industrial Revolution", image: deepSpace },
  { id: "future", name: "Beyond Tomorrow", period: "Future Eras", image: quantumRealm },
];

function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const Icon = feature.icon;
  const isLarge = feature.size === "large";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
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
      
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500" 
        style={{
          background: `linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)`,
          backgroundSize: '200% 200%',
          animation: 'shimmer 2s infinite',
        }}
      />
      
      <div className="relative z-10 p-6 h-full flex flex-col justify-end">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg backdrop-blur-sm`}>
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
  );
}

function EraCard({ era, index }: { era: typeof ERAS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -8 }}
      className="relative overflow-hidden rounded-xl border border-white/10 group cursor-pointer flex-shrink-0 w-[200px] h-[280px]"
      style={{ boxShadow: '0 0 30px rgba(0,0,0,0.5)' }}
      data-testid={`card-era-${era.id}`}
    >
      <img 
        src={era.image} 
        alt={era.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(6,182,212,0.3), rgba(168,85,247,0.3), rgba(236,72,153,0.3))',
          padding: '2px',
        }}
      />
      
      <div className="relative z-10 p-4 h-full flex flex-col justify-end">
        <Badge className="w-fit mb-2 bg-purple-500/30 text-purple-300 border-purple-500/50 text-[9px]">
          {era.period}
        </Badge>
        <h4 className="font-bold text-white text-sm">{era.name}</h4>
      </div>
    </motion.div>
  );
}

export default function Chronicles() {
  usePageAnalytics();
  
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-purple-500/50 text-purple-400 bg-purple-500/10 text-[10px] sm:text-xs whitespace-nowrap">
              <Sparkles className="w-3 h-3 mr-1" /> Coming 2026
            </Badge>
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 hover:bg-white/5 px-2">
                <ArrowLeft className="w-3 h-3" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative min-h-[90vh] flex items-center justify-center pt-14">
        <div className="absolute inset-0">
          <img 
            src={fantasyWorld} 
            alt="DarkWave Chronicles"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
        </div>
        
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(168,85,247,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(6,182,212,0.3) 0%, transparent 50%)',
          }}
        />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 text-white text-sm">
              <Flame className="w-4 h-4 mr-2 text-orange-400" />
              The Flagship Product of DarkWave Smart Chain
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                DarkWave
              </span>
              <br />
              <span className="text-white">Chronicles</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 font-light mb-4 max-w-3xl mx-auto">
              The Game That Never Ends
            </p>
            
            <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto leading-relaxed">
              A real-time life simulator where YOU are the character. Your beliefs. Your emotions. Your legacy.
              The world moves whether you're there or not.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/crowdfund">
                <Button size="lg" className="rounded-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/25" data-testid="button-support-chronicles">
                  <Heart className="w-5 h-5" />
                  Support Development
                </Button>
              </Link>
              <Link href="/roadmap-chronicles">
                <Button size="lg" variant="outline" className="rounded-full gap-2 border-white/20 hover:bg-white/10" data-testid="button-view-roadmap">
                  <Map className="w-5 h-5" />
                  View Roadmap
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronRight className="w-8 h-8 text-white/50 rotate-90" />
        </motion.div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              <Target className="w-3 h-3 mr-1" /> Core Philosophy
            </Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Not a Game You Play. A Life You Live.
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              This isn't escapism. It's exploration. Understand your real life by living a parallel one in a fantasy world.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
            {FEATURES.map((feature, i) => (
              <FeatureCard key={feature.id} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/30">
              <Compass className="w-3 h-3 mr-1" /> Choose Your Era
            </Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Where Will Your Story Begin?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start in any era. Progress through time. Travel between periods. Your home era is your base, but the entire timeline is your playground.
            </p>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide justify-start md:justify-center">
            {ERAS.map((era, i) => (
              <div key={era.id} className="snap-center">
                <EraCard era={era} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-3xl border border-white/10"
            style={{ boxShadow: '0 0 60px rgba(168,85,247,0.2)' }}
          >
            <img 
              src={fantasyHeroes} 
              alt="Join the Journey"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/60" />
            
            <div className="relative z-10 p-8 md:p-16">
              <div className="max-w-2xl">
                <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30">
                  <Star className="w-3 h-3 mr-1" /> Be Part of History
                </Badge>
                
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white">
                  Built By The Community.<br />For The Community.
                </h2>
                
                <p className="text-white/70 mb-6 leading-relaxed">
                  Early developers submit ideas. We determine feasibility. Approved creations become REAL content in the game world - and creators OWN their work like real estate. Properties can be traded. Properties can be LOST. Real stakes. Real consequences.
                </p>
                
                <p className="text-white/60 mb-8 text-sm">
                  Right now, it's one developer with a laptop and a vision. With your support, we'll build the infrastructure, the servers, and the team needed to bring this to life.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/crowdfund">
                    <Button size="lg" className="rounded-full gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white" data-testid="button-back-project">
                      <Coins className="w-5 h-5" />
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

      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-cyan-950/10 to-transparent">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
              <span className="text-white">You don't play a character.</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                You become one.
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create Your Own Legacy.
            </p>
            
            <Link href="/crowdfund">
              <Button size="lg" className="rounded-full gap-2 text-lg px-8 py-6 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400" data-testid="button-join-journey">
                <Sparkles className="w-5 h-5" />
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
