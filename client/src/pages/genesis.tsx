import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { 
  ArrowLeft, Sparkles, Users, MapPin, Palette, Scroll, Crown, 
  ChevronRight, Zap, Globe, Heart, Star, Lock, Mail, Wallet,
  Swords, Wand2, Target, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/glass-card";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";
import worldImg from "@assets/generated_images/fantasy_sci-fi_world_landscape.png";
import warriorImg from "@assets/generated_images/warrior_character_concept_art.png";
import mageImg from "@assets/generated_images/mage_character_concept_art.png";
import rogueImg from "@assets/generated_images/rogue_assassin_concept_art.png";
import dragonImg from "@assets/generated_images/crystal_dragon_creature.png";
import landsImg from "@assets/generated_images/fantasy_lands_and_realms.png";
import charactersImg from "@assets/generated_images/fantasy_character_heroes.png";
import loreImg from "@assets/generated_images/ancient_lore_library.png";
import artifactsImg from "@assets/generated_images/legendary_weapons_artifacts.png";

const CONTRIBUTION_TYPES = [
  {
    icon: MapPin,
    title: "Lands & Realms",
    desc: "Design regions, cities, and sacred grounds that become permanent fixtures in the world",
    color: "from-emerald-500 to-teal-500",
    example: "The Shattered Isles, Nexus Prime, Crystal Caverns",
    img: landsImg
  },
  {
    icon: Users,
    title: "Characters & Legends",
    desc: "Create heroes, villains, and mythical figures whose stories echo through the ages",
    color: "from-purple-500 to-pink-500",
    example: "NPCs, bosses, historical figures",
    img: charactersImg
  },
  {
    icon: Scroll,
    title: "Lore & History",
    desc: "Write the ancient texts, prophecies, and historical events that shape the narrative",
    color: "from-amber-500 to-orange-500",
    example: "Creation myths, faction histories, legends",
    img: loreImg
  },
  {
    icon: Palette,
    title: "Items & Artifacts",
    desc: "Design weapons, armor, and magical items that players will quest to obtain",
    color: "from-cyan-500 to-blue-500",
    example: "Legendary swords, enchanted relics, rare mounts",
    img: artifactsImg
  },
];

const CHARACTER_CLASSES = [
  { img: warriorImg, name: "Guardian", role: "Tank / Protector", icon: Shield },
  { img: mageImg, name: "Arcanist", role: "Magic / Support", icon: Wand2 },
  { img: rogueImg, name: "Shadow", role: "Stealth / DPS", icon: Target },
];

export default function Genesis() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedContribution, setSelectedContribution] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img 
          src={worldImg} 
          alt="Genesis World" 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20" />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
          <div className="container mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <img src={darkwaveLogo} alt="DarkWave" className="w-7 h-7" />
              <span className="font-display font-bold hidden sm:inline">DarkWave</span>
            </Link>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 animate-pulse">
              <Sparkles className="w-3 h-3 mr-1" />
              Genesis Phase
            </Badge>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border-purple-500/30 px-4 py-2 text-sm">
              <Crown className="w-4 h-4 mr-2" />
              Founding Creator Program
            </Badge>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight">
              Own a Piece of the{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Universe
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              The first game where <span className="text-purple-400 font-semibold">you don't just play</span> — you create. 
              Your ideas become permanent fixtures. Your contributions live forever.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span className="text-sm">Community-Built World</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <Heart className="w-4 h-4 text-pink-400" />
                <span className="text-sm">Your Legacy, Forever</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-sm">Powered by DWC</span>
              </div>
            </div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-gray-500"
            >
              <ChevronRight className="w-6 h-6 mx-auto rotate-90" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* What You Can Create */}
      <section className="py-20 px-4 bg-gradient-to-b from-black via-purple-950/20 to-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
              Contribution Types
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Claim Your Territory
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Like digital real estate, but better. Your creations become permanent, credited parts of a living world.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {CONTRIBUTION_TYPES.map((type, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedContribution(selectedContribution === i ? null : i)}
                className="cursor-pointer"
              >
                <div 
                  className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                    selectedContribution === i 
                      ? "ring-2 ring-purple-500" 
                      : "hover:ring-1 hover:ring-white/20"
                  }`}
                >
                  <img 
                    src={type.img} 
                    alt={type.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
                  
                  <div className="relative p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${type.color} shadow-lg`}>
                        <type.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-1 text-white drop-shadow-lg">{type.title}</h3>
                        <p className="text-sm text-gray-200 mb-3 drop-shadow-md">{type.desc}</p>
                        <p className="text-xs text-gray-300 italic">"{type.example}"</p>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {selectedContribution === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 pt-4 border-t border-white/20"
                        >
                          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-200">
                              <Lock className="w-4 h-4 text-amber-400" />
                              <span>Submissions open to Founding Creators</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-200">
                              <Star className="w-4 h-4 text-purple-400" />
                              <span>Accepted works credited permanently on-chain</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-200">
                              <Crown className="w-4 h-4 text-pink-400" />
                              <span>Top contributors earn revenue share</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Character Preview */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-purple-950/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-pink-500/20 text-pink-300 border-pink-500/30">
              Early Concepts
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Characters Await Your Vision
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              These are just the beginning. Founding Creators will design new classes, abilities, and legendary heroes.
            </p>
          </motion.div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {CHARACTER_CLASSES.map((char, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group relative"
              >
                <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
                  <img 
                    src={char.img} 
                    alt={char.name} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <char.icon className="w-4 h-4 text-purple-400" />
                      <span className="text-xs text-purple-300">{char.role}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold">{char.name}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Dragon Feature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden"
          >
            <img 
              src={dragonImg} 
              alt="Crystal Dragon" 
              className="w-full h-64 sm:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-center max-w-md">
              <Badge className="w-fit mb-3 bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                Creature Design
              </Badge>
              <h3 className="text-2xl sm:text-3xl font-bold mb-2">Design the Beasts</h3>
              <p className="text-gray-300 text-sm sm:text-base">
                From majestic mounts to terrifying raid bosses. Your creature could become the most feared — or beloved — in the realm.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Submission Preview (Teaser) */}
      <section className="py-20 px-4 bg-gradient-to-b from-purple-950/30 to-black">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-amber-500/20 text-amber-300 border-amber-500/30">
              Coming Soon
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              The Creator's Portal
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              A glimpse at the submission system. Founding Creators will get early access.
            </p>
          </motion.div>

          {/* Mock UI */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 blur-3xl opacity-30" />
            <GlassCard className="relative p-6 sm:p-8 border-2 border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-400" />
                  Submit Creation
                </h3>
                <Badge className="bg-gray-800 text-gray-400 border-gray-700">
                  <Lock className="w-3 h-3 mr-1" />
                  Founders Only
                </Badge>
              </div>

              <div className="space-y-4 opacity-60">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Creation Type</label>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-gray-500">
                    Select category...
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Title</label>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-gray-500">
                    Name your creation...
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Description & Lore</label>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 h-24 text-gray-500">
                    Tell the story...
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Artwork Upload</label>
                  <div className="bg-white/5 border border-white/10 border-dashed rounded-xl p-6 text-center text-gray-500">
                    <Palette className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Drop concept art here</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <Button disabled className="w-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-50 cursor-not-allowed">
                  <Lock className="w-4 h-4 mr-2" />
                  Submissions Opening Soon
                </Button>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Sign Up CTA */}
      <section className="py-20 px-4 bg-gradient-to-b from-black via-purple-950/30 to-black">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 blur-3xl opacity-20" />
              <GlassCard className="relative p-8 sm:p-12 border-2 border-purple-500/30">
                <Crown className="w-12 h-12 mx-auto mb-6 text-amber-400" />
                <h2 className="text-2xl sm:text-3xl font-display font-bold mb-4">
                  Become a Founding Creator
                </h2>
                <p className="text-gray-400 mb-8">
                  Join the first wave. Get early access to submissions, exclusive rewards, and permanent recognition as a world builder.
                </p>

                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 bg-white/5 border-white/10 h-12"
                        required
                        data-testid="input-founder-email"
                      />
                      <Button 
                        type="submit"
                        className="h-12 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
                        data-testid="button-join-founders"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Join Founders
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      No spam. Only updates about Genesis and your opportunity to create.
                    </p>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-500/20 border border-green-500/30 rounded-xl p-6"
                  >
                    <Star className="w-8 h-8 mx-auto mb-3 text-green-400" />
                    <h3 className="font-bold text-lg text-green-300 mb-2">Welcome, Founder</h3>
                    <p className="text-sm text-gray-400">
                      You're on the list. We'll notify you when submissions open.
                    </p>
                  </motion.div>
                )}

                <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-purple-400">0</p>
                    <p className="text-xs text-gray-500">Founders Joined</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-pink-400">4</p>
                    <p className="text-xs text-gray-500">Contribution Types</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-cyan-400">∞</p>
                    <p className="text-xs text-gray-500">Possibilities</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={darkwaveLogo} alt="DarkWave" className="w-6 h-6" />
            <span className="text-sm text-gray-500">DarkWave Studios, LLC</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/arcade" className="text-sm text-gray-400 hover:text-white transition-colors">
              Arcade
            </Link>
            <Link href="/dashboard-pro" className="text-sm text-gray-400 hover:text-white transition-colors">
              Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
