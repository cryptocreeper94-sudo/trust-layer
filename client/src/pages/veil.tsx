import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, FileText, Smartphone, ChevronDown, ChevronRight } from "lucide-react";

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

export default function Veil() {
  const [expandedSections, setExpandedSections] = useState<string[]>(["Part One: The Evidence"]);

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
    document.title = "Through The Veil | A Journey Through Hidden History";
    
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

    return () => {
      if (manifestLink) manifestLink.href = '/manifest.webmanifest';
      if (themeColor) themeColor.content = '#00ffff';
      if (appleTitle) appleTitle.content = 'Trust Layer';
      if (appleIcon) appleIcon.href = '/icons/icon-192x192.png';
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-16 relative z-10">
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
          
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-4">
            A Journey Through Hidden History, Suppressed Truth, and Spiritual Warfare
          </p>
          
          <p className="text-cyan-400 font-medium mb-8">By Jason Andrews</p>

          <Button 
            onClick={() => handleReadOnline()}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-6 text-lg"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Read Online
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <GlassCard className="p-6 sm:p-8 max-w-3xl mx-auto" glow>
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Table of Contents</h3>
            
            <div className="space-y-2">
              {tableOfContents.map((section) => (
                <div key={section.title} className="border border-white/10 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                    data-testid={`toc-section-${section.title.replace(/\s+/g, '-').toLowerCase()}`}
                  >
                    <span className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      {section.title}
                    </span>
                    {expandedSections.includes(section.title) ? (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                  
                  {expandedSections.includes(section.title) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-white/10"
                    >
                      {section.chapters.map((chapter, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleReadOnline(chapter.anchor)}
                          className="w-full flex flex-col p-4 text-left hover:bg-purple-500/10 transition-colors border-b border-white/5 last:border-b-0"
                          data-testid={`toc-chapter-${chapter.anchor}`}
                        >
                          <span className="text-white font-medium mb-1">{chapter.name}</span>
                          <span className="text-slate-400 text-sm">{chapter.description}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Download the Complete Edition</h3>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <GlassCard className="p-6 sm:p-8" glow>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex-shrink-0">
                  <FileText className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">PDF Download</h4>
                  <p className="text-sm text-slate-400">Desktop & Print</p>
                </div>
              </div>
              
              <ul className="space-y-3 mb-6 text-slate-300">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0" />
                  <span>Complete edition</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0" />
                  <span>163+ scripture refs</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0" />
                  <span>Print-ready</span>
                </li>
              </ul>
              
              <a href="/assets/Through-The-Veil-EBOOK.pdf" download className="block">
                <Button className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 py-4">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </a>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8" glow>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex-shrink-0">
                  <Smartphone className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">EPUB Download</h4>
                  <p className="text-sm text-slate-400">E-readers & Mobile</p>
                </div>
              </div>
              
              <ul className="space-y-3 mb-6 text-slate-300">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-purple-400 flex-shrink-0" />
                  <span>Complete edition</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-purple-400 flex-shrink-0" />
                  <span>Mobile optimized</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-purple-400 flex-shrink-0" />
                  <span>Kindle/Kobo/Nook</span>
                </li>
              </ul>
              
              <a href="/api/veil/epub" download="Through-The-Veil.epub" className="block">
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 py-4">
                  <Download className="w-4 h-4 mr-2" />
                  Download EPUB
                </Button>
              </a>
            </GlassCard>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
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
