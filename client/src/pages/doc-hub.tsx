import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Search, BookOpen, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { fetchDocuments } from "@/lib/api";
import { usePageAnalytics } from "@/hooks/use-analytics";

const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

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

  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen text-foreground overflow-x-hidden relative" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="#06b6d4" size={400} top="5%" left="10%" delay={0} />
      <GlowOrb color="#8b5cf6" size={350} top="40%" left="75%" delay={2} />
      <GlowOrb color="#ec4899" size={300} top="70%" left="20%" delay={4} />

      <div className="relative z-10 pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="max-w-2xl">
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
                  <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Trust Layer Doc Hub</span>
                </h1>
                <p className="text-sm text-muted-foreground">
                  Central repository for all ecosystem documentation.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                onClick={() => window.open('/api/whitepaper/pdf', '_blank')}
                data-testid="button-download-whitepaper-pdf"
              >
                <Download className="w-3 h-3" />
                <span className="hidden sm:inline">Download PDF</span>
              </Button>
            </div>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="w-full lg:w-56 space-y-4 lg:sticky lg:top-20 h-fit"
            >
              <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl hover:scale-[1.02] transition-all duration-300" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}>
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
              </div>

              <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-4" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}>
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
            </motion.div>

            <div className="flex-1">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-4 h-32 animate-pulse" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }} />
                  ))}
                </div>
              ) : filteredDocs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}
                >
                  <div className="p-8 text-center">
                    <FileText className="w-10 h-10 text-white/20 mx-auto mb-3" />
                    <p className="text-sm text-white/40">No documents found</p>
                  </div>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDocs.map((doc, index) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                      style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}
                    >
                      <div className="p-4">
                        <div className="mb-2">
                          <h3 className="text-sm font-bold text-white mb-1">{doc.title}</h3>
                          <Badge variant="outline" className="text-[8px] border-white/10 text-white/40">
                            {CATEGORIES.find(c => c.id === doc.category)?.label || doc.category}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-white/50 line-clamp-3">{doc.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
