import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, ChevronUp, ExternalLink, Sparkles, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

import hubTrading from "@/assets/generated_images/hub_trading_defi.jpg";
import ccGames from "@/assets/generated_images/cc_games_arcade.jpg";
import hubAI from "@/assets/generated_images/hub_ai_tools.jpg";
import hubCommunity from "@/assets/generated_images/hub_community_social.jpg";
import hubIdentity from "@/assets/generated_images/hub_identity_security.jpg";
import hubEcosystem from "@/assets/generated_images/hub_ecosystem_globe.jpg";
import hubHome from "@/assets/generated_images/hub_home_overview.jpg";
import theVoidImg from "@/assets/generated_images/hub_learn_explore.jpg";

interface DirectoryApp {
  id: string;
  name: string;
  category: string;
  hook: string;
  description?: string;
  url?: string;
  featured?: boolean;
}

const CATEGORY_ICONS: Record<string, string> = {
  "Core": "⚡",
  "Security": "🛡️",
  "DeFi": "💎",
  "Finance": "💰",
  "Gaming": "🎮",
  "Entertainment": "🌀",
  "Community": "💬",
  "AI Trading": "🤖",
  "Analytics": "📈",
  "Identity": "🆔",
  "Mental Wellness": "🧘",
};

const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  "Core": hubHome,
  "Security": hubIdentity,
  "DeFi": hubTrading,
  "Finance": hubTrading,
  "Gaming": ccGames,
  "Entertainment": ccGames,
  "Community": hubCommunity,
  "AI Trading": hubAI,
  "Analytics": hubAI,
  "Identity": hubIdentity,
  "Mental Wellness": theVoidImg,
};

const SPECIFIC_APP_IMAGES: Record<string, string> = {
  "the-void": theVoidImg,
};

export function EcosystemDirectory({
  className = "",
  compact, // kept to maintain interface but visual will be consistent
  maxCategories,
  defaultCollapsed,
}: {
  compact?: boolean;
  maxCategories?: number;
  className?: string;
  defaultCollapsed?: boolean;
}) {
  const [, navigate] = useLocation();
  const [apps, setApps] = useState<DirectoryApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch("/api/ecosystem/directory")
      .then((r) => r.json())
      .then((data) => {
        setApps(data.apps || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  if (loading) {
    return (
      <div className={`bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 rounded bg-cyan-500/20 animate-pulse" />
          <div className="h-4 w-40 bg-white/10 rounded animate-pulse" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-3 w-full bg-white/5 rounded mt-3 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className={`mb-16 scroll-mt-32 ${className}`} data-testid="ecosystem-directory-carousel">
      <div className="mb-7 px-1">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">Core Ecosystem Platform</h2>
          <span className="text-white/20 text-xs ml-1 bg-white/5 px-2 py-0.5 rounded-full">{apps.length} Apps</span>
        </div>
        <p className="text-white/40 text-sm leading-relaxed max-w-2xl pl-14">
          The verified on-chain applications directly managed by the Trust Layer foundation. Explore the unified grid of official platforms.
        </p>
      </div>

      <div className="relative px-8 md:px-14">
        <Carousel
          opts={{ align: "start", dragFree: true, containScroll: "trimSnaps", loop: false }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent className="-ml-5">
            {apps.map((app, i) => {
              const image = SPECIFIC_APP_IMAGES[app.id] || DEFAULT_CATEGORY_IMAGES[app.category] || hubEcosystem;
              const iconEmoji = CATEGORY_ICONS[app.category] || "⚡";

              return (
                <CarouselItem key={app.id} className="pl-5 basis-full sm:basis-[310px] md:basis-[340px]">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.04, 0.4), duration: 0.4 }}
                    onClick={() => app.url?.startsWith("http") ? window.open(app.url, "_blank", "noopener,noreferrer") : navigate(app.url || `/${app.id}`)}
                    className="group relative overflow-hidden rounded-2xl border border-white/5 cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:border-white/15 min-h-[240px]"
                    style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.4)" }}
                  >
                    <div className="absolute inset-0">
                      <img
                        src={image}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        style={{ filter: "brightness(1.1)" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/30" />
                    </div>

                    {app.featured && (
                      <div className="absolute top-3 right-3 z-20">
                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 shadow-lg">
                          Featured
                        </span>
                      </div>
                    )}

                    <div className="relative z-10 h-full flex flex-col justify-end p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/15 to-white/5 border border-white/10 flex items-center justify-center shrink-0 backdrop-blur-sm shadow-lg">
                          <span className="text-white text-lg">{iconEmoji}</span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-white font-bold text-[15px] leading-tight truncate">{app.name}</h3>
                          <p className="text-white/50 text-xs mt-1 truncate">{app.category}</p>
                        </div>
                      </div>

                      <p className="text-white/60 text-xs line-clamp-2 mt-2 mb-3 min-h-[32px]">
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
                  </motion.div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="flex -left-2 md:-left-5 w-10 h-10 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white shadow-xl" />
          <CarouselNext className="flex -right-2 md:-right-5 w-10 h-10 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white shadow-xl" />
        </Carousel>
        
        <div className="flex sm:hidden items-center justify-center gap-1.5 mt-6 flex-wrap px-4">
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
    </div>
  );
}
