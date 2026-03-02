import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FolderOpen, File, Plus, Save, Play, Settings, Lock, 
  ChevronRight, ChevronDown, Trash2, Edit2, X, Check,
  FileCode, FileJson, FileText, Folder, Package, Globe,
  GitBranch, GitCommit, History, RotateCcw, Terminal,
  Rocket, Cloud, Link2, Users, Info, Zap, Shield, Database,
  ExternalLink, Copy, CheckCircle, Loader2, Send, Search, Replace, Keyboard,
  Upload, Download, Filter, Mic, MicOff, Bot, Sparkles, MessageSquare, Eye,
  HelpCircle, BookOpen, Video, GraduationCap, Command, SplitSquareHorizontal,
  AlertTriangle, CheckCircle2, ArrowRight, Cpu, Fingerprint, Hash,
  Square, RefreshCw
} from "lucide-react";
import { MonacoEditor } from "@/components/monaco-editor";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlassCard } from "@/components/glass-card";
import { useSimpleAuth } from "@/hooks/use-simple-auth";
import { SimpleLoginModal } from "@/components/simple-login";

interface Commit {
  id: string;
  hash: string;
  message: string;
  branch: string;
  createdAt: string;
}

interface Run {
  id: string;
  command: string;
  status: string;
  output: string;
  exitCode: string | null;
}

interface Deployment {
  id: string;
  status: string;
  url: string | null;
  customDomain: string | null;
  version: string;
  buildLogs: string | null;
  createdAt: string;
}

interface TerminalLine {
  type: "input" | "output" | "error";
  content: string;
}

interface PresenceUser {
  id: string;
  name: string;
  color: string;
  cursor?: { line: number; column: number };
  file?: string;
}

const PROJECT_TEMPLATES = {
  react: {
    name: "React App",
    icon: "⚛️",
    files: [
      { name: "index.html", content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>React App</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>` },
      { name: "src/main.jsx", content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);` },
      { name: "src/App.jsx", content: `import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Hello Trust Layer!</h1>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
    </div>
  );
}` },
      { name: "package.json", content: `{
  "name": "react-app",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0"
  }
}` },
    ]
  },
  node: {
    name: "Node.js API",
    icon: "🟢",
    files: [
      { name: "index.js", content: `const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Trust Layer API!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});` },
      { name: "package.json", content: `{
  "name": "node-api",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}` },
    ]
  },
  python: {
    name: "Python Flask",
    icon: "🐍",
    files: [
      { name: "app.py", content: `from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify(message='Welcome to Trust Layer API!')

@app.route('/api/health')
def health():
    return jsonify(status='ok')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)` },
      { name: "requirements.txt", content: `flask==3.0.0
gunicorn==21.2.0` },
    ]
  },
  vue: {
    name: "Vue.js App",
    icon: "💚",
    files: [
      { name: "index.html", content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Vue App</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>` },
      { name: "src/main.js", content: `import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')` },
      { name: "src/App.vue", content: `<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <div style="padding: 2rem; font-family: system-ui;">
    <h1>Hello Trust Layer!</h1>
    <button @click="count++">Count: {{ count }}</button>
  </div>
</template>` },
      { name: "package.json", content: `{
  "name": "vue-app",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "vue": "^3.4.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-vue": "^5.0.0"
  }
}` },
    ]
  },
  nextjs: {
    name: "Next.js App",
    icon: "▲",
    files: [
      { name: "pages/index.js", content: `import { useState } from 'react'

export default function Home() {
  const [count, setCount] = useState(0)
  
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Hello Trust Layer!</h1>
      <p>Welcome to Next.js on Trust Layer Studio</p>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
    </div>
  )
}` },
      { name: "pages/_app.js", content: `export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}` },
      { name: "package.json", content: `{
  "name": "nextjs-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}` },
    ]
  },
  django: {
    name: "Django API",
    icon: "🎸",
    files: [
      { name: "manage.py", content: `#!/usr/bin/env python
import os
import sys

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    from django.core.management import execute_from_command_line
    execute_from_command_line(sys.argv)` },
      { name: "config/settings.py", content: `from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = 'darkwave-dev-key'
DEBUG = True
ALLOWED_HOSTS = ['*']
INSTALLED_APPS = ['django.contrib.contenttypes', 'api']
ROOT_URLCONF = 'config.urls'` },
      { name: "config/urls.py", content: `from django.urls import path
from api.views import health, home

urlpatterns = [
    path('', home),
    path('api/health/', health),
]` },
      { name: "api/views.py", content: `from django.http import JsonResponse

def home(request):
    return JsonResponse({'message': 'Welcome to Trust Layer API!'})

def health(request):
    return JsonResponse({'status': 'ok'})` },
      { name: "requirements.txt", content: `django==5.0.0
gunicorn==21.2.0` },
    ]
  },
  go: {
    name: "Go API",
    icon: "🐹",
    files: [
      { name: "main.go", content: `package main

import (
    "encoding/json"
    "log"
    "net/http"
)

func main() {
    http.HandleFunc("/", homeHandler)
    http.HandleFunc("/api/health", healthHandler)
    log.Println("Server running on :8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{"message": "Welcome to Trust Layer API!"})
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}` },
      { name: "go.mod", content: `module darkwave-api

go 1.21` },
    ]
  },
  rust: {
    name: "Rust API",
    icon: "🦀",
    files: [
      { name: "src/main.rs", content: `use actix_web::{web, App, HttpServer, HttpResponse, Responder};
use serde_json::json;

async fn home() -> impl Responder {
    HttpResponse::Ok().json(json!({"message": "Welcome to Trust Layer API!"}))
}

async fn health() -> impl Responder {
    HttpResponse::Ok().json(json!({"status": "ok"}))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Server running on http://0.0.0.0:8080");
    HttpServer::new(|| {
        App::new()
            .route("/", web::get().to(home))
            .route("/api/health", web::get().to(health))
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}` },
      { name: "Cargo.toml", content: `[package]
name = "darkwave-api"
version = "0.1.0"
edition = "2021"

[dependencies]
actix-web = "4"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tokio = { version = "1", features = ["full"] }` },
    ]
  },
};

const PROTOCOL_DEFINITIONS: Record<string, string> = {
  "SIG": "Signal - The native cryptocurrency of Trust Layer, used for transactions and gas fees.",
  "PoA": "Proof-of-Authority - A consensus mechanism where trusted validators verify transactions.",
  "Gas": "The computational cost required to execute operations on the blockchain.",
  "Block": "A container of transactions that are cryptographically linked to form the chain.",
  "Hash": "A unique cryptographic fingerprint that identifies data on the blockchain.",
  "Commit": "A snapshot of your code at a specific point in time, with a message describing changes.",
  "Branch": "A parallel version of your code for developing features independently.",
  "Deploy": "Publishing your project to make it accessible via a public URL.",
  "Secret": "An encrypted environment variable for sensitive data like API keys.",
  "Config": "A configuration variable that customizes your project's behavior.",
};

interface FileNode {
  id: string;
  name: string;
  path: string;
  isFolder: boolean;
  content: string;
  language: string;
  children?: FileNode[];
}

interface Secret {
  id: string;
  key: string;
  value: string;
}

interface Config {
  id: string;
  key: string;
  value: string;
  environment: string;
}

const getFileIcon = (name: string, isFolder: boolean) => {
  if (isFolder) return <Folder className="w-4 h-4 text-amber-400" />;
  if (name.endsWith(".js") || name.endsWith(".ts") || name.endsWith(".tsx")) 
    return <FileCode className="w-4 h-4 text-yellow-400" />;
  if (name.endsWith(".json")) return <FileJson className="w-4 h-4 text-green-400" />;
  if (name.endsWith(".md")) return <FileText className="w-4 h-4 text-blue-400" />;
  return <File className="w-4 h-4 text-gray-400" />;
};

const getLanguage = (filename: string): string => {
  if (filename.endsWith(".js")) return "javascript";
  if (filename.endsWith(".ts") || filename.endsWith(".tsx")) return "typescript";
  if (filename.endsWith(".json")) return "json";
  if (filename.endsWith(".html")) return "html";
  if (filename.endsWith(".css")) return "css";
  if (filename.endsWith(".md")) return "markdown";
  return "plaintext";
};

export default function Studio() {
  const { user, loading: authLoading, isAuthenticated } = useSimpleAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("Untitled Project");
  const [files, setFiles] = useState<FileNode[]>([]);
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [configs, setConfigs] = useState<Config[]>([]);
  const [activeFile, setActiveFile] = useState<FileNode | null>(null);
  const [editorContent, setEditorContent] = useState("");
  const [openTabs, setOpenTabs] = useState<FileNode[]>([]);
  const [unsavedFiles, setUnsavedFiles] = useState<Set<string>>(new Set());
  const [originalContent, setOriginalContent] = useState<Map<string, string>>(new Map());
  const [activeTab, setActiveTab] = useState("files");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [newFileName, setNewFileName] = useState("");
  const [showNewFile, setShowNewFile] = useState(false);
  const [renamingFile, setRenamingFile] = useState<FileNode | null>(null);
  const [renameInput, setRenameInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [consoleFilter, setConsoleFilter] = useState("");
  const [envMode, setEnvMode] = useState<"dev" | "prod">("dev");
  const [showSettings, setShowSettings] = useState(false);
  const [editingProjectName, setEditingProjectName] = useState("");
  const [newSecretKey, setNewSecretKey] = useState("");
  const [newSecretValue, setNewSecretValue] = useState("");
  const [newConfigKey, setNewConfigKey] = useState("");
  const [newConfigValue, setNewConfigValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState<{name: string, version: string}[]>([]);
  const [newPackageName, setNewPackageName] = useState("");
  const [installingPackage, setInstallingPackage] = useState(false);
  const [packageManager, setPackageManager] = useState<"npm" | "pip" | null>(null);
  const [customDomainInput, setCustomDomainInput] = useState("");
  const [savingDomain, setSavingDomain] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [replaceQuery, setReplaceQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{fileId: string, fileName: string, line: number, content: string, match: string}[]>([]);
  const [presence, setPresence] = useState<PresenceUser[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [consoleOutput, setConsoleOutput] = useState<string[]>(["> Trust Layer Studio v1.0.0", "> Ready"]);
  const [running, setRunning] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [commitMessage, setCommitMessage] = useState("");
  const [bottomTab, setBottomTab] = useState<"console" | "git" | "terminal" | "deploy" | "packages" | "cicd" | "trusthub" | "problems">("console");
  
  // CI/CD Pipeline state
  const [pipelines, setPipelines] = useState<{id: string, name: string, trigger: string, status: string, lastRun: string}[]>([
    { id: "1", name: "Build & Test", trigger: "on_push", status: "success", lastRun: "2 hours ago" },
    { id: "2", name: "Deploy to Staging", trigger: "on_merge", status: "pending", lastRun: "1 day ago" },
  ]);
  const [newPipelineName, setNewPipelineName] = useState("");
  const [newPipelineTrigger, setNewPipelineTrigger] = useState("on_push");
  const [mobileView, setMobileView] = useState<"editor" | "files" | "console" | "preview">("editor");
  const [terminalHistory, setTerminalHistory] = useState<TerminalLine[]>([
    { type: "output", content: "Trust Layer Terminal v1.0.0" },
    { type: "output", content: "Type 'help' for available commands" },
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const [deploying, setDeploying] = useState(false);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [currentDeployment, setCurrentDeployment] = useState<Deployment | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Voice input state
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  // AI Assistant state
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const aiPanelRef = useRef<HTMLDivElement>(null);
  const [aiCredits, setAiCredits] = useState<{ balanceCents: number; balanceUSD: string } | null>(null);
  const [buyingCredits, setBuyingCredits] = useState(false);
  const [agentMode, setAgentMode] = useState(false);
  const [agentTask, setAgentTask] = useState("");

  // Command Palette state (T012)
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandSearch, setCommandSearch] = useState("");
  const commandInputRef = useRef<HTMLInputElement>(null);

  // Split View state (T013)
  const [splitView, setSplitView] = useState<"none" | "horizontal" | "vertical">("none");
  const [splitFile, setSplitFile] = useState<FileNode | null>(null);
  const [splitEditorContent, setSplitEditorContent] = useState("");

  // TrustHub state (T005)
  const [trustHubStamps, setTrustHubStamps] = useState<any[]>([]);
  const [stampingCode, setStampingCode] = useState(false);

  // GitHub Integration state (T003)
  const [githubConnected, setGithubConnected] = useState(false);
  const [githubConfigured, setGithubConfigured] = useState(false);
  const [selectedGithubRepo, setSelectedGithubRepo] = useState<string>("");
  const [githubRepos, setGithubRepos] = useState<any[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [pushingToGithub, setPushingToGithub] = useState(false);

  // Vercel Integration state (T004)
  const [vercelConnected, setVercelConnected] = useState(false);
  const [vercelToken, setVercelToken] = useState("");
  const [vercelDeploying, setVercelDeploying] = useState(false);
  const [vercelDeployUrl, setVercelDeployUrl] = useState<string | null>(null);

  // Integration Hub state (T007)
  const [showIntegrations, setShowIntegrations] = useState(false);

  // Live Preview state (T008)
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [previewRunning, setPreviewRunning] = useState(false);

  // Diagnostics state (T014)
  const [diagnostics, setDiagnostics] = useState<{ line: number; column: number; severity: string; message: string; source: string }[]>([]);
  const [diagnosticsSummary, setDiagnosticsSummary] = useState<{ errors: number; warnings: number; info: number }>({ errors: 0, warnings: 0, info: 0 });

  // Fetch integration status on mount (T007)
  useEffect(() => {
    if (user) {
      fetch("/api/studio/integrations/status")
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data) {
            setGithubConnected(data.github?.connected || false);
            setGithubConfigured(data.github?.configured || false);
            setVercelConnected(data.vercel?.connected || false);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  // Lint on save (T014)
  const runLint = useCallback(async (code: string, filename: string) => {
    try {
      const res = await fetch("/api/studio/lint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: getLanguageFromFileName(filename), filename }),
      });
      if (res.ok) {
        const data = await res.json();
        setDiagnostics(data.diagnostics || []);
        setDiagnosticsSummary(data.summary || { errors: 0, warnings: 0, info: 0 });
      }
    } catch {}
  }, []);

  // GitHub functions (T003)
  const connectGithub = async () => {
    try {
      const res = await fetch("/api/studio/github/auth");
      if (res.ok) {
        const { url } = await res.json();
        window.location.href = url;
      }
    } catch {}
  };

  const disconnectGithub = async () => {
    await fetch("/api/studio/github/disconnect", { method: "POST" });
    setGithubConnected(false);
    setGithubRepos([]);
  };

  const loadGithubRepos = async () => {
    setLoadingRepos(true);
    try {
      const res = await fetch("/api/studio/github/repos");
      if (res.ok) setGithubRepos(await res.json());
    } catch {}
    setLoadingRepos(false);
  };

  const pushToGithub = async () => {
    if (!projectId || pushingToGithub) return;
    if (!selectedGithubRepo) {
      setConsoleOutput(prev => [...prev, `> GitHub: No repo selected. Open Integrations Hub to choose a repo.`]);
      return;
    }
    setPushingToGithub(true);
    try {
      const [owner, repo] = selectedGithubRepo.split("/");
      const projectFiles = files.filter(f => !f.isFolder);
      const res = await fetch("/api/studio/github/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner, repo, message: commitMessage || "Update from DWSC Studio",
          files: projectFiles.map(f => ({ name: f.name, content: f.content })),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setConsoleOutput(prev => [...prev, `> GitHub: Pushed to ${selectedGithubRepo} — commit ${data.commitSha?.slice(0, 8)}`]);
      }
    } catch {}
    setPushingToGithub(false);
  };

  // Vercel functions (T004)
  const connectVercel = async (token: string) => {
    try {
      const res = await fetch("/api/studio/vercel/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (res.ok) setVercelConnected(true);
    } catch {}
  };

  const disconnectVercel = async () => {
    await fetch("/api/studio/vercel/disconnect", { method: "POST" });
    setVercelConnected(false);
  };

  const deployToVercel = async () => {
    if (vercelDeploying) return;
    setVercelDeploying(true);
    setVercelDeployUrl(null);
    try {
      const projectFiles = files.filter(f => !f.isFolder);
      const res = await fetch("/api/studio/vercel/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: projectName || "studio-deploy",
          files: projectFiles.map(f => ({ name: f.name, content: f.content })),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setVercelDeployUrl(data.url);
        setConsoleOutput(prev => [...prev, `> Vercel: Deployed to ${data.url}`]);
      }
    } catch {}
    setVercelDeploying(false);
  };

  // Live Preview (T008)
  const startPreview = async () => {
    if (!projectId) return;
    setPreviewRunning(true);
    try {
      const projectFiles = files.filter(f => !f.isFolder);
      const res = await fetch("/api/studio/preview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, files: projectFiles.map(f => ({ name: f.name, content: f.content })) }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.html) setPreviewHtml(data.html);
        if (data.url) setPreviewUrl(data.url);
      }
    } catch {}
  };

  // Fetch AI credits on mount
  useEffect(() => {
    if (user) {
      fetch("/api/assistant/credits")
        .then(res => res.ok ? res.json() : null)
        .then(data => data && setAiCredits(data))
        .catch(() => {});
    }
  }, [user]);

  const buyAiCredits = async (amountCents: number = 500) => {
    setBuyingCredits(true);
    try {
      const res = await fetch("/api/assistant/buy-credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountCents }),
      });
      if (res.ok) {
        const { checkoutUrl } = await res.json();
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("Buy credits error:", error);
    } finally {
      setBuyingCredits(false);
    }
  };
  
  // Database Explorer state
  const [dbTables, setDbTables] = useState<{name: string, rowCount: number}[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableRows, setTableRows] = useState<any[]>([]);
  const [tableColumns, setTableColumns] = useState<string[]>([]);
  const [dbQuery, setDbQuery] = useState("");
  const [dbQueryResult, setDbQueryResult] = useState<any>(null);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  
  // Live Preview state
  const [showPreview, setShowPreview] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState<string>("");
  const previewIframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!user) {
      // Set up demo project for view-only mode
      setProjectName("Demo Project");
      setFiles([
        {
          id: "demo-1",
          name: "index.html",
          path: "index.html",
          isFolder: false,
          content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trust Layer Demo</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h1>Welcome to Trust Layer Studio</h1>
    <p>Sign in to create your own projects!</p>
    <button onclick="showMessage()">Click Me</button>
    <div id="output"></div>
  </div>
  <script src="app.js"></script>
</body>
</html>`,
          language: "html"
        },
        {
          id: "demo-2",
          name: "style.css",
          path: "style.css",
          isFolder: false,
          content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.container {
  text-align: center;
  padding: 2rem;
}

h1 {
  background: linear-gradient(90deg, #00d4ff, #9b59b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
}

button {
  padding: 0.75rem 2rem;
  background: linear-gradient(90deg, #6366f1, #a855f7);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

button:hover {
  transform: scale(1.05);
}`,
          language: "css"
        },
        {
          id: "demo-3",
          name: "app.js",
          path: "app.js",
          isFolder: false,
          content: `// Trust Layer Studio Demo
function showMessage() {
  const output = document.getElementById('output');
  output.innerHTML = '<p style="margin-top: 1rem; color: #00d4ff;">✨ Welcome to Trust Layer!</p>';
}

console.log('Trust Layer Studio loaded!');`,
          language: "javascript"
        }
      ]);
      setActiveFile({
        id: "demo-1",
        name: "index.html",
        path: "index.html",
        isFolder: false,
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trust Layer Demo</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h1>Welcome to Trust Layer Studio</h1>
    <p>Sign in to create your own projects!</p>
    <button onclick="showMessage()">Click Me</button>
    <div id="output"></div>
  </div>
  <script src="app.js"></script>
</body>
</html>`,
        language: "html"
      });
      setEditorContent(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trust Layer Demo</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h1>Welcome to Trust Layer Studio</h1>
    <p>Sign in to create your own projects!</p>
    <button onclick="showMessage()">Click Me</button>
    <div id="output"></div>
  </div>
  <script src="app.js"></script>
</body>
</html>`);
      setLoading(false);
      return;
    }
    
    const initProject = async () => {
      try {
        const projectsRes = await fetch("/api/studio/projects");
        if (projectsRes.ok) {
          const projects = await projectsRes.json();
          if (projects.length > 0) {
            const projectRes = await fetch(`/api/studio/projects/${projects[0].id}`);
            if (projectRes.ok) {
              const data = await projectRes.json();
              setProjectId(data.project.id);
              setProjectName(data.project.name);
              setFiles(data.files.map((f: any) => ({
                id: f.id,
                name: f.name,
                path: f.path,
                isFolder: f.isFolder,
                content: f.content,
                language: f.language,
              })));
              setSecrets(data.secrets);
              setConfigs(data.configs);
              if (data.files.length > 0) {
                setActiveFile(data.files[0]);
                setEditorContent(data.files[0].content);
              }
              const hasPackageJson = data.files.some((f: any) => f.name === "package.json");
              const hasRequirements = data.files.some((f: any) => f.name === "requirements.txt");
              if (hasPackageJson) {
                setPackageManager("npm");
                const pkgFile = data.files.find((f: any) => f.name === "package.json");
                if (pkgFile) {
                  try {
                    const pkg = JSON.parse(pkgFile.content);
                    const deps = Object.entries(pkg.dependencies || {}).map(([name, version]) => ({ name, version: String(version) }));
                    setPackages(deps);
                  } catch {}
                }
              } else if (hasRequirements) {
                setPackageManager("pip");
                const reqFile = data.files.find((f: any) => f.name === "requirements.txt");
                if (reqFile) {
                  const lines = reqFile.content.split("\n").filter((l: string) => l.trim() && !l.startsWith("#"));
                  const deps = lines.map((l: string) => {
                    const [name, version] = l.split("==");
                    return { name: name.trim(), version: version?.trim() || "latest" };
                  });
                  setPackages(deps);
                }
              }
            }
          } else {
            const createRes = await fetch("/api/studio/projects", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: "My First Project" }),
            });
            if (createRes.ok) {
              const project = await createRes.json();
              setProjectId(project.id);
              setProjectName(project.name);
              const filesRes = await fetch(`/api/studio/projects/${project.id}`);
              if (filesRes.ok) {
                const data = await filesRes.json();
                setFiles(data.files);
                if (data.files.length > 0) {
                  setActiveFile(data.files[0]);
                  setEditorContent(data.files[0].content);
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("Failed to load project:", error);
      } finally {
        setLoading(false);
      }
    };
    
    initProject();
  }, [user]);

  const handleFileSelect = (file: FileNode) => {
    if (file.isFolder) {
      setExpandedFolders(prev => {
        const next = new Set(prev);
        if (next.has(file.id)) next.delete(file.id);
        else next.add(file.id);
        return next;
      });
    } else {
      if (activeFile && activeFile.id !== file.id) {
        setFiles(prev => prev.map(f => 
          f.id === activeFile.id ? { ...f, content: editorContent } : f
        ));
      }
      setActiveFile(file);
      setEditorContent(file.content);
      
      // Add to open tabs if not already open
      setOpenTabs(prev => {
        if (prev.some(t => t.id === file.id)) return prev;
        return [...prev, file];
      });
      
      // Track original content for unsaved detection
      setOriginalContent(prev => {
        if (prev.has(file.id)) return prev;
        const next = new Map(prev);
        next.set(file.id, file.content);
        return next;
      });
      
      // On mobile, switch to editor view when file is selected
      setMobileView("editor");
      
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && projectId) {
        wsRef.current.send(JSON.stringify({
          type: "cursor",
          projectId,
          file: file.name,
          cursor: { line: 1, column: 1 },
        }));
      }
    }
  };

  const handleCloseTab = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    
    // Remove from open tabs
    setOpenTabs(prev => prev.filter(t => t.id !== fileId));
    
    // Clear unsaved status
    setUnsavedFiles(prev => {
      const next = new Set(prev);
      next.delete(fileId);
      return next;
    });
    
    // Clear original content tracking
    setOriginalContent(prev => {
      const next = new Map(prev);
      next.delete(fileId);
      return next;
    });
    
    // If closing active file, switch to another tab or clear
    if (activeFile?.id === fileId) {
      const remaining = openTabs.filter(t => t.id !== fileId);
      if (remaining.length > 0) {
        const newActive = remaining[remaining.length - 1];
        setActiveFile(newActive);
        setEditorContent(newActive.content);
      } else {
        setActiveFile(null);
        setEditorContent("");
      }
    }
  };

  // Track unsaved changes
  useEffect(() => {
    if (!activeFile) return;
    const original = originalContent.get(activeFile.id);
    if (original !== undefined && editorContent !== original) {
      setUnsavedFiles(prev => {
        if (prev.has(activeFile.id)) return prev;
        const next = new Set(prev);
        next.add(activeFile.id);
        return next;
      });
    } else if (original !== undefined && editorContent === original) {
      setUnsavedFiles(prev => {
        if (!prev.has(activeFile.id)) return prev;
        const next = new Set(prev);
        next.delete(activeFile.id);
        return next;
      });
    }
  }, [editorContent, activeFile, originalContent]);

  // Voice input setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setVoiceSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false; // Only get final results to avoid duplicates
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        // Only process the latest result that is final
        const result = event.results[event.resultIndex];
        if (result.isFinal) {
          const transcript = result[0].transcript;
          if (transcript && transcript.trim()) {
            // Append finalized transcript with a space
            setEditorContent(prev => prev + ' ' + transcript.trim());
          }
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
    
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // AI Assistant function
  const askAiAssistant = async () => {
    if (agentMode) return runAgentMode();
    if (!aiPrompt.trim() || aiLoading) return;
    
    setAiLoading(true);
    setAiResponse("");
    
    const projectFilePayload = files.filter(f => !f.isFolder).map(f => ({ name: f.name, content: f.content }));
    
    try {
      const response = await fetch("/api/studio/ai/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          code: editorContent,
          language: activeFile?.language || getLanguageFromFileName(activeFile?.name || ""),
          context: `File: ${activeFile?.name || "untitled"}`,
          projectFiles: projectFilePayload,
        }),
      });

      // Handle insufficient credits (402)
      if (response.status === 402) {
        const errorData = await response.json();
        setAiResponse(`⚠️ ${errorData.message}\n\nClick "Add $5" above to purchase more credits and continue using AI assistance.`);
        // Refresh credits display
        fetch("/api/assistant/credits")
          .then(res => res.ok ? res.json() : null)
          .then(data => data && setAiCredits(data))
          .catch(() => {});
        setAiLoading(false);
        return;
      }

      if (!response.ok) throw new Error("AI request failed");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const text = decoder.decode(value);
        const lines = text.split("\n");
        
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                setAiResponse(prev => prev + data.content);
              }
              if (data.done) break;
            } catch {}
          }
        }
      }
    } catch (error) {
      console.error("AI assist error:", error);
      setAiResponse("Sorry, I couldn't process your request. Please try again.");
    } finally {
      setAiLoading(false);
      // Refresh credits after AI call
      fetch("/api/assistant/credits")
        .then(res => res.ok ? res.json() : null)
        .then(data => data && setAiCredits(data))
        .catch(() => {});
    }
  };

  // Agent Mode execution (T006)
  const runAgentMode = async () => {
    if (!aiPrompt.trim() || aiLoading) return;
    setAiLoading(true);
    setAiResponse("");
    const projectFilePayload = files.filter(f => !f.isFolder).map(f => ({ name: f.name, content: f.content }));
    try {
      const response = await fetch("/api/studio/ai/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: aiPrompt,
          projectFiles: projectFilePayload,
          activeFile: activeFile?.name,
        }),
      });
      if (response.status === 402) {
        const errorData = await response.json();
        setAiResponse(`⚠️ ${errorData.message}`);
        setAiLoading(false);
        return;
      }
      if (!response.ok) throw new Error("Agent request failed");
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value);
        for (const line of text.split("\n")) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) setAiResponse(prev => prev + data.content);
              if (data.done) break;
            } catch {}
          }
        }
      }
    } catch (error) {
      setAiResponse("Agent encountered an error. Please try again.");
    } finally {
      setAiLoading(false);
      fetch("/api/assistant/credits").then(r => r.ok ? r.json() : null).then(d => d && setAiCredits(d)).catch(() => {});
    }
  };

  // TrustHub stamp (T005)
  const stampCode = async () => {
    if (!projectId || stampingCode) return;
    setStampingCode(true);
    try {
      const res = await fetch("/api/studio/trusthub/stamp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, message: `Stamp at ${new Date().toLocaleString()}` }),
      });
      if (res.ok) {
        const stamp = await res.json();
        setTrustHubStamps(prev => [stamp, ...prev]);
        setConsoleOutput(prev => [...prev, `> TrustHub: Code stamped — ${stamp.txHash?.slice(0, 18)}...`]);
      }
    } catch (error) {
      console.error("Stamp error:", error);
    } finally {
      setStampingCode(false);
    }
  };

  const loadTrustHubStamps = async () => {
    if (!projectId) return;
    try {
      const res = await fetch(`/api/studio/trusthub/stamps/${projectId}`);
      if (res.ok) setTrustHubStamps(await res.json());
    } catch {}
  };

  // Apply AI code to editor (T002)
  const applyCodeBlock = (code: string, filename?: string) => {
    if (filename && filename.startsWith("NEW FILE:")) {
      const newName = filename.replace("NEW FILE:", "").trim();
      handleCreateFileWithContent(newName, code);
      return;
    }
    if (activeFile) {
      setEditorContent(code);
      setFiles(prev => prev.map(f => f.id === activeFile.id ? { ...f, content: code } : f));
      setUnsavedFiles(prev => { const s = new Set(prev); s.add(activeFile.id); return s; });
    }
  };

  const handleCreateFileWithContent = async (name: string, content: string) => {
    if (!projectId) return;
    try {
      const res = await fetch(`/api/studio/projects/${projectId}/files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, content, language: getLanguageFromFileName(name) }),
      });
      if (res.ok) {
        const newFile = await res.json();
        setFiles(prev => [...prev, newFile]);
        setOpenTabs(prev => [...prev, newFile]);
        setActiveFile(newFile);
        setEditorContent(content);
      }
    } catch {}
  };

  // Command palette actions (T012)
  const commandPaletteActions = [
    { id: "save", label: "Save File", shortcut: "Ctrl+S", icon: Save, action: () => handleSaveFile() },
    { id: "run", label: "Run Project", shortcut: "Ctrl+Enter", icon: Play, action: () => { /* trigger run */ } },
    { id: "deploy", label: "Deploy Project", icon: Rocket, action: () => handleDeploy() },
    { id: "ai", label: "Open AI Assistant", shortcut: "Ctrl+I", icon: Sparkles, action: () => setShowAiPanel(true) },
    { id: "agent", label: "Toggle Agent Mode", icon: Cpu, action: () => { setAgentMode(!agentMode); setShowAiPanel(true); } },
    { id: "terminal", label: "Show Terminal", icon: Terminal, action: () => setBottomTab("terminal") },
    { id: "console", label: "Show Console", icon: Info, action: () => setBottomTab("console") },
    { id: "git", label: "Show Git", icon: GitBranch, action: () => setBottomTab("git") },
    { id: "cicd", label: "Run CI/CD Pipeline", icon: Zap, action: () => setBottomTab("cicd") },
    { id: "stamp", label: "TrustHub — Stamp Code", icon: Fingerprint, action: () => stampCode() },
    { id: "split-h", label: "Split Editor Right", icon: SplitSquareHorizontal, action: () => { if (activeFile) { setSplitFile(activeFile); setSplitView("horizontal"); setSplitEditorContent(editorContent); } } },
    { id: "split-v", label: "Split Editor Down", icon: SplitSquareHorizontal, action: () => { if (activeFile) { setSplitFile(activeFile); setSplitView("vertical"); setSplitEditorContent(editorContent); } } },
    { id: "close-split", label: "Close Split View", icon: X, action: () => { setSplitView("none"); setSplitFile(null); } },
    { id: "github-push", label: "Push to GitHub", icon: GitBranch, action: () => pushToGithub() },
    { id: "vercel-deploy", label: "Deploy to Vercel", icon: Cloud, action: () => deployToVercel() },
    { id: "preview", label: "Start Live Preview", icon: Eye, action: () => { setShowPreview(true); startPreview(); } },
    { id: "lint", label: "Run Lint Check", icon: AlertTriangle, action: () => { if (activeFile) runLint(editorContent, activeFile.name); setBottomTab("problems"); } },
    { id: "problems", label: "Show Problems", icon: AlertTriangle, action: () => setBottomTab("problems") },
    { id: "integrations", label: "Integrations Hub", icon: Link2, action: () => setShowIntegrations(true) },
    { id: "settings", label: "Project Settings", icon: Settings, action: () => setShowSettings(true) },
    { id: "shortcuts", label: "Keyboard Shortcuts", icon: Keyboard, action: () => setShowShortcuts(true) },
    ...files.filter(f => !f.isFolder).map(f => ({
      id: `file-${f.id}`, label: f.name, icon: FileCode, action: () => { setActiveFile(f); setEditorContent(f.content); if (!openTabs.find(t => t.id === f.id)) setOpenTabs(prev => [...prev, f]); },
    })),
  ];

  const filteredCommands = commandSearch.trim()
    ? commandPaletteActions.filter(c => c.label.toLowerCase().includes(commandSearch.toLowerCase()))
    : commandPaletteActions.slice(0, 12);

  const getLanguageFromFileName = (name: string): string => {
    const ext = name.split('.').pop()?.toLowerCase() || '';
    const langMap: Record<string, string> = {
      'js': 'javascript', 'jsx': 'javascript', 'ts': 'typescript', 'tsx': 'typescript',
      'py': 'python', 'rb': 'ruby', 'go': 'go', 'rs': 'rust', 'java': 'java',
      'html': 'html', 'css': 'css', 'json': 'json', 'md': 'markdown',
    };
    return langMap[ext] || ext;
  };

  // Live Preview function - builds and renders project files with live (unsaved) content
  const refreshPreview = useCallback(async () => {
    if (!projectId) return;
    
    setPreviewLoading(true);
    setPreviewError(null);
    
    try {
      // Helper to get content - use editor content for active file, otherwise use saved file content
      const getFileContent = (file: FileNode): string => {
        if (activeFile && file.id === activeFile.id) {
          return editorContent; // Use live editor content for active file
        }
        return file.content || '';
      };
      
      // Find the HTML file or create a preview from current files
      const htmlFile = files.find(f => f.name.endsWith('.html'));
      const cssFiles = files.filter(f => f.name.endsWith('.css'));
      const jsFiles = files.filter(f => f.name.endsWith('.js') || f.name.endsWith('.jsx') || f.name.endsWith('.ts'));
      
      let html = '';
      
      if (htmlFile) {
        html = getFileContent(htmlFile);
        
        // Inject CSS files inline with live content
        const cssContent = cssFiles.map(f => `<style>/* ${f.name} */\n${getFileContent(f)}</style>`).join('\n');
        if (cssContent && !html.includes('</head>')) {
          html = `<head>${cssContent}</head>` + html;
        } else if (cssContent) {
          html = html.replace('</head>', `${cssContent}</head>`);
        }
        
        // For simple JS files, inject them with live content
        const simpleJs = jsFiles.filter(f => !f.name.includes('.jsx') && !f.name.includes('.tsx'));
        const jsContent = simpleJs.map(f => `<script>/* ${f.name} */\n${getFileContent(f)}</script>`).join('\n');
        if (jsContent && !html.includes('</body>')) {
          html += jsContent;
        } else if (jsContent) {
          html = html.replace('</body>', `${jsContent}</body>`);
        }
      } else {
        // No HTML file - create a basic preview for current file using live editor content
        if (activeFile?.name.endsWith('.html')) {
          html = editorContent;
        } else if (activeFile?.name.endsWith('.css')) {
          html = `<!DOCTYPE html>
<html><head><style>${editorContent}</style></head>
<body>
<div style="padding: 2rem; font-family: system-ui;">
  <h1>CSS Preview</h1>
  <p>Your styles are applied to this page.</p>
  <button class="btn">Button</button>
  <div class="box" style="width: 100px; height: 100px; background: #333; margin: 1rem 0;"></div>
</div>
</body></html>`;
        } else if (activeFile?.name.endsWith('.js')) {
          html = `<!DOCTYPE html>
<html><head></head><body>
<div id="root" style="padding: 2rem; font-family: system-ui;">
  <h1>JavaScript Preview</h1>
  <p>Check console for output.</p>
</div>
<script>${editorContent}</script>
</body></html>`;
        } else {
          html = `<!DOCTYPE html>
<html><head></head><body>
<div style="padding: 2rem; font-family: system-ui; color: #888;">
  <h1>Preview</h1>
  <p>Create an HTML file or select a previewable file (HTML, CSS, JS).</p>
</div>
</body></html>`;
        }
      }
      
      setPreviewContent(html);
      
      // Update iframe using srcdoc for sandboxed preview
      if (previewIframeRef.current) {
        previewIframeRef.current.srcdoc = html;
      }
      
    } catch (error) {
      console.error("Preview build error:", error);
      setPreviewError("Failed to build preview. Check your code for errors.");
    } finally {
      setPreviewLoading(false);
    }
  }, [projectId, files, activeFile, editorContent]);

  // Auto-refresh preview when showing and files change
  useEffect(() => {
    if (showPreview) {
      refreshPreview();
    }
  }, [showPreview, refreshPreview]);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const results: {fileId: string, fileName: string, line: number, content: string, match: string}[] = [];
    const query = searchQuery.toLowerCase();
    
    const searchInFiles = (fileList: FileNode[]) => {
      for (const file of fileList) {
        if (file.isFolder && file.children) {
          searchInFiles(file.children);
        } else if (!file.isFolder && file.content) {
          const lines = file.content.split('\n');
          lines.forEach((line, idx) => {
            if (line.toLowerCase().includes(query)) {
              results.push({
                fileId: file.id,
                fileName: file.name,
                line: idx + 1,
                content: line.trim().substring(0, 100),
                match: searchQuery
              });
            }
          });
        }
      }
    };
    
    searchInFiles(files);
    setSearchResults(results);
  }, [searchQuery, files]);

  const handleReplaceAll = useCallback(() => {
    if (!searchQuery.trim() || !replaceQuery) return;
    
    const replaceInFiles = (fileList: FileNode[]): FileNode[] => {
      return fileList.map(file => {
        if (file.isFolder && file.children) {
          return { ...file, children: replaceInFiles(file.children) };
        } else if (!file.isFolder && file.content) {
          const regex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
          const newContent = file.content.replace(regex, replaceQuery);
          if (newContent !== file.content) {
            return { ...file, content: newContent };
          }
        }
        return file;
      });
    };
    
    setFiles(replaceInFiles(files));
    if (activeFile) {
      const regex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      setEditorContent(prev => prev.replace(regex, replaceQuery));
    }
    handleSearch();
  }, [searchQuery, replaceQuery, files, activeFile, handleSearch]);

  const jumpToSearchResult = (result: typeof searchResults[0]) => {
    const file = files.find(f => f.id === result.fileId);
    if (file) {
      handleFileSelect(file);
    }
  };

  const applyTemplate = async (templateKey: keyof typeof PROJECT_TEMPLATES) => {
    if (!projectId) return;
    
    const template = PROJECT_TEMPLATES[templateKey];
    const newFiles: FileNode[] = [];
    const failedFiles: string[] = [];
    
    setConsoleOutput(prev => [...prev, `> Applying "${template.name}" template...`]);
    
    for (const templateFile of template.files) {
      try {
        const res = await fetch(`/api/studio/projects/${projectId}/files`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: templateFile.name,
            content: templateFile.content,
            path: "/" + templateFile.name,
            isFolder: false,
            language: getLanguage(templateFile.name),
          }),
        });
        if (res.ok) {
          const newFile = await res.json();
          newFiles.push({
            id: newFile.id,
            name: newFile.name,
            path: newFile.path,
            isFolder: false,
            content: newFile.content,
            language: newFile.language,
          });
        } else {
          failedFiles.push(templateFile.name);
        }
      } catch (error) {
        console.error("Failed to create template file:", error);
        failedFiles.push(templateFile.name);
      }
    }
    
    setFiles(prev => [...prev, ...newFiles]);
    if (newFiles.length > 0) {
      handleFileSelect(newFiles[0]);
    }
    
    if (failedFiles.length > 0) {
      setConsoleOutput(prev => [
        ...prev, 
        `> Warning: Failed to create ${failedFiles.length} file(s): ${failedFiles.join(', ')}`,
        `> Created ${newFiles.length}/${template.files.length} files from "${template.name}" template`
      ]);
    } else {
      setConsoleOutput(prev => [...prev, `> Successfully created ${newFiles.length} files from "${template.name}" template`]);
    }
  };

  const handleSave = async () => {
    if (!activeFile) return;
    setSaving(true);
    try {
      setFiles(prev => prev.map(f => 
        f.id === activeFile.id ? { ...f, content: editorContent } : f
      ));
      if (projectId) {
        await fetch(`/api/studio/files/${activeFile.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: editorContent }),
        });
      }
      // Update original content to current (no longer unsaved)
      setOriginalContent(prev => {
        const next = new Map(prev);
        next.set(activeFile.id, editorContent);
        return next;
      });
      // Clear unsaved status
      setUnsavedFiles(prev => {
        const next = new Set(prev);
        next.delete(activeFile.id);
        return next;
      });
      // Auto-lint on save (T014)
      runLint(editorContent, activeFile.name);
      // Auto-refresh preview (T008)
      if (showPreview && previewRunning) startPreview();
    } catch (error) {
      console.error("Save error:", error);
    }
    setSaving(false);
  };

  const saveCurrentFile = useCallback(() => {
    if (activeFile) {
      setFiles(prev => prev.map(f => 
        f.id === activeFile.id ? { ...f, content: editorContent } : f
      ));
    }
  }, [activeFile, editorContent]);

  const handleCreateFile = async () => {
    if (!newFileName.trim() || !projectId) return;
    saveCurrentFile();
    try {
      const res = await fetch(`/api/studio/projects/${projectId}/files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newFileName,
          path: `/${newFileName}`,
          content: "",
          language: getLanguage(newFileName),
          isFolder: false,
        }),
      });
      if (res.ok) {
        const file = await res.json();
        const newFile: FileNode = {
          id: file.id,
          name: file.name,
          path: file.path,
          isFolder: false,
          content: file.content,
          language: file.language,
        };
        setFiles(prev => [...prev, newFile]);
        setNewFileName("");
        setShowNewFile(false);
        setActiveFile(newFile);
        setEditorContent("");
      }
    } catch (error) {
      console.error("Create file error:", error);
    }
  };

  const handleDeleteFile = async (id: string) => {
    try {
      await fetch(`/api/studio/files/${id}`, { method: "DELETE" });
      setFiles(prev => prev.filter(f => f.id !== id));
      if (activeFile?.id === id) {
        setActiveFile(null);
        setEditorContent("");
      }
    } catch (error) {
      console.error("Delete file error:", error);
    }
  };

  const startRename = (file: FileNode) => {
    setRenamingFile(file);
    setRenameInput(file.name);
  };

  const handleRename = async () => {
    if (!renamingFile || !renameInput.trim()) return;
    try {
      const newName = renameInput.trim();
      const lastSlashIndex = renamingFile.path.lastIndexOf('/');
      const directory = lastSlashIndex >= 0 ? renamingFile.path.substring(0, lastSlashIndex + 1) : '/';
      const newPath = directory + newName;
      const res = await fetch(`/api/studio/files/${renamingFile.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, path: newPath }),
      });
      if (res.ok) {
        const updated = await res.json();
        setFiles(prev => prev.map(f => 
          f.id === renamingFile.id 
            ? { ...f, name: updated.name, path: updated.path, language: getLanguage(updated.name) }
            : f
        ));
        if (activeFile?.id === renamingFile.id) {
          setActiveFile(prev => prev ? { ...prev, name: updated.name, path: updated.path } : null);
        }
        setOpenTabs(prev => prev.map(t => 
          t.id === renamingFile.id ? { ...t, name: updated.name } : t
        ));
        setConsoleOutput(prev => [...prev, `> Renamed ${renamingFile.name} to ${newName}`]);
      }
    } catch (error) {
      console.error("Rename file error:", error);
    } finally {
      setRenamingFile(null);
      setRenameInput("");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!projectId || !e.target.files) return;
    
    const uploadedFiles: FileNode[] = [];
    const failedUploads: string[] = [];
    
    for (const file of Array.from(e.target.files)) {
      try {
        const content = await file.text();
        const res = await fetch(`/api/studio/projects/${projectId}/files`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: file.name,
            content,
            path: "/" + file.name,
            isFolder: false,
            language: getLanguage(file.name),
          }),
        });
        if (res.ok) {
          const newFile = await res.json();
          uploadedFiles.push({
            id: newFile.id,
            name: newFile.name,
            path: newFile.path,
            isFolder: false,
            content: newFile.content,
            language: newFile.language,
          });
        } else {
          failedUploads.push(file.name);
        }
      } catch (error) {
        console.error("Upload error:", error);
        failedUploads.push(file.name);
      }
    }
    
    setFiles(prev => [...prev, ...uploadedFiles]);
    if (uploadedFiles.length > 0) {
      handleFileSelect(uploadedFiles[0]);
      setConsoleOutput(prev => [...prev, `> Uploaded ${uploadedFiles.length} file(s)`]);
    }
    if (failedUploads.length > 0) {
      setConsoleOutput(prev => [...prev, `> Failed to upload: ${failedUploads.join(', ')}`]);
    }
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpdateProjectName = async () => {
    if (!projectId || !editingProjectName.trim()) return;
    try {
      const res = await fetch(`/api/studio/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingProjectName.trim() }),
      });
      if (res.ok) {
        setProjectName(editingProjectName.trim());
        setConsoleOutput(prev => [...prev, `> Project renamed to "${editingProjectName.trim()}"`]);
        setShowSettings(false);
      } else {
        const error = await res.text();
        setConsoleOutput(prev => [...prev, `> Error: Failed to update project - ${error || res.statusText}`]);
      }
    } catch (error) {
      console.error("Update project error:", error);
      setConsoleOutput(prev => [...prev, `> Error: Failed to update project settings`]);
    }
  };

  const handleDownloadFile = (file: FileNode) => {
    if (file.isFolder) {
      setConsoleOutput(prev => [...prev, `> Cannot download folder: ${file.name}`]);
      return;
    }
    const currentFile = files.find(f => f.id === file.id);
    const content = currentFile?.content;
    if (content === undefined || content === null) {
      setConsoleOutput(prev => [...prev, `> Cannot download: ${file.name} has no content loaded`]);
      return;
    }
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setConsoleOutput(prev => [...prev, `> Downloaded ${file.name}`]);
  };

  const handleAddSecret = async () => {
    if (!newSecretKey.trim() || !projectId) return;
    try {
      const res = await fetch(`/api/studio/projects/${projectId}/secrets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: newSecretKey, value: newSecretValue, environment: envMode }),
      });
      if (res.ok) {
        const secret = await res.json();
        setSecrets(prev => [...prev, secret]);
        setNewSecretKey("");
        setNewSecretValue("");
        setConsoleOutput(prev => [...prev, `> Added secret "${newSecretKey}" for ${envMode} environment`]);
      }
    } catch (error) {
      console.error("Add secret error:", error);
    }
  };

  const handleAddConfig = async () => {
    if (!newConfigKey.trim() || !projectId) return;
    try {
      const res = await fetch(`/api/studio/projects/${projectId}/configs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: newConfigKey, value: newConfigValue, environment: envMode }),
      });
      if (res.ok) {
        const config = await res.json();
        setConfigs(prev => [...prev, config]);
        setNewConfigKey("");
        setNewConfigValue("");
        setConsoleOutput(prev => [...prev, `> Added config "${newConfigKey}" for ${envMode} environment`]);
      }
    } catch (error) {
      console.error("Add config error:", error);
    }
  };

  const handleRun = async () => {
    if (!projectId) return;
    setRunning(true);
    setConsoleOutput(prev => [...prev, "> Running..."]);
    try {
      const res = await fetch(`/api/studio/projects/${projectId}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const run = await res.json();
        if (run.code) {
          const logs: string[] = [];
          try {
            const fakeConsole = {
              log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(" ")),
              error: (...args: any[]) => logs.push("[ERROR] " + args.map(a => String(a)).join(" ")),
              warn: (...args: any[]) => logs.push("[WARN] " + args.map(a => String(a)).join(" ")),
              info: (...args: any[]) => logs.push("[INFO] " + args.map(a => String(a)).join(" ")),
            };
            const fn = new Function("console", run.code);
            fn(fakeConsole);
            setConsoleOutput(prev => [...prev, ...logs, "> Completed"]);
          } catch (err: any) {
            setConsoleOutput(prev => [...prev, `> Error: ${err.message}`]);
          }
        } else {
          setConsoleOutput(prev => [...prev, run.output || "No output"]);
        }
        const hasHtml = files.some(f => f.name.endsWith(".html"));
        if (hasHtml) {
          setPreviewUrl(`/api/studio/projects/${projectId}/preview/serve`);
        }
      }
    } catch (error) {
      setConsoleOutput(prev => [...prev, "> Error: Failed to run project"]);
    }
    setRunning(false);
  };

  const handleCommit = async () => {
    if (!projectId || !commitMessage.trim()) return;
    try {
      const res = await fetch(`/api/studio/projects/${projectId}/commits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: commitMessage, branch: "main" }),
      });
      if (res.ok) {
        const commit = await res.json();
        setCommits(prev => [commit, ...prev]);
        setCommitMessage("");
        setConsoleOutput(prev => [...prev, `> Committed: ${commit.hash} - ${commit.message}`]);
      }
    } catch (error) {
      console.error("Commit error:", error);
    }
  };

  const loadCommits = async () => {
    if (!projectId) return;
    try {
      const res = await fetch(`/api/studio/projects/${projectId}/commits`);
      if (res.ok) {
        const data = await res.json();
        setCommits(data);
      }
    } catch (error) {
      console.error("Load commits error:", error);
    }
  };

  const handleTerminalCommand = async (command: string) => {
    if (!projectId || !command.trim()) return;
    setTerminalHistory(prev => [...prev, { type: "input", content: `$ ${command}` }]);
    setTerminalInput("");
    if (command === "clear") {
      setTerminalHistory([
        { type: "output", content: "Trust Layer Terminal v1.0.0" },
        { type: "output", content: "Type 'help' for available commands" },
      ]);
      return;
    }
    try {
      const res = await fetch(`/api/studio/projects/${projectId}/terminal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      });
      if (res.ok) {
        const data = await res.json();
        const lines = data.output.split("\n").filter((l: string) => l);
        lines.forEach((line: string) => {
          setTerminalHistory(prev => [...prev, { 
            type: data.exitCode === 0 ? "output" : "error", 
            content: line 
          }]);
        });
      }
    } catch (error) {
      setTerminalHistory(prev => [...prev, { type: "error", content: "Command failed" }]);
    }
    setTimeout(() => {
      terminalRef.current?.scrollTo({ top: terminalRef.current.scrollHeight, behavior: "smooth" });
    }, 100);
  };

  const handleDeploy = async () => {
    if (!projectId) return;
    setDeploying(true);
    setConsoleOutput(prev => [...prev, "> Starting deployment..."]);
    try {
      const res = await fetch(`/api/studio/projects/${projectId}/deploy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const deployment = await res.json();
        setCurrentDeployment(deployment);
        setDeployments(prev => [deployment, ...prev]);
        setConsoleOutput(prev => [...prev, `> Deployment v${deployment.version} started`]);
        const checkStatus = async () => {
          const statusRes = await fetch(`/api/studio/deployments/${deployment.id}`);
          if (statusRes.ok) {
            const updated = await statusRes.json();
            setCurrentDeployment(updated);
            if (updated.status === "live") {
              setConsoleOutput(prev => [...prev, `> Deployed: ${updated.url}`]);
              setDeploying(false);
            } else if (updated.status === "failed") {
              setConsoleOutput(prev => [...prev, "> Deployment failed"]);
              setDeploying(false);
            } else {
              setTimeout(checkStatus, 1000);
            }
          }
        };
        setTimeout(checkStatus, 1000);
      }
    } catch (error) {
      console.error("Deploy error:", error);
      setConsoleOutput(prev => [...prev, "> Deployment failed"]);
      setDeploying(false);
    }
  };

  const loadDeployments = async () => {
    if (!projectId) return;
    try {
      const res = await fetch(`/api/studio/projects/${projectId}/deployments`);
      if (res.ok) {
        const data = await res.json();
        setDeployments(data);
        if (data.length > 0) setCurrentDeployment(data[0]);
      }
    } catch (error) {
      console.error("Load deployments error:", error);
    }
  };

  const handleInstallPackage = async () => {
    if (!projectId || !newPackageName.trim()) return;
    setInstallingPackage(true);
    setConsoleOutput(prev => [...prev, `> Installing ${newPackageName}...`]);
    try {
      const res = await fetch(`/api/studio/projects/${projectId}/packages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          packageName: newPackageName.trim(),
          packageManager: packageManager || "npm"
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setPackages(prev => [...prev, { name: data.name, version: data.version }]);
        setConsoleOutput(prev => [...prev, `> Installed ${data.name}@${data.version}`]);
        setNewPackageName("");
      } else {
        setConsoleOutput(prev => [...prev, `> Failed to install ${newPackageName}`]);
      }
    } catch (error) {
      setConsoleOutput(prev => [...prev, `> Error installing package`]);
    }
    setInstallingPackage(false);
  };

  const handleRemovePackage = async (packageName: string) => {
    if (!projectId) return;
    setConsoleOutput(prev => [...prev, `> Removing ${packageName}...`]);
    try {
      const res = await fetch(`/api/studio/projects/${projectId}/packages/${encodeURIComponent(packageName)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPackages(prev => prev.filter(p => p.name !== packageName));
        setConsoleOutput(prev => [...prev, `> Removed ${packageName}`]);
      }
    } catch (error) {
      setConsoleOutput(prev => [...prev, `> Error removing package`]);
    }
  };

  const handleSaveCustomDomain = async () => {
    if (!currentDeployment || !customDomainInput.trim()) return;
    setSavingDomain(true);
    try {
      const res = await fetch(`/api/studio/deployments/${currentDeployment.id}/domain`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customDomain: customDomainInput.trim() }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCurrentDeployment(updated);
        setConsoleOutput(prev => [...prev, `> Custom domain set: ${updated.customDomain}`]);
        setCustomDomainInput("");
      }
    } catch (error) {
      setConsoleOutput(prev => [...prev, `> Error setting custom domain`]);
    }
    setSavingDomain(false);
  };

  useEffect(() => {
    if (projectId) {
      loadCommits();
      loadDeployments();
    }
  }, [projectId]);

  const activeFileRef = useRef<FileNode | null>(null);
  activeFileRef.current = activeFile;

  useEffect(() => {
    if (!projectId || !user) return;
    
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws/studio`);
    wsRef.current = ws;
    
    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        projectId,
        userId: user?.id,
        userName: user?.displayName || user?.email || "User",
      }));
      setTimeout(() => {
        if (ws.readyState === WebSocket.OPEN && activeFileRef.current) {
          ws.send(JSON.stringify({
            type: "cursor",
            projectId,
            file: activeFileRef.current.name,
            cursor: { line: 1, column: 1 },
          }));
        }
      }, 200);
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "presence") {
          setPresence(data.users.filter((u: PresenceUser) => u.id !== user?.id));
        }
      } catch {}
    };
    
    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [projectId, user]);

  useEffect(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && projectId && activeFile) {
      wsRef.current.send(JSON.stringify({
        type: "cursor",
        projectId,
        file: activeFile.name,
        cursor: { line: 1, column: 1 },
      }));
    }
  }, [activeFile, projectId]);

  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showHelpMenu, setShowHelpMenu] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const isCmd = e.metaKey || e.ctrlKey;
    
    if (isCmd && e.key === "k") {
      e.preventDefault();
      e.stopPropagation();
      setShowCommandPalette(true);
      setCommandSearch("");
      setTimeout(() => commandInputRef.current?.focus(), 50);
    } else if (isCmd && e.key === "s") {
      e.preventDefault();
      e.stopPropagation();
      handleSave();
    } else if (isCmd && e.key === "f") {
      e.preventDefault();
      e.stopPropagation();
      setActiveTab("search");
    } else if (isCmd && e.key === "i") {
      e.preventDefault();
      e.stopPropagation();
      setShowAiPanel(prev => !prev);
    } else if (isCmd && e.shiftKey && e.key === "K") {
      e.preventDefault();
      e.stopPropagation();
      setAgentMode(true);
      setShowAiPanel(true);
    } else if (isCmd && e.key === "b") {
      e.preventDefault();
      e.stopPropagation();
      setBottomTab("console");
    } else if (isCmd && e.key === "/") {
      e.preventDefault();
      e.stopPropagation();
      setShowShortcuts(prev => !prev);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setShowCommandPalette(false);
      setShowShortcuts(false);
      setRenamingFile(null);
    }
  }, [activeFile, editorContent]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#050508]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Trust Layer Studio...</p>
        </div>
      </div>
    );
  }

  // Demo mode for non-logged-in users - they can view but not save/run
  const isViewOnly = !user;

  return (
    <div className="h-screen flex flex-col bg-[#050508] text-foreground overflow-hidden pb-6">
      {/* View-Only Banner for non-logged-in users */}
      {isViewOnly && (
        <div className="bg-slate-900/80 border-b border-[#1a1b2e] px-4 py-1.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Eye className="w-3 h-3 text-slate-400" />
            <span className="text-xs text-slate-400">View-Only Mode</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowLoginModal(true)}
            className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 text-xs h-6 px-3"
            data-testid="button-login-banner"
          >
            Sign In
          </Button>
        </div>
      )}
      
      {/* Top Bar - Desktop */}
      <header className="hidden md:flex h-12 border-b border-[#1a1b2e] bg-background/95 items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2" data-testid="link-home">
            <Shield className="w-7 h-7 text-cyan-400" />
          </Link>
          <span className="text-white/30">/</span>
          <span className="font-mono text-sm">{projectName}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => { setShowSettings(true); setEditingProjectName(projectName); }}
            className="h-6 w-6 p-0"
            data-testid="button-settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </Button>
          
          {/* Help Menu Button */}
          <div className="relative">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowHelpMenu(!showHelpMenu)}
              className="h-6 px-2 gap-1 text-xs"
              data-testid="button-help-menu"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Help
            </Button>
            {showHelpMenu && (
              <div 
                className="absolute top-full left-0 mt-1 w-56 bg-slate-900 border border-[#1a1b2e] rounded-lg shadow-xl z-50 overflow-hidden"
                onMouseLeave={() => setShowHelpMenu(false)}
              >
                <div className="p-2 border-b border-[#1a1b2e]">
                  <p className="text-xs text-white/40 uppercase">Help & Resources</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => { setShowShortcuts(true); setShowHelpMenu(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left hover:bg-white/5 transition-colors"
                    data-testid="help-shortcuts"
                  >
                    <Keyboard className="w-4 h-4 text-cyan-400" />
                    <div>
                      <p className="font-medium">Keyboard Shortcuts</p>
                      <p className="text-xs text-white/40">Ctrl+K for commands</p>
                    </div>
                  </button>
                  <Link href="/studio/docs" onClick={() => setShowHelpMenu(false)}>
                    <div className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left hover:bg-white/5 transition-colors">
                      <BookOpen className="w-4 h-4 text-purple-400" />
                      <div>
                        <p className="font-medium">Full Documentation</p>
                        <p className="text-xs text-white/40">Learn how to use the IDE</p>
                      </div>
                    </div>
                  </Link>
                  <a href="https://discord.gg/trustlayer" target="_blank" rel="noopener noreferrer" onClick={() => setShowHelpMenu(false)}>
                    <div className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left hover:bg-white/5 transition-colors">
                      <MessageSquare className="w-4 h-4 text-green-400" />
                      <div>
                        <p className="font-medium">Community Discord</p>
                        <p className="text-xs text-white/40">Get help from developers</p>
                      </div>
                    </div>
                  </a>
                  <a href="/tutorials" onClick={() => setShowHelpMenu(false)}>
                    <div className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left hover:bg-white/5 transition-colors">
                      <Video className="w-4 h-4 text-amber-400" />
                      <div>
                        <p className="font-medium">Video Tutorials</p>
                        <p className="text-xs text-white/40">Watch step-by-step guides</p>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="p-2 border-t border-[#1a1b2e] bg-white/5">
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <GraduationCap className="w-3 h-3" />
                    <span>Press F1 in editor for quick help</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {presence.length > 0 && (
            <div className="flex items-center gap-1 ml-3">
              <Users className="w-3.5 h-3.5 text-muted-foreground" />
              <div className="flex -space-x-1">
                {presence.slice(0, 4).map((u) => (
                  <Tooltip key={u.id}>
                    <TooltipTrigger>
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-background cursor-pointer transition-transform hover:scale-110 hover:z-10"
                        style={{ backgroundColor: u.color }}
                        data-testid={`presence-user-${u.id}`}
                      >
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{u.name} is editing{u.file ? ` ${u.file}` : ""}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
                {presence.length > 4 && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gray-600 border-2 border-background">
                    +{presence.length - 4}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Voice Input Button */}
          {voiceSupported && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant={isListening ? "default" : "ghost"}
                  onClick={toggleVoiceInput}
                  className={`h-8 w-8 p-0 ${isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : ""}`}
                  data-testid="button-voice"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isListening ? "Stop voice input" : "Voice to text"}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {/* Command Palette Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => { setShowCommandPalette(true); setCommandSearch(""); setTimeout(() => commandInputRef.current?.focus(), 50); }}
                className="h-8 w-8 p-0 hover:bg-cyan-500/10"
                data-testid="button-command-palette"
              >
                <Command className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Command Palette (Ctrl+K)</p>
            </TooltipContent>
          </Tooltip>
          {/* Split View Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant={splitView !== "none" ? "default" : "ghost"}
                onClick={() => {
                  if (splitView !== "none") { setSplitView("none"); setSplitFile(null); }
                  else if (activeFile) { setSplitFile(activeFile); setSplitView("horizontal"); setSplitEditorContent(editorContent); }
                }}
                className={`h-8 w-8 p-0 ${splitView !== "none" ? "bg-cyan-500/20 text-cyan-400" : ""}`}
                data-testid="button-split-view"
              >
                <SplitSquareHorizontal className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{splitView !== "none" ? "Close Split View" : "Split Editor"}</p>
            </TooltipContent>
          </Tooltip>
          {/* Integrations Hub Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant={showIntegrations ? "default" : "ghost"}
                onClick={() => setShowIntegrations(!showIntegrations)}
                className={`h-8 w-8 p-0 ${showIntegrations ? "bg-cyan-500/20 text-cyan-400" : ""}`}
                data-testid="button-integrations"
              >
                <Link2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Integrations Hub</p>
            </TooltipContent>
          </Tooltip>
          {/* AI Assistant Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant={showAiPanel ? "default" : "ghost"}
                onClick={() => setShowAiPanel(!showAiPanel)}
                className={`h-8 w-8 p-0 ${showAiPanel ? "bg-gradient-to-r from-purple-500 to-cyan-500" : ""}`}
                data-testid="button-ai-assistant"
              >
                <Sparkles className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>AI Assistant (Ctrl+I)</p>
            </TooltipContent>
          </Tooltip>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSave}
            disabled={saving || isViewOnly}
            className="gap-2 text-xs"
            data-testid="button-save"
            title={isViewOnly ? "Sign in to save" : undefined}
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "Saving..." : "Save"}
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant={showPreview ? "default" : "ghost"}
                onClick={() => setShowPreview(!showPreview)}
                className={`gap-2 text-xs ${showPreview ? "bg-cyan-600 hover:bg-cyan-700" : ""}`}
                data-testid="button-preview"
              >
                <Globe className="w-3.5 h-3.5" />
                Preview
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Live Preview</p>
            </TooltipContent>
          </Tooltip>
          <Button
            size="sm"
            className="gap-2 bg-green-600 hover:bg-green-700 text-xs transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,197,94,0.5)] hover:scale-105"
            onClick={handleRun}
            disabled={running || isViewOnly}
            data-testid="button-run"
            title={isViewOnly ? "Sign in to run" : undefined}
          >
            <Play className="w-3.5 h-3.5" />
            {running ? "Running..." : "Run"}
          </Button>
          <Button
            size="sm"
            className="gap-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-xs transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] hover:scale-105"
            onClick={handleDeploy}
            disabled={deploying || isViewOnly}
            data-testid="button-deploy"
            title={isViewOnly ? "Sign in to deploy" : undefined}
          >
            <Rocket className="w-3.5 h-3.5" />
            {deploying ? "Deploying..." : "Deploy"}
          </Button>
        </div>
      </header>

      {/* Mobile Header - Clean stacked layout */}
      <div className="md:hidden border-b border-[#1a1b2e] bg-background/95 shrink-0">
        {/* Row 1: Project info */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#1a1b2e]">
          <div className="flex items-center gap-2 min-w-0">
            <Link href="/" className="shrink-0" data-testid="link-home-mobile">
              <Shield className="w-7 h-7 text-cyan-400" />
            </Link>
            <span className="font-mono text-sm truncate">{projectName}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => { setShowSettings(true); setEditingProjectName(projectName); }}
              className="h-6 w-6 p-0 shrink-0"
              data-testid="button-settings-mobile"
            >
              <Settings className="w-3.5 h-3.5" />
            </Button>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {/* Voice Input - Mobile */}
            {voiceSupported && (
              <Button
                size="sm"
                variant={isListening ? "default" : "ghost"}
                onClick={toggleVoiceInput}
                className={`h-8 w-8 p-0 ${isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : ""}`}
                data-testid="button-voice-mobile"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            )}
            {/* AI Assistant - Mobile */}
            <Button
              size="sm"
              variant={showAiPanel ? "default" : "ghost"}
              onClick={() => setShowAiPanel(!showAiPanel)}
              className={`h-8 w-8 p-0 ${showAiPanel ? "bg-gradient-to-r from-purple-500 to-cyan-500" : ""}`}
              data-testid="button-ai-mobile"
            >
              <Sparkles className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSave}
              disabled={saving || isViewOnly}
              className="h-8 w-8 p-0"
              data-testid="button-save-mobile"
            >
              <Save className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              className="h-8 px-3 bg-green-600 hover:bg-green-700 text-xs"
              onClick={handleRun}
              disabled={running || isViewOnly}
              data-testid="button-run-mobile"
            >
              <Play className="w-3.5 h-3.5 mr-1" />
              Run
            </Button>
          </div>
        </div>
        
        {/* Row 2: View tabs */}
        <div className="flex bg-[#0a0b10]">
          <button
            className={`flex-1 py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${mobileView === "files" ? "bg-primary/20 text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
            onClick={() => setMobileView("files")}
          >
            <FolderOpen className="w-4 h-4" /> Files
          </button>
          <button
            className={`flex-1 py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${mobileView === "editor" ? "bg-primary/20 text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
            onClick={() => setMobileView("editor")}
          >
            <FileCode className="w-4 h-4" /> Editor
          </button>
          <button
            className={`flex-1 py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${mobileView === "preview" as any ? "bg-cyan-500/20 text-cyan-400 border-b-2 border-cyan-400" : "text-muted-foreground"}`}
            onClick={() => { setMobileView("preview" as any); setShowPreview(true); }}
          >
            <Globe className="w-4 h-4" /> Preview
          </button>
          <button
            className={`flex-1 py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${mobileView === "console" ? "bg-primary/20 text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
            onClick={() => setMobileView("console")}
          >
            <Terminal className="w-4 h-4" /> Console
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Hidden on mobile, shown based on mobileView */}
        <aside className={`w-full md:w-64 border-r border-[#1a1b2e] bg-[#0a0b10] flex flex-col shrink-0 ${mobileView === "files" ? "flex" : "hidden"} md:flex`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <TabsList className="w-full grid grid-cols-5 h-10 bg-transparent border-b border-[#1a1b2e] rounded-none">
              <TabsTrigger value="files" className="text-xs data-[state=active]:bg-white/5 rounded-none" data-testid="tab-files">
                <FolderOpen className="w-3.5 h-3.5 mr-1" /> Files
              </TabsTrigger>
              <TabsTrigger value="search" className="text-xs data-[state=active]:bg-white/5 rounded-none" data-testid="tab-search">
                <Search className="w-3.5 h-3.5 mr-1" /> Search
              </TabsTrigger>
              <TabsTrigger value="database" className="text-xs data-[state=active]:bg-white/5 rounded-none" data-testid="tab-database">
                <Database className="w-3.5 h-3.5 mr-1" /> DB
              </TabsTrigger>
              <TabsTrigger value="secrets" className="text-xs data-[state=active]:bg-white/5 rounded-none" data-testid="tab-secrets">
                <Lock className="w-3.5 h-3.5 mr-1" /> Secrets
              </TabsTrigger>
              <TabsTrigger value="config" className="text-xs data-[state=active]:bg-white/5 rounded-none" data-testid="tab-config">
                <Settings className="w-3.5 h-3.5 mr-1" /> Config
              </TabsTrigger>
            </TabsList>

            <TabsContent value="files" className="flex-1 overflow-auto p-2 m-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground uppercase">Files</span>
                <div className="flex items-center gap-0.5">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => setShowNewFile(true)}
                    data-testid="button-new-file"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => fileInputRef.current?.click()}
                    data-testid="button-upload-file"
                  >
                    <Upload className="w-3.5 h-3.5" />
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    multiple
                    className="hidden"
                    data-testid="input-file-upload"
                  />
                </div>
              </div>

              {files.length === 0 && (
                <div className="mb-4">
                  <span className="text-xs text-muted-foreground block mb-2">Quick Start Templates</span>
                  <div className="space-y-1.5">
                    {Object.entries(PROJECT_TEMPLATES).map(([key, template]) => (
                      <Button
                        key={key}
                        size="sm"
                        variant="outline"
                        className="w-full justify-start text-xs h-8 bg-[#0f1018] border-[#1a1b2e] hover:bg-white/5 hover:border-cyan-400/50"
                        onClick={() => applyTemplate(key as keyof typeof PROJECT_TEMPLATES)}
                        data-testid={`template-${key}`}
                      >
                        <span className="mr-2">{template.icon}</span>
                        {template.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {showNewFile && (
                <div className="flex items-center gap-1 mb-2">
                  <Input
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="filename.js"
                    className="h-7 text-xs bg-[#0a0b10]"
                    onKeyDown={(e) => e.key === "Enter" && handleCreateFile()}
                    autoFocus
                    data-testid="input-new-filename"
                  />
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={handleCreateFile}>
                    <Check className="w-3 h-3 text-green-400" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setShowNewFile(false)}>
                    <X className="w-3 h-3 text-red-400" />
                  </Button>
                </div>
              )}

              <div className="space-y-0.5">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className={`group flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-sm hover:bg-white/5 ${
                      activeFile?.id === file.id ? "bg-primary/20 text-primary" : ""
                    }`}
                    onClick={() => renamingFile?.id !== file.id && handleFileSelect(file)}
                    data-testid={`file-${file.id}`}
                  >
                    {getFileIcon(file.name, file.isFolder)}
                    {renamingFile?.id === file.id ? (
                      <Input
                        value={renameInput}
                        onChange={(e) => setRenameInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleRename();
                          if (e.key === "Escape") { setRenamingFile(null); setRenameInput(""); }
                        }}
                        onBlur={handleRename}
                        className="flex-1 h-5 text-xs py-0 px-1 bg-[#0a0b10]"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        data-testid="input-rename-file"
                      />
                    ) : (
                      <span className="flex-1 truncate">{file.name}</span>
                    )}
                    {!file.isFolder && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100"
                        onClick={(e) => { e.stopPropagation(); handleDownloadFile(file); }}
                        data-testid={`download-file-${file.id}`}
                      >
                        <Download className="w-3 h-3 text-emerald-400" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100"
                      onClick={(e) => { e.stopPropagation(); startRename(file); }}
                      data-testid={`rename-file-${file.id}`}
                    >
                      <Edit2 className="w-3 h-3 text-cyan-400" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100"
                      onClick={(e) => { e.stopPropagation(); handleDeleteFile(file.id); }}
                      data-testid={`delete-file-${file.id}`}
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="search" className="flex-1 overflow-auto p-2 m-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground uppercase">Search & Replace</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Find and replace across all project files.
              </p>

              <div className="space-y-2 mb-3">
                <div className="relative">
                  <Search className="w-3 h-3 absolute left-2.5 top-2.5 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search..."
                    className="h-8 text-xs bg-[#0a0b10] pl-8"
                    data-testid="input-search"
                  />
                </div>
                <div className="relative">
                  <Replace className="w-3 h-3 absolute left-2.5 top-2.5 text-muted-foreground" />
                  <Input
                    value={replaceQuery}
                    onChange={(e) => setReplaceQuery(e.target.value)}
                    placeholder="Replace with..."
                    className="h-8 text-xs bg-[#0a0b10] pl-8"
                    data-testid="input-replace"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSearch}
                    className="flex-1 text-xs"
                    data-testid="button-search"
                  >
                    <Search className="w-3 h-3 mr-1" /> Find
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleReplaceAll}
                    disabled={!searchQuery || !replaceQuery || searchResults.length === 0}
                    className="flex-1 text-xs"
                    data-testid="button-replace-all"
                  >
                    <Replace className="w-3 h-3 mr-1" /> Replace All
                  </Button>
                </div>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">{searchResults.length} result{searchResults.length !== 1 ? 's' : ''}</span>
                  <div className="space-y-1 max-h-64 overflow-auto">
                    {searchResults.map((result, idx) => (
                      <div
                        key={idx}
                        onClick={() => jumpToSearchResult(result)}
                        className="p-2 rounded bg-[#0a0b10] text-xs cursor-pointer hover:bg-white/5 transition-colors"
                        data-testid={`search-result-${idx}`}
                      >
                        <div className="flex items-center gap-2 text-cyan-400 mb-1">
                          <FileCode className="w-3 h-3" />
                          <span className="font-medium">{result.fileName}</span>
                          <span className="text-muted-foreground">:{result.line}</span>
                        </div>
                        <code className="text-gray-400 text-xs block truncate">{result.content}</code>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="database" className="flex-1 overflow-auto p-2 m-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground uppercase flex items-center gap-1">
                  Database Explorer
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3 h-3 text-muted-foreground hover:text-cyan-400 transition-colors cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs bg-black/90 border-[#1a1b2e]">
                      <p className="text-xs">Browse tables, view data, and run SQL queries on your project database.</p>
                    </TooltipContent>
                  </Tooltip>
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={async () => {
                    setDbLoading(true);
                    setDbError(null);
                    try {
                      const res = await fetch("/api/studio/database/tables");
                      if (!res.ok) throw new Error("Failed to fetch tables");
                      const data = await res.json();
                      setDbTables(data.tables || []);
                    } catch (e: any) {
                      setDbError(e.message);
                    } finally {
                      setDbLoading(false);
                    }
                  }}
                  data-testid="button-refresh-tables"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${dbLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>

              {dbError && (
                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded p-2 mb-2">
                  {dbError}
                </div>
              )}

              <div className="space-y-1 mb-3">
                {dbTables.length === 0 && !dbLoading && (
                  <p className="text-xs text-muted-foreground">Click refresh to load tables from your database.</p>
                )}
                {dbTables.map((table) => (
                  <div
                    key={table.name}
                    onClick={async () => {
                      setSelectedTable(table.name);
                      setDbLoading(true);
                      try {
                        const res = await fetch(`/api/studio/database/table/${table.name}`);
                        if (!res.ok) throw new Error("Failed to fetch table data");
                        const data = await res.json();
                        setTableColumns(data.columns || []);
                        setTableRows(data.rows || []);
                      } catch (e: any) {
                        setDbError(e.message);
                      } finally {
                        setDbLoading(false);
                      }
                    }}
                    className={`flex items-center justify-between gap-2 p-2 rounded cursor-pointer text-xs transition-colors ${
                      selectedTable === table.name ? "bg-cyan-500/20 text-cyan-400" : "bg-[#0a0b10] hover:bg-white/5"
                    }`}
                    data-testid={`table-${table.name}`}
                  >
                    <div className="flex items-center gap-2">
                      <Database className="w-3 h-3" />
                      <span className="font-mono">{table.name}</span>
                    </div>
                    <span className="text-muted-foreground">{table.rowCount} rows</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#1a1b2e] pt-2">
                <span className="text-xs text-muted-foreground block mb-2">SQL Query</span>
                <textarea
                  value={dbQuery}
                  onChange={(e) => setDbQuery(e.target.value)}
                  placeholder="SELECT * FROM users LIMIT 10;"
                  className="w-full h-16 text-xs bg-[#0a0b10] border border-[#1a1b2e] rounded p-2 font-mono resize-none focus:outline-none focus:border-cyan-400/50"
                  data-testid="input-sql-query"
                />
                <Button
                  size="sm"
                  onClick={async () => {
                    if (!dbQuery.trim()) return;
                    setDbLoading(true);
                    setDbError(null);
                    setDbQueryResult(null);
                    try {
                      const res = await fetch("/api/studio/database/query", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ query: dbQuery }),
                      });
                      if (!res.ok) {
                        const err = await res.json();
                        throw new Error(err.error || "Query failed");
                      }
                      const data = await res.json();
                      setDbQueryResult(data);
                    } catch (e: any) {
                      setDbError(e.message);
                    } finally {
                      setDbLoading(false);
                    }
                  }}
                  className="w-full mt-2 text-xs"
                  disabled={dbLoading || !dbQuery.trim()}
                  data-testid="button-run-query"
                >
                  {dbLoading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Play className="w-3 h-3 mr-1" />}
                  Run Query
                </Button>
              </div>

              {dbQueryResult && (
                <div className="mt-2 p-2 bg-[#0a0b10] rounded text-xs border border-[#1a1b2e] max-h-32 overflow-auto">
                  <pre className="text-gray-300 whitespace-pre-wrap">{JSON.stringify(dbQueryResult, null, 2)}</pre>
                </div>
              )}
            </TabsContent>

            <TabsContent value="secrets" className="flex-1 overflow-auto p-2 m-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground uppercase flex items-center gap-1">
                  Environment Variables
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3 h-3 text-muted-foreground hover:text-cyan-400 transition-colors cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs bg-black/90 border-[#1a1b2e]">
                      <p className="text-xs">{PROTOCOL_DEFINITIONS["Secret"]}</p>
                    </TooltipContent>
                  </Tooltip>
                </span>
              </div>
              
              <div className="flex items-center gap-1 mb-3 p-1 rounded bg-[#0a0b10] border border-[#1a1b2e]">
                <Button
                  size="sm"
                  variant={envMode === "dev" ? "secondary" : "ghost"}
                  onClick={() => setEnvMode("dev")}
                  className={`flex-1 h-6 text-xs ${envMode === "dev" ? "bg-cyan-500/20 text-cyan-400" : ""}`}
                  data-testid="button-env-dev"
                >
                  Development
                </Button>
                <Button
                  size="sm"
                  variant={envMode === "prod" ? "secondary" : "ghost"}
                  onClick={() => setEnvMode("prod")}
                  className={`flex-1 h-6 text-xs ${envMode === "prod" ? "bg-emerald-500/20 text-emerald-400" : ""}`}
                  data-testid="button-env-prod"
                >
                  Production
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground mb-3">
                {envMode === "dev" 
                  ? "Development secrets - used during local development and testing." 
                  : "Production secrets - used in deployed/published environments."}
              </p>

              <div className="space-y-2 mb-3">
                {secrets
                  .filter((s: any) => !s.environment || s.environment === "shared" || s.environment === envMode)
                  .map((secret) => (
                    <div key={secret.id} className="flex items-center gap-2 p-2 rounded bg-[#0a0b10] text-xs">
                      <Lock className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="font-mono">{secret.key}</span>
                      <span className="text-muted-foreground">= ••••••</span>
                      {(secret as any).environment && (secret as any).environment !== "shared" && (
                        <span className={`text-xs px-1 rounded ${(secret as any).environment === "dev" ? "bg-cyan-500/20 text-cyan-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                          {(secret as any).environment}
                        </span>
                      )}
                    </div>
                  ))}
              </div>

              <div className="space-y-2">
                <Input
                  value={newSecretKey}
                  onChange={(e) => setNewSecretKey(e.target.value)}
                  placeholder="SECRET_KEY"
                  className="h-8 text-xs bg-[#0a0b10] font-mono"
                  data-testid="input-secret-key"
                />
                <Input
                  type="password"
                  value={newSecretValue}
                  onChange={(e) => setNewSecretValue(e.target.value)}
                  placeholder="Value"
                  className="h-8 text-xs bg-[#0a0b10]"
                  data-testid="input-secret-value"
                />
                <Button
                  size="sm"
                  onClick={handleAddSecret}
                  className="w-full text-xs"
                  data-testid="button-add-secret"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add Secret
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="config" className="flex-1 overflow-auto p-2 m-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground uppercase flex items-center gap-1">
                  Configurations
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3 h-3 text-muted-foreground hover:text-cyan-400 transition-colors cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs bg-black/90 border-[#1a1b2e]">
                      <p className="text-xs">{PROTOCOL_DEFINITIONS["Config"]}</p>
                    </TooltipContent>
                  </Tooltip>
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                {envMode === "dev" 
                  ? "Development configs - non-sensitive variables for local development." 
                  : "Production configs - non-sensitive variables for deployed environments."}
              </p>

              <div className="space-y-2 mb-3">
                {configs
                  .filter((c: any) => !c.environment || c.environment === "shared" || c.environment === envMode)
                  .map((config) => (
                    <div key={config.id} className="flex items-center gap-2 p-2 rounded bg-[#0a0b10] text-xs">
                      <Settings className="w-3 h-3 text-blue-400 shrink-0" />
                      <span className="font-mono">{config.key}</span>
                      <span className="text-muted-foreground">= {config.value}</span>
                      {(config as any).environment && (config as any).environment !== "shared" && (
                        <span className={`text-xs px-1 rounded ${(config as any).environment === "dev" ? "bg-cyan-500/20 text-cyan-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                          {(config as any).environment}
                        </span>
                      )}
                    </div>
                  ))}
              </div>

              <div className="space-y-2">
                <Input
                  value={newConfigKey}
                  onChange={(e) => setNewConfigKey(e.target.value)}
                  placeholder="CONFIG_KEY"
                  className="h-8 text-xs bg-[#0a0b10] font-mono"
                  data-testid="input-config-key"
                />
                <Input
                  value={newConfigValue}
                  onChange={(e) => setNewConfigValue(e.target.value)}
                  placeholder="Value"
                  className="h-8 text-xs bg-[#0a0b10]"
                  data-testid="input-config-value"
                />
                <Button
                  size="sm"
                  onClick={handleAddConfig}
                  className="w-full text-xs"
                  data-testid="button-add-config"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add Config
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </aside>

        {/* Editor Area - Hidden on mobile unless mobileView is "editor" or "console" */}
        <main className={`flex-1 flex flex-col overflow-hidden min-w-0 ${mobileView === "files" ? "hidden" : "flex"} md:flex`}>
          {/* File Tabs - Hidden on mobile when viewing console */}
          <div className={`h-9 border-b border-[#1a1b2e] bg-[#0f1018] flex items-center px-1 shrink-0 overflow-x-auto ${mobileView === "console" ? "hidden" : ""} md:flex`}>
            {openTabs.map(tab => (
              <div
                key={tab.id}
                onClick={() => handleFileSelect(tab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs cursor-pointer border-r border-[#1a1b2e] transition-all group hover:bg-white/5 ${
                  activeFile?.id === tab.id 
                    ? "bg-white/10 text-white border-t-2 border-t-cyan-400" 
                    : "text-gray-400"
                }`}
                data-testid={`tab-file-${tab.id}`}
              >
                {getFileIcon(tab.name, false)}
                <span className="max-w-24 truncate">{tab.name}</span>
                {unsavedFiles.has(tab.id) && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Unsaved changes" />
                )}
                <button
                  onClick={(e) => handleCloseTab(e, tab.id)}
                  className="ml-1 p-0.5 rounded hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  data-testid={`button-close-tab-${tab.id}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {openTabs.length === 0 && (
              <span className="text-xs text-gray-500 px-3">No files open</span>
            )}
          </div>

          {/* Code Editor with Optional Preview Split */}
          <div className={`flex-1 overflow-hidden ${mobileView === "console" ? "hidden" : ""} ${mobileView === "preview" ? "flex" : ""} md:flex flex-row`}>
            {/* Editor Pane with Split View (T013) */}
            <div className={`${showPreview ? "hidden md:block md:w-1/2 border-r border-[#1a1b2e]" : "w-full"} h-full transition-all duration-300 ${splitView !== "none" ? (splitView === "horizontal" ? "flex flex-row" : "flex flex-col") : ""}`}>
              <div className={`${splitView !== "none" ? (splitView === "horizontal" ? "w-1/2 border-r border-[#1a1b2e]" : "h-1/2 border-b border-[#1a1b2e]") : "w-full h-full"}`}>
                {activeFile ? (
                  <MonacoEditor
                    value={editorContent}
                    onChange={setEditorContent}
                    language={getLanguage(activeFile.name)}
                    data-testid="editor-monaco"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <FileCode className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">Select a file to edit</p>
                      <p className="text-xs text-muted-foreground mt-1">or create a new file</p>
                    </div>
                  </div>
                )}
              </div>
              {splitView !== "none" && splitFile && (
                <div className={`${splitView === "horizontal" ? "w-1/2" : "h-1/2"} flex flex-col`}>
                  <div className="flex items-center justify-between px-3 py-1 bg-[#0a0b10] border-b border-[#1a1b2e] shrink-0">
                    <div className="flex items-center gap-1.5">
                      <SplitSquareHorizontal className="w-3 h-3 text-cyan-400" />
                      <span className="text-xs text-white/60">{splitFile.name}</span>
                    </div>
                    <Button size="sm" variant="ghost" className="h-5 w-5 p-0" onClick={() => { setSplitView("none"); setSplitFile(null); }} data-testid="button-close-split">
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <MonacoEditor
                      value={splitEditorContent}
                      onChange={setSplitEditorContent}
                      language={getLanguage(splitFile.name)}
                      data-testid="editor-split-monaco"
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Live Preview Pane - Full width on mobile, half on desktop */}
            {showPreview && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full md:w-1/2 h-full flex flex-col bg-[#0a0b10]"
              >
                {/* Preview Header */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-[#1a1b2e] bg-[#0a0b10] shrink-0">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-medium text-white">Live Preview</span>
                    {previewLoading && (
                      <Loader2 className="w-3 h-3 text-cyan-400 animate-spin" />
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={refreshPreview}
                          disabled={previewLoading}
                          className="h-7 w-7 p-0"
                          data-testid="button-refresh-preview"
                        >
                          <RotateCcw className={`w-3.5 h-3.5 ${previewLoading ? "animate-spin" : ""}`} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Refresh Preview</TooltipContent>
                    </Tooltip>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowPreview(false)}
                      className="h-7 w-7 p-0"
                      data-testid="button-close-preview"
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                
                {/* Preview Content */}
                <div className="flex-1 overflow-hidden bg-white">
                  {previewError ? (
                    <div className="flex items-center justify-center h-full bg-red-900/20 p-4">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-500/20 flex items-center justify-center">
                          <X className="w-6 h-6 text-red-400" />
                        </div>
                        <p className="text-red-400 text-sm">{previewError}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={refreshPreview}
                          className="mt-3"
                        >
                          Try Again
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <iframe
                      ref={previewIframeRef}
                      title="Live Preview"
                      className="w-full h-full border-0"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
                      data-testid="iframe-preview"
                    />
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Bottom Bar / Console, Git, Terminal & Deploy - Full height on mobile when viewing console */}
          <div className={`border-t border-[#1a1b2e] bg-gradient-to-b from-black/60 to-black/40 flex flex-col shrink-0 backdrop-blur-sm ${mobileView === "console" ? "flex-1" : "h-48 hidden md:flex"}`}>
            <div className="flex items-center px-1 py-1 border-b border-[#1a1b2e] gap-1">
              <Button
                size="sm"
                variant={bottomTab === "console" ? "secondary" : "ghost"}
                onClick={() => setBottomTab("console")}
                className={`h-6 text-xs px-2 transition-all duration-200 ${bottomTab === "console" ? "bg-green-500/20 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.3)]" : "hover:bg-white/5"}`}
                data-testid="button-console-tab"
              >
                <Zap className="w-3 h-3 mr-1" /> Console
              </Button>
              <Button
                size="sm"
                variant={bottomTab === "terminal" ? "secondary" : "ghost"}
                onClick={() => setBottomTab("terminal")}
                className={`h-6 text-xs px-2 transition-all duration-200 ${bottomTab === "terminal" ? "bg-purple-500/20 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]" : "hover:bg-white/5"}`}
                data-testid="button-terminal-tab"
              >
                <Terminal className="w-3 h-3 mr-1" /> Terminal
              </Button>
              <Button
                size="sm"
                variant={bottomTab === "git" ? "secondary" : "ghost"}
                onClick={() => setBottomTab("git")}
                className={`h-6 text-xs px-2 transition-all duration-200 ${bottomTab === "git" ? "bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]" : "hover:bg-white/5"}`}
                data-testid="button-git-tab"
              >
                <GitBranch className="w-3 h-3 mr-1" /> Git
              </Button>
              <Button
                size="sm"
                variant={bottomTab === "deploy" ? "secondary" : "ghost"}
                onClick={() => setBottomTab("deploy")}
                className={`h-6 text-xs px-2 transition-all duration-200 ${bottomTab === "deploy" ? "bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(139,92,246,0.3)]" : "hover:bg-white/5"}`}
                data-testid="button-deploy-tab"
              >
                <Rocket className="w-3 h-3 mr-1" /> Deploy
              </Button>
              <Button
                size="sm"
                variant={bottomTab === "packages" ? "secondary" : "ghost"}
                onClick={() => setBottomTab("packages")}
                className={`h-6 text-xs px-2 transition-all duration-200 ${bottomTab === "packages" ? "bg-amber-500/20 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]" : "hover:bg-white/5"}`}
                data-testid="button-packages-tab"
              >
                <Package className="w-3 h-3 mr-1" /> Packages
              </Button>
              <Button
                size="sm"
                variant={bottomTab === "cicd" ? "secondary" : "ghost"}
                onClick={() => setBottomTab("cicd")}
                className={`h-6 text-xs px-2 transition-all duration-200 ${bottomTab === "cicd" ? "bg-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "hover:bg-white/5"}`}
                data-testid="button-cicd-tab"
              >
                <Zap className="w-3 h-3 mr-1" /> CI/CD
              </Button>
              <Button
                size="sm"
                variant={bottomTab === "trusthub" ? "secondary" : "ghost"}
                onClick={() => { setBottomTab("trusthub"); loadTrustHubStamps(); }}
                className={`h-6 text-xs px-2 transition-all duration-200 ${bottomTab === "trusthub" ? "bg-indigo-500/20 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.3)]" : "hover:bg-white/5"}`}
                data-testid="button-trusthub-tab"
              >
                <Fingerprint className="w-3 h-3 mr-1" /> TrustHub
              </Button>
              <Button
                size="sm"
                variant={bottomTab === "problems" ? "secondary" : "ghost"}
                onClick={() => setBottomTab("problems")}
                className={`h-6 text-xs px-2 transition-all duration-200 ${bottomTab === "problems" ? "bg-red-500/20 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.3)]" : "hover:bg-white/5"}`}
                data-testid="button-problems-tab"
              >
                <AlertTriangle className="w-3 h-3 mr-1" />
                {diagnosticsSummary.errors > 0 ? (
                  <span className="text-red-400">{diagnosticsSummary.errors}E</span>
                ) : diagnosticsSummary.warnings > 0 ? (
                  <span className="text-amber-400">{diagnosticsSummary.warnings}W</span>
                ) : (
                  "Problems"
                )}
              </Button>
            </div>

            <AnimatePresence mode="wait">
              {bottomTab === "console" && (
                <motion.div
                  key="console"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <div className="flex items-center gap-2 px-2 pt-2 pb-1 border-b border-[#1a1b2e]">
                    <Filter className="w-3 h-3 text-muted-foreground" />
                    <Input
                      value={consoleFilter}
                      onChange={(e) => setConsoleFilter(e.target.value)}
                      placeholder="Filter logs..."
                      className="flex-1 h-6 text-xs bg-[#0f1018] border-[#1a1b2e]"
                      data-testid="input-console-filter"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => setConsoleOutput(["> Console cleared"])}
                      data-testid="button-clear-console"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex-1 p-2 font-mono text-xs overflow-auto">
                    {consoleOutput
                      .filter(line => !consoleFilter || line.toLowerCase().includes(consoleFilter.toLowerCase()))
                      .map((line, i) => (
                        <p key={i} className={`${line.startsWith(">") ? "text-muted-foreground" : line.includes("Error") || line.includes("Warning") ? "text-red-400" : "text-green-400"} transition-colors`}>{line}</p>
                      ))}
                  </div>
                </motion.div>
              )}

              {bottomTab === "terminal" && (
                <motion.div
                  key="terminal"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <div ref={terminalRef} className="flex-1 p-2 font-mono text-xs overflow-auto bg-[#0a0b10]">
                    {terminalHistory.map((line, i) => (
                      <p key={i} className={`${line.type === "input" ? "text-cyan-400" : line.type === "error" ? "text-red-400" : "text-gray-300"}`}>
                        {line.content}
                      </p>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 p-2 border-t border-[#1a1b2e]">
                    <span className="text-cyan-400 font-mono text-xs">$</span>
                    <Input
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleTerminalCommand(terminalInput)}
                      placeholder="Type a command..."
                      className="flex-1 h-6 text-xs bg-transparent border-none focus:ring-0 font-mono text-gray-100"
                      data-testid="input-terminal"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => handleTerminalCommand(terminalInput)}
                    >
                      <Send className="w-3 h-3 text-cyan-400" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {bottomTab === "git" && (
                <motion.div
                  key="git"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex-1 p-2 overflow-auto"
                >
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={commitMessage}
                      onChange={(e) => setCommitMessage(e.target.value)}
                      placeholder="Commit message..."
                      className="h-7 text-xs bg-[#0a0b10] flex-1 border-[#1a1b2e] focus:border-cyan-500/50 transition-colors"
                      onKeyDown={(e) => e.key === "Enter" && handleCommit()}
                      data-testid="input-commit-message"
                    />
                    <Button 
                      size="sm" 
                      onClick={handleCommit} 
                      className="h-7 text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
                      data-testid="button-commit"
                    >
                      <GitCommit className="w-3 h-3 mr-1" /> Commit
                    </Button>
                  </div>
                  <div className="space-y-1 text-xs">
                    {commits.length === 0 ? (
                      <p className="text-muted-foreground">No commits yet. Make your first commit!</p>
                    ) : (
                      commits.slice(0, 5).map((commit) => (
                        <div 
                          key={commit.id} 
                          className="flex items-center gap-2 p-1.5 rounded bg-[#0a0b10] border border-[#1a1b2e] hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all cursor-pointer group"
                        >
                          <GitCommit className="w-3 h-3 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                          <span className="font-mono text-cyan-400">{commit.hash}</span>
                          <span className="text-muted-foreground truncate">{commit.message}</span>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {bottomTab === "deploy" && (
                <motion.div
                  key="deploy"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex-1 p-2 overflow-auto"
                >
                  {currentDeployment ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-[#1a1b2e]">
                        <div className="flex items-center gap-3">
                          {currentDeployment.status === "live" ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : currentDeployment.status === "building" ? (
                            <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                          ) : (
                            <Cloud className="w-5 h-5 text-muted-foreground" />
                          )}
                          <div>
                            <p className="text-sm font-medium">v{currentDeployment.version}</p>
                            <p className="text-xs text-muted-foreground capitalize">{currentDeployment.status}</p>
                          </div>
                        </div>
                        {currentDeployment.url && currentDeployment.status === "live" && (
                          <a
                            href={currentDeployment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Visit
                          </a>
                        )}
                      </div>
                      {currentDeployment.url && (
                        <div className="flex items-center gap-2 p-2 rounded bg-[#0a0b10] border border-[#1a1b2e]">
                          <Link2 className="w-3 h-3 text-muted-foreground" />
                          <code className="text-xs text-cyan-400 flex-1 truncate">{currentDeployment.url}</code>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-5 w-5 p-0"
                            onClick={() => navigator.clipboard.writeText(currentDeployment.url || "")}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                      {currentDeployment.customDomain && (
                        <div className="flex items-center gap-2 p-2 rounded bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30">
                          <Globe className="w-3 h-3 text-emerald-400" />
                          <code className="text-xs text-emerald-400 flex-1 truncate">{currentDeployment.customDomain}</code>
                          <span className="text-xs text-emerald-400/70">Custom Domain</span>
                        </div>
                      )}
                      {currentDeployment.status === "live" && !currentDeployment.customDomain && (
                        <div className="mt-2 p-2 rounded bg-[#0a0b10] border border-[#1a1b2e]">
                          <p className="text-xs text-muted-foreground mb-2">Link a custom domain:</p>
                          <div className="flex gap-2">
                            <Input
                              value={customDomainInput}
                              onChange={(e) => setCustomDomainInput(e.target.value)}
                              placeholder="yourdomain.com"
                              className="h-7 text-xs bg-[#0a0b10] flex-1 border-[#1a1b2e] focus:border-emerald-500/50 transition-colors"
                              onKeyDown={(e) => e.key === "Enter" && handleSaveCustomDomain()}
                              data-testid="input-custom-domain"
                            />
                            <Button 
                              size="sm" 
                              onClick={handleSaveCustomDomain}
                              disabled={savingDomain || !customDomainInput.trim()}
                              className="h-7 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all disabled:opacity-50"
                              data-testid="button-save-domain"
                            >
                              {savingDomain ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Check className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Rocket className="w-8 h-8 text-muted-foreground mb-2 opacity-50" />
                      <p className="text-xs text-muted-foreground">No deployments yet</p>
                      <p className="text-xs text-muted-foreground mt-1">Click "Deploy" to publish your project</p>
                    </div>
                  )}
                </motion.div>
              )}

              {bottomTab === "packages" && (
                <motion.div
                  key="packages"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex-1 p-2 overflow-auto"
                >
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={newPackageName}
                      onChange={(e) => setNewPackageName(e.target.value)}
                      placeholder={packageManager === "pip" ? "package-name" : "package-name@version"}
                      className="h-7 text-xs bg-[#0a0b10] flex-1 border-[#1a1b2e] focus:border-amber-500/50 transition-colors"
                      onKeyDown={(e) => e.key === "Enter" && handleInstallPackage()}
                      data-testid="input-package-name"
                    />
                    <Button 
                      size="sm" 
                      onClick={handleInstallPackage}
                      disabled={installingPackage || !newPackageName.trim()}
                      className="h-7 text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all disabled:opacity-50"
                      data-testid="button-install-package"
                    >
                      {installingPackage ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <Plus className="w-3 h-3 mr-1" />
                      )}
                      Install
                    </Button>
                  </div>
                  {packageManager && (
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Manager:</span>
                      <span className="text-xs text-amber-400 font-mono">{packageManager}</span>
                    </div>
                  )}
                  <div className="space-y-1">
                    {packages.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">
                        No packages installed. Add package.json or requirements.txt to manage dependencies.
                      </p>
                    ) : (
                      packages.map((pkg) => (
                        <div 
                          key={pkg.name}
                          className="flex items-center justify-between p-1.5 rounded bg-[#0a0b10] border border-[#1a1b2e] hover:border-amber-500/30 hover:bg-amber-500/5 transition-all group"
                        >
                          <div className="flex items-center gap-2">
                            <Package className="w-3 h-3 text-amber-400 shrink-0" />
                            <span className="text-xs text-gray-200">{pkg.name}</span>
                            <span className="text-xs text-muted-foreground font-mono">{pkg.version}</span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemovePackage(pkg.name)}
                          >
                            <X className="w-3 h-3 text-red-400" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {bottomTab === "cicd" && (
                <motion.div
                  key="cicd"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex-1 p-3 overflow-auto"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-muted-foreground uppercase">CI/CD Pipeline Runner</span>
                    <div className="flex items-center gap-2">
                      <select
                        value={newPipelineTrigger}
                        onChange={(e) => setNewPipelineTrigger(e.target.value)}
                        className="h-6 text-[10px] bg-[#0a0b10] border border-[#1a1b2e] rounded px-2 text-gray-300"
                        data-testid="select-pipeline-template"
                      >
                        <option value="node">Node.js Standard</option>
                        <option value="python">Python</option>
                        <option value="rust">Rust</option>
                        <option value="custom">Custom</option>
                      </select>
                      <Button
                        size="sm"
                        className="h-6 text-xs px-3 bg-emerald-600 hover:bg-emerald-700"
                        onClick={async () => {
                          if (!projectId) return;
                          setConsoleOutput(prev => [...prev, "> Starting CI/CD pipeline..."]);
                          try {
                            const res = await fetch("/api/studio/pipeline/run", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ projectId, template: newPipelineTrigger }),
                            });
                            if (res.ok) {
                              const reader = res.body?.getReader();
                              const decoder = new TextDecoder();
                              while (reader) {
                                const { done, value } = await reader.read();
                                if (done) break;
                                const text = decoder.decode(value);
                                for (const line of text.split("\n")) {
                                  if (line.startsWith("data: ")) {
                                    try {
                                      const data = JSON.parse(line.slice(6));
                                      if (data.step) {
                                        setPipelines(prev => {
                                          const existing = prev.find(p => p.id === data.runId);
                                          if (existing) return prev.map(p => p.id === data.runId ? { ...p, status: data.status, lastRun: data.step } : p);
                                          return [...prev, { id: data.runId || "run", name: data.step, trigger: newPipelineTrigger, status: data.status, lastRun: "Now" }];
                                        });
                                      }
                                      if (data.output) setConsoleOutput(prev => [...prev, `> ${data.output}`]);
                                    } catch {}
                                  }
                                }
                              }
                            }
                          } catch (error) {
                            setConsoleOutput(prev => [...prev, "> Pipeline error: " + String(error)]);
                          }
                        }}
                        data-testid="button-run-pipeline"
                      >
                        <Play className="w-3 h-3 mr-1" /> Run Pipeline
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {pipelines.map((pipeline) => (
                      <div
                        key={pipeline.id}
                        className="flex items-center justify-between p-2 rounded bg-[#0a0b10] border border-[#1a1b2e] hover:border-emerald-500/30 transition-all group"
                        data-testid={`pipeline-${pipeline.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            pipeline.status === "success" ? "bg-green-400" :
                            pipeline.status === "failed" ? "bg-red-400" :
                            pipeline.status === "running" ? "bg-cyan-400 animate-pulse" :
                            "bg-gray-400"
                          }`} />
                          <div>
                            <p className="text-xs text-gray-200">{pipeline.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {pipeline.trigger} {pipeline.lastRun}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                            pipeline.status === "success" ? "bg-green-500/20 text-green-400" :
                            pipeline.status === "failed" ? "bg-red-500/20 text-red-400" :
                            pipeline.status === "running" ? "bg-cyan-500/20 text-cyan-400" :
                            "bg-gray-500/20 text-gray-400"
                          }`}>{pipeline.status}</span>
                        </div>
                      </div>
                    ))}
                    {pipelines.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-4">
                        Select a template and run your first pipeline.
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TrustHub Panel (T005) */}
              {bottomTab === "trusthub" && (
                <motion.div
                  key="trusthub"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex-1 p-3 overflow-auto"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground uppercase">Blockchain Code Provenance</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">{trustHubStamps.length} stamps</span>
                    </div>
                    <Button
                      size="sm"
                      className="h-6 text-xs px-3 bg-indigo-600 hover:bg-indigo-700"
                      onClick={stampCode}
                      disabled={stampingCode || !projectId}
                      data-testid="button-stamp-code"
                    >
                      {stampingCode ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Fingerprint className="w-3 h-3 mr-1" />}
                      Stamp Code
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {trustHubStamps.map((stamp: any, i: number) => (
                      <div key={stamp.id || i} className="flex items-center justify-between p-2 rounded bg-[#0a0b10] border border-[#1a1b2e] hover:border-indigo-500/30 transition-all" data-testid={`stamp-${i}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded bg-indigo-500/20 flex items-center justify-center">
                            <Hash className="w-3 h-3 text-indigo-400" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-200 font-mono">{stamp.txHash?.slice(0, 20)}...</p>
                            <p className="text-[10px] text-muted-foreground">
                              Block #{stamp.blockNumber} {stamp.createdAt ? new Date(stamp.createdAt).toLocaleString() : ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-green-400" />
                          <span className="text-[10px] text-green-400">Verified</span>
                        </div>
                      </div>
                    ))}
                    {trustHubStamps.length === 0 && (
                      <div className="text-center py-6">
                        <Fingerprint className="w-8 h-8 mx-auto mb-2 text-indigo-400/30" />
                        <p className="text-xs text-muted-foreground">No code stamps yet.</p>
                        <p className="text-[10px] text-white/20 mt-1">Stamp your code to register it on the Trust Layer blockchain.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Problems Panel (T014) */}
              {bottomTab === "problems" && (
                <motion.div
                  key="problems"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex-1 p-3 overflow-auto"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground uppercase">Diagnostics</span>
                      {diagnosticsSummary.errors > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">{diagnosticsSummary.errors} errors</span>}
                      {diagnosticsSummary.warnings > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">{diagnosticsSummary.warnings} warnings</span>}
                      {diagnosticsSummary.info > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">{diagnosticsSummary.info} info</span>}
                    </div>
                    <Button
                      size="sm"
                      className="h-6 text-xs px-3 bg-purple-600 hover:bg-purple-700"
                      onClick={() => { if (activeFile) runLint(editorContent, activeFile.name); }}
                      data-testid="button-run-lint"
                    >
                      <Zap className="w-3 h-3 mr-1" /> Lint
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {diagnostics.map((d, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-2 p-2 rounded text-xs border transition-all cursor-pointer hover:bg-white/5 ${
                          d.severity === "error" ? "border-red-500/20 bg-red-500/5" :
                          d.severity === "warning" ? "border-amber-500/20 bg-amber-500/5" :
                          "border-blue-500/20 bg-blue-500/5"
                        }`}
                        data-testid={`diagnostic-${i}`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          d.severity === "error" ? "bg-red-500/20 text-red-400" :
                          d.severity === "warning" ? "bg-amber-500/20 text-amber-400" :
                          "bg-blue-500/20 text-blue-400"
                        }`}>
                          {d.severity === "error" ? <X className="w-2.5 h-2.5" /> : d.severity === "warning" ? <AlertTriangle className="w-2.5 h-2.5" /> : <Info className="w-2.5 h-2.5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-200">{d.message}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Line {d.line}:{d.column} [{d.source}]</p>
                        </div>
                      </div>
                    ))}
                    {diagnostics.length === 0 && (
                      <div className="text-center py-6">
                        <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-400/30" />
                        <p className="text-xs text-muted-foreground">No problems detected.</p>
                        <p className="text-[10px] text-white/20 mt-1">Save a file to run diagnostics.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Right Panel - Preview (T008) */}
        <aside className="w-80 border-l border-[#1a1b2e] bg-[#0a0b10] flex flex-col shrink-0 hidden lg:flex">
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#1a1b2e]">
            <span className="text-xs text-muted-foreground uppercase flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" />
              Preview
              {previewRunning && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
            </span>
            <div className="flex items-center gap-1">
              {previewRunning ? (
                <>
                  <Button size="sm" variant="ghost" className="h-5 text-xs px-1" onClick={startPreview} data-testid="button-refresh-preview" title="Refresh">
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-5 text-xs px-1 text-red-400 hover:text-red-300" onClick={() => { setPreviewRunning(false); setPreviewUrl(null); }} data-testid="button-stop-preview" title="Stop">
                    <Square className="w-3 h-3" />
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="ghost" className="h-5 text-xs px-1 text-green-400 hover:text-green-300" onClick={startPreview} data-testid="button-start-preview" title="Start Dev Server">
                  <Play className="w-3 h-3" />
                </Button>
              )}
              {previewUrl && (
                <Button size="sm" variant="ghost" className="h-5 text-xs px-1" onClick={() => window.open(previewUrl, "_blank")} data-testid="button-open-external" title="Open in new tab">
                  <ExternalLink className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
          {previewUrl && (
            <div className="flex items-center gap-1 px-2 py-1 border-b border-[#1a1b2e] bg-[#050508]">
              <Globe className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <span className="text-[10px] text-muted-foreground font-mono truncate">{previewUrl}</span>
            </div>
          )}
          <div className="flex-1 flex items-center justify-center text-muted-foreground overflow-hidden">
            {previewUrl ? (
              <iframe
                src={previewUrl}
                className="w-full h-full bg-white"
                title="Preview"
                data-testid="preview-iframe"
              />
            ) : (
              <div className="text-center p-4">
                <Globe className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-xs">Start the dev server to preview</p>
                <p className="text-xs text-muted-foreground mt-1">Click <Play className="w-3 h-3 inline" /> or use the command palette</p>
                <Button size="sm" className="mt-3 h-7 text-xs bg-green-600 hover:bg-green-700" onClick={startPreview} data-testid="button-start-preview-main">
                  <Play className="w-3 h-3 mr-1" /> Start Preview
                </Button>
              </div>
            )}
          </div>
        </aside>
      </div>

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowSettings(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#0a0b10] border border-[#1a1b2e] rounded-lg shadow-xl p-4 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyan-400" />
                Project Settings
              </h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowSettings(false)}
                className="h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Project Name</label>
                <Input
                  value={editingProjectName}
                  onChange={(e) => setEditingProjectName(e.target.value)}
                  placeholder="Project name..."
                  className="bg-[#0a0b10] border-[#1a1b2e]"
                  data-testid="input-project-name"
                />
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Project ID</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs font-mono bg-[#0a0b10] p-2 rounded border border-[#1a1b2e] text-muted-foreground">
                    {projectId}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => { navigator.clipboard.writeText(projectId || ""); }}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Statistics</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#0a0b10] p-2 rounded border border-[#1a1b2e]">
                    <span className="text-muted-foreground">Files:</span>
                    <span className="ml-2 text-white">{files.length}</span>
                  </div>
                  <div className="bg-[#0a0b10] p-2 rounded border border-[#1a1b2e]">
                    <span className="text-muted-foreground">Commits:</span>
                    <span className="ml-2 text-white">{commits.length}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowSettings(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-cyan-600 hover:bg-cyan-700"
                onClick={handleUpdateProjectName}
                data-testid="button-save-settings"
              >
                Save Changes
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {showShortcuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowShortcuts(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#0a0b10] border border-[#1a1b2e] rounded-lg shadow-xl p-4 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-cyan-400" />
                Keyboard Shortcuts
              </h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowShortcuts(false)}
                className="h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {[
                { keys: "Ctrl + K", desc: "Command Palette" },
                { keys: "Ctrl + S", desc: "Save current file" },
                { keys: "Ctrl + F", desc: "Open search" },
                { keys: "Ctrl + I", desc: "Toggle AI Assistant" },
                { keys: "Ctrl + Shift + K", desc: "Agent Mode" },
                { keys: "Ctrl + B", desc: "Open console" },
                { keys: "Ctrl + /", desc: "Toggle shortcuts panel" },
                { keys: "Escape", desc: "Close panels/modals" },
              ].map((shortcut) => (
                <div key={shortcut.keys} className="flex items-center justify-between p-2 rounded bg-[#0a0b10] border border-[#1a1b2e]">
                  <span className="text-sm text-gray-300">{shortcut.desc}</span>
                  <kbd className="px-2 py-1 text-xs font-mono bg-[#1a1b2e] rounded border border-[#2a2b3e] text-cyan-400">
                    {shortcut.keys}
                  </kbd>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground text-center">
              Press <kbd className="px-1 bg-[#1a1b2e] rounded border border-[#2a2b3e]">Ctrl + /</kbd> or <kbd className="px-1 bg-[#1a1b2e] rounded border border-[#2a2b3e]">Esc</kbd> to close
            </p>
          </motion.div>
        </div>
      )}

      {/* Integrations Hub (T007) */}
      {showIntegrations && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowIntegrations(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#0a0b10] border border-[#1a1b2e] rounded-xl shadow-2xl p-6 max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
            data-testid="integrations-hub"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Link2 className="w-5 h-5 text-cyan-400" />
                Integrations Hub
              </h3>
              <Button size="sm" variant="ghost" onClick={() => setShowIntegrations(false)} className="h-7 w-7 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {/* GitHub */}
              <div className="p-4 rounded-lg bg-[#050508] border border-[#1a1b2e]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                      <GitBranch className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">GitHub</p>
                      <p className="text-xs text-muted-foreground">{githubConnected ? "Connected" : githubConfigured ? "Ready to connect" : "Not configured"}</p>
                    </div>
                  </div>
                  {githubConnected ? (
                    <Button size="sm" variant="outline" onClick={disconnectGithub} className="h-7 text-xs border-red-500/30 text-red-400 hover:bg-red-500/10" data-testid="button-disconnect-github">
                      Disconnect
                    </Button>
                  ) : (
                    <Button size="sm" onClick={connectGithub} disabled={!githubConfigured} className="h-7 text-xs bg-white/10 hover:bg-white/20" data-testid="button-connect-github">
                      {githubConfigured ? "Connect" : "Configure"}
                    </Button>
                  )}
                </div>
                {githubConnected && (
                  <div className="mt-3 pt-3 border-t border-[#1a1b2e]">
                    <Button size="sm" variant="ghost" onClick={loadGithubRepos} disabled={loadingRepos} className="h-6 text-xs" data-testid="button-load-repos">
                      {loadingRepos ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <FolderOpen className="w-3 h-3 mr-1" />}
                      {loadingRepos ? "Loading..." : "View Repos"}
                    </Button>
                    {selectedGithubRepo && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground">Active:</span>
                        <span className="text-xs text-cyan-400 font-mono">{selectedGithubRepo}</span>
                      </div>
                    )}
                    {githubRepos.length > 0 && (
                      <div className="mt-2 max-h-32 overflow-auto space-y-1">
                        {githubRepos.slice(0, 10).map((repo: any) => {
                          const fullName = repo.full_name || repo.name;
                          const isSelected = selectedGithubRepo === fullName;
                          return (
                            <div
                              key={repo.id || repo.name}
                              className={`text-xs p-1.5 rounded flex items-center justify-between cursor-pointer transition-all ${isSelected ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "bg-white/5 text-gray-300 hover:bg-white/10"}`}
                              onClick={() => setSelectedGithubRepo(fullName)}
                              data-testid={`repo-${fullName}`}
                            >
                              <span>{fullName}</span>
                              <div className="flex items-center gap-1">
                                {isSelected && <CheckCircle2 className="w-3 h-3 text-cyan-400" />}
                                <span className="text-[10px] text-white/30">{repo.language}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Vercel */}
              <div className="p-4 rounded-lg bg-[#050508] border border-[#1a1b2e]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                      <Rocket className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Vercel</p>
                      <p className="text-xs text-muted-foreground">{vercelConnected ? "Connected" : "Token required"}</p>
                    </div>
                  </div>
                  {vercelConnected ? (
                    <Button size="sm" variant="outline" onClick={disconnectVercel} className="h-7 text-xs border-red-500/30 text-red-400 hover:bg-red-500/10" data-testid="button-disconnect-vercel">
                      Disconnect
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Input
                        type="password"
                        value={vercelToken}
                        onChange={(e) => setVercelToken(e.target.value)}
                        placeholder="Vercel token..."
                        className="h-7 w-32 text-xs bg-white/5 border-[#1a1b2e]"
                        data-testid="input-vercel-token"
                      />
                      <Button size="sm" onClick={() => connectVercel(vercelToken)} disabled={!vercelToken} className="h-7 text-xs bg-white/10 hover:bg-white/20" data-testid="button-connect-vercel">
                        Connect
                      </Button>
                    </div>
                  )}
                </div>
                {vercelConnected && vercelDeployUrl && (
                  <div className="mt-3 pt-3 border-t border-[#1a1b2e]">
                    <p className="text-xs text-green-400">Last deploy: <a href={vercelDeployUrl} target="_blank" rel="noopener noreferrer" className="underline">{vercelDeployUrl}</a></p>
                  </div>
                )}
              </div>

              {/* TrustHub */}
              <div className="p-4 rounded-lg bg-[#050508] border border-[#1a1b2e]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                      <Fingerprint className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">TrustHub</p>
                      <p className="text-xs text-muted-foreground">Blockchain code provenance</p>
                    </div>
                  </div>
                  <span className="text-xs text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Command Palette (T012) */}
      <AnimatePresence>
        {showCommandPalette && (
          <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm" onClick={() => setShowCommandPalette(false)}>
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-lg bg-[#0a0b10] border border-[#1a1b2e] rounded-xl shadow-2xl shadow-cyan-500/5 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              data-testid="command-palette"
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1a1b2e]">
                <Command className="w-4 h-4 text-cyan-400" />
                <input
                  ref={commandInputRef}
                  value={commandSearch}
                  onChange={(e) => setCommandSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setShowCommandPalette(false);
                    if (e.key === "Enter" && filteredCommands.length > 0) {
                      filteredCommands[0].action();
                      setShowCommandPalette(false);
                    }
                  }}
                  placeholder="Type a command or file name..."
                  className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/30"
                  autoFocus
                  data-testid="input-command-search"
                />
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-[#1a1b2e] rounded text-white/40">ESC</kbd>
              </div>
              <div className="max-h-80 overflow-auto py-1">
                {filteredCommands.map((cmd) => (
                  <button
                    key={cmd.id}
                    onClick={() => { cmd.action(); setShowCommandPalette(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-cyan-500/10 hover:text-white transition-colors group"
                    data-testid={`command-${cmd.id}`}
                  >
                    <cmd.icon className="w-4 h-4 text-white/30 group-hover:text-cyan-400 transition-colors" />
                    <span className="flex-1 text-left">{cmd.label}</span>
                    {cmd.shortcut && (
                      <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-[#1a1b2e] rounded text-white/30">{cmd.shortcut}</kbd>
                    )}
                  </button>
                ))}
                {filteredCommands.length === 0 && (
                  <p className="px-4 py-6 text-sm text-white/30 text-center">No matching commands</p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Assistant Panel */}
      <AnimatePresence>
        {showAiPanel && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-0 top-0 h-full w-full md:w-[420px] z-50 bg-[#0a0b10]/98 border-l border-[#1a1b2e] backdrop-blur-xl shadow-2xl flex flex-col"
            ref={aiPanelRef}
          >
            {/* AI Panel Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#1a1b2e] bg-gradient-to-r from-purple-500/10 to-cyan-500/10">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${agentMode ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-gradient-to-r from-purple-500 to-cyan-500"}`}>
                  {agentMode ? <Cpu className="w-5 h-5 text-white" /> : <Sparkles className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <h3 className="font-medium text-white">{agentMode ? "Agent Mode" : "AI Assistant"}</h3>
                  <p className="text-xs text-muted-foreground">{agentMode ? "$0.25/session • GPT-4o" : "$0.05/request • GPT-4o"}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant={agentMode ? "default" : "ghost"}
                  onClick={() => setAgentMode(!agentMode)}
                  className={`h-7 text-xs px-2 ${agentMode ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "hover:bg-white/5"}`}
                  data-testid="button-toggle-agent"
                >
                  <Cpu className="w-3 h-3 mr-1" /> Agent
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowAiPanel(false)}
                  className="h-8 w-8 p-0"
                  data-testid="button-close-ai"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Credits Display */}
            <div className="px-4 py-2 bg-[#050508] border-b border-[#1a1b2e] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Credits:</span>
                <span className={`text-sm font-medium ${aiCredits && aiCredits.balanceCents > 0 ? "text-green-400" : "text-red-400"}`}>
                  {aiCredits ? `$${aiCredits.balanceUSD}` : "Loading..."}
                </span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => buyAiCredits(500)}
                disabled={buyingCredits}
                className="h-7 text-xs bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-purple-500/50 hover:border-cyan-400"
                data-testid="button-buy-credits"
              >
                {buyingCredits ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                + Add $5
              </Button>
            </div>

            {/* AI Response Area with Apply Buttons (T002) */}
            <div className="flex-1 overflow-auto p-4">
              {aiResponse ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  {aiResponse.split(/(```[\s\S]*?```)/g).map((part, i) => {
                    const codeMatch = part.match(/```(\w+)?\n?([\s\S]*?)```/);
                    if (codeMatch) {
                      const lang = codeMatch[1] || "";
                      const code = codeMatch[2].trim();
                      const firstLine = code.split("\n")[0] || "";
                      const isNewFile = firstLine.includes("NEW FILE:");
                      const filename = isNewFile ? firstLine.replace(/\/\/\s*NEW FILE:\s*/, "").trim() : undefined;
                      return (
                        <div key={i} className="relative my-3 group">
                          <div className="flex items-center justify-between px-3 py-1.5 bg-[#0f1018] rounded-t border border-[#1a1b2e] border-b-0">
                            <span className="text-[10px] font-mono text-white/40">{lang}{filename ? ` — ${filename}` : ""}</span>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" className="h-5 text-[10px] px-1.5 text-cyan-400 hover:bg-cyan-500/20" onClick={() => navigator.clipboard.writeText(code)} data-testid={`button-copy-code-${i}`}>
                                <Copy className="w-3 h-3 mr-0.5" /> Copy
                              </Button>
                              <Button size="sm" variant="ghost" className="h-5 text-[10px] px-1.5 text-green-400 hover:bg-green-500/20" onClick={() => applyCodeBlock(code, isNewFile ? `NEW FILE: ${filename}` : undefined)} data-testid={`button-apply-code-${i}`}>
                                <Check className="w-3 h-3 mr-0.5" /> {isNewFile ? "Create" : "Apply"}
                              </Button>
                            </div>
                          </div>
                          <pre className="text-xs font-mono bg-[#050508] p-3 rounded-b border border-[#1a1b2e] border-t-0 overflow-x-auto text-gray-300 whitespace-pre-wrap">{isNewFile ? code.split("\n").slice(1).join("\n") : code}</pre>
                        </div>
                      );
                    }
                    return part ? <p key={i} className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{part}</p> : null;
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${agentMode ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20" : "bg-gradient-to-r from-purple-500/20 to-cyan-500/20"}`}>
                    {agentMode ? <Cpu className="w-8 h-8 text-amber-400" /> : <MessageSquare className="w-8 h-8 text-cyan-400" />}
                  </div>
                  <h4 className="text-lg font-medium text-white mb-2">{agentMode ? "Agent Ready" : "Ask me anything!"}</h4>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    {agentMode
                      ? "Describe a task and I'll autonomously read, plan, edit, and create files across your project."
                      : "I can help you write code, debug issues, explain concepts, or refactor your code."}
                  </p>
                  <div className="mt-6 space-y-2">
                    <p className="text-xs text-muted-foreground">Try asking:</p>
                    {(agentMode
                      ? ["Add authentication to my app", "Refactor this into separate components", "Add unit tests for all functions", "Create a REST API for this data model"]
                      : ["Explain this code", "Fix the bug in this function", "Add error handling", "Optimize performance"]
                    ).map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setAiPrompt(suggestion)}
                        className="block w-full text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-gray-300 transition-colors border border-[#1a1b2e]"
                      >
                        "{suggestion}"
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI Input Area */}
            <div className="p-4 border-t border-[#1a1b2e] bg-[#050508]">
              <div className="flex gap-2">
                <Input
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && askAiAssistant()}
                  placeholder={agentMode ? "Describe a task for the agent..." : "Ask AI about your code..."}
                  className="flex-1 bg-white/5 border-[#1a1b2e] focus:border-cyan-500/50"
                  disabled={aiLoading}
                  data-testid="input-ai-prompt"
                />
                {voiceSupported && (
                  <Button
                    size="sm"
                    variant={isListening ? "default" : "ghost"}
                    onClick={toggleVoiceInput}
                    className={`h-10 w-10 p-0 ${isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : ""}`}
                    data-testid="button-ai-voice"
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={askAiAssistant}
                  disabled={aiLoading || !aiPrompt.trim()}
                  className={`h-10 px-4 ${agentMode ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400" : "bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400"}`}
                  data-testid="button-ask-ai"
                >
                  {aiLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {isListening && (
                <p className="text-xs text-red-400 mt-2 animate-pulse flex items-center gap-1">
                  <Mic className="w-3 h-3" /> Listening... Speak now
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Login Modal for view-only users */}
      <SimpleLoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />

      {/* Status Bar (T007) */}
      <div className="fixed bottom-0 left-0 right-0 h-6 bg-[#050508] border-t border-[#1a1b2e] flex items-center justify-between px-3 text-[10px] z-40">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${githubConnected ? "bg-green-400" : "bg-gray-600"}`} />
            <span className="text-muted-foreground">GitHub</span>
          </span>
          <span className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${vercelConnected ? "bg-green-400" : "bg-gray-600"}`} />
            <span className="text-muted-foreground">Vercel</span>
          </span>
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span className="text-muted-foreground">TrustHub</span>
          </span>
          {diagnosticsSummary.errors > 0 && (
            <span className="text-red-400 cursor-pointer" onClick={() => setBottomTab("problems")}>
              {diagnosticsSummary.errors} error{diagnosticsSummary.errors > 1 ? "s" : ""}
            </span>
          )}
          {diagnosticsSummary.warnings > 0 && (
            <span className="text-amber-400 cursor-pointer" onClick={() => setBottomTab("problems")}>
              {diagnosticsSummary.warnings} warning{diagnosticsSummary.warnings > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          {activeFile && <span>{activeFile.name.endsWith(".ts") || activeFile.name.endsWith(".tsx") ? "TypeScript" : activeFile.name.endsWith(".js") || activeFile.name.endsWith(".jsx") ? "JavaScript" : activeFile.name.endsWith(".py") ? "Python" : activeFile.name.endsWith(".css") ? "CSS" : activeFile.name.endsWith(".html") ? "HTML" : activeFile.name.endsWith(".json") ? "JSON" : "Plain Text"}</span>}
          <span>UTF-8</span>
          <span>DWSC Studio v2.0</span>
        </div>
      </div>
    </div>
  );
}
