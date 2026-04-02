import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  BookOpen, FileText, Code, ArrowLeft, ExternalLink, Copy, Check,
  GraduationCap, Shield, Sparkles, Cpu, Globe, Terminal, Layers,
  ChevronRight, Zap, Lock, Users, Mic, Eye, Binary, Server,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";
import { SiteNav } from "@/components/site-nav";
import { Footer } from "@/components/footer";

function CodeBlock({ code, language = "lume", label }: { code: string; language?: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group my-4">
      {label && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] uppercase tracking-widest text-cyan-400/60 font-mono">{label}</span>
        </div>
      )}
      <div className="relative rounded-xl border border-white/10 bg-[#0a0b10] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02]">
          <span className="text-[10px] font-mono text-white/30">{language}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="text-white/30 hover:text-cyan-400 transition-colors"
              data-testid="button-copy-code"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <Link href="/studio">
              <button className="text-white/30 hover:text-purple-400 transition-colors text-[10px] font-mono flex items-center gap-1" data-testid="button-try-studio">
                <Terminal className="w-3 h-3" /> Try in Studio
              </button>
            </Link>
          </div>
        </div>
        <pre className="p-4 text-sm font-mono text-cyan-100/80 overflow-x-auto leading-relaxed whitespace-pre-wrap">
          {code}
        </pre>
      </div>
    </div>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-white/[0.03] border-b border-white/10">
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-cyan-400 uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-3 text-white/70 font-mono text-xs">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionHeading({ number, title, id }: { number: string; title: string; id: string }) {
  return (
    <h2 id={id} className="text-2xl sm:text-3xl font-display font-black mt-16 mb-6 scroll-mt-24">
      <span className="text-cyan-400 mr-3 font-mono text-lg">{number}</span>
      <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">{title}</span>
    </h2>
  );
}

function SubHeading({ number, title }: { number: string; title: string }) {
  return (
    <h3 className="text-xl font-bold mt-10 mb-4">
      <span className="text-purple-400 mr-2 font-mono text-sm">{number}</span>
      <span className="text-white">{title}</span>
    </h3>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return <p className="text-white/70 leading-relaxed mb-4 text-sm sm:text-base">{children}</p>;
}

function KeyClaim({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="my-6 pl-4 border-l-2 border-cyan-500/50 bg-cyan-500/5 rounded-r-xl py-4 pr-4">
      <p className="text-cyan-200/90 text-sm sm:text-base italic leading-relaxed">{children}</p>
    </blockquote>
  );
}

function TableOfContents({ sections, activeId }: { sections: { id: string; title: string; number: string }[]; activeId: string }) {
  return (
    <div className="hidden lg:block sticky top-24 w-56 xl:w-64 flex-shrink-0">
      <GlassCard>
        <div className="p-4">
          <p className="text-[10px] uppercase tracking-widest text-cyan-400/60 font-mono mb-3">Contents</p>
          <nav className="space-y-1">
            {sections.map(s => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`block text-xs py-1.5 px-2 rounded-lg transition-colors ${
                  activeId === s.id
                    ? "text-cyan-400 bg-cyan-500/10"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5"
                }`}
                data-testid={`toc-link-${s.id}`}
              >
                <span className="font-mono text-[10px] mr-1.5">{s.number}</span>
                {s.title}
              </a>
            ))}
          </nav>
        </div>
      </GlassCard>
    </div>
  );
}

const whitepaperSections = [
  { id: "wp-abstract", number: "§", title: "Abstract" },
  { id: "wp-intro", number: "1", title: "Introduction" },
  { id: "wp-background", number: "2", title: "Background" },
  { id: "wp-core", number: "3", title: "Core Language Design" },
  { id: "wp-english", number: "4", title: "English Mode" },
  { id: "wp-voice", number: "5", title: "Voice-to-Code" },
  { id: "wp-security", number: "6", title: "Security Model" },
  { id: "wp-runtime", number: "7", title: "Self-Sustaining Runtime" },
  { id: "wp-gaps", number: "8", title: "Gap Resolutions" },
  { id: "wp-advanced", number: "9", title: "Advanced Milestones" },
  { id: "wp-claims", number: "10", title: "Key Claims" },
];

const specSections = [
  { id: "sp-overview", number: "1", title: "Vision & Philosophy" },
  { id: "sp-syntax", number: "2", title: "Syntax Design" },
  { id: "sp-milestones", number: "3", title: "Milestone Roadmap" },
  { id: "sp-english", number: "4", title: "English Mode Pipeline" },
  { id: "sp-voice", number: "5", title: "Voice-to-Code" },
  { id: "sp-security", number: "6", title: "Security Architecture" },
  { id: "sp-gaps", number: "7", title: "Gap Resolutions" },
  { id: "sp-cli", number: "8", title: "CLI Reference" },
  { id: "sp-metrics", number: "9", title: "Key Metrics" },
];

function WhitepaperContent() {
  return (
    <article className="prose-invert max-w-none">
      <div id="wp-abstract" className="scroll-mt-24">
        <Badge className="mb-6 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
          <FileText className="w-3 h-3 mr-1" /> Academic Paper
        </Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black leading-tight mb-4">
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            LUME: Eliminating Cognitive Distance
          </span>
        </h1>
        <p className="text-white/50 text-sm mb-2">
          An Deterministic Natural-Language Programming Language with Natural Language Compilation, Voice Input, and Certified Security
        </p>
        <p className="text-white/40 text-xs font-mono mb-8">
          Authors: Jason (Trust Layer / DarkWave Systems Collective) · team@dwsc.io · lume-lang.com
        </p>

        <GlassCard>
          <div className="p-6">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">Abstract</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              We present Lume, an deterministic natural-language programming language whose compiler is architected from the ground up to accept imprecise, informal, and ambiguous natural language as valid source code. Unlike all existing programming languages, which require exact syntactic conformity, Lume's compilation pipeline employs a seven-layer Tolerance Chain that progressively resolves developer intent from plain English text — or spoken voice — into a typed Abstract Syntax Tree (AST), which then transpiles to certified JavaScript.
            </p>
            <p className="text-white/70 text-sm leading-relaxed mt-3">
              The compiler performs live, intent-aware security scanning at AST node creation time, producing tamper-evident security certificates — a capability we call "certified at birth." Voice input flows through a dedicated Transcription Cleanup Layer that normalizes speech artifacts before entering the same Tolerance Chain, making voice-to-code an architectural consequence of the language's design rather than a bolt-on feature.
            </p>
            <p className="text-white/70 text-sm leading-relaxed mt-3">
              We formalize the concept of cognitive distance — the gap between developer intent and required syntactic expression — and demonstrate that Lume reduces it to near-zero for text input and approaching-zero for voice input. The language specification spans 13 milestones with 305 formally specified acceptance criteria, 2,160 passing tests across 529 suites, and a complete implementation from core syntax through a self-sustaining runtime.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["programming languages", "natural language processing", "voice-to-code", "compiler security", "cognitive distance", "deterministic natural-language computation"].map(kw => (
                <span key={kw} className="text-[10px] px-2 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">{kw}</span>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      <SectionHeading number="1" title="Introduction" id="wp-intro" />

      <SubHeading number="1.1" title="The Syntax Barrier" />
      <Paragraph>
        All mainstream programming languages — Python, JavaScript, Rust, C++, Java, Go, TypeScript, and hundreds more — share a foundational assumption: the developer must express intent in exact syntactic conformity with a formal grammar. A single missing semicolon, mismatched bracket, misspelled keyword, or incorrect operator breaks compilation entirely. The compiler's role, in this paradigm, is to verify conformity and reject nonconformity.
      </Paragraph>
      <Paragraph>
        This assumption has been unchallenged since the earliest compilers of the 1950s. It produces a phenomenon we term <strong className="text-cyan-300">cognitive distance</strong> — the mental gap between what a developer intends and what they must type to express that intent in conformant syntax.
      </Paragraph>

      <SubHeading number="1.2" title="Cognitive Distance and Cognitive Dissonance" />
      <Paragraph>
        The term "cognitive distance" is deliberately chosen for its proximity to cognitive dissonance — the well-documented psychological phenomenon describing the mental discomfort of holding contradictory beliefs or performing actions that conflict with one's self-concept (Festinger, 1957). In the context of programming, cognitive dissonance manifests as a daily, recurring experience:
      </Paragraph>
      <div className="my-4 space-y-2 pl-4">
        {[
          'A developer thinks in natural language: "get the user\'s name from the database"',
          'The developer is forced to act in a completely different language: const name = await db.query("SELECT name FROM users WHERE id = ?", [userId])',
          "The thought and the action do not match",
          "This mismatch occurs hundreds of times per day for every working developer",
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-2 text-sm text-white/70">
            <span className="text-cyan-400 mt-0.5 font-mono text-xs">{i + 1}.</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
      <KeyClaim>
        Every developer who has said "I know what I want to do, I just can't figure out how to write it" is describing cognitive dissonance caused by cognitive distance.
      </KeyClaim>

      <DataTable
        headers={["Era", "Language/Tool", "Cognitive Distance", "Expression Gap"]}
        rows={[
          ["1950s", "Assembly", "Maximum", '"Add two numbers" → MOV AX, 5 / ADD AX, 3'],
          ["1970s", "C", "High", '"Add two numbers" → int result = a + b;'],
          ["1990s", "Python", "Medium", '"Add two numbers" → result = a + b'],
          ["2020s", "AI Agents", "Medium-High*", '"Add two numbers" → ask AI → review → run'],
          ["2026", "Lume (text)", "Near-Zero", '"Add two numbers" → add two numbers'],
          ["2026", "Lume (voice)", "Approaching Zero", "Think → say → compiled"],
        ]}
      />
      <Paragraph>
        *A critical observation: AI coding agents (GitHub Copilot, ChatGPT, etc.) actually <em>increased</em> the number of translation layers. Developers previously wrote code and the compiler ran it (2 layers: human → compiler). With AI agents, developers ask an AI to write code, review what it wrote, then the compiler runs it (3 layers: human → AI → compiler). The AI is a middleman. <strong className="text-cyan-300">Lume eliminates the middleman</strong> — the compiler IS the understanding layer.
      </Paragraph>

      <SubHeading number="1.3" title="The Thesis" />
      <KeyClaim>
        If a programming language is designed from the ground up to accept imprecise natural language as valid source code, then three capabilities emerge as architectural consequences rather than bolt-on features: voice-to-code, intent-aware security scanning, and near-zero cognitive distance.
      </KeyClaim>

      <SubHeading number="1.4" title="Contributions" />
      <div className="space-y-3 my-4">
        {[
          { title: "The Lume Programming Language", desc: "A complete language specification spanning 13 milestones, from core syntax through a self-sustaining runtime to voice-to-code and zero-dependency executables, with 305 formally specified acceptance criteria" },
          { title: "The Tolerance Chain", desc: "A 7-layer progressive fallback resolution system that transforms imprecise natural language input into typed AST nodes, maintaining deterministic reproducibility through compile-lock files" },
          { title: "The Guardian Output Scanner", desc: "A novel security architecture that performs live, intent-aware scanning at AST node creation time during compilation, producing tamper-evident security certificates — \"certified at birth\"" },
          { title: "The Transcription Cleanup Layer", desc: "A 7-step preprocessing pipeline that normalizes speech-to-text artifacts into clean text indistinguishable from typed input" },
          { title: "15 Gap Resolutions", desc: "Systematic solutions to architectural challenges in natural language compilation, including ambiguity ceilings, complex boolean logic, cross-file module resolution, and concurrent async patterns" },
          { title: "The Cognitive Distance Framework", desc: "A theoretical contribution connecting programming language design to cognitive psychology, with implications for accessibility and human-computer interaction" },
        ].map((c, i) => (
          <div key={i} className="flex items-start gap-3 text-sm">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[10px] font-bold text-white">{i + 1}</span>
            </div>
            <div>
              <span className="text-white font-semibold">{c.title}</span>
              <span className="text-white/50"> — {c.desc}</span>
            </div>
          </div>
        ))}
      </div>

      <SectionHeading number="2" title="Background and Related Work" id="wp-background" />

      <SubHeading number="2.1" title="Natural Language Programming" />
      <Paragraph>
        The idea of programming in natural language has a long history, dating to early AI research. Systems like SHRDLU (Winograd, 1972) demonstrated natural language understanding in constrained domains. More recently, NLP-to-code systems leveraging large language models — including OpenAI Codex, AlphaCode, and StarCoder — have demonstrated impressive code generation from natural language prompts. However, these systems function as code generators, not compilers. They produce code that must then be compiled by a traditional compiler.
      </Paragraph>
      <KeyClaim>
        Lume differs fundamentally: natural language is not used to generate code that a traditional compiler processes — natural language IS the source code that the Lume compiler directly resolves into an AST.
      </KeyClaim>

      <SubHeading number="2.2" title="Voice-to-Code Systems" />
      <DataTable
        headers={["System", "Approach", "Limitation"]}
        rows={[
          ["Talon", "Voice commands mapped to IDE actions", "Editor-level, not language-level; rigid command grammar"],
          ["Serenade", "Voice-to-code templates for Python/JS", "Template-based; cannot handle arbitrary phrasing"],
          ["GitHub Copilot Voice", "LLM-generated code from voice", "Non-deterministic; no security guarantees; adds translation layer"],
          ["Apple Dictation / Dragon", "General speech-to-text", "No programming-domain awareness whatsoever"],
          ["Scratch / Blockly", "Visual programming for beginners", "Block-based, not voice-based; limited expressiveness"],
        ]}
      />
      <Paragraph>
        All existing voice coding tools operate at the IDE level — they map voice commands to editor actions or code templates. The compiler itself never sees voice input. Lume is the first system where voice input flows through the compiler's own pipeline, and the compiler is architecturally designed to handle the noise that voice input introduces.
      </Paragraph>

      <SubHeading number="2.3" title="Compiler Security" />
      <Paragraph>
        Security analysis in traditional programming is always external to the compiler: ESLint, SonarQube, Snyk, Semgrep — all operate post-compilation on generated code. They have no access to developer intent, must be installed and configured separately, and are optional. No existing programming language performs security scanning as a built-in compiler feature. Lume's Guardian Output Scanner is, to our knowledge, the first compiler-integrated, intent-aware security scanner that produces tamper-evident verification certificates.
      </Paragraph>

      <SectionHeading number="3" title="Core Language Design" id="wp-core" />

      <SubHeading number="3.1" title="Design Philosophy" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6">
        {[
          { icon: BookOpen, title: "Readable", desc: "Human-first syntax. Code reads like intent." },
          { icon: Sparkles, title: "Deterministic Natural-Language", desc: "AI is a native type. Model calls are syntax." },
          { icon: Shield, title: "Safe", desc: "Errors are impossible to ignore." },
          { icon: Globe, title: "Interoperable", desc: "Compiles to JavaScript. Full ecosystem access." },
          { icon: Users, title: "Approachable", desc: "Gradual complexity. Beginners write real programs." },
          { icon: Eye, title: "Self-Documenting", desc: "Intent is documentation. Tests live in the code." },
        ].map((p, i) => (
          <GlassCard key={i}>
            <div className="p-4 flex items-start gap-3">
              <p.icon className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold text-sm">{p.title}</p>
                <p className="text-white/50 text-xs mt-1">{p.desc}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <SubHeading number="3.2" title="Dual-Mode Compilation" />
      <Paragraph>
        Lume supports two input modes that produce identical AST representations:
      </Paragraph>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <CodeBlock
            label="Standard Mode"
            code={`let name = "Ada"
let age = 28
to greet(person: text) -> text:
    return "Hello, " + person
if user is verified and user.age is at least 18:
    allow access`}
          />
        </div>
        <div>
          <CodeBlock
            label="English Mode"
            code={`mode: english
get the user's name and email from the database
if the name is empty, show "No name provided"
otherwise, show "Hello, {name}" on the page
when the submit button is clicked:
  save the form data to the database
  show "Saved!" for 3 seconds
  then redirect to the dashboard`}
          />
        </div>
      </div>

      <SubHeading number="3.3" title="AI as a First-Class Primitive" />
      <DataTable
        headers={["Keyword", "Purpose", "Temperature", "Behavior"]}
        rows={[
          ["ask", "Direct question/instruction", "0.7 (balanced)", "messages: [{ role: \"user\", content: prompt }]"],
          ["think", "Internal reasoning", "0.3 (precise)", "System prompt + step-by-step"],
          ["generate", "Creative output", "1.0 (creative)", "High-temperature generation"],
        ]}
      />
      <CodeBlock
        label="AI Keywords in Action"
        code={`let summary = ask "Summarize this in 3 bullets: " + article
let plan = think "Break this problem into 5 steps:" + problem
let story = generate "A short sci-fi story about:" + premise

let sentiment: { score: number, label: text } =
    ask gpt.4o "Analyze sentiment:" + review as json`}
      />

      <SubHeading number="3.4" title="Error Handling — Result-Based" />
      <CodeBlock
        code={`let result = fetch data from "https://api.example.com/users"
when result is:
    ok(data)  -> show data.users
    error(e)  -> log "Failed: " + e.message

let data = fetch "https://api.example.com" or fail with "Could not connect"`}
      />
      <Paragraph>
        Every operation that can fail returns a Result. The developer cannot proceed without explicitly handling both cases. This eliminates the silent failure epidemic that plagues exception-based languages.
      </Paragraph>

      <SubHeading number="3.5" title="Intent Blocks — Built-In Testing and Documentation" />
      <CodeBlock
        code={`to calculate_discount(price: number, tier: text) -> number:
    intent:
        "Returns a discounted price based on customer tier"
        given price = 100, tier = "gold"   expects 80
        given price = 100, tier = "silver" expects 90
        given price = 100, tier = "none"   expects 100
    when tier is:
        "gold"   -> return price * 0.80
        "silver" -> return price * 0.90
        default  -> return price`}
      />
      <Paragraph>
        Intent blocks are first-class syntax, not comments. They serve simultaneously as documentation, test cases, and behavioral contracts. The <code className="text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded">lume test</code> command executes all intent blocks as test suites.
      </Paragraph>

      <SectionHeading number="4" title="English Mode — The Intent Resolver" id="wp-english" />

      <SubHeading number="4.1" title="The Compilation Pipeline" />
      <GlassCard>
        <div className="p-6">
          <p className="text-xs font-mono text-white/40 mb-3">Standard Pipeline:</p>
          <p className="text-sm font-mono text-cyan-300 mb-4">Lume Source → Lexer → Parser → AST → Transpiler → JavaScript</p>
          <p className="text-xs font-mono text-white/40 mb-3">English Mode Pipeline:</p>
          <p className="text-sm font-mono text-purple-300">English Source → Auto-Correct → Intent Resolver → Security Check → AST → Transpiler → JavaScript + Source Map + Compile Lock</p>
        </div>
      </GlassCard>

      <SubHeading number="4.2" title="The Tolerance Chain — 7-Layer Progressive Fallback" />
      <DataTable
        headers={["Step", "Method", "Speed", "Confidence"]}
        rows={[
          ["1", "Exact Pattern Match (Layer A)", "<1ms", "Deterministic (1.0)"],
          ["2", "Fuzzy Pattern Match (Levenshtein ≥ 85%)", "<1ms", "Edit distance ratio"],
          ["3", "Grammar-Tolerant Match (word-bag)", "<1ms", "Word overlap score"],
          ["4", "AI Resolution — High Confidence (≥80%)", "~1-3s", "LLM confidence"],
          ["5", "AI Resolution — Low Confidence (50-79%)", "~1-3s", "LLM confidence; asks user"],
          ["6", "AI Resolution — Very Low (<50%)", "~1-3s", "Shows ranked options"],
          ["7", "Unresolvable", "—", "Clear error with suggestions"],
        ]}
      />
      <Paragraph>
        Layer A handles article stripping, pronoun resolution, possessive normalization, slug conversion, and synonym ring expansion. Seven core operations — get, show, save, delete, create, send, calculate — each have 7-12 synonyms that resolve without AI. Layer B is invoked only when deterministic resolution fails, maintaining speed and predictability.
      </Paragraph>

      <SectionHeading number="5" title="Voice-to-Code Architecture" id="wp-voice" />

      <SubHeading number="5.1" title="The Full Pipeline" />
      <GlassCard>
        <div className="p-6">
          <p className="text-sm font-mono text-cyan-300 leading-loose">
            Voice Input → Speech-to-Text Engine → Transcription Cleanup (7 steps) → Text Input → Auto-Correct → Intent Resolver (Tolerance Chain) → Live Security Check → AST → Transpiler → Certified JavaScript + Security Certificate
          </p>
        </div>
      </GlassCard>

      <SubHeading number="5.2" title="Transcription Cleanup — 7-Step Pipeline" />
      <div className="space-y-2 my-4">
        {[
          { step: "1", title: "Filler Removal", desc: "Strip um, uh, like, you know, basically, so, well, actually, right, okay (20 filler words)" },
          { step: "2", title: "Stutter Detection", desc: 'Collapse "let let let name" → "let name"' },
          { step: "3", title: "Homophone Resolution", desc: '"there/their/they\'re", "its/it\'s", "to/too/two" — programming-context-aware (10 pairs)' },
          { step: "4", title: "Spoken Punctuation", desc: '"period" → ".", "comma" → ",", "open paren" → "(" (12 mappings)' },
          { step: "5", title: "Number Normalization", desc: '"forty two" → 42, "three point one four" → 3.14' },
          { step: "6", title: "Casing Inference", desc: '"my app component" → MyAppComponent (camelCase/PascalCase from context)' },
          { step: "7", title: "Sentence Splitting", desc: "Pause-based boundaries, action verb detection (40 verbs)" },
        ].map(s => (
          <div key={s.step} className="flex items-start gap-3 text-sm">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[10px] font-bold text-white">{s.step}</span>
            </div>
            <div>
              <span className="text-white font-semibold">{s.title}</span>
              <span className="text-white/50"> — {s.desc}</span>
            </div>
          </div>
        ))}
      </div>
      <KeyClaim>
        After cleanup, voice-transcribed text is indistinguishable from typed input. The same Tolerance Chain processes both — voice-to-code is an architectural consequence, not a separate system.
      </KeyClaim>

      <SectionHeading number="6" title="The Three-Layer Security Model" id="wp-security" />

      <SubHeading number="6.1" title="Guardian Output Scanner" />
      <Paragraph>
        Unlike all existing security tools that operate post-compilation, Lume's Guardian Output Scanner performs live scanning during compilation at AST node creation time. Every node is checked against 11 input threat categories and 8 AST-level threat categories before being added to the tree.
      </Paragraph>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        {[
          { layer: "Layer 1: Input", title: "Input Sanitization", desc: "11 threat categories scanned before parsing", icon: Shield },
          { layer: "Layer 2: Live", title: "AST-Level Scanning", desc: "8 threat categories checked at node creation", icon: Eye },
          { layer: "Layer 3: Sandbox", title: "Runtime Isolation", desc: "Sandboxed execution with resource limits", icon: Lock },
        ].map((l, i) => (
          <GlassCard key={i} glow>
            <div className="p-5 text-center">
              <l.icon className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <p className="text-[10px] uppercase tracking-widest text-purple-400 mb-1">{l.layer}</p>
              <p className="text-white font-bold text-sm mb-2">{l.title}</p>
              <p className="text-white/50 text-xs">{l.desc}</p>
            </div>
          </GlassCard>
        ))}
      </div>
      <KeyClaim>
        Every compiled Lume program ships with a tamper-evident security certificate — a SHA-256 hash of the AST, compilation metadata, and scan results. Code is "certified clean at birth."
      </KeyClaim>

      <SectionHeading number="7" title="Self-Sustaining Runtime" id="wp-runtime" />
      <Paragraph>
        Milestone 6 introduces four autonomous layers that make Lume programs self-managing:
      </Paragraph>
      <div className="space-y-3 my-6">
        {[
          { layer: "Layer 1", title: "Self-Monitoring", keyword: "@monitor", desc: "Automatic metrics collection, anomaly detection, health checks", bg: "bg-cyan-500/20", text: "text-cyan-400" },
          { layer: "Layer 2", title: "Self-Healing", keyword: "@healable", desc: "Automatic retries, circuit breakers, fallback strategies, state recovery", bg: "bg-purple-500/20", text: "text-purple-400" },
          { layer: "Layer 3", title: "Self-Optimizing", keyword: "@optimize", desc: "AI-powered profiling, cache insertion, query rewriting, algorithm selection", bg: "bg-cyan-500/20", text: "text-cyan-400" },
          { layer: "Layer 4", title: "Self-Evolving", keyword: "evolve:", desc: "Dependency monitoring, model benchmarking, schema adaptation, cost optimization", bg: "bg-purple-500/20", text: "text-purple-400" },
        ].map((l, i) => (
          <GlassCard key={i}>
            <div className="p-4 flex items-start gap-4">
              <div className={`p-2 rounded-lg ${l.bg} flex-shrink-0`}>
                <Layers className={`w-5 h-5 ${l.text}`} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase tracking-widest text-white/40">{l.layer}</span>
                  <code className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">{l.keyword}</code>
                </div>
                <p className="text-white font-semibold text-sm">{l.title}</p>
                <p className="text-white/50 text-xs mt-1">{l.desc}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <SectionHeading number="8" title="Gap Resolutions" id="wp-gaps" />
      <DataTable
        headers={["Gap", "Problem", "Solution"]}
        rows={[
          ["1", "All tolerance layers fail", "Interactive Clarification Mode"],
          ["2", "Compound boolean logic", "Natural language logic blocks"],
          ["3", "Cross-file references", "Implicit module resolution"],
          ["4", "Inconsistent English", "Canonical form + lume canonicalize"],
          ["5", "No performance control", "Hint annotations"],
          ["6", "JS errors, not English errors", "Enhanced source maps"],
          ["7", "No linter for English", "lume lint with 10 rules"],
          ["8", "Pattern library evolution", "Versioned patterns + migration"],
          ["9", "npm package usage", "Package awareness + auto-install"],
          ["10", "Complex data structures", "English structure definitions"],
          ["11", "No error handling", "Try/catch/retry in English"],
          ["12", "No test framework", "Natural language assertions"],
          ["13", "Environment differences", "Conditional compilation"],
          ["14", "Complex async patterns", "Parallel/sequential/race in English"],
          ["15", "Comments vs instructions", "Comment markers + doc generation"],
        ]}
      />

      <SectionHeading number="9" title="Advanced Milestones (8-13)" id="wp-advanced" />
      <DataTable
        headers={["Milestone", "Name", "Description"]}
        rows={[
          ["8", "Multilingual Mode", "Any human language as input; auto-detection; same AST output"],
          ["9", "Voice-to-Code", "Spoken language as compiler input via transcription pipeline"],
          ["10", "Visual Context", "UI element registry, spatial/style resolution, full-stack generation"],
          ["11", "Reverse Mode", "Code-to-language: explain existing code in any human language"],
          ["12", "Collaborative Intent", "Multi-developer, multi-language; AST-level diffing"],
          ["13", "Zero-Dependency Runtime", "Standalone executables via Bun compile; cross-compilation"],
        ]}
      />

      <SectionHeading number="10" title="Key Claims" id="wp-claims" />
      <div className="space-y-3 my-6">
        {[
          "First programming language where voice-to-code is architecturally native",
          "Transcription Cleanup + Tolerance Chain absorbs all speech noise, producing clean AST nodes identical to typed input",
          "Deterministic reproducibility despite non-deterministic voice input",
          "Same error tolerance enables English Mode AND voice input — same principle, different sources",
          "Cognitive distance approaches zero with natural language + voice",
          "First language with built-in compiler-level security scanning producing tamper-evident certificates — \"certified clean at birth\"",
          "AI agents increased translation layers from 2 to 3. Lume reduces to 1. The compiler IS the understanding layer.",
        ].map((claim, i) => (
          <div key={i} className="flex items-start gap-3 text-sm">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-white" />
            </div>
            <span className="text-white/80">{claim}</span>
          </div>
        ))}
      </div>

      <GlassCard glow className="mt-12">
        <div className="p-8 text-center">
          <p className="text-lg font-display font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Lume — The Deterministic Natural-Language Programming Language
          </p>
          <p className="text-white/50 text-sm">
            Built to make AI-powered software as natural as writing a sentence. The first programming language you can speak.
          </p>
          <p className="text-white/30 text-xs font-mono mt-4">
            Submitted for peer review · Correspondence: team@dwsc.io
          </p>
        </div>
      </GlassCard>
    </article>
  );
}

function MasterSpecContent() {
  return (
    <article className="prose-invert max-w-none">
      <div id="sp-overview" className="scroll-mt-24">
        <Badge className="mb-6 bg-purple-500/20 text-purple-400 border-purple-500/30">
          <Code className="w-3 h-3 mr-1" /> Technical Specification
        </Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black leading-tight mb-4">
          <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Lume Language Specification
          </span>
        </h1>
        <p className="text-white/50 text-sm mb-2">
          Complete Master Specification — Version 1.0
        </p>
        <p className="text-white/40 text-xs font-mono mb-8">
          Compiled from 8 source documents · 7,074 lines · 305 acceptance criteria · March 2026
        </p>

        <GlassCard>
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { value: "13", label: "Milestones" },
                { value: "2,160", label: "Tests" },
                { value: "305", label: "Acceptance Criteria" },
                { value: "154+", label: "Pattern Library" },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-display font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{s.value}</p>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      <SectionHeading number="1" title="Vision & Philosophy" id="sp-overview-2" />
      <Paragraph>
        Lume is a programming language built for the AI era. While existing languages treat AI as an external library you bolt on, Lume treats AI as a first-class primitive — as natural as a variable, a loop, or a function call.
      </Paragraph>
      <KeyClaim>
        The North Star: Every decision made in Lume's design must answer YES to this question: "Does this make it easier to build AI-powered software while keeping code readable by a human being?"
      </KeyClaim>

      <Paragraph>
        Lume is a direct response to 7 documented pain points in modern programming:
      </Paragraph>
      <div className="space-y-2 my-4">
        {[
          { pain: "The Learning Cliff", solution: "Graduated complexity layers — build real software at Layer 1" },
          { pain: "Async/Concurrency Mess", solution: "Concurrency is invisible by default; opt into control when needed" },
          { pain: "Ugly Error Handling", solution: "Errors are values (Result type), not exceptions — cannot be ignored" },
          { pain: "Code Doesn't Read Like English", solution: 'Natural syntax: "if user is adult and verified"' },
          { pain: "No Deterministic Natural-Language Language", solution: "ask, think, generate are keywords — model calls are first-class" },
          { pain: "Config vs Code Split", solution: "Config is code — environment, settings, logic in unified syntax" },
          { pain: "Intent is Invisible", solution: "Intent blocks are first-class syntax — tests and docs inline" },
        ].map((p, i) => (
          <div key={i} className="flex items-start gap-3 text-sm">
            <span className="text-cyan-400 font-mono text-xs mt-0.5 w-4">{i + 1}.</span>
            <div>
              <span className="text-white font-semibold">{p.pain}</span>
              <span className="text-white/50"> → {p.solution}</span>
            </div>
          </div>
        ))}
      </div>

      <SectionHeading number="2" title="Syntax Design" id="sp-syntax" />

      <SubHeading number="2.1" title="Variables & Types" />
      <CodeBlock
        code={`let name = "Ada"
let age = 28
let active = true
let score: number = 0
let tags: list of text = ["ai", "code", "lume"]
define MAX_RETRIES = 3`}
      />

      <SubHeading number="2.2" title="Human-Readable Conditions" />
      <CodeBlock
        code={`if user is verified and user.age is at least 18:
    allow access
if score is greater than 100:
    set score to 100

// Traditional syntax also supported:
if (user.verified && user.age >= 18):
    allow access`}
      />

      <SubHeading number="2.3" title="Functions" />
      <CodeBlock
        code={`to greet(name: text) -> text:
    return "Hello, " + name

let message = greet("Ada")
to double(n: number) -> n * 2`}
      />

      <SubHeading number="2.4" title="AI Keywords" />
      <CodeBlock
        code={`let summary = ask "Summarize this in 3 bullets: " + article
let review = ask claude.sonnet "Review this code for bugs:" + code

let sentiment: { score: number, label: text } =
    ask gpt.4o "Analyze sentiment:" + review as json

// Chaining
let draft = ask "Write a blog post about:" + topic
let improved = ask "Improve the tone to be friendlier:" + draft
let final = ask "Add a compelling title to:" + improved

// Reasoning & creativity
let plan = think "Break this problem into 5 steps:" + problem
let story = generate "A short sci-fi story about:" + premise`}
      />

      <SubHeading number="2.5" title="Concurrency — Invisible by Default" />
      <CodeBlock
        code={`// These run in parallel automatically:
let weather = fetch weather for "New York"
let news    = fetch headlines from "reuters"
let stocks  = fetch price of "AAPL"
show weather, news, stocks

// These run sequentially (dependency detected):
let token   = login with credentials
let profile = fetch profile using token`}
      />

      <SubHeading number="2.6" title="Loops & Iteration" />
      <CodeBlock
        code={`for each color in colors:
    show color

for each item, index in colors:
    show "{index}: {item}"

for i in 0 to 100 by 5:
    show i

while count is less than 10:
    show count
    set count to count + 1`}
      />

      <SubHeading number="2.7" title="Complete Keyword List" />
      <div className="my-4 space-y-3">
        {[
          { category: "Core", keywords: "let, define, set, to, return, if, else, when, is, and, or, not, for, each, in, while, break, continue, show, log, then, by" },
          { category: "AI", keywords: "ask, think, generate, as" },
          { category: "Modules", keywords: "use, export, from, all" },
          { category: "Types", keywords: "text, number, boolean, list, map, of, any, nothing, maybe" },
          { category: "Errors", keywords: "ok, error, fail, with, or, try" },
          { category: "Testing", keywords: "test, expect, to, equal, intent, given, expects" },
        ].map(g => (
          <div key={g.category} className="flex items-start gap-2 text-sm">
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/20 text-[10px] flex-shrink-0">{g.category}</Badge>
            <span className="text-white/60 font-mono text-xs">{g.keywords}</span>
          </div>
        ))}
      </div>

      <SubHeading number="2.8" title="Natural Language Operators" />
      <DataTable
        headers={["Natural Language", "Operator", "Example"]}
        rows={[
          ["is", "==", "if score is 100"],
          ["is not", "!=", "if name is not empty"],
          ["is greater than", ">", "if age is greater than 18"],
          ["is less than", "<", "if count is less than 10"],
          ["is at least", ">=", "if score is at least 80"],
          ["is at most", "<=", "if tries is at most 3"],
        ]}
      />

      <SectionHeading number="3" title="Milestone Roadmap" id="sp-milestones" />
      <DataTable
        headers={["#", "Name", "Status", "Description"]}
        rows={[
          ["1", "Core Language & Compiler", "COMPLETE", "Lexer, parser, transpiler. Zero dependencies."],
          ["2", "Full Core Language", "COMPLETE", "Variables, loops, functions, error handling, types."],
          ["3", "AI Integration", "COMPLETE", "ask, think, generate as first-class keywords."],
          ["4", "JS Interop & CLI", "COMPLETE", "use/expose, lume build/run/repl CLI."],
          ["5", "IDE Tooling & DX", "COMPLETE", "REPL, syntax highlighting, diagnostics."],
          ["6", "Self-Sustaining Runtime", "COMPLETE", "Monitor, heal, optimize, evolve."],
          ["7", "English Mode", "SPEC COMPLETE", "Plain English as source code."],
          ["8", "Multilingual Mode", "SPEC COMPLETE", "Any human language as input."],
          ["9", "Voice-to-Code", "SPEC COMPLETE", "Spoken language as compiler input."],
          ["10", "Visual Context", "SPEC COMPLETE", "UI element registry, spatial resolution."],
          ["11", "Reverse Mode", "SPEC COMPLETE", "Code-to-language explanation."],
          ["12", "Collaborative Intent", "SPEC COMPLETE", "Multi-developer AST-level diffing."],
          ["13", "Zero-Dependency Runtime", "SPEC COMPLETE", "Standalone executables."],
        ]}
      />

      <SectionHeading number="4" title="English Mode Pipeline" id="sp-english" />
      <SubHeading number="4.1" title="Pattern Library (Layer A)" />
      <DataTable
        headers={["Pattern Category", "Example Input", "AST Node Type"]}
        rows={[
          ["Variable Access", "\"get the user's name\"", "VariableAccess"],
          ["Show/Display", "\"show it on the screen\"", "ShowStatement"],
          ["Create", "\"create a new task\"", "CreateOperation"],
          ["Delete", "\"delete the old records\"", "DeleteOperation"],
          ["Update", "\"update the price to 50\"", "UpdateOperation"],
          ["Store/Save", "\"save the data to disk\"", "StoreOperation"],
          ["Conditional", "\"if the count is zero\"", "IfStatement"],
          ["Loop", "\"for each item in the cart\"", "ForEachLoop"],
          ["AI Call", "\"ask the AI to summarize\"", "AskExpression"],
        ]}
      />

      <SubHeading number="4.2" title="Synonym Rings" />
      <DataTable
        headers={["Operation", "Synonyms"]}
        rows={[
          ["get", "fetch, retrieve, grab, pull, obtain, access, look up, find, query, \"I need\", \"give me\""],
          ["show", "display, render, present, print, output, \"put on screen\""],
          ["save", "store, persist, write, keep, preserve, \"hang onto\", \"put in the database\""],
        ]}
      />

      <SectionHeading number="5" title="Voice-to-Code" id="sp-voice" />
      <SubHeading number="5.1" title="CLI Commands" />
      <DataTable
        headers={["Command", "Description"]}
        rows={[
          ["lume voice", "Start voice input mode"],
          ["lume voice --liveCompile", "Compile each instruction immediately"],
          ["lume voice --review", "Review transcription before compiling"],
          ["lume voice --engine whisper", "Use Whisper API for transcription"],
          ["lume listen", "CLI voice capture"],
        ]}
      />

      <SectionHeading number="6" title="Security Architecture" id="sp-security" />
      <Paragraph>
        Lume introduces three security layers integrated directly into the compilation pipeline. No external tools required. No configuration needed. Security is on by default.
      </Paragraph>
      <CodeBlock
        language="json"
        label="Security Configuration"
        code={`// .lume/security-config.json
{
  "scanLevel": "standard",  // off | basic | standard | strict
  "certificateOutput": true,
  "blockOnThreats": true
}`}
      />

      <SectionHeading number="7" title="Gap Resolutions" id="sp-gaps" />
      <SubHeading number="7.1" title="Natural Language Testing (Gap 12)" />
      <CodeBlock
        code={`mode: english
test "calculate_total works correctly":
  given items are [{name: "book", price: 10}, {name: "pen", price: 5}]
  when I calculate the total of items
  then the result should be 15`}
      />

      <SubHeading number="7.2" title="Complex Async Patterns (Gap 14)" />
      <CodeBlock
        code={`mode: english
fetch the weather and the news at the same time
wait for both to finish
then show the results together

// Sequential (dependency detected):
first log in with the credentials
then use the token to fetch the profile`}
      />

      <SubHeading number="7.3" title="Error Handling in English (Gap 11)" />
      <CodeBlock
        code={`mode: english
try to fetch the data from the API
if it fails, wait 2 seconds and try again
if it fails 3 times, show "Service unavailable"
  and log the error for the admin`}
      />

      <SectionHeading number="8" title="CLI Reference" id="sp-cli" />
      <DataTable
        headers={["Command", "Description"]}
        rows={[
          ["lume build <file>", "Compile Lume to JavaScript"],
          ["lume run <file>", "Compile and execute"],
          ["lume repl", "Interactive REPL"],
          ["lume test <file>", "Run intent blocks as tests"],
          ["lume explain <file>", "Explain code in plain language"],
          ["lume fix <file>", "AI-powered error fix"],
          ["lume lint <file>", "Lint for clarity and ambiguity"],
          ["lume canonicalize <file>", "Normalize English to canonical form"],
          ["lume docs <file>", "Generate documentation"],
          ["lume init", "Initialize a new Lume project"],
          ["lume install <pkg>", "Install npm package"],
          ["lume monitor", "Real-time monitoring dashboard"],
          ["lume verify --hash <hash>", "Verify security certificate"],
        ]}
      />

      <SectionHeading number="9" title="Key Metrics" id="sp-metrics" />
      <DataTable
        headers={["Metric", "Value"]}
        rows={[
          ["Compiler milestones", "13"],
          ["Test suite", "2,160 tests, 529 suites, 0 failures"],
          ["Acceptance criteria", "305 total"],
          ["Pattern Library patterns", "154+ (87 core + 67 domain)"],
          ["Supported languages", "10 (Milestone 8)"],
          ["Homophone pairs", "10"],
          ["Filler words stripped", "20"],
          ["Action verbs (splitter)", "40"],
          ["Security threat categories", "11 (input) + 8 (AST-level)"],
          ["Security layers", "3 (input, live, sandbox)"],
        ]}
      />

      <GlassCard glow className="mt-12">
        <div className="p-8 text-center">
          <p className="text-lg font-display font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Complete Specification: 7,074 Lines · 305 Criteria · 13 Milestones
          </p>
          <p className="text-white/50 text-sm">
            lume-lang.com · lume-lang.org · team@dwsc.io
          </p>
          <p className="text-white/30 text-xs font-mono mt-2">
            Launch: August 23, 2026 CST · App #35 of 35 in the Trust Layer / DarkWave Ecosystem
          </p>
        </div>
      </GlassCard>
    </article>
  );
}

export default function LumeResearch() {
  const [activeTab, setActiveTab] = useState<"whitepaper" | "spec">("whitepaper");
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    document.title = "Research & Publications | Trust Layer Academy";
  }, []);

  const currentSections = activeTab === "whitepaper" ? whitepaperSections : specSections;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-100px 0px -60% 0px" }
    );
    currentSections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#06060a] text-white">
      <SiteNav />

      <section className="pt-28 pb-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]" />

        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Link href="/academy">
                <Button variant="ghost" size="sm" className="text-white/40 hover:text-white/70 gap-1" data-testid="button-back-academy">
                  <ArrowLeft className="w-4 h-4" /> Academy
                </Button>
              </Link>
              <ChevronRight className="w-3 h-3 text-white/20" />
              <span className="text-white/40 text-sm">Research & Publications</span>
            </div>

            <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/30">
              <GraduationCap className="w-3 h-3 mr-1" /> Trust Layer Academy Research
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black mb-4">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Research & Publications
              </span>
            </h1>
            <p className="text-white/50 text-base sm:text-lg max-w-2xl leading-relaxed mb-8">
              Academic papers and technical specifications for the Lume programming language — the world's first deterministic natural-language language with voice-to-code as a compiler feature.
            </p>

            <div className="flex gap-2">
              <Button
                onClick={() => setActiveTab("whitepaper")}
                className={`gap-2 rounded-xl transition-all ${
                  activeTab === "whitepaper"
                    ? "bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-lg shadow-purple-500/20"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80"
                }`}
                data-testid="tab-whitepaper"
              >
                <FileText className="w-4 h-4" />
                Academic Whitepaper
              </Button>
              <Button
                onClick={() => setActiveTab("spec")}
                className={`gap-2 rounded-xl transition-all ${
                  activeTab === "spec"
                    ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/20"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80"
                }`}
                data-testid="tab-spec"
              >
                <Code className="w-4 h-4" />
                Master Specification
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pb-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex gap-8">
            <TableOfContents sections={currentSections} activeId={activeSection} />

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 min-w-0"
            >
              {activeTab === "whitepaper" ? <WhitepaperContent /> : <MasterSpecContent />}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
