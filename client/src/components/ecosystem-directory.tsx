import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Sparkles, Shield, Zap, Search } from "lucide-react";
import { useLocation } from "wouter";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface DirectoryApp {
  id: string;
  name: string;
  category: string;
  hook: string;
  description?: string;
  url?: string;
  featured?: boolean;
}

/* ── Per-app photorealistic image map ── */
const APP_IMAGES: Record<string, string> = {
  "trust-layer-hub": "/ecosystem/trust-layer-new.jpg",
  "trust-layer": "/ecosystem/trust-layer-new.jpg",
  "trustshield": "/ecosystem/trustshield-new.jpg",
  "darkwave-pulse": "/ecosystem/darkwave-pulse-new.jpg",
  "strike-agent": "/ecosystem/strike-agent-new.jpg",
  "orbit-staffing": "/ecosystem/orbit-staffing-new.jpg",
  "orby": "/ecosystem/orby-new.jpg",
  "lotops-pro": "/ecosystem/lotopspro-new.jpg",
  "brew-board": "/ecosystem/brew-board-new.jpg",
  "tradeworks-ai": "/ecosystem/tradeworks-ai-new.jpg",
  "paintpros": "/ecosystem/paintpros-new.jpg",
  "nashpaintpros": "/ecosystem/nashpaintpros-new.jpg",
  "garagebot": "/ecosystem/garagebot-prod-new.jpg",
  "torque": "/ecosystem/torque-new.jpg",
  "driver-connect": "/ecosystem/driver-connect-new.jpg",
  "veda-solus": "/ecosystem/veda-solus-new.jpg",
  "tlid": "/ecosystem/tlid-new.jpg",
  "chronicles": "/ecosystem/chronicles-new.jpg",
  "the-arcade": "/ecosystem/the-arcade-new.jpg",
  "dwsc-studio": "/ecosystem/darkwave-studios-new.jpg",
  "trust-home": "/ecosystem/trust-home-new.jpg",
  "signal-chat": "/ecosystem/signal-chat-new.jpg",
  "trust-vault": "/ecosystem/trust-vault-new.jpg",
  "guardian-scanner": "/ecosystem/guardian-scanner-new.jpg",
  "the-void": "/ecosystem/the-void-new.jpg",
  "guardian-screener": "/ecosystem/guardian-screener-new.jpg",
  "trust-layer-academy": "/ecosystem/darkwave-academy-new.jpg",
  "verdara": "/ecosystem/verdara-new.jpg",
  "arbora": "/ecosystem/arbora-new.jpg",
  "trust-golf": "/ecosystem/trust-golf-new.png",
  "happy-eats": "/ecosystem/happy-eats.jpg",
  "trust-book": "/ecosystem/trust-book-new.jpg",
  "bomber": "/ecosystem/chronicles-new.jpg",
  "trustgen": "/ecosystem/darkwave-studios-new.jpg",
  "signalcast": "/ecosystem/signalcast.jpg",
  "darkwave-studios": "/ecosystem/darkwave-studios-new.jpg",
  "through-the-veil": "/ecosystem/veil-new.jpg",
};

/* ── Category display order and styling ── */
const CATEGORY_CONFIG: Record<string, { icon: string; gradient: string; order: number }> = {
  "Core": { icon: "⚡", gradient: "from-cyan-500 to-blue-600", order: 0 },
  "Security": { icon: "🛡️", gradient: "from-red-500 to-rose-600", order: 1 },
  "DeFi": { icon: "💎", gradient: "from-emerald-500 to-cyan-500", order: 2 },
  "Finance": { icon: "💰", gradient: "from-amber-500 to-orange-600", order: 3 },
  "AI Trading": { icon: "🤖", gradient: "from-violet-500 to-purple-600", order: 4 },
  "Analytics": { icon: "📈", gradient: "from-cyan-600 to-blue-700", order: 5 },
  "Creative Tools": { icon: "🎨", gradient: "from-purple-500 to-indigo-600", order: 6 },
  "Enterprise": { icon: "🏢", gradient: "from-slate-500 to-zinc-600", order: 7 },
  "Automotive": { icon: "🚗", gradient: "from-zinc-500 to-slate-700", order: 8 },
  "Services": { icon: "🔧", gradient: "from-orange-500 to-red-600", order: 9 },
  "Transportation": { icon: "🚚", gradient: "from-blue-500 to-indigo-600", order: 10 },
  "Health & Wellness": { icon: "🧘", gradient: "from-emerald-500 to-teal-600", order: 11 },
  "Mental Wellness": { icon: "🌀", gradient: "from-purple-900 to-indigo-900", order: 12 },
  "Identity": { icon: "🆔", gradient: "from-teal-500 to-cyan-600", order: 13 },
  "Gaming": { icon: "🎮", gradient: "from-pink-500 to-purple-600", order: 14 },
  "Community": { icon: "💬", gradient: "from-blue-500 to-indigo-500", order: 15 },
  "Development": { icon: "💻", gradient: "from-indigo-500 to-purple-600", order: 16 },
  "Education": { icon: "🎓", gradient: "from-blue-500 to-indigo-600", order: 17 },
  "Outdoor & Recreation": { icon: "🌲", gradient: "from-green-600 to-emerald-700", order: 18 },
  "Sports & Fitness": { icon: "⛳", gradient: "from-green-700 to-emerald-900", order: 19 },
  "Food & Delivery": { icon: "🍔", gradient: "from-orange-500 to-red-600", order: 20 },
  "Hospitality": { icon: "☕", gradient: "from-amber-600 to-yellow-800", order: 21 },
  "Publishing": { icon: "📚", gradient: "from-cyan-600 to-purple-800", order: 22 },
  "Marketing": { icon: "📡", gradient: "from-cyan-500 to-blue-600", order: 23 },
};

/* ── Carousel per category ── */
function CategoryCarousel({ title, apps, gradient, icon, catIndex }: {
  title: string;
  apps: DirectoryApp[];
  gradient: string;
  icon: string;
  catIndex: number;
}) {
  const [, navigate] = useLocation();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: catIndex * 0.06, duration: 0.5 }}
      className="mb-14 scroll-mt-32"
    >
      <div className="mb-6 px-1">
        <div className="flex items-center gap-4 mb-2">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-lg`}>
            <span className="text-lg">{icon}</span>
          </div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <span className="text-white/20 text-xs ml-1 bg-white/5 px-2 py-0.5 rounded-full">{apps.length}</span>
        </div>
      </div>

      <div className="relative px-8 md:px-14">
        <Carousel
          opts={{ align: "start", dragFree: true, containScroll: "trimSnaps", loop: false }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent className="-ml-5">
            {apps.map((app, i) => {
              const image = APP_IMAGES[app.id] || "/ecosystem/trust-layer-new.jpg";

              return (
                <CarouselItem key={app.id} className="pl-5 basis-full sm:basis-[310px] md:basis-[340px]">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.04, 0.4), duration: 0.4 }}
                    onClick={() => app.url?.startsWith("http") ? window.open(app.url, "_blank", "noopener,noreferrer") : navigate(app.url || `/${app.id}`)}
                    className="group relative overflow-hidden rounded-2xl border border-white/5 cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:border-white/15 min-h-[260px]"
                    style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.4)" }}
                    data-testid={`eco-card-${app.id}`}
                  >
                    {/* Photorealistic background */}
                    <div className="absolute inset-0">
                      <img
                        src={image}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        style={{ filter: "brightness(1.1) saturate(1.1)" }}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/15" />
                    </div>

                    {/* Featured badge */}
                    {app.featured && (
                      <div className="absolute top-3 right-3 z-20">
                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white rounded-full bg-gradient-to-r from-cyan-500 to-rose-500 shadow-lg shadow-cyan-500/20">
                          Featured
                        </span>
                      </div>
                    )}

                    {/* Verified badge */}
                    <div className="absolute top-3 left-3 z-20">
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-sm">
                        <Shield className="w-2.5 h-2.5 text-emerald-400" />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">Verified</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-end p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} border border-white/10 flex items-center justify-center shrink-0 backdrop-blur-sm shadow-lg`}>
                          <span className="text-lg">{icon}</span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-white font-bold text-base leading-tight truncate">{app.name}</h3>
                          <p className="text-cyan-400/70 text-[11px] mt-0.5 font-medium truncate">{app.category}</p>
                        </div>
                      </div>

                      <p className="text-white/60 text-xs line-clamp-2 mt-2 mb-4 min-h-[32px] leading-relaxed">
                        {app.hook || app.description}
                      </p>

                      <div className="flex items-center gap-1 text-white/30 group-hover:text-cyan-400/70 transition-colors mt-auto">
                        <span className="text-[10px] uppercase tracking-wider font-medium">Open App</span>
                        {app.url?.startsWith("http") ? (
                          <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                        ) : (
                          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                        )}
                      </div>
                    </div>

                    {/* Top accent line for featured */}
                    {app.featured && (
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                    )}
                  </motion.div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="flex -left-2 md:-left-5 w-10 h-10 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white shadow-xl" />
          <CarouselNext className="flex -right-2 md:-right-5 w-10 h-10 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white shadow-xl" />
        </Carousel>

        <div className="flex sm:hidden items-center justify-center gap-1.5 mt-4">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-3 h-3 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                  : "w-2 h-2 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/* ── Main EcosystemDirectory ── */
export function EcosystemDirectory({
  className = "",
  compact,
  maxCategories,
  defaultCollapsed,
}: {
  compact?: boolean;
  maxCategories?: number;
  className?: string;
  defaultCollapsed?: boolean;
}) {
  const [apps, setApps] = useState<DirectoryApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/ecosystem/directory")
      .then((r) => r.json())
      .then((data) => {
        setApps(data.apps || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 animate-pulse" />
          <div className="h-6 w-56 bg-white/10 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  /* Group apps by category */
  const grouped: Record<string, DirectoryApp[]> = {};
  apps.forEach((app) => {
    const cat = app.category || "General";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(app);
  });

  /* Sort categories by CATEGORY_CONFIG order */
  const sortedCategories = Object.entries(grouped).sort(([a], [b]) => {
    const orderA = CATEGORY_CONFIG[a]?.order ?? 99;
    const orderB = CATEGORY_CONFIG[b]?.order ?? 99;
    return orderA - orderB;
  });

  /* Apply search filter */
  const filteredCategories = searchQuery.trim()
    ? sortedCategories
        .map(([cat, catApps]) => [cat, catApps.filter(app =>
          app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.hook?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.category.toLowerCase().includes(searchQuery.toLowerCase())
        )] as [string, DirectoryApp[]])
        .filter(([, catApps]) => catApps.length > 0)
    : sortedCategories;

  const limitedCategories = maxCategories ? filteredCategories.slice(0, maxCategories) : filteredCategories;

  return (
    <div className={`${className}`} data-testid="ecosystem-directory">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles className="text-white w-6 h-6" />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Ecosystem{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Applications
          </span>
        </h2>
        <p className="text-white/40 text-sm max-w-lg mx-auto mb-2">
          {apps.length} verified on-chain applications across {sortedCategories.length} categories.
          Every app blockchain-verified and integrated into the Trust Layer protocol.
        </p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <Zap className="w-3.5 h-3.5 text-cyan-400/50" />
          <span className="text-white/20 text-xs">All apps secured by Trust Layer L1</span>
        </div>
      </div>

      {/* Search */}
      {!compact && (
        <div className="max-w-md mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ecosystem apps..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 backdrop-blur-sm"
              data-testid="input-ecosystem-search"
            />
          </div>
        </div>
      )}

      {/* Category Jump Links */}
      {!compact && (
        <div className="overflow-x-auto mb-10 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
          <div className="flex items-center gap-2 pb-1 min-w-max">
            {limitedCategories.map(([cat], i) => {
              const config = CATEGORY_CONFIG[cat] || { icon: "⚡", gradient: "from-gray-500 to-gray-700" };
              return (
                <button
                  key={cat}
                  onClick={() => {
                    const el = document.getElementById(`eco-cat-${i}`);
                    if (el) {
                      const y = el.getBoundingClientRect().top + window.scrollY - 100;
                      window.scrollTo({ top: y, behavior: "smooth" });
                    }
                  }}
                  className="whitespace-nowrap px-3 py-1.5 rounded-xl border border-white/5 bg-black/40 text-white/60 text-xs font-medium hover:bg-white/10 hover:border-cyan-500/30 hover:text-white transition-all backdrop-blur-xl shadow-lg"
                >
                  <div className="flex items-center gap-1.5">
                    <span className={`flex items-center justify-center w-5 h-5 rounded-md bg-gradient-to-br ${config.gradient} text-[10px]`}>
                      {config.icon}
                    </span>
                    {cat}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Carousels */}
      {limitedCategories.map(([cat, catApps], i) => {
        const config = CATEGORY_CONFIG[cat] || { icon: "⚡", gradient: "from-gray-500 to-gray-700", order: 99 };
        return (
          <div key={cat} id={`eco-cat-${i}`}>
            <CategoryCarousel
              title={cat}
              apps={catApps}
              gradient={config.gradient}
              icon={config.icon}
              catIndex={i}
            />
          </div>
        );
      })}

      {searchQuery && filteredCategories.length === 0 && (
        <div className="text-center py-16">
          <Search className="w-10 h-10 text-white/10 mx-auto mb-4" />
          <p className="text-white/30 text-sm">No apps found matching "{searchQuery}"</p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-3 text-cyan-400 text-xs hover:underline"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
