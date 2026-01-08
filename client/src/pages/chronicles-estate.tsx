import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Home, TreeDeciduous, Mountain, Droplets, Store, Hammer,
  Plus, Minus, RotateCcw, Save, Coins, Lock, Sparkles,
  ChevronRight, User, Grid3X3, Eye, ShoppingBag, Crown,
  Rocket, Building2, MapPin, Gift, Briefcase, Calendar, X,
  Timer, Flame, Clock, Zap, Map, ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useSimpleAuth } from "@/hooks/use-simple-auth";
import { CharacterPortrait } from "@/components/character-portrait";
import { ChroniclesNPC, NPCChatButton } from "@/components/chronicles-npc";
import { GlassCard } from "@/components/glass-card";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "sonner";

interface CityZone {
  id: string;
  era: string;
  name: string;
  description: string;
  zoneType: string;
  gridX: number;
  gridY: number;
  totalPlots: number;
  occupiedPlots: number;
}

interface LandPlot {
  id: string;
  zoneId: string;
  plotX: number;
  plotY: number;
  plotSize: string;
  basePrice: number;
  currentPrice: number;
  ownerId: string | null;
  isForSale: boolean;
}

interface DailyRewardData {
  canClaim: boolean;
  currentStreak: number;
  nextReward: number;
  longestStreak: number;
  totalLogins: number;
  totalShellsEarned?: number;
  lastLoginAt?: string;
  hoursUntilClaim?: number;
}

interface EraBuildingTemplate {
  id: string;
  era: string;
  buildingType: string;
  displayName: string;
  iconEmoji: string;
  colorClass: string;
  description: string;
  baseCost: number;
  unlockLevel: number;
}

type BuildingType = 
  | "empty"
  | "house"
  | "tree"
  | "garden"
  | "pond"
  | "shop"
  | "workshop"
  | "monument"
  | "wall"
  | "path";

interface GridCell {
  x: number;
  y: number;
  building: BuildingType;
  level: number;
  rotation: number;
}

interface BuildingDef {
  id: BuildingType;
  name: string;
  icon: React.ElementType;
  cost: number;
  description: string;
  unlockLevel: number;
  category: "structures" | "nature" | "decoration";
}

const BUILDINGS: BuildingDef[] = [
  { id: "house", name: "Dwelling", icon: Home, cost: 0, description: "Your main residence", unlockLevel: 0, category: "structures" },
  { id: "tree", name: "Tree", icon: TreeDeciduous, cost: 10, description: "A sturdy tree", unlockLevel: 0, category: "nature" },
  { id: "garden", name: "Garden", icon: TreeDeciduous, cost: 25, description: "Flowers and plants", unlockLevel: 0, category: "nature" },
  { id: "pond", name: "Pond", icon: Droplets, cost: 50, description: "A peaceful water feature", unlockLevel: 1, category: "nature" },
  { id: "path", name: "Stone Path", icon: Grid3X3, cost: 5, description: "Walkways through your estate", unlockLevel: 0, category: "decoration" },
  { id: "wall", name: "Fence", icon: Mountain, cost: 15, description: "Define your boundaries", unlockLevel: 0, category: "decoration" },
  { id: "shop", name: "Market Stall", icon: Store, cost: 100, description: "Trade with visitors", unlockLevel: 2, category: "structures" },
  { id: "workshop", name: "Workshop", icon: Hammer, cost: 150, description: "Craft items and tools", unlockLevel: 3, category: "structures" },
  { id: "monument", name: "Monument", icon: Crown, cost: 500, description: "A symbol of achievement", unlockLevel: 5, category: "decoration" },
];

const GRID_SIZE = 8;

const BUILDING_COLORS: Record<BuildingType, string> = {
  empty: "bg-slate-800/50",
  house: "bg-amber-600",
  tree: "bg-green-600",
  garden: "bg-pink-500",
  pond: "bg-blue-500",
  shop: "bg-purple-500",
  workshop: "bg-orange-500",
  monument: "bg-yellow-500",
  wall: "bg-slate-500",
  path: "bg-stone-400",
};

function createEmptyGrid(): GridCell[][] {
  const grid: GridCell[][] = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    const row: GridCell[] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      row.push({ x, y, building: "empty", level: 0, rotation: 0 });
    }
    grid.push(row);
  }
  grid[3][3] = { x: 3, y: 3, building: "house", level: 1, rotation: 0 };
  return grid;
}

export default function ChroniclesEstate() {
  const { user, loading: authLoading } = useSimpleAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const [grid, setGrid] = useState<GridCell[][]>(createEmptyGrid);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingType | null>(null);
  const [isEraseMode, setIsEraseMode] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showNPC, setShowNPC] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const { data: shellsData } = useQuery({
    queryKey: ["/api/orbs/balance"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/orbs/balance");
      return res.json();
    },
    enabled: !!user,
  });

  const { data: personalityData } = useQuery({
    queryKey: ["/api/chronicles/personality"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/chronicles/personality");
      return res.json();
    },
    enabled: !!user,
  });

  const { data: estateData, isLoading: estateLoading } = useQuery({
    queryKey: ["/api/chronicles/estate"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/chronicles/estate");
      return res.json();
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (estateData?.estate?.gridData && Array.isArray(estateData.estate.gridData) && estateData.estate.gridData.length > 0) {
      setGrid(estateData.estate.gridData);
    }
  }, [estateData]);

  const saveEstateMutation = useMutation({
    mutationFn: async (gridData: GridCell[][]) => {
      const totalBuildings = gridData.flat().filter(c => c.building !== "empty").length;
      const res = await apiRequest("POST", "/api/chronicles/estate", {
        gridData,
        totalBuildings,
        shellsSpent: 0
      });
      return res.json();
    },
    onSuccess: () => {
      setHasChanges(false);
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/estate"] });
      toast.success("Estate saved!", { description: "Your progress has been saved." });
    },
    onError: (error: any) => {
      toast.error("Failed to save", { description: error.message || "Please try again." });
    }
  });

  const [selectedEra, setSelectedEra] = useState("present");
  const [selectedZone, setSelectedZone] = useState<CityZone | null>(null);
  const [activeTab, setActiveTab] = useState("builder");

  const { data: zonesData } = useQuery({
    queryKey: ["/api/chronicles/zones", selectedEra],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/chronicles/zones?era=${selectedEra}`);
      return res.json();
    },
    enabled: !!user,
  });

  const { data: zonePlotsData, refetch: refetchPlots } = useQuery({
    queryKey: ["/api/chronicles/zones", selectedZone?.id, "plots"],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/chronicles/zones/${selectedZone!.id}/plots`);
      return res.json();
    },
    enabled: !!selectedZone,
  });

  const { data: dailyRewardData, refetch: refetchDailyReward } = useQuery<DailyRewardData>({
    queryKey: ["/api/chronicles/daily-reward"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/chronicles/daily-reward");
      return res.json();
    },
    enabled: !!user,
  });

  const { data: eraBuildingsData } = useQuery({
    queryKey: ["/api/chronicles/era-buildings", selectedEra],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/chronicles/era-buildings/${selectedEra}`);
      return res.json();
    },
    enabled: !!user,
  });

  const claimDailyRewardMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/chronicles/daily-reward/claim");
      return res.json();
    },
    onSuccess: (data) => {
      refetchDailyReward();
      queryClient.invalidateQueries({ queryKey: ["/api/orbs/balance"] });
      toast.success(data.message || "Daily reward claimed!", {
        description: `+${data.reward} Shells! Streak: ${data.currentStreak} days`
      });
    },
    onError: (error: any) => {
      toast.error("Could not claim reward", { description: error.message });
    }
  });

  const purchasePlotMutation = useMutation({
    mutationFn: async (plotId: string) => {
      const res = await apiRequest("POST", `/api/chronicles/plots/${plotId}/purchase`);
      return res.json();
    },
    onSuccess: () => {
      refetchPlots();
      queryClient.invalidateQueries({ queryKey: ["/api/orbs/balance"] });
      toast.success("Plot purchased!", { description: "You now own this plot" });
    },
    onError: (error: any) => {
      toast.error("Purchase failed", { description: error.message });
    }
  });

  const zones: CityZone[] = zonesData?.zones || [];
  const zonePlots: LandPlot[] = zonePlotsData?.plots || [];
  const eraBuildings: EraBuildingTemplate[] = eraBuildingsData?.templates || [];

  const saveEstate = async () => {
    setIsSaving(true);
    try {
      await saveEstateMutation.mutateAsync(grid);
    } catch (e) {
      // Error handled by onError
    } finally {
      setIsSaving(false);
    }
  };

  const shellsBalance = shellsData?.balance || 0;
  const personality = personalityData?.personality;
  const playerLevel = Math.floor((personality?.totalChoicesMade || 0) / 10);

  const handleCellClick = (x: number, y: number) => {
    if (!selectedBuilding && !isEraseMode) return;
    
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    
    if (isEraseMode) {
      if (newGrid[y][x].building !== "house") {
        newGrid[y][x] = { x, y, building: "empty", level: 0, rotation: 0 };
      }
    } else if (selectedBuilding) {
      const building = BUILDINGS.find(b => b.id === selectedBuilding);
      if (!building) return;
      
      if (building.cost > shellsBalance) {
        return;
      }
      
      if (building.unlockLevel > playerLevel) {
        return;
      }
      
      if (newGrid[y][x].building === "empty") {
        newGrid[y][x] = { x, y, building: selectedBuilding, level: 1, rotation: 0 };
      }
    }
    
    setGrid(newGrid);
    setHasChanges(true);
  };

  const resetGrid = () => {
    setGrid(createEmptyGrid());
    setHasChanges(true);
  };

  const getBuildingIcon = (type: BuildingType) => {
    const building = BUILDINGS.find(b => b.id === type);
    return building?.icon || Grid3X3;
  };

  const countBuildings = () => {
    let count = 0;
    grid.forEach(row => {
      row.forEach(cell => {
        if (cell.building !== "empty") count++;
      });
    });
    return count;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-slate-900/80 border-slate-700 p-8 text-center">
          <User className="w-16 h-16 mx-auto text-cyan-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Sign In Required</h2>
          <p className="text-slate-400 mb-6">Create your character first to access your estate</p>
          <Button onClick={() => setLocation("/chronicles/onboarding")} className="bg-gradient-to-r from-cyan-500 to-purple-500">
            Create Character
          </Button>
        </Card>
      </div>
    );
  }

  if (!personality?.parallelSelfName) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-slate-900/80 border-slate-700 p-8 text-center">
          <Sparkles className="w-16 h-16 mx-auto text-cyan-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Create Your Character</h2>
          <p className="text-slate-400 mb-6">Complete the character creation process to access your estate</p>
          <Button onClick={() => setLocation("/chronicles/onboarding")} className="bg-gradient-to-r from-cyan-500 to-purple-500">
            Start Character Creation
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Floating Ambient Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-40 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: "1s" }} />

      {/* Daily Reward Banner */}
      {dailyRewardData?.canClaim && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 border-b border-amber-500/30"
        >
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-pink-500 flex items-center justify-center animate-pulse">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Daily Reward Ready!</p>
                <p className="text-amber-300 text-xs">
                  Claim +{dailyRewardData.nextReward} Shells
                  {dailyRewardData.currentStreak > 0 && ` (${dailyRewardData.currentStreak} day streak!)`}
                </p>
              </div>
            </div>
            <Button
              onClick={() => claimDailyRewardMutation.mutate()}
              disabled={claimDailyRewardMutation.isPending}
              className="bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-white font-semibold"
              data-testid="button-claim-daily"
            >
              {claimDailyRewardMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Flame className="w-4 h-4 mr-1" />
                  Claim Now
                </>
              )}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="bg-slate-900/80 border-b border-slate-700 p-4 relative z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setLocation("/chronicles/hub")}
              className="text-slate-400"
            >
              ← Back
            </Button>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {personality.parallelSelfName}'s Estate
              </h1>
              <p className="text-sm text-slate-400">Season Zero - Build Your Legacy</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <Badge variant="outline" className="border-amber-500/50 text-amber-400">
                <Coins className="w-3 h-3 mr-1" />
                {shellsBalance.toLocaleString()} Shells
              </Badge>
              <span className="text-[10px] text-cyan-400/70 mt-0.5">
                ≈ {(shellsBalance / 100).toFixed(2)} DWC at launch
              </span>
            </div>
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
              Level {playerLevel}
            </Badge>
          </div>
        </div>
      </div>

      {/* DWC Conversion Banner */}
      <div className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border-y border-cyan-500/20 py-2 px-4 relative z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 text-sm">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300">
            <span className="text-cyan-400 font-semibold">Shells → DWC:</span> All Shells convert to DarkWave Coin at <span className="text-white font-bold">100 Shells = 1 DWC</span> on April 11, 2026
          </span>
          <a 
            href="/virtual-currency-terms" 
            className="text-cyan-400 hover:text-cyan-300 underline text-xs ml-2"
            data-testid="link-vc-terms"
          >
            Learn more
          </a>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-4 pt-4 relative z-10">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: "builder", label: "Estate Builder", icon: Home },
            { id: "zones", label: "City Zones", icon: Map },
            { id: "marketplace", label: "Plot Market", icon: ShoppingCart },
            { id: "rewards", label: "Daily Rewards", icon: Gift },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className={activeTab === tab.id 
                ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shrink-0" 
                : "border-slate-600 text-slate-300 shrink-0"
              }
              data-testid={`tab-${tab.id}`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-6 relative z-10">
        {/* City Zones Tab */}
        {activeTab === "zones" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Era Selector */}
            <div className="flex gap-2 flex-wrap">
              {[
                { id: "present", label: "Present Day", emoji: "🏙️" },
                { id: "medieval", label: "Medieval", emoji: "🏰" },
                { id: "roman", label: "Roman Empire", emoji: "🏛️" },
              ].map((era) => (
                <Button
                  key={era.id}
                  variant={selectedEra === era.id ? "default" : "outline"}
                  onClick={() => { setSelectedEra(era.id); setSelectedZone(null); }}
                  className={selectedEra === era.id 
                    ? "bg-gradient-to-r from-purple-500 to-pink-500" 
                    : "border-slate-600"
                  }
                  data-testid={`era-${era.id}`}
                >
                  <span className="mr-2">{era.emoji}</span>
                  {era.label}
                </Button>
              ))}
            </div>

            {/* Zones Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {zones.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <Map className="w-12 h-12 mx-auto text-slate-600 mb-3" />
                  <p className="text-slate-400">Loading city zones...</p>
                </div>
              )}
              {zones.map((zone) => (
                <GlassCard
                  key={zone.id}
                  glow
                  className={`p-4 cursor-pointer transition-all ${
                    selectedZone?.id === zone.id ? "ring-2 ring-cyan-400" : ""
                  }`}
                  onClick={() => setSelectedZone(zone)}
                  data-testid={`zone-${zone.id}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-white">{zone.name}</h3>
                      <p className="text-xs text-slate-400">{zone.description}</p>
                    </div>
                    <Badge className={
                      zone.zoneType === "commercial" ? "bg-purple-500/20 text-purple-300 border-purple-500/30" :
                      zone.zoneType === "residential" ? "bg-green-500/20 text-green-300 border-green-500/30" :
                      zone.zoneType === "civic" ? "bg-blue-500/20 text-blue-300 border-blue-500/30" :
                      "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    }>
                      {zone.zoneType}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">
                      {zone.occupiedPlots}/{zone.totalPlots} plots taken
                    </span>
                    <Progress 
                      value={(zone.occupiedPlots / zone.totalPlots) * 100} 
                      className="w-20 h-2"
                    />
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Zone Plots */}
            {selectedZone && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <GlassCard glow className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4">
                    {selectedZone.name} - Available Plots
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {zonePlots.map((plot) => (
                      <div
                        key={plot.id}
                        className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center text-xs p-2 ${
                          plot.ownerId 
                            ? "bg-slate-700/50 border-slate-600 text-slate-500" 
                            : "bg-slate-800/50 border-cyan-500/30 hover:border-cyan-400 cursor-pointer"
                        }`}
                        onClick={() => {
                          if (!plot.ownerId) {
                            if (confirm(`Purchase this ${plot.plotSize} plot for ${plot.currentPrice} Shells?`)) {
                              purchasePlotMutation.mutate(plot.id);
                            }
                          }
                        }}
                        data-testid={`plot-${plot.id}`}
                      >
                        <span className={`text-lg ${plot.ownerId ? "opacity-30" : ""}`}>
                          {plot.plotSize === "premium" ? "👑" : 
                           plot.plotSize === "large" ? "🏠" : "📦"}
                        </span>
                        <span className={plot.ownerId ? "text-slate-500" : "text-cyan-300"}>
                          {plot.ownerId ? "Owned" : `${plot.currentPrice}🐚`}
                        </span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Marketplace Tab */}
        {activeTab === "marketplace" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard glow className="p-6 text-center">
              <ShoppingCart className="w-16 h-16 mx-auto text-cyan-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Plot Marketplace</h2>
              <p className="text-slate-400 mb-4">
                Buy and sell plots with other players. Coming soon with peer-to-peer trading!
              </p>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                Phase 2 Feature
              </Badge>
            </GlassCard>
          </motion.div>
        )}

        {/* Daily Rewards Tab */}
        {activeTab === "rewards" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto"
          >
            <GlassCard glow className="p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-pink-500 flex items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.3)]">
                  <Gift className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-pink-400 bg-clip-text text-transparent">
                  Daily Login Rewards
                </h2>
                <p className="text-slate-400 text-sm mt-1">Claim your reward every 20 hours</p>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-6">
                {[10, 15, 20, 30, 50, 75, 100].map((reward, idx) => {
                  const currentDay = (dailyRewardData?.currentStreak || 0) % 7;
                  const isPast = idx < currentDay;
                  const isCurrent = idx === currentDay;
                  return (
                    <div
                      key={idx}
                      className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs ${
                        isPast 
                          ? "bg-green-500/20 border border-green-500/30" 
                          : isCurrent 
                            ? "bg-amber-500/20 border-2 border-amber-400 animate-pulse" 
                            : "bg-slate-800/50 border border-slate-700"
                      }`}
                    >
                      <span className="font-bold text-white">{reward}</span>
                      <span className="text-slate-400">🐚</span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Current Streak</span>
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Flame className="w-4 h-4" />
                    {dailyRewardData?.currentStreak || 0} days
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Longest Streak</span>
                  <span className="text-purple-400">{dailyRewardData?.longestStreak || 0} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Total Logins</span>
                  <span className="text-cyan-400">{dailyRewardData?.totalLogins || 0}</span>
                </div>
              </div>

              <Button
                onClick={() => claimDailyRewardMutation.mutate()}
                disabled={!dailyRewardData?.canClaim || claimDailyRewardMutation.isPending}
                className="w-full bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 disabled:opacity-50"
                data-testid="button-claim-reward-page"
              >
                {claimDailyRewardMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : dailyRewardData?.canClaim ? (
                  <>
                    <Gift className="w-4 h-4 mr-2" />
                    Claim +{dailyRewardData.nextReward} Shells
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 mr-2" />
                    Available in {Math.ceil(dailyRewardData?.hoursUntilClaim || 0)}h
                  </>
                )}
              </Button>
            </GlassCard>
          </motion.div>
        )}

        {/* Builder Tab */}
        {activeTab === "builder" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Character Portrait & Stats */}
          <Card className="bg-slate-900/80 border-slate-700 p-6">
            <div className="text-center mb-6">
              <CharacterPortrait
                characterName={personality.parallelSelfName}
                primaryTrait={personality.primaryTrait || personality.predictedArchetype || "leader"}
                secondaryTrait={personality.secondaryTrait || "builder"}
                colorPreference={personality.colorPreference || "cyan"}
                coreValues={personality.coreValues || []}
                size="lg"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Buildings Placed</span>
                <span className="text-white">{countBuildings()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Estate Level</span>
                <span className="text-white">{playerLevel}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Shells Available</span>
                <span className="text-amber-400">{shellsBalance.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-700">
              <Badge variant="outline" className="w-full justify-center border-purple-500/50 text-purple-400 py-2">
                <Sparkles className="w-3 h-3 mr-2" />
                Season Zero Preview
              </Badge>
              <p className="text-xs text-slate-500 text-center mt-2">
                Click Save to persist your estate. More features coming in Season 1!
              </p>
            </div>
          </Card>

          {/* Grid Builder */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-900/80 border-slate-700 p-4 md:p-6">
              {/* Tools */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Button
                  variant={isEraseMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setIsEraseMode(!isEraseMode);
                    setSelectedBuilding(null);
                  }}
                  className={isEraseMode ? "bg-red-500 hover:bg-red-600" : "border-slate-600"}
                >
                  <Minus className="w-4 h-4 mr-1" />
                  Erase
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetGrid}
                  className="border-slate-600"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
                <Button
                  variant={hasChanges ? "default" : "outline"}
                  size="sm"
                  onClick={saveEstate}
                  disabled={!hasChanges || isSaving}
                  className={hasChanges ? "bg-green-500 hover:bg-green-600" : "border-slate-600"}
                  data-testid="button-save-estate"
                >
                  <Save className="w-4 h-4 mr-1" />
                  {isSaving ? "Saving..." : hasChanges ? "Save" : "Saved"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowShop(!showShop)}
                  className="border-slate-600 ml-auto"
                >
                  <ShoppingBag className="w-4 h-4 mr-1" />
                  {showShop ? "Hide Shop" : "Shop"}
                </Button>
              </div>

              {/* Building Palette */}
              <div className="mb-4">
                <Tabs defaultValue="structures" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                    <TabsTrigger value="structures">Structures</TabsTrigger>
                    <TabsTrigger value="nature">Nature</TabsTrigger>
                    <TabsTrigger value="decoration">Decor</TabsTrigger>
                  </TabsList>
                  
                  {["structures", "nature", "decoration"].map(category => (
                    <TabsContent key={category} value={category} className="mt-3">
                      <div className="flex flex-wrap gap-2">
                        {BUILDINGS.filter(b => b.category === category).map((building) => {
                          const isLocked = building.unlockLevel > playerLevel;
                          const isSelected = selectedBuilding === building.id;
                          const Icon = building.icon;
                          
                          return (
                            <Button
                              key={building.id}
                              variant={isSelected ? "default" : "outline"}
                              size="sm"
                              disabled={isLocked}
                              onClick={() => {
                                setSelectedBuilding(building.id);
                                setIsEraseMode(false);
                              }}
                              className={`relative ${isSelected ? "bg-cyan-500" : "border-slate-600"}`}
                              data-testid={`building-${building.id}`}
                            >
                              {isLocked && <Lock className="w-3 h-3 absolute -top-1 -right-1 text-amber-400" />}
                              <Icon className="w-4 h-4 mr-1" />
                              {building.name}
                              {building.cost > 0 && (
                                <span className="ml-1 text-amber-400 text-xs">({building.cost})</span>
                              )}
                            </Button>
                          );
                        })}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>

              {/* Grid */}
              <div 
                className="aspect-square max-w-md mx-auto bg-slate-800/50 rounded-lg p-2 border border-slate-700"
                style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                  backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%`,
                }}
              >
                <div className="grid grid-cols-8 gap-1 h-full">
                  {grid.map((row, y) =>
                    row.map((cell, x) => {
                      const Icon = getBuildingIcon(cell.building);
                      return (
                        <motion.div
                          key={`${x}-${y}`}
                          data-testid={`cell-${x}-${y}`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCellClick(x, y)}
                          className={`
                            aspect-square rounded cursor-pointer transition-all
                            flex items-center justify-center
                            ${BUILDING_COLORS[cell.building]}
                            ${cell.building === "empty" ? "hover:bg-slate-700" : ""}
                            ${selectedBuilding || isEraseMode ? "ring-1 ring-cyan-500/30" : ""}
                          `}
                        >
                          {cell.building !== "empty" && (
                            <Icon className="w-4 h-4 md:w-5 md:h-5 text-white drop-shadow" />
                          )}
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>

              <p className="text-center text-xs text-slate-500 mt-4">
                Select a building above, then tap on the grid to place it
              </p>
            </Card>
          </div>

          {/* Coming Soon Features */}
          <Card className="mt-6 bg-slate-900/80 border-slate-700 p-6 lg:col-span-3">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Coming in Future Seasons
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: "NPC Visitors", desc: "Characters visit your estate" },
                { title: "Player Trading", desc: "Trade items with others" },
                { title: "Era Themes", desc: "Transform your estate by era" },
                { title: "Achievements", desc: "Unlock rewards for building" },
              ].map((feature, i) => (
                <div key={i} className="text-center p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                  <Lock className="w-6 h-6 mx-auto text-slate-500 mb-2" />
                  <p className="text-sm font-medium text-white">{feature.title}</p>
                  <p className="text-xs text-slate-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
        )}
      </div>

      {/* NPC Chat */}
      {!showNPC && personality?.parallelSelfName && (
        <NPCChatButton onClick={() => setShowNPC(true)} />
      )}
      
      <ChroniclesNPC
        characterName={personality?.parallelSelfName || "Traveler"}
        personalityTraits={personality?.coreValues || []}
        isOpen={showNPC}
        onClose={() => setShowNPC(false)}
      />
    </div>
  );
}
