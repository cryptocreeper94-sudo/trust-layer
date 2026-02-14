import { useState, useRef, Suspense, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChroniclesSession } from "./chronicles-login";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import * as THREE from "three";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import {
  Home, Building, TreePine, Store, MapPin, Crown, Shield, Star,
  ArrowLeft, Globe, Users, Sparkles, Lock, ChevronRight, Hammer,
  ShoppingBag, Coins, Eye, Zap, Heart, Map, Layers, Grid3X3,
  Building2, Plus, X, Check, ChevronDown, Search,
} from "lucide-react";

const ERA_CONFIG = {
  modern: {
    name: "Modern City", emoji: "🏙️",
    textColor: "text-cyan-400", borderColor: "border-cyan-500/30",
    bgGradient: "from-cyan-500/20 to-blue-600/20",
    badgeClass: "bg-cyan-500/20 text-cyan-400",
    groundColor: "#1a1a2e", skyColor: "#0a1628",
    fogColor: "#0a1628", particleColor: "#06b6d4",
    townSquareName: "Downtown Plaza",
    description: "A gleaming metropolis of glass, steel, and ambition",
  },
  medieval: {
    name: "Kingdom", emoji: "🏰",
    textColor: "text-amber-400", borderColor: "border-amber-500/30",
    bgGradient: "from-amber-500/20 to-orange-600/20",
    badgeClass: "bg-amber-500/20 text-amber-400",
    groundColor: "#2d1f0e", skyColor: "#1a0f00",
    fogColor: "#1a0f00", particleColor: "#d97706",
    townSquareName: "Market Square",
    description: "A bustling medieval town of stone walls and market stalls",
  },
  wildwest: {
    name: "Frontier Town", emoji: "🤠",
    textColor: "text-yellow-400", borderColor: "border-yellow-500/30",
    bgGradient: "from-yellow-500/20 to-orange-600/20",
    badgeClass: "bg-yellow-500/20 text-yellow-400",
    groundColor: "#3d2b10", skyColor: "#1a1200",
    fogColor: "#1a1200", particleColor: "#eab308",
    townSquareName: "Main Street",
    description: "A dusty frontier town where fortune favors the bold",
  },
};

interface CityPlot {
  id: string;
  x: number;
  z: number;
  type: "town_square" | "commercial" | "residential" | "nature" | "mixed";
  owner?: string;
  ownerName?: string;
  building?: {
    name: string;
    emoji: string;
    type: string;
    tier: "free" | "premium" | "elite";
  };
  isPremium: boolean;
  price: number;
}

interface CityZone {
  id: string;
  name: string;
  type: string;
  description: string;
  plots: CityPlot[];
  totalPlots: number;
  occupiedPlots: number;
}

const BUILDING_CATALOG: Record<string, Array<{
  id: string; name: string; emoji: string; type: string; tier: "free" | "premium" | "elite"; cost: number; description: string;
}>> = {
  modern: [
    { id: "coffee_shop", name: "Coffee Shop", emoji: "☕", type: "shop", tier: "free", cost: 0, description: "A trendy cafe with WiFi" },
    { id: "tech_startup", name: "Tech Startup", emoji: "💻", type: "shop", tier: "free", cost: 0, description: "A small innovation lab" },
    { id: "boutique", name: "Boutique", emoji: "👗", type: "shop", tier: "premium", cost: 500, description: "Premium fashion storefront on the plaza" },
    { id: "restaurant", name: "Restaurant", emoji: "🍽️", type: "shop", tier: "premium", cost: 750, description: "Fine dining in the heart of downtown" },
    { id: "art_gallery", name: "Art Gallery", emoji: "🖼️", type: "shop", tier: "premium", cost: 600, description: "Contemporary art gallery on Main Street" },
    { id: "coworking", name: "Co-Working Space", emoji: "🏢", type: "office", tier: "premium", cost: 800, description: "Shared workspace for entrepreneurs" },
    { id: "penthouse", name: "Penthouse Suite", emoji: "🏙️", type: "residential", tier: "elite", cost: 2000, description: "Luxury living at the top" },
    { id: "nightclub", name: "Nightclub", emoji: "🎵", type: "entertainment", tier: "elite", cost: 1500, description: "The hottest spot in the city" },
  ],
  medieval: [
    { id: "market_stall", name: "Market Stall", emoji: "🏪", type: "shop", tier: "free", cost: 0, description: "A wooden stall to sell your wares" },
    { id: "cottage", name: "Cottage", emoji: "🏠", type: "residential", tier: "free", cost: 0, description: "A humble thatched dwelling" },
    { id: "tavern", name: "Tavern", emoji: "🍺", type: "shop", tier: "premium", cost: 500, description: "A grand tavern on the square" },
    { id: "blacksmith", name: "Blacksmith", emoji: "⚒️", type: "shop", tier: "premium", cost: 600, description: "Forge weapons and armor for the realm" },
    { id: "apothecary", name: "Apothecary", emoji: "⚗️", type: "shop", tier: "premium", cost: 450, description: "Potions, herbs, and remedies" },
    { id: "guild_hall", name: "Guild Hall", emoji: "🏛️", type: "office", tier: "premium", cost: 900, description: "A seat of power for your guild" },
    { id: "castle_tower", name: "Castle Tower", emoji: "🏰", type: "monument", tier: "elite", cost: 2500, description: "A towering symbol of dominion" },
    { id: "cathedral", name: "Cathedral", emoji: "⛪", type: "monument", tier: "elite", cost: 2000, description: "Sacred ground for the faithful" },
  ],
  wildwest: [
    { id: "general_store", name: "General Store", emoji: "🏬", type: "shop", tier: "free", cost: 0, description: "Supplies and provisions" },
    { id: "homestead", name: "Homestead", emoji: "🏚️", type: "residential", tier: "free", cost: 0, description: "A frontier log cabin" },
    { id: "saloon", name: "Saloon", emoji: "🥃", type: "shop", tier: "premium", cost: 500, description: "Whiskey, poker, and trouble on Main Street" },
    { id: "sheriffs_office", name: "Sheriff's Office", emoji: "⭐", type: "office", tier: "premium", cost: 600, description: "Law and order in the frontier" },
    { id: "assay_office", name: "Assay Office", emoji: "⚖️", type: "shop", tier: "premium", cost: 450, description: "Weigh and value your gold finds" },
    { id: "telegraph", name: "Telegraph Office", emoji: "📡", type: "office", tier: "premium", cost: 700, description: "Connect to the outside world" },
    { id: "bank", name: "Frontier Bank", emoji: "🏦", type: "office", tier: "elite", cost: 2000, description: "Keep your gold safe — or rob it" },
    { id: "ranch", name: "Grand Ranch", emoji: "🐄", type: "residential", tier: "elite", cost: 1800, description: "A sprawling cattle empire" },
  ],
};

function Building3D({ building, position, era, isPremium }: {
  building: { name: string; emoji: string; type: string; tier: string };
  position: [number, number, number];
  era: string;
  isPremium: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.05;
    }
    if (glowRef.current && isPremium) {
      glowRef.current.intensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const colors: Record<string, Record<string, string>> = {
    modern: { shop: "#06b6d4", office: "#8b5cf6", residential: "#3b82f6", entertainment: "#ec4899", monument: "#f59e0b" },
    medieval: { shop: "#d97706", office: "#8B7355", residential: "#A0855B", monument: "#D4AF37" },
    wildwest: { shop: "#C4A574", office: "#8B6914", residential: "#B8956A", monument: "#D4AF37" },
  };

  const color = colors[era]?.[building.type] || "#64748b";
  const height = building.tier === "elite" ? 2.5 : building.tier === "premium" ? 1.8 : 1.2;
  const width = building.tier === "elite" ? 1.5 : building.tier === "premium" ? 1.2 : 0.9;

  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[width, height, width]} />
        <meshStandardMaterial
          color={color}
          roughness={era === "modern" ? 0.3 : 0.8}
          metalness={era === "modern" ? 0.5 : 0.1}
        />
      </mesh>
      {era === "medieval" && (
        <mesh position={[0, height / 2 + 0.4, 0]}>
          <coneGeometry args={[width * 0.7, 0.8, 4]} />
          <meshStandardMaterial color="#5C3A1E" roughness={0.9} />
        </mesh>
      )}
      {isPremium && <pointLight ref={glowRef} position={[0, height / 2 + 0.5, 0]} color={color} intensity={0.3} distance={3} />}
      <Html position={[0, height / 2 + (era === "medieval" ? 1.2 : 0.4), 0]} center distanceFactor={8}>
        <div className="text-center pointer-events-none select-none">
          <span className="text-lg">{building.emoji}</span>
          <div className="text-[8px] text-white font-medium bg-black/60 px-1.5 py-0.5 rounded whitespace-nowrap mt-0.5">
            {building.name}
          </div>
        </div>
      </Html>
    </group>
  );
}

function PlotMarker3D({ plot, position, onClick }: {
  plot: CityPlot;
  position: [number, number, number];
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = 0.05 + Math.sin(state.clock.elapsedTime + position[0] * 3) * 0.02;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  const color = plot.isPremium ? "#f59e0b" : "#3b82f6";

  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.8, 1.8]} />
        <meshStandardMaterial color={color} transparent opacity={0.15} />
      </mesh>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.15]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      <Html position={[0, 0.5, 0]} center distanceFactor={10}>
        <button
          onClick={onClick}
          className="px-2 py-1 bg-black/70 text-white text-[9px] rounded-md border border-white/20 hover:border-cyan-500/50 cursor-pointer transition-all whitespace-nowrap"
        >
          {plot.isPremium ? "⭐ Premium" : "Available"}
        </button>
      </Html>
    </group>
  );
}

function CityScene3D({ era, plots, onPlotClick }: {
  era: string;
  plots: CityPlot[];
  onPlotClick: (plot: CityPlot) => void;
}) {
  const config = ERA_CONFIG[era as keyof typeof ERA_CONFIG] || ERA_CONFIG.modern;

  const roads = useMemo(() => {
    const segments: Array<{ pos: [number, number, number]; size: [number, number] }> = [];
    segments.push({ pos: [0, 0.01, 0], size: [20, 1.5] });
    segments.push({ pos: [0, 0.01, -5], size: [1.5, 10] });
    segments.push({ pos: [0, 0.01, 5], size: [1.5, 10] });
    return segments;
  }, []);

  const roadColor = era === "modern" ? "#1e293b" : era === "medieval" ? "#4a3828" : "#8B7355";

  return (
    <Canvas shadows camera={{ position: [8, 10, 15], fov: 50 }} gl={{ antialias: true }}>
      <Suspense fallback={null}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color={config.groundColor} roughness={0.95} />
        </mesh>

        {roads.map((road, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={road.pos}>
            <planeGeometry args={road.size} />
            <meshStandardMaterial color={roadColor} roughness={0.8} />
          </mesh>
        ))}

        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[3.5, 32]} />
          <meshStandardMaterial
            color={era === "modern" ? "#1e3a5f" : era === "medieval" ? "#5a4a3a" : "#6b5a3a"}
            roughness={0.7}
          />
        </mesh>

        {plots.map((plot, i) => {
          const angle = (i / Math.max(1, plots.length)) * Math.PI * 2;
          const radius = plot.type === "town_square" ? 2.5 : 5 + (i % 3) * 2;
          const px = Math.cos(angle) * radius;
          const pz = Math.sin(angle) * radius;

          if (plot.building) {
            return (
              <Building3D
                key={plot.id}
                building={plot.building}
                position={[px, plot.building.tier === "elite" ? 1.25 : plot.building.tier === "premium" ? 0.9 : 0.6, pz]}
                era={era}
                isPremium={plot.isPremium}
              />
            );
          }

          return (
            <PlotMarker3D
              key={plot.id}
              plot={plot}
              position={[px, 0, pz]}
              onClick={() => onPlotClick(plot)}
            />
          );
        })}

        <Stars radius={50} depth={50} count={800} factor={2} saturation={0} fade speed={0.5} />
        <fog attach="fog" args={[config.fogColor, 15, 35]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[8, 12, 8]} intensity={0.8} castShadow />
        <pointLight position={[0, 3, 0]} intensity={0.5} color={config.particleColor} />
      </Suspense>
      <OrbitControls
        enableZoom
        enablePan
        autoRotate
        autoRotateSpeed={0.2}
        maxPolarAngle={Math.PI / 2.3}
        minPolarAngle={Math.PI / 6}
        minDistance={5}
        maxDistance={25}
      />
    </Canvas>
  );
}

function StorefrontPreview({ business, era }: { business: any; era: string }) {
  const config = ERA_CONFIG[era as keyof typeof ERA_CONFIG] || ERA_CONFIG.modern;

  const eraDescriptions: Record<string, string> = {
    modern: `Your ${business.name} sits in a glass-fronted retail space on the main avenue. LED signage glows above the entrance, and floor-to-ceiling windows display your offerings to the bustling crowd.`,
    medieval: `Your ${business.name} occupies a stone-and-timber shop front on the cobbled market square. A hand-painted wooden sign hangs above the oak door, swaying in the breeze. Candlelight flickers from within.`,
    wildwest: `Your ${business.name} stands proud on Main Street with a hand-lettered sign and wooden porch. Hitching posts line the front, and the creak of the swinging door welcomes every dusty traveler.`,
  };

  return (
    <GlassCard className={`p-4 border ${config.borderColor}`} data-testid={`storefront-preview-${era}`}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{business.emoji}</span>
        <div>
          <h4 className="text-white font-bold">{business.name}</h4>
          <Badge className={config.badgeClass}>{config.name}</Badge>
        </div>
        {business.tier === "premium" && (
          <Badge className="ml-auto bg-yellow-500/20 text-yellow-400">
            <Star className="w-3 h-3 mr-1" /> Premium
          </Badge>
        )}
        {business.tier === "elite" && (
          <Badge className="ml-auto bg-purple-500/20 text-purple-400">
            <Crown className="w-3 h-3 mr-1" /> Elite
          </Badge>
        )}
      </div>
      <p className="text-sm text-gray-300 leading-relaxed italic">{eraDescriptions[era]}</p>
      <div className="mt-3 h-32 rounded-lg overflow-hidden relative">
        <Canvas shadows camera={{ position: [2, 2, 3], fov: 50 }}>
          <Suspense fallback={null}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[6, 6]} />
              <meshStandardMaterial color={config.groundColor} roughness={0.9} />
            </mesh>
            <Building3D
              building={{ ...business, tier: business.tier || "premium" }}
              position={[0, business.tier === "elite" ? 1.25 : 0.9, 0]}
              era={era}
              isPremium={business.tier !== "free"}
            />
            <ambientLight intensity={0.4} />
            <directionalLight position={[3, 5, 3]} intensity={0.7} castShadow />
            <pointLight position={[0, 2, 0]} intensity={0.3} color={config.particleColor} />
          </Suspense>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={1}
            maxPolarAngle={Math.PI / 2.5}
          />
        </Canvas>
      </div>
    </GlassCard>
  );
}

function PlotDetailModal({ plot, era, buildings, onClose, onBuild }: {
  plot: CityPlot;
  era: string;
  buildings: any[];
  onClose: () => void;
  onBuild: (buildingId: string) => void;
}) {
  const config = ERA_CONFIG[era as keyof typeof ERA_CONFIG] || ERA_CONFIG.modern;
  const availableBuildings = buildings.filter(b =>
    plot.isPremium ? true : b.tier === "free"
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[80vh] overflow-y-auto"
      >
        <GlassCard className="p-5 border border-white/20 bg-slate-900/98">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-bold text-lg">
                {plot.isPremium ? "⭐ Premium Plot" : "City Plot"}
              </h3>
              <p className="text-xs text-gray-400">
                {plot.type === "town_square"
                  ? `${config.townSquareName} — prime real estate`
                  : "Build your business here"
                }
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white" data-testid="close-plot-modal">
              <X className="w-5 h-5" />
            </button>
          </div>

          {plot.isPremium && (
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 mb-4">
              <p className="text-xs text-yellow-400">
                <Star className="w-3 h-3 inline mr-1" />
                Premium plots are on the town square — maximum visibility for your business. All building types available.
              </p>
            </div>
          )}

          <h4 className="text-white text-sm font-semibold mb-3">Choose a Building</h4>
          <div className="space-y-2">
            {availableBuildings.map(b => (
              <button
                key={b.id}
                onClick={() => onBuild(b.id)}
                className="w-full text-left p-3.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all min-h-[52px]"
                data-testid={`build-${b.id}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{b.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-white font-medium">{b.name}</p>
                      {b.tier === "premium" && <Badge className="bg-yellow-500/20 text-yellow-400 text-[9px]">Premium</Badge>}
                      {b.tier === "elite" && <Badge className="bg-purple-500/20 text-purple-400 text-[9px]">Elite</Badge>}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{b.description}</p>
                  </div>
                  <div className="text-right">
                    {b.cost > 0 ? (
                      <span className="text-xs text-yellow-400">{b.cost} 🐚</span>
                    ) : (
                      <span className="text-xs text-green-400">Free</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {!plot.isPremium && (
            <p className="text-[10px] text-gray-500 mt-3 text-center">
              Non-premium plots only allow free buildings. Upgrade to a premium plot for premium storefronts.
            </p>
          )}
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}


const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

export default function ChroniclesCity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedEra, setSelectedEra] = useState<"modern" | "medieval" | "wildwest">("modern");
  const [selectedPlot, setSelectedPlot] = useState<CityPlot | null>(null);
  const [activeTab, setActiveTab] = useState<"map" | "storefront" | "leaderboard">("map");
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);

  const getAuthHeaders = (): Record<string, string> => {
    const session = getChroniclesSession();
    if (session?.token) return { Authorization: `Bearer ${session.token}`, "Content-Type": "application/json" };
    return { "Content-Type": "application/json" };
  };

  const { data: plotsData, isLoading: plotsLoading } = useQuery({
    queryKey: ["/api/chronicles/city/plots", selectedEra],
    queryFn: async () => {
      const res = await fetch(`/api/chronicles/city/plots?era=${selectedEra}`, { headers: getAuthHeaders() });
      if (!res.ok) return { plots: [] };
      return res.json();
    },
    staleTime: 10000,
  });

  const { data: leaderboardData } = useQuery({
    queryKey: ["/api/chronicles/city/leaderboard"],
    queryFn: async () => {
      const res = await fetch("/api/chronicles/city/leaderboard", { headers: getAuthHeaders() });
      if (!res.ok) return { leaderboard: [] };
      return res.json();
    },
    staleTime: 30000,
  });

  const buildMutation = useMutation({
    mutationFn: async ({ plotId, buildingId, era }: { plotId: string; buildingId: string; era: string }) => {
      const res = await fetch("/api/chronicles/city/build", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ plotId, buildingId, era }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to build");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: `${data.building.emoji} ${data.building.name} Built!`,
        description: data.shellsSpent > 0
          ? `Your ${data.building.name} now stands in the city! (${data.shellsSpent} shells spent)`
          : `Your ${data.building.name} now stands in the city! Other players will see it.`,
      });
      setSelectedPlot(null);
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/city/plots", selectedEra] });
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/city/leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/play/state"] });
    },
    onError: (error: any) => {
      toast({ title: "Build Failed", description: error.message, variant: "destructive" });
    },
  });

  const config = ERA_CONFIG[selectedEra];
  const plots: CityPlot[] = (plotsData?.plots || []).map((p: any) => ({
    id: p.id,
    x: p.x,
    z: p.z,
    type: p.type || (p.isPremium ? "town_square" : "commercial"),
    owner: p.owner,
    ownerName: p.ownerName,
    building: p.building,
    isPremium: p.isPremium,
    price: p.price || 0,
  }));
  const buildings = BUILDING_CATALOG[selectedEra] || [];

  const occupiedCount = plots.filter(p => p.building).length;
  const totalCount = plots.length;
  const premiumCount = plots.filter(p => p.isPremium).length;
  const premiumOccupied = plots.filter(p => p.isPremium && p.building).length;

  const handleBuild = (buildingId: string) => {
    if (!selectedPlot) return;
    buildMutation.mutate({ plotId: selectedPlot.id, buildingId, era: selectedEra });
  };

  return (
    <div className="min-h-screen relative overflow-hidden pt-20 pb-12" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #3b82f6)" size={500} top="-5%" left="60%" />
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={400} top="40%" left="-10%" delay={3} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/chronicles/play">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" data-testid="back-to-play">
              <ArrowLeft className="w-4 h-4 mr-1" /> Play
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">Build the City</h1>
            <p className="text-xs text-gray-500">Build together — storefronts, homes, monuments</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-1" data-testid="city-era-selector">
          {(Object.keys(ERA_CONFIG) as Array<keyof typeof ERA_CONFIG>).map(era => {
            const c = ERA_CONFIG[era];
            return (
              <button
                key={era}
                onClick={() => setSelectedEra(era)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-medium transition-all min-h-[44px] ${
                  selectedEra === era
                    ? `bg-gradient-to-r ${c.bgGradient} ${c.textColor} border ${c.borderColor}`
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
                data-testid={`city-era-${era}`}
              >
                {c.emoji} {c.name}
              </button>
            );
          })}
        </div>

        <GlassCard className={`p-4 mb-4 border ${config.borderColor}`}>
          <div className="flex items-center justify-between mb-2">
            <h2 className={`font-bold ${config.textColor}`}>{config.emoji} {config.name}</h2>
            <Badge className={config.badgeClass}>
              {occupiedCount}/{totalCount} plots built
            </Badge>
          </div>
          <p className="text-xs text-gray-400 mb-2">{config.description}</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-white/5">
              <p className="text-sm font-bold text-yellow-400">{premiumOccupied}/{premiumCount}</p>
              <p className="text-[9px] text-gray-500">{config.townSquareName}</p>
            </div>
            <div className="p-2 rounded-lg bg-white/5">
              <p className="text-sm font-bold text-cyan-400">{totalCount - premiumCount - (occupiedCount - premiumOccupied)}</p>
              <p className="text-[9px] text-gray-500">Open Plots</p>
            </div>
            <div className="p-2 rounded-lg bg-white/5">
              <p className="text-sm font-bold text-green-400">{buildings.length}</p>
              <p className="text-[9px] text-gray-500">Building Types</p>
            </div>
          </div>
        </GlassCard>

        <div className="flex gap-1 mb-4 bg-white/5 rounded-lg p-1" data-testid="city-tabs">
          {[
            { id: "map" as const, label: "3D City Map", icon: Map },
            { id: "storefront" as const, label: "Storefronts", icon: Store },
            { id: "leaderboard" as const, label: "Top Builders", icon: Crown },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-md text-xs font-medium transition-all min-h-[44px] ${
                activeTab === tab.id
                  ? `${config.textColor} bg-white/10`
                  : "text-gray-500 hover:text-gray-300"
              }`}
              data-testid={`city-tab-${tab.id}`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "map" && (
            <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="rounded-xl overflow-hidden border border-white/10 mb-4 h-[280px] sm:h-[360px] md:h-[400px]" data-testid="city-3d-map">
                <CityScene3D
                  era={selectedEra}
                  plots={plots}
                  onPlotClick={(plot) => setSelectedPlot(plot)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <GlassCard className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-white font-medium">{config.townSquareName}</span>
                  </div>
                  <p className="text-[10px] text-gray-400">Premium plots with maximum visibility. All building types available.</p>
                </GlassCard>
                <GlassCard className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-white font-medium">Outer Districts</span>
                  </div>
                  <p className="text-[10px] text-gray-400">Free plots scattered across the landscape. Free buildings only.</p>
                </GlassCard>
              </div>

              <GlassCard className="p-4">
                <h3 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" /> Building Catalog
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {buildings.map(b => (
                    <div
                      key={b.id}
                      className={`p-2.5 rounded-lg text-center border transition-all cursor-pointer hover:bg-white/10 min-h-[72px] flex flex-col items-center justify-center ${
                        b.tier === "elite" ? "border-purple-500/30 bg-purple-500/5" :
                        b.tier === "premium" ? "border-yellow-500/30 bg-yellow-500/5" :
                        "border-white/10 bg-white/5"
                      }`}
                      data-testid={`catalog-${b.id}`}
                    >
                      <span className="text-xl">{b.emoji}</span>
                      <p className="text-[10px] text-white font-medium mt-1 truncate w-full">{b.name}</p>
                      <p className="text-[9px] text-gray-500">
                        {b.cost > 0 ? `${b.cost} 🐚` : "Free"}
                      </p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {activeTab === "storefront" && (
            <motion.div key="storefront" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <GlassCard className="p-4 text-center">
                <Store className={`w-10 h-10 ${config.textColor} mx-auto mb-2`} />
                <h3 className="text-white font-bold mb-1">Storefront Preview</h3>
                <p className="text-xs text-gray-400 mb-4">See what your business looks like across all three eras</p>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {buildings.filter(b => b.tier !== "free").map(b => (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBusiness(b.id)}
                      className={`px-3.5 py-2.5 rounded-full text-xs transition-all min-h-[44px] inline-flex items-center ${
                        selectedBusiness === b.id
                          ? `${config.badgeClass} border ${config.borderColor}`
                          : "bg-white/5 text-gray-400 hover:bg-white/10"
                      }`}
                      data-testid={`preview-${b.id}`}
                    >
                      {b.emoji} {b.name}
                    </button>
                  ))}
                </div>
              </GlassCard>

              {selectedBusiness && (() => {
                const biz = buildings.find(b => b.id === selectedBusiness);
                if (!biz) return null;

                return (
                  <div className="space-y-3">
                    <h4 className="text-white font-semibold text-sm">
                      {biz.emoji} {biz.name} — Across the Ages
                    </h4>
                    {(Object.keys(ERA_CONFIG) as Array<keyof typeof ERA_CONFIG>).map(era => {
                      const eraBuildings = BUILDING_CATALOG[era] || [];
                      const equivalent = eraBuildings.find(eb => eb.type === biz.type && eb.tier === biz.tier)
                        || eraBuildings.find(eb => eb.type === biz.type)
                        || biz;
                      return <StorefrontPreview key={era} business={equivalent} era={era} />;
                    })}
                  </div>
                );
              })()}
            </motion.div>
          )}

          {activeTab === "leaderboard" && (
            <motion.div key="leaderboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <GlassCard className="p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-yellow-400" /> Top City Builders
                </h3>
                <div className="space-y-2">
                  {(leaderboardData?.leaderboard || []).length === 0 ? (
                    <div className="text-center py-6">
                      <Building2 className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No builders yet. Be the first!</p>
                      <p className="text-xs text-gray-600 mt-1">Claim a plot and build to appear on the leaderboard</p>
                    </div>
                  ) : (
                    (leaderboardData?.leaderboard || []).map((player: any, idx: number) => {
                      const rank = idx + 1;
                      const emoji = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : String(rank);
                      const pEra = ERA_CONFIG[(player.era || "modern") as keyof typeof ERA_CONFIG] || ERA_CONFIG.modern;
                      return (
                        <div key={idx} className={`flex items-center gap-3 p-2 rounded-lg ${rank <= 3 ? "bg-white/8 border border-white/5" : "bg-white/5"}`}>
                          <span className={`w-8 text-center ${rank <= 3 ? "text-lg" : "text-xs text-gray-500 font-mono"}`}>{emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{player.name}</p>
                            <p className="text-[10px] text-gray-500">{pEra.emoji} {pEra.name}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-bold text-cyan-400">{player.buildings}</p>
                            <p className="text-[9px] text-gray-500">built</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </GlassCard>

              <GlassCard className="p-4 text-center">
                <p className="text-xs text-gray-400">
                  Build more structures to climb the leaderboard. Premium town square plots earn 2x builder points.
                </p>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedPlot && !selectedPlot.building && (
          <PlotDetailModal
            plot={selectedPlot}
            era={selectedEra}
            buildings={buildings}
            onClose={() => setSelectedPlot(null)}
            onBuild={handleBuild}
          />
        )}
      </AnimatePresence>
  );
}
