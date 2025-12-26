import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Coins, Shield, Building, ShoppingBag, ArrowRight, Wallet, 
  FileText, Lock, Unlock, TrendingUp, Globe, Users, Sparkles,
  CheckCircle, ChevronRight, Landmark, Key, Layers, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/footer";
import { ChronoLayout, HoloCard, CTABanner, VideoHero, chronoStyles } from "@/components/chrono-ui";
import { usePageAnalytics } from "@/hooks/use-analytics";

import deepSpace from "@assets/generated_images/deep_space_station.png";
import quantumRealm from "@assets/generated_images/quantum_dimension_realm.png";
import cyberpunkCity from "@assets/generated_images/cyberpunk_neon_city.png";
import medievalKingdom from "@assets/generated_images/medieval_fantasy_kingdom.png";

const ECONOMY_PILLARS = [
  {
    icon: Coins,
    title: "DarkWave Coin (DWC)",
    description: "Real cryptocurrency on DarkWave Smart Chain. Not play money - actual blockchain tokens with real-world value.",
    color: "from-amber-500 to-yellow-600",
    image: deepSpace
  },
  {
    icon: Building,
    title: "Property Ownership",
    description: "Own land, buildings, businesses. Blockchain deeds prove ownership. Property can be bought, sold, or lost.",
    color: "from-purple-500 to-violet-600",
    image: medievalKingdom
  },
  {
    icon: ShoppingBag,
    title: "Player Commerce",
    description: "Buy and sell goods with other players. Craft items, trade resources, run shops. A real marketplace economy.",
    color: "from-cyan-500 to-blue-600",
    image: cyberpunkCity
  },
  {
    icon: FileText,
    title: "Full Audit Trail",
    description: "Every transaction is blockchain-stamped. Complete transparency. No disputes about who owns what.",
    color: "from-green-500 to-emerald-600",
    image: quantumRealm
  },
];

const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Earn DWC",
    description: "Complete missions, trade goods, provide services, win competitions. Your skill generates real value.",
    icon: TrendingUp
  },
  {
    step: 2,
    title: "Spend or Save",
    description: "Buy equipment, property, services from other players. Or hold DWC as an investment in the ecosystem.",
    icon: Wallet
  },
  {
    step: 3,
    title: "Own Assets",
    description: "Property, items, and creations are NFTs on the blockchain. True ownership. True value.",
    icon: Key
  },
  {
    step: 4,
    title: "Trade Freely",
    description: "Marketplace with player-to-player trading. Cross-era commerce. Global economy.",
    icon: Globe
  },
];

const LEGAL_POINTS = [
  {
    title: "Skill-Based Commerce",
    description: "You earn through skill, effort, and strategy - not chance. This is commerce, not gambling.",
    icon: CheckCircle
  },
  {
    title: "Transparent Transactions",
    description: "Every trade is blockchain-verified. Complete audit trail. No hidden mechanics.",
    icon: FileText
  },
  {
    title: "Real Ownership",
    description: "NFT-based property rights. You own what you earn. It's legally yours.",
    icon: Lock
  },
  {
    title: "No Loot Boxes",
    description: "No random chance purchases. You know exactly what you're buying before you buy it.",
    icon: Shield
  },
];

const TOKEN_UTILITY = [
  { use: "In-game purchases", desc: "Buy gear, items, services" },
  { use: "Property transactions", desc: "Land, buildings, businesses" },
  { use: "Era travel fees", desc: "Time-travel between eras" },
  { use: "Governance voting", desc: "Shape the ChronoVerse" },
  { use: "Staking rewards", desc: "Earn passive income" },
  { use: "Creator rewards", desc: "Monetize your creations" },
];

export default function ChronoEconomy() {
  usePageAnalytics();
  
  return (
    <ChronoLayout currentPage="/economy">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src={deepSpace} alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
        </div>
        
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30">
              <Coins className="w-3 h-3 mr-1" /> Blockchain Economy
            </Badge>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 text-white">
              Real Currency. <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Real Value.</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              DWC isn't play money. It's real cryptocurrency on DarkWave Smart Chain.
              Every transaction stamped, tracked, and auditable.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-6">
            {ECONOMY_PILLARS.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <HoloCard image={pillar.image} glow="amber" className="h-full min-h-[240px]">
                    <div className="p-6 h-full flex flex-col justify-end">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pillar.color} flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{pillar.title}</h3>
                      <p className="text-white/60">{pillar.description}</p>
                    </div>
                  </HoloCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-amber-950/10 to-transparent">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white">
              How the Economy Works
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              A complete economic loop powered by player activity and blockchain verification.
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 h-full">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center mb-4 text-amber-400 font-bold">
                      {step.step}
                    </div>
                    <Icon className="w-8 h-8 text-amber-400 mb-3" />
                    <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-white/50 text-sm">{step.description}</p>
                  </div>
                  {i < HOW_IT_WORKS.length - 1 && (
                    <ChevronRight className="hidden lg:block absolute top-1/2 -right-3 w-6 h-6 text-amber-500/30 -translate-y-1/2" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/30">
                <Layers className="w-3 h-3 mr-1" /> Token Utility
              </Badge>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-white">
                What Can You Do With DWC?
              </h2>
              <div className="space-y-4">
                {TOKEN_UTILITY.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{item.use}</p>
                      <p className="text-white/50 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <HoloCard image={quantumRealm} glow="purple" className="aspect-square">
                <div className="p-8 h-full flex flex-col justify-center items-center text-center">
                  <Coins className="w-16 h-16 text-amber-400 mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-2">DarkWave Coin</h3>
                  <p className="text-white/60 mb-6">The native currency of the ChronoVerse</p>
                  <Link href="/presale">
                    <Button className="rounded-full gap-2 bg-gradient-to-r from-amber-500 to-orange-600" data-testid="get-dwc-tokens">
                      <Coins className="w-4 h-4" />
                      Get DWC Tokens
                    </Button>
                  </Link>
                </div>
              </HoloCard>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-green-950/10 to-transparent">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30">
              <Shield className="w-3 h-3 mr-1" /> Legal & Transparent
            </Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white">
              Commerce, Not Gambling
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              DarkWave Chronicles is a skill-based economy with complete transparency.
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {LEGAL_POINTS.map((point, i) => {
              const Icon = point.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-green-500/5 border border-green-500/20"
                >
                  <Icon className="w-8 h-8 text-green-400 mb-3" />
                  <h3 className="text-lg font-bold text-white mb-2">{point.title}</h3>
                  <p className="text-white/60">{point.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <CTABanner
        title="Ready to Join the Economy?"
        subtitle="Get DWC tokens now and be ready when the ChronoVerse launches."
        primaryAction={{ label: "Get DWC Tokens", href: "/presale" }}
        secondaryAction={{ label: "Learn More", href: "/chronicles" }}
        backgroundImage={cyberpunkCity}
      />

      <Footer />
      
      <style>{chronoStyles}</style>
    </ChronoLayout>
  );
}
