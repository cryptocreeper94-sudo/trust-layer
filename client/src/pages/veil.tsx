import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, Download, FileText, Smartphone, ChevronDown, ChevronRight, 
  Headphones, ExternalLink, Sparkles, ScrollText, Eye, Star, Quote,
  Shield, Clock, Users, Layers
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
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

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
      <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-40 right-10 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 pt-24 pb-20 relative z-10">

        {/* ── HERO ── */}
        <motion.section
          variants={stagger}
          initial="hidden"
          animate="show"
          className="text-center mb-20 max-w-4xl mx-auto px-2"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-white/10 mb-10">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-slate-300 uppercase tracking-wider font-medium">Complete Edition — 2026</span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Through The Veil
            </span>
          </motion.h1>

          <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl text-slate-400 mb-10 font-light">
            The Greatest Story Ever Stole?
          </motion.h2>

          <motion.p variants={fadeUp} className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-4 leading-relaxed px-4">
            A Journey Through Hidden History, Suppressed Truth, and Spiritual Warfare
          </motion.p>

          <motion.p variants={fadeUp} className="text-cyan-400 font-semibold text-lg mb-12">By Jason Andrews</motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-5 justify-center px-4">
            <Button
              onClick={() => handleReadOnline()}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-10 py-7 text-lg shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all"
              data-testid="button-read-online"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Read Online — Free
            </Button>
            <a href="/api/veil/pdf" download="Through-The-Veil.pdf">
              <Button
                size="lg"
                variant="outline"
                className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 px-10 py-7 text-lg w-full"
              >
                <Download className="w-5 h-5 mr-2" />
                Download PDF
              </Button>
            </a>
          </motion.div>
        </motion.section>

        {/* ── STATS ROW ── */}
        <motion.section
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-20 max-w-4xl mx-auto"
        >
          {[
            { icon: ScrollText, label: "44+ Chapters", sub: "Complete Edition", color: "text-cyan-400" },
            { icon: Shield, label: "163+ Scriptures", sub: "Cited & Referenced", color: "text-purple-400" },
            { icon: Layers, label: "5 Parts", sub: "Evidence to Journey", color: "text-pink-400" },
            { icon: Star, label: "Free Forever", sub: "Always Free Here", color: "text-amber-400" },
          ].map((stat) => (
            <motion.div key={stat.label} variants={fadeUp}>
              <GlassCard className="p-6 sm:p-8 text-center h-full">
                <stat.icon className={`w-7 h-7 ${stat.color} mx-auto mb-4`} />
                <p className="text-white font-bold text-base sm:text-lg">{stat.label}</p>
                <p className="text-slate-400 text-xs sm:text-sm mt-1.5">{stat.sub}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.section>

        {/* ── BENTO GRID: Listen + Downloads ── */}
        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-20 max-w-6xl mx-auto"
        >
          {/* Listen — spans 2 cols */}
          <motion.div variants={fadeUp} className="lg:col-span-2">
            <GlassCard className="p-7 sm:p-10 lg:p-12 h-full" glow>
              <div className="flex items-center gap-5 mb-8">
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex-shrink-0">
                  <Headphones className="w-7 h-7 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Listen to the Book</h3>
                  <p className="text-sm text-slate-400 mt-1.5">Free Audio with Adobe Reader</p>
                </div>
              </div>

              <p className="text-slate-300 mb-8 leading-relaxed text-base">
                Want to listen instead of read? Adobe Acrobat Reader has a built-in "Read Out Loud" feature that will read the entire book to you — completely free, works offline, no internet needed.
              </p>

              <div className="bg-slate-900/60 rounded-xl p-6 sm:p-8 mb-8 border border-white/5">
                <h4 className="text-white font-semibold mb-5 text-base">How to Listen:</h4>
                <ol className="space-y-4 text-slate-300">
                  {[
                    "Download the PDF above and open it in Adobe Acrobat Reader",
                    <>Go to <strong className="text-white">View → Read Out Loud → Activate Read Out Loud</strong></>,
                    <>Click <strong className="text-white">"Read This Page Only"</strong> or <strong className="text-white">"Read To End Of Document"</strong></>,
                    "Sit back and listen — works offline on any device!",
                  ].map((step, i) => (
                    <li key={i} className="flex gap-4 items-start">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-sm sm:text-base leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <a href="https://get.adobe.com/reader/" target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-6 text-base">
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Get Adobe Reader (Free)
                  </Button>
                </a>
                <a href="/api/veil/pdf" download="Through-The-Veil.pdf" className="flex-1">
                  <Button variant="outline" className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10 py-6 text-base">
                    <Download className="w-5 h-5 mr-2" />
                    Download PDF
                  </Button>
                </a>
              </div>
            </GlassCard>
          </motion.div>

          {/* Download Cards — stacked in 1 col */}
          <motion.div variants={fadeUp} className="flex flex-col gap-6 sm:gap-8">
            {/* PDF Card */}
            <GlassCard className="p-7 sm:p-8 lg:p-10 flex-1" glow>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex-shrink-0">
                  <FileText className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">PDF Download</h4>
                  <p className="text-xs text-slate-400 mt-1">Desktop & Print</p>
                </div>
              </div>

              <ul className="space-y-3.5 mb-8 text-slate-300">
                {["Complete edition", "163+ scripture refs", "Print-ready format"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>

              <a href="/api/veil/pdf" download="Through-The-Veil.pdf" className="block">
                <Button className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 py-6 text-base">
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF
                </Button>
              </a>
            </GlassCard>

            {/* EPUB Card */}
            <GlassCard className="p-7 sm:p-8 lg:p-10 flex-1" glow>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex-shrink-0">
                  <Smartphone className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">EPUB Download</h4>
                  <p className="text-xs text-slate-400 mt-1">E-readers & Mobile</p>
                </div>
              </div>

              <ul className="space-y-3.5 mb-8 text-slate-300">
                {["Complete edition", "Mobile optimized", "Kindle / Kobo / Nook"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-purple-400 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>

              <a href="/api/veil/epub" download="Through-The-Veil.epub" className="block">
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 py-6 text-base">
                  <Download className="w-5 h-5 mr-2" />
                  Download EPUB
                </Button>
              </a>
            </GlassCard>
          </motion.div>
        </motion.section>

        {/* ── TABLE OF CONTENTS ── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5 }}
          className="mb-20 max-w-4xl mx-auto"
        >
          <div className="text-center mb-10">
            <Badge variant="outline" className="border-purple-500/30 text-purple-400 mb-5">
              <ScrollText className="w-3.5 h-3.5 mr-1.5" />
              Full Table of Contents
            </Badge>
            <h3 className="text-3xl sm:text-4xl font-bold text-white">What's Inside</h3>
          </div>

          <GlassCard className="p-7 sm:p-10 lg:p-12" glow>
            <div className="space-y-3">
              {tableOfContents.map((section) => (
                <div key={section.title} className="border border-white/10 rounded-xl overflow-hidden hover:border-white/15 transition-colors">
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-white/5 transition-colors"
                    data-testid={`toc-section-${section.title.replace(/\s+/g, '-').toLowerCase()}`}
                  >
                    <span className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      {section.title}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500">{section.chapters.length} chapters</span>
                      {expandedSections.includes(section.title) ? (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
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
                          className="w-full flex flex-col p-5 sm:p-6 text-left hover:bg-purple-500/10 transition-colors border-b border-white/5 last:border-b-0 group"
                          data-testid={`toc-chapter-${chapter.anchor}`}
                        >
                          <span className="text-white font-medium mb-1.5 group-hover:text-cyan-300 transition-colors">{chapter.name}</span>
                          <span className="text-slate-400 text-sm leading-relaxed">{chapter.description}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.section>

        {/* ── QUOTE / CALLOUT ── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mb-20 max-w-3xl mx-auto"
        >
          <GlassCard className="p-10 sm:p-12 lg:p-16 text-center relative overflow-hidden">
            <div className="absolute top-6 left-8 opacity-10">
              <Quote className="w-16 h-16 text-purple-400" />
            </div>
            <p className="text-xl sm:text-2xl text-slate-200 leading-relaxed italic mb-8 relative z-10">
              "I do not add to Scripture. I do not take away from it. I simply illuminate what is already written."
            </p>
            <p className="text-cyan-400 font-semibold relative z-10">— Jason Andrews</p>
          </GlassCard>
        </motion.section>

        {/* ── FOOTER CTA ── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12 px-4"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-5">Ready to Begin?</h3>
          <p className="text-slate-400 mb-10 leading-relaxed text-lg">
            Start reading online for free, or download your copy in PDF or EPUB format.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Button
              onClick={() => handleReadOnline()}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-10 py-7 text-lg shadow-lg shadow-purple-500/20"
              data-testid="button-read-online-bottom"
            >
              <Eye className="w-5 h-5 mr-2" />
              Start Reading
            </Button>
          </div>
        </motion.section>

        {/* ── FOOTER NOTE ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-20 pb-4"
        >
          <p className="text-slate-500 text-sm">
            All glory to Yahuah, the Most High. HalleluYah.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
