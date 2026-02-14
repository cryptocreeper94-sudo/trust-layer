import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import {
  Gamepad2, Sparkles, Trophy, Crown, Coins, Zap, Star,
  ChevronRight, Flame, Rocket, Shield, Download,
  Dice1, Heart, ArrowRight, Play, Users, TrendingUp, Store
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";

import heroBanner from "@assets/generated_images/games_hero_banner.png";
import dragonSlots from "@assets/generated_images/game_dragon_slots.png";
import coinflipArt from "@assets/generated_images/game_coinflip_premium.png";
import crashArt from "@assets/generated_images/game_crash_rocket.png";
import arcadeClassics from "@assets/generated_images/game_arcade_classics.png";
import leprechaunSlots from "@assets/generated_images/game_leprechaun_slots.png";
import cardGames from "@assets/generated_images/game_card_games.png";

const FEATURED_GAMES = [
  {
    id: "crash",
    title: "Orbit Crash",
    subtitle: "5000x MAX WIN",
    description: "Watch the multiplier climb. Cash out before the crash!",
    image: crashArt,
    href: "/crash",
    gradient: "from-cyan-500 to-purple-500",
    glow: "cyan",
    players: "4.7K",
    tag: "MOST POPULAR",
  },
  {
    id: "dragon-slots",
    title: "Dragon's Fortune",
    subtitle: "96.5% RTP",
    description: "Spin the ancient reels and unlock the dragon's treasure hoard.",
    image: dragonSlots,
    href: "/slots",
    gradient: "from-red-500 to-orange-500",
    glow: "orange",
    players: "2.4K",
    tag: "FEATURED",
  },
  {
    id: "coinflip",
    title: "Royal Coin Flip",
    subtitle: "1.96x PAYOUT",
    description: "Double or nothing on every flip. Simple, fast, addictive.",
    image: coinflipArt,
    href: "/coinflip",
    gradient: "from-yellow-500 to-amber-500",
    glow: "yellow",
    players: "3.1K",
    tag: "HOT",
  },
];

const QUICK_PLAY = [
  { id: "slots", title: "Slots", icon: Crown, href: "/slots", color: "text-yellow-400", bg: "from-yellow-500/20" },
  { id: "crash", title: "Crash", icon: Rocket, href: "/crash", color: "text-cyan-400", bg: "from-cyan-500/20" },
  { id: "coinflip", title: "Coin Flip", icon: Coins, href: "/coinflip", color: "text-green-400", bg: "from-green-500/20" },
  { id: "snake", title: "Snake", icon: Gamepad2, href: "/snake", color: "text-pink-400", bg: "from-pink-500/20" },
  { id: "tetris", title: "Tetris", icon: Dice1, href: "/tetris", color: "text-purple-400", bg: "from-purple-500/20" },
  { id: "solitaire", title: "Solitaire", icon: Heart, href: "/solitaire", color: "text-red-400", bg: "from-red-500/20" },
];

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 1500;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}


const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 1.1]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % FEATURED_GAMES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const game = FEATURED_GAMES[currentSlide];

  return (
    <section className="relative overflow-hidden" style={{ height: '85dvh', minHeight: '500px' }}>
      <motion.div className="absolute inset-0" style={{ opacity: heroOpacity, scale: heroScale }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={game.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <img src={game.image} alt="" className="w-full h-full object-cover" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/40" />
      </motion.div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 h-full flex items-end pb-16 sm:pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-xl"
            >
              <div className="mb-4 inline-block overflow-visible">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block"
                >
                  <Badge className={`bg-gradient-to-r ${game.gradient} text-white text-[10px] font-bold px-3 py-1 border-0 inline-flex`}>
                    <Flame className="w-3 h-3 mr-1" />
                    {game.tag}
                  </Badge>
                </motion.div>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-2 leading-none">
                {game.title}
              </h1>
              <div className={`text-xl sm:text-2xl font-bold bg-gradient-to-r ${game.gradient} bg-clip-text text-transparent mb-3`}>
                {game.subtitle}
              </div>
              <p className="text-base sm:text-lg text-white/60 mb-6 max-w-md">
                {game.description}
              </p>

              <div className="flex items-center gap-3 flex-wrap">
                <Link href={game.href}>
                  <Button
                    size="lg"
                    className={`bg-gradient-to-r ${game.gradient} hover:brightness-110 text-white font-bold px-8 py-4 rounded-xl shadow-xl text-base`}
                    data-testid={`hero-play-${game.id}`}
                  >
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    Play Now
                  </Button>
                </Link>
                <Link href="/arcade">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 px-6 py-4 rounded-xl text-base"
                    data-testid="hero-browse-all"
                  >
                    Browse All Games
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-4 mt-6">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm text-green-400/80">{game.players} playing now</span>
                </div>
                <div className="flex -space-x-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-slate-950 flex items-center justify-center">
                      <Users className="w-3 h-3 text-white" />
                    </div>
                  ))}
                  <div className="w-7 h-7 rounded-full bg-white/10 border-2 border-slate-950 flex items-center justify-center text-[9px] text-white/70 font-bold">
                    +{game.players}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-2 mt-8">
            {FEATURED_GAMES.map((g, i) => (
              <button
                key={g.id}
                onClick={() => setCurrentSlide(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === currentSlide
                    ? "w-8 h-2 bg-gradient-to-r from-pink-500 to-purple-500"
                    : "w-2 h-2 bg-white/30 hover:bg-white/50"
                }`}
                data-testid={`hero-dot-${i}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
    </section>
  );
}

function LiveStats() {
  return (
    <section className="relative -mt-12 z-20 mb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-fr">
          {[
            { label: "Active Players", value: 12400, suffix: "+", icon: <Users className="w-5 h-5 text-cyan-400" />, color: "border-cyan-500/20" },
            { label: "Games Played", value: 847000, suffix: "+", icon: <Gamepad2 className="w-5 h-5 text-pink-400" />, color: "border-pink-500/20" },
            { label: "GC Wagered", value: 2100000, suffix: "", icon: <Coins className="w-5 h-5 text-yellow-400" />, color: "border-yellow-500/20" },
            { label: "Biggest Win", value: 500000, suffix: " GC", icon: <Crown className="w-5 h-5 text-purple-400" />, color: "border-purple-500/20" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className={`p-5 sm:p-6 text-center border ${stat.color} h-full flex flex-col items-center justify-center`} glow>
                <div className="flex items-center justify-center gap-1.5 mb-1.5">
                  {stat.icon}
                  <span className="text-lg sm:text-2xl font-black text-white whitespace-nowrap">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-white/40 uppercase tracking-wider font-medium whitespace-nowrap">{stat.label}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickPlay() {
  return (
    <section className="mb-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">Quick Play</h2>
          <p className="text-sm text-white/40">Jump straight into the action</p>
        </motion.div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {QUICK_PLAY.map((game, i) => {
            const Icon = game.icon;
            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={game.href}>
                  <motion.div
                    whileHover={{ scale: 1.08, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all cursor-pointer group"
                    data-testid={`quick-play-${game.id}`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${game.bg} to-transparent flex items-center justify-center ${game.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium text-white/70 group-hover:text-white transition-colors">{game.title}</span>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FeaturedShowcase() {
  return (
    <section className="mb-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-6 flex items-center justify-between"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">Top Games</h2>
            <p className="text-sm text-white/40">Most played this week</p>
          </div>
          <Link href="/arcade">
            <Button variant="ghost" className="text-white/50 hover:text-white text-sm" data-testid="view-all-games">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURED_GAMES.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <Link href={game.href}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="relative rounded-2xl overflow-hidden cursor-pointer group"
                >
                  <div className="aspect-[16/10] relative">
                    <img src={game.image} alt={game.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                    <div className="absolute top-4 left-4">
                      <Badge className={`bg-gradient-to-r ${game.gradient} text-white text-[9px] font-bold px-2.5 py-1 border-0`}>
                        {game.tag}
                      </Badge>
                    </div>

                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-[10px] text-white/80">{game.players}</span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold text-white mb-1">{game.title}</h3>
                      <p className={`text-sm font-semibold bg-gradient-to-r ${game.gradient} bg-clip-text text-transparent mb-2`}>
                        {game.subtitle}
                      </p>
                      <p className="text-xs text-white/50 line-clamp-2">{game.description}</p>
                    </div>
                  </div>

                  <div className={`absolute inset-0 rounded-2xl border border-white/5 group-hover:border-white/20 transition-all pointer-events-none`} />

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px] rounded-2xl">
                    <Button className={`bg-gradient-to-r ${game.gradient} text-white font-bold px-6 py-3 rounded-xl shadow-xl`}>
                      <Play className="w-4 h-4 mr-2 fill-current" />
                      Play Now
                    </Button>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GameCategories() {
  const categories = [
    {
      title: "Casino & Sweepstakes",
      description: "Slots, Crash, Coinflip and more",
      games: 4,
      image: leprechaunSlots,
      gradient: "from-yellow-500 to-amber-500",
      href: "/arcade",
    },
    {
      title: "Free Arcade",
      description: "Classic retro games, zero cost",
      games: 4,
      image: arcadeClassics,
      gradient: "from-cyan-500 to-blue-500",
      href: "/arcade",
    },
    {
      title: "Card & Puzzle",
      description: "Solitaire, Spades, Minesweeper",
      games: 3,
      image: cardGames,
      gradient: "from-purple-500 to-pink-500",
      href: "/arcade",
    },
  ];

  return (
    <section className="mb-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">Categories</h2>
          <p className="text-sm text-white/40">Browse by genre</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={cat.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative h-40 rounded-2xl overflow-hidden cursor-pointer group"
                >
                  <img src={cat.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <Badge className={`bg-gradient-to-r ${cat.gradient} text-white text-[9px] px-2.5 py-1 border-0 w-fit mb-2`}>
                      {cat.games} Games
                    </Badge>
                    <h3 className="text-lg font-bold text-white">{cat.title}</h3>
                    <p className="text-xs text-white/50">{cat.description}</p>
                  </div>
                  <div className="absolute inset-0 rounded-2xl border border-white/5 group-hover:border-white/20 transition-all" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CurrencySection() {
  return (
    <section className="mb-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <GlassCard className="p-6 sm:p-8 md:p-10 relative overflow-hidden" glow>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-yellow-500/5 to-transparent rounded-full blur-3xl" />
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-green-500/20 border border-yellow-500/30 flex items-center justify-center">
                <Coins className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Dual Currency System</h3>
                <p className="text-sm text-white/40">Legal sweepstakes gaming model</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-5 sm:p-6 rounded-xl bg-gradient-to-br from-yellow-500/5 to-amber-500/5 border border-yellow-500/15"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                    <Coins className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-yellow-400">Gold Coins (GC)</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wider">For Fun</div>
                  </div>
                </div>
                <p className="text-sm text-white/50 leading-relaxed">Purchase Gold Coins to play all games for fun. No real-money value attached to Gold Coins.</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-5 sm:p-6 rounded-xl bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/15"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/20">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-green-400">Sweeps Coins (SC)</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wider">Redeemable</div>
                  </div>
                </div>
                <p className="text-sm text-white/50 leading-relaxed">Receive FREE Sweeps Coins with every Gold Coin purchase. SC can be redeemed for real prizes!</p>
              </motion.div>
            </div>

            <div className="mt-6 flex justify-center">
              <Link href="/coin-store">
                <Button className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold px-8 py-3 rounded-xl" data-testid="cta-coin-store">
                  <Store className="w-4 h-4 mr-2" />
                  Visit Coin Store
                </Button>
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}


function BottomCTA() {
  return (
    <section className="pb-24 lg:pb-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <GlassCard className="px-6 py-10 sm:px-12 sm:py-14 text-center relative overflow-hidden" glow>
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-cyan-500/5" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-pink-500/10 to-transparent rounded-full blur-3xl" />
            <div className="mb-8 flex justify-center">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="inline-block"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 flex items-center justify-center shadow-xl shadow-pink-500/10">
                  <Gamepad2 className="w-10 h-10 text-pink-400" />
                </div>
              </motion.div>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Ready to{" "}
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Play?
              </span>
            </h2>
            <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto mb-8">
              11 games available now with more launching every week. Free arcade games and premium sweepstakes await.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 px-4 sm:px-0">
              <Link href="/arcade">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white font-bold px-8 rounded-xl shadow-xl shadow-pink-500/20"
                  data-testid="cta-browse-arcade"
                >
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  Browse Arcade
                </Button>
              </Link>
              <Link href="/coin-store">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 px-8 rounded-xl"
                  data-testid="cta-get-coins"
                >
                  <Coins className="w-5 h-5 mr-2" />
                  Get Coins
                </Button>
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

export default function GamesHomePage() {
  return (
    <main className="min-h-screen-safe bg-slate-950 scroll-touch" data-testid="games-home-page" style={{ WebkitOverflowScrolling: 'touch' }}>
      <HeroSection />
      <LiveStats />
      <QuickPlay />
      <FeaturedShowcase />
      <GameCategories />
      <CurrencySection />
      <BottomCTA />
    </main>
  );
}
