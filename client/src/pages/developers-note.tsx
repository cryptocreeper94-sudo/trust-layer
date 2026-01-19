import { motion } from "framer-motion";
import { Heart, Shield, Users, MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";

import fantasyWorld from "@assets/generated_images/fantasy_sci-fi_world_landscape.png";

export default function DevelopersNote() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <img src={fantasyWorld} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/90 to-slate-950" />
      </div>
      
      <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-40 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6"
            >
              <Heart className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-300">A Personal Message</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                A Note From Our Team
              </span>
            </h1>
          </div>
          
          <GlassCard glow className="p-8 md:p-12">
            <div className="prose prose-invert max-w-none">
              <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-6">
                Hey there,
              </p>
              
              <p className="text-white/80 leading-relaxed mb-6">
                My name is Jason, and I lead the team behind DarkWave. Before you go any further, I want to have an honest conversation with you.
              </p>
              
              <p className="text-white/80 leading-relaxed mb-6">
                <strong className="text-cyan-400">We understand your skepticism.</strong> Truly, we do. And we don't blame you one bit.
              </p>
              
              <p className="text-white/80 leading-relaxed mb-6">
                Over the past decade, I've personally lost well over $50,000 in this space. Pump and dumps. Straight-up app scams. A market that seems to have an almost supernatural ability to move against you the moment you buy in. If you've been in crypto for any length of time, you probably have similar stories. The wounds are real.
              </p>
              
              <p className="text-white/80 leading-relaxed mb-6">
                That's exactly why we're building this.
              </p>
              
              <p className="text-white/80 leading-relaxed mb-6">
                DarkWave isn't just another blockchain project making promises. We're building a <strong className="text-purple-400">Trusted Network</strong> — a place where seeing another member means you're on the same team. Where we're all here to genuinely help each other succeed, not exploit each other for quick gains.
              </p>
              
              <p className="text-white/80 leading-relaxed mb-6">
                We're not asking you to throw money at us blindly. We're asking you to stick around. Watch what we do. Join the community. Become part of this. See for yourself whether our actions match our words.
              </p>
              
              <div className="my-8 p-6 rounded-xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-white/10">
                <p className="text-white/90 text-lg italic mb-0">
                  "We're trying to build something better than what's out there. More honest. More fair. A network where trust actually means something."
                </p>
              </div>
              
              <p className="text-white/80 leading-relaxed mb-6">
                So from all of us here at DarkWave — it's nice to meet you. We're genuinely glad you're here.
              </p>
              
              <p className="text-white/80 leading-relaxed mb-8">
                Join the family. Let's all benefit together and build something that matters.
              </p>
              
              <p className="text-cyan-400 font-medium text-lg">
                — Jason & The DarkWave Team
              </p>
            </div>
          </GlassCard>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <Link href="/community">
              <GlassCard className="p-6 text-center cursor-pointer hover:border-cyan-500/50 transition-all group">
                <Users className="w-8 h-8 text-cyan-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-white mb-1">Join Community</h3>
                <p className="text-sm text-white/60">Connect with the family</p>
              </GlassCard>
            </Link>
            
            <Link href="/crowdfund">
              <GlassCard className="p-6 text-center cursor-pointer hover:border-purple-500/50 transition-all group">
                <Heart className="w-8 h-8 text-purple-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-white mb-1">Support Development</h3>
                <p className="text-sm text-white/60">Help us build this</p>
              </GlassCard>
            </Link>
            
            <Link href="/presale">
              <GlassCard className="p-6 text-center cursor-pointer hover:border-pink-500/50 transition-all group">
                <Shield className="w-8 h-8 text-pink-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-white mb-1">Get Signal</h3>
                <p className="text-sm text-white/60">Join the Trust Network</p>
              </GlassCard>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
