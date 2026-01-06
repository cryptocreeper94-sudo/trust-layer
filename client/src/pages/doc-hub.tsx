import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Search, BookOpen } from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { fetchDocuments } from "@/lib/api";
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
            <BackButton />
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
            </div>

            <div className="flex-1">
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
                        <div className="mb-2">
                          <h3 className="text-sm font-bold text-white mb-1">{doc.title}</h3>
                          <Badge variant="outline" className="text-[8px] border-white/10 text-white/40">
                            {CATEGORIES.find(c => c.id === doc.category)?.label || doc.category}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-white/50 line-clamp-3">{doc.content}</p>
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
