import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Sparkles, Radar, Brain, TrendingUp, Calendar, ArrowLeft, Home } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function GuardianShieldPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" data-testid="guardian-shield-page">
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white h-8 px-2">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            </Link>
            <span className="text-white font-semibold">Guardian Shield</span>
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
                <Shield className="w-12 h-12 text-cyan-400" />
              </div>
            </motion.div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 mb-6">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-cyan-400">Under Development</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Guardian Shield
            </h1>
            
            <p className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-semibold mb-6">
              Advanced DEX Screener & Security Monitor
            </p>

            <p className="text-slate-300 mb-8 leading-relaxed">
              We're building something special. Guardian Shield will be a high-powered DEX screener with 
              AI-driven threat detection, predictive market intelligence, and real-time security monitoring. 
              We're taking the time to get this right — so when it launches, it will be exactly what 
              the DarkWave community deserves.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <Brain className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">AI Capabilities</p>
                <p className="text-xs text-slate-400">Smart pattern detection</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">Predictive Analytics</p>
                <p className="text-xs text-slate-400">Market intelligence</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <Radar className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">Real-Time Scanning</p>
                <p className="text-xs text-slate-400">24/7 monitoring</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-purple-500/30 mb-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                <span className="text-lg font-bold text-white">Launching at TGE</span>
              </div>
              <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                May 1, 2026
              </p>
              <p className="text-sm text-slate-400 mt-2">Token Generation Event</p>
            </div>

            <motion.div 
              className="flex items-center justify-center gap-2 text-slate-400"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm">Hang tight — it's going to be worth the wait</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
