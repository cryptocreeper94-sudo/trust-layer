import { useState, useEffect, useRef, Suspense, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { 
  Home, TreeDeciduous, Mountain, Droplets, Store, Hammer, ArrowLeft,
  Plus, Minus, RotateCcw, Save, Coins, Lock, Sparkles,
  ChevronRight, User, Grid3X3, Eye, ShoppingBag, Crown,
  Rocket, Building2, MapPin, Gift, Briefcase, Calendar, X,
  Timer, Flame, Clock, Zap, Map, ShoppingCart, DoorOpen, Box, Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { CharacterPortrait } from "@/components/character-portrait";
import { ChroniclesNPC, NPCChatButton } from "@/components/chronicles-npc";
import { GlassCard } from "@/components/glass-card";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "sonner";
import { getChroniclesSession } from "@/pages/chronicles-login";

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

const ERA_COLORS: Record<string, { ground: string; ambient: string; sky: string }> = {
  modern: { ground: "#1a2332", ambient: "#60a5fa", sky: "#0f172a" },
  medieval: { ground: "#2d1f0e", ambient: "#d97706", sky: "#1c1917" },
  wildwest: { ground: "#3d2b1a", ambient: "#f59e0b", sky: "#292524" },
};

const BUILDING_3D_COLORS: Record<BuildingType, string> = {
  empty: "#1e293b",
  house: "#d97706",
  tree: "#16a34a",
  garden: "#ec4899",
  pond: "#3b82f6",
  shop: "#a855f7",
  workshop: "#f97316",
  monument: "#eab308",
  wall: "#64748b",
  path: "#a8a29e",
};

function Building3D({ type, x, z, era }: { type: BuildingType; x: number; z: number; era: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = BUILDING_3D_COLORS[type];
  
  useFrame((state) => {
    if (meshRef.current && type !== "path" && type !== "wall") {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5 + x + z) * 0.02 + getHeight(type) / 2;
    }
  });

  const getHeight = (t: BuildingType) => {
    switch(t) {
      case "house": return era === "medieval" ? 1.4 : era === "wildwest" ? 1.0 : 1.2;
      case "tree": return 1.8;
      case "garden": return 0.3;
      case "pond": return 0.15;
      case "shop": return 1.0;
      case "workshop": return 1.3;
      case "monument": return 2.2;
      case "wall": return 0.8;
      case "path": return 0.05;
      default: return 0;
    }
  };

  if (type === "empty") return null;

  const height = getHeight(type);

  if (type === "tree") {
    return (
      <group position={[x - 3.5, 0, z - 3.5]}>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 0.8, 6]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh ref={meshRef} position={[0, 1.1, 0]}>
          <sphereGeometry args={[0.4, 8, 6]} />
          <meshStandardMaterial color={era === "wildwest" ? "#6b7c3f" : "#22c55e"} roughness={0.8} />
        </mesh>
      </group>
    );
  }

  if (type === "pond") {
    return (
      <group position={[x - 3.5, 0.08, z - 3.5]}>
        <mesh rotation={[-Math.PI/2, 0, 0]}>
          <circleGeometry args={[0.4, 16]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.7} roughness={0.1} metalness={0.3} />
        </mesh>
      </group>
    );
  }

  if (type === "garden") {
    return (
      <group position={[x - 3.5, 0, z - 3.5]}>
        {[0, 1, 2, 3, 4].map(i => (
          <mesh key={i} position={[Math.cos(i*1.3)*0.25, 0.15, Math.sin(i*1.3)*0.25]}>
            <sphereGeometry args={[0.1, 6, 4]} />
            <meshStandardMaterial color={["#ec4899", "#f472b6", "#a855f7", "#f43f5e", "#fb923c"][i]} />
          </mesh>
        ))}
      </group>
    );
  }

  if (type === "monument") {
    return (
      <group position={[x - 3.5, 0, z - 3.5]}>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.6, 0.3, 0.6]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.12, 0.18, 1.0, 8]} />
          <meshStandardMaterial color="#eab308" metalness={0.6} roughness={0.2} />
        </mesh>
        <mesh ref={meshRef} position={[0, 1.5, 0]}>
          <octahedronGeometry args={[0.2]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.5} metalness={0.8} roughness={0.1} />
        </mesh>
      </group>
    );
  }

  if (type === "path") {
    return (
      <mesh position={[x - 3.5, 0.03, z - 3.5]} rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[0.85, 0.85]} />
        <meshStandardMaterial color={era === "wildwest" ? "#a8876b" : "#78716c"} />
      </mesh>
    );
  }

  const roofColor = era === "medieval" ? "#8B0000" : era === "wildwest" ? "#5c3a1e" : "#475569";
  const wallColor = era === "medieval" ? "#d4c5a9" : era === "wildwest" ? "#c9a96e" : color;

  return (
    <group position={[x - 3.5, 0, z - 3.5]}>
      <mesh ref={meshRef} position={[0, height/2, 0]}>
        <boxGeometry args={[0.7, height, 0.7]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
      {(type === "house" || type === "shop" || type === "workshop") && (
        <mesh position={[0, height + 0.15, 0]} rotation={[0, Math.PI/4, 0]}>
          <coneGeometry args={[0.55, 0.35, 4]} />
          <meshStandardMaterial color={roofColor} />
        </mesh>
      )}
    </group>
  );
}

function GroundPlane({ era }: { era: string }) {
  const colors = ERA_COLORS[era] || ERA_COLORS.modern;
  return (
    <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color={colors.ground} />
    </mesh>
  );
}

function GridLines() {
  const lines = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= GRID_SIZE; i++) {
      const pos = i - GRID_SIZE/2;
      pts.push([-GRID_SIZE/2, 0.01, pos], [GRID_SIZE/2, 0.01, pos]);
      pts.push([pos, 0.01, -GRID_SIZE/2], [pos, 0.01, GRID_SIZE/2]);
    }
    return pts;
  }, []);

  return (
    <group>
      {Array.from({ length: lines.length / 2 }).map((_, i) => {
        const start = lines[i * 2];
        const end = lines[i * 2 + 1];
        const geometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(...start),
          new THREE.Vector3(...end),
        ]);
        return (
          <lineSegments key={i} geometry={geometry}>
            <lineBasicMaterial color="#334155" transparent opacity={0.4} />
          </lineSegments>
        );
      })}
    </group>
  );
}

function Estate3DScene({ grid, era }: { grid: GridCell[][]; era: string }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} castShadow />
      <pointLight position={[-3, 4, -3]} intensity={0.3} color={ERA_COLORS[era]?.ambient || "#60a5fa"} />
      <GroundPlane era={era} />
      <GridLines />
      {grid.map((row, z) =>
        row.map((cell, x) => (
          <Building3D key={`${x}-${z}`} type={cell.building} x={x} z={z} era={era} />
        ))
      )}
      <OrbitControls 
        enablePan={false}
        minPolarAngle={Math.PI/6}
        maxPolarAngle={Math.PI/2.5}
        minDistance={4}
        maxDistance={14}
        target={[0, 0, 0]}
      />
    </>
  );
}

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
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [authLoading, setAuthLoading] = useState(true);
  const [chroniclesAccount, setChroniclesAccount] = useState<{ id: string; username: string } | null>(null);
  
  const [grid, setGrid] = useState<GridCell[][]>(createEmptyGrid);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingType | null>(null);
  const [isEraseMode, setIsEraseMode] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showNPC, setShowNPC] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => {
    return !localStorage.getItem("chronicles_welcomed");
  });

  useEffect(() => {
    const session = getChroniclesSession();
    if (!session) {
      setLocation("/chronicles/login");
      return;
    }
    fetch("/api/chronicles/auth/session", {
      headers: { Authorization: `Bearer ${session.token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setChroniclesAccount(data.account);
        } else {
          setLocation("/chronicles/login");
        }
        setAuthLoading(false);
      })
      .catch(() => {
        setLocation("/chronicles/login");
        setAuthLoading(false);
      });
  }, [setLocation]);

  const { data: shellsData } = useQuery({
    queryKey: ["/api/shells/balance"],
    queryFn: async () => {
      const session = getChroniclesSession();
      const res = await fetch("/api/shells/balance", {
        headers: { Authorization: `Bearer ${session?.token}` }
      });
      return res.json();
    },
    enabled: !!chroniclesAccount,
  });

  const { data: personalityData } = useQuery({
    queryKey: ["/api/chronicles/personality"],
    queryFn: async () => {
      const session = getChroniclesSession();
      const res = await fetch("/api/chronicles/personality", {
        headers: { Authorization: `Bearer ${session?.token}` }
      });
      return res.json();
    },
    enabled: !!chroniclesAccount,
  });

  const [selectedEra, setSelectedEra] = useState("modern");
  const [show3D, setShow3D] = useState(false);

  const { data: estateData, isLoading: estateLoading } = useQuery({
    queryKey: ["/api/chronicles/estate", selectedEra],
    queryFn: async () => {
      const session = getChroniclesSession();
      const res = await fetch(`/api/chronicles/estate?era=${selectedEra}`, {
        headers: { Authorization: `Bearer ${session?.token}` }
      });
      return res.json();
    },
    enabled: !!chroniclesAccount,
  });

  useEffect(() => {
    if (estateData?.estate?.gridData && Array.isArray(estateData.estate.gridData) && estateData.estate.gridData.length > 0) {
      setGrid(estateData.estate.gridData);
    } else {
      setGrid(createEmptyGrid());
    }
  }, [estateData, selectedEra]);

  const saveEstateMutation = useMutation({
    mutationFn: async (gridData: GridCell[][]) => {
      const session = getChroniclesSession();
      const totalBuildings = gridData.flat().filter(c => c.building !== "empty").length;
      const res = await fetch("/api/chronicles/estate", {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${session?.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ gridData, totalBuildings, shellsSpent: 0, era: selectedEra })
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to save");
      return res.json();
    },
    onSuccess: () => {
      setHasChanges(false);
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/estate", selectedEra] });
      toast.success("Estate saved!", { description: `Your ${selectedEra} era estate has been saved.` });
    },
    onError: (error: any) => {
      toast.error("Failed to save", { description: error.message || "Please try again." });
    }
  });
  const [selectedZone, setSelectedZone] = useState<CityZone | null>(null);
  const [activeTab, setActiveTab] = useState("builder");

  const { data: zonesData } = useQuery({
    queryKey: ["/api/chronicles/zones", selectedEra],
    queryFn: async () => {
      const session = getChroniclesSession();
      const res = await fetch(`/api/chronicles/zones?era=${selectedEra}`, {
        headers: { Authorization: `Bearer ${session?.token}` }
      });
      return res.json();
    },
    enabled: !!chroniclesAccount,
  });

  const { data: zonePlotsData, refetch: refetchPlots } = useQuery({
    queryKey: ["/api/chronicles/zones", selectedZone?.id, "plots"],
    queryFn: async () => {
      const session = getChroniclesSession();
      const res = await fetch(`/api/chronicles/zones/${selectedZone!.id}/plots`, {
        headers: { Authorization: `Bearer ${session?.token}` }
      });
      return res.json();
    },
    enabled: !!selectedZone,
  });

  const { data: dailyRewardData, refetch: refetchDailyReward } = useQuery<DailyRewardData>({
    queryKey: ["/api/chronicles/daily-reward"],
    queryFn: async () => {
      const session = getChroniclesSession();
      const res = await fetch("/api/chronicles/daily-reward", {
        headers: { Authorization: `Bearer ${session?.token}` }
      });
      return res.json();
    },
    enabled: !!chroniclesAccount,
  });

  const { data: eraBuildingsData } = useQuery({
    queryKey: ["/api/chronicles/era-buildings", selectedEra],
    queryFn: async () => {
      const session = getChroniclesSession();
      const res = await fetch(`/api/chronicles/era-buildings/${selectedEra}`, {
        headers: { Authorization: `Bearer ${session?.token}` }
      });
      return res.json();
    },
    enabled: !!chroniclesAccount,
  });

  // Mirror-Life Experience Queries
  const { data: echoPersonaData } = useQuery({
    queryKey: ["/api/chronicles/echo-persona"],
    queryFn: async () => {
      const session = getChroniclesSession();
      const res = await fetch("/api/chronicles/echo-persona", {
        headers: { Authorization: `Bearer ${session?.token}` }
      });
      return res.json();
    },
    enabled: !!chroniclesAccount,
  });

  const { data: morningPulseData, refetch: refetchPulse } = useQuery({
    queryKey: ["/api/chronicles/morning-pulse"],
    queryFn: async () => {
      const session = getChroniclesSession();
      const res = await fetch("/api/chronicles/morning-pulse", {
        headers: { Authorization: `Bearer ${session?.token}` }
      });
      return res.json();
    },
    enabled: !!chroniclesAccount,
  });

  const { data: anomaliesData } = useQuery({
    queryKey: ["/api/chronicles/anomalies"],
    queryFn: async () => {
      const session = getChroniclesSession();
      const res = await fetch("/api/chronicles/anomalies", {
        headers: { Authorization: `Bearer ${session?.token}` }
      });
      return res.json();
    },
    enabled: !!chroniclesAccount,
  });

  const { data: questsData, refetch: refetchQuests } = useQuery({
    queryKey: ["/api/chronicles/quests"],
    queryFn: async () => {
      const session = getChroniclesSession();
      const res = await fetch("/api/chronicles/quests", {
        headers: { Authorization: `Bearer ${session?.token}` }
      });
      return res.json();
    },
    enabled: !!chroniclesAccount,
  });

  const [showMorningPulse, setShowMorningPulse] = useState(false);
  const [showEchoPersona, setShowEchoPersona] = useState(false);

  // Show Morning Pulse on first load if not claimed today
  useEffect(() => {
    if (morningPulseData && !morningPulseData.claimed && chroniclesAccount) {
      setShowMorningPulse(true);
    }
  }, [morningPulseData, chroniclesAccount]);

  const claimMorningPulseMutation = useMutation({
    mutationFn: async () => {
      const session = getChroniclesSession();
      const res = await fetch("/api/chronicles/morning-pulse/claim", {
        method: "POST",
        headers: { Authorization: `Bearer ${session?.token}` }
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to claim");
      return res.json();
    },
    onSuccess: (data) => {
      refetchPulse();
      setShowMorningPulse(false);
      toast.success(data.message || "Morning Pulse claimed!");
    },
    onError: (error: any) => {
      toast.error("Could not claim pulse", { description: error.message });
    }
  });

  const generateInsightMutation = useMutation({
    mutationFn: async () => {
      const session = getChroniclesSession();
      const res = await fetch("/api/chronicles/echo-persona/insight", {
        method: "POST",
        headers: { Authorization: `Bearer ${session?.token}` }
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to generate");
      return res.json();
    },
    onSuccess: (data) => {
      toast.success("Your Echo speaks...", { description: data.insight?.substring(0, 100) + "..." });
    },
    onError: (error: any) => {
      toast.error("The Echo is silent", { description: error.message });
    }
  });

  const claimDailyRewardMutation = useMutation({
    mutationFn: async () => {
      const session = getChroniclesSession();
      const res = await fetch("/api/chronicles/daily-reward/claim", {
        method: "POST",
        headers: { Authorization: `Bearer ${session?.token}` }
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to claim");
      return res.json();
    },
    onSuccess: (data) => {
      refetchDailyReward();
      queryClient.invalidateQueries({ queryKey: ["/api/shells/balance"] });
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
      const session = getChroniclesSession();
      const res = await fetch(`/api/chronicles/plots/${plotId}/purchase`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session?.token}` }
      });
      if (!res.ok) throw new Error((await res.json()).error || "Purchase failed");
      return res.json();
    },
    onSuccess: () => {
      refetchPlots();
      queryClient.invalidateQueries({ queryKey: ["/api/shells/balance"] });
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

  if (!chroniclesAccount) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-slate-900/80 border-slate-700 p-8 text-center">
          <User className="w-16 h-16 mx-auto text-cyan-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Sign In Required</h2>
          <p className="text-slate-400 mb-6">Create your character first to access your estate</p>
          <Button onClick={() => setLocation("/chronicles/login")} className="bg-gradient-to-r from-cyan-500 to-purple-500">
            Sign In to Chronicles
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
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="h-8 text-xs gap-1 hover:bg-white/5 px-2 text-muted-foreground hover:text-white"
              data-testid="button-back"
            >
              <ArrowLeft className="w-3 h-3" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs gap-1 hover:bg-white/5 px-2 text-muted-foreground hover:text-white"
                data-testid="button-home"
              >
                <Home className="w-3 h-3" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
          </div>
          <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 text-xs">
            Estate
          </Badge>
        </div>
      </nav>

      {/* Floating Ambient Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-40 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: "1s" }} />

      {/* Chronicle Initiation Welcome Modal */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-lg w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-cyan-500/30 shadow-[0_0_60px_rgba(0,255,255,0.2)] overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  Welcome to the Veil
                </h2>
                <p className="text-slate-300 mb-6">
                  You are about to live a <span className="text-cyan-400 font-semibold">parallel life</span> - 
                  an alternate version of yourself across time and space.
                </p>
                
                <div className="space-y-4 text-left mb-6">
                  <div className="flex gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">1:1 Real Time</p>
                      <p className="text-slate-400 text-xs">A day here is a day there. Your choices unfold naturally.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Map className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Shape the World</p>
                      <p className="text-slate-400 text-xs">Your decisions ripple through society. The world changes based on collective choices.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                      <Gift className="w-4 h-4 text-pink-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Earn Shells Daily</p>
                      <p className="text-slate-400 text-xs">Check in every 24 hours to earn Shells. Build your estate, own land, grow your legacy.</p>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={() => {
                    localStorage.setItem("chronicles_welcomed", "true");
                    setShowWelcome(false);
                  }}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-semibold py-3"
                  data-testid="button-begin-chronicle"
                >
                  Begin My Chronicle
                </Button>
                
                <p className="text-slate-500 text-xs mt-4">
                  Shells convert to SIG tokens at launch (100 Shells = 1 SIG)
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Morning Pulse Modal */}
      <AnimatePresence>
        {showMorningPulse && morningPulseData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-md w-full"
            >
              <GlassCard glow className="p-6 text-center">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center animate-pulse shadow-[0_0_40px_rgba(0,255,255,0.4)]">
                    <Clock className="w-12 h-12 text-white" />
                  </div>
                </div>
                
                <div className="mt-12 mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Morning Pulse
                  </h2>
                  <p className="text-slate-400 text-sm mt-2">A new day dawns across all eras</p>
                </div>
                
                <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                  <p className="text-white italic">"{morningPulseData.pulseMessage || 'The cosmos awaits your choices.'}"</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-cyan-400 text-2xl font-bold">{morningPulseData.pendingQuestsCount || 3}</p>
                    <p className="text-slate-400 text-xs">Quests Today</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-pink-400 text-2xl font-bold">{morningPulseData.activeAnomaliesCount || 0}</p>
                    <p className="text-slate-400 text-xs">Active Anomalies</p>
                  </div>
                </div>
                
                {morningPulseData.activeAnomalies?.length > 0 && (
                  <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg p-3 mb-4 border border-cyan-500/30">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      <p className="text-cyan-300 text-sm font-medium">
                        {morningPulseData.activeAnomalies[0]?.title}
                      </p>
                    </div>
                    <p className="text-slate-400 text-xs mt-1">
                      {morningPulseData.activeAnomalies[0]?.description}
                    </p>
                  </div>
                )}
                
                <Button
                  onClick={() => claimMorningPulseMutation.mutate()}
                  disabled={claimMorningPulseMutation.isPending}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-semibold py-3"
                  data-testid="button-claim-pulse"
                >
                  {claimMorningPulseMutation.isPending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Begin Today's Journey"
                  )}
                </Button>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Echo Persona Modal */}
      <AnimatePresence>
        {showEchoPersona && echoPersonaData?.persona && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowEchoPersona(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-lg w-full"
              onClick={e => e.stopPropagation()}
            >
              <GlassCard glow className="p-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowEchoPersona(false)}
                  className="absolute top-2 right-2 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </Button>
                
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(0,255,255,0.3)]">
                    <Eye className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Your Echo
                  </h2>
                  <p className="text-slate-400 text-sm">The mirror of your parallel self</p>
                </div>
                
                {echoPersonaData.persona.dominantTraits?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Dominant Traits</p>
                    <div className="flex flex-wrap gap-2">
                      {echoPersonaData.persona.dominantTraits.map((trait: string) => (
                        <Badge key={trait} className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border-cyan-500/30">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                    <p className="text-cyan-400 text-lg font-bold">{echoPersonaData.persona.totalChoicesMade}</p>
                    <p className="text-slate-400 text-xs">Choices</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                    <p className="text-pink-400 text-lg font-bold">{echoPersonaData.persona.totalNpcInteractions}</p>
                    <p className="text-slate-400 text-xs">NPC Chats</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                    <p className="text-amber-400 text-lg font-bold">{echoPersonaData.persona.totalBuildingsPlaced}</p>
                    <p className="text-slate-400 text-xs">Buildings</p>
                  </div>
                </div>
                
                {echoPersonaData.persona.latestInsight && (
                  <div className="bg-slate-800/50 rounded-lg p-4 mb-4 border border-emerald-500/20">
                    <p className="text-white italic text-sm">"{echoPersonaData.persona.latestInsight}"</p>
                  </div>
                )}
                
                <Button
                  onClick={() => generateInsightMutation.mutate()}
                  disabled={generateInsightMutation.isPending}
                  className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white"
                  data-testid="button-generate-insight"
                >
                  {generateInsightMutation.isPending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Commune with Echo
                    </>
                  )}
                </Button>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Veil Anomaly Banner */}
      {anomaliesData?.anomalies?.length > 0 && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 border-b border-cyan-500/30"
        >
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center animate-pulse">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-cyan-300 font-semibold text-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {anomaliesData.anomalies[0]?.title}
                </p>
                <p className="text-slate-400 text-xs">
                  {anomaliesData.anomalies[0]?.description?.substring(0, 60)}...
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

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
                ≈ {(shellsBalance / 100).toFixed(2)} SIG at launch
              </span>
            </div>
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
              Level {playerLevel}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEchoPersona(true)}
              className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
              data-testid="button-open-echo"
            >
              <Eye className="w-4 h-4 mr-1" />
              Echo
            </Button>
          </div>
        </div>
      </div>

      {/* Quest Progress Section */}
      {questsData && (questsData.daily?.length > 0 || questsData.weekly?.length > 0) && (
        <div className="bg-slate-900/50 border-b border-slate-700 px-4 py-3">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <Timer className="w-4 h-4 text-cyan-400" />
              <span className="text-white text-sm font-medium">Active Quests</span>
              <Badge variant="secondary" className="text-xs">{(questsData.daily?.length || 0) + (questsData.weekly?.length || 0)}</Badge>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {[...(questsData.daily || []), ...(questsData.weekly || [])].slice(0, 4).map((quest: any) => (
                <div key={quest.id} className="flex-shrink-0 bg-slate-800/60 rounded-lg p-3 min-w-[200px] border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${quest.questType === 'daily' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-purple-500/20 text-purple-400'}`}>
                      {quest.questType}
                    </span>
                    <span className="text-amber-400 text-xs">+{quest.shellReward} ⭐</span>
                  </div>
                  <p className="text-white text-sm font-medium">{quest.title}</p>
                  <div className="mt-2">
                    <Progress value={(quest.currentProgress / quest.targetProgress) * 100} className="h-1.5" />
                    <p className="text-slate-400 text-xs mt-1">{quest.currentProgress}/{quest.targetProgress}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SIG Conversion Banner */}
      <div className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border-y border-cyan-500/20 py-2 px-4 relative z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 text-sm">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300">
            <span className="text-cyan-400 font-semibold">Shells → SIG:</span> All Shells convert to Signal at <span className="text-white font-bold">100 Shells = 1 SIG</span> at launch
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
            { id: "interior", label: "Enter Home", icon: DoorOpen, isLink: true, href: "/chronicles/interior" },
            { id: "zones", label: "City Zones", icon: Map },
            { id: "marketplace", label: "Plot Market", icon: ShoppingCart },
            { id: "rewards", label: "Daily Rewards", icon: Gift },
          ].map((tab: any) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id && !tab.isLink ? "default" : "outline"}
              onClick={() => tab.isLink ? setLocation(tab.href) : setActiveTab(tab.id)}
              className={tab.isLink 
                ? "bg-gradient-to-r from-pink-500 to-amber-500 text-white shrink-0 shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                : activeTab === tab.id 
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
            {/* Era Progression - Portal System */}
            <GlassCard glow className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white">Time Portal - Era Travel</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: "modern", label: "Modern Day", emoji: "🏙️", unlockLevel: 0, unlockDesc: "Starting Era", color: "from-cyan-500 to-blue-500" },
                  { id: "medieval", label: "Medieval", emoji: "🏰", unlockLevel: 5, unlockDesc: "Complete 5 Modern quests to unlock", color: "from-amber-500 to-orange-500" },
                  { id: "wildwest", label: "Wild West", emoji: "🤠", unlockLevel: 10, unlockDesc: "Complete 10 quests across eras to unlock", color: "from-yellow-600 to-red-500" },
                ].map((era) => {
                  const isUnlocked = playerLevel >= era.unlockLevel;
                  const isActive = selectedEra === era.id;
                  return (
                    <div
                      key={era.id}
                      onClick={() => {
                        if (isUnlocked) {
                          setSelectedEra(era.id);
                          setSelectedZone(null);
                        } else {
                          toast.error("Era Locked", { description: era.unlockDesc });
                        }
                      }}
                      data-testid={`era-${era.id}`}
                      className={`relative rounded-xl p-4 cursor-pointer transition-all border-2 ${
                        isActive 
                          ? "border-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.2)]" 
                          : isUnlocked 
                            ? "border-white/10 hover:border-white/30" 
                            : "border-slate-700/50 opacity-60"
                      } ${isUnlocked ? "bg-slate-800/50" : "bg-slate-900/80"}`}
                    >
                      {!isUnlocked && (
                        <div className="absolute inset-0 rounded-xl bg-black/40 flex flex-col items-center justify-center z-10 backdrop-blur-[1px]">
                          <Lock className="w-6 h-6 text-slate-400 mb-1" />
                          <span className="text-xs text-slate-400 text-center px-2">Level {era.unlockLevel}</span>
                        </div>
                      )}
                      <div className="text-center">
                        <span className="text-3xl block mb-2">{era.emoji}</span>
                        <p className={`font-bold text-sm ${isActive ? "bg-gradient-to-r bg-clip-text text-transparent " + era.color : "text-white"}`}>
                          {era.label}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {isUnlocked ? (isActive ? "Currently exploring" : "Tap to travel") : era.unlockDesc}
                        </p>
                      </div>
                      {isActive && (
                        <motion.div 
                          layoutId="era-indicator"
                          className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-gradient-to-r ${era.color}`} 
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            {/* Zones Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {zones.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <Map className="w-12 h-12 mx-auto text-slate-600 mb-3" />
                  <p className="text-slate-400">Loading city zones...</p>
                </div>
              )}
              {zones.map((zone) => (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  data-testid={`zone-${zone.id}`}
                  className="cursor-pointer"
                >
                  <GlassCard
                    glow
                    className={`p-4 transition-all ${
                      selectedZone?.id === zone.id ? "ring-2 ring-cyan-400" : ""
                    }`}
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
                </div>
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
        <div className="space-y-6">
          {/* Live World Status Bar */}
          <GlassCard glow className="p-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-50" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-green-400">WORLD LIVE</p>
                  <p className="text-[10px] text-slate-400">Players & NPCs shaping all eras in real-time</p>
                </div>
              </div>
              <div className="flex gap-2">
                {[
                  { id: "modern", emoji: "🏙️", label: "Modern", level: 0 },
                  { id: "medieval", emoji: "🏰", label: "Medieval", level: 5 },
                  { id: "wildwest", emoji: "🤠", label: "Wild West", level: 10 },
                ].map(era => {
                  const isUnlocked = playerLevel >= era.level;
                  const isActive = selectedEra === era.id;
                  return (
                    <Button
                      key={era.id}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      disabled={!isUnlocked}
                      onClick={() => {
                        if (isUnlocked) {
                          if (hasChanges) {
                            toast.error("Save your estate before traveling!");
                            return;
                          }
                          setSelectedEra(era.id);
                        } else {
                          toast.error("Era Locked", { description: `Reach level ${era.level} to unlock` });
                        }
                      }}
                      className={`text-xs ${
                        isActive 
                          ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white" 
                          : !isUnlocked 
                            ? "border-slate-700 text-slate-600 opacity-50" 
                            : "border-slate-600 text-slate-300"
                      }`}
                      data-testid={`builder-era-${era.id}`}
                    >
                      <span className="mr-1">{era.emoji}</span>
                      {era.label}
                      {!isUnlocked && <Lock className="w-3 h-3 ml-1" />}
                    </Button>
                  );
                })}
              </div>
            </div>
          </GlassCard>

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
                <span className="text-slate-400">Current Era</span>
                <span className="text-cyan-400 font-semibold">
                  {selectedEra === "modern" ? "🏙️ Modern" : selectedEra === "medieval" ? "🏰 Medieval" : "🤠 Wild West"}
                </span>
              </div>
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

            <div className="mt-4 pt-4 border-t border-slate-700 space-y-2">
              <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Persistent World</p>
                <p className="text-xs text-slate-300">Other players and smart NPCs continue shaping all eras even while you're away.</p>
              </div>
              <Badge variant="outline" className="w-full justify-center border-purple-500/50 text-purple-400 py-2">
                <Sparkles className="w-3 h-3 mr-2" />
                Season Zero Preview
              </Badge>
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
                <div className="ml-auto flex gap-2">
                  <Button
                    variant={show3D ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShow3D(!show3D)}
                    className={show3D ? "bg-gradient-to-r from-purple-500 to-pink-500" : "border-slate-600"}
                    data-testid="button-toggle-3d"
                  >
                    <Box className="w-4 h-4 mr-1" />
                    {show3D ? "2D Grid" : "3D View"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowShop(!showShop)}
                    className="border-slate-600"
                  >
                    <ShoppingBag className="w-4 h-4 mr-1" />
                    {showShop ? "Hide Shop" : "Shop"}
                  </Button>
                </div>
              </div>

              {/* Era-Aware Building Palette */}
              <div className="mb-4">
                {eraBuildings.length > 0 ? (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border-cyan-500/30 text-xs">
                        {selectedEra === "modern" ? "🏙️ Modern" : selectedEra === "medieval" ? "🏰 Medieval" : "🤠 Wild West"} Buildings
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {eraBuildings.map((building) => {
                        const isLocked = building.unlockLevel > playerLevel;
                        const buildingTypeId = building.buildingType as BuildingType;
                        const isSelected = selectedBuilding === buildingTypeId;
                        
                        return (
                          <Button
                            key={building.id}
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            disabled={isLocked}
                            onClick={() => {
                              setSelectedBuilding(buildingTypeId);
                              setIsEraseMode(false);
                            }}
                            className={`relative ${isSelected ? "bg-cyan-500" : "border-slate-600"}`}
                            data-testid={`building-era-${building.buildingType}`}
                          >
                            {isLocked && <Lock className="w-3 h-3 absolute -top-1 -right-1 text-amber-400" />}
                            <span className="mr-1">{building.iconEmoji}</span>
                            {building.displayName}
                            {building.baseCost > 0 && (
                              <span className="ml-1 text-amber-400 text-xs">({building.baseCost})</span>
                            )}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
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
                )}
              </div>

              {/* 3D View */}
              {show3D ? (
                <div className="relative rounded-lg overflow-hidden border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                  <div className="aspect-square max-w-lg mx-auto">
                    <Suspense fallback={
                      <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          <p className="text-sm text-slate-400">Loading 3D Estate...</p>
                        </div>
                      </div>
                    }>
                      <Canvas
                        camera={{ position: [6, 5, 6], fov: 50 }}
                        style={{ background: ERA_COLORS[selectedEra]?.sky || "#0f172a" }}
                      >
                        <Estate3DScene grid={grid} era={selectedEra} />
                      </Canvas>
                    </Suspense>
                  </div>
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <Badge className="bg-purple-500/80 text-white border-purple-400/50 text-xs shadow-lg">
                      <Box className="w-3 h-3 mr-1" />
                      3D View
                    </Badge>
                  </div>
                  <p className="text-center text-xs text-slate-500 py-2">
                    Drag to rotate, scroll to zoom. Place buildings in 2D grid mode.
                  </p>
                </div>
              ) : (
                <>
                  {/* 2D Grid */}
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
                          const eraTemplate = eraBuildings.find(b => b.buildingType === cell.building);
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
                                flex items-center justify-center text-xs
                                ${BUILDING_COLORS[cell.building]}
                                ${cell.building === "empty" ? "hover:bg-slate-700" : ""}
                                ${selectedBuilding || isEraseMode ? "ring-1 ring-cyan-500/30" : ""}
                              `}
                            >
                              {cell.building !== "empty" && (
                                eraTemplate ? (
                                  <span className="text-base md:text-lg drop-shadow">{eraTemplate.iconEmoji}</span>
                                ) : (
                                  <Icon className="w-4 h-4 md:w-5 md:h-5 text-white drop-shadow" />
                                )
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
                </>
              )}
            </Card>
          </div>

          {/* Era Progress & Portal Unlock */}
          <Card className="mt-6 bg-slate-900/80 border-slate-700 p-6 lg:col-span-3">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Time Portal Progress
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { era: "Modern Day", emoji: "🏙️", desc: "Your starting era - build your modern life", level: 0, status: "unlocked" },
                { era: "Medieval", emoji: "🏰", desc: "Complete Modern quests to open the Medieval portal", level: 5, status: playerLevel >= 5 ? "unlocked" : "locked" },
                { era: "Wild West", emoji: "🤠", desc: "Master two eras to unlock the frontier", level: 10, status: playerLevel >= 10 ? "unlocked" : "locked" },
              ].map((portal, i) => (
                <GlassCard key={i} glow={portal.status === "unlocked"} className="p-4 text-center">
                  <span className="text-3xl block mb-2">{portal.emoji}</span>
                  <p className="font-bold text-white text-sm">{portal.era}</p>
                  <p className="text-xs text-slate-400 mt-1 mb-3">{portal.desc}</p>
                  {portal.status === "unlocked" ? (
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Portal Open
                    </Badge>
                  ) : (
                    <div>
                      <Progress value={(playerLevel / portal.level) * 100} className="h-2 mb-2" />
                      <span className="text-xs text-slate-400">Level {playerLevel}/{portal.level}</span>
                    </div>
                  )}
                </GlassCard>
              ))}
            </div>
          </Card>
        </div>
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
