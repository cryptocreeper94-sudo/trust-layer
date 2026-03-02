import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { 
  BookOpen, Code, Terminal, GitBranch, Database, Rocket, 
  Sparkles, FolderTree, Settings, Play, ChevronDown, ChevronRight,
  Keyboard, Search, File, Save, Undo, Redo, Copy, Clipboard,
  Shield, ArrowLeft, CheckCircle2, Lightbulb, AlertCircle,
  Package, Cloud, Users, Zap, Lock, HelpCircle, Link2, Eye,
  AlertTriangle, Globe, Workflow, Fingerprint
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DocSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  subsections?: { id: string; title: string }[];
}

export default function StudioDocs() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [expandedSections, setExpandedSections] = useState<string[]>(["getting-started"]);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const sections: DocSection[] = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <Rocket className="w-5 h-5" />,
      subsections: [
        { id: "what-is-studio", title: "What is Trust Layer Studio?" },
        { id: "creating-project", title: "Creating Your First Project" },
        { id: "interface-overview", title: "Understanding the Interface" },
      ],
      content: (
        <div className="space-y-8">
          <section id="what-is-studio">
            <h3 className="text-2xl font-bold text-white mb-4">What is Trust Layer Studio?</h3>
            <p className="text-white/70 mb-4">
              Trust Layer Studio is a full-featured cloud development environment that lets you write, 
              run, and deploy code directly from your browser. No installation required - just sign in 
              and start building.
            </p>
            <GlassCard className="p-4 bg-cyan-500/10 border-cyan-500/30">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Key Benefits</p>
                  <ul className="text-white/70 text-sm mt-2 space-y-1">
                    <li>• Code from anywhere - browser-based, no local setup</li>
                    <li>• AI-powered assistance to help you write better code</li>
                    <li>• Built-in Git, terminal, and deployment tools</li>
                    <li>• Real-time collaboration with team members</li>
                  </ul>
                </div>
              </div>
            </GlassCard>
          </section>

          <section id="creating-project" className="pt-6">
            <h3 className="text-2xl font-bold text-white mb-4">Creating Your First Project</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold flex-shrink-0">1</div>
                <div>
                  <p className="text-white font-medium">Go to Projects</p>
                  <p className="text-white/60 text-sm">Click "My Projects" from the Studio landing page or navigate to /studio/projects</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold flex-shrink-0">2</div>
                <div>
                  <p className="text-white font-medium">Click "New Project"</p>
                  <p className="text-white/60 text-sm">Choose from 8 templates: React, Node.js, Python, Vue, Next.js, Django, Go, or Rust</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold flex-shrink-0">3</div>
                <div>
                  <p className="text-white font-medium">Name Your Project</p>
                  <p className="text-white/60 text-sm">Give it a descriptive name and optional description, then click Create</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-white font-medium">Start Coding!</p>
                  <p className="text-white/60 text-sm">Your project opens in the editor with starter files ready to go</p>
                </div>
              </div>
            </div>
          </section>

          <section id="interface-overview" className="pt-6">
            <h3 className="text-2xl font-bold text-white mb-4">Understanding the Interface</h3>
            <div className="grid gap-4">
              <GlassCard className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <FolderTree className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-medium">Left Sidebar - File Explorer</span>
                </div>
                <p className="text-white/60 text-sm">Browse, create, rename, and delete files and folders in your project</p>
              </GlassCard>
              <GlassCard className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Code className="w-5 h-5 text-cyan-400" />
                  <span className="text-white font-medium">Center - Code Editor</span>
                </div>
                <p className="text-white/60 text-sm">Write code with syntax highlighting, autocomplete, and error detection</p>
              </GlassCard>
              <GlassCard className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-5 h-5 text-pink-400" />
                  <span className="text-white font-medium">Right Sidebar - AI Assistant</span>
                </div>
                <p className="text-white/60 text-sm">Ask questions, get code suggestions, and debug with AI help</p>
              </GlassCard>
              <GlassCard className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Terminal className="w-5 h-5 text-green-400" />
                  <span className="text-white font-medium">Bottom Panel - Terminal</span>
                </div>
                <p className="text-white/60 text-sm">Run commands, install packages, and see output from your programs</p>
              </GlassCard>
            </div>
          </section>
        </div>
      ),
    },
    {
      id: "editor",
      title: "The Code Editor",
      icon: <Code className="w-5 h-5" />,
      subsections: [
        { id: "editor-basics", title: "Editor Basics" },
        { id: "editor-features", title: "Smart Features" },
        { id: "multi-file", title: "Working with Multiple Files" },
      ],
      content: (
        <div className="space-y-8">
          <section id="editor-basics">
            <h3 className="text-2xl font-bold text-white mb-4">Editor Basics</h3>
            <p className="text-white/70 mb-4">
              Trust Layer Studio uses Monaco Editor - the same editor that powers VS Code. 
              It provides a familiar, powerful coding experience right in your browser.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <Save className="w-5 h-5 text-cyan-400" />
                <div>
                  <span className="text-white">Auto-Save</span>
                  <span className="text-white/50 text-sm ml-2">Your work saves automatically as you type</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <Undo className="w-5 h-5 text-cyan-400" />
                <div>
                  <span className="text-white">Undo/Redo</span>
                  <span className="text-white/50 text-sm ml-2">Ctrl+Z to undo, Ctrl+Shift+Z to redo</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <Search className="w-5 h-5 text-cyan-400" />
                <div>
                  <span className="text-white">Find & Replace</span>
                  <span className="text-white/50 text-sm ml-2">Ctrl+F to find, Ctrl+H to replace</span>
                </div>
              </div>
            </div>
          </section>

          <section id="editor-features" className="pt-6">
            <h3 className="text-2xl font-bold text-white mb-4">Smart Features</h3>
            <div className="grid gap-4">
              <GlassCard className="p-4">
                <p className="text-white font-medium mb-2">Syntax Highlighting</p>
                <p className="text-white/60 text-sm">Code is color-coded based on language - keywords, strings, functions, and comments all have distinct colors for easy reading</p>
              </GlassCard>
              <GlassCard className="p-4">
                <p className="text-white font-medium mb-2">IntelliSense Autocomplete</p>
                <p className="text-white/60 text-sm">As you type, suggestions appear for functions, variables, and properties. Press Tab or Enter to accept a suggestion</p>
              </GlassCard>
              <GlassCard className="p-4">
                <p className="text-white font-medium mb-2">Error Detection</p>
                <p className="text-white/60 text-sm">Red squiggly lines appear under syntax errors. Hover over them to see what's wrong and how to fix it</p>
              </GlassCard>
              <GlassCard className="p-4">
                <p className="text-white font-medium mb-2">Code Folding</p>
                <p className="text-white/60 text-sm">Click the arrows in the gutter to collapse/expand code blocks. Great for navigating large files</p>
              </GlassCard>
            </div>
          </section>

          <section id="multi-file" className="pt-6">
            <h3 className="text-2xl font-bold text-white mb-4">Working with Multiple Files</h3>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                <span>Click files in the explorer to open them as tabs</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                <span>Right-click tabs to close, close others, or close all</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                <span>Drag tabs to reorder them</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                <span>Use Ctrl+Tab to quickly switch between open files</span>
              </li>
            </ul>
          </section>
        </div>
      ),
    },
    {
      id: "file-management",
      title: "File Management",
      icon: <FolderTree className="w-5 h-5" />,
      subsections: [
        { id: "creating-files", title: "Creating Files & Folders" },
        { id: "organizing", title: "Organizing Your Project" },
      ],
      content: (
        <div className="space-y-8">
          <section id="creating-files">
            <h3 className="text-2xl font-bold text-white mb-4">Creating Files & Folders</h3>
            <div className="space-y-4">
              <GlassCard className="p-4">
                <p className="text-white font-medium mb-2">New File</p>
                <p className="text-white/60 text-sm mb-2">Click the + icon in the file explorer header, or right-click in the explorer and select "New File"</p>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
                    <Keyboard className="w-3 h-3 mr-1" /> Ctrl+N
                  </Badge>
                </div>
              </GlassCard>
              <GlassCard className="p-4">
                <p className="text-white font-medium mb-2">New Folder</p>
                <p className="text-white/60 text-sm mb-2">Click the folder+ icon in the file explorer header, or right-click and select "New Folder"</p>
              </GlassCard>
              <GlassCard className="p-4">
                <p className="text-white font-medium mb-2">Rename</p>
                <p className="text-white/60 text-sm mb-2">Right-click any file or folder and select "Rename", or select it and press F2</p>
              </GlassCard>
              <GlassCard className="p-4">
                <p className="text-white font-medium mb-2">Delete</p>
                <p className="text-white/60 text-sm">Right-click and select "Delete". You'll be asked to confirm before deletion</p>
                <div className="mt-2 p-2 bg-red-500/10 rounded border border-red-500/20">
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Deletion is permanent - make sure you want to delete!
                  </p>
                </div>
              </GlassCard>
            </div>
          </section>

          <section id="organizing" className="pt-6">
            <h3 className="text-2xl font-bold text-white mb-4">Organizing Your Project</h3>
            <p className="text-white/70 mb-4">Good project organization makes your code easier to navigate and maintain:</p>
            <div className="bg-slate-800/50 rounded-lg p-4 font-mono text-sm">
              <div className="text-white/80">
                <div className="text-cyan-400">my-project/</div>
                <div className="pl-4 text-white/60">├── src/           <span className="text-white/40"># Your source code</span></div>
                <div className="pl-4 text-white/60">│   ├── components/ <span className="text-white/40"># Reusable UI pieces</span></div>
                <div className="pl-4 text-white/60">│   ├── pages/      <span className="text-white/40"># Page components</span></div>
                <div className="pl-4 text-white/60">│   └── utils/      <span className="text-white/40"># Helper functions</span></div>
                <div className="pl-4 text-white/60">├── public/        <span className="text-white/40"># Static files</span></div>
                <div className="pl-4 text-white/60">├── tests/         <span className="text-white/40"># Test files</span></div>
                <div className="pl-4 text-white/60">└── package.json   <span className="text-white/40"># Dependencies</span></div>
              </div>
            </div>
          </section>
        </div>
      ),
    },
    {
      id: "terminal",
      title: "Using the Terminal",
      icon: <Terminal className="w-5 h-5" />,
      subsections: [
        { id: "terminal-basics", title: "Terminal Basics" },
        { id: "common-commands", title: "Common Commands" },
      ],
      content: (
        <div className="space-y-8">
          <section id="terminal-basics">
            <h3 className="text-2xl font-bold text-white mb-4">Terminal Basics</h3>
            <p className="text-white/70 mb-4">
              The terminal lets you run commands directly. It's at the bottom of the IDE - 
              click the Terminal tab to open it.
            </p>
            <GlassCard className="p-4 bg-cyan-500/10 border-cyan-500/30">
              <p className="text-white font-medium mb-2">What is a terminal?</p>
              <p className="text-white/60 text-sm">
                Think of it as a text-based way to talk to your computer. Instead of clicking buttons, 
                you type commands. It's faster once you learn the basics!
              </p>
            </GlassCard>
          </section>

          <section id="common-commands" className="pt-6">
            <h3 className="text-2xl font-bold text-white mb-4">Common Commands</h3>
            <div className="space-y-3">
              <GlassCard className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <code className="text-cyan-400 font-mono">npm install</code>
                  <Badge variant="outline" className="text-xs">Node.js</Badge>
                </div>
                <p className="text-white/60 text-sm">Install all project dependencies listed in package.json</p>
              </GlassCard>
              <GlassCard className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <code className="text-cyan-400 font-mono">npm run dev</code>
                  <Badge variant="outline" className="text-xs">Node.js</Badge>
                </div>
                <p className="text-white/60 text-sm">Start your development server to preview your app</p>
              </GlassCard>
              <GlassCard className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <code className="text-cyan-400 font-mono">python main.py</code>
                  <Badge variant="outline" className="text-xs">Python</Badge>
                </div>
                <p className="text-white/60 text-sm">Run a Python script</p>
              </GlassCard>
              <GlassCard className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <code className="text-cyan-400 font-mono">pip install package-name</code>
                  <Badge variant="outline" className="text-xs">Python</Badge>
                </div>
                <p className="text-white/60 text-sm">Install a Python package</p>
              </GlassCard>
              <GlassCard className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <code className="text-cyan-400 font-mono">git status</code>
                  <Badge variant="outline" className="text-xs">Git</Badge>
                </div>
                <p className="text-white/60 text-sm">See what files have changed</p>
              </GlassCard>
            </div>
          </section>
        </div>
      ),
    },
    {
      id: "ai-assistant",
      title: "AI Assistant",
      icon: <Sparkles className="w-5 h-5" />,
      subsections: [
        { id: "ai-basics", title: "Using AI Help" },
        { id: "ai-tips", title: "Tips for Better Results" },
        { id: "ai-credits", title: "Understanding Credits" },
        { id: "agent-mode", title: "Agent Mode" },
        { id: "apply-code", title: "Apply Code from AI" },
      ],
      content: (
        <div className="space-y-8">
          <section id="ai-basics">
            <h3 className="text-2xl font-bold text-white mb-4">Using AI Help</h3>
            <p className="text-white/70 mb-4">
              The AI Assistant is your coding partner. Find it in the right sidebar - 
              just type your question and get instant help.
            </p>
            <div className="space-y-3">
              <GlassCard className="p-4">
                <p className="text-white font-medium mb-2">Ask Questions</p>
                <p className="text-white/60 text-sm">"How do I create a button in React?"</p>
              </GlassCard>
              <GlassCard className="p-4">
                <p className="text-white font-medium mb-2">Debug Errors</p>
                <p className="text-white/60 text-sm">"Why am I getting 'undefined is not a function'?"</p>
              </GlassCard>
              <GlassCard className="p-4">
                <p className="text-white font-medium mb-2">Generate Code</p>
                <p className="text-white/60 text-sm">"Write a function to validate an email address"</p>
              </GlassCard>
              <GlassCard className="p-4">
                <p className="text-white font-medium mb-2">Explain Code</p>
                <p className="text-white/60 text-sm">"What does this regex do: /^[a-z]+$/i"</p>
              </GlassCard>
            </div>
          </section>

          <section id="ai-tips" className="pt-6">
            <h3 className="text-2xl font-bold text-white mb-4">Tips for Better Results</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 flex-shrink-0 mt-0.5">✓</div>
                <div>
                  <p className="text-white">Be specific about what you want</p>
                  <p className="text-white/50 text-sm">Instead of "make a form", say "make a login form with email and password fields"</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 flex-shrink-0 mt-0.5">✓</div>
                <div>
                  <p className="text-white">Include the language or framework</p>
                  <p className="text-white/50 text-sm">"In React with TypeScript, how do I..."</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 flex-shrink-0 mt-0.5">✓</div>
                <div>
                  <p className="text-white">Share error messages</p>
                  <p className="text-white/50 text-sm">Copy and paste the exact error for better debugging help</p>
                </div>
              </li>
            </ul>
          </section>

          <section id="ai-credits" className="pt-6">
            <h3 className="text-2xl font-bold text-white mb-4">Understanding Credits</h3>
            <GlassCard className="p-4 bg-purple-500/10 border-purple-500/30">
              <p className="text-white/70 mb-3">
                AI features use credits. Each request costs credits based on the mode you use.
              </p>
              <div className="flex items-center gap-4 text-sm flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-white/60">Chat mode: $0.05/request</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-white/60">Agent mode: $0.25/session</span>
                </div>
              </div>
            </GlassCard>
          </section>

          <section id="agent-mode" className="pt-6">
            <h3 className="text-2xl font-bold text-white mb-4">Agent Mode</h3>
            <p className="text-white/70 mb-4">
              Agent Mode transforms the AI from a simple chat assistant into an autonomous developer. 
              Toggle it on in the AI panel and describe a task — the agent will read your files, 
              plan changes, and execute them across your project.
            </p>
            <GlassCard className="p-4 bg-amber-500/10 border-amber-500/30">
              <p className="text-white font-medium mb-2">What Agent Mode can do:</p>
              <ul className="text-white/60 text-sm space-y-1">
                <li>Read and understand all project files</li>
                <li>Create new files and modify existing ones</li>
                <li>Refactor code across multiple files</li>
                <li>Add features based on natural language descriptions</li>
              </ul>
            </GlassCard>
            <p className="text-white/50 text-sm mt-3">
              Shortcut: <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs">Ctrl+Shift+K</kbd> to activate Agent Mode
            </p>
          </section>

          <section id="apply-code" className="pt-6">
            <h3 className="text-2xl font-bold text-white mb-4">Apply Code from AI</h3>
            <p className="text-white/70 mb-4">
              When the AI suggests code, you'll see "Apply" and "Copy" buttons on every code block. 
              Click "Apply" to insert the code directly into your active editor — no manual copy-pasting needed. 
              If the AI creates a new file, click "Create" to add it to your project instantly.
            </p>
          </section>
        </div>
      ),
    },
    {
      id: "command-palette",
      title: "Command Palette",
      icon: <Keyboard className="w-5 h-5" />,
      subsections: [
        { id: "palette-basics", title: "Using the Command Palette" },
        { id: "palette-actions", title: "Available Actions" },
      ],
      content: (
        <div className="space-y-8">
          <section id="palette-basics">
            <h3 className="text-2xl font-bold text-white mb-4">Using the Command Palette</h3>
            <p className="text-white/70 mb-4">
              Press <kbd className="px-2 py-1 bg-white/10 rounded text-sm">Ctrl+K</kbd> (or click the command icon in the toolbar) 
              to open the Command Palette. Start typing to search for any action, file, or command available in the IDE.
            </p>
            <GlassCard className="p-4">
              <p className="text-white font-medium mb-2">Quick Tips</p>
              <ul className="text-white/60 text-sm space-y-1">
                <li>Type a filename to quickly open it</li>
                <li>Type an action like "deploy" or "save" to find commands</li>
                <li>Press Enter to execute the first matching result</li>
                <li>Press Escape to close</li>
              </ul>
            </GlassCard>
          </section>
          <section id="palette-actions" className="pt-6">
            <h3 className="text-2xl font-bold text-white mb-4">Available Actions</h3>
            <div className="grid gap-2">
              {[
                { name: "Save File", shortcut: "Ctrl+S" },
                { name: "Open AI Assistant", shortcut: "Ctrl+I" },
                { name: "Toggle Agent Mode", shortcut: "Ctrl+Shift+K" },
                { name: "Split Editor", shortcut: "via palette" },
                { name: "TrustHub Stamp Code", shortcut: "via palette" },
                { name: "Deploy Project", shortcut: "via palette" },
                { name: "Run CI/CD Pipeline", shortcut: "via palette" },
              ].map(item => (
                <div key={item.name} className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/10">
                  <span className="text-sm text-white/70">{item.name}</span>
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs text-cyan-400">{item.shortcut}</kbd>
                </div>
              ))}
            </div>
          </section>
        </div>
      ),
    },
    {
      id: "split-view",
      title: "Split View",
      icon: <Code className="w-5 h-5" />,
      subsections: [
        { id: "split-basics", title: "Using Split View" },
      ],
      content: (
        <div className="space-y-8">
          <section id="split-basics">
            <h3 className="text-2xl font-bold text-white mb-4">Using Split View</h3>
            <p className="text-white/70 mb-4">
              Split View lets you work on two files side by side. Click the split icon in the toolbar 
              or use the Command Palette to split horizontally (side by side) or vertically (top and bottom).
            </p>
            <GlassCard className="p-4">
              <p className="text-white font-medium mb-2">How to Split</p>
              <ul className="text-white/60 text-sm space-y-1">
                <li>Click the split icon in the toolbar to split right</li>
                <li>Open Command Palette and search "Split Editor Right" or "Split Editor Down"</li>
                <li>Click the X on the split pane header to close it</li>
                <li>Each pane can independently edit its file</li>
              </ul>
            </GlassCard>
          </section>
        </div>
      ),
    },
    {
      id: "trusthub",
      title: "TrustHub (Blockchain)",
      icon: <Shield className="w-5 h-5" />,
      subsections: [
        { id: "trusthub-what", title: "What is TrustHub?" },
        { id: "trusthub-stamp", title: "Stamping Your Code" },
      ],
      content: (
        <div className="space-y-8">
          <section id="trusthub-what">
            <h3 className="text-2xl font-bold text-white mb-4">What is TrustHub?</h3>
            <p className="text-white/70 mb-4">
              TrustHub is blockchain-verified code provenance — every time you stamp your code, 
              a SHA-256 hash of your project files is recorded on the Trust Layer blockchain. 
              This creates a permanent, tamper-proof record that proves when your code existed 
              and what it contained.
            </p>
            <GlassCard className="p-4 bg-indigo-500/10 border-indigo-500/30">
              <p className="text-white font-medium mb-2">Why It Matters</p>
              <ul className="text-white/60 text-sm space-y-1">
                <li>Prove code ownership with blockchain verification</li>
                <li>Tamper-proof audit trail of every version</li>
                <li>Verify deployed code matches your source</li>
                <li>Legal-grade timestamping for IP protection</li>
              </ul>
            </GlassCard>
          </section>
          <section id="trusthub-stamp" className="pt-6">
            <h3 className="text-2xl font-bold text-white mb-4">Stamping Your Code</h3>
            <p className="text-white/70 mb-4">
              Click the "Stamp Code" button in the TrustHub panel (bottom bar) or use the Command Palette. 
              Each stamp creates a unique transaction hash on the Trust Layer blockchain with your 
              project's file tree hash, block number, and timestamp.
            </p>
            <p className="text-white/50 text-sm">
              View your stamps history in the TrustHub tab at the bottom of the IDE.
            </p>
          </section>
        </div>
      ),
    },
    {
      id: "git",
      title: "Version Control (Git)",
      icon: <GitBranch className="w-5 h-5" />,
      subsections: [
        { id: "git-what", title: "What is Git?" },
        { id: "git-basics", title: "Basic Git Workflow" },
      ],
      content: (
        <div className="space-y-8">
          <section id="git-what">
            <h3 className="text-2xl font-bold text-white mb-4">What is Git?</h3>
            <p className="text-white/70 mb-4">
              Git is like a time machine for your code. It saves snapshots of your project 
              so you can go back to any previous version if something breaks.
            </p>
            <GlassCard className="p-4 bg-cyan-500/10 border-cyan-500/30">
              <p className="text-white font-medium mb-2">Why use Git?</p>
              <ul className="text-white/60 text-sm space-y-1">
                <li>• Never lose code - even if you delete something by accident</li>
                <li>• See what changed and when</li>
                <li>• Work with others without overwriting each other's code</li>
                <li>• Experiment safely - you can always go back</li>
              </ul>
            </GlassCard>
          </section>

          <section id="git-basics" className="pt-6">
            <h3 className="text-2xl font-bold text-white mb-4">Basic Git Workflow</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold flex-shrink-0">1</div>
                <div>
                  <p className="text-white font-medium">Make Changes</p>
                  <p className="text-white/60 text-sm">Edit your files as normal. Git tracks what changed</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold flex-shrink-0">2</div>
                <div>
                  <p className="text-white font-medium">Stage Changes</p>
                  <p className="text-white/60 text-sm">Select which changes to include in your snapshot</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold flex-shrink-0">3</div>
                <div>
                  <p className="text-white font-medium">Commit</p>
                  <p className="text-white/60 text-sm">Save the snapshot with a message describing what you did</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold flex-shrink-0">4</div>
                <div>
                  <p className="text-white font-medium">Push (Optional)</p>
                  <p className="text-white/60 text-sm">Upload your commits to GitHub or another remote repository</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      ),
    },
    {
      id: "deployment",
      title: "Deploying Your App",
      icon: <Rocket className="w-5 h-5" />,
      subsections: [
        { id: "deploy-what", title: "What is Deployment?" },
        { id: "deploy-how", title: "How to Deploy" },
      ],
      content: (
        <div className="space-y-8">
          <section id="deploy-what">
            <h3 className="text-2xl font-bold text-white mb-4">What is Deployment?</h3>
            <p className="text-white/70 mb-4">
              Deployment means making your app available on the internet so anyone can use it. 
              Instead of running only on your computer, it runs on a server 24/7.
            </p>
            <GlassCard className="p-4 bg-green-500/10 border-green-500/30">
              <p className="text-white font-medium mb-2">After deploying, you get:</p>
              <ul className="text-white/60 text-sm space-y-1">
                <li>• A public URL anyone can visit</li>
                <li>• Your app runs even when you're not online</li>
                <li>• Automatic updates when you deploy new versions</li>
              </ul>
            </GlassCard>
          </section>

          <section id="deploy-how" className="pt-6">
            <h3 className="text-2xl font-bold text-white mb-4">How to Deploy</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold flex-shrink-0">1</div>
                <div>
                  <p className="text-white font-medium">Click the Deploy Tab</p>
                  <p className="text-white/60 text-sm">Find the rocket icon in the IDE sidebar</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold flex-shrink-0">2</div>
                <div>
                  <p className="text-white font-medium">Configure Settings</p>
                  <p className="text-white/60 text-sm">Choose your environment and any environment variables needed</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold flex-shrink-0">3</div>
                <div>
                  <p className="text-white font-medium">Click Deploy</p>
                  <p className="text-white/60 text-sm">Wait for the build process to complete</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-white font-medium">Share Your URL!</p>
                  <p className="text-white/60 text-sm">Your app is live. Copy the URL and share it with the world</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      ),
    },
    {
      id: "github-integration",
      title: "GitHub Integration",
      icon: <GitBranch className="w-5 h-5" />,
      subsections: [
        { id: "github-connect", title: "Connecting Your GitHub" },
        { id: "github-repos", title: "Working with Repos" },
        { id: "github-push", title: "Pushing Changes" },
      ],
      content: (
        <div className="space-y-8">
          <section id="github-connect">
            <h3 className="text-2xl font-bold text-white mb-4">Connecting Your GitHub</h3>
            <p className="text-white/70 mb-4">
              Link your GitHub account to push code directly from Studio to your repositories. 
              This lets you version control your work and collaborate with others.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold flex-shrink-0">1</div>
                <div>
                  <p className="text-white font-medium">Open Integrations Hub</p>
                  <p className="text-white/60 text-sm">Click the link icon in the toolbar or use the Command Palette and search "Integrations"</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold flex-shrink-0">2</div>
                <div>
                  <p className="text-white font-medium">Click "Connect" on GitHub</p>
                  <p className="text-white/60 text-sm">You'll be redirected to GitHub to authorize access to your account</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-white font-medium">You're Connected</p>
                  <p className="text-white/60 text-sm">The status bar at the bottom will show a green dot next to "GitHub"</p>
                </div>
              </div>
            </div>
            <GlassCard className="p-4 bg-amber-500/10 border-amber-500/30 mt-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Setup Required</p>
                  <p className="text-white/60 text-sm">GitHub integration requires a GitHub OAuth App to be configured by the platform admin. Contact team@dwsc.io if the Connect button shows "Configure".</p>
                </div>
              </div>
            </GlassCard>
          </section>

          <section id="github-repos" className="pt-6">
            <h3 className="text-2xl font-bold text-white mb-4">Working with Repos</h3>
            <p className="text-white/70 mb-4">
              Once connected, you can browse your repositories and select one to push code to.
            </p>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                <span>Open the Integrations Hub and click "View Repos" under GitHub</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                <span>Click on a repository to select it as your active repo</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                <span>The selected repo will be highlighted in cyan with a checkmark</span>
              </li>
            </ul>
          </section>

          <section id="github-push" className="pt-6">
            <h3 className="text-2xl font-bold text-white mb-4">Pushing Changes</h3>
            <p className="text-white/70 mb-4">
              Push your project files to GitHub with one click. Use the Git tab in the bottom panel 
              or the Command Palette.
            </p>
            <div className="space-y-3">
              <GlassCard className="p-4">
                <p className="text-white font-medium mb-2">From the Git Tab</p>
                <p className="text-white/60 text-sm">Write a commit message in the Git panel at the bottom, then click "Push"</p>
              </GlassCard>
              <GlassCard className="p-4">
                <p className="text-white font-medium mb-2">From Command Palette</p>
                <p className="text-white/60 text-sm">Press Ctrl+K, search "Push to GitHub", and hit Enter</p>
              </GlassCard>
            </div>
          </section>
        </div>
      ),
    },
    {
      id: "vercel-deploy",
      title: "Vercel Deploy",
      icon: <Cloud className="w-5 h-5" />,
      subsections: [
        { id: "vercel-connect", title: "Connecting Vercel" },
        { id: "vercel-deploying", title: "Deploying Your App" },
      ],
      content: (
        <div className="space-y-8">
          <section id="vercel-connect">
            <h3 className="text-2xl font-bold text-white mb-4">Connecting Vercel</h3>
            <p className="text-white/70 mb-4">
              Deploy your projects to Vercel directly from Studio. You'll need a Vercel API token.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold flex-shrink-0">1</div>
                <div>
                  <p className="text-white font-medium">Get a Vercel Token</p>
                  <p className="text-white/60 text-sm">Go to vercel.com → Settings → Tokens → Create new token</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold flex-shrink-0">2</div>
                <div>
                  <p className="text-white font-medium">Open Integrations Hub</p>
                  <p className="text-white/60 text-sm">Click the link icon in the toolbar or press Ctrl+K and search "Integrations"</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold flex-shrink-0">3</div>
                <div>
                  <p className="text-white font-medium">Paste Your Token</p>
                  <p className="text-white/60 text-sm">Enter your token in the Vercel section and click Connect</p>
                </div>
              </div>
            </div>
          </section>

          <section id="vercel-deploying" className="pt-6">
            <h3 className="text-2xl font-bold text-white mb-4">Deploying Your App</h3>
            <p className="text-white/70 mb-4">
              Once connected, deploy with one click from the Deploy tab or Command Palette.
            </p>
            <GlassCard className="p-4 bg-green-500/10 border-green-500/30">
              <p className="text-white font-medium mb-2">After deploying:</p>
              <ul className="text-white/60 text-sm space-y-1">
                <li>• Your app goes through build → ready → live stages</li>
                <li>• The deployment URL appears in the Deploy tab</li>
                <li>• Build logs show in real-time</li>
                <li>• The status bar shows deployment progress</li>
              </ul>
            </GlassCard>
          </section>
        </div>
      ),
    },
    {
      id: "live-preview",
      title: "Live Preview",
      icon: <Globe className="w-5 h-5" />,
      subsections: [
        { id: "preview-start", title: "Starting the Preview" },
        { id: "preview-auto", title: "Auto-Refresh on Save" },
      ],
      content: (
        <div className="space-y-8">
          <section id="preview-start">
            <h3 className="text-2xl font-bold text-white mb-4">Starting the Preview</h3>
            <p className="text-white/70 mb-4">
              The right panel shows a live preview of your web project. Click the play button 
              or use the "Start Preview" button to launch the dev server.
            </p>
            <div className="space-y-3">
              <GlassCard className="p-4">
                <p className="text-white font-medium mb-2">Preview Controls</p>
                <ul className="text-white/60 text-sm space-y-1">
                  <li>• <span className="text-green-400">▶ Play</span> — Start the dev server</li>
                  <li>• <span className="text-cyan-400">↻ Refresh</span> — Reload the preview</li>
                  <li>• <span className="text-red-400">■ Stop</span> — Stop the dev server</li>
                  <li>• <span className="text-white/60">↗ External</span> — Open in a new browser tab</li>
                </ul>
              </GlassCard>
            </div>
          </section>

          <section id="preview-auto" className="pt-6">
            <h3 className="text-2xl font-bold text-white mb-4">Auto-Refresh on Save</h3>
            <p className="text-white/70 mb-4">
              When the preview is running and you save a file (Ctrl+S), the preview automatically 
              refreshes to show your latest changes. No manual refresh needed.
            </p>
            <GlassCard className="p-4 bg-cyan-500/10 border-cyan-500/30">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <p className="text-white/60 text-sm">The green dot next to "Preview" in the panel header means the dev server is running and responding.</p>
              </div>
            </GlassCard>
          </section>
        </div>
      ),
    },
    {
      id: "problems-diagnostics",
      title: "Problems & Diagnostics",
      icon: <AlertTriangle className="w-5 h-5" />,
      subsections: [
        { id: "diagnostics-panel", title: "The Problems Panel" },
        { id: "diagnostics-lint", title: "Linting on Save" },
      ],
      content: (
        <div className="space-y-8">
          <section id="diagnostics-panel">
            <h3 className="text-2xl font-bold text-white mb-4">The Problems Panel</h3>
            <p className="text-white/70 mb-4">
              The Problems tab in the bottom panel shows errors, warnings, and info messages 
              from your code. Click the tab to see all issues across your project.
            </p>
            <div className="space-y-3">
              <GlassCard className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-4 h-4 rounded bg-red-500/20 flex items-center justify-center">
                    <span className="text-red-400 text-xs">✕</span>
                  </div>
                  <span className="text-white font-medium">Errors (Red)</span>
                </div>
                <p className="text-white/60 text-sm">Code that won't work — must fix before running</p>
              </GlassCard>
              <GlassCard className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-4 h-4 rounded bg-amber-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-2.5 h-2.5 text-amber-400" />
                  </div>
                  <span className="text-white font-medium">Warnings (Amber)</span>
                </div>
                <p className="text-white/60 text-sm">Potential issues — code works but could cause problems</p>
              </GlassCard>
              <GlassCard className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-4 h-4 rounded bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-400 text-xs">i</span>
                  </div>
                  <span className="text-white font-medium">Info (Blue)</span>
                </div>
                <p className="text-white/60 text-sm">Suggestions to improve your code style or performance</p>
              </GlassCard>
            </div>
          </section>

          <section id="diagnostics-lint" className="pt-6">
            <h3 className="text-2xl font-bold text-white mb-4">Linting on Save</h3>
            <p className="text-white/70 mb-4">
              Every time you save a file, Studio automatically runs lint checks and updates 
              the Problems panel. The tab shows error/warning counts so you can spot issues at a glance.
            </p>
            <GlassCard className="p-4 bg-purple-500/10 border-purple-500/30">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <p className="text-white/60 text-sm">You can also run lint manually by clicking the "Lint" button in the Problems panel or using the Command Palette (Ctrl+K → "Run Lint Check").</p>
              </div>
            </GlassCard>
          </section>
        </div>
      ),
    },
    {
      id: "integrations-hub",
      title: "Integrations Hub",
      icon: <Link2 className="w-5 h-5" />,
      subsections: [
        { id: "hub-overview", title: "Overview" },
        { id: "hub-status", title: "Status Bar" },
      ],
      content: (
        <div className="space-y-8">
          <section id="hub-overview">
            <h3 className="text-2xl font-bold text-white mb-4">Integrations Hub</h3>
            <p className="text-white/70 mb-4">
              The Integrations Hub is your central dashboard for connecting external services. 
              Open it by clicking the link icon in the toolbar or pressing Ctrl+K and searching "Integrations".
            </p>
            <div className="space-y-3">
              <GlassCard className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <GitBranch className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">GitHub</span>
                </div>
                <p className="text-white/60 text-sm">Connect, browse repos, select active repo, push code</p>
              </GlassCard>
              <GlassCard className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Rocket className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">Vercel</span>
                </div>
                <p className="text-white/60 text-sm">Connect with API token, deploy projects, view deployment URLs</p>
              </GlassCard>
              <GlassCard className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Fingerprint className="w-5 h-5 text-indigo-400" />
                  <span className="text-white font-medium">TrustHub</span>
                </div>
                <p className="text-white/60 text-sm">Built-in blockchain code provenance — always active</p>
              </GlassCard>
            </div>
          </section>

          <section id="hub-status" className="pt-6">
            <h3 className="text-2xl font-bold text-white mb-4">Status Bar</h3>
            <p className="text-white/70 mb-4">
              The status bar at the very bottom of Studio shows connection indicators for all integrations:
            </p>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                <span>Green dot = connected and active</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-600 mt-1.5 flex-shrink-0" />
                <span>Gray dot = not connected</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                <span>Purple dot = TrustHub (always active)</span>
              </li>
            </ul>
            <p className="text-white/50 text-sm mt-3">
              The status bar also shows the current file type, encoding, and Studio version.
            </p>
          </section>
        </div>
      ),
    },
    {
      id: "cicd-pipelines",
      title: "CI/CD Pipelines",
      icon: <Workflow className="w-5 h-5" />,
      subsections: [
        { id: "cicd-what", title: "What is CI/CD?" },
        { id: "cicd-run", title: "Running Pipelines" },
      ],
      content: (
        <div className="space-y-8">
          <section id="cicd-what">
            <h3 className="text-2xl font-bold text-white mb-4">What is CI/CD?</h3>
            <p className="text-white/70 mb-4">
              CI/CD (Continuous Integration / Continuous Deployment) automatically builds, tests, 
              and deploys your code. Studio includes a real pipeline runner — not a simulation.
            </p>
            <GlassCard className="p-4 bg-cyan-500/10 border-cyan-500/30">
              <p className="text-white font-medium mb-2">Pipeline Templates</p>
              <ul className="text-white/60 text-sm space-y-1">
                <li>• <span className="text-white">Node.js Standard</span> — install → lint → test → build</li>
                <li>• <span className="text-white">Python</span> — install → pytest</li>
                <li>• <span className="text-white">Rust</span> — cargo check → cargo test → cargo build</li>
              </ul>
            </GlassCard>
          </section>

          <section id="cicd-run" className="pt-6">
            <h3 className="text-2xl font-bold text-white mb-4">Running Pipelines</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold flex-shrink-0">1</div>
                <div>
                  <p className="text-white font-medium">Open the CI/CD Tab</p>
                  <p className="text-white/60 text-sm">Click "CI/CD" in the bottom panel tabs</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold flex-shrink-0">2</div>
                <div>
                  <p className="text-white font-medium">Choose or Create a Pipeline</p>
                  <p className="text-white/60 text-sm">Select from existing pipelines or create from a template</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold flex-shrink-0">3</div>
                <div>
                  <p className="text-white font-medium">Click "Run Pipeline"</p>
                  <p className="text-white/60 text-sm">Each step runs with real output — you'll see pass/fail for each step with timing</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      ),
    },
    {
      id: "keyboard-shortcuts",
      title: "Keyboard Shortcuts",
      icon: <Keyboard className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white mb-4">Essential Shortcuts</h3>
          <p className="text-white/70 mb-4">
            Master these shortcuts to code faster. They work just like in VS Code!
          </p>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">File Operations</h4>
              <div className="grid gap-2">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/70">New File</span>
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-cyan-400 font-mono text-sm">Ctrl+N</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/70">Save File</span>
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-cyan-400 font-mono text-sm">Ctrl+S</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/70">Close Tab</span>
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-cyan-400 font-mono text-sm">Ctrl+W</kbd>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Editing</h4>
              <div className="grid gap-2">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/70">Undo</span>
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-cyan-400 font-mono text-sm">Ctrl+Z</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/70">Redo</span>
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-cyan-400 font-mono text-sm">Ctrl+Shift+Z</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/70">Find</span>
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-cyan-400 font-mono text-sm">Ctrl+F</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/70">Find & Replace</span>
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-cyan-400 font-mono text-sm">Ctrl+H</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/70">Comment Line</span>
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-cyan-400 font-mono text-sm">Ctrl+/</kbd>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Navigation</h4>
              <div className="grid gap-2">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/70">Go to Line</span>
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-cyan-400 font-mono text-sm">Ctrl+G</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/70">Quick Open File</span>
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-cyan-400 font-mono text-sm">Ctrl+P</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/70">Command Palette</span>
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-cyan-400 font-mono text-sm">Ctrl+K</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/70">AI Assistant</span>
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-cyan-400 font-mono text-sm">Ctrl+I</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/70">Agent Mode</span>
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-cyan-400 font-mono text-sm">Ctrl+Shift+K</kbd>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Terminal</h4>
              <div className="grid gap-2">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/70">Toggle Terminal</span>
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-cyan-400 font-mono text-sm">Ctrl+`</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/70">Run Code</span>
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-cyan-400 font-mono text-sm">F5</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "resources",
      title: "Learning Resources",
      icon: <Lightbulb className="w-5 h-5" />,
      subsections: [
        { id: "free-courses", title: "Free Courses & Tutorials" },
        { id: "recommended-reading", title: "Recommended Reading" },
        { id: "practice-projects", title: "Practice Projects" },
      ],
      content: (
        <div className="space-y-8">
          <section id="free-courses">
            <h3 className="text-2xl font-bold text-white mb-4">Free Courses & Tutorials</h3>
            <p className="text-white/70 mb-4">
              The best way to learn coding is through structured courses. Here are some excellent free resources:
            </p>
            <div className="space-y-4">
              <GlassCard className="p-4 hover:border-cyan-500/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <a href="https://www.freecodecamp.org" target="_blank" rel="noopener noreferrer" className="text-white font-medium hover:text-cyan-400 transition-colors">
                      freeCodeCamp
                    </a>
                    <p className="text-white/60 text-sm mt-1">
                      Free, self-paced courses covering HTML, CSS, JavaScript, Python, and more. 
                      Earn certifications as you complete projects.
                    </p>
                    <Badge className="mt-2 bg-green-500/20 text-green-400 border-green-500/30">Beginner Friendly</Badge>
                  </div>
                </div>
              </GlassCard>
              <GlassCard className="p-4 hover:border-cyan-500/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <a href="https://www.theodinproject.com" target="_blank" rel="noopener noreferrer" className="text-white font-medium hover:text-cyan-400 transition-colors">
                      The Odin Project
                    </a>
                    <p className="text-white/60 text-sm mt-1">
                      A full-stack curriculum that takes you from zero to job-ready. 
                      Covers web development fundamentals, JavaScript, React, and Node.js.
                    </p>
                    <Badge className="mt-2 bg-blue-500/20 text-blue-400 border-blue-500/30">Full Stack</Badge>
                  </div>
                </div>
              </GlassCard>
              <GlassCard className="p-4 hover:border-cyan-500/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <a href="https://javascript.info" target="_blank" rel="noopener noreferrer" className="text-white font-medium hover:text-cyan-400 transition-colors">
                      JavaScript.info
                    </a>
                    <p className="text-white/60 text-sm mt-1">
                      The most comprehensive JavaScript tutorial on the web. 
                      From basics to advanced topics, with interactive examples.
                    </p>
                    <Badge className="mt-2 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">JavaScript Deep Dive</Badge>
                  </div>
                </div>
              </GlassCard>
              <GlassCard className="p-4 hover:border-cyan-500/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                    <Terminal className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <a href="https://www.codecademy.com" target="_blank" rel="noopener noreferrer" className="text-white font-medium hover:text-cyan-400 transition-colors">
                      Codecademy
                    </a>
                    <p className="text-white/60 text-sm mt-1">
                      Interactive coding lessons in Python, JavaScript, SQL, and more. 
                      Free tier available with many courses.
                    </p>
                    <Badge className="mt-2 bg-purple-500/20 text-purple-400 border-purple-500/30">Interactive</Badge>
                  </div>
                </div>
              </GlassCard>
            </div>
          </section>

          <section id="recommended-reading" className="pt-6">
            <h3 className="text-2xl font-bold text-white mb-4">Recommended Reading</h3>
            <p className="text-white/70 mb-4">
              Books and articles that will deepen your understanding:
            </p>
            <div className="space-y-3">
              <GlassCard className="p-4">
                <p className="text-white font-medium">"Eloquent JavaScript" by Marijn Haverbeke</p>
                <p className="text-white/60 text-sm mt-1">Free online book covering JavaScript from the ground up. Great for understanding the language deeply.</p>
                <a href="https://eloquentjavascript.net" target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-sm hover:underline mt-2 inline-block">
                  Read free online →
                </a>
              </GlassCard>
              <GlassCard className="p-4">
                <p className="text-white font-medium">"You Don't Know JS" by Kyle Simpson</p>
                <p className="text-white/60 text-sm mt-1">A deep dive into JavaScript mechanics. Perfect for intermediate developers wanting to level up.</p>
                <a href="https://github.com/getify/You-Dont-Know-JS" target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-sm hover:underline mt-2 inline-block">
                  Read on GitHub →
                </a>
              </GlassCard>
              <GlassCard className="p-4">
                <p className="text-white font-medium">"The Missing Semester of Your CS Education" - MIT</p>
                <p className="text-white/60 text-sm mt-1">Learn essential developer tools: command line, Git, debugging, and more. Skills every developer needs.</p>
                <a href="https://missing.csail.mit.edu" target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-sm hover:underline mt-2 inline-block">
                  View course →
                </a>
              </GlassCard>
              <GlassCard className="p-4">
                <p className="text-white font-medium">"React Documentation"</p>
                <p className="text-white/60 text-sm mt-1">The official React docs are excellent. Interactive tutorials and in-depth guides from the React team.</p>
                <a href="https://react.dev/learn" target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-sm hover:underline mt-2 inline-block">
                  Start learning React →
                </a>
              </GlassCard>
            </div>
          </section>

          <section id="practice-projects" className="pt-6">
            <h3 className="text-2xl font-bold text-white mb-4">Practice Projects</h3>
            <p className="text-white/70 mb-4">
              The best way to learn is by building. Start with these project ideas:
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <GlassCard className="p-4 bg-gradient-to-br from-cyan-500/10 to-transparent">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-green-400 text-xs font-medium">BEGINNER</span>
                </div>
                <p className="text-white font-medium">Todo List App</p>
                <p className="text-white/60 text-sm mt-1">Add, complete, and delete tasks. Learn state management basics.</p>
              </GlassCard>
              <GlassCard className="p-4 bg-gradient-to-br from-cyan-500/10 to-transparent">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-green-400 text-xs font-medium">BEGINNER</span>
                </div>
                <p className="text-white font-medium">Weather App</p>
                <p className="text-white/60 text-sm mt-1">Fetch data from an API and display it beautifully.</p>
              </GlassCard>
              <GlassCard className="p-4 bg-gradient-to-br from-yellow-500/10 to-transparent">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span className="text-yellow-400 text-xs font-medium">INTERMEDIATE</span>
                </div>
                <p className="text-white font-medium">Blog Platform</p>
                <p className="text-white/60 text-sm mt-1">Create, edit, and display blog posts with a database backend.</p>
              </GlassCard>
              <GlassCard className="p-4 bg-gradient-to-br from-yellow-500/10 to-transparent">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span className="text-yellow-400 text-xs font-medium">INTERMEDIATE</span>
                </div>
                <p className="text-white font-medium">E-commerce Store</p>
                <p className="text-white/60 text-sm mt-1">Product listings, cart, and checkout flow with payments.</p>
              </GlassCard>
              <GlassCard className="p-4 bg-gradient-to-br from-purple-500/10 to-transparent">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="text-purple-400 text-xs font-medium">ADVANCED</span>
                </div>
                <p className="text-white font-medium">Real-time Chat App</p>
                <p className="text-white/60 text-sm mt-1">WebSocket connections, user authentication, message history.</p>
              </GlassCard>
              <GlassCard className="p-4 bg-gradient-to-br from-purple-500/10 to-transparent">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="text-purple-400 text-xs font-medium">ADVANCED</span>
                </div>
                <p className="text-white font-medium">AI-Powered Tool</p>
                <p className="text-white/60 text-sm mt-1">Integrate OpenAI API to build something intelligent.</p>
              </GlassCard>
            </div>

            <GlassCard className="mt-6 p-4 bg-cyan-500/10 border-cyan-500/30">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Pro Tip: Build in Public</p>
                  <p className="text-white/60 text-sm mt-1">
                    Share your progress on social media as you build. You'll stay motivated, 
                    get feedback, and connect with other developers. Use #BuildInPublic and #TrustLayerStudio!
                  </p>
                </div>
              </div>
            </GlassCard>
          </section>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/studio">
            <Button variant="ghost" className="text-white/60 hover:text-white mb-4" data-testid="link-back-studio">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Studio
            </Button>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                  Trust Layer Studio Documentation
                </h1>
                <p className="text-white/60 mt-1">
                  Learn how to use every feature of the IDE
                </p>
              </div>
            </div>
            <Link href="/studio/projects">
              <Button
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold"
                data-testid="button-start-building-top"
              >
                <Rocket className="w-4 h-4 mr-2" />
                Start Building Now
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] lg:overflow-y-auto"
          >
            <GlassCard className="p-4" glow>
              <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
                Documentation
              </h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <div key={section.id}>
                    <button
                      onClick={() => {
                        setActiveSection(section.id);
                        toggleSection(section.id);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                        activeSection === section.id
                          ? "bg-cyan-500/20 text-cyan-400"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                      data-testid={`nav-${section.id}`}
                    >
                      <div className="flex items-center gap-3">
                        {section.icon}
                        <span className="font-medium">{section.title}</span>
                      </div>
                      {section.subsections && (
                        expandedSections.includes(section.id) 
                          ? <ChevronDown className="w-4 h-4" />
                          : <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    <AnimatePresence>
                      {section.subsections && expandedSections.includes(section.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-8 py-1 space-y-1">
                            {section.subsections.map((sub) => (
                              <a
                                key={sub.id}
                                href={`#${sub.id}`}
                                onClick={() => setActiveSection(section.id)}
                                className="block px-3 py-1.5 text-sm text-white/50 hover:text-white/80 rounded transition-colors"
                              >
                                {sub.title}
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </nav>
              
              <div className="mt-6 pt-4 border-t border-white/10">
                <Link href="/studio/projects">
                  <Button
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold"
                    data-testid="button-start-building-sidebar"
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    Start Building
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </motion.aside>

          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6 sm:p-8" glow>
              {sections.find((s) => s.id === activeSection)?.content}
            </GlassCard>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex gap-2">
                {sections.map((section, idx) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      activeSection === section.id
                        ? "bg-cyan-500"
                        : "bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-3">
                {sections.findIndex((s) => s.id === activeSection) > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      const idx = sections.findIndex((s) => s.id === activeSection);
                      setActiveSection(sections[idx - 1].id);
                    }}
                    className="border-white/20 text-white hover:bg-white/10"
                    data-testid="button-prev-section"
                  >
                    Previous
                  </Button>
                )}
                {sections.findIndex((s) => s.id === activeSection) < sections.length - 1 ? (
                  <Button
                    onClick={() => {
                      const idx = sections.findIndex((s) => s.id === activeSection);
                      setActiveSection(sections[idx + 1].id);
                    }}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white"
                    data-testid="button-next-section"
                  >
                    Next Section
                  </Button>
                ) : (
                  <Link href="/studio/projects">
                    <Button
                      className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold"
                      data-testid="button-start-building"
                    >
                      <Rocket className="w-4 h-4 mr-2" />
                      Start Building Now
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.main>
        </div>
      </div>
    </div>
  );
}
