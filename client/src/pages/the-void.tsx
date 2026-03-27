import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Shield, Fingerprint, Link2, CheckCircle2, XCircle, Hash,
  Sparkles, Crown, Zap, Globe, Lock, Eye, Copy, Search,
  ArrowRight, ChevronDown, ChevronUp, Clock, Users, Layers,
  Star, Award, Network, ExternalLink
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

function FloatingOrb({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${className}`}
      animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 8 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

interface StampVerification {
  valid: boolean;
  stamp?: {
    voidId: string;
    userId: number;
    stampHash: string;
    blockNumber: number;
    previousHash: string | null;
    payload: any;
    verified: boolean;
    createdAt: string;
  };
  verification?: {
    hashMatch: boolean;
    chainIntegrity: boolean;
    issuer: string;
    network: string;
    blockNumber: number;
    mintedAt: string;
  };
}

interface VoidStats {
  totalVoidIds: number;
  totalStamps: number;
  totalBridgeLinks: number;
  latestBlock: { blockNumber: number; hash: string; timestamp: string } | null;
  network: string;
  standard: string;
}

export default function TheVoid() {
  const [verifyInput, setVerifyInput] = useState("");
  const [verifyResult, setVerifyResult] = useState<StampVerification | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTechnical, setShowTechnical] = useState(false);

  const { data: stats } = useQuery<VoidStats>({
    queryKey: ["/api/void/stats"],
    refetchInterval: 30000,
  });

  const handleVerify = async () => {
    if (!verifyInput.trim()) return;
    setVerifying(true);
    try {
      const id = verifyInput.trim().toUpperCase();
      const formatted = id.startsWith("V-") ? id : `V-${id}`;
      const res = await fetch(`/api/stamp/verify/${formatted}`);
      const data = await res.json();
      setVerifyResult(data);
    } catch {
      setVerifyResult({ valid: false });
    }
    setVerifying(false);
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const features = [
    { icon: Fingerprint, title: "Void ID", desc: "Unique V-XXXXXXXX identity minted on-chain as your premium hallmark", gradient: "from-purple-500 to-indigo-600" },
    { icon: Shield, title: "DW-STAMP-1.0", desc: "SHA-256 hash-chained blockchain stamps with full chain integrity verification", gradient: "from-cyan-500 to-blue-600" },
    { icon: Link2, title: "Bridge Protocol", desc: "Link your Signal Chat identity to your Trust Layer Void ID seamlessly", gradient: "from-emerald-500 to-teal-600" },
    { icon: Crown, title: "Premium Badge", desc: "Verified Void premium member flair across the entire Trust Layer ecosystem", gradient: "from-purple-500 to-cyan-600" },
    { icon: Users, title: "Affiliate Rewards", desc: "Your Void ID doubles as a referral code — earn 5 bonus credits per Premium referral", gradient: "from-pink-500 to-rose-600" },
    { icon: Globe, title: "Cross-Ecosystem SSO", desc: "Single sign-on across all 31 Trust Layer apps with your Trust Layer ID and Void credentials", gradient: "from-violet-500 to-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <FloatingOrb className="w-96 h-96 bg-purple-500/8 blur-[120px] top-20 -left-40" delay={0} />
      <FloatingOrb className="w-80 h-80 bg-cyan-500/6 blur-[100px] top-1/3 right-0" delay={2} />
      <FloatingOrb className="w-72 h-72 bg-indigo-500/8 blur-[100px] bottom-40 left-1/4" delay={4} />
      <FloatingOrb className="w-64 h-64 bg-pink-500/5 blur-[80px] bottom-20 right-1/4" delay={6} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 relative z-10">

        <motion.section
          variants={stagger}
          initial="hidden"
          animate="show"
          className="text-center mb-20 sm:mb-28 max-w-4xl mx-auto"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500/15 to-indigo-500/15 border border-purple-500/20 backdrop-blur-sm mb-8 sm:mb-10">
            <Eye className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="text-xs sm:text-sm text-slate-300 uppercase tracking-[0.15em] font-medium">Premium Membership Identity</span>
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
          </motion.div>

          <motion.div variants={fadeUp} className="relative mb-8 sm:mb-10">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-cyan-500/10 blur-3xl rounded-full" />
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold leading-[0.95] relative" data-testid="text-void-title">
              <span className="bg-gradient-to-r from-purple-300 via-indigo-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl">
                THE VOID
              </span>
            </h1>
          </motion.div>

          <motion.h2 variants={fadeUp} className="text-xl sm:text-2xl lg:text-3xl text-slate-400 mb-8 sm:mb-10 font-light tracking-wide">
            Step Beyond The Known
          </motion.h2>

          <motion.p variants={fadeUp} className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
            Your Void ID is more than a membership badge — it's a blockchain-verified identity anchor minted with
            DW-STAMP-1.0, hash-chained on Trust Layer v1, and recognized across the entire Trust Layer ecosystem.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-2 sm:px-0">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg shadow-2xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all group"
              onClick={() => document.getElementById('verify-section')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-verify-scroll"
            >
              <Shield className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Verify a Void ID
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/50 px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg backdrop-blur-sm transition-all"
              onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-features-scroll"
            >
              <Zap className="w-5 h-5 mr-2" />
              Explore Features
            </Button>
          </motion.div>
        </motion.section>

        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="mb-20 sm:mb-28"
        >
          <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { value: stats?.totalVoidIds?.toString() || "—", label: "Void IDs Minted", icon: Fingerprint },
              { value: stats?.totalStamps?.toString() || "—", label: "Chain Stamps", icon: Hash },
              { value: stats?.latestBlock ? `#${stats.latestBlock.blockNumber}` : "—", label: "Latest Block", icon: Layers },
              { value: stats?.totalBridgeLinks?.toString() || "—", label: "Bridge Links", icon: Link2 },
            ].map((stat, i) => (
              <GlassCard key={i} glow hover={false}>
                <div className="p-4 sm:p-5 text-center">
                  <stat.icon className="w-5 h-5 text-purple-400/60 mx-auto mb-2" />
                  <div className="text-xl sm:text-2xl font-bold text-white" data-testid={`text-stat-${stat.label.toLowerCase().replace(/\s/g, '-')}`}>{stat.value}</div>
                  <div className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
              </GlassCard>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          id="features-section"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="mb-20 sm:mb-28"
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <Badge className="mb-4 bg-purple-500/10 text-purple-300 border-purple-500/20 px-4 py-1.5">
              <Award className="w-3.5 h-3.5 mr-1.5" />
              Premium Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
              Your Void ID Unlocks
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {features.map((feature, i) => (
              <motion.div key={i} variants={fadeUp}>
                <GlassCard glow>
                  <div className="p-5 sm:p-6 h-full flex flex-col">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2" data-testid={`text-feature-${feature.title.toLowerCase().replace(/\s/g, '-')}`}>{feature.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="verify-section"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="mb-20 sm:mb-28 max-w-3xl mx-auto"
        >
          <motion.div variants={fadeUp} className="text-center mb-10">
            <Badge className="mb-4 bg-cyan-500/10 text-cyan-300 border-cyan-500/20 px-4 py-1.5">
              <Search className="w-3.5 h-3.5 mr-1.5" />
              Blockchain Verification
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent mb-3">
              Verify a Void ID
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Enter any Void ID to verify its DW-STAMP-1.0 blockchain hallmark and chain integrity
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <GlassCard glow>
              <div className="p-5 sm:p-8">
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <div className="relative flex-1">
                    <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      placeholder="V-12345678"
                      value={verifyInput}
                      onChange={(e) => setVerifyInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                      className="pl-10 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-600 h-12 text-base"
                      data-testid="input-verify-void-id"
                    />
                  </div>
                  <Button
                    onClick={handleVerify}
                    disabled={verifying || !verifyInput.trim()}
                    className="w-full sm:w-auto bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 px-6 h-12 min-w-[44px]"
                    data-testid="button-verify-stamp"
                  >
                    {verifying ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                        <Hash className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Verify
                      </>
                    )}
                  </Button>
                </div>

                {verifyResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className={`flex items-center gap-3 p-4 rounded-xl border ${
                      verifyResult.valid
                        ? 'bg-emerald-500/5 border-emerald-500/20'
                        : 'bg-red-500/5 border-red-500/20'
                    }`}>
                      {verifyResult.valid ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                      )}
                      <div>
                        <div className={`font-semibold ${verifyResult.valid ? 'text-emerald-300' : 'text-red-300'}`} data-testid="text-verify-status">
                          {verifyResult.valid ? 'Verified — Chain Intact' : 'Not Found or Invalid'}
                        </div>
                        {verifyResult.valid && verifyResult.verification && (
                          <div className="text-xs text-slate-400 mt-0.5">
                            {verifyResult.verification.issuer} · {verifyResult.verification.network} · Block #{verifyResult.verification.blockNumber}
                          </div>
                        )}
                      </div>
                    </div>

                    {verifyResult.valid && verifyResult.stamp && (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="p-3 rounded-lg bg-slate-900/50 border border-white/5">
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Void ID</div>
                            <div className="text-sm font-mono text-purple-300" data-testid="text-stamp-void-id">{verifyResult.stamp.voidId}</div>
                          </div>
                          <div className="p-3 rounded-lg bg-slate-900/50 border border-white/5">
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Block Number</div>
                            <div className="text-sm font-mono text-cyan-300" data-testid="text-stamp-block">#{verifyResult.stamp.blockNumber}</div>
                          </div>
                          <div className="p-3 rounded-lg bg-slate-900/50 border border-white/5">
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Standard</div>
                            <div className="text-sm font-mono text-indigo-300">DW-STAMP-1.0</div>
                          </div>
                          <div className="p-3 rounded-lg bg-slate-900/50 border border-white/5">
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Minted</div>
                            <div className="text-sm font-mono text-slate-300" data-testid="text-stamp-minted">
                              {new Date(verifyResult.stamp.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="p-3 rounded-lg bg-slate-900/50 border border-white/5">
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Stamp Hash (SHA-256)</div>
                            <button
                              onClick={() => copyHash(verifyResult.stamp!.stampHash)}
                              className="text-xs text-slate-500 hover:text-cyan-400 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                              data-testid="button-copy-hash"
                            >
                              <Copy className="w-3.5 h-3.5 mr-1" />
                              {copied ? "Copied!" : "Copy"}
                            </button>
                          </div>
                          <div className="text-xs font-mono text-cyan-300/80 break-all leading-relaxed" data-testid="text-stamp-hash">
                            {verifyResult.stamp.stampHash}
                          </div>
                        </div>

                        {verifyResult.stamp.previousHash && (
                          <div className="p-3 rounded-lg bg-slate-900/50 border border-white/5">
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Previous Hash (Chain Link)</div>
                            <div className="text-xs font-mono text-slate-400/80 break-all leading-relaxed">
                              {verifyResult.stamp.previousHash}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-4 pt-2">
                          {verifyResult.verification?.hashMatch && (
                            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Hash Match
                            </div>
                          )}
                          {verifyResult.verification?.chainIntegrity && (
                            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Chain Integrity
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </motion.section>

        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="mb-20 sm:mb-28 max-w-4xl mx-auto"
        >
          <motion.div variants={fadeUp} className="text-center mb-10">
            <Badge className="mb-4 bg-indigo-500/10 text-indigo-300 border-indigo-500/20 px-4 py-1.5">
              <Lock className="w-3.5 h-3.5 mr-1.5" />
              Technical Specification
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent mb-3">
              DW-STAMP-1.0 Protocol
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              How your Void ID is minted, verified, and chain-linked on Trust Layer v1
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <GlassCard glow>
              <div className="p-5 sm:p-8">
                <div className="space-y-5 sm:space-y-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-sm font-bold text-white">1</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-semibold text-white mb-1">Void ID Generation</h3>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                        Format: <code className="text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded text-xs">V-XXXXXXXX</code> where X = random digit (0-9).
                        Assigned to premium subscribers only (Stripe-verified). Uniqueness enforced at database level.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-sm font-bold text-white">2</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-semibold text-white mb-1">Hash-Chain Minting</h3>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                        Each ID is minted with a SHA-256 stamp: <code className="text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded text-xs">SHA-256(JSON.stringify(&#123; voidId, userId, block, prev, ts, issuer, network &#125;))</code>.
                        Every stamp references the previous stamp's hash, forming an immutable chain.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-sm font-bold text-white">3</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-semibold text-white mb-1">Verification</h3>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                        Any Void ID can be verified via <code className="text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded text-xs">GET /api/stamp/verify/V-XXXXXXXX</code>.
                        Returns hash match status, chain integrity confirmation, issuer, network, and mint timestamp.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-sm font-bold text-white">4</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-semibold text-white mb-1">Bridge Protocol</h3>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                        Links Signal Chat users to Trust Layer Void IDs. The bridge generates a Trust Layer ID
                        (<code className="text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded text-xs">tl-&#123;base36-ts&#125;-&#123;rand&#125;</code>)
                        and embeds the <code className="text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded text-xs">voidId</code> claim in JWT tokens for cross-ecosystem SSO.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowTechnical(!showTechnical)}
                  className="mt-6 flex items-center gap-2 text-sm text-slate-400 hover:text-purple-300 transition-colors min-h-[44px]"
                  data-testid="button-toggle-technical"
                >
                  {showTechnical ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {showTechnical ? "Hide" : "Show"} Stamp Structure
                </button>

                {showTechnical && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-white/5 overflow-x-auto"
                  >
                    <pre className="text-[10px] sm:text-xs font-mono text-slate-300 leading-relaxed whitespace-pre overflow-x-auto max-w-full" data-testid="text-stamp-structure">
{`{
  "voidId": "V-12345678",
  "userId": 42,
  "stampHash": "a3f8c2e1...64-char-sha256-hex",
  "blockNumber": 1,
  "previousHash": null,
  "payload": {
    "voidId": "V-12345678",
    "userId": 42,
    "issuer": "DarkWave Studios",
    "network": "Trust Layer v1",
    "type": "VOID_PREMIUM_HALLMARK",
    "mintedAt": "2026-02-18T20:22:06.000Z",
    "ecosystem": "darkwave",
    "standard": "DW-STAMP-1.0"
  },
  "verified": true,
  "createdAt": "2026-02-18T20:22:06.000Z"
}`}
                    </pre>
                  </motion.div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </motion.section>

        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="mb-20 sm:mb-28 max-w-4xl mx-auto"
        >
          <motion.div variants={fadeUp}>
            <GlassCard glow>
              <div className="p-5 sm:p-10 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-indigo-500" />
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                <Crown className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Ready to Enter The Void?
                </h3>
                <p className="text-slate-400 max-w-xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
                  Premium subscribers receive their Void ID automatically upon activation.
                  Your identity is minted on-chain and verified across the entire Trust Layer ecosystem.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 px-2 sm:px-0">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-8 py-6 text-base shadow-2xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all"
                    onClick={() => window.location.href = '/crowdfund'}
                    data-testid="button-become-premium"
                  >
                    <Star className="w-5 h-5 mr-2" />
                    Become Premium
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-purple-500/30 text-purple-300 hover:bg-purple-500/10 px-8 py-6 text-base"
                    onClick={() => window.location.href = '/signal-chat'}
                    data-testid="button-signal-chat"
                  >
                    <Network className="w-5 h-5 mr-2" />
                    Signal Chat
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </motion.section>

        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center py-8 border-t border-white/5"
        >
          <p className="text-xs text-slate-600">
            DW-STAMP-1.0 · Trust Layer v1 · DarkWave Studios · {new Date().getFullYear()}
          </p>
        </motion.footer>
      </div>
    </div>
  );
}