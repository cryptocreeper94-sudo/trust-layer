import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, FileText, Smartphone } from "lucide-react";

export default function Veil() {
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-white/10 mb-6">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-slate-300 uppercase tracking-wider">First Edition - 2025</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Through The Veil
            </span>
          </h1>
          
          <h2 className="text-xl md:text-2xl text-slate-400 mb-6">
            Unraveling the Tapestry of Lies?
          </h2>
          
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            A Journey Through Hidden History, Suppressed Truth, and Spiritual Warfare
          </p>
          
          <p className="text-cyan-400 mt-4 font-medium">By Asher Reed</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlassCard className="p-8 h-full" glow>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30">
                  <FileText className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">PDF Edition</h3>
                  <p className="text-sm text-slate-400">Best for desktop reading</p>
                </div>
              </div>
              
              <ul className="space-y-2 mb-6 text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  167 pages of documented research
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  5 embedded visual illustrations
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  163+ Cepher scripture references
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Print-ready formatting
                </li>
              </ul>
              
              <a href="/assets/Through-The-Veil-EBOOK.pdf" download>
                <Button className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF (7 MB)
                </Button>
              </a>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <GlassCard className="p-8 h-full" glow>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                  <Smartphone className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">EPUB Edition</h3>
                  <p className="text-sm text-slate-400">For Kindle & e-readers</p>
                </div>
              </div>
              
              <ul className="space-y-2 mb-6 text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  58 chapters with navigation
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Optimized for mobile reading
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Adjustable text size support
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Works with Kindle, Kobo, Nook
                </li>
              </ul>
              
              <a href="/assets/Through-The-Veil-EBOOK.epub" download>
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                  <Download className="w-4 h-4 mr-2" />
                  Download EPUB (147 KB)
                </Button>
              </a>
            </GlassCard>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <GlassCard className="p-8 max-w-4xl mx-auto" glow>
            <h3 className="text-2xl font-bold text-white mb-6 text-center">What's Inside</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-cyan-400 font-semibold mb-3">Part One: The Rebellion</h4>
                <p className="text-slate-400 text-sm mb-4">The 200 Watchers, the Nephilim, the forbidden knowledge that corrupted humanity before the Flood.</p>
                
                <h4 className="text-cyan-400 font-semibold mb-3">Part Two: The Resets</h4>
                <p className="text-slate-400 text-sm mb-4">The Flood, Tartaria, the mud flood, the orphan trains, and how history was erased and rewritten.</p>
                
                <h4 className="text-cyan-400 font-semibold mb-3">Part Three: The Substitution</h4>
                <p className="text-slate-400 text-sm">The Name that was erased, the calendar that was changed, the scriptures that were removed.</p>
              </div>
              
              <div>
                <h4 className="text-purple-400 font-semibold mb-3">Part Four: The Control Systems</h4>
                <p className="text-slate-400 text-sm mb-4">Bloodlines, corporations, media, technology, and the occult symbols hidden in plain sight.</p>
                
                <h4 className="text-purple-400 font-semibold mb-3">Part Five: The Awakening</h4>
                <p className="text-slate-400 text-sm mb-4">Restoring the receiver, the two things the Father requires, and why the veil is lifting now.</p>
                
                <h4 className="text-purple-400 font-semibold mb-3">Part Six: The Path Forward</h4>
                <p className="text-slate-400 text-sm">Scripture cross-references, the Cepher recommendation, and resources for deeper study.</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-slate-500 text-sm">
            All glory to Yahuah, the Most High. HalleluYah.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
