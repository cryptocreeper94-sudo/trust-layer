import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Shield, Lock, Unlock, Eye, RefreshCw, CheckCircle, 
  ExternalLink, TrendingUp, TrendingDown, Wallet, ChevronDown,
  Database, Link2, AlertCircle, Clock, FileCheck, Coins
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface ReserveAsset {
  chain: string;
  symbol: string;
  locked: string;
  minted: string;
  ratio: number;
  contractAddress: string;
  explorerUrl: string;
  lastVerified: string;
  status: "healthy" | "warning" | "critical";
}

interface AuditRecord {
  id: string;
  date: string;
  auditor: string;
  result: "passed" | "warning" | "failed";
  findings: number;
  reportUrl: string;
}

const mockReserves: ReserveAsset[] = [
  {
    chain: "Ethereum Sepolia",
    symbol: "wDWC",
    locked: "5,000,000",
    minted: "5,000,000",
    ratio: 100,
    contractAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44d",
    explorerUrl: "https://sepolia.etherscan.io/address/0x742d35Cc6634C0532925a3b844Bc454e4438f44d",
    lastVerified: "2 minutes ago",
    status: "healthy"
  },
  {
    chain: "Solana Devnet",
    symbol: "wDWC",
    locked: "2,500,000",
    minted: "2,500,000",
    ratio: 100,
    contractAddress: "DWBridge1111111111111111111111111111111111",
    explorerUrl: "https://explorer.solana.com/address/DWBridge1111111111111111111111111111111111?cluster=devnet",
    lastVerified: "5 minutes ago",
    status: "healthy"
  }
];

const mockAudits: AuditRecord[] = [
  {
    id: "a1",
    date: "Dec 15, 2025",
    auditor: "Trail of Bits",
    result: "passed",
    findings: 0,
    reportUrl: "#"
  },
  {
    id: "a2",
    date: "Nov 1, 2025",
    auditor: "OpenZeppelin",
    result: "passed",
    findings: 2,
    reportUrl: "#"
  },
  {
    id: "a3",
    date: "Oct 1, 2025",
    auditor: "Quantstamp",
    result: "warning",
    findings: 4,
    reportUrl: "#"
  }
];

const reserveHistory = [
  { time: "00:00", locked: 7200000, minted: 7200000 },
  { time: "04:00", locked: 7250000, minted: 7250000 },
  { time: "08:00", locked: 7300000, minted: 7300000 },
  { time: "12:00", locked: 7400000, minted: 7400000 },
  { time: "16:00", locked: 7450000, minted: 7450000 },
  { time: "20:00", locked: 7500000, minted: 7500000 },
  { time: "Now", locked: 7500000, minted: 7500000 }
];

const chainDistribution = [
  { name: "Ethereum", value: 5000000, color: "#627EEA" },
  { name: "Solana", value: 2500000, color: "#14F195" }
];

export default function ProofOfReservePage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sectionsOpen, setSectionsOpen] = useState({
    reserves: true,
    history: true,
    audits: false
  });

  const totalLocked = mockReserves.reduce((sum, r) => sum + parseFloat(r.locked.replace(/,/g, '')), 0);
  const totalMinted = mockReserves.reduce((sum, r) => sum + parseFloat(r.minted.replace(/,/g, '')), 0);
  const overallRatio = totalMinted > 0 ? (totalLocked / totalMinted * 100) : 100;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/30">
                <Shield className="h-8 w-8 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Proof of Reserve</h1>
                <p className="text-slate-400">Real-time transparency for cross-chain bridge custody</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors disabled:opacity-50"
              data-testid="refresh-reserves"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border border-emerald-500/30"
          >
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <Lock className="h-4 w-4" />
              Total Locked (DWC)
            </div>
            <div className="text-2xl font-bold text-white">{totalLocked.toLocaleString()}</div>
            <div className="text-xs text-emerald-400 mt-1">On DarkWave Smart Chain</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border border-blue-500/30"
          >
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <Coins className="h-4 w-4" />
              Total Minted (wDWC)
            </div>
            <div className="text-2xl font-bold text-white">{totalMinted.toLocaleString()}</div>
            <div className="text-xs text-blue-400 mt-1">Across all chains</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/30"
          >
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <CheckCircle className="h-4 w-4" />
              Collateral Ratio
            </div>
            <div className={`text-2xl font-bold ${overallRatio >= 100 ? 'text-emerald-400' : 'text-red-400'}`}>
              {overallRatio.toFixed(2)}%
            </div>
            <div className="text-xs text-amber-400 mt-1">1:1 backing verified</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-500/30"
          >
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <Link2 className="h-4 w-4" />
              Active Chains
            </div>
            <div className="text-2xl font-bold text-white">{mockReserves.length}</div>
            <div className="text-xs text-purple-400 mt-1">Ethereum, Solana</div>
          </motion.div>
        </div>

        <Collapsible 
          open={sectionsOpen.reserves} 
          onOpenChange={(open) => setSectionsOpen(s => ({...s, reserves: open}))}
          className="mb-6"
        >
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-600/10 border border-emerald-500/30 hover:border-emerald-400/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-emerald-400" />
                <span className="text-lg font-semibold text-white">Reserve Assets by Chain</span>
              </div>
              <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${sectionsOpen.reserves ? 'rotate-180' : ''}`} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-4 space-y-4">
              {mockReserves.map((reserve, idx) => (
                <motion.div
                  key={reserve.chain}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
                  data-testid={`reserve-${reserve.chain.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        reserve.chain.includes('Ethereum') ? 'bg-blue-500/20' : 'bg-purple-500/20'
                      }`}>
                        {reserve.chain.includes('Ethereum') ? (
                          <span className="text-2xl">⟠</span>
                        ) : (
                          <span className="text-2xl">◎</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{reserve.chain}</h3>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <span className="font-mono text-xs">{reserve.contractAddress.slice(0, 10)}...{reserve.contractAddress.slice(-6)}</span>
                          <a 
                            href={reserve.explorerUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-slate-400 text-sm">
                          <Lock className="h-3 w-3" />
                          Locked
                        </div>
                        <div className="text-xl font-bold text-white">{reserve.locked}</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-slate-400 text-sm">
                          <Coins className="h-3 w-3" />
                          Minted
                        </div>
                        <div className="text-xl font-bold text-white">{reserve.minted}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-slate-400 text-sm">Ratio</div>
                        <div className={`text-xl font-bold ${reserve.ratio >= 100 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {reserve.ratio}%
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                        reserve.status === 'healthy' ? 'bg-emerald-500/20 text-emerald-400' :
                        reserve.status === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {reserve.status === 'healthy' && <CheckCircle className="h-4 w-4" />}
                        {reserve.status === 'warning' && <AlertCircle className="h-4 w-4" />}
                        <span className="text-sm font-medium capitalize">{reserve.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="h-4 w-4" />
                      Last verified: {reserve.lastVerified}
                    </div>
                    <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300">
                      <Eye className="h-4 w-4" />
                      View on-chain proof
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible 
          open={sectionsOpen.history} 
          onOpenChange={(open) => setSectionsOpen(s => ({...s, history: open}))}
          className="mb-6"
        >
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-600/10 border border-blue-500/30 hover:border-blue-400/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                <span className="text-lg font-semibold text-white">Reserve History (24h)</span>
              </div>
              <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${sectionsOpen.history ? 'rotate-180' : ''}`} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-4 grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <h4 className="text-sm text-slate-400 mb-4">Locked vs Minted Over Time</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={reserveHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                        labelStyle={{ color: '#fff' }}
                        formatter={(value: number) => [value.toLocaleString(), '']}
                      />
                      <Area type="monotone" dataKey="locked" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="Locked DWC" />
                      <Area type="monotone" dataKey="minted" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Minted wDWC" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <h4 className="text-sm text-slate-400 mb-4">Distribution by Chain</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chainDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chainDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                        formatter={(value: number) => [value.toLocaleString() + ' wDWC', '']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2">
                  {chainDistribution.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-sm text-slate-400">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible 
          open={sectionsOpen.audits} 
          onOpenChange={(open) => setSectionsOpen(s => ({...s, audits: open}))}
        >
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-600/10 border border-purple-500/30 hover:border-purple-400/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <FileCheck className="h-5 w-5 text-purple-400" />
                <span className="text-lg font-semibold text-white">Security Audits</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-sm">
                  {mockAudits.filter(a => a.result === 'passed').length} passed
                </span>
              </div>
              <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${sectionsOpen.audits ? 'rotate-180' : ''}`} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-4 space-y-3">
              {mockAudits.map((audit) => (
                <motion.div
                  key={audit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between"
                  data-testid={`audit-${audit.id}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      audit.result === 'passed' ? 'bg-emerald-500/20' :
                      audit.result === 'warning' ? 'bg-amber-500/20' :
                      'bg-red-500/20'
                    }`}>
                      {audit.result === 'passed' ? <CheckCircle className="h-5 w-5 text-emerald-400" /> :
                       audit.result === 'warning' ? <AlertCircle className="h-5 w-5 text-amber-400" /> :
                       <AlertCircle className="h-5 w-5 text-red-400" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{audit.auditor}</h4>
                      <div className="text-sm text-slate-400">{audit.date}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-slate-400 text-sm">Findings</div>
                      <div className={`font-semibold ${audit.findings === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {audit.findings}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      audit.result === 'passed' ? 'bg-emerald-500/20 text-emerald-400' :
                      audit.result === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {audit.result.charAt(0).toUpperCase() + audit.result.slice(1)}
                    </div>
                    <a 
                      href={audit.reportUrl}
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
                    >
                      View Report
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
