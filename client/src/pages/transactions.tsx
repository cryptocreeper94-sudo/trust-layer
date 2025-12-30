import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { 
  History, ArrowUpRight, ArrowDownLeft, RefreshCw,
  Filter, Search, ChevronDown, ExternalLink, Clock, CheckCircle2, Download
} from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

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
  { id: "1", type: "send", token: "DWC", amount: "1000000000000000000000", to: "0x1234...5678", from: "", hash: "0xabc123def456789012345678901234567890abcdef1234567890abcdef123456", status: "confirmed", timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: "2", type: "receive", token: "DWC", amount: "500000000000000000000", to: "", from: "0xabcd...efgh", hash: "0xdef456abc789012345678901234567890abcdef1234567890abcdef123456789", status: "confirmed", timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: "3", type: "swap", token: "DWC → USDC", amount: "2000000000000000000000", to: "", from: "", hash: "0x789abc123def456789012345678901234567890abcdef1234567890abcdef12", status: "confirmed", timestamp: new Date(Date.now() - 14400000).toISOString() },
  { id: "4", type: "stake", token: "DWC", amount: "5000000000000000000000", to: "", from: "", hash: "0x456def789abc123456789012345678901234567890abcdef1234567890abcdef", status: "confirmed", timestamp: new Date(Date.now() - 28800000).toISOString() },
  { id: "5", type: "claim", token: "DWC", amount: "125000000000000000000", to: "", from: "", hash: "0x123abc456def789012345678901234567890abcdef1234567890abcdef123456", status: "confirmed", timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: "6", type: "send", token: "wETH", amount: "100000000000000000", to: "0x9876...5432", from: "", hash: "0xfed987654321abcdef1234567890abcdef1234567890abcdef1234567890abcd", status: "pending", timestamp: new Date(Date.now() - 300000).toISOString() },
  { id: "7", type: "bridge", token: "DWC → wDWC", amount: "1000000000000000000000", to: "", from: "", hash: "0x321fed654987cba321098765432109876543210fedcba9876543210fedcba98", status: "confirmed", timestamp: new Date(Date.now() - 172800000).toISOString() },
];

const TX_TYPE_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
  send: { icon: ArrowUpRight, color: "text-red-400", label: "Sent" },
  receive: { icon: ArrowDownLeft, color: "text-green-400", label: "Received" },
  swap: { icon: RefreshCw, color: "text-primary", label: "Swap" },
  stake: { icon: () => <span className="text-xs">🔒</span>, color: "text-amber-400", label: "Stake" },
  claim: { icon: () => <span className="text-xs">🎁</span>, color: "text-green-400", label: "Claim" },
  bridge: { icon: () => <span className="text-xs">🌉</span>, color: "text-purple-400", label: "Bridge" },
};

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedTx, setSelectedTx] = useState<any>(null);

  const { data: txData, isLoading } = useQuery<{ transactions: any[] }>({
    queryKey: ["/api/transactions/history"],
    refetchInterval: 30000,
  });

  const transactions = txData?.transactions?.length ? txData.transactions : SAMPLE_TRANSACTIONS;

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
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
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
              <div className="text-lg font-bold text-amber-400">
                {transactions.filter((t: any) => t.status === "pending").length}
              </div>
              <div className="text-[10px] text-muted-foreground">Pending</div>
            </div>
          </motion.div>

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
                              <Badge className="bg-amber-500/20 text-amber-400 text-[9px] py-0 h-4">
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
