import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Shield, CheckCircle, FileText, Hash, Calendar, User, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";


const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

export default function TrustDocumentOps() {
  const [acknowledged, setAcknowledged] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [documentHash, setDocumentHash] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const DOCUMENT_ID = "DWTL-TD-001";
  const DOCUMENT_TITLE = "Operations Lead Appointment & Allocation Agreement";

  const handleAcknowledge = async () => {
    setSubmitting(true);
    try {
      const response = await apiRequest("POST", "/api/trust-documents/acknowledge", {
        documentId: DOCUMENT_ID,
        documentTitle: DOCUMENT_TITLE,
        role: "Operations Lead",
        allocation: "5,000,000 SIG",
        terms: [
          "Operations Seat on Governance Council upon reaching 1,000 members",
          "5M SIG allocation with graduated milestone vesting",
          "Continued active contribution and alignment with Signal Core principles",
          "3-month vesting per tier (50% immediate, 50% over 2 months)"
        ]
      });

      const data = await response.json();
      setDocumentHash(data.hash);
      setAcknowledged(true);
      
      toast({
        title: "Document Acknowledged",
        description: "This agreement has been recorded on the Trust Layer.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record acknowledgment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden pt-20 pb-12" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #3b82f6)" size={500} top="-5%" left="60%" />
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={400} top="40%" left="-10%" delay={3} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          {/* Official Header with Hallmark */}
          <div className="text-center mb-8">
            <div className="inline-block mb-6">
              <div className="relative">
                <img 
                  src="/shield-reference.jpg" 
                  alt="Trust Layer Official Seal" 
                  className="w-32 h-32 mx-auto object-contain drop-shadow-[0_0_30px_rgba(34,211,238,0.4)]"
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-full">
                  <span className="text-xs font-mono text-cyan-400">OFFICIAL DOCUMENT</span>
                </div>
              </div>
            </div>
            
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
              Trust Layer
            </h1>
            <p className="text-cyan-400 font-medium">Trust Document</p>
          </div>

          {/* Document Card */}
          <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-2 border-cyan-500/30 rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(34,211,238,0.15)]">
            
            {/* Document Header */}
            <div className="border-b border-white/10 pb-6 mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <FileText className="w-4 h-4" />
                <span>Document ID: <span className="font-mono text-cyan-400">{DOCUMENT_ID}</span></span>
              </div>
              <h2 className="font-display text-2xl font-bold text-white">
                {DOCUMENT_TITLE}
              </h2>
            </div>

            {/* Parties */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-muted-foreground mb-1">PARTY A (Founder)</p>
                <p className="font-semibold text-white">DarkWave Studios LLC</p>
                <p className="text-sm text-muted-foreground">Trust Layer</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-muted-foreground mb-1">PARTY B (Operations Lead)</p>
                <p className="font-semibold text-white">Kan</p>
                <p className="text-sm text-muted-foreground">Operations Lead Designate</p>
              </div>
            </div>

            {/* Terms */}
            <div className="space-y-6 mb-8">
              <div>
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  Appointment
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Party A hereby designates Party B as the <span className="text-white font-medium">Operations Lead</span> of 
                  Trust Layer, with appointment to the <span className="text-cyan-400">Operations Seat</span> on the 
                  Governance Council upon the network reaching 1,000 verified members.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Hash className="w-5 h-5 text-purple-400" />
                  Token Allocation
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  Party B shall receive a total allocation of <span className="text-amber-400 font-bold">5,000,000 SIG</span> (0.5% of total supply), 
                  subject to graduated milestone-based vesting:
                </p>
                <div className="bg-black/30 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">$1M Market Cap</span>
                    <span className="text-white">500,000 SIG</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">$2.5M Market Cap</span>
                    <span className="text-white">+750,000 SIG</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">$5M Market Cap</span>
                    <span className="text-white">+1,000,000 SIG</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">$7.5M Market Cap</span>
                    <span className="text-white">+1,250,000 SIG</span>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-2">
                    <span className="text-muted-foreground">$10M Market Cap</span>
                    <span className="text-amber-400 font-bold">+1,500,000 SIG (Complete)</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Each tier vests over 3 months (50% immediately upon milestone, 50% over following 2 months).
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-400" />
                  Party B Responsibilities
                </h3>
                <p className="text-muted-foreground text-sm mb-3">
                  This allocation is <span className="text-white font-medium">not guaranteed</span>. 
                  It is contingent upon Party B fulfilling the following expectations:
                </p>
                <ul className="text-muted-foreground text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-1">•</span>
                    <span><span className="text-white">Active & Consistent Contribution</span> - Regular, meaningful work toward Trust Layer development and operations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-1">•</span>
                    <span><span className="text-white">Loyalty & Alignment</span> - Commitment to the project's success and alignment with Signal Core principles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-1">•</span>
                    <span><span className="text-white">Effectiveness</span> - Delivering results, not just effort. Quality of contribution matters.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-1">•</span>
                    <span><span className="text-white">Good Faith Communication</span> - Transparent, honest communication. No ghosting, no hidden agendas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-1">•</span>
                    <span><span className="text-white">Long-term Commitment</span> - This is a building journey, not a quick payout. Expect years of work.</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  Mutual Understanding
                </h3>
                <ul className="text-muted-foreground text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">•</span>
                    <span>This is a <span className="text-white">trust agreement</span>, not a legal employment contract. It operates on mutual good faith.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">•</span>
                    <span>Party A (Founder) has equal responsibilities - if the project isn't being built, there's nothing for anyone.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">•</span>
                    <span>Allocation can be <span className="text-red-400">revoked or reduced</span> if Party B abandons the project, acts against its interests, or fails to contribute meaningfully.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">•</span>
                    <span>Success is <span className="text-white">not guaranteed</span>. Market conditions, adoption, and execution all affect outcomes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">•</span>
                    <span>Both parties acknowledge they are building something together with shared risk and shared reward.</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-400" />
                  Verification
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Upon acknowledgment, this document will be cryptographically hashed and recorded on the 
                  Trust Layer. The document hash can be verified at any time at <span className="text-cyan-400 font-mono">/verify</span>.
                </p>
              </div>
            </div>

            {/* Signature Section */}
            <div className="border-t border-white/10 pt-6">
              {!acknowledged ? (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    By clicking "Acknowledge & Sign" below, you confirm that you have read and agree to 
                    the terms outlined in this Trust Document.
                  </p>
                  <Button
                    size="lg"
                    onClick={handleAcknowledge}
                    disabled={submitting}
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 min-w-[200px]"
                    data-testid="button-acknowledge-trust-doc"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Recording...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Acknowledge & Sign
                      </span>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-medium">Document Acknowledged</span>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-black/30 border border-white/10">
                    <p className="text-xs text-muted-foreground mb-1">Document Hash</p>
                    <p className="font-mono text-cyan-400 text-sm break-all">{documentHash}</p>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    This agreement has been recorded on the Trust Layer and can be verified at{" "}
                    <a href="/verify" className="text-cyan-400 hover:underline">/verify</a>
                  </p>

                  <Button
                    variant="outline"
                    onClick={() => setLocation("/developer")}
                    className="border-cyan-500/30 hover:bg-cyan-500/10"
                    data-testid="button-return-portal"
                  >
                    Return to Developer Portal
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-muted-foreground mt-8">
            This is Trust Document #{DOCUMENT_ID}, the first official trust agreement issued by Trust Layer.
          </p>
        </motion.div>
      </main>

      
    </div>
  );
}
