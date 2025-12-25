import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Gamepad2, Trophy, Coins, TrendingUp, Sparkles, Target,
  ArrowRight, Users, Zap, Gift, Crown, Star, Flame, Shield,
  Clock, Wallet, Play, Code2, ChevronRight, ExternalLink
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
    players: 127,
    hot: true,
  },
  {
    name: "Crash",
    description: "Cash out before it crashes",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-500",
    rtp: "99%",
    href: "/arcade",
    players: 89,
    hot: true,
  },
  {
    name: "Jackpot Slots",
    description: "Progressive jackpot up to 50x",
    icon: Crown,
    color: "from-purple-500 to-pink-500",
    rtp: "96%",
    href: "/arcade",
    players: 156,
    hot: false,
  },
  {
    name: "Lottery",
    description: "Weekly draws, huge prizes",
    icon: Gift,
    color: "from-pink-500 to-rose-500",
    rtp: "95%",
    href: "/lottery",
    players: 2341,
    hot: false,
  },
  {
    name: "Predictions",
    description: "Bet on real-world events",
    icon: Target,
    color: "from-blue-500 to-cyan-500",
    rtp: "98%",
    href: "/predictions",
    players: 412,
    hot: false,
  },
];

const LIVE_WINS = [
  { player: "Crypto****", game: "Crash", amount: "2,450", time: "2s ago" },
  { player: "Lucky****", game: "Slots", amount: "8,200", time: "5s ago" },
  { player: "Whale****", game: "Coin Flip", amount: "1,800", time: "8s ago" },
  { player: "Degen****", game: "Crash", amount: "12,100", time: "12s ago" },
  { player: "Moon****", game: "Slots", amount: "5,500", time: "15s ago" },
];

function LiveWinTicker() {
  const [currentWin, setCurrentWin] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWin((prev) => (prev + 1) % LIVE_WINS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="overflow-hidden h-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentWin}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="flex items-center justify-center gap-2 text-sm"
        >
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="text-muted-foreground">{LIVE_WINS[currentWin].player}</span>
          <span className="text-white">won</span>
          <span className="text-green-400 font-bold font-mono">+{LIVE_WINS[currentWin].amount} DWC</span>
          <span className="text-muted-foreground">in {LIVE_WINS[currentWin].game}</span>
          <span className="text-xs text-muted-foreground">({LIVE_WINS[currentWin].time})</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SparkleEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-pink-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            y: [0, -30],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

export default function GamesHome() {
  const [jackpot, setJackpot] = useState(125847);
  const [playersOnline, setPlayersOnline] = useState(247);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setJackpot((prev) => prev + Math.floor(Math.random() * 10));
      setPlayersOnline((prev) => prev + Math.floor(Math.random() * 5) - 2);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 shrink-0">
            <motion.img 
              src={darkwaveLogo} 
              alt="DarkWave" 
              className="w-7 h-7"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <span className="font-display font-bold text-lg tracking-tight">
              DarkWave <span className="text-pink-400">Games</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500/20 text-green-400 text-xs hidden sm:flex">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-1 animate-pulse" />
              {playersOnline} Playing
            </Badge>
            <Link href="/wallet">
              <Button size="sm" className="h-8 text-xs bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600" data-testid="button-connect-wallet">
                <Wallet className="w-3 h-3 mr-1" />
                Connect
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-14">
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-pink-500/20 via-purple-500/10 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(236,72,153,0.3),transparent_60%)]" />
          <SparkleEffect />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-4xl mx-auto mb-8"
            >
              <motion.div
                className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30"
                animate={{ 
                  boxShadow: ["0 0 20px rgba(236,72,153,0.3)", "0 0 40px rgba(236,72,153,0.5)", "0 0 20px rgba(236,72,153,0.3)"],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Gamepad2 className="w-5 h-5 text-pink-400" />
                <span className="text-sm font-medium text-pink-400">Blockchain Gaming Revolution</span>
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
                Play. Win.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 animate-pulse">
                  Earn DWC.
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Provably fair games with instant on-chain payouts. Every outcome is verifiable on the DarkWave blockchain.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link href="/arcade">
                  <Button size="lg" className="h-14 px-10 text-lg bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-lg shadow-pink-500/25" data-testid="button-play-now">
                    <Play className="w-5 h-5 mr-2" />
                    Play Now
                  </Button>
                </Link>
                <Link href="/arcade">
                  <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-pink-500/30 hover:bg-pink-500/10" data-testid="button-try-demo">
                    <Gamepad2 className="w-5 h-5 mr-2" />
                    Try Demo Mode
                  </Button>
                </Link>
              </div>
              
              <LiveWinTicker />
            </motion.div>
          </div>
        </section>

        <section className="py-8 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {[
                { icon: Users, label: "Players Online", value: playersOnline.toString(), color: "text-blue-400" },
                { icon: Coins, label: "DWC Wagered Today", value: "1.2M", color: "text-yellow-400" },
                { icon: Trophy, label: "Paid Out Today", value: "1.1M", color: "text-green-400" },
                { icon: Shield, label: "Average RTP", value: "98%", color: "text-purple-400" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard className="p-4 text-center h-full hover:border-pink-500/30 transition-colors">
                    <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                    <p className="text-2xl md:text-3xl font-bold font-mono">{stat.value}</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-8 px-4">
          <div className="container mx-auto">
            <GlassCard glow className="p-6 md:p-8 bg-gradient-to-br from-yellow-500/10 via-amber-500/5 to-transparent border-yellow-500/30">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <Crown className="w-6 h-6 text-yellow-400" />
                    <span className="text-sm font-medium text-yellow-400 uppercase tracking-wider">Progressive Jackpot</span>
                    <Crown className="w-6 h-6 text-yellow-400" />
                  </div>
                  <motion.p 
                    className="text-4xl md:text-6xl font-bold font-mono text-yellow-400"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {jackpot.toLocaleString()} DWC
                  </motion.p>
                  <p className="text-muted-foreground mt-2">Play Jackpot Slots for a chance to win it all!</p>
                </div>
                <Link href="/arcade">
                  <Button size="lg" className="h-14 px-10 bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold hover:from-yellow-400 hover:to-amber-400 shadow-lg shadow-yellow-500/25" data-testid="button-play-jackpot">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Play for Jackpot
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
                Choose Your <span className="text-pink-400">Game</span>
              </h2>
              <p className="text-muted-foreground">All games are provably fair with up to 99% RTP</p>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {GAMES.map((game, i) => (
                <motion.div
                  key={game.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={game.href}>
                    <GlassCard hover glow className="p-6 h-full group cursor-pointer relative overflow-hidden">
                      {game.hot && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-[10px]">
                            <Flame className="w-3 h-3 mr-1" />
                            HOT
                          </Badge>
                        </div>
                      )}
                      
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                        <game.icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="font-bold text-xl mb-2">{game.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{game.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-[10px] text-green-400 border-green-500/30">
                            {game.rtp} RTP
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {game.players}
                          </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-pink-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link href="/game-developer">
                  <GlassCard hover className="p-6 h-full group cursor-pointer border-dashed border-pink-500/30 bg-pink-500/5">
                    <div className="flex flex-col items-center justify-center h-full text-center py-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border-2 border-dashed border-pink-500/30 flex items-center justify-center mb-4">
                        <Code2 className="w-8 h-8 text-pink-400" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Build Your Game</h3>
                      <p className="text-sm text-muted-foreground mb-4">Submit your game for AI review and join the ecosystem</p>
                      <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30">
                        Developer Portal <ArrowRight className="w-3 h-3 ml-1" />
                      </Badge>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 bg-white/[0.02]">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
                Why <span className="text-pink-400">DarkWave Games</span>?
              </h2>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Sparkles, title: "Provably Fair", description: "Every outcome verifiable on-chain", color: "text-purple-400" },
                { icon: Zap, title: "Instant Payouts", description: "Winnings sent to your wallet immediately", color: "text-yellow-400" },
                { icon: Gamepad2, title: "Demo Mode", description: "Practice free, no wallet needed", color: "text-pink-400" },
                { icon: Trophy, title: "Leaderboards", description: "Compete for prizes and glory", color: "text-cyan-400" },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard className="p-5 text-center h-full">
                    <feature.icon className={`w-8 h-8 mx-auto mb-3 ${feature.color}`} />
                    <h3 className="font-bold mb-1">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="container mx-auto">
            <GlassCard className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/30 flex items-center justify-center">
                    <Code2 className="w-7 h-7 text-pink-400" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Are You a Game Developer?</p>
                    <p className="text-sm text-muted-foreground">Submit your game for AI-powered review and join our ecosystem</p>
                  </div>
                </div>
                <Link href="/game-developer">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600" data-testid="button-developer-portal">
                    Developer Portal <ExternalLink className="w-4 h-4 ml-2" />
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
