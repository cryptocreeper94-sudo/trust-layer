import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  FolderOpen, File, Plus, Save, Play, Settings, Lock, 
  ChevronRight, ChevronDown, Trash2, Edit2, X, Check,
  FileCode, FileJson, FileText, Folder, Package, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlassCard } from "@/components/glass-card";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";
import { useAuth } from "@/hooks/use-auth";

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
            className="gap-2 bg-green-600 hover:bg-green-700 text-xs"
            data-testid="button-run"
          >
            <Play className="w-3.5 h-3.5" />
            Run
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
                <span className="text-xs text-muted-foreground uppercase">Secrets</span>
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
                <span className="text-xs text-muted-foreground uppercase">Configurations</span>
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
              <textarea
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                className="w-full h-full bg-[#0d0d12] text-gray-100 font-mono text-sm p-4 resize-none focus:outline-none leading-relaxed"
                spellCheck={false}
                placeholder="// Start coding..."
                data-testid="editor-textarea"
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

          {/* Bottom Bar / Console */}
          <div className="h-32 border-t border-white/5 bg-black/40 flex flex-col shrink-0">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/5">
              <span className="text-xs text-muted-foreground uppercase">Console</span>
            </div>
            <div className="flex-1 p-2 font-mono text-xs text-green-400 overflow-auto">
              <p className="text-muted-foreground">{`> DarkWave Studio v1.0.0`}</p>
              <p className="text-muted-foreground">{`> Ready`}</p>
            </div>
          </div>
        </main>

        {/* Right Panel - Preview (optional) */}
        <aside className="w-80 border-l border-white/5 bg-black/40 flex flex-col shrink-0 hidden lg:flex">
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
            <span className="text-xs text-muted-foreground uppercase flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" /> Preview
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center p-4">
              <Globe className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-xs">Click "Run" to preview</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
