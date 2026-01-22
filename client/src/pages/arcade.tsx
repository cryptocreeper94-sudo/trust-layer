import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Gamepad2, Film, Music, Video, Users, Sparkles, Lock, Calendar,
  ArrowLeft, Home, Tv, Radio, Mic2, Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Arcade() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" data-testid="entertainment-page">
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white h-8 px-2">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            </Link>
            <span className="text-white font-semibold">Entertainment Hub</span>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white h-8 w-8 p-0">
              <Home className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-full" />
          
          <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 max-w-2xl text-center">
            <motion.div
              animate={{ 
                boxShadow: [
                  '0 0 30px rgba(6, 182, 212, 0.3)',
                  '0 0 60px rgba(168, 85, 247, 0.3)',
                  '0 0 30px rgba(236, 72, 153, 0.3)',
                  '0 0 60px rgba(6, 182, 212, 0.3)'
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 p-[2px]"
            >
              <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center">
                <Tv className="w-12 h-12 text-purple-400" />
              </div>
            </motion.div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-6">
              <Lock className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-purple-400">Coming Soon</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Entertainment Hub
            </h1>
            
            <p className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold mb-6">
              Games, Videos, Music & More
            </p>

            <p className="text-slate-300 mb-8 leading-relaxed">
              The DarkWave Entertainment Hub is where our community comes to play, watch, and connect. 
              We're building a complete entertainment ecosystem — classic arcade games, original content, 
              creator channels, and community experiences. We're taking the time to make sure everything 
              works perfectly before launch.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <Gamepad2 className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">Arcade Games</p>
                <p className="text-xs text-slate-400">Classic fun</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <Video className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">Video Content</p>
                <p className="text-xs text-slate-400">Creator channels</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <Music className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">Music & Audio</p>
                <p className="text-xs text-slate-400">Community radio</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">Competitions</p>
                <p className="text-xs text-slate-400">Win rewards</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 mb-6">
              <p className="text-sm text-slate-400 mb-2">What's included at launch:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {["Solitaire", "Minesweeper", "Spades", "Tetris", "Snake", "Pac-Man", "Space Blaster"].map((game) => (
                  <span key={game} className="px-3 py-1 rounded-full bg-slate-700/50 text-xs text-slate-300">
                    {game}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 border border-purple-500/30 mb-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                <span className="text-lg font-bold text-white">Launching at TGE</span>
              </div>
              <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                Coming Soon
              </p>
              <p className="text-sm text-slate-400 mt-2">Token Generation Event</p>
            </div>

            <motion.div 
              className="flex items-center justify-center gap-2 text-slate-400"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm">Get ready to play — entertainment is coming</span>
              <Sparkles className="w-4 h-4 text-pink-400" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
