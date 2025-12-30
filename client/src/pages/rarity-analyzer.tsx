import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Diamond, Search, TrendingUp, TrendingDown, Star,
  BarChart3, Info, ExternalLink, Filter, ChevronDown
} from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";

const SAMPLE_NFT = {
  id: "DWG-247",
  name: "DarkWave Genesis #247",
  collection: "DarkWave Genesis",
  image: null,
  rarityScore: 892,
  rarityRank: 24,
  totalInCollection: 1000,
  floorPrice: 250,
  lastSale: 320,
  traits: [
    { name: "Background", value: "Cosmic Void", rarity: 2.1, color: "#8b5cf6" },
    { name: "Body", value: "Holographic", rarity: 4.5, color: "#06b6d4" },
    { name: "Eyes", value: "Laser Red", rarity: 1.8, color: "#ef4444" },
    { name: "Accessory", value: "Golden Crown", rarity: 0.9, color: "#f59e0b" },
    { name: "Aura", value: "Divine Glow", rarity: 1.2, color: "#22c55e" },
    { name: "Special", value: "Legendary Particle", rarity: 0.5, color: "#ec4899" },
  ],
};

const RARITY_DISTRIBUTION = [
  { range: "0-100", count: 50, label: "Common" },
  { range: "100-300", count: 200, label: "Uncommon" },
  { range: "300-500", count: 350, label: "Rare" },
  { range: "500-700", count: 250, label: "Epic" },
  { range: "700-900", count: 120, label: "Legendary" },
  { range: "900+", count: 30, label: "Mythic" },
];

const TOP_RARE = [
  { rank: 1, id: "#001", score: 985, owner: "0x7a23...f8d1" },
  { rank: 2, id: "#456", score: 967, owner: "0x8b34...c2e5" },
  { rank: 3, id: "#789", score: 945, owner: "0x9d45...a3f7" },
  { rank: 4, id: "#234", score: 932, owner: "0x1e56...d4g8" },
  { rank: 5, id: "#567", score: 918, owner: "0x2f67...e5h9" },
];

export default function RarityAnalyzer() {
  const [searchId, setSearchId] = useState("");
  const [nft, setNft] = useState(SAMPLE_NFT);

  const percentile = ((nft.totalInCollection - nft.rarityRank) / nft.totalInCollection * 100).toFixed(1);

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={darkwaveLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <BackButton />
        </div>
      </nav>

      <main className="flex-1 pt-16 pb-8 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <motion.div 
                className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30"
                animate={{ 
                  boxShadow: ["0 0 20px rgba(245,158,11,0.2)", "0 0 50px rgba(245,158,11,0.4)", "0 0 20px rgba(245,158,11,0.2)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Diamond className="w-7 h-7 text-amber-400" />
              </motion.div>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
              Rarity <span className="text-amber-400">Analyzer</span>
            </h1>
            <p className="text-sm text-muted-foreground mb-4">
              Discover the true rarity of any NFT
            </p>

            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Enter NFT ID or paste contract address..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="pl-10 bg-white/5 border-white/10"
                data-testid="input-nft-search"
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <GlassCard glow className="p-4 lg:row-span-2">
              <div className="aspect-square rounded-xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-amber-500/20 mb-4 flex items-center justify-center relative overflow-hidden">
                <Diamond className="w-24 h-24 text-white/20" />
                <Badge className="absolute top-2 right-2 bg-amber-500/20 text-amber-400">
                  Rank #{nft.rarityRank}
                </Badge>
              </div>
              <h2 className="font-bold text-lg mb-1">{nft.name}</h2>
              <p className="text-sm text-muted-foreground mb-3">{nft.collection}</p>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="p-2 rounded-lg bg-white/5 text-center">
                  <p className="text-[10px] text-muted-foreground">Floor Price</p>
                  <p className="font-bold">{nft.floorPrice} DWC</p>
                </div>
                <div className="p-2 rounded-lg bg-white/5 text-center">
                  <p className="text-[10px] text-muted-foreground">Last Sale</p>
                  <p className="font-bold">{nft.lastSale} DWC</p>
                </div>
              </div>

              <Button variant="outline" className="w-full gap-2">
                <ExternalLink className="w-4 h-4" />
                View on Marketplace
              </Button>
            </GlassCard>

            <GlassCard className="p-4 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  Rarity Score
                </h2>
                <Badge variant="outline" className="text-[10px]">
                  Top {percentile}%
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  className="relative w-24 h-24"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="8" fill="none" className="text-white/10" />
                    <circle 
                      cx="48" cy="48" r="42" 
                      stroke="url(#rarityGrad)" 
                      strokeWidth="8" 
                      fill="none" 
                      strokeDasharray={`${(nft.rarityScore / 1000) * 264} 264`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="rarityGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">{nft.rarityScore}</span>
                    <span className="text-[10px] text-muted-foreground">/ 1000</span>
                  </div>
                </motion.div>
                
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-lg bg-white/5">
                      <p className="text-[10px] text-muted-foreground">Rank</p>
                      <p className="font-bold text-amber-400">#{nft.rarityRank}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5">
                      <p className="text-[10px] text-muted-foreground">Total NFTs</p>
                      <p className="font-bold">{nft.totalInCollection.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Trait Breakdown</h3>
                {nft.traits.map((trait, i) => (
                  <motion.div
                    key={trait.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-24 text-xs text-muted-foreground">{trait.name}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">{trait.value}</span>
                        <span className="text-xs text-amber-400">{trait.rarity}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, trait.rarity * 10)}%` }}
                          transition={{ delay: i * 0.1 + 0.2 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: trait.color }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-4 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Collection Distribution
                </h2>
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={RARITY_DISTRIBUTION}>
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#6b7280' }} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {RARITY_DISTRIBUTION.map((entry, i) => (
                        <Cell 
                          key={i} 
                          fill={i === 5 ? '#f59e0b' : i === 4 ? '#a855f7' : i === 3 ? '#8b5cf6' : '#6b7280'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard className="p-4 lg:col-span-3">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  Top 5 Rarest in Collection
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                {TOP_RARE.map((item, i) => (
                  <motion.div
                    key={item.rank}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <GlassCard className={`p-3 ${i === 0 ? 'ring-1 ring-amber-500/50' : ''}`}>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={`${
                          i === 0 ? 'bg-amber-500/20 text-amber-400' :
                          i === 1 ? 'bg-gray-400/20 text-gray-300' :
                          i === 2 ? 'bg-amber-700/20 text-amber-600' :
                          'bg-white/10'
                        } text-[10px]`}>
                          #{item.rank}
                        </Badge>
                        <span className="font-mono text-xs">{item.id}</span>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-amber-400">{item.score}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{item.owner}</p>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
