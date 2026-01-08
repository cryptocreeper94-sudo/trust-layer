import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { 
  Shield, ShieldCheck, Award, CheckCircle2, ExternalLink, 
  Calendar, Star, Sparkles, Search, Globe
} from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { HeaderTools } from "@/components/header-tools";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios";

interface RegistryEntry {
  id: string;
  projectName: string;
  tier: string;
  score: number | null;
  validUntil: string | null;
  nftTokenId: string | null;
  blockchainTxHash: string | null;
}

function getTierInfo(tier: string) {
  switch (tier) {
    case "guardian_premier":
      return { name: "Guardian Premier", gradient: "from-pink-500 to-pink-700", icon: Award, glow: "rgba(236,72,153,0.3)" };
    case "assurance_lite":
      return { name: "Assurance Lite", gradient: "from-purple-500 to-purple-700", icon: ShieldCheck, glow: "rgba(168,85,247,0.3)" };
    default:
      return { name: "Self-Cert", gradient: "from-cyan-500 to-cyan-700", icon: Shield, glow: "rgba(6,182,212,0.3)" };
  }
}

function getScoreColor(score: number) {
  if (score >= 90) return "text-emerald-400";
  if (score >= 70) return "text-amber-400";
  return "text-red-400";
}

export default function GuardianRegistry() {
  usePageAnalytics();
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useQuery<{ registry: RegistryEntry[] }>({
    queryKey: ["/api/guardian/registry"],
    queryFn: () => axios.get("/api/guardian/registry").then(r => r.data),
  });

  const registry = data?.registry || [];
  const filteredRegistry = registry.filter(entry =>
    entry.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackButton />
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Globe className="w-6 h-6 text-cyan-400" />
                Guardian Registry
              </h1>
              <p className="text-sm text-white/60">Verified security certifications</p>
            </div>
          </div>
          <HeaderTools />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-white/10 mb-6">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-white/80 uppercase tracking-wider">Blockchain Verified</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Certified Projects
            </span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Every project in this registry has been audited by Guardian Security.
            Certifications are immutably recorded on the DarkWave blockchain.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search certified projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-6 bg-slate-900/50 border-white/10 text-lg"
              data-testid="input-search-registry"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <GlassCard glow className="p-6 text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {registry.length}
              </div>
              <p className="text-white/60">Certified Projects</p>
            </GlassCard>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard glow className="p-6 text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                {registry.filter(r => r.tier === "guardian_premier").length}
              </div>
              <p className="text-white/60">Premier Certifications</p>
            </GlassCard>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <GlassCard glow className="p-6 text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                {registry.filter(r => r.score && r.score >= 90).length}
              </div>
              <p className="text-white/60">90+ Security Scores</p>
            </GlassCard>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-3 border-cyan-400 border-t-transparent rounded-full"
            />
          </div>
        ) : filteredRegistry.length === 0 ? (
          <GlassCard glow className="text-center py-20">
            <Shield className="w-20 h-20 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-white mb-3">
              {searchTerm ? "No Matching Projects" : "Building Our Registry"}
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              {searchTerm 
                ? "No certified projects match your search." 
                : "Certified projects will appear here as audits complete. Be among the first to get Guardian certified."}
            </p>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {filteredRegistry.map((entry, index) => {
              const tierInfo = getTierInfo(entry.tier);
              const TierIcon = tierInfo.icon;
              const isValid = entry.validUntil && new Date(entry.validUntil) > new Date();
              
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GlassCard 
                    glow 
                    className="p-6 hover:border-white/20 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tierInfo.gradient} flex items-center justify-center shrink-0`}>
                        <TierIcon className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-white">{entry.projectName}</h3>
                          <Badge className={`${isValid ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                            {isValid ? "Active" : "Expired"}
                          </Badge>
                          {entry.nftTokenId && (
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                              <Sparkles className="w-3 h-3 mr-1" />
                              NFT Minted
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4" />
                            {tierInfo.name}
                          </span>
                          {entry.score !== null && (
                            <span className={`flex items-center gap-1 font-semibold ${getScoreColor(entry.score)}`}>
                              Security Score: {entry.score}/100
                            </span>
                          )}
                          {entry.validUntil && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Valid until: {new Date(entry.validUntil).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {entry.blockchainTxHash && (
                        <a
                          href={`/explorer?tx=${entry.blockchainTxHash}`}
                          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                          data-testid={`link-verify-${entry.id}`}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="hidden md:inline">Verify on Chain</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <GlassCard glow className="p-8 max-w-2xl mx-auto">
            <Award className="w-12 h-12 text-pink-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Get Your Project Certified</h3>
            <p className="text-gray-400 mb-6">
              Join the registry of trusted projects with a Guardian Security certification.
              Build credibility and trust with your users.
            </p>
            <a
              href="/guardian-certification"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl text-white font-semibold hover:from-cyan-600 hover:to-purple-700 transition-all"
              data-testid="button-get-certified"
            >
              Start Certification Process
              <ExternalLink className="w-4 h-4" />
            </a>
          </GlassCard>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
