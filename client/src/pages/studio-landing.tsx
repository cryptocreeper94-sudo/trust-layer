import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Code2, Play, Sparkles, Rocket, GitBranch, Terminal, Bot,
  Database, Shield, Cloud, Users, Zap, ChevronRight, Lock,
  FileCode, Layers, Package, Globe, CheckCircle2, HelpCircle,
  BookOpen, Video, MessageSquare, Keyboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";
import { Footer } from "@/components/footer";
import { useSimpleAuth } from "@/hooks/use-simple-auth";
import { SimpleLoginModal } from "@/components/simple-login";

const features = [
  {
    icon: Code2,
    title: "Monaco Editor",
    description: "Professional code editor with syntax highlighting, autocomplete, and multi-file support",
    color: "text-cyan-400"
  },
  {
    icon: Bot,
    title: "AI Assistant",
    description: "Get coding help, generate code, and debug with our built-in AI powered by GPT-4",
    color: "text-purple-400"
  },
  {
    icon: Layers,
    title: "Project Templates",
    description: "Start fast with React, Node.js, Python, Vue, Next.js, Django, Go, or Rust templates",
    color: "text-amber-400"
  },
  {
    icon: Terminal,
    title: "Built-in Terminal",
    description: "Run commands, install packages, and manage your project without leaving the IDE",
    color: "text-green-400"
  },
  {
    icon: GitBranch,
    title: "Version Control",
    description: "Commit changes, create branches, and track your project history with built-in Git",
    color: "text-pink-400"
  },
  {
    icon: Rocket,
    title: "One-Click Deploy",
    description: "Deploy your projects instantly to the Trust Layer network with custom domains",
    color: "text-orange-400"
  },
  {
    icon: Database,
    title: "Database Explorer",
    description: "Connect to databases, run queries, and visualize your data directly in the IDE",
    color: "text-blue-400"
  },
  {
    icon: Users,
    title: "Real-time Collaboration",
    description: "Work together with your team - see who's online and what they're editing",
    color: "text-teal-400"
  }
];

const quickStartSteps = [
  { step: 1, title: "Sign In", description: "Use your Trust Layer account to access the Studio" },
  { step: 2, title: "Create Project", description: "Choose a template or start from scratch" },
  { step: 3, title: "Write Code", description: "Use the editor with AI assistance" },
  { step: 4, title: "Run & Deploy", description: "Test locally and deploy with one click" }
];

const helpResources = [
  { icon: BookOpen, title: "Documentation", description: "Detailed guides and API reference", link: "/studio/docs" },
  { icon: Video, title: "Video Tutorials", description: "Step-by-step video walkthroughs", link: "/tutorials" },
  { icon: MessageSquare, title: "Community", description: "Get help from other developers", link: "/community" },
  { icon: Keyboard, title: "Keyboard Shortcuts", description: "Master the IDE with shortcuts", link: "#shortcuts" }
];

export default function StudioLanding() {
  const { user, isAuthenticated } = useSimpleAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const shortcuts = [
    { keys: "Ctrl + S", action: "Save file" },
    { keys: "Ctrl + P", action: "Quick file search" },
    { keys: "Ctrl + Shift + P", action: "Command palette" },
    { keys: "Ctrl + /", action: "Toggle comment" },
    { keys: "Ctrl + `", action: "Toggle terminal" },
    { keys: "Ctrl + B", action: "Toggle sidebar" },
    { keys: "F5", action: "Run project" },
    { keys: "Ctrl + Shift + F", action: "Search in files" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-7 h-7 text-cyan-400" />
            <span className="font-bold text-lg">Trust Layer Studio</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowShortcuts(true)}
              className="text-white/60 hover:text-white"
              data-testid="button-shortcuts"
            >
              <HelpCircle className="w-4 h-4 mr-1" />
              Help
            </Button>
            {isAuthenticated ? (
              <Link href="/studio/editor">
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold" data-testid="button-open-studio">
                  Open Studio
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            ) : (
              <Button 
                onClick={() => setShowLoginModal(true)}
                className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
                data-testid="button-sign-in"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="pt-20 pb-12">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-400">Cloud-Based Development Environment</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Build Anything
            </span>
            <br />
            <span className="text-white">Right in Your Browser</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/60 max-w-2xl mx-auto mb-8"
          >
            A powerful, beginner-friendly IDE with AI assistance, project templates, 
            and one-click deployment. No setup required - just sign in and start coding.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {isAuthenticated ? (
              <Link href="/studio/editor">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-black font-bold px-8" data-testid="button-launch-studio">
                  <Play className="w-5 h-5 mr-2" />
                  Launch Studio
                </Button>
              </Link>
            ) : (
              <Button 
                size="lg" 
                onClick={() => setShowLoginModal(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-black font-bold px-8"
                data-testid="button-get-started"
              >
                <Play className="w-5 h-5 mr-2" />
                Get Started Free
              </Button>
            )}
            <Link href="/studio/projects">
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5" data-testid="button-view-projects">
                <FileCode className="w-5 h-5 mr-2" />
                View My Projects
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* IDE Preview */}
        <section className="container mx-auto px-4 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard glow className="overflow-hidden">
              <div className="bg-slate-900/80 rounded-xl border border-white/10 overflow-hidden">
                {/* Fake IDE Header */}
                <div className="h-10 bg-slate-800/80 border-b border-white/5 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <span className="text-xs text-white/40 ml-4">Trust Layer Studio — my-project</span>
                </div>
                
                {/* Fake IDE Content */}
                <div className="flex h-80">
                  {/* Sidebar */}
                  <div className="w-48 border-r border-white/5 bg-slate-900/50 p-3">
                    <div className="text-xs text-white/40 uppercase mb-2">Files</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-white/80 bg-cyan-500/20 rounded px-2 py-1">
                        <FileCode className="w-3 h-3 text-cyan-400" />
                        App.tsx
                      </div>
                      <div className="flex items-center gap-2 text-white/60 px-2 py-1">
                        <FileCode className="w-3 h-3 text-yellow-400" />
                        index.ts
                      </div>
                      <div className="flex items-center gap-2 text-white/60 px-2 py-1">
                        <Package className="w-3 h-3 text-green-400" />
                        package.json
                      </div>
                    </div>
                  </div>
                  
                  {/* Editor */}
                  <div className="flex-1 p-4 font-mono text-sm">
                    <div className="text-white/30 mb-1">1</div>
                    <div><span className="text-purple-400">import</span> {"{"} useState {"}"} <span className="text-purple-400">from</span> <span className="text-green-400">'react'</span>;</div>
                    <div className="text-white/30 mt-2 mb-1">2</div>
                    <div></div>
                    <div className="text-white/30 mt-2 mb-1">3</div>
                    <div><span className="text-purple-400">export default function</span> <span className="text-cyan-400">App</span>() {"{"}</div>
                    <div className="text-white/30 mt-2 mb-1">4</div>
                    <div className="pl-4"><span className="text-purple-400">const</span> [count, setCount] = <span className="text-cyan-400">useState</span>(0);</div>
                    <div className="text-white/30 mt-2 mb-1">5</div>
                    <div className="pl-4"></div>
                    <div className="text-white/30 mt-2 mb-1">6</div>
                    <div className="pl-4"><span className="text-purple-400">return</span> (</div>
                    <div className="text-white/30 mt-2 mb-1">7</div>
                    <div className="pl-8">&lt;<span className="text-cyan-400">button</span> <span className="text-yellow-400">onClick</span>={"{"}() =&gt; setCount(c =&gt; c + 1){"}"}&gt;</div>
                  </div>
                  
                  {/* AI Panel */}
                  <div className="w-64 border-l border-white/5 bg-slate-900/50 p-3">
                    <div className="flex items-center gap-2 text-xs text-white/40 uppercase mb-3">
                      <Bot className="w-3 h-3 text-purple-400" />
                      AI Assistant
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-xs">
                      <div className="text-purple-400 flex items-center gap-1 mb-2">
                        <Sparkles className="w-3 h-3" />
                        Suggestion
                      </div>
                      <div className="text-white/70">Add error handling to prevent negative count values</div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Code</h2>
            <p className="text-white/60 max-w-xl mx-auto">
              A complete development environment with professional tools made simple
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <GlassCard className="h-full">
                  <div className="p-5">
                    <feature.icon className={`w-8 h-8 ${feature.color} mb-3`} />
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-white/60">{feature.description}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Quick Start */}
        <section className="container mx-auto px-4 mb-20">
          <GlassCard glow>
            <div className="p-8 md:p-12">
              <div className="text-center mb-10">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-4">
                  <Zap className="w-3 h-3 mr-1" />
                  Quick Start
                </Badge>
                <h2 className="text-3xl font-bold mb-4">Start Coding in 60 Seconds</h2>
                <p className="text-white/60">No installation, no configuration - just code</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {quickStartSteps.map((item, i) => (
                  <div key={item.step} className="text-center relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">
                      {item.step}
                    </div>
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-white/60">{item.description}</p>
                    {i < quickStartSteps.length - 1 && (
                      <ChevronRight className="w-6 h-6 text-white/20 absolute top-4 -right-3 hidden md:block" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Help Resources */}
        <section className="container mx-auto px-4 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
            <p className="text-white/60 max-w-xl mx-auto">
              We've got you covered with guides, tutorials, and community support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {helpResources.map((resource, i) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                {resource.link === "#shortcuts" ? (
                  <button 
                    onClick={() => setShowShortcuts(true)} 
                    className="w-full text-left"
                    data-testid="button-shortcuts-card"
                  >
                    <GlassCard className="h-full hover:border-cyan-500/30 transition-colors">
                      <div className="p-5">
                        <resource.icon className="w-8 h-8 text-cyan-400 mb-3" />
                        <h3 className="font-bold mb-1">{resource.title}</h3>
                        <p className="text-sm text-white/60">{resource.description}</p>
                      </div>
                    </GlassCard>
                  </button>
                ) : (
                  <Link href={resource.link}>
                    <GlassCard className="h-full hover:border-cyan-500/30 transition-colors">
                      <div className="p-5">
                        <resource.icon className="w-8 h-8 text-cyan-400 mb-3" />
                        <h3 className="font-bold mb-1">{resource.title}</h3>
                        <p className="text-sm text-white/60">{resource.description}</p>
                      </div>
                    </GlassCard>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4">
          <GlassCard glow>
            <div className="p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5" />
              <div className="relative z-10">
                <Cloud className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Building?</h2>
                <p className="text-white/60 max-w-lg mx-auto mb-6">
                  Join thousands of developers building on Trust Layer. Free to use with your Trust Layer account.
                </p>
                {isAuthenticated ? (
                  <Link href="/studio/editor">
                    <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-black font-bold px-8" data-testid="button-open-studio-cta">
                      <Rocket className="w-5 h-5 mr-2" />
                      Open Studio
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    size="lg"
                    onClick={() => setShowLoginModal(true)}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-black font-bold px-8"
                    data-testid="button-start-free-cta"
                  >
                    <Rocket className="w-5 h-5 mr-2" />
                    Start Free
                  </Button>
                )}
              </div>
            </div>
          </GlassCard>
        </section>
      </main>

      <Footer />

      {/* Login Modal */}
      <SimpleLoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowShortcuts(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-white/10 rounded-xl max-w-md w-full p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-cyan-400" />
                Keyboard Shortcuts
              </h3>
              <button 
                onClick={() => setShowShortcuts(false)}
                className="text-white/40 hover:text-white"
                data-testid="button-close-shortcuts"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              {shortcuts.map((shortcut) => (
                <div key={shortcut.keys} className="flex items-center justify-between">
                  <span className="text-white/60">{shortcut.action}</span>
                  <kbd className="px-2 py-1 bg-slate-800 border border-white/10 rounded text-sm font-mono text-cyan-400">
                    {shortcut.keys}
                  </kbd>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 text-center">
              <p className="text-xs text-white/40">Press <kbd className="px-1 bg-slate-800 rounded">Ctrl + Shift + P</kbd> in the editor for more commands</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
