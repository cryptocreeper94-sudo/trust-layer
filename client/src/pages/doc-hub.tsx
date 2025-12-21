import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, FileText, Folder, Search, Edit3, Trash2, Save, X, ChevronRight, BookOpen } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchDocuments, createDocument, updateDocument, deleteDocument } from "@/lib/api";
import type { Document, InsertDocument } from "@shared/schema";
import { Footer } from "@/components/footer";
import { usePageAnalytics } from "@/hooks/use-analytics";

const CATEGORIES = [
  { id: "api-specs", label: "API Specifications", icon: "🔌" },
  { id: "app-metadata", label: "App Metadata", icon: "📱" },
  { id: "integration", label: "Integration Guides", icon: "🔗" },
  { id: "changelog", label: "Changelogs", icon: "📋" },
  { id: "general", label: "General", icon: "📄" },
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

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["documents", selectedCategory],
    queryFn: () => fetchDocuments(selectedCategory || undefined),
  });

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
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/developers">
            <div className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors cursor-pointer group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-display font-medium">Back to Developers</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 font-mono">
              <BookOpen className="w-3 h-3 mr-1" /> Doc Hub
            </Badge>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-12 relative overflow-hidden border-b border-white/5">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Dark Wave <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-glow">Doc Hub</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Central repository for all ecosystem documentation. API specs, app metadata, integration guides, and changelogs—all in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full lg:w-64 space-y-6 lg:sticky lg:top-24 h-fit">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search docs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10"
                  data-testid="input-search-docs"
                />
              </div>

              <div>
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!selectedCategory ? "bg-white/10 text-white" : "text-muted-foreground hover:bg-white/5 hover:text-white"}`}
                    data-testid="button-category-all"
                  >
                    <span>📚 All Documents</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${!selectedCategory ? "bg-primary text-background" : "bg-white/5"}`}>
                      {documents.length}
                    </span>
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat.id ? "bg-white/10 text-white" : "text-muted-foreground hover:bg-white/5 hover:text-white"}`}
                      data-testid={`button-category-${cat.id}`}
                    >
                      <span>{cat.icon} {cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => setIsCreating(true)}
                className="w-full bg-primary text-background hover:bg-primary/90 font-bold"
                data-testid="button-create-doc"
              >
                <Plus className="w-4 h-4 mr-2" /> New Document
              </Button>
            </div>

            {/* Documents Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold">
                  {selectedCategory ? CATEGORIES.find((c) => c.id === selectedCategory)?.label : "All Documents"}
                </h2>
                <span className="text-sm text-muted-foreground">{filteredDocs.length} documents</span>
              </div>

              {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">Loading documents...</div>
              ) : filteredDocs.length === 0 ? (
                <Card className="glass-panel p-12 text-center">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-bold mb-2">No documents yet</h3>
                  <p className="text-muted-foreground mb-6">Create your first document to get started.</p>
                  <Button onClick={() => setIsCreating(true)} className="bg-primary text-background hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" /> Create Document
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDocs.map((doc) => (
                    <Card
                      key={doc.id}
                      className="glass-panel glass-panel-hover p-6 cursor-pointer group"
                      data-testid={`card-doc-${doc.id}`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-white group-hover:text-primary transition-colors">{doc.title}</h3>
                            <Badge variant="secondary" className="text-[10px] mt-1 bg-white/10">
                              {CATEGORIES.find((c) => c.id === doc.category)?.label || "General"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 hover:bg-white/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingDoc(doc);
                            }}
                            data-testid={`button-edit-${doc.id}`}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 hover:bg-destructive/20 text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm("Delete this document?")) {
                                deleteMutation.mutate(doc.id);
                              }
                            }}
                            data-testid={`button-delete-${doc.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">{doc.content}</p>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                        <span className="text-xs text-muted-foreground">
                          Updated {new Date(doc.updatedAt).toLocaleDateString()}
                        </span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {(isCreating || editingDoc) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => {
                setIsCreating(false);
                setEditingDoc(null);
              }}
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative w-full max-w-2xl"
            >
              <Card className="glass-panel p-6 border-glow">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold font-display">
                    {editingDoc ? "Edit Document" : "Create Document"}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingDoc(null);
                    }}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Title</label>
                    <Input
                      value={editingDoc?.title || newDoc.title}
                      onChange={(e) =>
                        editingDoc
                          ? setEditingDoc({ ...editingDoc, title: e.target.value })
                          : setNewDoc({ ...newDoc, title: e.target.value })
                      }
                      placeholder="Document title..."
                      className="bg-white/5 border-white/10"
                      data-testid="input-doc-title"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Category</label>
                    <Select
                      value={editingDoc?.category || newDoc.category}
                      onValueChange={(value) =>
                        editingDoc
                          ? setEditingDoc({ ...editingDoc, category: value })
                          : setNewDoc({ ...newDoc, category: value })
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/10" data-testid="select-doc-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.icon} {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Content</label>
                    <Textarea
                      value={editingDoc?.content || newDoc.content}
                      onChange={(e) =>
                        editingDoc
                          ? setEditingDoc({ ...editingDoc, content: e.target.value })
                          : setNewDoc({ ...newDoc, content: e.target.value })
                      }
                      placeholder="Document content... (Markdown supported)"
                      className="bg-white/5 border-white/10 min-h-[200px]"
                      data-testid="textarea-doc-content"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingDoc(null);
                    }}
                    className="border-white/10 hover:bg-white/5"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={editingDoc ? handleUpdate : handleCreate}
                    className="bg-primary text-background hover:bg-primary/90 font-bold"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-save-doc"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingDoc ? "Update" : "Create"}
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
}
