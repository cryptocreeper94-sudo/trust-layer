import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Home, TreeDeciduous, Mountain, Droplets, Store, Hammer,
  Plus, Minus, RotateCcw, Save, Coins, Lock, Sparkles,
  ChevronRight, User, Grid3X3, Eye, ShoppingBag, Crown,
  Rocket, Building2, MapPin, Gift, Briefcase, Calendar, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSimpleAuth } from "@/hooks/use-simple-auth";
import { CharacterPortrait } from "@/components/character-portrait";
import { ChroniclesNPC, NPCChatButton } from "@/components/chronicles-npc";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "sonner";

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
  const [showComingSoon, setShowComingSoon] = useState(true);

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
    <div className="min-h-screen bg-slate-950">
      {/* Coming Soon Features Modal */}
      <AnimatePresence>
        {showComingSoon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_60px_rgba(6,182,212,0.2)]"
            >
              <button
                onClick={() => setShowComingSoon(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                data-testid="button-close-coming-soon"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Major Update Coming!</h2>
                <p className="text-slate-400">Exciting new features arriving within the next week</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <MapPin className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white text-sm">City Zoning System</h3>
                    <p className="text-xs text-slate-400">Residential & commercial districts, just like real cities</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <Building2 className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white text-sm">Plot Marketplace</h3>
                    <p className="text-xs text-slate-400">Buy and expand your land with Shells (and soon DWC)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <Briefcase className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white text-sm">Business Onboarding</h3>
                    <p className="text-xs text-slate-400">Verified businesses get access to commercial properties</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <Gift className="w-5 h-5 text-pink-400 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white text-sm">Daily Login Rewards</h3>
                    <p className="text-xs text-slate-400">Earn Shells every day just for playing</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <Calendar className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white text-sm">Era-Appropriate Settlements</h3>
                    <p className="text-xs text-slate-400">Each era has unique building styles and layouts</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setShowComingSoon(false)}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500"
                data-testid="button-got-it"
              >
                Got It - Let Me Build!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-slate-900/80 border-b border-slate-700 p-4">
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
              <h1 className="text-xl font-bold text-white">{personality.parallelSelfName}'s Estate</h1>
              <p className="text-sm text-slate-400">Season Zero - Build Your Legacy</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-amber-500/50 text-amber-400">
              <Coins className="w-3 h-3 mr-1" />
              {shellsBalance.toLocaleString()} Shells
            </Badge>
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
              Level {playerLevel}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-6">
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
        </div>

        {/* Coming Soon Features */}
        <Card className="mt-6 bg-slate-900/80 border-slate-700 p-6">
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
