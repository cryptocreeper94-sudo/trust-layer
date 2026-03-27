import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Gamepad2, Sparkles, Trophy, Crown, Coins, Zap, Star,
  ChevronLeft, ChevronRight, Flame, Rocket, Shield,
  Puzzle, Grid3x3, Bug, Swords, Layers, TrendingUp,
  Dice1, Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";

import dragonSlots from "@assets/generated_images/game_dragon_slots.jpg";
import coinflipArt from "@assets/generated_images/game_coinflip_premium.jpg";
import crashArt from "@assets/generated_images/game_crash_rocket.jpg";
import arcadeClassics from "@assets/generated_images/game_arcade_classics.jpg";
import leprechaunSlots from "@assets/generated_images/game_leprechaun_slots.jpg";
import cardGames from "@assets/generated_images/game_card_games.jpg";
import minesweeperArt from "@assets/generated_images/game_minesweeper.jpg";

interface GameItem {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
  badge?: string;
  badgeColor?: string;
  icon: React.ReactNode;
  players?: string;
  hot?: boolean;
  new?: boolean;
  comingSoon?: boolean;
}

const CASINO_GAMES: GameItem[] = [
  {
    id: "dragon-slots",
    title: "Dragon's Fortune",
    description: "Ancient dragon guards a treasure hoard. Spin to claim your riches!",
    image: dragonSlots,
    href: "/slots",
    badge: "HOT",
    badgeColor: "from-red-500 to-cyan-500",
    icon: <Flame className="w-4 h-4" />,
    players: "2.4K playing",
    hot: true,
  },
  {
    id: "leprechaun-slots",
    title: "Lucky Leprechaun",
    description: "Follow the rainbow to the pot of gold. Luck of the Irish awaits!",
    image: leprechaunSlots,
    href: "/slots",
    badge: "NEW",
    badgeColor: "from-emerald-500 to-green-500",
    icon: <Star className="w-4 h-4" />,
    players: "1.8K playing",
    new: true,
  },
  {
    id: "coinflip",
    title: "Royal Coin Flip",
    description: "Double or nothing! Call heads or tails on the golden coin.",
    image: coinflipArt,
    href: "/coinflip",
    badge: "1.96x",
    badgeColor: "from-teal-500 to-purple-500",
    icon: <Coins className="w-4 h-4" />,
    players: "3.1K playing",
    hot: true,
  },
  {
    id: "crash",
    title: "Orbit Crash",
    description: "Watch the multiplier climb! Cash out before the crash for massive wins.",
    image: crashArt,
    href: "/crash",
    badge: "5000x MAX",
    badgeColor: "from-cyan-500 to-purple-500",
    icon: <Rocket className="w-4 h-4" />,
    players: "4.7K playing",
    hot: true,
  },
];

const FREE_GAMES: GameItem[] = [
  {
    id: "snake",
    title: "Neon Snake",
    description: "Classic snake reimagined with glowing trails and power-ups.",
    image: arcadeClassics,
    href: "/snake",
    icon: <Bug className="w-4 h-4" />,
    players: "890 playing",
  },
  {
    id: "tetris",
    title: "Cyber Tetris",
    description: "Stack blocks in this timeless puzzle. How long can you survive?",
    image: arcadeClassics,
    href: "/tetris",
    icon: <Grid3x3 className="w-4 h-4" />,
    players: "1.2K playing",
  },
  {
    id: "pacman",
    title: "Pac-Man Neon",
    description: "Eat all the dots and dodge the ghosts in this arcade legend.",
    image: arcadeClassics,
    href: "/pacman",
    icon: <Gamepad2 className="w-4 h-4" />,
    players: "760 playing",
  },
  {
    id: "galaga",
    title: "Space Blaster",
    description: "Defend Earth from waves of alien invaders. Shoot to survive!",
    image: arcadeClassics,
    href: "/galaga",
    icon: <Rocket className="w-4 h-4" />,
    players: "540 playing",
  },
];

const CLASSIC_GAMES: GameItem[] = [
  {
    id: "solitaire",
    title: "Royal Solitaire",
    description: "The king of card games. Stack and sort your way to victory.",
    image: cardGames,
    href: "/solitaire",
    icon: <Layers className="w-4 h-4" />,
    players: "2.1K playing",
  },
  {
    id: "spades",
    title: "Spades Royale",
    description: "Bid, trick, and trump your way through this strategic card game.",
    image: cardGames,
    href: "/spades",
    icon: <Swords className="w-4 h-4" />,
    players: "980 playing",
  },
  {
    id: "minesweeper",
    title: "Cyber Mines",
    description: "Clear the grid without detonating a mine. Logic meets luck.",
    image: minesweeperArt,
    href: "/minesweeper",
    icon: <Shield className="w-4 h-4" />,
    players: "650 playing",
  },
];

function GameCarousel({ title, subtitle, games, icon, accentColor = "cyan" }: {
  title: string;
  subtitle: string;
  games: GameItem[];
  icon: React.ReactNode;
  accentColor?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", checkScroll);
    return () => el?.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.7;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const colorMap: Record<string, { text: string; border: string; glow: string; bg: string }> = {
    cyan: { text: "text-cyan-400", border: "border-cyan-500/30", glow: "shadow-cyan-500/20", bg: "from-cyan-500/20" },
    purple: { text: "text-purple-400", border: "border-purple-500/30", glow: "shadow-purple-500/20", bg: "from-purple-500/20" },
    teal: { text: "text-teal-400", border: "border-teal-500/30", glow: "shadow-teal-500/20", bg: "from-teal-500/20" },
    pink: { text: "text-pink-400", border: "border-pink-500/30", glow: "shadow-pink-500/20", bg: "from-pink-500/20" },
    green: { text: "text-green-400", border: "border-green-500/30", glow: "shadow-green-500/20", bg: "from-green-500/20" },
  };

  const colors = colorMap[accentColor] || colorMap.cyan;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.bg} to-transparent border ${colors.border} flex items-center justify-center ${colors.text}`}>
            {icon}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              {title}
              <Badge className={`text-[10px] px-2 py-0.5 bg-gradient-to-r ${colors.bg} to-transparent border ${colors.border} ${colors.text}`}>
                {games.length}
              </Badge>
            </h2>
            <p className="text-sm text-slate-400">{subtitle}</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-full border border-white/10 ${canScrollLeft ? 'hover:bg-white/10 text-white' : 'text-white/20 cursor-default'}`}
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            data-testid={`carousel-left-${title.toLowerCase().replace(/\s/g, '-')}`}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-full border border-white/10 ${canScrollRight ? 'hover:bg-white/10 text-white' : 'text-white/20 cursor-default'}`}
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            data-testid={`carousel-right-${title.toLowerCase().replace(/\s/g, '-')}`}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="relative group">
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />
        )}

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 -mx-1 px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {games.map((game, i) => (
            <GameCard key={game.id} game={game} index={i} accentColor={accentColor} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GameCard({ game, index, accentColor }: { game: GameItem; index: number; accentColor: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="snap-start shrink-0 w-[260px] sm:w-[280px] md:w-[300px]"
    >
      <Link href={game.href}>
        <motion.div
          className="relative rounded-2xl overflow-hidden cursor-pointer group/card"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.03, y: -4 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          data-testid={`game-card-${game.id}`}
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-slate-800 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700/50 to-slate-800/50" />
              </div>
            )}
            <img
              src={game.image}
              alt={game.title}
              className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-110 brightness-110' : 'scale-100'} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            {game.badge && (
              <div className="absolute top-4 right-4">
                <motion.div
                  animate={game.hot ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="inline-block"
                >
                  <Badge className={`bg-gradient-to-r ${game.badgeColor} text-white text-[10px] font-bold px-2.5 py-1 shadow-lg border-0`}>
                    {game.badge}
                  </Badge>
                </motion.div>
              </div>
            )}

            {game.hot && (
              <div className="absolute top-4 left-4">
                <motion.div
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Flame className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]" />
                </motion.div>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`w-6 h-6 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center text-white`}>
                  {game.icon}
                </div>
                <h3 className="text-lg font-bold text-white drop-shadow-lg">{game.title}</h3>
              </div>
              <p className="text-xs text-white/70 line-clamp-2 mb-2.5">{game.description}</p>
              {game.players && (
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] text-green-400/80 font-medium">{game.players}</span>
                </div>
              )}
            </div>
          </div>

          <motion.div
            className={`absolute inset-0 rounded-2xl border-2 pointer-events-none transition-all duration-300 ${isHovered ? 'border-white/20 shadow-2xl' : 'border-white/5'}`}
            style={{
              boxShadow: isHovered ? `0 0 30px rgba(${accentColor === 'teal' ? '234,179,8' : accentColor === 'cyan' ? '6,182,212' : accentColor === 'purple' ? '168,85,247' : accentColor === 'green' ? '34,197,94' : '236,72,153'},0.15)` : 'none',
            }}
          />

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-2xl"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                >
                  <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-bold px-6 py-3 rounded-xl shadow-xl text-sm">
                    <Zap className="w-4 h-4 mr-2" />
                    Play Now
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Link>
    </motion.div>
  );
}

function FeaturedBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative mb-10 rounded-2xl overflow-hidden"
    >
      <div className="relative h-[200px] sm:h-[260px] md:h-[300px]">
        <img src={dragonSlots} alt="Featured" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        <div className="absolute inset-0 flex items-center">
          <div className="px-8 sm:px-10 max-w-lg">
            <div className="mb-4 inline-block">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block"
              >
                <Badge className="bg-gradient-to-r from-red-500 to-cyan-500 text-white text-xs font-bold px-3 py-1 border-0">
                  <Flame className="w-3 h-3 mr-1" /> FEATURED
                </Badge>
              </motion.div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
              Dragon's Fortune
            </h2>
            <p className="text-sm sm:text-base text-white/70 mb-4 hidden sm:block">
              The ancient dragon awakens! Spin the reels and claim your share of the legendary treasure hoard.
            </p>
            <Link href="/slots">
              <Button className="bg-gradient-to-r from-red-500 to-cyan-500 hover:from-red-400 hover:to-cyan-400 text-white font-bold px-6 py-3 rounded-xl shadow-xl" data-testid="featured-play-now">
                <Zap className="w-4 h-4 mr-2" />
                Play Now
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 sm:right-8 flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-white/80 font-medium">4.7K playing</span>
          </div>
        </div>
      </div>

      <motion.div
        className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none"
        animate={{
          boxShadow: [
            "0 0 20px rgba(239,68,68,0.1)",
            "0 0 40px rgba(249,115,22,0.15)",
            "0 0 20px rgba(239,68,68,0.1)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </motion.div>
  );
}

function StatsBar() {
  const stats = [
    { label: "Total Players", value: "12.4K", icon: <Trophy className="w-4 h-4 text-teal-400" /> },
    { label: "Games Available", value: "11", icon: <Gamepad2 className="w-4 h-4 text-cyan-400" /> },
    { label: "Total Wagered", value: "2.1M GC", icon: <Coins className="w-4 h-4 text-green-400" /> },
    { label: "Biggest Win", value: "500K GC", icon: <Crown className="w-4 h-4 text-purple-400" /> },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.1 }}
        >
          <GlassCard className="p-5 sm:p-6 text-center" glow>
            <div className="flex items-center justify-center gap-2 mb-1.5">
              {stat.icon}
              <span className="text-lg sm:text-xl font-bold text-white">{stat.value}</span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider">{stat.label}</p>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}

function CurrencyExplainer() {
  return (
    <GlassCard className="p-6 sm:p-8 mb-10" glow>
      <div className="flex items-start gap-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-green-500/20 border border-teal-500/30 flex items-center justify-center shrink-0">
          <Coins className="w-5 h-5 text-teal-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white mb-1">How Sweepstakes Games Work</h3>
          <p className="text-sm text-slate-400">Our casino games use a legal dual-currency sweepstakes model.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-teal-500/5 border border-teal-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Coins className="w-5 h-5 text-teal-400" />
            <span className="font-bold text-teal-400">Gold Coins (GC)</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">Purchase Gold Coins to play for fun. No real-money value. Buy packages to get started!</p>
        </div>
        <div className="p-5 rounded-xl bg-green-500/5 border border-green-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-green-400" />
            <span className="font-bold text-green-400">Sweeps Coins (SC)</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">Receive FREE Sweeps Coins with Gold Coin purchases. SC can be redeemed for prizes!</p>
        </div>
      </div>
    </GlassCard>
  );
}

export default function Arcade() {
  return (
    <main className="min-h-screen-safe bg-slate-950 scroll-touch" data-testid="arcade-page">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/3 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 mb-4">
              <Gamepad2 className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-400">The Arcade</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Game Arcade
              </span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
              Free arcade games, premium casino experiences, and classic card games. Play for fun or play to win.
            </p>
          </motion.div>

          <StatsBar />

          <FeaturedBanner />

          <GameCarousel
            title="Casino & Sweepstakes"
            subtitle="Play with Gold Coins, win Sweeps Coins for prizes"
            games={CASINO_GAMES}
            icon={<Crown className="w-5 h-5" />}
            accentColor="teal"
          />

          <CurrencyExplainer />

          <GameCarousel
            title="Free Arcade Games"
            subtitle="Classic games, zero cost - just pure fun"
            games={FREE_GAMES}
            icon={<Gamepad2 className="w-5 h-5" />}
            accentColor="cyan"
          />

          <GameCarousel
            title="Classic Card & Puzzle Games"
            subtitle="Timeless strategy and brain teasers"
            games={CLASSIC_GAMES}
            icon={<Puzzle className="w-5 h-5" />}
            accentColor="purple"
          />

          <GlassCard className="p-8 sm:p-10 md:p-12 text-center" glow>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="inline-block mb-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-pink-400" />
              </div>
            </motion.div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">More Games Coming Soon</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
              We're building new premium games constantly. Roulette, Blackjack, Poker, and more are on the way.
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              {["Roulette", "Blackjack", "Poker", "Dice", "Baccarat", "Keno"].map((game) => (
                <Badge key={game} className="bg-white/5 border-white/10 text-slate-400 text-xs px-3 py-1">
                  {game}
                </Badge>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
