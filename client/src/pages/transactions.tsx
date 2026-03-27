import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { 
  History, ArrowUpRight, ArrowDownLeft, RefreshCw,
  Filter, Search, ChevronDown, ExternalLink, Clock, CheckCircle2, Download,
  Shield, Fingerprint, Copy, Check } from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formatAmount = (amount: string) => {
  try {
    const num = BigInt(amount);
    const divisor = BigInt("1000000000000000000");
    return (Number(num) / Number(divisor)).toLocaleString(undefined, { maximumFractionDigits: 4 });
  } catch {
    return "0";
  }
};

const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const truncateHash = (hash: string) => {
  if (!hash) return "";
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
};

const SAMPLE_TRANSACTIONS = [
  { id: "1", type: "send", token: "SIG", amount: "1000000000000000000000", to: "0x1234...5678", from: "", hash: "0xabc123def456789012345678901234567890abcdef1234567890abcdef123456", status: "confirmed", timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: "2", type: "receive", token: "SIG", amount: "500000000000000000000", to: "", from: "0xabcd...efgh", hash: "0xdef456abc789012345678901234567890abcdef1234567890abcdef123456789", status: "confirmed", timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: "3", type: "swap", token: "SIG → USDC", amount: "2000000000000000000000", to: "", from: "", hash: "0x789abc123def456789012345678901234567890abcdef1234567890abcdef12", status: "confirmed", timestamp: new Date(Date.now() - 14400000).toISOString() },
  { id: "4", type: "stake", token: "SIG", amount: "5000000000000000000000", to: "", from: "", hash: "0x456def789abc123456789012345678901234567890abcdef1234567890abcdef", status: "confirmed", timestamp: new Date(Date.now() - 28800000).toISOString() },
  { id: "5", type: "claim", token: "SIG", amount: "125000000000000000000", to: "", from: "", hash: "0x123abc456def789012345678901234567890abcdef1234567890abcdef123456", status: "confirmed", timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: "6", type: "send", token: "wETH", amount: "100000000000000000", to: "0x9876...5432", from: "", hash: "0xfed987654321abcdef1234567890abcdef1234567890abcdef1234567890abcd", status: "pending", timestamp: new Date(Date.now() - 300000).toISOString() },
  { id: "7", type: "bridge", token: "SIG → wSIG", amount: "1000000000000000000000", to: "", from: "", hash: "0x321fed654987cba321098765432109876543210fedcba9876543210fedcba98", status: "confirmed", timestamp: new Date(Date.now() - 172800000).toISOString() },
];

const TX_TYPE_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
  send: { icon: ArrowUpRight, color: "text-red-400", label: "Sent" },
  receive: { icon: ArrowDownLeft, color: "text-green-400", label: "Received" },
  swap: { icon: RefreshCw, color: "text-primary", label: "Swap" },
  stake: { icon: () => <span className="text-xs">🔒</span>, color: "text-purple-400", label: "Stake" },
  claim: { icon: () => <span className="text-xs">🎁</span>, color: "text-green-400", label: "Claim" },
  bridge: { icon: () => <span className="text-xs">🌉</span>, color: "text-purple-400", label: "Bridge" },
};

const STAMP_CATEGORY_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  "presale-purchase": { label: "Presale", color: "text-emerald-400", icon: "🚀" },
  "crowdfund-donation": { label: "Crowdfund", color: "text-green-400", icon: "💚" },
  "credits-purchase": { label: "Credits", color: "text-blue-400", icon: "⚡" },
  "guardian-certification": { label: "Guardian Cert", color: "text-red-400", icon: "🛡️" },
  "subscription-activated": { label: "Subscription", color: "text-purple-400", icon: "⭐" },
  "shells-purchase": { label: "Shells", color: "text-purple-400", icon: "🐚" },
  "domain-registration": { label: "Domain", color: "text-cyan-400", icon: "🌐" },
  "nft-mint": { label: "NFT Mint", color: "text-pink-400", icon: "🖼️" },
  "business-approved": { label: "Business", color: "text-violet-400", icon: "🏢" },
  "member-trust-card": { label: "Trust Card", color: "text-teal-400", icon: "💳" },
  "hallmark": { label: "Hallmark", color: "text-cyan-400", icon: "🏛️" },
};

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"transactions" | "stamps">("transactions");
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const { data: txData, isLoading } = useQuery<{ transactions: any[] }>({
    queryKey: ["/api/transactions/history"],
    refetchInterval: 30000,
  });

  const { data: stampData } = useQuery<{ stamps: any[] }>({
    queryKey: ["/api/trust-stamps/my"],
    refetchInterval: 30000,
  });

  const transactions = txData?.transactions || [];
  const stamps = stampData?.stamps || [];

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const filteredTxs = transactions.filter((tx: any) => {
    const matchesSearch = !searchQuery || 
      tx.hash?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.token?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || tx.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Shield className="w-7 h-7 text-cyan-400" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">Trust Layer</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-blue-500/50 text-blue-400 text-[10px]">History</Badge>
            <BackButton />
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-16 pb-8 px-4">
        <div className="container mx-auto max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <motion.div 
                className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/30"
                animate={{ 
                  boxShadow: ["0 0 20px rgba(59,130,246,0.2)", "0 0 40px rgba(59,130,246,0.4)", "0 0 20px rgba(59,130,246,0.2)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <History className="w-5 h-5 text-blue-400" />
              </motion.div>
              <h1 className="text-2xl md:text-3xl font-display font-bold">
                Transaction History
              </h1>
            </div>
            <p className="text-xs text-muted-foreground">
              View all your blockchain transactions
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-2 mb-6"
          >
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-lg font-bold text-primary">{transactions.length}</div>
              <div className="text-[10px] text-muted-foreground">Total Txs</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-lg font-bold text-green-400">
                {transactions.filter((t: any) => t.status === "confirmed").length}
              </div>
              <div className="text-[10px] text-muted-foreground">Confirmed</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-lg font-bold text-purple-400">
                {transactions.filter((t: any) => t.status === "pending").length}
              </div>
              <div className="text-[10px] text-muted-foreground">Pending</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex gap-1 mb-4 p-1 rounded-xl bg-white/5 border border-white/10"
          >
            <button
              onClick={() => setActiveTab("transactions")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "transactions"
                  ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white border border-blue-500/30"
                  : "text-white/40 hover:text-white/60"
              }`}
              data-testid="tab-transactions"
            >
              <History className="w-3.5 h-3.5" />
              Transactions
            </button>
            <button
              onClick={() => setActiveTab("stamps")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "stamps"
                  ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/30"
                  : "text-white/40 hover:text-white/60"
              }`}
              data-testid="tab-trust-stamps"
            >
              <Fingerprint className="w-3.5 h-3.5" />
              Trust Stamps
              {stamps.length > 0 && (
                <span className="px-1.5 py-0.5 text-[9px] rounded-full bg-cyan-500/20 text-cyan-400">{stamps.length}</span>
              )}
            </button>
          </motion.div>

          {activeTab === "transactions" && (
          <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-2 mb-4"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by hash or token..."
                className="pl-9 h-10"
                data-testid="input-search"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-32 h-10" data-testid="select-filter">
                <Filter className="w-4 h-4 mr-1" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="send">Sent</SelectItem>
                <SelectItem value="receive">Received</SelectItem>
                <SelectItem value="swap">Swaps</SelectItem>
                <SelectItem value="stake">Stakes</SelectItem>
                <SelectItem value="claim">Claims</SelectItem>
                <SelectItem value="bridge">Bridge</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0"
              onClick={() => window.open("/api/transactions/export", "_blank")}
              title="Export to CSV"
              data-testid="button-export-csv"
            >
              <Download className="w-4 h-4" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            {filteredTxs.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No transactions found</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {searchQuery ? "Try a different search" : "Start trading to see your history"}
                </p>
              </div>
            ) : (
              filteredTxs.map((tx: any, index: number) => {
                const config = TX_TYPE_CONFIG[tx.type] || TX_TYPE_CONFIG.send;
                const IconComponent = config.icon;
                
                return (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <div
                      onClick={() => setSelectedTx(selectedTx?.id === tx.id ? null : tx)}
                      data-testid={`tx-row-${tx.id}`}
                    >
                    <GlassCard glow className="p-3 cursor-pointer hover:border-primary/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center ${config.color}`}>
                            {typeof IconComponent === 'function' ? <IconComponent className="w-4 h-4" /> : IconComponent}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{config.label}</span>
                              <Badge variant="outline" className="text-[9px] py-0 h-4">{tx.token}</Badge>
                            </div>
                            <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Clock className="w-2 h-2" />
                              {formatDate(tx.timestamp)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold text-sm ${tx.type === 'receive' || tx.type === 'claim' ? 'text-green-400' : ''}`}>
                            {tx.type === 'receive' || tx.type === 'claim' ? '+' : ''}{formatAmount(tx.amount)}
                          </div>
                          <div className="flex items-center justify-end gap-1">
                            {tx.status === 'confirmed' ? (
                              <Badge className="bg-green-500/20 text-green-400 text-[9px] py-0 h-4">
                                <CheckCircle2 className="w-2 h-2 mr-1" />
                                Confirmed
                              </Badge>
                            ) : (
                              <Badge className="bg-purple-500/20 text-purple-400 text-[9px] py-0 h-4">
                                <RefreshCw className="w-2 h-2 mr-1 animate-spin" />
                                Pending
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {selectedTx?.id === tx.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-3 mt-3 border-t border-white/5 space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Transaction Hash</span>
                                <span className="font-mono flex items-center gap-1">
                                  {truncateHash(tx.hash)}
                                  <ExternalLink className="w-3 h-3 text-primary cursor-pointer" />
                                </span>
                              </div>
                              {tx.to && (
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-muted-foreground">To</span>
                                  <span className="font-mono">{tx.to}</span>
                                </div>
                              )}
                              {tx.from && (
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-muted-foreground">From</span>
                                  <span className="font-mono">{tx.from}</span>
                                </div>
                              )}
                              <Link href={`/explorer/tx/${tx.hash}`}>
                                <Button size="sm" variant="outline" className="w-full h-8 mt-2 text-xs">
                                  View in Explorer
                                  <ExternalLink className="w-3 h-3 ml-1" />
                                </Button>
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </GlassCard>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-2">
                <RefreshCw className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-blue-200">
                  <strong className="text-blue-300">Live updates:</strong> Transaction history refreshes automatically every 30 seconds.
                </p>
              </div>
            </div>
          </motion.div>
          </>
          )}

          {activeTab === "stamps" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 mb-4">
              <div className="flex items-start gap-2">
                <Fingerprint className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-cyan-200">
                  <strong className="text-cyan-300">Trust Stamps</strong> are immutable blockchain records of every action tied to your account — purchases, mints, certifications, and more. Each stamp has a unique hash verifiable on the Trust Layer.
                </p>
              </div>
            </div>

            {stamps.length === 0 ? (
              <div className="text-center py-12">
                <Fingerprint className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No trust stamps yet</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Your actions on Trust Layer will generate blockchain-verified stamps
                </p>
              </div>
            ) : (
              stamps.map((stamp: any, index: number) => {
                const config = STAMP_CATEGORY_CONFIG[stamp.category] || { label: stamp.category, color: "text-white", icon: "📋" };
                let parsedMeta: Record<string, any> = {};
                try { parsedMeta = JSON.parse(stamp.metadata || "{}"); } catch {}

                return (
                  <motion.div
                    key={stamp.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <GlassCard glow className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-lg">
                            {config.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`font-semibold text-sm ${config.color}`}>{config.label}</span>
                              <Badge className={`text-[9px] py-0 h-4 ${stamp.status === "confirmed" ? "bg-green-500/20 text-green-400" : "bg-purple-500/20 text-purple-400"}`}>
                                {stamp.status === "confirmed" ? <CheckCircle2 className="w-2 h-2 mr-1" /> : <Clock className="w-2 h-2 mr-1" />}
                                {stamp.status}
                              </Badge>
                            </div>
                            <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Clock className="w-2 h-2" />
                              {formatDate(stamp.createdAt)}
                            </div>
                          </div>
                        </div>
                        {stamp.blockHeight && (
                          <div className="text-right">
                            <div className="text-[10px] text-muted-foreground">Block</div>
                            <div className="text-xs font-mono text-white font-bold">#{stamp.blockHeight}</div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-white/5">
                        {stamp.dataHash && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Data Hash</span>
                            <button onClick={() => copyHash(stamp.dataHash)} className="font-mono flex items-center gap-1 text-white/70 hover:text-white transition-colors">
                              {truncateHash(stamp.dataHash)}
                              {copiedHash === stamp.dataHash ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        )}
                        {stamp.txHash && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Tx Hash</span>
                            <button onClick={() => copyHash(stamp.txHash)} className="font-mono flex items-center gap-1 text-cyan-400/70 hover:text-cyan-400 transition-colors">
                              {truncateHash(stamp.txHash)}
                              {copiedHash === stamp.txHash ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        )}
                        {parsedMeta.amountUsd && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Amount</span>
                            <span className="text-white font-medium">${parsedMeta.amountUsd}</span>
                          </div>
                        )}
                        {parsedMeta.tokens && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Tokens</span>
                            <span className="text-white font-medium">{Number(parsedMeta.tokens).toLocaleString()} SIG</span>
                          </div>
                        )}
                        {parsedMeta.shells && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Shells</span>
                            <span className="text-purple-400 font-medium">{Number(parsedMeta.shells).toLocaleString()}</span>
                          </div>
                        )}
                        {parsedMeta.domain && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Domain</span>
                            <span className="text-cyan-400 font-medium">{parsedMeta.domain}.tlid</span>
                          </div>
                        )}
                        {parsedMeta.name && stamp.category === "nft-mint" && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">NFT</span>
                            <span className="text-pink-400 font-medium">{parsedMeta.name}</span>
                          </div>
                        )}
                        {parsedMeta.plan && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Plan</span>
                            <span className="text-purple-400 font-medium">{parsedMeta.plan.replace(/_/g, ' ')}</span>
                          </div>
                        )}
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })
            )}
          </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
