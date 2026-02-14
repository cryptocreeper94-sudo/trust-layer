import { motion } from "framer-motion";
import { ArrowLeftRight, Clock } from "lucide-react";

const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

export default function TokenCompare() {
  return (
    <div className="min-h-screen relative overflow-hidden pt-20 pb-12" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #8b5cf6)" size={450} top="10%" left="5%" />
      <GlowOrb color="linear-gradient(135deg, #ec4899, #8b5cf6)" size={350} top="55%" left="75%" delay={2} />

      <div className="relative z-10 container mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <ArrowLeftRight className="w-8 h-8 text-cyan-400" />
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent" data-testid="text-title">Token Comparison</h1>
          </div>
          <p className="text-slate-400">Compare tokens side-by-side</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center hover:border-purple-500/20 transition-all duration-300"
          style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}
          data-testid="card-coming-soon"
        >
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="relative">
              <motion.div
                className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Clock className="w-10 h-10 text-cyan-400" />
              </motion.div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Launching Soon
              </h2>
              <p className="text-slate-400 max-w-md mx-auto">
                Real-time token comparison with live price feeds, volume data, and market analytics
                will be available when Trust Layer mainnet goes live.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {["Price", "Volume", "Market Cap", "Holders"].map((metric, i) => (
                <motion.div
                  key={metric}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="p-4 rounded-xl bg-white/[0.04] backdrop-blur-xl border border-white/10 hover:scale-[1.02] hover:border-purple-500/20 transition-all duration-300"
                  style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}
                >
                  <div className="text-2xl font-bold text-slate-500">--</div>
                  <div className="text-xs text-slate-400 mt-1">{metric}</div>
                </motion.div>
              ))}
            </div>

            <p className="text-xs text-slate-500 mt-4">
              Join our testnet today to be ready for mainnet launch
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
