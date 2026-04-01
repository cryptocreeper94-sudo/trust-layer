import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/* ── Chapter data ── */
const CHAPTERS = [
  { num: 1, title: "The Problem Nobody Talks About", desc: "Why 64% of people who try programming quit — and why it's not their fault." },
  { num: 2, title: "What If You Could Just Say It?", desc: "The birth of English Mode. A compiler that understands human language." },
  { num: 3, title: "The Seven Layers of Understanding", desc: "How the Tolerance Chain resolves misspellings, slang, and ambiguity." },
  { num: 4, title: "Your First Creation", desc: "Build your first Lume program — no syntax to memorize." },
  { num: 5, title: "The Guardian at the Gate", desc: "Certified at Birth. Security scanning at the AST level." },
  { num: 6, title: "Speaking to Domains", desc: "Vertical applications — healthcare, finance, legal, and more." },
  { num: 7, title: "Certify What You Create", desc: "Tamper-evident certificates and blockchain provenance." },
  { num: 8, title: "The Ecosystem", desc: "Trust Layer, Signal Chat, TrustGen, and the connected platform." },
  { num: 9, title: "Voice", desc: "Speak your code. The final frontier of zero cognitive distance." },
  { num: 10, title: "What Comes Next", desc: "The roadmap. Synthetic organisms and beyond." },
];

const STATS = [
  { value: "10", label: "Chapters" },
  { value: "38K", label: "Words" },
  { value: "Free", label: "To Read" },
  { value: "2026", label: "Published" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

export default function SpeakingCode() {
  const [, navigate] = useLocation();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#07080f] text-white overflow-x-hidden">
      {/* ── Ambient background ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-[100px]" />
      </div>

      {/* ── Hero Section ── */}
      <section className="relative z-10 pt-20 pb-16 px-6 text-center max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Badge variant="outline" className="mb-6 border-cyan-500/30 text-cyan-400 bg-cyan-500/5 px-4 py-1.5">
            ◈ A DarkWave Studios Publication
          </Badge>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}
        >
          Speaking{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-300 bg-clip-text text-transparent">
            Code
          </span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-4 leading-relaxed"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
        >
          How an AI-Native Language Made Programming Human Again
        </motion.p>

        <motion.p
          className="text-sm text-white/30 mb-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}
        >
          By Jason — Founder, DarkWave Studios LLC
        </motion.p>

        {/* ── Stats strip ── */}
        <motion.div
          className="flex justify-center gap-6 md:gap-10 mb-12 flex-wrap"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}
        >
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                {s.value}
              </div>
              <div className="text-xs text-white/40 uppercase tracking-wider mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* ── CTA Buttons ── */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-bold px-8 py-6 text-base rounded-xl shadow-lg shadow-cyan-500/20"
            onClick={() => window.open("https://lume-lang.org/audiobook-reader.html", "_blank")}
          >
            📖 Read Now — Free
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 px-8 py-6 text-base rounded-xl"
            onClick={() => navigate("/")}
          >
            ← Back to Trust Layer
          </Button>
        </motion.div>
      </section>

      {/* ── Book Description ── */}
      <section className="relative z-10 px-6 py-16 max-w-4xl mx-auto">
        <GlassCard glow className="p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              The Story Behind the Language
            </span>
          </h2>
          <div className="space-y-4 text-white/60 leading-relaxed">
            <p>
              Everyone has ideas. Most people can describe what they want a computer to do —
              in plain English. But the moment they sit down to build it, they hit a wall.
              Syntax errors, cryptic documentation, and tooling that was designed for experts.
            </p>
            <p>
              <strong className="text-white/80">Speaking Code</strong> tells the story of Lume — the first programming language
              where you can say <em>"get the user's name from the database and show it on the screen"</em> and
              the compiler understands. Not through AI generation. Not through prompting. Through direct compilation
              of human language.
            </p>
            <p>
              This book walks you through every milestone, every design decision, and every breakthrough
              that made Lume possible — from the 7-Layer Tolerance Chain to Certified-at-Birth security,
              from Voice-to-Code to the Self-Sustaining Runtime.
            </p>
          </div>
        </GlassCard>
      </section>

      {/* ── Chapter List ── */}
      <section className="relative z-10 px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Table of Contents
          </span>
        </h2>
        <div className="grid gap-4">
          {CHAPTERS.map((ch, i) => (
            <motion.div
              key={ch.num}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeUp}
            >
              <GlassCard className="p-5 hover:border-cyan-500/30 transition-all duration-300 cursor-default group">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm">
                    {ch.num}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white/90 group-hover:text-cyan-400 transition-colors">
                      {ch.title}
                    </h3>
                    <p className="text-sm text-white/40 mt-1">{ch.desc}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Who Is This For ── */}
      <section className="relative z-10 px-6 py-16 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: "💡", title: "Non-Programmers", desc: "You have ideas but no way to build them. This book shows you how Lume bridges that gap." },
            { icon: "🔧", title: "Developers", desc: "Tired of boilerplate? See how AI-as-syntax and self-healing functions change everything." },
            { icon: "🏢", title: "Founders & Leaders", desc: "Understand why cognitive distance is the real bottleneck — and how Lume eliminates it." },
          ].map((item, i) => (
            <motion.div
              key={i} custom={i}
              initial="hidden" whileInView="visible"
              viewport={{ once: true }} variants={fadeUp}
            >
              <GlassCard glow className="p-6 text-center h-full">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-white/90 mb-2">{item.title}</h3>
                <p className="text-sm text-white/50">{item.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Ecosystem Banner ── */}
      <section className="relative z-10 px-6 py-16 max-w-4xl mx-auto text-center">
        <GlassCard glow className="p-8 md:p-12">
          <div className="text-sm uppercase tracking-widest text-cyan-400/60 mb-4">Part of the Trust Layer Ecosystem</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white/90">
            Read it. Build with it. Own your code.
          </h2>
          <p className="text-white/50 max-w-xl mx-auto mb-8">
            Speaking Code is free to read online. The language it describes — Lume — is live and compiling today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-bold px-8 rounded-xl"
              onClick={() => window.open("https://lume-lang.org/audiobook-reader.html", "_blank")}
            >
              📖 Read Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 rounded-xl"
              onClick={() => window.open("https://lume-lang.org", "_blank")}
            >
              Explore Lume →
            </Button>
          </div>
        </GlassCard>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 px-6 py-12 text-center border-t border-white/5">
        <div className="text-xs text-white/20">
          © 2026 DarkWave Studios LLC · Speaking Code · Part of the Trust Layer Ecosystem
        </div>
      </footer>
    </div>
  );
}
