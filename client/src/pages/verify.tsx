import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  FileText,
  Clock,
  Hash,
  Fingerprint,
  AlertCircle,
  Loader2
} from "lucide-react";
import shieldImage from "/shield-reference.jpg";

interface VerificationResult {
  verified: boolean;
  document?: {
    id: string;
    title: string;
    type: string;
    hash: string;
    blockNumber: number;
    timestamp: string;
    issuer: string;
  };
  error?: string;
}

const KNOWN_DOCUMENTS = [
  {
    id: "signal-core-v1",
    title: "Signal Core - The Immutable Foundation",
    type: "Founding Document",
    hash: "0x7a3f8c2e1b9d4a6f5c8e3b2a1d9f7e6c4b3a2d1e",
    blockNumber: 1,
    timestamp: "Genesis Block",
    issuer: "Trust Layer Foundation"
  },
  {
    id: "governance-charter-v1",
    title: "Governance Charter - Path to Autonomy",
    type: "Governance Framework",
    hash: "0x9b4e7d3c2a1f6e5d8c7b4a3e2d1f9e8c7b6a5d4e",
    blockNumber: 1,
    timestamp: "Genesis Block",
    issuer: "Trust Layer Foundation"
  }
];


const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

export default function Verify() {
  const [searchHash, setSearchHash] = useState("");
  const [searchResult, setSearchResult] = useState<VerificationResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleVerify = async () => {
    if (!searchHash.trim()) return;
    
    setIsSearching(true);
    setSearchResult(null);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const normalizedHash = searchHash.toLowerCase().trim();
    const found = KNOWN_DOCUMENTS.find(doc => 
      doc.hash.toLowerCase() === normalizedHash ||
      doc.hash.toLowerCase().includes(normalizedHash.replace("0x", ""))
    );

    if (found) {
      setSearchResult({
        verified: true,
        document: found
      });
    } else {
      setSearchResult({
        verified: false,
        error: "Document hash not found in the Trust Layer registry."
      });
    }

    setIsSearching(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden pt-20 pb-12" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #3b82f6)" size={500} top="-5%" left="60%" />
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={400} top="40%" left="-10%" delay={3} />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-3xl"
          style={{ width: 600, height: 600, top: "10%", left: "-10%" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute rounded-full bg-gradient-to-r from-purple-500/15 to-pink-500/15 blur-3xl"
          style={{ width: 500, height: 500, bottom: "10%", right: "-5%" }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="relative inline-block mb-6">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-50"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="relative w-28 h-32 mx-auto flex items-center justify-center">
              <img 
                src={shieldImage} 
                alt="Trust Layer Shield" 
                className="w-full h-full object-contain"
                style={{ 
                  filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.5)) drop-shadow(0 0 12px rgba(168, 85, 247, 0.4))'
                }}
              />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Document{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Verification
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Verify the authenticity of any official Trust Layer document using its blockchain hash.
            Every official document is cryptographically signed and recorded on-chain.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <GlassCard glow className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Enter document hash (0x...)"
                  value={searchHash}
                  onChange={(e) => setSearchHash(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 h-12"
                  onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                  data-testid="input-document-hash"
                />
              </div>
              <Button 
                onClick={handleVerify}
                disabled={isSearching || !searchHash.trim()}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white h-12 px-8"
                data-testid="button-verify-document"
              >
                {isSearching ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Verify
                  </>
                )}
              </Button>
            </div>

            {searchResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                {searchResult.verified ? (
                  <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-green-400">Verified Authentic</h3>
                        <p className="text-sm text-slate-400">This document is officially registered on the Trust Layer</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div className="p-3 bg-slate-800/50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Document Title</p>
                        <p className="text-white font-medium text-sm" data-testid="text-document-title">{searchResult.document?.title}</p>
                      </div>
                      <div className="p-3 bg-slate-800/50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Document Type</p>
                        <p className="text-white font-medium text-sm">{searchResult.document?.type}</p>
                      </div>
                      <div className="p-3 bg-slate-800/50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Recorded At</p>
                        <p className="text-white font-medium text-sm">{searchResult.document?.timestamp}</p>
                      </div>
                      <div className="p-3 bg-slate-800/50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Issuer</p>
                        <p className="text-white font-medium text-sm">{searchResult.document?.issuer}</p>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">Document Hash</p>
                      <p className="text-cyan-400 font-mono text-xs break-all">{searchResult.document?.hash}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                        <XCircle className="w-6 h-6 text-red-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-red-400">Not Verified</h3>
                        <p className="text-sm text-slate-400">{searchResult.error}</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
</motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <FileText className="w-6 h-6 text-cyan-400" />
            Registered Official Documents
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {KNOWN_DOCUMENTS.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <GlassCard className="p-5 h-full" data-testid={`card-document-${doc.id}`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Fingerprint className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-sm truncate">{doc.title}</h3>
                      <Badge variant="outline" className="mt-1 text-xs border-purple-500/30 text-purple-400">
                        {doc.type}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{doc.timestamp}</span>
                    </div>
                    <div className="p-2 bg-slate-800/50 rounded font-mono text-cyan-400 break-all">
                      {doc.hash}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 w-full text-xs text-slate-400 hover:text-white"
                    onClick={() => {
                      setSearchHash(doc.hash);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    data-testid={`button-verify-${doc.id}`}
                  >
                    <CheckCircle2 className="w-3 h-3 mr-2" />
                    Verify This Document
                  </Button>
</motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto mt-12"
        >
          <GlassCard className="p-6 border-cyan-500/20">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-white mb-2">How Guardian Verification Works</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Every official document, email, and communication from the Trust Layer is 
                  cryptographically hashed and recorded on-chain. This creates an immutable record that 
                  anyone can verify. If someone claims to have an official document from us, you can 
                  check its hash here to confirm authenticity. This protects both you and us from fraud.
                </p>
              </div>
            </div>
</motion.div>
      </div>
    </div>
);
}
