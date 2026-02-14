import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { getChroniclesSession } from "./chronicles-login";
import {
  ArrowLeft, ShoppingBag, Package, Hammer, Star, Lock, Loader2,
  ShoppingCart, Sparkles, Check, X, Crown, Gem, Timer, TrendingUp,
  Zap, Gift, ChevronRight,
} from "lucide-react";

const ERA_CONFIG = {
  modern: { name: "Modern Era", emoji: "🏙️", textColor: "text-cyan-400", borderColor: "border-cyan-500/30", bgGradient: "from-cyan-500/20 to-blue-600/20", glowColor: "rgba(6,182,212,0.3)" },
  medieval: { name: "Medieval Era", emoji: "🏰", textColor: "text-amber-400", borderColor: "border-amber-500/30", bgGradient: "from-amber-500/20 to-orange-600/20", glowColor: "rgba(217,119,6,0.3)" },
  wildwest: { name: "Wild West", emoji: "🤠", textColor: "text-yellow-400", borderColor: "border-yellow-500/30", bgGradient: "from-yellow-500/20 to-orange-600/20", glowColor: "rgba(234,179,8,0.3)" },
};

const RARITY_CONFIG: Record<string, { bg: string; text: string; glow: string; border: string }> = {
  common: { bg: "bg-gray-500/20", text: "text-gray-400", glow: "", border: "border-gray-500/30" },
  uncommon: { bg: "bg-green-500/20", text: "text-green-400", glow: "shadow-[0_0_10px_rgba(34,197,94,0.2)]", border: "border-green-500/30" },
  rare: { bg: "bg-blue-500/20", text: "text-blue-400", glow: "shadow-[0_0_15px_rgba(59,130,246,0.3)]", border: "border-blue-500/30" },
  epic: { bg: "bg-purple-500/20", text: "text-purple-400", glow: "shadow-[0_0_20px_rgba(168,85,247,0.3)]", border: "border-purple-500/30" },
  legendary: { bg: "bg-yellow-500/20", text: "text-yellow-300", glow: "shadow-[0_0_25px_rgba(234,179,8,0.4)]", border: "border-yellow-500/30" },
};

const RARITY_ORDER: Record<string, number> = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 };

type Era = keyof typeof ERA_CONFIG;
type Tab = "shop" | "inventory" | "crafting";
type SortBy = "price" | "rarity" | "name";

const getHeaders = (): Record<string, string> => {
  const session = getChroniclesSession();
  if (session?.token) return { Authorization: `Bearer ${session.token}`, "Content-Type": "application/json" };
  return { "Content-Type": "application/json" };
};

const apiFetch = async (url: string, opts?: RequestInit) => {
  const res = await fetch(url, { ...opts, headers: { ...getHeaders(), ...opts?.headers } });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || "Request failed"); }
  return res.json();
};

const getRarity = (r: string) => RARITY_CONFIG[r] || RARITY_CONFIG.common;

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } },
  item: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } },
};

export default function ChroniclesMarketplace() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [era, setEra] = useState<Era>("modern");
  const [tab, setTab] = useState<Tab>("shop");
  const [sort, setSort] = useState<SortBy>("price");
  const [catFilter, setCatFilter] = useState("all");
  const config = ERA_CONFIG[era];

  const { data: gameState } = useQuery({ queryKey: ["/api/chronicles/play/state"], queryFn: () => apiFetch("/api/chronicles/play/state"), staleTime: 15000 });
  const { data: shopData, isLoading: shopLoading } = useQuery({ queryKey: ["/api/chronicles/marketplace", era], queryFn: () => apiFetch(`/api/chronicles/marketplace/${era}`), staleTime: 30000 });
  const { data: invData, isLoading: invLoading } = useQuery({ queryKey: ["/api/chronicles/inventory"], queryFn: () => apiFetch("/api/chronicles/inventory"), staleTime: 10000, enabled: tab === "inventory" });
  const { data: craftData, isLoading: craftLoading } = useQuery({ queryKey: ["/api/chronicles/crafting", era], queryFn: () => apiFetch(`/api/chronicles/crafting/${era}`), staleTime: 30000, enabled: tab === "crafting" });

  const buyMut = useMutation({
    mutationFn: (itemCode: string) => apiFetch("/api/chronicles/marketplace/buy", { method: "POST", body: JSON.stringify({ itemCode, quantity: 1 }) }),
    onSuccess: (d) => { toast({ title: "Item Purchased!", description: d.message || "Check your inventory." }); qc.invalidateQueries({ queryKey: ["/api/chronicles/inventory"] }); qc.invalidateQueries({ queryKey: ["/api/chronicles/play/state"] }); },
    onError: (e: any) => toast({ title: "Purchase Failed", description: e.message, variant: "destructive" }),
  });

  const craftMut = useMutation({
    mutationFn: (recipeCode: string) => apiFetch("/api/chronicles/crafting/craft", { method: "POST", body: JSON.stringify({ recipeCode }) }),
    onSuccess: (d) => { toast({ title: "Item Crafted! ✨", description: d.message || "New item added to inventory." }); qc.invalidateQueries({ queryKey: ["/api/chronicles/inventory"] }); qc.invalidateQueries({ queryKey: ["/api/chronicles/play/state"] }); qc.invalidateQueries({ queryKey: ["/api/chronicles/crafting"] }); },
    onError: (e: any) => toast({ title: "Crafting Failed", description: e.message, variant: "destructive" }),
  });

  const shells = gameState?.shells ?? gameState?.state?.shells ?? 0;
  const level = gameState?.level ?? gameState?.state?.level ?? 1;
  const items: any[] = shopData?.items || shopData || [];
  const inventory: any[] = invData?.items || invData || [];
  const recipes: any[] = craftData?.recipes || craftData || [];

  const categories = ["all", ...Array.from(new Set(items.map((i: any) => i.category).filter(Boolean)))];
  const filtered = items.filter((i: any) => catFilter === "all" || i.category === catFilter);
  const sorted = [...filtered].sort((a: any, b: any) => {
    if (sort === "price") return (a.cost ?? a.price ?? 0) - (b.cost ?? b.price ?? 0);
    if (sort === "rarity") return (RARITY_ORDER[b.rarity] ?? 0) - (RARITY_ORDER[a.rarity] ?? 0);
    return (a.name || "").localeCompare(b.name || "");
  });

  const featuredItems = items.filter((i: any) => (RARITY_ORDER[i.rarity] ?? 0) >= 2);

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "shop", label: "Shop", icon: ShoppingBag },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "crafting", label: "Crafting", icon: Hammer },
  ];

  const invStats = {
    total: inventory.reduce((s: number, i: any) => s + (i.quantity || 1), 0),
    rarest: inventory.reduce((best: string, i: any) => (RARITY_ORDER[i.rarity] ?? 0) > (RARITY_ORDER[best] ?? 0) ? i.rarity : best, "common"),
    value: inventory.reduce((s: number, i: any) => s + ((i.cost ?? i.price ?? 10) * (i.quantity || 1)), 0),
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-purple-500/5 to-transparent pointer-events-none" />
        <div className="absolute top-4 left-1/4 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-8 right-1/4 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/2 w-40 h-20 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Link href="/chronicles/play">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white min-h-[44px] min-w-[44px]" data-testid="back-to-play">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Play
                </Button>
              </Link>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Era Marketplace
              </h1>
            </div>

            <GlassCard glow hover={false} className="shrink-0">
              <div className="flex items-center gap-2 p-4 sm:p-6" data-testid="shells-balance">
                <span className="text-2xl">🐚</span>
                <div>
                  <span className="text-white font-bold text-lg sm:text-xl block leading-tight">{shells.toLocaleString()}</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">Shells</span>
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide" data-testid="era-selector">
            {(Object.keys(ERA_CONFIG) as Era[]).map((e) => (
              <button key={e} onClick={() => setEra(e)} data-testid={`era-${e}`}
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap border min-h-[44px] ${
                  era === e
                    ? `bg-gradient-to-r ${ERA_CONFIG[e].bgGradient} ${ERA_CONFIG[e].borderColor} ${ERA_CONFIG[e].textColor} shadow-lg`
                    : "border-white/10 text-gray-500 hover:text-white hover:border-white/20"
                }`}>
                <span className="text-lg">{ERA_CONFIG[e].emoji}</span> {ERA_CONFIG[e].name}
              </button>
            ))}
          </div>

          <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl" data-testid="tab-selector">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} data-testid={`tab-${t.id}`}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all min-h-[44px] ${
                  tab === t.id
                    ? "bg-gradient-to-r from-cyan-600/30 to-purple-600/30 text-white border border-white/10 shadow-lg"
                    : "text-gray-500 hover:text-white"
                }`}>
                <t.icon className="w-4 h-4" /> {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {tab === "shop" && (
            <motion.div key="shop" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              {featuredItems.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-400" />
                    <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">Featured & Rare</span>
                  </h2>
                  <Swiper
                    modules={[Autoplay, Pagination]}
                    spaceBetween={16}
                    slidesPerView={1}
                    breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    className="pb-10"
                    data-testid="featured-carousel"
                  >
                    {featuredItems.map((item: any, idx: number) => {
                      const rarity = getRarity(item.rarity);
                      const cost = item.cost ?? item.price ?? 0;
                      return (
                        <SwiperSlide key={item.code || idx}>
                          <GlassCard glow className={`${rarity.glow}`}>
                            <div className="p-4 sm:p-6">
                              <div className="flex items-start gap-4">
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${config.bgGradient} flex items-center justify-center text-3xl shrink-0 border ${rarity.border}`}>
                                  {item.icon || "📦"}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="text-white font-bold truncate">{item.name}</span>
                                    <Badge className={`text-[9px] ${rarity.bg} ${rarity.text} border ${rarity.border}`}>{item.rarity}</Badge>
                                  </div>
                                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{item.description}</p>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-yellow-400">🐚 {cost}</span>
                                    {item.limited && <Badge className="bg-pink-500/20 text-pink-400 border border-pink-500/30 animate-pulse text-[9px]">Limited</Badge>}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </GlassCard>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-4 items-center">
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide flex-1">
                  {categories.map((c) => (
                    <button key={String(c)} onClick={() => setCatFilter(String(c))} data-testid={`cat-${c}`}
                      className={`px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap border min-h-[44px] ${
                        catFilter === c
                          ? "bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border-cyan-500/30 text-white"
                          : "border-white/10 text-gray-500 hover:text-white hover:border-white/20"
                      }`}>
                      {c === "all" ? "All Categories" : String(c)}
                    </button>
                  ))}
                </div>
                <div className="flex gap-1 bg-white/5 rounded-lg border border-white/10 p-0.5">
                  {(["price", "rarity", "name"] as SortBy[]).map((s) => (
                    <button key={s} onClick={() => setSort(s)} data-testid={`sort-${s}`}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all min-h-[36px] ${
                        sort === s ? "bg-white/10 text-white" : "text-gray-500 hover:text-white"
                      }`}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {shopLoading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-cyan-400 animate-spin" /></div>
              ) : sorted.length === 0 ? (
                <GlassCard glow className="text-center">
                  <div className="p-10">
                    <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                      <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    </motion.div>
                    <p className="text-gray-400 font-medium">No items available in this era yet.</p>
                    <p className="text-gray-600 text-sm mt-1">Check back soon for new arrivals!</p>
                  </div>
                </GlassCard>
              ) : (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  variants={stagger.container}
                  initial="hidden"
                  animate="visible"
                >
                  {sorted.map((item: any, idx: number) => {
                    const cost = item.cost ?? item.price ?? 0;
                    const canAfford = shells >= cost;
                    const meetsLevel = level >= (item.levelRequired ?? item.level ?? 0);
                    const rarity = getRarity(item.rarity);
                    return (
                      <motion.div key={item.code || idx} variants={stagger.item}>
                        <GlassCard glow={(RARITY_ORDER[item.rarity] ?? 0) >= 2} className={`hover:border-cyan-500/30 transition-colors ${rarity.glow}`}>
                          <div className="p-4 sm:p-6" data-testid={`shop-item-${item.code || idx}`}>
                            <div className="flex items-start gap-3 mb-3">
                              <motion.div
                                whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.bgGradient} flex items-center justify-center text-2xl shrink-0 border ${rarity.border}`}
                              >
                                {item.icon || "📦"}
                              </motion.div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <span className="text-white font-bold text-sm truncate">{item.name}</span>
                                  {item.rarity && (
                                    <Badge className={`text-[9px] ${rarity.bg} ${rarity.text} border ${rarity.border}`}>
                                      {item.rarity}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                              </div>
                            </div>

                            {item.limited && (
                              <div className="mb-3">
                                <Badge className="bg-pink-500/20 text-pink-400 border border-pink-500/30 animate-pulse text-[9px]">
                                  <Gift className="w-3 h-3 mr-1" /> Limited Stock
                                </Badge>
                              </div>
                            )}

                            <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-yellow-400 flex items-center gap-1">🐚 {cost}</span>
                                {(item.levelRequired ?? item.level) > 0 && (
                                  <span className={`text-[10px] flex items-center gap-0.5 ${meetsLevel ? "text-gray-500" : "text-red-400"}`}>
                                    {meetsLevel ? <Star className="w-3 h-3" /> : <Lock className="w-3 h-3" />} Lv.{item.levelRequired ?? item.level}
                                  </span>
                                )}
                              </div>
                              <Button
                                size="sm"
                                disabled={!canAfford || !meetsLevel || buyMut.isPending}
                                onClick={() => buyMut.mutate(item.code)}
                                data-testid={`buy-${item.code || idx}`}
                                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white text-xs px-4 h-9 min-w-[44px]"
                              >
                                {buyMut.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <><ShoppingCart className="w-3 h-3 mr-1" /> Buy</>}
                              </Button>
                            </div>
                          </div>
                        </GlassCard>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </motion.div>
          )}

          {tab === "inventory" && (
            <motion.div key="inventory" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              {invLoading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-cyan-400 animate-spin" /></div>
              ) : inventory.length === 0 ? (
                <GlassCard glow className="text-center">
                  <div className="p-10" data-testid="empty-inventory">
                    <motion.div animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
                      <Package className="w-14 h-14 text-gray-600 mx-auto mb-4" />
                    </motion.div>
                    <p className="text-gray-400 font-semibold text-lg mb-1">No items yet</p>
                    <p className="text-gray-600 text-sm mb-4">Visit the shop to start collecting!</p>
                    <Button onClick={() => setTab("shop")} className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white min-h-[44px]" data-testid="go-to-shop">
                      <ShoppingBag className="w-4 h-4 mr-2" /> Browse Shop
                    </Button>
                  </div>
                </GlassCard>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <GlassCard glow hover={false}>
                      <div className="p-4 sm:p-6 text-center" data-testid="stat-total-items">
                        <Package className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">{invStats.total}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Total Items</p>
                      </div>
                    </GlassCard>
                    <GlassCard glow hover={false}>
                      <div className="p-4 sm:p-6 text-center" data-testid="stat-rarest">
                        <Gem className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                        <p className={`text-2xl font-bold capitalize ${getRarity(invStats.rarest).text}`}>{invStats.rarest}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Rarest Item</p>
                      </div>
                    </GlassCard>
                    <GlassCard glow hover={false}>
                      <div className="p-4 sm:p-6 text-center" data-testid="stat-total-value">
                        <TrendingUp className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-yellow-400">🐚 {invStats.value.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Est. Value</p>
                      </div>
                    </GlassCard>
                  </div>

                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    variants={stagger.container}
                    initial="hidden"
                    animate="visible"
                  >
                    {inventory.map((item: any, idx: number) => {
                      const rarity = getRarity(item.rarity);
                      return (
                        <motion.div key={item.code || idx} variants={stagger.item}>
                          <GlassCard glow={(RARITY_ORDER[item.rarity] ?? 0) >= 2} className={`hover:border-cyan-500/30 transition-colors ${rarity.glow}`}>
                            <div className="p-4 sm:p-6" data-testid={`inv-item-${item.code || idx}`}>
                              <div className="flex items-start gap-3">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${ERA_CONFIG[item.era as Era]?.bgGradient || config.bgGradient} flex items-center justify-center text-2xl shrink-0 border ${rarity.border}`}>
                                  {item.icon || "📦"}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <span className="text-white font-bold text-sm truncate">{item.name}</span>
                                    {(item.quantity || 1) > 1 && (
                                      <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[9px] font-bold">x{item.quantity}</Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    {item.era && (
                                      <Badge className={`text-[9px] ${ERA_CONFIG[item.era as Era]?.textColor || "text-gray-400"} bg-white/5 border border-white/10`}>
                                        {ERA_CONFIG[item.era as Era]?.emoji} {ERA_CONFIG[item.era as Era]?.name || item.era}
                                      </Badge>
                                    )}
                                    {item.rarity && (
                                      <Badge className={`text-[9px] ${rarity.bg} ${rarity.text} border ${rarity.border}`}>{item.rarity}</Badge>
                                    )}
                                  </div>
                                  {item.acquired_via && <p className="text-[10px] text-gray-600 italic mt-1">{item.acquired_via}</p>}
                                </div>
                              </div>
                            </div>
                          </GlassCard>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </>
              )}
            </motion.div>
          )}

          {tab === "crafting" && (
            <motion.div key="crafting" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              {craftLoading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-cyan-400 animate-spin" /></div>
              ) : recipes.length === 0 ? (
                <GlassCard glow className="text-center">
                  <div className="p-10" data-testid="empty-crafting">
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>
                      <Hammer className="w-14 h-14 text-gray-600 mx-auto mb-4" />
                    </motion.div>
                    <p className="text-gray-400 font-semibold text-lg mb-1">No recipes available</p>
                    <p className="text-gray-600 text-sm">Recipes for {config.name} coming soon!</p>
                  </div>
                </GlassCard>
              ) : (
                <>
                  <GlassCard hover={false} className="mb-6">
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-bold">Crafting Workshop</h3>
                          <p className="text-xs text-gray-500">Combine items from your inventory to create powerful new gear</p>
                        </div>
                      </div>
                    </div>
                  </GlassCard>

                  <Accordion type="single" collapsible className="space-y-3">
                    {recipes.map((recipe: any, idx: number) => {
                      const cost = recipe.shellCost ?? recipe.cost ?? 0;
                      const canAfford = shells >= cost;
                      const ownedCodes = new Set(inventory.map((i: any) => i.code));
                      const ingredients: any[] = recipe.ingredients || [];
                      const hasAll = ingredients.every((ing: any) => ownedCodes.has(ing.code || ing.itemCode));
                      const rarity = getRarity(recipe.rarity);
                      const canCraft = hasAll && canAfford;

                      return (
                        <motion.div key={recipe.code || idx} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                          <GlassCard glow={canCraft} className={`hover:border-cyan-500/30 transition-colors ${canCraft ? rarity.glow : ""}`}>
                            <AccordionItem value={recipe.code || `recipe-${idx}`} className="border-none" data-testid={`recipe-${recipe.code || idx}`}>
                              <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.bgGradient} flex items-center justify-center text-2xl shrink-0 border ${rarity.border}`}>
                                    {recipe.icon || "⚒️"}
                                  </div>
                                  <div className="flex-1 min-w-0 text-left">
                                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                      <span className="text-white font-bold text-sm">{recipe.name}</span>
                                      {recipe.rarity && <Badge className={`text-[9px] ${rarity.bg} ${rarity.text} border ${rarity.border}`}>{recipe.rarity}</Badge>}
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] text-gray-500">
                                      {cost > 0 && <span className="font-medium text-yellow-400">🐚 {cost}</span>}
                                      {recipe.xpReward && <span className="text-cyan-400 flex items-center gap-0.5"><Zap className="w-3 h-3" /> +{recipe.xpReward} XP</span>}
                                      {recipe.craftTime && <span className="flex items-center gap-0.5"><Timer className="w-3 h-3" /> {recipe.craftTime}</span>}
                                    </div>
                                  </div>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-4 sm:px-6 pb-4">
                                {recipe.description && <p className="text-xs text-gray-500 mb-4">{recipe.description}</p>}

                                <div className="mb-4">
                                  <p className="text-xs text-gray-400 font-medium mb-2">Required Ingredients:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {ingredients.map((ing: any, i: number) => {
                                      const owned = ownedCodes.has(ing.code || ing.itemCode);
                                      return (
                                        <span key={i} className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border ${
                                          owned ? "border-green-500/30 text-green-400 bg-green-500/10" : "border-red-500/30 text-red-400 bg-red-500/10"
                                        }`} data-testid={`ingredient-${ing.code || ing.itemCode || i}`}>
                                          {owned ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                          {ing.name || ing.code || ing.itemCode}
                                          {ing.quantity > 1 && ` x${ing.quantity}`}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>

                                {recipe.craftTime && (
                                  <div className="mb-4">
                                    <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                      <span>Craft Time</span>
                                      <span>{recipe.craftTime}</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                      <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full w-0" />
                                    </div>
                                  </div>
                                )}

                                <Button
                                  size="sm"
                                  disabled={!canCraft || craftMut.isPending}
                                  onClick={() => craftMut.mutate(recipe.code)}
                                  data-testid={`craft-${recipe.code || idx}`}
                                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white h-10 min-h-[44px]"
                                >
                                  {craftMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4 mr-2" /> Craft Item</>}
                                </Button>
                              </AccordionContent>
                            </AccordionItem>
                          </GlassCard>
                        </motion.div>
                      );
                    })}
                  </Accordion>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}