import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Link } from "wouter";
import { ArrowLeft, Play, Sparkles, Clock, Scale, Users, Building, ShoppingBag, MessageCircle, Shield, Star, Lock, ChevronRight, Compass, Heart, Zap, Crown, Globe } from "lucide-react";

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const coreCards = [
  {
    emoji: "🪞",
    title: "You Are You",
    description: "This isn't an RPG. You don't play a character. You ARE the character. Your choices reflect who you really are.",
    gradient: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-500/20",
  },
  {
    emoji: "⏰",
    title: "Real Time",
    description: "1 hour = 1 real hour. Day and night cycle with your timezone. NPCs sleep, shops close, the world lives.",
    gradient: "from-cyan-500/20 to-blue-500/20",
    border: "border-cyan-500/20",
  },
  {
    emoji: "⚖️",
    title: "Choices Matter",
    description: "No right or wrong answers. Your decisions shape your reputation, relationships, and the world around you.",
    gradient: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-500/20",
  },
];

const eras = [
  {
    id: "modern",
    emoji: "🏙️",
    name: "Modern Era",
    description: "Present day. Corporations, hacktivists, mayors, and startups. Navigate tech ethics, corporate politics, and community organizing.",
    factions: ["Nexus Corp", "Signal Underground", "Civic Alliance", "Genesis Labs", "The Old Guard"],
    npcs: ["Dr. Elena Voss", "Kai 'Ghost' Reeves", "Mayor Diana Reyes"],
    unlock: "Available from start",
    unlockIcon: <Play className="w-3.5 h-3.5" />,
    color: "cyan",
    gradient: "from-cyan-500 to-blue-600",
    badgeClass: "bg-cyan-500/20 text-cyan-400",
  },
  {
    id: "medieval",
    emoji: "🏰",
    name: "Medieval Era",
    description: "A vast kingdom of nobles, merchants, and shadow operatives. Navigate court politics, trade wars, and ancient mysteries.",
    factions: ["House of Crowns", "Shadow Council", "Merchant's Guild", "Innovator's Circle", "The Old Faith"],
    npcs: ["Lord Aldric", "Sera Nightwhisper", "Marcus Goldhand"],
    unlock: "Level 3",
    unlockIcon: <Lock className="w-3.5 h-3.5" />,
    color: "amber",
    gradient: "from-amber-500 to-orange-600",
    badgeClass: "bg-amber-500/20 text-amber-400",
  },
  {
    id: "wildwest",
    emoji: "🤠",
    name: "Wild West",
    description: "The untamed frontier. Lawmen, outlaws, prospectors, and indigenous nations clash over land and justice.",
    factions: ["Iron Star", "Black Canyon Gang", "Pacific Railroad", "Prospector's Union", "First Nations"],
    npcs: ["Marshal Jake Colton", "Rattlesnake Rosa", "Chief Running Bear"],
    unlock: "Level 5",
    unlockIcon: <Lock className="w-3.5 h-3.5" />,
    color: "yellow",
    gradient: "from-yellow-500 to-orange-600",
    badgeClass: "bg-yellow-500/20 text-yellow-400",
  },
];

const systems = [
  {
    icon: Compass,
    title: "Situations",
    description: "Daily life situations push you to make authentic choices. 75 hand-crafted + infinite AI-generated.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: Users,
    title: "NPCs",
    description: "9 NPCs with persistent memories. They remember how you treated them (scores -20 to +20).",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Building,
    title: "Estate",
    description: "Build and customize your home in each era. Place objects, upgrade rooms.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: ShoppingBag,
    title: "Marketplace",
    description: "Buy era-specific items with Shells. Craft combinations for unique gear.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: MessageCircle,
    title: "Signal Chat",
    description: "Talk to other players. Train your voice clone to speak as your parallel self.",
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    icon: Shield,
    title: "Factions",
    description: "15 factions across 3 eras. Your choices determine who trusts you.",
    gradient: "from-red-500 to-rose-500",
  },
];

const currencies = [
  {
    emoji: "🐚",
    name: "Shells",
    description: "Earned through gameplay, quests, and daily rewards. Spend at shops, craft items.",
    gradient: "from-yellow-500/20 to-amber-500/20",
    border: "border-yellow-500/20",
    textColor: "text-yellow-400",
  },
  {
    emoji: "🔮",
    name: "Echoes",
    description: "In-game currency for Chronicles. 10 Echoes = 1 Shell. NOT convertible to real money.",
    gradient: "from-purple-500/20 to-indigo-500/20",
    border: "border-purple-500/20",
    textColor: "text-purple-400",
  },
];

export default function ChroniclesTutorial() {
  const [activeEra, setActiveEra] = useState<string>("");

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-60 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-6">
          <Link href="/chronicles/hub">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white min-h-[44px]" data-testid="back-to-hub">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Hub
            </Button>
          </Link>
        </div>

        <motion.section
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp} className="mb-4">
            <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 px-4 py-1.5 text-xs">
              <Sparkles className="w-3 h-3 mr-1.5" /> New Player Guide
            </Badge>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 leading-tight"
            data-testid="hero-title"
          >
            Welcome to DarkWave Chronicles
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-8"
            data-testid="hero-subtitle"
          >
            Your parallel life across three eras — no scripts, no rails, just you.
          </motion.p>
          <motion.div variants={fadeUp}>
            <a href="#how-it-works">
              <Button
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-8 py-3 min-h-[44px] text-base"
                data-testid="begin-btn"
              >
                <Play className="w-4 h-4 mr-2" /> Begin
              </Button>
            </a>
          </motion.div>
        </motion.section>

        <motion.section
          id="how-it-works"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
          className="mb-16"
        >
          <motion.h2
            variants={fadeUp}
            className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-8 text-center"
            data-testid="section-how-it-works"
          >
            How It Works
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreCards.map((card, i) => (
              <motion.div key={card.title} variants={fadeUp}>
                <GlassCard glow>
                  <div className={`p-4 sm:p-6 border-t-2 ${card.border} h-full`}>
                    <div className="text-4xl mb-4">{card.emoji}</div>
                    <h3 className="text-lg font-bold text-white mb-2" data-testid={`core-card-title-${i}`}>
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{card.description}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
          className="mb-16"
        >
          <motion.h2
            variants={fadeUp}
            className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-8 text-center"
            data-testid="section-three-eras"
          >
            The Three Eras
          </motion.h2>
          <motion.div variants={fadeUp}>
            <GlassCard glow>
              <div className="p-4 sm:p-6">
                <Accordion type="single" collapsible value={activeEra} onValueChange={setActiveEra}>
                  {eras.map((era) => (
                    <AccordionItem key={era.id} value={era.id} className="border-white/5">
                      <AccordionTrigger
                        className="hover:no-underline py-4 min-h-[44px]"
                        data-testid={`era-trigger-${era.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{era.emoji}</span>
                          <span className="text-white font-bold text-base">{era.name}</span>
                          <Badge className={`${era.badgeClass} text-[10px] ml-2`}>
                            {era.unlockIcon}
                            <span className="ml-1">{era.unlock}</span>
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-400">
                        <div className="space-y-4 pb-2">
                          <p className="text-sm leading-relaxed">{era.description}</p>
                          <div>
                            <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <Shield className="w-3 h-3" /> Factions
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {era.factions.map((f) => (
                                <Badge key={f} className="bg-white/5 text-gray-300 border-white/10 text-xs">
                                  {f}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <Users className="w-3 h-3" /> Key NPCs
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {era.npcs.map((npc) => (
                                <Badge key={npc} className={`${era.badgeClass} text-xs`}>
                                  {npc}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </GlassCard>
          </motion.div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
          className="mb-16"
        >
          <motion.h2
            variants={fadeUp}
            className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-8 text-center"
            data-testid="section-game-systems"
          >
            Game Systems
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systems.map((sys, i) => (
              <motion.div key={sys.title} variants={fadeUp}>
                <GlassCard glow>
                  <div className="p-4 sm:p-6 h-full flex flex-col">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${sys.gradient} flex items-center justify-center mb-3`}>
                      <sys.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-2" data-testid={`system-card-title-${i}`}>
                      {sys.title}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed flex-1">{sys.description}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
          className="mb-16"
        >
          <motion.h2
            variants={fadeUp}
            className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-8 text-center"
            data-testid="section-currencies"
          >
            Currencies
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {currencies.map((cur, i) => (
              <motion.div key={cur.name} variants={fadeUp}>
                <GlassCard glow>
                  <div className={`p-4 sm:p-6 border-t-2 ${cur.border} h-full`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{cur.emoji}</span>
                      <h3 className={`text-lg font-bold ${cur.textColor}`} data-testid={`currency-title-${i}`}>
                        {cur.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">{cur.description}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
          className="text-center mb-8"
        >
          <motion.div variants={fadeUp}>
            <GlassCard glow>
              <div className="p-8 sm:p-12">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl mb-4"
                >
                  🌍
                </motion.div>
                <h2
                  className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3"
                  data-testid="cta-title"
                >
                  Ready to Begin?
                </h2>
                <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
                  Your parallel life awaits. Step into a world that remembers every choice you make.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link href="/chronicles/play">
                    <Button
                      className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-8 py-3 min-h-[44px] text-base w-full sm:w-auto"
                      data-testid="enter-world-btn"
                    >
                      <Globe className="w-4 h-4 mr-2" /> Enter the World
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                  <Link href="/chronicles/hub">
                    <Button
                      variant="ghost"
                      className="text-gray-400 hover:text-white min-h-[44px] w-full sm:w-auto"
                      data-testid="back-to-hub-bottom"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" /> Back to Hub
                    </Button>
                  </Link>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}
