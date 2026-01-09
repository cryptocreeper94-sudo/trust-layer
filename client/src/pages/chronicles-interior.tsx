import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Home, DoorOpen, Sofa, Tv, Flame, ArrowLeft, Plus, X, Move,
  Sparkles, Timer, Coins, Crown, BookOpen, Music, Utensils,
  Wrench, Star, Zap, Heart, Brain, Clock, Check, AlertCircle,
  Bed, Armchair, Lamp, Monitor, Gamepad2, Coffee, Bath, Trees
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GlassCard } from "@/components/glass-card";
import { toast } from "sonner";
import { getChroniclesSession } from "@/pages/chronicles-login";

interface ObjectCatalog {
  id: string;
  era: string;
  objectType: string;
  name: string;
  description: string;
  iconEmoji: string;
  category: string;
  shellsCost: number;
  shellsPerUse: number;
  useCooldownMinutes: number;
  statBonuses: Record<string, number>;
  interactionVerbs: string[];
  unlockLevel: number;
}

interface RoomObject {
  id: string;
  roomId: string;
  catalogId: string;
  userId: string;
  positionX: number;
  positionY: number;
  rotation: number;
  lastUsedAt: string | null;
  totalUses: number;
  catalog?: ObjectCatalog;
}

interface Room {
  id: string;
  interiorId: string;
  roomType: string;
  name: string;
  gridWidth: number;
  gridHeight: number;
  floorStyle: string;
  wallStyle: string;
  objects: RoomObject[];
}

interface Interior {
  id: string;
  userId: string;
  era: string;
  style: string;
  totalRooms: number;
  maxRooms: number;
  rooms: Room[];
}

const ROOM_ICONS: Record<string, React.ElementType> = {
  living_room: Sofa,
  bedroom: Bed,
  kitchen: Utensils,
  bathroom: Bath,
  study: BookOpen,
  workshop: Wrench,
  garden: Trees,
  default: Home,
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  furniture: Armchair,
  appliance: Tv,
  decoration: Lamp,
  entertainment: Gamepad2,
  utility: Wrench,
  nature: Trees,
  default: Star,
};

const ERA_THEMES: Record<string, { bg: string; accent: string; glow: string }> = {
  stone_age: { bg: "from-amber-950 to-stone-900", accent: "amber", glow: "rgba(217,119,6,0.2)" },
  medieval: { bg: "from-stone-900 to-amber-950", accent: "amber", glow: "rgba(180,83,9,0.2)" },
  renaissance: { bg: "from-purple-950 to-rose-950", accent: "rose", glow: "rgba(190,24,93,0.2)" },
  victorian: { bg: "from-slate-900 to-emerald-950", accent: "emerald", glow: "rgba(5,150,105,0.2)" },
  present: { bg: "from-slate-950 to-cyan-950", accent: "cyan", glow: "rgba(6,182,212,0.2)" },
  cyberpunk: { bg: "from-purple-950 to-cyan-950", accent: "cyan", glow: "rgba(0,255,255,0.3)" },
  spacefaring: { bg: "from-indigo-950 to-slate-950", accent: "indigo", glow: "rgba(99,102,241,0.2)" },
  post_singularity: { bg: "from-fuchsia-950 to-violet-950", accent: "fuchsia", glow: "rgba(192,38,211,0.3)" },
};

export default function ChroniclesInterior() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const session = getChroniclesSession();
  
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [buildMode, setBuildMode] = useState(false);
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<ObjectCatalog | null>(null);
  const [interactingObject, setInteractingObject] = useState<RoomObject | null>(null);
  
  const authHeaders = { Authorization: `Bearer ${session?.token}`, "Content-Type": "application/json" };

  const { data: interior, isLoading: interiorLoading } = useQuery<Interior>({
    queryKey: ["/api/chronicles/interior"],
    queryFn: async () => {
      const res = await fetch("/api/chronicles/interior", { headers: authHeaders });
      if (!res.ok) throw new Error("Failed to load interior");
      return res.json();
    },
    enabled: !!session?.token,
  });

  const { data: catalog } = useQuery<ObjectCatalog[]>({
    queryKey: ["/api/chronicles/interior/catalog", interior?.era],
    queryFn: async () => {
      const res = await fetch(`/api/chronicles/interior/catalog/${interior?.era}`, { headers: authHeaders });
      if (!res.ok) throw new Error("Failed to load catalog");
      return res.json();
    },
    enabled: !!session?.token && !!interior?.era,
  });

  const { data: roomDetails, refetch: refetchRoom } = useQuery<Room>({
    queryKey: ["/api/chronicles/interior/room", selectedRoom?.id],
    queryFn: async () => {
      const res = await fetch(`/api/chronicles/interior/room/${selectedRoom?.id}`, { headers: authHeaders });
      if (!res.ok) throw new Error("Failed to load room");
      return res.json();
    },
    enabled: !!session?.token && !!selectedRoom?.id,
  });

  const placeObjectMutation = useMutation({
    mutationFn: async ({ catalogId, roomId, x, y }: { catalogId: string; roomId: string; x: number; y: number }) => {
      const res = await fetch(`/api/chronicles/interior/room/${roomId}/objects`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ catalogId, gridX: x, gridY: y }),
      });
      if (!res.ok) throw new Error("Failed to place object");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Object placed!");
      refetchRoom();
      setSelectedCatalogItem(null);
      setBuildMode(false);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to place object");
    },
  });

  const interactMutation = useMutation({
    mutationFn: async ({ objectId, verb }: { objectId: string; verb: string }) => {
      const res = await fetch(`/api/chronicles/interior/objects/${objectId}/interact`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ verb }),
      });
      if (!res.ok) throw new Error("Interaction failed");
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`${data.message} (+${data.shellsEarned} Shells)`);
        refetchRoom();
      } else {
        toast.error(data.message);
      }
      setInteractingObject(null);
    },
    onError: (err: any) => {
      toast.error(err.message || "Interaction failed");
      setInteractingObject(null);
    },
  });

  const removeObjectMutation = useMutation({
    mutationFn: async (objectId: string) => {
      const res = await fetch(`/api/chronicles/interior/objects/${objectId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      if (!res.ok) throw new Error("Failed to remove object");
    },
    onSuccess: () => {
      toast.success("Object removed");
      refetchRoom();
    },
  });

  if (!session?.token) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <GlassCard glow className="max-w-md w-full p-8 text-center">
          <DoorOpen className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400 mb-6">Please log in to Chronicles to access your home.</p>
          <Button onClick={() => setLocation("/chronicles/login")} className="bg-cyan-500 hover:bg-cyan-600">
            Go to Login
          </Button>
        </GlassCard>
      </div>
    );
  }

  if (interiorLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400">Loading your home...</p>
        </div>
      </div>
    );
  }

  const theme = ERA_THEMES[interior?.era || "present"] || ERA_THEMES.present;
  const currentRoom = roomDetails || selectedRoom;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} relative overflow-hidden`}>
      {/* Floating Ambient Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 p-4 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation("/chronicles/estate")}
              className="text-white/70 hover:text-white hover:bg-white/10"
              data-testid="button-back-estate"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Estate
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Your Home Interior
              </h1>
              <p className="text-slate-400 text-sm capitalize">{interior?.era?.replace("_", " ")} Era • {interior?.style?.replace("_", " ")} Style</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300 uppercase tracking-wider px-3 py-1">
              <Home className="w-4 h-4 mr-1" />
              {interior?.totalRooms}/{interior?.maxRooms} Rooms
            </Badge>
            <Button
              onClick={() => setBuildMode(!buildMode)}
              className={buildMode ? "bg-pink-500 hover:bg-pink-600" : "bg-cyan-500 hover:bg-cyan-600"}
              data-testid="button-toggle-build"
            >
              {buildMode ? <X className="w-4 h-4 mr-2" /> : <Wrench className="w-4 h-4 mr-2" />}
              {buildMode ? "Exit Build" : "Build Mode"}
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Room Navigation */}
          <div className="lg:col-span-1">
            <GlassCard glow className="p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <DoorOpen className="w-5 h-5 text-cyan-400" />
                Rooms
              </h3>
              <div className="space-y-2">
                {interior?.rooms?.map((room) => {
                  const RoomIcon = ROOM_ICONS[room.roomType] || ROOM_ICONS.default;
                  const isSelected = selectedRoom?.id === room.id;
                  return (
                    <motion.button
                      key={room.id}
                      onClick={() => setSelectedRoom(room)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full p-3 rounded-lg border transition-all flex items-center gap-3 ${
                        isSelected
                          ? "bg-cyan-500/20 border-cyan-400/50 shadow-[0_0_20px_rgba(0,255,255,0.2)]"
                          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                      }`}
                      data-testid={`button-room-${room.id}`}
                    >
                      <div className={`p-2 rounded-lg ${isSelected ? "bg-cyan-500/30" : "bg-white/10"}`}>
                        <RoomIcon className={`w-5 h-5 ${isSelected ? "text-cyan-300" : "text-slate-400"}`} />
                      </div>
                      <div className="text-left flex-1">
                        <p className={`font-medium ${isSelected ? "text-white" : "text-slate-300"}`}>{room.name}</p>
                        <p className="text-xs text-slate-500 capitalize">{room.roomType.replace("_", " ")}</p>
                      </div>
                      {isSelected && <Sparkles className="w-4 h-4 text-cyan-400" />}
                    </motion.button>
                  );
                })}
              </div>
            </GlassCard>
          </div>

          {/* Room View */}
          <div className="lg:col-span-2">
            <GlassCard glow className="p-6 min-h-[500px]">
              {currentRoom ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">{currentRoom.name}</h3>
                    <Badge className="bg-purple-500/20 border-purple-400/30 text-purple-300">
                      {currentRoom.gridWidth}x{currentRoom.gridHeight} Grid
                    </Badge>
                  </div>

                  {/* Room Grid */}
                  <div
                    className="relative bg-slate-900/50 rounded-xl border border-white/10 p-4 overflow-hidden"
                    style={{
                      display: "grid",
                      gridTemplateColumns: `repeat(${currentRoom.gridWidth}, 1fr)`,
                      gap: "4px",
                      aspectRatio: `${currentRoom.gridWidth}/${currentRoom.gridHeight}`,
                    }}
                  >
                    {Array.from({ length: currentRoom.gridWidth * currentRoom.gridHeight }).map((_, i) => {
                      const x = i % currentRoom.gridWidth;
                      const y = Math.floor(i / currentRoom.gridWidth);
                      const objectHere = currentRoom.objects?.find(o => o.positionX === x && o.positionY === y);
                      
                      return (
                        <motion.div
                          key={i}
                          onClick={() => {
                            if (buildMode && selectedCatalogItem && !objectHere) {
                              placeObjectMutation.mutate({
                                catalogId: selectedCatalogItem.id,
                                roomId: currentRoom.id,
                                x, y,
                              });
                            } else if (objectHere && !buildMode) {
                              setInteractingObject(objectHere);
                            }
                          }}
                          whileHover={{ scale: objectHere || (buildMode && selectedCatalogItem) ? 1.05 : 1 }}
                          className={`
                            aspect-square rounded-lg border transition-all cursor-pointer flex items-center justify-center text-2xl
                            ${objectHere 
                              ? "bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border-cyan-400/40 shadow-[0_0_15px_rgba(0,255,255,0.2)]"
                              : buildMode && selectedCatalogItem
                                ? "bg-green-500/10 border-green-400/30 hover:bg-green-500/20"
                                : "bg-white/5 border-white/5 hover:bg-white/10"
                            }
                          `}
                          data-testid={`grid-cell-${x}-${y}`}
                        >
                          {objectHere ? (
                            <span className="drop-shadow-lg">{objectHere.catalog?.iconEmoji || "📦"}</span>
                          ) : buildMode && selectedCatalogItem ? (
                            <Plus className="w-4 h-4 text-green-400" />
                          ) : null}
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Instructions */}
                  <p className="text-center text-slate-400 text-sm mt-4">
                    {buildMode 
                      ? selectedCatalogItem
                        ? "Click an empty cell to place the object"
                        : "Select an object from the catalog on the right"
                      : "Click on an object to interact with it"
                    }
                  </p>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <Home className="w-16 h-16 text-slate-600 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-400 mb-2">Select a Room</h3>
                  <p className="text-slate-500">Choose a room from the left to view and interact with it</p>
                </div>
              )}
            </GlassCard>
          </div>

          {/* Catalog / Object Details */}
          <div className="lg:col-span-1">
            {buildMode ? (
              <GlassCard glow className="p-4">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-pink-400" />
                  Object Catalog
                </h3>
                <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                  {catalog?.map((item) => {
                    const isSelected = selectedCatalogItem?.id === item.id;
                    const CategoryIcon = CATEGORY_ICONS[item.category] || CATEGORY_ICONS.default;
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => setSelectedCatalogItem(isSelected ? null : item)}
                        whileHover={{ scale: 1.02 }}
                        className={`w-full p-3 rounded-lg border transition-all text-left ${
                          isSelected
                            ? "bg-pink-500/20 border-pink-400/50"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                        data-testid={`catalog-item-${item.id}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{item.iconEmoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-white truncate">{item.name}</p>
                            <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs border-amber-400/30 text-amber-300">
                                <Coins className="w-3 h-3 mr-1" />
                                {item.shellsCost}
                              </Badge>
                              <Badge variant="outline" className="text-xs border-green-400/30 text-green-300">
                                +{item.shellsPerUse}/use
                              </Badge>
                            </div>
                          </div>
                          {isSelected && <Check className="w-5 h-5 text-pink-400" />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </GlassCard>
            ) : interactingObject ? (
              <GlassCard glow className="p-4">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Interact
                </h3>
                <div className="text-center mb-4">
                  <span className="text-5xl">{interactingObject.catalog?.iconEmoji || "📦"}</span>
                  <h4 className="text-xl font-bold text-white mt-2">{interactingObject.catalog?.name}</h4>
                  <p className="text-slate-400 text-sm">{interactingObject.catalog?.description}</p>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Total Uses</span>
                    <span className="text-white font-medium">{interactingObject.totalUses}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Shells per Use</span>
                    <span className="text-green-400 font-medium">+{interactingObject.catalog?.shellsPerUse}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Cooldown</span>
                    <span className="text-amber-400 font-medium">{interactingObject.catalog?.useCooldownMinutes} min</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {interactingObject.catalog?.interactionVerbs?.map((verb) => (
                    <Button
                      key={verb}
                      onClick={() => interactMutation.mutate({ objectId: interactingObject.id, verb })}
                      disabled={interactMutation.isPending}
                      className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 capitalize"
                      data-testid={`button-interact-${verb}`}
                    >
                      {interactMutation.isPending ? "..." : verb}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  onClick={() => setInteractingObject(null)}
                  className="w-full mt-3 text-slate-400 hover:text-white"
                >
                  Cancel
                </Button>

                {buildMode && (
                  <Button
                    variant="destructive"
                    onClick={() => removeObjectMutation.mutate(interactingObject.id)}
                    className="w-full mt-2"
                    data-testid="button-remove-object"
                  >
                    Remove Object
                  </Button>
                )}
              </GlassCard>
            ) : (
              <GlassCard glow className="p-4">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400" />
                  Room Stats
                </h3>
                {currentRoom ? (
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-sm">Objects Placed</span>
                        <span className="text-white font-medium">{currentRoom.objects?.length || 0}</span>
                      </div>
                      <Progress value={(currentRoom.objects?.length || 0) / (currentRoom.gridWidth * currentRoom.gridHeight) * 100} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20">
                        <Heart className="w-5 h-5 text-cyan-400 mb-1" />
                        <p className="text-xs text-slate-400">Comfort</p>
                        <p className="text-lg font-bold text-white">+{currentRoom.objects?.reduce((sum, o) => sum + (o.catalog?.statBonuses?.comfort || 0), 0) || 0}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
                        <Gamepad2 className="w-5 h-5 text-purple-400 mb-1" />
                        <p className="text-xs text-slate-400">Fun</p>
                        <p className="text-lg font-bold text-white">+{currentRoom.objects?.reduce((sum, o) => sum + (o.catalog?.statBonuses?.entertainment || 0), 0) || 0}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                        <Brain className="w-5 h-5 text-green-400 mb-1" />
                        <p className="text-xs text-slate-400">Focus</p>
                        <p className="text-lg font-bold text-white">+{currentRoom.objects?.reduce((sum, o) => sum + (o.catalog?.statBonuses?.productivity || 0), 0) || 0}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20">
                        <Coins className="w-5 h-5 text-amber-400 mb-1" />
                        <p className="text-xs text-slate-400">Shells/Use</p>
                        <p className="text-lg font-bold text-white">+{currentRoom.objects?.reduce((sum, o) => sum + (o.catalog?.shellsPerUse || 0), 0) || 0}</p>
                      </div>
                    </div>

                    <p className="text-slate-500 text-xs text-center">
                      Click on objects to interact and earn Shells!
                    </p>
                  </div>
                ) : (
                  <p className="text-slate-400 text-center">Select a room to view stats</p>
                )}
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
