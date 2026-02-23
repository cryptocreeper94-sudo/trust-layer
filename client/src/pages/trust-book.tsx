import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  BookOpen, Headphones, Download, Shield, Sparkles,
  Eye, Star, ArrowRight, Mic, Wifi, Globe, Users,
  FileText, Smartphone, Lock, Zap, ChevronRight,
  BookMarked, Volume2, Layers, Award, Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";

const heroImg = "/images/trust-book-hero.png";
const featuredImg = "/images/trust-book-featured.png";
const readerImg = "/images/trust-book-reader.png";
const audioImg = "/images/trust-book-audio.png";

const PLATFORM_FEATURES = [
  {
    icon: BookOpen,
    title: "Immersive E-Reader",
    desc: "Full-screen reading experience with adjustable fonts, themes, and progress tracking across all devices.",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    icon: Headphones,
    title: "AI Narration",
    desc: "Every book narrated by premium AI voices. Listen while you commute, exercise, or unwind.",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    icon: Download,
    title: "Multi-Format",
    desc: "Read online, download PDF, or export EPUB. Your library, your format, your choice.",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: Smartphone,
    title: "Mobile-First PWA",
    desc: "Install on any device. Works offline. True app experience without the app store.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: Shield,
    title: "Blockchain Verified",
    desc: "Every publication timestamped on the Trust Layer blockchain. Provenance you can verify.",
    gradient: "from-red-500 to-rose-600",
  },
  {
    icon: Users,
    title: "Author Publishing",
    desc: "Publish your own work. Transparent royalties tracked on-chain. No gatekeepers.",
    gradient: "from-indigo-500 to-violet-600",
  },
];

const READER_STATS = [
  { value: "107K+", label: "Words", icon: FileText },
  { value: "54+", label: "Chapters", icon: BookMarked },
  { value: "15", label: "Volumes", icon: Layers },
  { value: "Free", label: "To Read", icon: Heart },
];

const TESTIMONIALS = [
  { text: "This changes everything you thought you knew.", rating: 5 },
  { text: "Documentary-style investigation at its finest.", rating: 5 },
  { text: "The dots connect in ways you never imagined.", rating: 5 },
];

export default function TrustBook() {
  useEffect(() => {
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) manifestLink.setAttribute("href", "/manifest-trustbook.webmanifest");
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute("content", "#06b6d4");
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Trust Book Library"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/80 to-slate-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5" />
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/30 text-white text-sm backdrop-blur-sm" data-testid="badge-trust-book">
            <BookOpen className="w-4 h-4 mr-2 text-cyan-400" />
            DarkWave Publishing
          </Badge>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-display font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
              Trust
            </span>
            <br />
            <span className="text-white drop-shadow-2xl">Book</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-8 leading-relaxed">
            The premium publishing platform for truth-seekers. Read, listen, and discover 
            books that challenge everything you thought you knew.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/veil">
              <Button
                size="lg"
                className="h-14 px-8 text-base gap-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 shadow-2xl shadow-cyan-500/25 rounded-xl"
                data-testid="button-read-featured"
              >
                <Eye className="w-5 h-5" />
                Read Featured Book
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/veil/read">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base gap-2 border-white/20 text-white hover:bg-white/5 rounded-xl"
                data-testid="button-open-reader"
              >
                <BookOpen className="w-5 h-5" />
                Open E-Reader
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronRight className="w-6 h-6 text-white/30 rotate-90" />
        </motion.div>
      </div>

      <section className="py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 px-3 py-1.5 bg-amber-500/10 border-amber-500/30 text-amber-400 text-xs">
              <Star className="w-3 h-3 mr-1" />
              Featured Publication
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black mb-4">
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Through The Veil
              </span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto text-sm sm:text-base">
              A 107,000-word investigation into the hidden architecture of history.
              54+ chapters. 15 volumes. Zero prescriptive claims.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 lg:row-span-2"
            >
              <GlassCard glow>
                <div className="relative h-full min-h-[400px] overflow-hidden rounded-xl">
                  <img
                    src={featuredImg}
                    alt="Through The Veil"
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                  <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-end h-full">
                    <Badge className="w-fit mb-4 bg-cyan-500/20 border-cyan-500/30 text-cyan-400 text-xs">
                      <Sparkles className="w-3 h-3 mr-1" /> Launch Title
                    </Badge>
                    <h3 className="text-2xl sm:text-3xl font-display font-black text-white mb-3">
                      Through The Veil
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-lg">
                      What if the most important name in history was deliberately changed — and the evidence
                      has been hiding in plain sight for centuries? This investigation follows the thread from
                      ancient texts to modern institutions, presenting the dots and letting you connect them.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {["Hidden History", "Ancient Texts", "Institutional Power", "Name Changes", "Documentary"].map(tag => (
                        <span key={tag} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link href="/veil/read">
                        <Button className="gap-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500" data-testid="button-read-now">
                          <BookOpen className="w-4 h-4" /> Read Free
                        </Button>
                      </Link>
                      <Link href="/veil">
                        <Button variant="outline" className="gap-2 border-white/20 text-white hover:bg-white/5" data-testid="button-learn-more-veil">
                          <Eye className="w-4 h-4" /> Learn More
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {READER_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <GlassCard glow={i === 0}>
                  <div className="p-5 flex flex-col items-center justify-center text-center h-full min-h-[140px]">
                    <stat.icon className="w-6 h-6 text-cyan-400 mb-3" />
                    <div className="text-3xl font-display font-black text-white mb-1">{stat.value}</div>
                    <div className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.02] to-transparent" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-black mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                A Reading Experience
              </span>
              <br />
              <span className="text-white">Like No Other</span>
            </h2>
            <p className="text-white/50 max-w-lg mx-auto text-sm">
              Built for truth-seekers who demand more from their reading platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PLATFORM_FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard glow={i < 2}>
                  <div className="p-5 sm:p-6 h-full flex flex-col">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed flex-1">{feature.desc}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard glow>
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={readerImg}
                    alt="Trust Book E-Reader"
                    className="w-full h-64 sm:h-80 object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-display font-bold text-white mb-2">Read Anywhere</h3>
                    <p className="text-sm text-white/60">
                      Premium e-reader built for mobile. Dark theme, adjustable text, 
                      chapter navigation, bookmarks, and progress sync across devices.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard glow>
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={audioImg}
                    alt="AI Audio Narration"
                    className="w-full h-64 sm:h-80 object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <Volume2 className="w-4 h-4 text-purple-400" />
                      </div>
                      <Badge className="bg-purple-500/20 border-purple-500/30 text-purple-400 text-xs">
                        AI-Powered
                      </Badge>
                    </div>
                    <h3 className="text-xl font-display font-bold text-white mb-2">Listen Instead</h3>
                    <p className="text-sm text-white/60">
                      Every chapter narrated by premium AI voices. Play chapter-by-chapter 
                      or continuous listening mode. Perfect for commutes and workouts.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/[0.03] to-transparent" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <GlassCard glow>
              <div className="p-8 sm:p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/30">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-black mb-4">
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Publish Your Truth
                  </span>
                </h2>
                <p className="text-white/50 max-w-lg mx-auto mb-8 leading-relaxed">
                  Trust Book is more than a reading platform — it's a publishing platform for authors 
                  who refuse to be silenced. Transparent royalties tracked on the Trust Layer blockchain. 
                  No censorship. No gatekeepers.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {[
                    { icon: Lock, label: "Censorship-Free", desc: "Publish without fear" },
                    { icon: Zap, label: "Instant Publishing", desc: "Upload and go live" },
                    { icon: Globe, label: "Global Reach", desc: "Readers worldwide" },
                  ].map((item) => (
                    <div key={item.label} className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <item.icon className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                      <div className="text-sm font-bold text-white">{item.label}</div>
                      <div className="text-xs text-white/40">{item.desc}</div>
                    </div>
                  ))}
                </div>
                <Badge className="bg-purple-500/10 border-purple-500/30 text-purple-400 text-xs mb-6">
                  <Sparkles className="w-3 h-3 mr-1" /> Author Portal Coming Soon
                </Badge>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      <section className="py-16 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white mb-3">
              What Readers Are Saying
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <GlassCard>
                  <div className="p-5 text-center">
                    <div className="flex justify-center gap-1 mb-3">
                      {[...Array(t.rating)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-white/70 italic">"{t.text}"</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-black mb-4">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Start Reading Now
              </span>
            </h2>
            <p className="text-white/50 max-w-md mx-auto mb-8">
              "Through The Veil" is available free on Trust Book. 
              107,000 words of investigation. Zero cost.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/veil/read">
                <Button
                  size="lg"
                  className="h-14 px-10 text-base gap-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 shadow-2xl shadow-cyan-500/25 rounded-xl"
                  data-testid="button-start-reading"
                >
                  <BookOpen className="w-5 h-5" />
                  Open E-Reader
                </Button>
              </Link>
              <Link href="/veil">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-10 text-base gap-2 border-white/20 text-white hover:bg-white/5 rounded-xl"
                  data-testid="button-explore-veil"
                >
                  <Eye className="w-5 h-5" />
                  Book Details
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span className="font-display font-bold text-white">Trust Book</span>
          </div>
          <p className="text-xs text-white/30 mb-2">
            A DarkWave Trust Layer Publishing Platform
          </p>
          <p className="text-xs text-white/20">
            &copy; {new Date().getFullYear()} DarkWave Studios. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
