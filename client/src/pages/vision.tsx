import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Shield, Waves, Radio, Eye, Users, Lock } from "lucide-react";

const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

export default function VisionPage() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="#06b6d4" size={450} top="5%" left="10%" delay={0} />
      <GlowOrb color="#8b5cf6" size={400} top="40%" left="80%" delay={2} />
      <GlowOrb color="#ec4899" size={350} top="70%" left="20%" delay={4} />
      <GlowOrb color="#06b6d4" size={300} top="85%" left="65%" delay={6} />

      <div className="relative z-10 container mx-auto px-4 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8">
            <Waves className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-medium tracking-wide uppercase">Understanding the Vision</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Trust Layer
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            A new foundation for verified business. Not another blockchain competing for attention - 
            infrastructure where trust is the default, not the exception.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <GlassCard className="p-8 md:p-12" glow>
            <div className="flex items-start gap-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 shrink-0">
                <Waves className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">The Dark Wave</h2>
                <p className="text-slate-300 text-lg leading-relaxed mb-4">
                  Not darkness. The quiet, unstoppable force that reveals what's been hidden. 
                  Like a wave that approaches unseen, then washes away the debris - exposing 
                  solid ground beneath.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  In a space filled with noise, speculation, and empty promises, the dark wave 
                  is the signal cutting through. It doesn't announce itself. It simply arrives, 
                  and when it does, only what's real remains.
                </p>
              </div>
            </div>
</motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-16"
        >
          <GlassCard className="p-8 md:p-12" glow>
            <div className="flex items-start gap-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 shrink-0">
                <Shield className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">The Trust Layer</h2>
                <p className="text-slate-300 text-lg leading-relaxed mb-4">
                  Not another chain competing on speed or fees. Infrastructure where accountability 
                  is built into the foundation - not bolted on as an afterthought.
                </p>
                <p className="text-slate-400 leading-relaxed mb-4">
                  Every participant chooses to be verified. Every action carries a timestamp. 
                  Every commitment becomes a record. This isn't surveillance - it's mutual 
                  assurance. When everyone can see the ledger, nobody has to take anyone's word for it.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  The trustworthy benefit. The accountable thrive. Those who prefer shadows 
                  simply choose to operate elsewhere.
                </p>
              </div>
            </div>
</motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <GlassCard className="p-8 md:p-12" glow>
            <div className="flex items-start gap-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 shrink-0">
                <Radio className="w-8 h-8 text-pink-400" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Signal, Not Coin</h2>
                <p className="text-slate-300 text-lg leading-relaxed mb-4">
                  We don't trade speculation. We transmit verified intent.
                </p>
                <p className="text-slate-400 leading-relaxed mb-4">
                  When you send a Signal, you're not gambling on price movement. You're 
                  communicating - a transmission of verified intent from one participant 
                  to another, recorded permanently, meaning something.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  The word "coin" carries baggage: speculation, volatility, casino energy. 
                  Signal carries purpose. It's the difference between shouting into noise 
                  and transmitting a clear message that reaches its destination.
                </p>
              </div>
            </div>
</motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Core Principles</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
              <GlassCard className="p-6 h-full" glow>
                <div className="p-3 rounded-xl bg-cyan-500/10 w-fit mb-4">
                  <Eye className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Transparency by Design</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Every transaction visible. Every participant verifiable. 
                  Not because we force it - because that's how the layer works.
                </p>
</motion.div>

            <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
              <GlassCard className="p-6 h-full" glow>
                <div className="p-3 rounded-xl bg-purple-500/10 w-fit mb-4">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Reputation Follows</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Your history travels with you. Good actors build trust that compounds. 
                  Bad actors can't escape their record.
                </p>
</motion.div>

            <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
              <GlassCard className="p-6 h-full" glow>
                <div className="p-3 rounded-xl bg-pink-500/10 w-fit mb-4">
                  <Lock className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Verified, Not Surveilled</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Participants choose verification. The layer confirms identity 
                  without exposing private details. Trust without intrusion.
                </p>
</motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <GlassCard className="p-8 md:p-12 max-w-4xl mx-auto" glow>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">The Vision</h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-6">
              A world where doing business doesn't require blind faith. Where your 
              reputation is an asset that follows you. Where fraud has nowhere to hide 
              because transparency is the default.
            </p>
            <p className="text-slate-400 leading-relaxed mb-8">
              This isn't about control. It's about creating a space where the trustworthy 
              want to operate - because in a trust layer, being honest isn't just ethical. 
              It's advantageous.
            </p>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-white/10">
              <span className="text-white font-medium">The wave is approaching.</span>
              <span className="text-slate-400">Will you be ready?</span>
            </div>
</motion.div>
      </div>
    </div>
  );
}
