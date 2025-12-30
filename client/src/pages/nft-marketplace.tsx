import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { 
  Sparkles, Grid, Search, Filter, ChevronDown, 
  Heart, Eye, Tag, Plus, ImageIcon, Loader2, CheckCircle2, X
} from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";
import genesisNft1 from "@assets/generated_images/genesis_nft_cosmic_orb_collectible.png";
import genesisNft2 from "@assets/generated_images/genesis_nft_crystal_formation_collectible.png";
import genesisNft3 from "@assets/generated_images/genesis_nft_portal_vortex_collectible.png";
import cyberNft from "@assets/generated_images/cyber_warrior_nft_collectible.png";
import neonNft from "@assets/generated_images/neon_dreams_nft_collectible.png";
import goldenNft from "@assets/generated_images/golden_aura_nft_collectible.png";

const formatPrice = (price: string) => {
  try {
    const num = BigInt(price);
    const divisor = BigInt("1000000000000000000");
    return (Number(num) / Number(divisor)).toFixed(2);
  } catch {
    return "0";
  }
};

const SAMPLE_COLLECTIONS = [
  { id: "1", name: "DarkWave Genesis", symbol: "DWG", imageUrl: genesisNft1, itemCount: 1000, floorPrice: "100000000000000000000", isVerified: true },
  { id: "2", name: "Cyber Collective", symbol: "CYBER", imageUrl: cyberNft, itemCount: 500, floorPrice: "50000000000000000000", isVerified: true },
  { id: "3", name: "Golden Aura", symbol: "AURA", imageUrl: goldenNft, itemCount: 2500, floorPrice: "25000000000000000000", isVerified: true },
  { id: "4", name: "Neon Dreams", symbol: "NEON", imageUrl: neonNft, itemCount: 888, floorPrice: "75000000000000000000", isVerified: true },
];

const SAMPLE_NFTS = [
  { id: "1", tokenId: "1", name: "Genesis #001 - Cosmic Orb", collectionId: "1", imageUrl: genesisNft1, price: "150000000000000000000", likes: 142 },
  { id: "2", tokenId: "2", name: "Genesis #002 - Crystal Formation", collectionId: "1", imageUrl: genesisNft2, price: "120000000000000000000", likes: 98 },
  { id: "3", tokenId: "1", name: "Cyber Warrior #001", collectionId: "2", imageUrl: cyberNft, price: "80000000000000000000", likes: 256 },
  { id: "4", tokenId: "1", name: "Golden Aura #042", collectionId: "3", imageUrl: goldenNft, price: "30000000000000000000", likes: 75 },
  { id: "5", tokenId: "2", name: "Neon Dreams #101", collectionId: "4", imageUrl: neonNft, price: "90000000000000000000", likes: 183 },
  { id: "6", tokenId: "3", name: "Genesis #003 - Portal Vortex", collectionId: "1", imageUrl: genesisNft3, price: "200000000000000000000", likes: 321 },
];

export default function NftMarketplace() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("explore");
  const [showMintDialog, setShowMintDialog] = useState(false);
  const [mintForm, setMintForm] = useState({ name: "", description: "", imageUrl: "" });

  const { data: collections } = useQuery<{ collections: any[] }>({
    queryKey: ["/api/nft/collections"],
  });

  const { data: listings } = useQuery<{ listings: any[] }>({
    queryKey: ["/api/nft/listings"],
  });

  const { data: stats } = useQuery<{ totalVolume: string; totalNfts: number; totalCollections: number }>({
    queryKey: ["/api/nft/stats"],
  });

  const mintMutation = useMutation({
    mutationFn: async () => {
      if (!mintForm.name) throw new Error("NFT name is required");
      const res = await apiRequest("POST", "/api/nft/mint", mintForm);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "NFT Minted!", description: "Your NFT has been created successfully" });
      setShowMintDialog(false);
      setMintForm({ name: "", description: "", imageUrl: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/nft/listings"] });
    },
    onError: (error: any) => {
      toast({ title: "Mint Failed", description: error.message, variant: "destructive" });
    },
  });

  const displayCollections = collections?.collections?.length ? collections.collections : SAMPLE_COLLECTIONS;
  const displayListings = listings?.listings?.length ? listings.listings : SAMPLE_NFTS;

  const filteredNfts = displayListings.filter((nft: any) => 
    nft.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-pink-500/50 text-pink-400 text-[10px]">NFT</Badge>
            <BackButton />
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-16 pb-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <motion.div 
                className="p-2 rounded-xl bg-pink-500/20 border border-pink-500/30"
                animate={{ 
                  boxShadow: ["0 0 20px rgba(236,72,153,0.2)", "0 0 40px rgba(236,72,153,0.4)", "0 0 20px rgba(236,72,153,0.2)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-5 h-5 text-pink-400" />
              </motion.div>
              <h1 className="text-2xl md:text-3xl font-display font-bold">
                NFT Marketplace
              </h1>
            </div>
            <p className="text-xs text-muted-foreground">
              Buy, sell, and mint unique digital assets on DarkWave Smart Chain
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6"
          >
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-lg font-bold text-pink-400">
                {stats?.totalVolume ? formatPrice(stats.totalVolume) : "0"}
              </div>
              <div className="text-[10px] text-muted-foreground">Volume (DWC)</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-lg font-bold text-primary">
                {stats?.totalNfts || displayListings.length}
              </div>
              <div className="text-[10px] text-muted-foreground">NFTs Listed</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-lg font-bold text-purple-400">
                {stats?.totalCollections || displayCollections.length}
              </div>
              <div className="text-[10px] text-muted-foreground">Collections</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-lg font-bold text-amber-400">0.5%</div>
              <div className="text-[10px] text-muted-foreground">Platform Fee</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-2 mb-6"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search NFTs..."
                className="pl-9 h-10"
                data-testid="input-search"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-10">
                <Filter className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
              <Dialog open={showMintDialog} onOpenChange={setShowMintDialog}>
                <DialogTrigger asChild>
                  <Button className="h-10 bg-gradient-to-r from-pink-500 to-purple-500 text-white" data-testid="button-mint">
                    <Plus className="w-4 h-4 mr-1" />
                    Mint
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-pink-400" />
                      Create NFT
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Name</label>
                      <Input
                        value={mintForm.name}
                        onChange={(e) => setMintForm({ ...mintForm, name: e.target.value })}
                        placeholder="My Awesome NFT"
                        data-testid="input-nft-name"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                      <Input
                        value={mintForm.description}
                        onChange={(e) => setMintForm({ ...mintForm, description: e.target.value })}
                        placeholder="Describe your NFT..."
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Image URL</label>
                      <Input
                        value={mintForm.imageUrl}
                        onChange={(e) => setMintForm({ ...mintForm, imageUrl: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-500"
                      onClick={() => mintMutation.mutate()}
                      disabled={mintMutation.isPending}
                      data-testid="button-confirm-mint"
                    >
                      {mintMutation.isPending ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Minting...
                        </span>
                      ) : (
                        "Create NFT"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="explore" className="text-xs">Explore</TabsTrigger>
              <TabsTrigger value="collections" className="text-xs">Collections</TabsTrigger>
              <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="explore" className="mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredNfts.map((nft: any, index: number) => (
                  <motion.div
                    key={nft.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <GlassCard className="overflow-hidden group cursor-pointer hover:border-pink-500/30 transition-colors" data-testid={`nft-card-${nft.id}`}>
                      <div className="aspect-square bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center relative">
                        {nft.imageUrl ? (
                          <img src={nft.imageUrl} alt={nft.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-12 h-12 text-white/20" />
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button size="sm" className="h-8 text-xs bg-pink-500 hover:bg-pink-600">
                            Buy
                          </Button>
                        </div>
                        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                          <Heart className="w-3 h-3 text-pink-400" />
                          <span className="text-[10px]">{nft.likes || 0}</span>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="text-xs font-medium truncate">{nft.name}</div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-muted-foreground">Price</span>
                          <span className="text-xs font-bold text-pink-400">
                            {formatPrice(nft.price)} DWC
                          </span>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
              {filteredNfts.length === 0 && (
                <div className="text-center py-12">
                  <ImageIcon className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No NFTs found</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="collections" className="mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {displayCollections.map((collection: any, index: number) => (
                  <motion.div
                    key={collection.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <GlassCard className="overflow-hidden cursor-pointer hover:border-purple-500/30 transition-colors" data-testid={`collection-card-${collection.id}`}>
                      <div className="h-20 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20" />
                      <div className="p-4 -mt-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center border-2 border-background">
                          <span className="text-lg">{collection.symbol.slice(0, 2)}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-1">
                          <span className="font-bold text-sm">{collection.name}</span>
                          {collection.isVerified && (
                            <CheckCircle2 className="w-3 h-3 text-primary" />
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Items: {collection.itemCount}</span>
                          <span>Floor: {formatPrice(collection.floorPrice)} DWC</span>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="mt-4">
              <GlassCard>
                <div className="p-6 text-center">
                  <Eye className="w-10 h-10 text-white/20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Activity feed coming soon</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Track sales, listings, and transfers</p>
                </div>
              </GlassCard>
            </TabsContent>
          </Tabs>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4"
          >
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-purple-200">
                  <strong className="text-purple-300">Testnet:</strong> This marketplace operates on DarkWave testnet. NFTs here are for testing only.
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
