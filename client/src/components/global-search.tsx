import { useState, useEffect, useRef } from "react";
import { Search, X, FileText, Box, ArrowRight, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchEcosystemApps, fetchDocuments } from "@/lib/api";
import { usePreferences } from "@/lib/store";

interface SearchResult {
  type: "app" | "doc" | "page";
  id: string;
  title: string;
  description: string;
  href: string;
  icon: typeof FileText;
}

const staticPages: SearchResult[] = [
  { type: "page", id: "home", title: "Home", description: "DarkWave Chain homepage", href: "/", icon: Box },
  { type: "page", id: "ecosystem", title: "Ecosystem", description: "Browse DarkWave ecosystem apps", href: "/ecosystem", icon: Box },
  { type: "page", id: "developers", title: "Developers", description: "Developer resources and tools", href: "/developers", icon: FileText },
  { type: "page", id: "whitepaper", title: "Whitepaper", description: "Read the technical whitepaper", href: "/whitepaper", icon: FileText },
  { type: "page", id: "doc-hub", title: "Document Hub", description: "Browse all documentation", href: "/doc-hub", icon: FileText },
];

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { preferences, addRecentSearch } = usePreferences();

  const { data: apps = [] } = useQuery({
    queryKey: ["ecosystem-apps"],
    queryFn: fetchEcosystemApps,
    staleTime: 60000,
  });

  const { data: docs = [] } = useQuery({
    queryKey: ["documents"],
    queryFn: () => fetchDocuments(),
    staleTime: 60000,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase().trim();

  if (lowerQuery) {
    staticPages.forEach((page) => {
      if (page.title.toLowerCase().includes(lowerQuery) || page.description.toLowerCase().includes(lowerQuery)) {
        results.push(page);
      }
    });

    apps.forEach((app) => {
      if (app.name.toLowerCase().includes(lowerQuery) || app.description?.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: "app",
          id: app.id,
          title: app.name,
          description: app.description || "",
          href: "/ecosystem",
          icon: Box,
        });
      }
    });

    docs.forEach((doc) => {
      if (doc.title.toLowerCase().includes(lowerQuery) || doc.content?.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: "doc",
          id: doc.id,
          title: doc.title,
          description: doc.content?.slice(0, 100) || "",
          href: `/doc-hub?doc=${doc.id}`,
          icon: FileText,
        });
      }
    });
  }

  const handleSelect = (result: SearchResult) => {
    addRecentSearch(result.title);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
        data-testid="button-global-search"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono bg-white/10 rounded">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-50 px-4"
            >
              <div className="bg-black/90 border border-white/20 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                  <Search className="w-5 h-5 text-muted-foreground" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search apps, docs, and pages..."
                    className="flex-1 bg-transparent text-white placeholder:text-muted-foreground outline-none"
                    data-testid="input-global-search"
                  />
                  {query && (
                    <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {!query && preferences.recentSearches.length > 0 && (
                    <div className="p-2">
                      <div className="px-2 py-1 text-xs text-muted-foreground uppercase tracking-wider">Recent Searches</div>
                      {preferences.recentSearches.slice(0, 5).map((search, i) => (
                        <button
                          key={i}
                          onClick={() => setQuery(search)}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-muted-foreground hover:bg-white/5 rounded-lg"
                        >
                          <Clock className="w-4 h-4" />
                          {search}
                        </button>
                      ))}
                    </div>
                  )}

                  {query && results.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                      No results found for "{query}"
                    </div>
                  )}

                  {results.length > 0 && (
                    <div className="p-2">
                      {results.slice(0, 8).map((result) => (
                        <Link key={`${result.type}-${result.id}`} href={result.href}>
                          <button
                            onClick={() => handleSelect(result)}
                            className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-white/5 rounded-lg group"
                          >
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                              <result.icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-white truncate">{result.title}</div>
                              <div className="text-xs text-muted-foreground truncate">{result.description}</div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div className="px-4 py-2 border-t border-white/10 text-xs text-muted-foreground flex items-center gap-4">
                  <span><kbd className="px-1.5 py-0.5 bg-white/10 rounded">↵</kbd> to select</span>
                  <span><kbd className="px-1.5 py-0.5 bg-white/10 rounded">esc</kbd> to close</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
