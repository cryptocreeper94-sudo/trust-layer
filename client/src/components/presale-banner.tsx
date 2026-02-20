import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Rocket, TrendingUp, Users, Coins, X, ChevronRight, Zap } from "lucide-react";

interface PresaleStats {
  totalRaisedUsd: number;
  tokensSold: number;
  tokensRemaining: number;
  presaleAllocation: number;
  percentSold: string;
  isSoldOut: boolean;
  uniqueHolders: number;
  totalPurchases: number;
  currentTokenPrice: number;
  nextMilestoneUsd: number | null;
  nextTokenPrice: number | null;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}

function formatUSD(n: number): string {
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return "$" + (n / 1_000).toFixed(1) + "K";
  return "$" + n.toFixed(0);
}

export function PresaleBanner() {
  const [location] = useLocation();
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const { data: stats } = useQuery<PresaleStats>({
    queryKey: ["/api/presale/stats"],
    queryFn: async () => {
      const res = await fetch("/api/presale/stats");
      if (!res.ok) throw new Error("Failed to fetch presale stats");
      return res.json();
    },
    refetchInterval: 30000,
    staleTime: 15000,
  });

  const hiddenPaths = ["/presale", "/presale/success", "/owner-admin"];
  const shouldHide = hiddenPaths.some(p => location.startsWith(p));

  if (shouldHide || dismissed || !stats) return null;

  const percentNum = parseFloat(stats.percentSold || "0");
  const tokensRemaining = stats.presaleAllocation - stats.tokensSold;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-[9999]"
        data-testid="presale-banner"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-purple-600/20 to-pink-600/20 blur-xl" />

          <div className="relative bg-slate-950/95 backdrop-blur-xl border-t border-white/10">
            <button
              onClick={() => setDismissed(true)}
              className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-white/10 transition-colors z-10"
              data-testid="presale-banner-dismiss"
              aria-label="Dismiss presale banner"
            >
              <X className="w-3.5 h-3.5 text-white/50" />
            </button>

            <div className="container mx-auto px-3 sm:px-6">
              <div
                className="flex items-center gap-3 py-2.5 cursor-pointer sm:cursor-default"
                onClick={() => setExpanded(!expanded)}
                data-testid="presale-banner-toggle"
              >
                <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                      <Rocket className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-950 animate-pulse" />
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:hidden shrink-0">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                    <Rocket className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                    PRESALE LIVE
                  </span>
                </div>

                <div className="hidden sm:flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 uppercase">
                      Signal Presale Live
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-3 h-3 text-cyan-400" />
                      <span className="text-white/60">Raised:</span>
                      <span className="font-semibold text-white" data-testid="presale-stat-raised">{formatUSD(stats.totalRaisedUsd)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Coins className="w-3 h-3 text-yellow-400" />
                      <span className="text-white/60">Price:</span>
                      <span className="font-semibold text-white" data-testid="presale-stat-price">${stats.currentTokenPrice}</span>
                    </div>
                    <div className="hidden lg:flex items-center gap-1.5">
                      <Users className="w-3 h-3 text-purple-400" />
                      <span className="text-white/60">Holders:</span>
                      <span className="font-semibold text-white" data-testid="presale-stat-holders">{stats.uniqueHolders}</span>
                    </div>
                    <div className="hidden xl:flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-pink-400" />
                      <span className="text-white/60">Remaining:</span>
                      <span className="font-semibold text-white" data-testid="presale-stat-remaining">{formatNumber(tokensRemaining)} SIG</span>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-2 flex-1 max-w-[200px]">
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(percentNum, 100)}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
                      />
                    </div>
                    <span className="text-[10px] text-white/40 shrink-0">{percentNum.toFixed(1)}%</span>
                  </div>
                </div>

                <div className="flex-1 sm:hidden">
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-white/60">
                      {formatUSD(stats.totalRaisedUsd)} raised
                    </span>
                    <span className="text-cyan-400 font-medium">
                      ${stats.currentTokenPrice}/SIG
                    </span>
                  </div>
                  <div className="mt-1 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
                      style={{ width: `${Math.min(percentNum, 100)}%` }}
                    />
                  </div>
                </div>

                <Link href="/presale" data-testid="presale-banner-cta">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs font-bold shrink-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-shadow"
                  >
                    <span className="hidden sm:inline">Join Presale</span>
                    <span className="sm:hidden">Join</span>
                    <ChevronRight className="w-3 h-3" />
                  </motion.div>
                </Link>
              </div>

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden sm:hidden"
                  >
                    <div className="grid grid-cols-2 gap-2 pb-3 pt-1">
                      <div className="bg-white/5 rounded-lg p-2.5">
                        <div className="flex items-center gap-1 mb-1">
                          <TrendingUp className="w-3 h-3 text-cyan-400" />
                          <span className="text-[10px] text-white/50">Total Raised</span>
                        </div>
                        <span className="text-sm font-bold text-white">{formatUSD(stats.totalRaisedUsd)}</span>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2.5">
                        <div className="flex items-center gap-1 mb-1">
                          <Coins className="w-3 h-3 text-yellow-400" />
                          <span className="text-[10px] text-white/50">Token Price</span>
                        </div>
                        <span className="text-sm font-bold text-white">${stats.currentTokenPrice}</span>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2.5">
                        <div className="flex items-center gap-1 mb-1">
                          <Users className="w-3 h-3 text-purple-400" />
                          <span className="text-[10px] text-white/50">Holders</span>
                        </div>
                        <span className="text-sm font-bold text-white">{stats.uniqueHolders}</span>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2.5">
                        <div className="flex items-center gap-1 mb-1">
                          <Zap className="w-3 h-3 text-pink-400" />
                          <span className="text-[10px] text-white/50">Remaining</span>
                        </div>
                        <span className="text-sm font-bold text-white">{formatNumber(tokensRemaining)}</span>
                      </div>
                    </div>
                    {stats.nextMilestoneUsd && (
                      <div className="pb-3 text-center">
                        <span className="text-[10px] text-white/40">
                          Next price increase at {formatUSD(stats.nextMilestoneUsd)} → ${stats.nextTokenPrice}/SIG
                        </span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
