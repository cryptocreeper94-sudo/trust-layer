import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, Download, FileText, Smartphone, ChevronDown, ChevronRight, 
  Headphones, ExternalLink, Scroll, Eye, Quote, Star, Layers, 
  BookMarked, Clock, Globe, Shield, Sparkles, ArrowRight
} from "lucide-react";

interface TocSection {
  title: string;
  chapters: { name: string; description: string; anchor: string }[];
}

const tableOfContents: TocSection[] = [
  {
    title: "Part One: The Evidence",
    chapters: [
      { name: "Chapter 1: The Rebellion", description: "The 200 Watchers, the Nephilim, forbidden knowledge", anchor: "chapter-1" },
      { name: "Chapter 2: The Corruption", description: "Genetic manipulation and the bloodline war", anchor: "chapter-2" },
      { name: "Chapter 3: The Flood", description: "Why it had to happen, what survived", anchor: "chapter-3" },
      { name: "Chapter 4: The Resets", description: "Tartaria, mud floods, orphan trains", anchor: "chapter-4" },
      { name: "Chapter 5: The Substitution", description: "Yahusha became Jesus, the Name erased", anchor: "chapter-5" },
      { name: "Chapter 6: The Calendar", description: "Time manipulation, Gregorian reform, phantom years", anchor: "chapter-6" },
      { name: "Chapter 7: The Councils", description: "Nicaea, scripture removal, doctrine corruption", anchor: "chapter-7" },
    ]
  },
  {
    title: "Part Two: The Patterns",
    chapters: [
      { name: "Chapter 8-15: The Inversions", description: "Medicine, education, government, religion", anchor: "chapter-8" },
      { name: "Chapter 16-20: The Control Systems", description: "Fear, addiction, technology, media", anchor: "chapter-16" },
      { name: "Chapter 21-25: The Hidden Rulers", description: "Bloodlines, secret societies, the Hydra", anchor: "chapter-21" },
    ]
  },
  {
    title: "Part Three: The Timeline",
    chapters: [
      { name: "Chapter 26-30: The Apostasy", description: "The Great Schism, the falling away", anchor: "chapter-26" },
      { name: "Chapter 31-34: The Missing Millennium", description: "500-1500 AD, the obscured reign", anchor: "chapter-31" },
      { name: "Chapter 35-37: Satan's Little Season", description: "Renaissance to present, the staged rapture", anchor: "chapter-35" },
    ]
  },
  {
    title: "Part Four: The Journey",
    chapters: [
      { name: "Chapter 38: The Fog and The Lifting", description: "Coming out of addiction into clarity", anchor: "chapter-38" },
      { name: "Chapter 39: Fear as the Weapon", description: "How they hijacked survival instinct", anchor: "chapter-39" },
      { name: "Chapter 40: The Mark and The Names", description: "What if the mark isn't a chip?", anchor: "chapter-40" },
      { name: "Chapter 41-44: Why I'm Not Hiding", description: "Personal testimony, the cost of truth", anchor: "chapter-41" },
    ]
  },
  {
    title: "Appendices",
    chapters: [
      { name: "Concordance of Terms", description: "Hebrew words, concepts, definitions", anchor: "concordance" },
      { name: "Scripture Chain References", description: "163+ scripture citations", anchor: "scripture-chain" },
      { name: "Source Documentation", description: "Dead Sea Scrolls, historical records", anchor: "sources" },
    ]
  }
];

const bookStats = [
  { icon: BookMarked, label: "Chapters", value: "44+", color: "text-purple-400" },
  { icon: Scroll, label: "Scripture Refs", value: "163+", color: "text-cyan-400" },
  { icon: Clock, label: "Reading Time", value: "~12hrs", color: "text-pink-400" },
  { icon: Globe, label: "Languages", value: "English", color: "text-amber-400" },
];

const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

function ScrollReveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ShimmerCard({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden ${className}`}>
      <div className="animate-pulse p-6">
        <div className="h-6 w-32 bg-purple-500/10 rounded-lg mb-4" />
        <div className="h-4 w-full bg-white/5 rounded mb-2" />
        <div className="h-4 w-3/4 bg-white/5 rounded mb-2" />
        <div className="h-4 w-1/2 bg-white/5 rounded" />
      </div>
    </div>
  );
}

export default function Veil() {
  const [expandedSections, setExpandedSections] = useState<string[]>(["Part One: The Evidence"]);
  const [isLoaded, setIsLoaded] = useState(false);

  const toggleSection = (title: string) => {
    setExpandedSections(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const handleReadOnline = (anchor?: string) => {
    if (anchor) {
      window.location.href = `/veil/read#${anchor}`;
    } else {
      window.location.href = '/veil/read';
    }
  };

  useEffect(() => {
    document.title = "Through The Veil | The Greatest Story Ever Stole?";
    
    let manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    if (manifestLink) {
      manifestLink.href = '/manifest-veil.webmanifest';
    }
    
    let themeColor = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
    if (themeColor) {
      themeColor.content = '#a855f7';
    }
    
    let appleTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]') as HTMLMetaElement;
    if (appleTitle) {
      appleTitle.content = 'Through The Veil';
    }

    let appleIcon = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement;
    if (appleIcon) {
      appleIcon.href = '/icons/veil-192x192.png';
    }

    const timer = setTimeout(() => setIsLoaded(true), 300);

    return () => {
      clearTimeout(timer);
      if (manifestLink) manifestLink.href = '/manifest.webmanifest';
      if (themeColor) themeColor.content = '#00ffff';
      if (appleTitle) appleTitle.content = 'Trust Layer';
      if (appleIcon) appleIcon.href = '/icons/icon-192x192.png';
    };
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen pt-20 pb-12" style={{ background: "linear-gradient(180deg, #0a0014, #120826, #0a0014)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 w-48 bg-purple-500/10 rounded-full mx-auto mb-6 animate-pulse" />
            <div className="h-12 w-80 bg-purple-500/10 rounded-lg mx-auto mb-4 animate-pulse" />
            <div className="h-6 w-64 bg-white/5 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <ShimmerCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0a0014, #120826, #0a0014)" }}>
      <GlowOrb color="linear-gradient(135deg, #a855f7, #ec4899)" size={600} top="-5%" left="60%" />
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #8b5cf6)" size={500} top="25%" left="-10%" delay={3} />
      <GlowOrb color="linear-gradient(135deg, #ec4899, #f59e0b)" size={400} top="55%" left="80%" delay={5} />
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #06b6d4)" size={350} top="80%" left="15%" delay={7} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-8"
            animate={{ boxShadow: ["0 0 20px rgba(168,85,247,0.1)", "0 0 40px rgba(168,85,247,0.2)", "0 0 20px rgba(168,85,247,0.1)"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300 uppercase tracking-wider font-medium">Complete Edition - 2026</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-5">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Through The Veil
            </span>
          </h1>
          
          <h2 className="text-xl md:text-2xl text-white/60 mb-4 font-light">
            The Greatest Story Ever Stole?
          </h2>
          
          <p className="text-lg text-white/40 max-w-2xl mx-auto mb-3">
            A Journey Through Hidden History, Suppressed Truth, and Spiritual Warfare
          </p>
          
          <p className="text-purple-400 font-semibold mb-10 text-lg">By Jason Andrews</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/api/veil/pdf" download="Through-The-Veil.pdf">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-10 py-6 text-lg shadow-2xl shadow-purple-500/20 transition-all duration-300 hover:shadow-purple-500/40 hover:scale-[1.02]"
                data-testid="button-download-pdf-hero"
              >
                <Download className="w-5 h-5 mr-2" />
                Download PDF
              </Button>
            </a>
            <Button 
              onClick={() => handleReadOnline()}
              size="lg"
              variant="outline"
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 px-10 py-6 text-lg transition-all duration-300 hover:scale-[1.02] hover:border-purple-500/50"
              data-testid="button-read-online"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Read Online
            </Button>
          </div>
        </motion.div>

        <ScrollReveal className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bookStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="group"
              >
                <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-5 text-center transition-all duration-300 hover:border-purple-500/30 hover:bg-white/[0.06]" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
                  <stat.icon className={`w-7 h-7 ${stat.color} mx-auto mb-3 transition-transform duration-300 group-hover:scale-110`} />
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal className="mb-16" delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div 
                className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 h-full transition-all duration-300 hover:border-purple-500/20"
                style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <motion.div 
                    className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                    whileHover={{ rotate: 5 }}
                  >
                    <Headphones className="w-7 h-7 text-purple-400" />
                  </motion.div>
                  <div>
                    <h4 className="text-xl font-bold text-white">Listen to the Book</h4>
                    <p className="text-sm text-white/40">Free Audio with Adobe Reader</p>
                  </div>
                  <Badge className="ml-auto bg-green-500/20 text-green-400 border-green-500/30 hidden sm:flex">
                    <Sparkles className="w-3 h-3 mr-1" /> Free
                  </Badge>
                </div>
                
                <p className="text-white/60 mb-6 leading-relaxed">
                  Want to listen instead of read? Adobe Acrobat Reader has a built-in "Read Out Loud" feature that will read the entire book to you - completely free, works offline, no internet needed.
                </p>
                
                <div className="bg-black/20 rounded-xl p-5 mb-6 border border-white/5">
                  <h5 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    How to Listen:
                  </h5>
                  <ol className="space-y-3">
                    {[
                      "Download the PDF above and open it in Adobe Acrobat Reader",
                      <>Go to <strong className="text-purple-300">View → Read Out Loud → Activate Read Out Loud</strong></>,
                      <>Click <strong className="text-purple-300">"Read This Page Only"</strong> or <strong className="text-purple-300">"Read To End Of Document"</strong></>,
                      "Sit back and listen - works offline on any device!",
                    ].map((step, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 text-purple-300 flex items-center justify-center text-xs font-bold border border-purple-500/20">{i + 1}</span>
                        <span className="text-white/50 text-sm pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="https://get.adobe.com/reader/" target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 py-5 text-sm shadow-lg transition-all duration-300 hover:scale-[1.02]">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Get Adobe Reader (Free)
                    </Button>
                  </a>
                  <a href="/api/veil/pdf" download="Through-The-Veil.pdf" className="flex-1">
                    <Button variant="outline" className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10 py-5 text-sm transition-all duration-300 hover:scale-[1.02]">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <motion.div 
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-red-500/20"
                style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30">
                    <FileText className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">PDF</h4>
                    <p className="text-xs text-white/40">Desktop & Print</p>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-5">
                  {["Complete edition", "163+ scripture refs", "Print-ready"].map(item => (
                    <li key={item} className="flex items-center gap-3 text-white/50 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                
                <a href="/api/veil/pdf" download="Through-The-Veil.pdf" className="block">
                  <Button className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 py-4 text-sm shadow-lg transition-all duration-300 hover:scale-[1.02]" data-testid="button-download-pdf">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </a>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-cyan-500/20"
                style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                    <Smartphone className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">EPUB</h4>
                    <p className="text-xs text-white/40">E-readers & Mobile</p>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-5">
                  {["Complete edition", "Mobile optimized", "Kindle/Kobo/Nook"].map(item => (
                    <li key={item} className="flex items-center gap-3 text-white/50 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                
                <a href="/api/veil/epub" download="Through-The-Veil.epub" className="block">
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 py-4 text-sm shadow-lg transition-all duration-300 hover:scale-[1.02]" data-testid="button-download-epub">
                    <Download className="w-4 h-4 mr-2" />
                    Download EPUB
                  </Button>
                </a>
              </motion.div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal className="mb-16" delay={0.15}>
          <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
                  <Scroll className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Table of Contents</h3>
                  <p className="text-sm text-white/40">44 chapters across 4 parts + appendices</p>
                </div>
              </div>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 hidden sm:flex">
                <Eye className="w-3 h-3 mr-1" /> Interactive
              </Badge>
            </div>
            
            <div className="space-y-3">
              {tableOfContents.map((section, sIdx) => (
                <motion.div 
                  key={section.title} 
                  className="border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-purple-500/20"
                  style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}
                  layout
                >
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.03] transition-all duration-300 group"
                    data-testid={`toc-section-${section.title.replace(/\s+/g, '-').toLowerCase()}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-xs font-bold text-purple-300 border border-purple-500/20">
                        {sIdx + 1}
                      </span>
                      <span className="text-lg font-semibold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                        {section.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-white/30 hidden sm:block">{section.chapters.length} chapters</span>
                      <motion.div
                        animate={{ rotate: expandedSections.includes(section.title) ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-5 h-5 text-white/40 group-hover:text-purple-400 transition-colors" />
                      </motion.div>
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {expandedSections.includes(section.title) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-white/10"
                      >
                        {section.chapters.map((chapter, idx) => (
                          <motion.button
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => handleReadOnline(chapter.anchor)}
                            className="w-full flex items-center justify-between p-4 pl-6 text-left hover:bg-purple-500/5 transition-all duration-300 border-b border-white/5 last:border-b-0 group/ch"
                            data-testid={`toc-chapter-${chapter.anchor}`}
                          >
                            <div className="flex-1 min-w-0">
                              <span className="text-white/80 font-medium text-sm block group-hover/ch:text-purple-300 transition-colors">{chapter.name}</span>
                              <span className="text-white/30 text-xs mt-0.5 block truncate">{chapter.description}</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-white/10 group-hover/ch:text-purple-400 transition-all duration-300 group-hover/ch:translate-x-1 ml-3 shrink-0" />
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal className="mb-16" delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-purple-500/20"
              style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}
            >
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 w-fit mb-4 border border-purple-500/20">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Deeply Researched</h3>
              <p className="text-white/40 text-sm leading-relaxed">
                Cross-referenced with Dead Sea Scrolls, Book of Enoch, historical records, and 163+ scripture citations.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-cyan-500/20"
              style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}
            >
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 w-fit mb-4 border border-cyan-500/20">
                <Quote className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Personal Testimony</h3>
              <p className="text-white/40 text-sm leading-relaxed">
                Raw, honest storytelling interwoven with historical investigation. Not hiding behind academia — standing in truth.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-pink-500/20"
              style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}
            >
              <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 w-fit mb-4 border border-pink-500/20">
                <Star className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Free Forever</h3>
              <p className="text-white/40 text-sm leading-relaxed">
                This book will always be free. Truth shouldn't have a price tag. Download, share, and pass it on.
              </p>
            </motion.div>
          </div>
        </ScrollReveal>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <p className="text-white/20 text-sm">
            All glory to Yahuah, the Most High. HalleluYah.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
