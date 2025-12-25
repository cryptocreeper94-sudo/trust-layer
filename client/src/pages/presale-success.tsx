import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useSearch } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, ArrowRight, Loader2, Sparkles, Wallet, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";
import quantumRealm from "@assets/generated_images/quantum_dimension_realm.png";

const TOKEN_PRICE = 0.008;

const TIER_BONUSES: Record<string, number> = {
  genesis: 25,
  founder: 15,
  pioneer: 10,
  early_bird: 5,
};

export default function PresaleSuccess() {
  const searchParams = new URLSearchParams(window.location.search);
  const sessionId = searchParams.get("session_id");
  const { toast } = useToast();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/presale/verify", sessionId],
    queryFn: async () => {
      if (!sessionId) throw new Error("No session ID");
      const res = await fetch(`/api/presale/verify?session_id=${sessionId}`);
      if (!res.ok) throw new Error("Verification failed");
      return res.json();
    },
    enabled: !!sessionId,
    retry: false,
  });

  const amountPaid = parseFloat(data?.amountPaid || "0");
  const tier = data?.tier || "unknown";
  const bonusPercent = TIER_BONUSES[tier] || 0;
  const baseTokens = Math.floor(amountPaid / TOKEN_PRICE);
  const bonusTokens = Math.floor(baseTokens * (bonusPercent / 100));
  const totalTokens = baseTokens + bonusTokens;

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-[#080c18] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Invalid session</p>
          <Link href="/presale">
            <Button className="mt-4">Return to Presale</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080c18] text-white relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(16,185,129,0.2) 0%, transparent 50%)",
        }}
      />
      
      <div className="absolute inset-0">
        <img src={quantumRealm} alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080c18] via-[#080c18]/80 to-[#080c18]/60" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-20">
        {isLoading ? (
          <div className="text-center">
            <Loader2 className="w-16 h-16 animate-spin text-cyan-400 mx-auto mb-4" />
            <p className="text-gray-400">Verifying your purchase...</p>
          </div>
        ) : error || !data?.success ? (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">!</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Verification Issue</h1>
            <p className="text-gray-400 mb-8">
              We couldn't verify your payment. If you completed the purchase, please contact support.
            </p>
            <Link href="/presale">
              <Button className="bg-gradient-to-r from-cyan-600 to-purple-600">
                Return to Presale
              </Button>
            </Link>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/30"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 mb-6">
              <Sparkles className="w-4 h-4 text-green-400" />
              <span className="text-green-300 text-sm font-medium">Purchase Successful</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Welcome to DarkWave!
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-8">
              You're now an early adopter of the DarkWave ecosystem.
            </p>

            <div className="bg-gradient-to-br from-gray-900/90 to-black/80 rounded-2xl border border-white/10 p-8 mb-8 backdrop-blur-xl" style={{
              boxShadow: "0 0 60px rgba(16,185,129,0.15)",
            }}>
              <div className="flex items-center justify-center gap-4 mb-6">
                <img src={darkwaveLogo} alt="DWC" className="w-16 h-16 object-contain" />
                <div className="text-left">
                  <p className="text-gray-400 text-sm">Your Token Allocation</p>
                  <p className="text-4xl font-bold text-white">{totalTokens.toLocaleString()} DWC</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 rounded-xl bg-white/5">
                  <p className="text-2xl font-bold text-cyan-400">${amountPaid}</p>
                  <p className="text-gray-500 text-sm">Amount Paid</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5">
                  <p className="text-2xl font-bold text-green-400">+{bonusTokens.toLocaleString()}</p>
                  <p className="text-gray-500 text-sm">{bonusPercent}% Bonus</p>
                </div>
              </div>

              <div className="text-sm text-gray-500 space-y-2">
                <p>Confirmation sent to: <span className="text-white">{data.email}</span></p>
                <p>Tier: <span className="text-white capitalize">{tier.replace("_", " ")}</span></p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 mb-8">
              <p className="text-cyan-300 text-sm">
                Your tokens will be available at mainnet launch (October 2026). 
                You'll receive updates at your registered email.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button 
                  variant="outline" 
                  className="border-white/20 hover:bg-white/5"
                  data-testid="button-explore-ecosystem"
                >
                  Explore Ecosystem
                </Button>
              </Link>
              <Link href="/roadmap">
                <Button 
                  className="bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600"
                  data-testid="button-view-roadmap"
                >
                  View Roadmap <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
