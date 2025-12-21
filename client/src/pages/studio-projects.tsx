import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, FolderOpen, Trash2, Clock, GitBranch, ArrowLeft, Code2, FileCode, Globe, Box } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth";

interface Project {
  id: string;
  name: string;
  description: string | null;
  language: string;
  createdAt: string;
  updatedAt: string;
}

const languageIcons: Record<string, React.ReactNode> = {
  javascript: <FileCode className="w-5 h-5 text-yellow-400" />,
  typescript: <FileCode className="w-5 h-5 text-blue-400" />,
  html: <Globe className="w-5 h-5 text-orange-400" />,
  python: <Code2 className="w-5 h-5 text-green-400" />,
  rust: <Box className="w-5 h-5 text-orange-500" />,
};

const languageColors: Record<string, string> = {
  javascript: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  typescript: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  html: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  python: "bg-green-500/20 text-green-400 border-green-500/30",
  rust: "bg-orange-600/20 text-orange-500 border-orange-600/30",
};

export default function StudioProjects() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "", language: "javascript" });
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/");
    }
  }, [authLoading, user, setLocation]);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/studio/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newProject.name.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/studio/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });
      if (res.ok) {
        const project = await res.json();
        setProjects(prev => [project, ...prev]);
        setCreateOpen(false);
        setNewProject({ name: "", description: "", language: "javascript" });
        setLocation(`/studio?project=${project.id}`);
      }
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch(`/api/studio/projects/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProjects(prev => prev.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
    } finally {
      setDeleting(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse text-cyan-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-cyan-400 font-bold text-xl" data-testid="link-logo">
            <Code2 className="w-6 h-6" />
            DarkWave Studio
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.firstName || user?.email}</span>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" data-testid="link-dashboard">Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground hover:text-white" data-testid="link-back-home">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mb-2">My Projects</h1>
            <p className="text-muted-foreground">Create, manage, and open your coding projects</p>
          </div>

          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-black" data-testid="button-new-project">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-white/10">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>Start a new coding project in DarkWave Studio</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    placeholder="my-awesome-project"
                    value={newProject.name}
                    onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-black/50 border-white/10"
                    data-testid="input-project-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Input
                    id="description"
                    placeholder="A brief description of your project"
                    value={newProject.description}
                    onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-black/50 border-white/10"
                    data-testid="input-project-description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={newProject.language}
                    onValueChange={(value) => setNewProject(prev => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger className="bg-black/50 border-white/10" data-testid="select-language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/10">
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="html">HTML/CSS</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="rust">Rust</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleCreate}
                  disabled={creating || !newProject.name.trim()}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-black"
                  data-testid="button-create-project"
                >
                  {creating ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="bg-zinc-900/50 border-white/5 animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-white/10 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-white/5 rounded w-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-white/5 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <FolderOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
            <p className="text-muted-foreground mb-6">Create your first project to get started</p>
            <Button onClick={() => setCreateOpen(true)} className="bg-cyan-500 hover:bg-cyan-600 text-black" data-testid="button-create-first-project">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Project
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-zinc-900/50 border-white/5 hover:border-cyan-500/30 transition-all group" data-testid={`card-project-${project.id}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {languageIcons[project.language] || <Code2 className="w-5 h-5 text-gray-400" />}
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                      </div>
                      <Badge variant="outline" className={languageColors[project.language] || "border-white/20"}>
                        {project.language}
                      </Badge>
                    </div>
                    <CardDescription className="mt-2 line-clamp-2">
                      {project.description || "No description"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-xs text-muted-foreground mb-4">
                      <Clock className="w-3 h-3 mr-1" />
                      Updated {format(new Date(project.updatedAt), "MMM d, yyyy")}
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/studio?project=${project.id}`} className="flex-1">
                        <Button className="w-full bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30" data-testid={`button-open-project-${project.id}`}>
                          <FolderOpen className="w-4 h-4 mr-2" />
                          Open
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-500/10" data-testid={`button-delete-project-${project.id}`}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-zinc-900 border-white/10">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete "{project.name}" and all its files. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(project.id)}
                              className="bg-red-500 hover:bg-red-600 text-white"
                              disabled={deleting === project.id}
                              data-testid={`button-confirm-delete-${project.id}`}
                            >
                              {deleting === project.id ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
