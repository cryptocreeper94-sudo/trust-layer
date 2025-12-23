import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ImageIcon, ArrowLeft, Search, Filter, Grid3X3, List,
  ChevronDown, ExternalLink, User, Wallet
} from "lucide-react";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

interface NFT {
  id: string;
  tokenId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  collectionName: string;
  ownerId?: string;
  attributes?: string;
}

const SAMPLE_NFTS: NFT[] = [
  { id: "1", tokenId: "1", name: "Cosmic Voyager #42", collectionName: "DarkWave Genesis", imageUrl: "", description: "A rare cosmic explorer from the genesis collection" },
  { id: "2", tokenId: "2", name: "Neon Dreams #128", collectionName: "DarkWave Genesis", imageUrl: "", description: "Ethereal neon artwork" },
  { id: "3", tokenId: "3", name: "Cyber Punk #89", collectionName: "Cyber Collective", imageUrl: "", description: "Cyberpunk aesthetic collectible" },
  { id: "4", tokenId: "4", name: "Abstract Mind #15", collectionName: "Art Blocks", imageUrl: "", description: "Generative art piece" },
  { id: "5", tokenId: "5", name: "Pixel Warrior #256", collectionName: "Pixel Army", imageUrl: "", description: "8-bit warrior NFT" },
  { id: "6", tokenId: "6", name: "Golden Aura #7", collectionName: "Aura Collection", imageUrl: "", description: "Limited golden edition" },
];

function NFTCard({ nft, onClick }: { nft: NFT; onClick: () => void }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }} onClick={onClick}>
      <GlassCard className="cursor-pointer">
        <div className="aspect-square bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 rounded-t-xl flex items-center justify-center">
          {nft.imageUrl ? (
            <img src={nft.imageUrl} alt={nft.name} className="w-full h-full object-cover rounded-t-xl" />
          ) : (
            <div className="text-center">
              <ImageIcon className="w-12 h-12 text-white/30 mx-auto mb-2" />
              <span className="text-xs text-white/40">#{nft.tokenId}</span>
            </div>
          )}
        </div>
        <div className="p-3">
          <p className="text-[10px] text-primary truncate">{nft.collectionName}</p>
          <h3 className="font-bold text-white text-sm truncate">{nft.name}</h3>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default function NftGallery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedNft, setSelectedNft] = useState<NFT | null>(null);

  const { data: nftsData, isLoading, refetch } = useQuery<{ nfts: NFT[] }>({
    queryKey: ["/api/nft/gallery", walletAddress],
    enabled: !!walletAddress,
  });

  const displayNfts = nftsData?.nfts?.length ? nftsData.nfts : (walletAddress ? [] : SAMPLE_NFTS);
  const filteredNfts = displayNfts.filter(nft =>
    nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    nft.collectionName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const collections = Array.from(new Set(displayNfts.map(n => n.collectionName)));

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-purple-500/50 text-purple-400 text-[10px]">Gallery</Badge>
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-8 text-xs px-2 hover:bg-white/5">
                <ArrowLeft className="w-3 h-3" />
                <span className="hidden sm:inline ml-1">Back</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-16 pb-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <motion.div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <ImageIcon className="w-6 h-6 text-purple-400" />
              </motion.div>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
              NFT <span className="text-purple-400">Gallery</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              View NFT collections by wallet address. Explore the DarkWave NFT ecosystem.
            </p>
          </motion.div>

          <GlassCard className="mb-6">
            <div className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter wallet address to view NFTs..."
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="pl-9 bg-white/5 border-white/10"
                    data-testid="input-wallet-address"
                  />
                </div>
                <Button className="bg-purple-500 hover:bg-purple-600 shrink-0" onClick={() => refetch()} data-testid="button-view-nfts">
                  <Search className="w-4 h-4 mr-2" /> View NFTs
                </Button>
              </div>
            </div>
          </GlassCard>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search NFTs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-white/5 border-white/10" data-testid="input-search-nfts" />
            </div>
            
            <div className="flex gap-2">
              <Collapsible open={filterOpen} onOpenChange={setFilterOpen} className="sm:hidden w-full">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="flex-1 border-white/10">
                    <Filter className="w-4 h-4 mr-2" /> Filter <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <div className="p-3 rounded-lg bg-white/5 space-y-2">
                    <p className="text-xs text-muted-foreground mb-2">Collections:</p>
                    {collections.map(c => (
                      <Badge key={c} variant="outline" className="mr-2 cursor-pointer">{c}</Badge>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              <div className="hidden sm:flex bg-white/5 rounded-lg p-1 border border-white/10">
                <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="sm" className="h-8 px-3" onClick={() => setViewMode("grid")}>
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="sm" className="h-8 px-3" onClick={() => setViewMode("list")}>
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {!walletAddress && (
            <div className="mb-6 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 text-center">
              <p className="text-sm text-purple-300">Enter a wallet address above to view NFTs, or browse sample NFTs below.</p>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="aspect-square rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : filteredNfts.length > 0 ? (
            <div className={`grid ${viewMode === "grid" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"} gap-4`}>
              {filteredNfts.map(nft => (
                <NFTCard key={nft.id} nft={nft} onClick={() => setSelectedNft(nft)} />
              ))}
            </div>
          ) : (
            <GlassCard>
              <div className="p-8 text-center">
                <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-bold text-white mb-2">No NFTs Found</h3>
                <p className="text-sm text-muted-foreground">
                  {walletAddress ? "This wallet doesn't have any NFTs yet" : "Enter a wallet address to view NFTs"}
                </p>
              </div>
            </GlassCard>
          )}

          {collections.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold mb-4">Collections ({collections.length})</h2>
              <div className="flex flex-wrap gap-2">
                {collections.map(collection => (
                  <Badge key={collection} variant="outline" className="border-purple-500/30 text-purple-300 cursor-pointer hover:bg-purple-500/10">
                    {collection}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Dialog open={!!selectedNft} onOpenChange={() => setSelectedNft(null)}>
        <DialogContent className="max-w-md bg-background border-white/10">
          <DialogHeader>
            <DialogTitle>{selectedNft?.name}</DialogTitle>
          </DialogHeader>
          {selectedNft && (
            <div className="space-y-4 mt-4">
              <div className="aspect-square bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                {selectedNft.imageUrl ? (
                  <img src={selectedNft.imageUrl} alt={selectedNft.name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="w-16 h-16 text-white/30 mx-auto mb-2" />
                    <span className="text-sm text-white/40">Token #{selectedNft.tokenId}</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-primary mb-1">{selectedNft.collectionName}</p>
                <p className="text-sm text-muted-foreground">{selectedNft.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-lg bg-white/5">
                  <div className="text-[10px] text-muted-foreground">Token ID</div>
                  <div className="text-sm font-bold">#{selectedNft.tokenId}</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <div className="text-[10px] text-muted-foreground">Owner</div>
                  <div className="text-sm font-bold truncate">{selectedNft.ownerId || "Unknown"}</div>
                </div>
              </div>
              <Button className="w-full" variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" /> View on Explorer
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
