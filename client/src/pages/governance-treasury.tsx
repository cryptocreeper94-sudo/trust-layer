import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { 
  Shield, 
  Users, 
  Key, 
  Lock,
  Copy,
  Check,
  Crown,
  Settings,
  Vote,
  Scale,
  Eye,
  Wallet,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Fingerprint
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import shieldImage from "/shield-reference.jpg";

interface CouncilSeat {
  id: string;
  title: string;
  role: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  address: string | null;
  holder: string;
  status: "active" | "pending" | "vacant";
}

const TREASURY_ADDRESS = "DW1TreasuryMultiSig7a3f8c2e1b9d4a6f5c8e3b2a";
const SIGNATURE_THRESHOLD = 3;
const TOTAL_SIGNERS = 5;

export default function GovernanceTreasury() {
  const { toast } = useToast();
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const [councilSeats] = useState<CouncilSeat[]>([
    {
      id: "founder",
      title: "Founder Seat",
      role: "Vision & Core Protection",
      description: "Permanent seat during active development. Veto power on Signal Core violations only. Cannot unilaterally move treasury.",
      icon: <Crown className="w-5 h-5" />,
      color: "purple",
      address: "DW1Founder9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3",
      holder: "Crypto Creeper",
      status: "active"
    },
    {
      id: "operations",
      title: "Operations Seat",
      role: "Day-to-Day Management",
      description: "Executes approved proposals. Manages technical operations. Subject to community oversight.",
      icon: <Settings className="w-5 h-5" />,
      color: "cyan",
      address: null,
      holder: "To Be Appointed",
      status: "pending"
    },
    {
      id: "community",
      title: "Community Seat",
      role: "Member Representation",
      description: "Elected by verified members. Advocates for member interests. Subject to term limits and recall.",
      icon: <Users className="w-5 h-5" />,
      color: "green",
      address: null,
      holder: "To Be Elected",
      status: "vacant"
    },
    {
      id: "integrity",
      title: "Integrity Seat",
      role: "Ethical Oversight",
      description: "Dispute resolution authority. Whistleblower protection. Appointed for demonstrated service.",
      icon: <Scale className="w-5 h-5" />,
      color: "amber",
      address: null,
      holder: "To Be Appointed",
      status: "vacant"
    },
    {
      id: "guardian",
      title: "Guardian Seat",
      role: "Fresh Perspective",
      description: "Rotating terms. Full voting rights. Brings new ideas and external accountability.",
      icon: <Eye className="w-5 h-5" />,
      color: "pink",
      address: null,
      holder: "Future Implementation",
      status: "vacant"
    }
  ]);

  const activeSeats = councilSeats.filter(s => s.status === "active").length;
  const pendingSeats = councilSeats.filter(s => s.status === "pending").length;

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
    toast({ title: "Address Copied", description: "Wallet address copied to clipboard" });
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      purple: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30" },
      cyan: { bg: "bg-cyan-500/20", text: "text-cyan-400", border: "border-cyan-500/30" },
      green: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30" },
      amber: { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/30" },
      pink: { bg: "bg-pink-500/20", text: "text-pink-400", border: "border-pink-500/30" },
    };
    return colors[color] || colors.cyan;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle2 className="w-3 h-3 mr-1" /> Active</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30"><AlertCircle className="w-3 h-3 mr-1" /> Pending</Badge>;
      default:
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30"><Lock className="w-3 h-3 mr-1" /> Vacant</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl"
          style={{ width: 600, height: 600, top: "5%", right: "-10%" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute rounded-full bg-gradient-to-r from-cyan-500/15 to-blue-500/15 blur-3xl"
          style={{ width: 500, height: 500, bottom: "20%", left: "-5%" }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="relative inline-block mb-6">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full blur-xl opacity-40"
              animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="relative w-24 h-28 mx-auto flex items-center justify-center">
              <img 
                src={shieldImage} 
                alt="Trust Layer Shield" 
                className="w-full h-full object-contain"
                style={{ 
                  filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.5))'
                }}
              />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Governance{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Treasury
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-6">
            Multi-signature protection ensures no single person can move community funds.
            {SIGNATURE_THRESHOLD} of {TOTAL_SIGNERS} council members must approve any transaction.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              <Lock className="w-3 h-3 mr-1" />
              {SIGNATURE_THRESHOLD}-of-{TOTAL_SIGNERS} Multi-Sig
            </Badge>
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              <Shield className="w-3 h-3 mr-1" />
              24-Hour Timelock
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Eye className="w-3 h-3 mr-1" />
              Fully Transparent
            </Badge>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <GlassCard glow className="p-6 sm:p-8 border-purple-500/30">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                  <Wallet className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Treasury Wallet Address</p>
                  <div className="flex items-center gap-2">
                    <code className="text-lg font-mono text-cyan-400" data-testid="text-treasury-address">
                      {TREASURY_ADDRESS}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyAddress(TREASURY_ADDRESS)}
                      className="text-slate-400 hover:text-white"
                      data-testid="button-copy-treasury"
                    >
                      {copiedAddress === TREASURY_ADDRESS ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="text-center px-4">
                  <p className="text-3xl font-bold text-white">500M</p>
                  <p className="text-xs text-slate-400">SIG Reserved</p>
                </div>
                <div className="h-10 w-px bg-white/10 hidden sm:block" />
                <div className="text-center px-4">
                  <p className="text-3xl font-bold text-green-400">{activeSeats}</p>
                  <p className="text-xs text-slate-400">Active Signers</p>
                </div>
                <div className="h-10 w-px bg-white/10 hidden sm:block" />
                <div className="text-center px-4">
                  <p className="text-3xl font-bold text-amber-400">{pendingSeats}</p>
                  <p className="text-xs text-slate-400">Pending</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Vote className="w-6 h-6 text-purple-400" />
            Governance Council Seats
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {councilSeats.map((seat, index) => {
              const colors = getColorClasses(seat.color);
              return (
                <motion.div
                  key={seat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <GlassCard className={`p-5 h-full ${colors.border}`} data-testid={`card-seat-${seat.id}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center`}>
                        <span className={colors.text}>{seat.icon}</span>
                      </div>
                      {getStatusBadge(seat.status)}
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1">{seat.title}</h3>
                    <p className={`text-sm ${colors.text} mb-2`}>{seat.role}</p>
                    <p className="text-xs text-slate-400 mb-4">{seat.description}</p>

                    <div className="pt-4 border-t border-white/10">
                      <p className="text-xs text-slate-500 mb-1">Current Holder</p>
                      <p className="text-sm text-white font-medium mb-2">{seat.holder}</p>
                      
                      {seat.address ? (
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono text-cyan-400 truncate flex-1">
                            {seat.address.slice(0, 12)}...{seat.address.slice(-8)}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyAddress(seat.address!)}
                            className="text-slate-400 hover:text-white p-1 h-auto"
                            data-testid={`button-copy-${seat.id}`}
                          >
                            {copiedAddress === seat.address ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                          </Button>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic">No wallet assigned</p>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10"
        >
          <GlassCard className="p-6 border-amber-500/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                <Key className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">How Multi-Sig Protection Works</h3>
                <div className="space-y-3 text-sm text-slate-300">
                  <p>
                    <strong className="text-white">1. Proposal Submission:</strong> Any council member can propose a treasury transaction (transfer, allocation change, etc.)
                  </p>
                  <p>
                    <strong className="text-white">2. Signature Collection:</strong> The proposal requires {SIGNATURE_THRESHOLD} of {TOTAL_SIGNERS} council members to sign. Each member reviews independently.
                  </p>
                  <p>
                    <strong className="text-white">3. Timelock Period:</strong> After threshold is met, a 24-hour delay allows the community to review and raise concerns.
                  </p>
                  <p>
                    <strong className="text-white">4. Execution:</strong> After timelock, the transaction executes automatically. All actions are recorded on-chain permanently.
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Link href="/signal-core">
            <GlassCard className="p-5 cursor-pointer hover:border-purple-500/50 transition-colors group" data-testid="link-signal-core">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                  <Fingerprint className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white group-hover:text-purple-400 transition-colors">Signal Core</h3>
                  <p className="text-sm text-slate-400">The immutable principles that govern us</p>
                </div>
                <ExternalLink className="w-5 h-5 text-slate-500 group-hover:text-purple-400 transition-colors" />
              </div>
            </GlassCard>
          </Link>

          <Link href="/governance-charter">
            <GlassCard className="p-5 cursor-pointer hover:border-cyan-500/50 transition-colors group" data-testid="link-governance-charter">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                  <Scale className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors">Governance Charter</h3>
                  <p className="text-sm text-slate-400">The path to community autonomy</p>
                </div>
                <ExternalLink className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </div>
            </GlassCard>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-slate-500">
            Treasury address verified on-chain. View transactions at{" "}
            <Link href="/explorer" className="text-cyan-400 hover:underline">dwsc.io/explorer</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
