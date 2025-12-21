import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FolderOpen, File, Plus, Save, Play, Settings, Lock, 
  ChevronRight, ChevronDown, Trash2, Edit2, X, Check,
  FileCode, FileJson, FileText, Folder, Package, Globe,
  GitBranch, GitCommit, History, RotateCcw, Terminal,
  Rocket, Cloud, Link2, Users, Info, Zap, Shield, Database,
  ExternalLink, Copy, CheckCircle, Loader2, Send
} from "lucide-react";
import { MonacoEditor } from "@/components/monaco-editor";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlassCard } from "@/components/glass-card";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";
import { useAuth } from "@/hooks/use-auth";

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

const PROTOCOL_DEFINITIONS: Record<string, string> = {
  "DWT": "DarkWave Token - The native cryptocurrency of DarkWave Chain, used for transactions and gas fees.",
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
  const { user } = useAuth();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("Untitled Project");
  const [files, setFiles] = useState<FileNode[]>([]);
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [configs, setConfigs] = useState<Config[]>([]);
  const [activeFile, setActiveFile] = useState<FileNode | null>(null);
  const [editorContent, setEditorContent] = useState("");
  const [activeTab, setActiveTab] = useState("files");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [newFileName, setNewFileName] = useState("");
  const [showNewFile, setShowNewFile] = useState(false);
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
  const [presence, setPresence] = useState<PresenceUser[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [consoleOutput, setConsoleOutput] = useState<string[]>(["> DarkWave Studio v1.0.0", "> Ready"]);
  const [running, setRunning] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [commitMessage, setCommitMessage] = useState("");
  const [bottomTab, setBottomTab] = useState<"console" | "git" | "terminal" | "deploy" | "packages">("console");
  const [terminalHistory, setTerminalHistory] = useState<TerminalLine[]>([
    { type: "output", content: "DarkWave Terminal v1.0.0" },
    { type: "output", content: "Type 'help' for available commands" },
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const [deploying, setDeploying] = useState(false);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [currentDeployment, setCurrentDeployment] = useState<Deployment | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
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

  const handleAddSecret = async () => {
    if (!newSecretKey.trim() || !projectId) return;
    try {
      const res = await fetch(`/api/studio/projects/${projectId}/secrets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: newSecretKey, value: newSecretValue }),
      });
      if (res.ok) {
        const secret = await res.json();
        setSecrets(prev => [...prev, secret]);
        setNewSecretKey("");
        setNewSecretValue("");
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
        body: JSON.stringify({ key: newConfigKey, value: newConfigValue, environment: "shared" }),
      });
      if (res.ok) {
        const config = await res.json();
        setConfigs(prev => [...prev, config]);
        setNewConfigKey("");
        setNewConfigValue("");
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
        { type: "output", content: "DarkWave Terminal v1.0.0" },
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
        userId: user.id,
        userName: user.firstName || user.email || "User",
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
          setPresence(data.users.filter((u: PresenceUser) => u.id !== user.id));
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

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "s") {
      e.preventDefault();
      handleSave();
    }
  }, [activeFile, editorContent]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading DarkWave Studio...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0a0f]">
        <GlassCard className="p-8 max-w-md text-center">
          <img src={orbitLogo} alt="DarkWave" className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">DarkWave Studio</h1>
          <p className="text-muted-foreground mb-6">Sign in to create and manage your projects</p>
          <Button
            onClick={() => window.location.href = "/api/login"}
            className="bg-primary text-background hover:bg-primary/90"
            data-testid="button-login"
          >
            Sign In to Continue
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0f] text-foreground overflow-hidden">
      {/* Top Bar */}
      <header className="h-12 border-b border-white/5 bg-background/95 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2" data-testid="link-home">
            <img src={orbitLogo} alt="DarkWave" className="w-6 h-6" />
          </Link>
          <span className="text-white/30">/</span>
          <span className="font-mono text-sm">{projectName}</span>
          
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
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSave}
            disabled={saving}
            className="gap-2 text-xs"
            data-testid="button-save"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button
            size="sm"
            className="gap-2 bg-green-600 hover:bg-green-700 text-xs transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,197,94,0.5)] hover:scale-105"
            onClick={handleRun}
            disabled={running}
            data-testid="button-run"
          >
            <Play className="w-3.5 h-3.5" />
            {running ? "Running..." : "Run"}
          </Button>
          <Button
            size="sm"
            className="gap-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-xs transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] hover:scale-105"
            onClick={handleDeploy}
            disabled={deploying}
            data-testid="button-deploy"
          >
            <Rocket className="w-3.5 h-3.5" />
            {deploying ? "Deploying..." : "Deploy"}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/5 bg-black/40 flex flex-col shrink-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <TabsList className="w-full grid grid-cols-3 h-10 bg-transparent border-b border-white/5 rounded-none">
              <TabsTrigger value="files" className="text-xs data-[state=active]:bg-white/5 rounded-none" data-testid="tab-files">
                <FolderOpen className="w-3.5 h-3.5 mr-1" /> Files
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
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => setShowNewFile(true)}
                  data-testid="button-new-file"
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>

              {showNewFile && (
                <div className="flex items-center gap-1 mb-2">
                  <Input
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="filename.js"
                    className="h-7 text-xs bg-black/30"
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
                    onClick={() => handleFileSelect(file)}
                    data-testid={`file-${file.id}`}
                  >
                    {getFileIcon(file.name, file.isFolder)}
                    <span className="flex-1 truncate">{file.name}</span>
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

            <TabsContent value="secrets" className="flex-1 overflow-auto p-2 m-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground uppercase flex items-center gap-1">
                  Secrets
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3 h-3 text-muted-foreground hover:text-cyan-400 transition-colors cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs bg-black/90 border-white/10">
                      <p className="text-xs">{PROTOCOL_DEFINITIONS["Secret"]}</p>
                    </TooltipContent>
                  </Tooltip>
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Encrypted environment variables for sensitive data.
              </p>

              <div className="space-y-2 mb-3">
                {secrets.map((secret) => (
                  <div key={secret.id} className="flex items-center gap-2 p-2 rounded bg-black/30 text-xs">
                    <Lock className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="font-mono">{secret.key}</span>
                    <span className="text-muted-foreground">= ••••••</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Input
                  value={newSecretKey}
                  onChange={(e) => setNewSecretKey(e.target.value)}
                  placeholder="SECRET_KEY"
                  className="h-8 text-xs bg-black/30 font-mono"
                  data-testid="input-secret-key"
                />
                <Input
                  type="password"
                  value={newSecretValue}
                  onChange={(e) => setNewSecretValue(e.target.value)}
                  placeholder="Value"
                  className="h-8 text-xs bg-black/30"
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
                    <TooltipContent side="right" className="max-w-xs bg-black/90 border-white/10">
                      <p className="text-xs">{PROTOCOL_DEFINITIONS["Config"]}</p>
                    </TooltipContent>
                  </Tooltip>
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Non-sensitive configuration variables.
              </p>

              <div className="space-y-2 mb-3">
                {configs.map((config) => (
                  <div key={config.id} className="flex items-center gap-2 p-2 rounded bg-black/30 text-xs">
                    <Settings className="w-3 h-3 text-blue-400 shrink-0" />
                    <span className="font-mono">{config.key}</span>
                    <span className="text-muted-foreground">= {config.value}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Input
                  value={newConfigKey}
                  onChange={(e) => setNewConfigKey(e.target.value)}
                  placeholder="CONFIG_KEY"
                  className="h-8 text-xs bg-black/30 font-mono"
                  data-testid="input-config-key"
                />
                <Input
                  value={newConfigValue}
                  onChange={(e) => setNewConfigValue(e.target.value)}
                  placeholder="Value"
                  className="h-8 text-xs bg-black/30"
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

        {/* Editor Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* File Tabs */}
          <div className="h-9 border-b border-white/5 bg-black/20 flex items-center px-2 shrink-0">
            {activeFile && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-t text-xs">
                {getFileIcon(activeFile.name, false)}
                <span>{activeFile.name}</span>
              </div>
            )}
          </div>

          {/* Code Editor */}
          <div className="flex-1 overflow-hidden">
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

          {/* Bottom Bar / Console, Git, Terminal & Deploy */}
          <div className="h-48 border-t border-white/5 bg-gradient-to-b from-black/60 to-black/40 flex flex-col shrink-0 backdrop-blur-sm">
            <div className="flex items-center px-1 py-1 border-b border-white/10 gap-1">
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
            </div>

            <AnimatePresence mode="wait">
              {bottomTab === "console" && (
                <motion.div
                  key="console"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex-1 p-2 font-mono text-xs overflow-auto"
                >
                  {consoleOutput.map((line, i) => (
                    <p key={i} className={`${line.startsWith(">") ? "text-muted-foreground" : line.includes("Error") ? "text-red-400" : "text-green-400"} transition-colors`}>{line}</p>
                  ))}
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
                  <div ref={terminalRef} className="flex-1 p-2 font-mono text-xs overflow-auto bg-black/30">
                    {terminalHistory.map((line, i) => (
                      <p key={i} className={`${line.type === "input" ? "text-cyan-400" : line.type === "error" ? "text-red-400" : "text-gray-300"}`}>
                        {line.content}
                      </p>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 p-2 border-t border-white/5">
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
                      className="h-7 text-xs bg-black/30 flex-1 border-white/10 focus:border-cyan-500/50 transition-colors"
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
                          className="flex items-center gap-2 p-1.5 rounded bg-black/30 border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all cursor-pointer group"
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
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-white/10">
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
                        <div className="flex items-center gap-2 p-2 rounded bg-black/30 border border-white/5">
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
                        <div className="mt-2 p-2 rounded bg-black/30 border border-white/5">
                          <p className="text-xs text-muted-foreground mb-2">Link a custom domain:</p>
                          <div className="flex gap-2">
                            <Input
                              value={customDomainInput}
                              onChange={(e) => setCustomDomainInput(e.target.value)}
                              placeholder="yourdomain.com"
                              className="h-7 text-xs bg-black/30 flex-1 border-white/10 focus:border-emerald-500/50 transition-colors"
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
                      className="h-7 text-xs bg-black/30 flex-1 border-white/10 focus:border-amber-500/50 transition-colors"
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
                          className="flex items-center justify-between p-1.5 rounded bg-black/30 border border-white/5 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all group"
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
            </AnimatePresence>
          </div>
        </main>

        {/* Right Panel - Preview */}
        <aside className="w-80 border-l border-white/5 bg-black/40 flex flex-col shrink-0 hidden lg:flex">
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
            <span className="text-xs text-muted-foreground uppercase flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" /> Preview
            </span>
            {previewUrl && (
              <Button
                size="sm"
                variant="ghost"
                className="h-5 text-xs px-1"
                onClick={() => setPreviewUrl(null)}
                data-testid="button-close-preview"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
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
                <p className="text-xs">Click "Run" to preview</p>
                <p className="text-xs text-muted-foreground mt-1">Requires an HTML file</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
