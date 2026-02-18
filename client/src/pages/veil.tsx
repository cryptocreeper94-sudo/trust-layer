import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, Download, FileText, Smartphone, ChevronDown, ChevronRight, 
  Headphones, ExternalLink, Sparkles, ScrollText, Eye, Star, Quote,
  Shield, Clock, Users, Layers, Flame, BookMarked, Feather, Crown
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

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

function FloatingOrb({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${className}`}
      animate={{
        y: [0, -20, 0],
        scale: [1, 1.05, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

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
    document.title = "Through The Veil | The Greatest Story Ever Stole?";
    let manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    if (manifestLink) manifestLink.href = '/manifest-veil.webmanifest';
    let themeColor = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
    if (themeColor) themeColor.content = '#a855f7';
    let appleTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]') as HTMLMetaElement;
    if (appleTitle) appleTitle.content = 'Through The Veil';
    let appleIcon = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement;
    if (appleIcon) appleIcon.href = '/icons/veil-192x192.png';
    return () => {
      if (manifestLink) manifestLink.href = '/manifest.webmanifest';
      if (themeColor) themeColor.content = '#00ffff';
      if (appleTitle) appleTitle.content = 'Trust Layer';
      if (appleIcon) appleIcon.href = '/icons/icon-192x192.png';
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <FloatingOrb className="top-20 left-10 w-96 h-96 bg-purple-500/10 blur-3xl" delay={0} />
      <FloatingOrb className="bottom-40 right-10 w-80 h-80 bg-cyan-500/8 blur-3xl" delay={2} />
      <FloatingOrb className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 blur-3xl" delay={4} />
      <FloatingOrb className="top-[30%] right-[20%] w-64 h-64 bg-amber-500/5 blur-3xl" delay={6} />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-20 relative z-10">

        <motion.section
          variants={stagger}
          initial="hidden"
          animate="show"
          className="text-center mb-20 sm:mb-28 max-w-4xl mx-auto"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500/15 to-cyan-500/15 border border-purple-500/20 backdrop-blur-sm mb-8 sm:mb-10">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="text-xs sm:text-sm text-slate-300 uppercase tracking-[0.15em] font-medium">Complete Edition — 2026</span>
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
          </motion.div>

          <motion.div variants={fadeUp} className="relative mb-8 sm:mb-10">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-pink-500/10 blur-3xl rounded-full" />
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold leading-[0.95] relative">
              <span className="bg-gradient-to-r from-purple-300 via-cyan-300 to-pink-300 bg-clip-text text-transparent drop-shadow-2xl">
                Through The Veil
              </span>
            </h1>
          </motion.div>

          <motion.h2 variants={fadeUp} className="text-xl sm:text-2xl lg:text-3xl text-slate-400 mb-8 sm:mb-10 font-light tracking-wide">
            The Greatest Story Ever Stole?
          </motion.h2>

          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-purple-500/50" />
            <Feather className="w-4 h-4 text-purple-400/60" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-cyan-500/50" />
          </motion.div>

          <motion.p variants={fadeUp} className="text-base sm:text-lg text-slate-300/80 max-w-xl mx-auto mb-4 leading-relaxed">
            A Journey Through Hidden History, Suppressed Truth, and Spiritual Warfare
          </motion.p>

          <motion.p variants={fadeUp} className="text-purple-300 font-semibold text-lg mb-10 sm:mb-12">By Jason Andrews</motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => handleReadOnline()}
              size="lg"
              className="relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all hover:scale-[1.02] active:scale-[0.98] group"
              data-testid="button-read-online"
            >
              <div className="absolute inset-0 rounded-md bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <BookOpen className="w-5 h-5 mr-2 relative z-10" />
              <span className="relative z-10">Read Online — Free</span>
            </Button>
            <a href="/api/veil/pdf" download="Through-The-Veil.pdf" data-testid="link-download-pdf-hero">
              <Button
                size="lg"
                variant="outline"
                className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/50 px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg w-full backdrop-blur-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                data-testid="button-download-pdf-hero"
              >
                <Download className="w-5 h-5 mr-2" />
                Download PDF
              </Button>
            </a>
          </motion.div>
        </motion.section>

        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-20 sm:mb-28 max-w-4xl mx-auto"
        >
          {[
            { icon: ScrollText, label: "44+ Chapters", sub: "Complete Edition", color: "text-cyan-400", glow: "shadow-cyan-500/20" },
            { icon: Shield, label: "163+ Scriptures", sub: "Cited & Referenced", color: "text-purple-400", glow: "shadow-purple-500/20" },
            { icon: Layers, label: "5 Parts", sub: "Evidence to Journey", color: "text-pink-400", glow: "shadow-pink-500/20" },
            { icon: Star, label: "Free Forever", sub: "Always Free Here", color: "text-amber-400", glow: "shadow-amber-500/20" },
          ].map((stat) => (
            <motion.div key={stat.label} variants={fadeUp}>
              <GlassCard glow className={`p-5 sm:p-7 text-center h-full hover:scale-[1.03] transition-transform duration-300 shadow-lg ${stat.glow}`}>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                </div>
                <p className="text-white font-bold text-sm sm:text-base">{stat.label}</p>
                <p className="text-slate-500 text-xs mt-1.5">{stat.sub}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.section>

        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-20 sm:mb-28 max-w-6xl mx-auto"
        >
          <motion.div variants={fadeUp} className="lg:col-span-2">
            <GlassCard className="p-6 sm:p-10 h-full relative overflow-hidden group" glow>
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <motion.div 
                  className="p-3.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex-shrink-0 shadow-lg shadow-purple-500/10"
                  whileHover={{ rotate: [0, -5, 5, 0], scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                >
                  <Headphones className="w-6 h-6 text-purple-400" />
                </motion.div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Listen to the Book</h3>
                  <p className="text-sm text-slate-400 mt-1">Free Audio with Adobe Reader</p>
                </div>
              </div>

              <p className="text-slate-300 mb-8 leading-relaxed text-sm sm:text-base relative z-10">
                Want to listen instead of read? Adobe Acrobat Reader has a built-in "Read Out Loud" feature that will read the entire book to you — completely free, works offline, no internet needed.
              </p>

              <div className="bg-slate-900/60 rounded-xl p-5 sm:p-8 mb-8 border border-white/5 relative z-10 backdrop-blur-sm">
                <h4 className="text-white font-semibold mb-5 text-sm sm:text-base flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  How to Listen:
                </h4>
                <ol className="space-y-4 text-slate-300">
                  {[
                    "Download the PDF above and open it in Adobe Acrobat Reader",
                    <>Go to <strong className="text-white">View → Read Out Loud → Activate Read Out Loud</strong></>,
                    <>Click <strong className="text-white">"Read This Page Only"</strong> or <strong className="text-white">"Read To End Of Document"</strong></>,
                    "Sit back and listen — works offline on any device!",
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-purple-500/30 to-cyan-500/30 text-purple-300 flex items-center justify-center text-xs font-bold mt-0.5 border border-purple-500/20 shadow-sm shadow-purple-500/10">
                        {i + 1}
                      </span>
                      <span className="text-sm leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 relative z-10">
                <a href="https://get.adobe.com/reader/" target="_blank" rel="noopener noreferrer" className="flex-1" data-testid="link-adobe-reader">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 py-5 text-sm sm:text-base shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all" data-testid="button-adobe-reader">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Get Adobe Reader (Free)
                  </Button>
                </a>
                <a href="/api/veil/pdf" download="Through-The-Veil.pdf" className="flex-1" data-testid="link-download-pdf-listen">
                  <Button variant="outline" className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10 py-5 text-sm sm:text-base" data-testid="button-download-pdf-listen">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </a>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col gap-6">
            <GlassCard className="p-6 sm:p-8 flex-1 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300" glow>
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-red-500/15 transition-colors" />
              <div className="flex items-center gap-3.5 mb-6 relative z-10">
                <div className="p-3 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex-shrink-0 shadow-lg shadow-red-500/10">
                  <FileText className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-white">PDF Download</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Desktop & Print</p>
                </div>
              </div>

              <ul className="space-y-3 mb-6 text-slate-300 relative z-10">
                {["Complete edition", "163+ scripture refs", "Print-ready format"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 flex-shrink-0 shadow-sm shadow-cyan-500/30" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>

              <a href="/api/veil/pdf" download="Through-The-Veil.pdf" className="block relative z-10" data-testid="link-download-pdf-card">
                <Button className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 py-5 text-sm shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all" data-testid="button-download-pdf-card">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </a>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8 flex-1 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300" glow>
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/15 transition-colors" />
              <div className="flex items-center gap-3.5 mb-6 relative z-10">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex-shrink-0 shadow-lg shadow-cyan-500/10">
                  <Smartphone className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-white">EPUB Download</h4>
                  <p className="text-xs text-slate-500 mt-0.5">E-readers & Mobile</p>
                </div>
              </div>

              <ul className="space-y-3 mb-6 text-slate-300 relative z-10">
                {["Complete edition", "Mobile optimized", "Kindle / Kobo / Nook"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex-shrink-0 shadow-sm shadow-purple-500/30" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>

              <a href="/api/veil/epub" download="Through-The-Veil.epub" className="block relative z-10" data-testid="link-download-epub-card">
                <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 py-5 text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all" data-testid="button-download-epub-card">
                  <Download className="w-4 h-4 mr-2" />
                  Download EPUB
                </Button>
              </a>
            </GlassCard>
          </motion.div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 sm:mb-28 max-w-4xl mx-auto"
        >
          <div className="text-center mb-10 sm:mb-12">
            <Badge variant="outline" className="border-purple-500/30 text-purple-400 mb-5 backdrop-blur-sm">
              <ScrollText className="w-3.5 h-3.5 mr-1.5" />
              Full Table of Contents
            </Badge>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">What's Inside</h3>
          </div>

          <GlassCard className="p-4 sm:p-8" glow>
            <div className="space-y-3">
              {tableOfContents.map((section, sectionIdx) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: sectionIdx * 0.05 }}
                  className="border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 group/section"
                >
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-white/[0.03] transition-all duration-300"
                    data-testid={`toc-section-${section.title.replace(/\s+/g, '-').toLowerCase()}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover/section:shadow-md group-hover/section:shadow-purple-500/10 transition-shadow">
                        <BookMarked className="w-4 h-4 text-purple-400" />
                      </div>
                      <span className="text-base sm:text-lg font-semibold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                        {section.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="border-white/10 text-slate-500 text-[10px] hidden sm:inline-flex">
                        {section.chapters.length} chapters
                      </Badge>
                      <motion.div
                        animate={{ rotate: expandedSections.includes(section.title) ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-5 h-5 text-slate-500 group-hover/section:text-purple-400 transition-colors" />
                      </motion.div>
                    </div>
                  </button>

                  {expandedSections.includes(section.title) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-white/5"
                    >
                      {section.chapters.map((chapter, idx) => (
                        <motion.button
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.04 }}
                          onClick={() => handleReadOnline(chapter.anchor)}
                          className="w-full flex items-start gap-3 p-4 sm:p-5 text-left hover:bg-gradient-to-r hover:from-purple-500/5 hover:to-transparent transition-all duration-300 border-b border-white/[0.03] last:border-b-0 group/ch"
                          data-testid={`toc-chapter-${chapter.anchor}`}
                        >
                          <div className="w-1 h-8 rounded-full bg-gradient-to-b from-purple-500/40 to-transparent flex-shrink-0 mt-0.5 group-hover/ch:from-purple-400 group-hover/ch:to-cyan-400/40 transition-all" />
                          <div>
                            <span className="text-white font-medium text-sm sm:text-base group-hover/ch:text-purple-200 transition-colors">{chapter.name}</span>
                            <span className="text-slate-500 text-xs sm:text-sm block mt-1 leading-relaxed">{chapter.description}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0 mt-1 opacity-0 group-hover/ch:opacity-100 group-hover/ch:text-purple-400 transition-all" />
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-20 sm:mb-28 max-w-3xl mx-auto"
        >
          <GlassCard className="p-10 sm:p-14 lg:p-20 text-center relative overflow-hidden" glow>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
            <div className="absolute top-6 left-8 opacity-10">
              <Quote className="w-14 h-14 text-purple-400" />
            </div>
            <div className="absolute bottom-6 right-8 opacity-10 rotate-180">
              <Quote className="w-14 h-14 text-cyan-400" />
            </div>
            <div className="relative z-10">
              <p className="text-lg sm:text-xl lg:text-2xl text-slate-200 leading-relaxed italic mb-8">
                "I do not add to Scripture. I do not take away from it. I simply illuminate what is already written."
              </p>
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-8 h-px bg-gradient-to-r from-transparent to-purple-500/50" />
                <Feather className="w-4 h-4 text-purple-400/60" />
                <div className="w-8 h-px bg-gradient-to-l from-transparent to-cyan-500/50" />
              </div>
              <p className="text-purple-300 font-semibold">— Jason Andrews</p>
            </div>
          </GlassCard>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-5">Ready to Begin?</h3>
          <p className="text-slate-400 mb-8 sm:mb-10 leading-relaxed">
            Start reading online for free, or download your copy in PDF or EPUB format.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => handleReadOnline()}
              size="lg"
              className="relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all hover:scale-[1.02] active:scale-[0.98] group"
              data-testid="button-read-online-bottom"
            >
              <div className="absolute inset-0 rounded-md bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <Eye className="w-5 h-5 mr-2 relative z-10" />
              <span className="relative z-10">Start Reading</span>
            </Button>
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16 pb-4"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-purple-500/30" />
            <div className="w-1 h-1 rounded-full bg-purple-400/40" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-purple-500/30" />
          </div>
          <p className="text-slate-600 text-sm">
            All glory to Yahuah, the Most High. HalleluYah.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
