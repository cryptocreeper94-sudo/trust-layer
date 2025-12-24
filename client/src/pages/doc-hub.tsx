import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, FileText, Search, Edit3, Trash2, Save, X, BookOpen } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchDocuments, createDocument, updateDocument, deleteDocument } from "@/lib/api";
import type { Document, InsertDocument } from "@shared/schema";
import { Footer } from "@/components/footer";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { GlassCard } from "@/components/glass-card";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

const CATEGORIES = [
  { id: "general", label: "Getting Started", icon: "🚀" },
  { id: "api-specs", label: "API Specs", icon: "🔌" },
  { id: "integration", label: "Integration", icon: "🔗" },
  { id: "app-metadata", label: "App Metadata", icon: "📱" },
  { id: "changelog", label: "Changelog", icon: "📋" },
];

export default function DocHub() {
  usePageAnalytics();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [newDoc, setNewDoc] = useState<Partial<InsertDocument>>({
    title: "",
    content: "",
    category: "general",
    isPublic: true,
  });

  const queryClient = useQueryClient();

  const { data: allDocuments = [], isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: () => fetchDocuments(),
  });

  const documents = selectedCategory 
    ? allDocuments.filter(doc => doc.category === selectedCategory)
    : allDocuments;

  const getCategoryCount = (categoryId: string) => {
    return allDocuments.filter(doc => doc.category === categoryId).length;
  };

  const createMutation = useMutation({
    mutationFn: createDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      setIsCreating(false);
      setNewDoc({ title: "", content: "", category: "general", isPublic: true });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertDocument> }) => updateDocument(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      setEditingDoc(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });

  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    if (newDoc.title && newDoc.content) {
      createMutation.mutate(newDoc as InsertDocument);
    }
  };

  const handleUpdate = () => {
    if (editingDoc) {
      updateMutation.mutate({
        id: editingDoc.id,
        data: { title: editingDoc.title, content: editingDoc.content, category: editingDoc.category },
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2 mr-auto">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight">DarkWave</span>
          </Link>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 text-[10px]">
              <BookOpen className="w-3 h-3 mr-1" /> Doc Hub
            </Badge>
            <Link href="/developers">
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 hover:bg-white/5">
                <ArrowLeft className="w-3 h-3" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
              DarkWave <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Doc Hub</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Central repository for all ecosystem documentation.
            </p>
          </div>
        </div>
      </section>

      <section className="py-6 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-56 space-y-4 lg:sticky lg:top-20 h-fit">
              <GlassCard glow hover={false}>
                <div className="p-2 flex items-center gap-2">
                  <Search className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
                  <Input
                    placeholder="Search docs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 bg-transparent h-9 text-xs focus-visible:ring-0"
                    data-testid="input-search-docs"
                  />
                </div>
              </GlassCard>

              <div>
                <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-3">Categories</h3>
                <div className="space-y-1">
                  <Button
                    onClick={() => setSelectedCategory(null)}
                    variant={!selectedCategory ? "secondary" : "ghost"}
                    size="sm"
                    className={`w-full h-8 text-xs justify-start ${!selectedCategory ? 'bg-primary/20 text-primary' : 'text-white/60'}`}
                    data-testid="button-category-all"
                  >
                    📚 All ({allDocuments.length})
                  </Button>
                  {CATEGORIES.map((cat) => {
                    const count = getCategoryCount(cat.id);
                    return (
                      <Button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        variant={selectedCategory === cat.id ? "secondary" : "ghost"}
                        size="sm"
                        className={`w-full h-8 text-xs justify-start ${selectedCategory === cat.id ? 'bg-primary/20 text-primary' : 'text-white/60'}`}
                        data-testid={`button-category-${cat.id}`}
                      >
                        {cat.icon} {cat.label} ({count})
                      </Button>
                    );
                  })}
                </div>
              </div>

              <Button
                onClick={() => setIsCreating(true)}
                className="w-full h-9 bg-primary text-background hover:bg-primary/90 font-bold text-xs"
                data-testid="button-create-doc"
              >
                <Plus className="w-3 h-3 mr-1.5" /> New Document
              </Button>
            </div>

            <div className="flex-1">
              <AnimatePresence mode="wait">
                {isCreating && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4"
                  >
                    <GlassCard glow hover={false}>
                      <div className="p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-white">New Document</h3>
                          <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)} className="h-7 w-7 p-0">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <Input
                          placeholder="Title"
                          value={newDoc.title}
                          onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                          className="h-9 bg-black/30 border-white/10 text-xs"
                        />
                        <Textarea
                          placeholder="Content (Markdown supported)"
                          value={newDoc.content}
                          onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
                          className="min-h-[120px] bg-black/30 border-white/10 text-xs"
                        />
                        <div className="flex gap-2">
                          <Select value={newDoc.category} onValueChange={(v) => setNewDoc({ ...newDoc, category: v })}>
                            <SelectTrigger className="h-9 bg-black/30 border-white/10 text-xs w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORIES.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button onClick={handleCreate} disabled={createMutation.isPending} className="h-9 bg-primary text-background text-xs">
                            <Save className="w-3 h-3 mr-1.5" /> Save
                          </Button>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <GlassCard glow key={i}><div className="p-4 h-32 animate-pulse bg-white/5 rounded" /></GlassCard>
                  ))}
                </div>
              ) : filteredDocs.length === 0 ? (
                <GlassCard glow hover={false}>
                  <div className="p-8 text-center">
                    <FileText className="w-10 h-10 text-white/20 mx-auto mb-3" />
                    <p className="text-sm text-white/40">No documents found</p>
                  </div>
                </GlassCard>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredDocs.map((doc) => (
                    <GlassCard glow key={doc.id}>
                      <div className="p-4">
                        {editingDoc?.id === doc.id ? (
                          <div className="space-y-3">
                            <Input
                              value={editingDoc.title}
                              onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                              className="h-8 bg-black/30 border-white/10 text-xs"
                            />
                            <Textarea
                              value={editingDoc.content}
                              onChange={(e) => setEditingDoc({ ...editingDoc, content: e.target.value })}
                              className="min-h-[80px] bg-black/30 border-white/10 text-xs"
                            />
                            <div className="flex gap-2">
                              <Button onClick={handleUpdate} size="sm" className="h-7 text-[10px] bg-primary text-background">
                                <Save className="w-3 h-3 mr-1" /> Save
                              </Button>
                              <Button onClick={() => setEditingDoc(null)} variant="ghost" size="sm" className="h-7 text-[10px]">
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-sm font-bold text-white mb-1">{doc.title}</h3>
                                <Badge variant="outline" className="text-[8px] border-white/10 text-white/40">
                                  {CATEGORIES.find(c => c.id === doc.category)?.label || doc.category}
                                </Badge>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" onClick={() => setEditingDoc(doc)} className="h-6 w-6 p-0">
                                  <Edit3 className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(doc.id)} className="h-6 w-6 p-0 text-red-400 hover:text-red-300">
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-[11px] text-white/50 line-clamp-3">{doc.content}</p>
                          </>
                        )}
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
