import { useState } from "react";
import { motion } from "framer-motion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Shield, Users, CheckCircle, XCircle, Clock, Key, 
  Plus, Trash2, Vote, FileCheck, AlertTriangle, ChevronDown,
  Lock, Unlock, ArrowRight, RefreshCw, Eye, Copy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Validator {
  id: string;
  address: string;
  name: string;
  status: "active" | "inactive" | "pending";
  votes: number;
  lastActive: string;
  addedAt: string;
}

interface PendingOperation {
  id: string;
  type: "mint" | "burn" | "add_validator" | "remove_validator" | "update_threshold";
  description: string;
  requiredSignatures: number;
  currentSignatures: number;
  signers: string[];
  amount?: string;
  recipient?: string;
  createdAt: string;
  expiresAt: string;
  status: "pending" | "executed" | "expired" | "cancelled";
}

const mockValidators: Validator[] = [
  {
    id: "v1",
    address: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    name: "Founders Validator",
    status: "active",
    votes: 156,
    lastActive: "2 minutes ago",
    addedAt: "Feb 14, 2025"
  },
  {
    id: "v2",
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    name: "DarkWave DAO",
    status: "active",
    votes: 89,
    lastActive: "15 minutes ago",
    addedAt: "Mar 1, 2025"
  },
  {
    id: "v3",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    name: "Security Council",
    status: "active",
    votes: 67,
    lastActive: "1 hour ago",
    addedAt: "Mar 15, 2025"
  },
  {
    id: "v4",
    address: "0x6B175474E89094C44Da98b954EescdCD d3F00",
    name: "Community Rep #1",
    status: "pending",
    votes: 0,
    lastActive: "Never",
    addedAt: "Pending approval"
  }
];

const mockPendingOps: PendingOperation[] = [
  {
    id: "op1",
    type: "mint",
    description: "Mint 50,000 wDWC to 0x742d...8f44",
    requiredSignatures: 2,
    currentSignatures: 1,
    signers: ["Founders Validator"],
    amount: "50,000 wDWC",
    recipient: "0x742d35Cc6634C0532925a3b844Bc454e4438f44",
    createdAt: "10 minutes ago",
    expiresAt: "23 hours",
    status: "pending"
  },
  {
    id: "op2",
    type: "add_validator",
    description: "Add Community Rep #1 to validator set",
    requiredSignatures: 2,
    currentSignatures: 2,
    signers: ["Founders Validator", "DarkWave DAO"],
    createdAt: "2 hours ago",
    expiresAt: "22 hours",
    status: "pending"
  },
  {
    id: "op3",
    type: "burn",
    description: "Process burn request for 25,000 wDWC",
    requiredSignatures: 2,
    currentSignatures: 0,
    signers: [],
    amount: "25,000 wDWC",
    recipient: "DW1abc...xyz",
    createdAt: "30 minutes ago",
    expiresAt: "23.5 hours",
    status: "pending"
  }
];

export default function MultiSigPage() {
  const { toast } = useToast();
  const [validators] = useState<Validator[]>(mockValidators);
  const [pendingOps] = useState<PendingOperation[]>(mockPendingOps);
  const [threshold, setThreshold] = useState(2);
  const [sectionsOpen, setSectionsOpen] = useState({
    validators: true,
    pending: true,
    settings: false
  });

  const activeValidators = validators.filter(v => v.status === "active").length;

  const handleSign = (opId: string) => {
    toast({
      title: "Signature Submitted",
      description: "Your signature has been recorded. Waiting for more signatures."
    });
  };

  const handleReject = (opId: string) => {
    toast({
      title: "Operation Rejected",
      description: "You have voted to reject this operation."
    });
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address Copied",
      description: "Address copied to clipboard"
    });
  };

  const getOpIcon = (type: string) => {
    switch (type) {
      case "mint": return <Plus className="h-4 w-4 text-green-400" />;
      case "burn": return <Trash2 className="h-4 w-4 text-red-400" />;
      case "add_validator": return <Users className="h-4 w-4 text-blue-400" />;
      case "remove_validator": return <XCircle className="h-4 w-4 text-orange-400" />;
      case "update_threshold": return <Key className="h-4 w-4 text-purple-400" />;
      default: return <FileCheck className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30">
              <Shield className="h-8 w-8 text-amber-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Multi-Sig Validator Committee</h1>
              <p className="text-slate-400">Decentralized bridge security with multi-signature approval</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
          >
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <Users className="h-4 w-4" />
              Active Validators
            </div>
            <div className="text-2xl font-bold text-white">{activeValidators} / {validators.length}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
          >
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <Key className="h-4 w-4" />
              Signature Threshold
            </div>
            <div className="text-2xl font-bold text-white">{threshold} of {activeValidators}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
          >
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <Clock className="h-4 w-4" />
              Pending Operations
            </div>
            <div className="text-2xl font-bold text-amber-400">{pendingOps.filter(o => o.status === "pending").length}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
          >
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <CheckCircle className="h-4 w-4" />
              Total Votes Cast
            </div>
            <div className="text-2xl font-bold text-green-400">{validators.reduce((sum, v) => sum + v.votes, 0)}</div>
          </motion.div>
        </div>

        <Collapsible 
          open={sectionsOpen.pending} 
          onOpenChange={(open) => setSectionsOpen(s => ({...s, pending: open}))}
          className="mb-6"
        >
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-600/10 border border-amber-500/30 hover:border-amber-400/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Vote className="h-5 w-5 text-amber-400" />
                <span className="text-lg font-semibold text-white">Pending Operations</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-sm">
                  {pendingOps.filter(o => o.status === "pending").length} awaiting
                </span>
              </div>
              <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${sectionsOpen.pending ? 'rotate-180' : ''}`} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-4 space-y-4">
              {pendingOps.filter(o => o.status === "pending").map((op) => (
                <motion.div
                  key={op.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
                  data-testid={`pending-op-${op.id}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-slate-700/50">
                        {getOpIcon(op.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{op.description}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-slate-400">
                          <span>Created {op.createdAt}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-amber-400">Expires in {op.expiresAt}</span>
                        </div>
                        {op.amount && (
                          <div className="flex items-center gap-2 mt-2 text-sm">
                            <span className="text-slate-400">Amount:</span>
                            <span className="text-white font-medium">{op.amount}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right mr-4">
                        <div className="text-sm text-slate-400">Signatures</div>
                        <div className={`text-lg font-bold ${op.currentSignatures >= op.requiredSignatures ? 'text-green-400' : 'text-amber-400'}`}>
                          {op.currentSignatures} / {op.requiredSignatures}
                        </div>
                      </div>
                      <button
                        onClick={() => handleSign(op.id)}
                        className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors flex items-center gap-2"
                        data-testid={`sign-op-${op.id}`}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Sign
                      </button>
                      <button
                        onClick={() => handleReject(op.id)}
                        className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors flex items-center gap-2"
                        data-testid={`reject-op-${op.id}`}
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  </div>

                  {op.signers.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-700/50">
                      <div className="text-sm text-slate-400 mb-2">Signed by:</div>
                      <div className="flex flex-wrap gap-2">
                        {op.signers.map((signer, idx) => (
                          <span key={idx} className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-sm">
                            {signer}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible 
          open={sectionsOpen.validators} 
          onOpenChange={(open) => setSectionsOpen(s => ({...s, validators: open}))}
          className="mb-6"
        >
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-600/10 border border-blue-500/30 hover:border-blue-400/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-400" />
                <span className="text-lg font-semibold text-white">Validator Committee</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-sm">
                  {activeValidators} active
                </span>
              </div>
              <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${sectionsOpen.validators ? 'rotate-180' : ''}`} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-4 space-y-3">
              {validators.map((validator) => (
                <motion.div
                  key={validator.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition-colors"
                  data-testid={`validator-${validator.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        validator.status === 'active' ? 'bg-green-400 animate-pulse' :
                        validator.status === 'pending' ? 'bg-amber-400' : 'bg-slate-500'
                      }`} />
                      <div>
                        <h3 className="font-semibold text-white">{validator.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <span className="font-mono">{validator.address.slice(0, 6)}...{validator.address.slice(-4)}</span>
                          <button onClick={() => copyAddress(validator.address)} className="hover:text-white">
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="text-slate-400">Votes</div>
                        <div className="text-white font-semibold">{validator.votes}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-slate-400">Last Active</div>
                        <div className="text-white">{validator.lastActive}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-slate-400">Added</div>
                        <div className="text-white">{validator.addedAt}</div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        validator.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        validator.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {validator.status.charAt(0).toUpperCase() + validator.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible 
          open={sectionsOpen.settings} 
          onOpenChange={(open) => setSectionsOpen(s => ({...s, settings: open}))}
        >
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-600/10 border border-purple-500/30 hover:border-purple-400/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-purple-400" />
                <span className="text-lg font-semibold text-white">Committee Settings</span>
              </div>
              <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${sectionsOpen.settings ? 'rotate-180' : ''}`} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-4 p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Signature Threshold</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={threshold}
                      onChange={(e) => setThreshold(parseInt(e.target.value) || 1)}
                      min={1}
                      max={activeValidators}
                      className="w-24 px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white text-center"
                      data-testid="threshold-input"
                    />
                    <span className="text-slate-400">of {activeValidators} validators required</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Changing the threshold requires {threshold} validator signatures
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Operation Expiry</label>
                  <select className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white">
                    <option value="24">24 hours</option>
                    <option value="48">48 hours</option>
                    <option value="72">72 hours</option>
                    <option value="168">1 week</option>
                  </select>
                  <p className="text-xs text-slate-500 mt-2">
                    Operations expire if not fully signed within this period
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white">Emergency Pause</h4>
                    <p className="text-sm text-slate-400">Halt all bridge operations in case of emergency</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Emergency Pause
                  </button>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
