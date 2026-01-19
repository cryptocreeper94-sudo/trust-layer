import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { 
  Download, 
  Share2, 
  QrCode, 
  Shield, 
  BadgeCheck,
  Copy,
  Check,
  Sparkles,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";

interface TrustCardProps {
  trustNumber: string;
  displayName: string;
  memberType: "individual" | "business";
  memberTier: string;
  qrCodeSvg?: string;
  totalTransactions?: number;
  rewardPoints?: number;
  verifiedAt?: string;
  organizationName?: string;
}

export function TrustCard({
  trustNumber,
  displayName,
  memberType,
  memberTier,
  qrCodeSvg,
  totalTransactions = 0,
  rewardPoints = 0,
  verifiedAt,
  organizationName,
}: TrustCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const tierColors: Record<string, string> = {
    pioneer: "from-green-500 to-emerald-500",
    guardian: "from-purple-500 to-violet-500",
    startup: "from-blue-500 to-cyan-500",
    professional: "from-purple-500 to-pink-500",
    enterprise: "from-amber-500 to-orange-500",
  };

  const tierGradient = tierColors[memberTier.toLowerCase()] || tierColors.pioneer;

  const copyTrustNumber = async () => {
    await navigator.clipboard.writeText(trustNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied!", description: "Trust Number copied to clipboard" });
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;

    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });
      
      const link = document.createElement("a");
      link.download = `darkwave-trust-card-${trustNumber}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      
      toast({ title: "Downloaded!", description: "Your Trust Card has been saved" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to download card", variant: "destructive" });
    }
  };

  const shareCard = async () => {
    const shareData = {
      title: "My DarkWave Trust Card",
      text: `I'm a verified member of the DarkWave Trust Layer! Trust Number: ${trustNumber}`,
      url: `${window.location.origin}/verify/${trustNumber}`,
    };

    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(shareData.url);
      toast({ title: "Link Copied!", description: "Share link copied to clipboard" });
    }
  };

  return (
    <div className="space-y-4">
      <motion.div
        ref={cardRef}
        className="relative w-full max-w-md mx-auto"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        data-testid="trust-card"
      >
        <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 shadow-2xl aspect-[1.6/1]">
          <motion.div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              background: `linear-gradient(
                ${isHovered ? '135deg' : '45deg'},
                transparent 0%,
                rgba(168, 85, 247, 0.4) 25%,
                rgba(236, 72, 153, 0.4) 50%,
                rgba(59, 130, 246, 0.4) 75%,
                transparent 100%
              )`,
              backgroundSize: "200% 200%",
            }}
            animate={{
              backgroundPosition: isHovered ? ["0% 0%", "100% 100%"] : "0% 0%",
            }}
            transition={{ duration: 2, repeat: isHovered ? Infinity : 0, ease: "linear" }}
          />

          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-50 blur-sm" />

          <div className="relative z-10 p-6 h-full flex flex-col bg-gradient-to-br from-slate-900/95 via-purple-950/95 to-slate-900/95 rounded-2xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src={darkwaveLogo} alt="DarkWave" className="w-10 h-10 drop-shadow-lg" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-purple-400 font-medium">
                    DarkWave Trust Layer
                  </div>
                  <div className="text-xs text-white/60">Verified Member</div>
                </div>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r ${tierGradient} bg-opacity-20`}>
                <BadgeCheck className="w-3 h-3 text-white" />
                <span className="text-[10px] font-bold text-white capitalize">{memberTier}</span>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-lg font-bold text-white truncate max-w-[200px]">
                  {displayName}
                </div>
                {organizationName && (
                  <div className="text-sm text-white/60 truncate max-w-[200px]">
                    {organizationName}
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <div className="text-[10px] text-white/40 uppercase">Trust Number</div>
                </div>
                <motion.div 
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10"
                  animate={{ 
                    boxShadow: isHovered 
                      ? ["0 0 10px rgba(168, 85, 247, 0.3)", "0 0 20px rgba(236, 72, 153, 0.3)", "0 0 10px rgba(168, 85, 247, 0.3)"]
                      : "0 0 10px rgba(168, 85, 247, 0.2)"
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-sm font-mono font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {trustNumber}
                  </span>
                </motion.div>
              </div>

              {qrCodeSvg && (
                <div className="w-20 h-20 rounded-lg bg-white p-1.5 shrink-0">
                  <img 
                    src={`data:image/svg+xml;base64,${btoa(qrCodeSvg)}`}
                    alt="Verification QR"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-xs font-bold text-white">{totalTransactions}</div>
                  <div className="text-[10px] text-white/40">Transactions</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-purple-400">{rewardPoints}</div>
                  <div className="text-[10px] text-white/40">Rewards</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {verifiedAt && (
                  <>
                    <Shield className="w-3 h-3 text-green-400" />
                    <span className="text-[10px] text-green-400">Verified</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-2">
          <div className="absolute inset-x-8 h-4 bg-gradient-to-b from-purple-500/20 to-transparent rounded-b-full blur-md" />
        </div>
      </motion.div>

      <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={copyTrustNumber}
          className="flex-1 border-white/10 hover:bg-white/5"
          data-testid="button-copy-trust-number"
        >
          {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
          {copied ? "Copied" : "Copy Number"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={downloadCard}
          className="flex-1 border-white/10 hover:bg-white/5"
          data-testid="button-download-card"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={shareCard}
          className="flex-1 border-white/10 hover:bg-white/5"
          data-testid="button-share-card"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
}

export function TrustCardPlaceholder() {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-purple-950/50 to-slate-900 aspect-[1.6/1] p-6">
        <div className="h-full flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4">
            <Award className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="font-bold text-lg mb-2">Get Your Trust Card</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Join the Trust Layer to receive your unique Trust Number
          </p>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500">
            <Sparkles className="w-4 h-4 mr-2" />
            Activate Membership
          </Button>
        </div>
      </div>
    </div>
  );
}