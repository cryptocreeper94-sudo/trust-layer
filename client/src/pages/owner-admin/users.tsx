import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, Mail, Wallet, Shield, Crown, Clock, Search, Download,
  Filter, ChevronDown, CheckCircle2, XCircle, Star, Sparkles
} from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

interface UserData {
  waitlist: Array<{ id: number; email: string; feature: string; createdAt: string }>;
  betaTesters: Array<{ id: string; email: string; walletAddress: string; tier: string; status: string; notes: string; createdAt: string }>;
  whitelistedUsers: Array<{ id: number; userId: string; reason: string; createdAt: string }>;
  earlyAdopters: Array<{ id: number; email: string; tier: string; status: string; registeredAt: string }>;
  presaleOrders: Array<{ id: string; email: string; walletAddress: string; amount: string; tier: string; status: string; createdAt: string }>;
  stats: { totalWaitlist: number; totalBetaTesters: number; totalWhitelisted: number; totalEarlyAdopters: number; totalPresaleOrders: number; totalRevenue: number };
}

export default function OwnerUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"waitlist" | "beta" | "whitelist" | "early" | "presale">("waitlist");

  useEffect(() => {
    const auth = sessionStorage.getItem("ownerAuth");
    if (auth !== "true") {
      window.location.href = "/owner-admin";
    }
  }, []);

  const getOwnerHeaders = () => ({
    "x-owner-token": sessionStorage.getItem("ownerToken") || "",
  });

  const { data, isLoading } = useQuery<UserData>({
    queryKey: ["/api/owner/users/all"],
    queryFn: async () => {
      const res = await fetch("/api/owner/users/all", { 
        credentials: "include",
        headers: getOwnerHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch user data");
      return res.json();
    },
  });

  const stats = data?.stats || { totalWaitlist: 0, totalBetaTesters: 0, totalWhitelisted: 0, totalEarlyAdopters: 0, totalPresaleOrders: 0, totalRevenue: 0 };

  const filterBySearch = <T extends Record<string, any>>(items: T[] | undefined, fields: (keyof T)[]): T[] => {
    if (!items) return [];
    if (!searchTerm) return items;
    const term = searchTerm.toLowerCase();
    return items.filter(item => 
      fields.some(f => String(item[f] || "").toLowerCase().includes(term))
    );
  };

  const exportCSV = (items: any[], filename: string) => {
    if (!items.length) return;
    const headers = Object.keys(items[0]).join(",");
    const rows = items.map(item => Object.values(item).map(v => `"${String(v || "").replace(/"/g, '""')}"`).join(","));
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: "waitlist", label: "Waitlist", count: stats.totalWaitlist, icon: <Mail className="w-4 h-4" /> },
    { id: "beta", label: "Beta Testers", count: stats.totalBetaTesters, icon: <Star className="w-4 h-4" /> },
    { id: "whitelist", label: "Whitelist", count: stats.totalWhitelisted, icon: <Shield className="w-4 h-4" /> },
    { id: "early", label: "Early Adopters", count: stats.totalEarlyAdopters, icon: <Crown className="w-4 h-4" /> },
    { id: "presale", label: "Presale", count: stats.totalPresaleOrders, icon: <Sparkles className="w-4 h-4" /> },
  ];

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString() : "-";
  const formatAmount = (a: string) => {
    try { return `$${(parseFloat(a) / 100).toFixed(2)}`; } catch { return a; }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #8b5cf6)" size={600} top="-10%" left="-10%" />
      <GlowOrb color="linear-gradient(135deg, #ec4899, #8b5cf6)" size={500} top="50%" left="70%" delay={2} />

      <MobileNav />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 pt-20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <BackButton />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  User Management
                </span>
              </h1>
              <p className="text-gray-400">All signups, testers, and payments</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {[
            { label: "Waitlist", value: stats.totalWaitlist, icon: <Mail className="w-5 h-5 text-cyan-400" />, color: "from-cyan-500/20 to-cyan-500/5" },
            { label: "Beta Testers", value: stats.totalBetaTesters, icon: <Star className="w-5 h-5 text-yellow-400" />, color: "from-yellow-500/20 to-yellow-500/5" },
            { label: "Whitelist", value: stats.totalWhitelisted, icon: <Shield className="w-5 h-5 text-purple-400" />, color: "from-purple-500/20 to-purple-500/5" },
            { label: "Early Adopters", value: stats.totalEarlyAdopters, icon: <Crown className="w-5 h-5 text-amber-400" />, color: "from-amber-500/20 to-amber-500/5" },
            { label: "Presale Orders", value: stats.totalPresaleOrders, icon: <Sparkles className="w-5 h-5 text-pink-400" />, color: "from-pink-500/20 to-pink-500/5" },
            { label: "Revenue", value: `$${(stats.totalRevenue / 100).toLocaleString()}`, icon: <Wallet className="w-5 h-5 text-green-400" />, color: "from-green-500/20 to-green-500/5" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} border border-white/10 backdrop-blur-sm`}
            >
              <div className="flex items-center gap-2 mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 p-4 border-b border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white" 
                    : "bg-slate-800/50 text-gray-400 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                <Badge variant="outline" className="text-[10px] px-1.5">{tab.count}</Badge>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 p-4 border-b border-white/10">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search by email, wallet, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-white/10"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const exportMap: Record<string, { items: any[]; name: string }> = {
                  waitlist: { items: data?.waitlist || [], name: "waitlist" },
                  beta: { items: data?.betaTesters || [], name: "beta-testers" },
                  whitelist: { items: data?.whitelistedUsers || [], name: "whitelist" },
                  early: { items: data?.earlyAdopters || [], name: "early-adopters" },
                  presale: { items: data?.presaleOrders || [], name: "presale-orders" },
                };
                const { items, name } = exportMap[activeTab];
                exportCSV(items, name);
              }}
              className="gap-2"
            >
              <Download className="w-4 h-4" /> Export
            </Button>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center text-gray-400">Loading...</div>
            ) : activeTab === "waitlist" ? (
              <table className="w-full text-sm">
                <thead className="bg-slate-800/50 text-gray-400 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Feature</th>
                    <th className="px-4 py-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filterBySearch(data?.waitlist, ["email", "feature"]).map((item) => (
                    <tr key={item.id} className="hover:bg-white/5">
                      <td className="px-4 py-3 font-mono text-cyan-400">{item.email}</td>
                      <td className="px-4 py-3"><Badge variant="outline">{item.feature}</Badge></td>
                      <td className="px-4 py-3 text-gray-400">{formatDate(item.createdAt)}</td>
                    </tr>
                  ))}
                  {!data?.waitlist?.length && <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-500">No waitlist signups yet</td></tr>}
                </tbody>
              </table>
            ) : activeTab === "beta" ? (
              <table className="w-full text-sm">
                <thead className="bg-slate-800/50 text-gray-400 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Wallet</th>
                    <th className="px-4 py-3 text-left">Tier</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filterBySearch(data?.betaTesters, ["email", "walletAddress", "tier"]).map((item) => (
                    <tr key={item.id} className="hover:bg-white/5">
                      <td className="px-4 py-3 font-mono text-cyan-400">{item.email || "-"}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-400">{item.walletAddress ? `${item.walletAddress.slice(0,8)}...` : "-"}</td>
                      <td className="px-4 py-3"><Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">{item.tier || "Standard"}</Badge></td>
                      <td className="px-4 py-3">
                        {item.status === "active" ? (
                          <span className="flex items-center gap-1 text-green-400"><CheckCircle2 className="w-3 h-3" /> Active</span>
                        ) : (
                          <span className="flex items-center gap-1 text-gray-400"><XCircle className="w-3 h-3" /> {item.status}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400">{formatDate(item.createdAt)}</td>
                    </tr>
                  ))}
                  {!data?.betaTesters?.length && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No beta testers yet</td></tr>}
                </tbody>
              </table>
            ) : activeTab === "whitelist" ? (
              <table className="w-full text-sm">
                <thead className="bg-slate-800/50 text-gray-400 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">User ID</th>
                    <th className="px-4 py-3 text-left">Reason</th>
                    <th className="px-4 py-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filterBySearch(data?.whitelistedUsers, ["userId", "reason"]).map((item) => (
                    <tr key={item.id} className="hover:bg-white/5">
                      <td className="px-4 py-3 font-mono text-cyan-400">{item.userId}</td>
                      <td className="px-4 py-3"><Badge variant="outline" className="border-purple-500/30 text-purple-400">{item.reason || "VIP"}</Badge></td>
                      <td className="px-4 py-3 text-gray-400">{formatDate(item.createdAt)}</td>
                    </tr>
                  ))}
                  {!data?.whitelistedUsers?.length && <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-500">No whitelisted users yet</td></tr>}
                </tbody>
              </table>
            ) : activeTab === "early" ? (
              <table className="w-full text-sm">
                <thead className="bg-slate-800/50 text-gray-400 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Tier</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filterBySearch(data?.earlyAdopters, ["email", "tier"]).map((item) => (
                    <tr key={item.id} className="hover:bg-white/5">
                      <td className="px-4 py-3 font-mono text-cyan-400">{item.email}</td>
                      <td className="px-4 py-3"><Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">{item.tier}</Badge></td>
                      <td className="px-4 py-3">
                        {item.status === "active" ? (
                          <span className="flex items-center gap-1 text-green-400"><CheckCircle2 className="w-3 h-3" /> Active</span>
                        ) : (
                          <span className="text-gray-400">{item.status}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400">{formatDate(item.registeredAt)}</td>
                    </tr>
                  ))}
                  {!data?.earlyAdopters?.length && <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">No early adopters yet</td></tr>}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-slate-800/50 text-gray-400 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Wallet</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left">Tier</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filterBySearch(data?.presaleOrders, ["email", "walletAddress", "tier"]).map((item) => (
                    <tr key={item.id} className="hover:bg-white/5">
                      <td className="px-4 py-3 font-mono text-cyan-400">{item.email || "-"}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-400">{item.walletAddress ? `${item.walletAddress.slice(0,8)}...` : "-"}</td>
                      <td className="px-4 py-3 font-bold text-green-400">{formatAmount(item.amount)}</td>
                      <td className="px-4 py-3"><Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30">{item.tier}</Badge></td>
                      <td className="px-4 py-3">
                        {item.status === "completed" ? (
                          <span className="flex items-center gap-1 text-green-400"><CheckCircle2 className="w-3 h-3" /> Paid</span>
                        ) : (
                          <span className="text-amber-400">{item.status}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400">{formatDate(item.createdAt)}</td>
                    </tr>
                  ))}
                  {!data?.presaleOrders?.length && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No presale orders yet</td></tr>}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
