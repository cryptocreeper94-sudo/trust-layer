import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Sparkles, Radar, Brain, TrendingUp, Calendar } from 'lucide-react';

const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

export default function GuardianShieldPage() {
  return (
    <main className="min-h-screen relative overflow-hidden pt-20 pb-12" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }} data-testid="guardian-shield-page">
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #8b5cf6)" size={500} top="5%" left="10%" />
      <GlowOrb color="linear-gradient(135deg, #ec4899, #8b5cf6)" size={400} top="50%" left="70%" delay={2} />
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #3b82f6)" size={350} top="80%" left="20%" delay={4} />

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
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
            className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 p-[2px]"
          >
            <div className="w-full h-full rounded-2xl bg-[#0c1222] flex items-center justify-center">
              <Shield className="w-12 h-12 text-cyan-400" />
            </div>
          </motion.div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 mb-6">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-400">Under Development</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Guardian Shield
          </h1>

          <p className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-semibold mb-6">
            Advanced DEX Screener & Security Monitor
          </p>

          <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
            We're building something special. Guardian Shield will be a high-powered DEX screener with
            AI-driven threat detection, predictive market intelligence, and real-time security monitoring.
            We're taking the time to get this right — so when it launches, it will be exactly what
            the Trust Layer community deserves.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Brain, color: "text-cyan-400", title: "AI Capabilities", desc: "Smart pattern detection", delay: 0.1 },
            { icon: TrendingUp, color: "text-purple-400", title: "Predictive Analytics", desc: "Market intelligence", delay: 0.2 },
            { icon: Radar, color: "text-pink-400", title: "Real-Time Scanning", desc: "24/7 monitoring", delay: 0.3 },
          ].map((card) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: card.delay, duration: 0.5 }}
              className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center hover:scale-[1.02] hover:border-purple-500/20 transition-all duration-300"
              style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}
            >
              <card.icon className={`w-10 h-10 ${card.color} mx-auto mb-4`} />
              <p className="text-base font-semibold text-white mb-1">{card.title}</p>
              <p className="text-sm text-slate-400">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center mb-16"
          style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Calendar className="w-5 h-5 text-purple-400" />
            <span className="text-lg font-bold text-white">Launching at TGE</span>
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Coming Soon
          </p>
          <p className="text-sm text-slate-400 mt-2">Token Generation Event</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 text-slate-400"
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm">Hang tight — it's going to be worth the wait</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
