import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, FileText, Smartphone, BookMarked, ExternalLink } from "lucide-react";

export default function Veil() {
  const handlePrintVolume2 = () => {
    window.open('/veil/print/vol2', '_blank');
  };

  const handleReadOnline = () => {
    window.location.href = '/veil/read';
  };

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
            <span className="text-sm text-slate-300 uppercase tracking-wider">Complete Edition - 2026</span>
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
          
          <p className="text-cyan-400 mt-4 font-medium">By Jason Andrews</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-12"
        >
          <GlassCard className="p-8 max-w-4xl mx-auto border-2 border-purple-500/30" glow>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 mb-4">
                <span className="text-xs text-purple-300 uppercase tracking-wider">Two Volumes - One Journey</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">The Complete Edition</h3>
              <p className="text-slate-400 max-w-xl mx-auto">
                Volume One presents the evidence. Volume Two walks you through what happens when you finally see it.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
                <h4 className="text-cyan-400 font-semibold mb-2">Volume One: The Evidence</h4>
                <p className="text-slate-400 text-sm">168 pages, 42 chapters, 12 parts. The history, the patterns, the documented substitutions and erasures.</p>
              </div>
              <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
                <h4 className="text-purple-400 font-semibold mb-2">Volume Two: The Journey</h4>
                <p className="text-slate-400 text-sm">24 parts of personal testimony. What happened when I finally allowed myself to step through the fear.</p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-slate-500 text-sm mb-4">Download both volumes below, or read the complete edition online:</p>
              <Button 
                onClick={handleReadOnline}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Read Complete Edition Online
              </Button>
            </div>
          </GlassCard>
        </motion.div>

        <h3 className="text-2xl font-bold text-white mb-8 text-center">Download Individual Volumes</h3>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlassCard className="p-6 md:p-8 h-full" glow>
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex-shrink-0">
                  <FileText className="w-5 h-5 text-red-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-white leading-tight">PDF Download</h3>
                  <p className="text-xs text-slate-400">Desktop & Print</p>
                </div>
              </div>
              
              <ul className="space-y-2.5 mb-6 text-slate-300 text-sm">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                  <span>168 pages</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                  <span>163+ scripture refs</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                  <span>Print-ready</span>
                </li>
              </ul>
              
              <a href="/assets/Through-The-Veil-EBOOK.pdf" download className="block mt-auto">
                <Button className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 py-4">
                  <Download className="w-4 h-4 mr-2" />
                  PDF (7 MB)
                </Button>
              </a>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <GlassCard className="p-6 md:p-8 h-full" glow>
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex-shrink-0">
                  <Smartphone className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-white leading-tight">EPUB Download</h3>
                  <p className="text-xs text-slate-400">E-readers & Mobile</p>
                </div>
              </div>
              
              <ul className="space-y-2.5 mb-6 text-slate-300 text-sm">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                  <span>58 chapters</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                  <span>Mobile optimized</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                  <span>Kindle/Kobo/Nook</span>
                </li>
              </ul>
              
              <a href="/assets/Through-The-Veil-EBOOK.epub" download className="block mt-auto">
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 py-4">
                  <Download className="w-4 h-4 mr-2" />
                  EPUB (147 KB)
                </Button>
              </a>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <GlassCard className="p-6 md:p-8 h-full border-2 border-purple-500/20" glow>
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex-shrink-0">
                  <BookMarked className="w-5 h-5 text-purple-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-white leading-tight">Read Online</h3>
                  <p className="text-xs text-slate-400">Browser & Print</p>
                </div>
              </div>
              
              <ul className="space-y-2.5 mb-6 text-slate-300 text-sm">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400 flex-shrink-0" />
                  <span>24 parts</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400 flex-shrink-0" />
                  <span>Author's Note</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400 flex-shrink-0" />
                  <span>Print to PDF</span>
                </li>
              </ul>
              
              <Button 
                onClick={handlePrintVolume2}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-4 mt-auto"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open & Print
              </Button>
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
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-cyan-400 mb-4 border-b border-cyan-400/30 pb-2">Volume One: The Evidence</h4>
                
                <div className="space-y-3">
                  <div>
                    <h5 className="text-cyan-300 font-medium text-sm">Part One: The Rebellion</h5>
                    <p className="text-slate-400 text-xs">The 200 Watchers, the Nephilim, the forbidden knowledge.</p>
                  </div>
                  <div>
                    <h5 className="text-cyan-300 font-medium text-sm">Part Two: The Resets</h5>
                    <p className="text-slate-400 text-xs">The Flood, Tartaria, the mud flood, orphan trains.</p>
                  </div>
                  <div>
                    <h5 className="text-cyan-300 font-medium text-sm">Part Three: The Substitution</h5>
                    <p className="text-slate-400 text-xs">The Name erased, calendar changed, scriptures removed.</p>
                  </div>
                  <div>
                    <h5 className="text-cyan-300 font-medium text-sm">Parts Four-Six</h5>
                    <p className="text-slate-400 text-xs">Hidden rulers, control systems, the awakening, path forward.</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-purple-400 mb-4 border-b border-purple-400/30 pb-2">Volume Two: The Journey</h4>
                
                <div className="space-y-3">
                  <div>
                    <h5 className="text-purple-300 font-medium text-sm">The Fog and The Lifting</h5>
                    <p className="text-slate-400 text-xs">Coming out of addiction into clarity.</p>
                  </div>
                  <div>
                    <h5 className="text-purple-300 font-medium text-sm">Fear as the Weapon</h5>
                    <p className="text-slate-400 text-xs">How they hijacked survival instinct for control.</p>
                  </div>
                  <div>
                    <h5 className="text-purple-300 font-medium text-sm">The Mark and The Names</h5>
                    <p className="text-slate-400 text-xs">What if the mark isn't a chip?</p>
                  </div>
                  <div>
                    <h5 className="text-purple-300 font-medium text-sm">Why I'm Not Hiding</h5>
                    <p className="text-slate-400 text-xs">The personal cost of speaking truth.</p>
                  </div>
                </div>
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
