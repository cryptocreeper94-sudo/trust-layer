import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Gamepad2, Trophy, Coins, Dice1, TrendingUp, Sparkles, Target,
  ArrowRight, Users, Zap, Gift, Crown, Star
} from "lucide-react";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";

const GAMES = [
  {
    name: "Coin Flip",
    description: "50/50 chance, 1.98x payout",
    icon: Coins,
    color: "from-yellow-500 to-amber-500",
    rtp: "99%",
    href: "/arcade",
  },
  {
    name: "Crash",
    description: "Cash out before it crashes",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-500",
    rtp: "99%",
    href: "/arcade",
  },
  {
    name: "Jackpot Slots",
    description: "Progressive jackpot up to 50x",
    icon: Crown,
    color: "from-purple-500 to-pink-500",
    rtp: "96%",
    href: "/arcade",
  },
  {
    name: "Lottery",
    description: "Weekly draws, huge prizes",
    icon: Gift,
    color: "from-pink-500 to-rose-500",
    rtp: "95%",
    href: "/lottery",
  },
  {
    name: "Predictions",
    description: "Bet on real-world events",
    icon: Target,
    color: "from-blue-500 to-cyan-500",
    rtp: "98%",
    href: "/predictions",
  },
];

const FEATURES = [
  {
    title: "Provably Fair",
    description: "All game outcomes verifiable on-chain",
    icon: Sparkles,
  },
  {
    title: "Instant Payouts",
    description: "Winnings sent directly to your wallet",
    icon: Zap,
  },
  {
    title: "Demo Mode",
    description: "Practice with play coins, no wallet needed",
    icon: Gamepad2,
  },
  {
    title: "Leaderboards",
    description: "Compete for top spots and bonus rewards",
    icon: Trophy,
  },
];

export default function GamesHome() {
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 shrink-0">
            <img src={darkwaveLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight">
              DarkWave <span className="text-pink-400">Games</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500/20 text-green-400 text-xs hidden sm:flex">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-1 animate-pulse" />
              247 Playing
            </Badge>
            <Link href="/wallet">
              <Button size="sm" className="h-8 text-xs bg-gradient-to-r from-pink-500 to-rose-500" data-testid="button-connect-wallet">
                Connect Wallet
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-14">
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-pink-500/10 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.15),transparent_70%)]" />
          
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-pink-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </motion.div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <motion.div
                className="inline-flex items-center gap-2 mb-4 p-2 rounded-full bg-pink-500/20 border border-pink-500/30"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Gamepad2 className="w-5 h-5 text-pink-400" />
                <span className="text-sm font-medium text-pink-400">Blockchain Gaming</span>
                <Star className="w-4 h-4 text-yellow-400" />
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
                Play. Win. <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">Earn DWC.</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Provably fair games with instant payouts. Every outcome verifiable on the DarkWave blockchain.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/arcade">
                  <Button size="lg" className="bg-gradient-to-r from-pink-500 to-rose-500 text-white h-12 px-8" data-testid="button-play-now">
                    <Gamepad2 className="w-5 h-5 mr-2" />
                    Play Now
                  </Button>
                </Link>
                <Link href="/arcade">
                  <Button size="lg" variant="outline" className="h-12 px-8" data-testid="button-try-demo">
                    Try Demo Mode
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {FEATURES.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard className="p-4 text-center h-full">
                    <feature.icon className="w-6 h-6 mx-auto mb-2 text-pink-400" />
                    <p className="font-bold text-sm">{feature.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{feature.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-white/[0.02]">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
                Choose Your <span className="text-pink-400">Game</span>
              </h2>
              <p className="text-muted-foreground">All games are provably fair with up to 99% RTP</p>
            </motion.div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {GAMES.map((game, i) => (
                <motion.div
                  key={game.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={game.href}>
                    <GlassCard hover glow className="p-6 h-full group cursor-pointer">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <game.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg">{game.name}</h3>
                        <Badge variant="outline" className="text-[10px] text-green-400 border-green-500/30">
                          {game.rtp} RTP
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{game.description}</p>
                      <div className="flex items-center text-sm text-pink-400">
                        Play Now <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto">
            <GlassCard glow className="p-6 md:p-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <Badge className="mb-3 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    <Crown className="w-3 h-3 mr-1" />
                    Progressive Jackpot
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">
                    <motion.span
                      className="text-yellow-400"
                      animate={{ opacity: [1, 0.7, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      125,847 DWC
                    </motion.span>
                  </h2>
                  <p className="text-muted-foreground">Play Jackpot Slots for a chance to win it all!</p>
                </div>
                <Link href="/arcade">
                  <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold h-14 px-10" data-testid="button-play-jackpot">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Play for Jackpot
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </div>
        </section>

        <section className="py-16 px-4 bg-gradient-to-b from-transparent to-pink-500/5">
          <div className="container mx-auto">
            <GlassCard className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/30 flex items-center justify-center">
                    <Users className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <p className="font-bold">Join 10,000+ Players</p>
                    <p className="text-sm text-muted-foreground">Compete on leaderboards, earn rewards</p>
                  </div>
                </div>
                <Link href="/wallet">
                  <Button className="bg-gradient-to-r from-pink-500 to-rose-500" data-testid="button-get-started">
                    Get Started <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
