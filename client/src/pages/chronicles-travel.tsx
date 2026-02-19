import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { getChroniclesSession } from "./chronicles-login";
import {
  MapPin, Plane, Car, Train, Ship, Bike, Footprints,
  Compass, Clock, Coins, Zap, Shield, Star, Globe, ChevronRight,
  AlertTriangle, ArrowLeft, Navigation, Route, Trophy, Sparkles,
  Eye, Lock, Mountain, TreePine, Building, Waves, Sun, Moon,
  Wind, CloudRain, Milestone, X, Check, PlayCircle
} from "lucide-react";

const ERA_MAP_THEMES = {
  modern: {
    bg: "bg-slate-950",
    landUnlocked: "#10b981",
    landLocked: "#1e293b",
    ocean: "#0c1222",
    border: "#334155",
    cityGlow: "#06b6d4",
    routeColor: "#06b6d4",
    textColor: "#e2e8f0",
    label: "Digital Atlas",
    font: "font-mono",
  },
  wildwest: {
    bg: "bg-amber-950/30",
    landUnlocked: "#92400e",
    landLocked: "#292524",
    ocean: "#1c1917",
    border: "#78716c",
    cityGlow: "#f59e0b",
    routeColor: "#f59e0b",
    textColor: "#fef3c7",
    label: "Frontier Map",
    font: "font-serif",
  },
  medieval: {
    bg: "bg-stone-950/30",
    landUnlocked: "#57534e",
    landLocked: "#1c1917",
    ocean: "#0f0e0d",
    border: "#a8a29e",
    cityGlow: "#d97706",
    routeColor: "#d97706",
    textColor: "#d6d3d1",
    label: "Ancient Cartography",
    font: "font-serif italic",
  },
};

const TRANSPORT_ICONS: Record<string, any> = {
  walk: Footprints,
  bicycle: Bike,
  horse: Compass,
  horse_cart: Compass,
  stagecoach: Compass,
  ship: Ship,
  train: Train,
  motorcycle: Bike,
  car: Car,
  bus: Car,
  plane: Plane,
};

interface CityData {
  code: string;
  name: string;
  medievalName?: string;
  wildwestName?: string;
  modernName?: string;
  latitude: number;
  longitude: number;
  populationTier: string;
  isStartingCity: boolean;
  isEasterEgg: boolean;
  fogOfWar: boolean;
  medievalDescription?: string;
  wildwestDescription?: string;
  modernDescription?: string;
  arrivalCinematicMedieval?: string;
  arrivalCinematicWildwest?: string;
  arrivalCinematicModern?: string;
}

function latLngToMapPosition(lat: number, lng: number, width: number, height: number) {
  const x = ((lng + 180) / 360) * width;
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = height / 2 - (mercN / Math.PI) * (height / 2);
  return { x, y };
}

function getCityName(city: CityData, era: string) {
  if (era === "medieval") return city.medievalName || city.name;
  if (era === "wildwest") return city.wildwestName || city.name;
  return city.modernName || city.name;
}

function getCityDescription(city: CityData, era: string) {
  if (era === "medieval") return city.medievalDescription;
  if (era === "wildwest") return city.wildwestDescription;
  return city.modernDescription;
}

export default function ChroniclesTravel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const session = getChroniclesSession();
  const mapRef = useRef<SVGSVGElement>(null);

  const [currentEra, setCurrentEra] = useState<string>("modern");
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [destinationCity, setDestinationCity] = useState<CityData | null>(null);
  const [selectedTransport, setSelectedTransport] = useState<string>("");
  const [showTravelPlan, setShowTravelPlan] = useState(false);
  const [showEncounter, setShowEncounter] = useState<any>(null);
  const [showArrival, setShowArrival] = useState<any>(null);
  const [mapZoom, setMapZoom] = useState(1);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });

  const theme = ERA_MAP_THEMES[currentEra as keyof typeof ERA_MAP_THEMES] || ERA_MAP_THEMES.modern;

  const { data: regions } = useQuery({ queryKey: ["/api/chronicles/world/regions"], queryFn: () => fetch("/api/chronicles/world/regions").then(r => r.json()) });
  const { data: cities } = useQuery({ queryKey: ["/api/chronicles/world/cities", "us"], queryFn: () => fetch("/api/chronicles/world/cities?country=us").then(r => r.json()) });
  const { data: transportModes } = useQuery({ queryKey: ["/api/chronicles/travel/transport-modes", currentEra], queryFn: () => fetch(`/api/chronicles/travel/transport-modes?era=${currentEra}`).then(r => r.json()) });
  const { data: routes } = useQuery({ queryKey: ["/api/chronicles/travel/routes", currentEra], queryFn: () => fetch(`/api/chronicles/travel/routes?era=${currentEra}`).then(r => r.json()) });
  const { data: travelStatus, refetch: refetchStatus } = useQuery({
    queryKey: ["/api/chronicles/travel/status"],
    queryFn: () => fetch(`/api/chronicles/travel/status?userId=${session?.account?.id || "demo"}`).then(r => r.json()),
    refetchInterval: 15000,
  });
  const { data: stamps } = useQuery({ queryKey: ["/api/chronicles/stamps"], queryFn: () => fetch("/api/chronicles/stamps").then(r => r.json()) });
  const { data: legacyScore } = useQuery({
    queryKey: ["/api/chronicles/legacy", session?.account?.id],
    queryFn: () => fetch(`/api/chronicles/legacy/${session?.account?.id || "demo"}`).then(r => r.json()),
    enabled: !!session?.account?.id,
  });

  const planMutation = useMutation({
    mutationFn: (data: any) => fetch("/api/chronicles/travel/plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(r => r.json()),
  });

  const startMutation = useMutation({
    mutationFn: (data: any) => fetch("/api/chronicles/travel/start", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(r => r.json()),
    onSuccess: (data) => {
      if (data.arrivalCinematic) {
        setShowArrival({ cinematic: data.arrivalCinematic, city: destinationCity });
      }
      toast({ title: "Journey Started!", description: data.message });
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/travel/status"] });
      setShowTravelPlan(false);
      setDestinationCity(null);
    },
  });

  const resolveMutation = useMutation({
    mutationFn: ({ id, choiceIndex }: { id: string; choiceIndex: number }) =>
      fetch(`/api/chronicles/travel/encounter/${id}/resolve`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ choiceIndex }) }).then(r => r.json()),
    onSuccess: (data) => {
      toast({ title: "Encounter Resolved", description: data.outcome });
      setShowEncounter(null);
      refetchStatus();
    },
  });

  useEffect(() => {
    if (travelStatus?.encounter && !travelStatus.encounter.isResolved) {
      setShowEncounter(travelStatus.encounter);
    }
    if (travelStatus?.completed && travelStatus?.arrivalCinematic) {
      setShowArrival({ cinematic: travelStatus.arrivalCinematic, city: null });
    }
  }, [travelStatus]);

  const handlePlanTravel = useCallback(() => {
    if (!selectedCity || !destinationCity || !selectedTransport) return;
    planMutation.mutate({
      fromCityCode: selectedCity.code,
      toCityCode: destinationCity.code,
      transportModeCode: selectedTransport,
      era: currentEra,
    });
    setShowTravelPlan(true);
  }, [selectedCity, destinationCity, selectedTransport, currentEra]);

  const handleStartTravel = useCallback((travelType: string) => {
    if (!selectedCity || !destinationCity) return;
    startMutation.mutate({
      userId: session?.account?.id || "demo",
      characterId: session?.account?.id || "demo",
      era: currentEra,
      fromCityCode: selectedCity.code,
      toCityCode: destinationCity.code,
      transportModeCode: selectedTransport,
      travelType,
    });
  }, [selectedCity, destinationCity, selectedTransport, currentEra, session]);

  const mapWidth = 1200;
  const mapHeight = 700;

  const cityPositions = useMemo(() => {
    if (!cities) return [];
    return cities.map((city: CityData) => ({
      ...city,
      ...latLngToMapPosition(city.latitude, city.longitude, mapWidth, mapHeight),
    }));
  }, [cities]);

  const routeLines = useMemo(() => {
    if (!routes || !cities) return [];
    return routes.map((route: any) => {
      const fromCity = cities.find((c: CityData) => c.code === route.fromCityCode);
      const toCity = cities.find((c: CityData) => c.code === route.toCityCode);
      if (!fromCity || !toCity || fromCity.code === toCity.code) return null;
      const from = latLngToMapPosition(fromCity.latitude, fromCity.longitude, mapWidth, mapHeight);
      const to = latLngToMapPosition(toCity.latitude, toCity.longitude, mapWidth, mapHeight);
      return { ...route, from, to };
    }).filter(Boolean);
  }, [routes, cities]);

  const isActiveTraveling = travelStatus?.traveling;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="container mx-auto px-4 pt-20 pb-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 sm:mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/chronicles-hub">
                <Button variant="ghost" size="icon" className="min-w-[44px] min-h-[44px]" data-testid="btn-back-hub"><ArrowLeft className="w-5 h-5" /></Button>
              </Link>
              <div>
                <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent" data-testid="text-travel-title">
                  World Map
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm">Explore the world across eras</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {(["modern", "wildwest", "medieval"] as const).map(era => (
              <Button key={era} variant={currentEra === era ? "default" : "outline"} size="sm"
                className={`min-h-[44px] flex-shrink-0 text-xs sm:text-sm ${currentEra === era ? "bg-cyan-600 hover:bg-cyan-700" : "border-slate-600"}`} 
                onClick={() => setCurrentEra(era)} data-testid={`btn-era-${era}`}>
                {era === "modern" ? "Modern" : era === "wildwest" ? "Wild West" : "Medieval"}
              </Button>
            ))}
          </div>
        </motion.div>

        {legacyScore && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
            <GlassCard glow className="p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                  <div>
                    <p className="text-xs sm:text-sm text-slate-400">Legacy</p>
                    <p className="font-bold text-sm sm:text-base text-amber-400" data-testid="text-legacy-title">{legacyScore.legacyTitle}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm w-full sm:w-auto">
                  <div><span className="text-slate-400">Score: </span><span className="text-cyan-400 font-bold" data-testid="text-legacy-score">{legacyScore.totalScore?.toLocaleString()}</span></div>
                  <div><span className="text-slate-400">Cities: </span><span className="text-green-400 font-bold">{legacyScore.citiesVisited}</span></div>
                  <div><span className="text-slate-400">Miles: </span><span className="text-purple-400 font-bold">{Math.round(legacyScore.travelMilesLogged || 0).toLocaleString()}</span></div>
                  <div><span className="text-slate-400">Encounters: </span><span className="text-orange-400 font-bold">{legacyScore.encountersResolved}</span></div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {isActiveTraveling && travelStatus?.session && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-4 sm:mb-6">
            <GlassCard glow className="p-4 sm:p-6 border-cyan-500/30">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Navigation className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 animate-pulse" />
                <h3 className="text-sm sm:text-lg font-bold text-cyan-400">Active Journey</h3>
                <Badge className="bg-cyan-500/20 text-cyan-400 text-[10px] sm:text-xs">{travelStatus.session.travelType === "compressed" ? "Time-Compressed" : "Real-Time"}</Badge>
              </div>
              <div className="flex items-center gap-2 mb-3 text-xs sm:text-sm text-slate-300">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" /> 
                <span className="truncate">{travelStatus.session.fromCityCode}</span> 
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" /> 
                <span className="truncate">{travelStatus.session.toCityCode}</span>
              </div>
              <Progress value={travelStatus.session.progressPercent} className="h-2 sm:h-3 mb-2" />
              <div className="flex justify-between text-[10px] sm:text-xs text-slate-400">
                <span>{Math.round(travelStatus.milesTraveled || 0)} mi</span>
                <span>{Math.round(travelStatus.session.progressPercent)}%</span>
                <span>{Math.round(travelStatus.milesRemaining || 0)} mi left</span>
              </div>
            </GlassCard>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <GlassCard glow className="p-2 sm:p-4 overflow-hidden">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                  <span className={`text-xs sm:text-sm ${theme.font} text-slate-300`}>{theme.label}</span>
                </div>
                <div className="flex gap-0.5 sm:gap-1">
                  <Button variant="ghost" size="sm" className="min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] text-lg" onClick={() => setMapZoom(z => Math.min(z + 0.3, 3))} data-testid="btn-zoom-in">+</Button>
                  <Button variant="ghost" size="sm" className="min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] text-xs" onClick={() => setMapZoom(1)} data-testid="btn-zoom-reset">Reset</Button>
                  <Button variant="ghost" size="sm" className="min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] text-lg" onClick={() => setMapZoom(z => Math.max(z - 0.3, 0.5))} data-testid="btn-zoom-out">-</Button>
                </div>
              </div>

              <div className="relative rounded-lg overflow-hidden border border-white/10" style={{ background: theme.ocean }}>
                <svg ref={mapRef} viewBox={`0 0 ${mapWidth} ${mapHeight}`} className="w-full h-auto"
                  style={{ transform: `scale(${mapZoom}) translate(${mapOffset.x}px, ${mapOffset.y}px)`, transformOrigin: "center" }}>
                  <defs>
                    <filter id="cityGlow">
                      <feGaussianBlur stdDeviation="4" result="glow" />
                      <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="routeGlow">
                      <feGaussianBlur stdDeviation="2" result="glow" />
                      <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <linearGradient id="usGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={theme.landUnlocked} stopOpacity="0.6" />
                      <stop offset="100%" stopColor={theme.landUnlocked} stopOpacity="0.3" />
                    </linearGradient>
                  </defs>

                  <rect x="0" y="0" width={mapWidth} height={mapHeight} fill={theme.ocean} />

                  {regions?.filter((r: any) => !r.isUnlocked).map((region: any) => {
                    const pos = latLngToMapPosition(region.latitude, region.longitude, mapWidth, mapHeight);
                    return (
                      <g key={region.code}>
                        <circle cx={pos.x} cy={pos.y} r="40" fill={theme.landLocked} opacity="0.3" />
                        <text x={pos.x} y={pos.y - 10} textAnchor="middle" fill={theme.border} fontSize="10" opacity="0.6" className={theme.font}>{region.name}</text>
                        {region.seasonLabel && (
                          <text x={pos.x} y={pos.y + 8} textAnchor="middle" fill={theme.border} fontSize="8" opacity="0.4" fontStyle="italic">{region.seasonLabel}</text>
                        )}
                        <rect x={pos.x - 4} y={pos.y + 14} width="8" height="6" rx="1" fill="none" stroke={theme.border} strokeWidth="1" opacity="0.4" />
                        <path d={`M${pos.x - 2} ${pos.y + 14} V${pos.y + 12} A2 2 0 0 1 ${pos.x + 2} ${pos.y + 12} V${pos.y + 14}`} fill="none" stroke={theme.border} strokeWidth="1" opacity="0.4" />
                      </g>
                    );
                  })}

                  <ellipse cx={latLngToMapPosition(39, -98, mapWidth, mapHeight).x}
                    cy={latLngToMapPosition(39, -98, mapWidth, mapHeight).y}
                    rx="130" ry="80" fill="url(#usGradient)" stroke={theme.border} strokeWidth="0.5" opacity="0.5" />

                  {routeLines.map((route: any, i: number) => {
                    const isActiveRoute = isActiveTraveling && travelStatus?.session &&
                      ((travelStatus.session.fromCityCode === route.fromCityCode && travelStatus.session.toCityCode === route.toCityCode) ||
                        (travelStatus.session.toCityCode === route.fromCityCode && travelStatus.session.fromCityCode === route.toCityCode));
                    return (
                      <line key={i} x1={route.from.x} y1={route.from.y} x2={route.to.x} y2={route.to.y}
                        stroke={isActiveRoute ? "#22d3ee" : theme.routeColor}
                        strokeWidth={isActiveRoute ? 2.5 : 0.8} opacity={isActiveRoute ? 1 : 0.15}
                        strokeDasharray={isActiveRoute ? "6 3" : "none"}
                        filter={isActiveRoute ? "url(#routeGlow)" : "none"}>
                        {isActiveRoute && (
                          <animate attributeName="stroke-dashoffset" from="0" to="-18" dur="1s" repeatCount="indefinite" />
                        )}
                      </line>
                    );
                  })}

                  {cityPositions.map((city: any) => {
                    const isSelected = selectedCity?.code === city.code;
                    const isDestination = destinationCity?.code === city.code;
                    const isEasterEgg = city.isEasterEgg;
                    const size = city.populationTier === "mega" ? 6 : city.populationTier === "large" ? 5 : city.populationTier === "medium" ? 4 : 3;

                    return (
                      <g key={city.code} className="cursor-pointer" onClick={() => {
                        if (!selectedCity || selectedCity.code === city.code) {
                          setSelectedCity(city);
                          setDestinationCity(null);
                        } else {
                          setDestinationCity(city);
                        }
                      }} data-testid={`city-marker-${city.code}`}>
                        <circle cx={city.x} cy={city.y} r={size + 4} fill={theme.cityGlow} opacity={isSelected || isDestination ? 0.4 : 0} filter="url(#cityGlow)">
                          {(isSelected || isDestination) && (
                            <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite" />
                          )}
                        </circle>
                        <circle cx={city.x} cy={city.y} r={size}
                          fill={isEasterEgg ? "#fbbf24" : isSelected ? "#22d3ee" : isDestination ? "#a855f7" : theme.cityGlow}
                          stroke={isSelected || isDestination ? "#fff" : theme.border}
                          strokeWidth={isSelected || isDestination ? 1.5 : 0.5}
                          opacity={isEasterEgg ? 0.7 : 0.9} />
                        {!isEasterEgg && (
                          <text x={city.x} y={city.y - size - 4} textAnchor="middle" fill={theme.textColor} fontSize="8" fontWeight={isSelected ? "bold" : "normal"}>
                            {getCityName(city, currentEra)}
                          </text>
                        )}
                        {isEasterEgg && (
                          <text x={city.x} y={city.y - size - 4} textAnchor="middle" fill="#fbbf24" fontSize="7" fontStyle="italic" opacity="0.6">?</text>
                        )}
                      </g>
                    );
                  })}

                  {isActiveTraveling && travelStatus?.session && (() => {
                    const fromPos = cityPositions.find((c: any) => c.code === travelStatus.session.fromCityCode);
                    const toPos = cityPositions.find((c: any) => c.code === travelStatus.session.toCityCode);
                    if (!fromPos || !toPos) return null;
                    const progress = (travelStatus.session.progressPercent || 0) / 100;
                    const travelerX = fromPos.x + (toPos.x - fromPos.x) * progress;
                    const travelerY = fromPos.y + (toPos.y - fromPos.y) * progress;
                    return (
                      <g>
                        <circle cx={travelerX} cy={travelerY} r="8" fill="#22d3ee" opacity="0.3" filter="url(#cityGlow)">
                          <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <circle cx={travelerX} cy={travelerY} r="4" fill="#22d3ee" stroke="#fff" strokeWidth="1" />
                        <text x={travelerX} y={travelerY - 12} textAnchor="middle" fill="#22d3ee" fontSize="8" fontWeight="bold">YOU</text>
                      </g>
                    );
                  })()}
                </svg>

                {selectedCity && !destinationCity && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-3 sm:p-4" data-testid="panel-city-info">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 flex-shrink-0" />
                        <h3 className="font-bold text-sm sm:text-lg truncate" data-testid="text-city-name">{getCityName(selectedCity, currentEra)}</h3>
                        {selectedCity.isStartingCity && <Badge className="bg-green-500/20 text-green-400 text-[10px] sm:text-xs flex-shrink-0">Start</Badge>}
                        {selectedCity.isEasterEgg && <Badge className="bg-amber-500/20 text-amber-400 text-[10px] sm:text-xs flex-shrink-0">Hidden</Badge>}
                      </div>
                      <Button variant="ghost" size="icon" className="min-w-[44px] min-h-[44px] flex-shrink-0" onClick={() => setSelectedCity(null)}><X className="w-4 h-4" /></Button>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-3">{getCityDescription(selectedCity, currentEra)}</p>
                    <p className="text-[10px] sm:text-xs text-cyan-400">Tap a destination city to plan your journey</p>
                  </motion.div>
                )}
              </div>
            </GlassCard>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {selectedCity && destinationCity && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <GlassCard glow className="p-3 sm:p-4">
                  <h3 className="font-bold text-cyan-400 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <Route className="w-4 h-4 sm:w-5 sm:h-5" /> Plan Journey
                  </h3>
                  <div className="flex items-center gap-2 mb-3 sm:mb-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-1 bg-cyan-500/10 rounded px-2 py-1 min-w-0">
                      <MapPin className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                      <span className="truncate">{getCityName(selectedCity, currentEra)}</span>
                    </div>
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500 flex-shrink-0" />
                    <div className="flex items-center gap-1 bg-purple-500/10 rounded px-2 py-1 min-w-0">
                      <MapPin className="w-3 h-3 text-purple-400 flex-shrink-0" />
                      <span className="truncate">{getCityName(destinationCity, currentEra)}</span>
                    </div>
                  </div>

                  <p className="text-[10px] sm:text-xs text-slate-400 mb-2">Choose transport:</p>
                  <div className="grid grid-cols-2 gap-2 mb-3 sm:mb-4">
                    {transportModes?.map((mode: any) => {
                      const Icon = TRANSPORT_ICONS[mode.code] || Footprints;
                      return (
                        <button key={mode.code} onClick={() => setSelectedTransport(mode.code)}
                          className={`p-2.5 sm:p-2 rounded-lg border text-left text-xs transition-all min-h-[48px] ${selectedTransport === mode.code
                            ? "border-cyan-500 bg-cyan-500/10" : "border-slate-700 hover:border-slate-500 active:bg-white/5"}`}
                          data-testid={`btn-transport-${mode.code}`}>
                          <div className="flex items-center gap-1 mb-1">
                            <span>{mode.iconEmoji}</span>
                            <span className="font-medium">{mode.name}</span>
                          </div>
                          <span className="text-slate-400">{mode.speedMph} mph</span>
                        </button>
                      );
                    })}
                  </div>

                  <Button className="w-full bg-cyan-600 hover:bg-cyan-700 min-h-[48px]" onClick={handlePlanTravel}
                    disabled={!selectedTransport || planMutation.isPending} data-testid="btn-plan-travel">
                    <Compass className="w-4 h-4 mr-2" /> {planMutation.isPending ? "Planning..." : "Plan Route"}
                  </Button>
                </GlassCard>
              </motion.div>
            )}

            {!selectedCity && !isActiveTraveling && (
              <GlassCard glow className="p-4">
                <div className="text-center py-6">
                  <Globe className="w-12 h-12 text-cyan-400/30 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">Select a city on the map to begin</p>
                  <p className="text-slate-500 text-xs mt-1">Click a city, then click your destination</p>
                </div>
              </GlassCard>
            )}

            <GlassCard glow className="p-3 sm:p-4">
              <h3 className="font-bold text-amber-400 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5" /> Achievement Stamps
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-3 gap-1.5 sm:gap-2">
                {stamps?.slice(0, 12).map((stamp: any) => (
                  <div key={stamp.code} className="text-center p-1.5 sm:p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-amber-500/30 active:bg-white/5 transition-all"
                    data-testid={`stamp-${stamp.code}`} title={stamp.description}>
                    <span className="text-lg sm:text-xl">{stamp.iconEmoji}</span>
                    <p className="text-[8px] sm:text-[10px] text-slate-400 mt-0.5 sm:mt-1 truncate">{stamp.name}</p>
                    {stamp.isHidden && <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-600 mx-auto mt-0.5" />}
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard glow className="p-3 sm:p-4">
              <h3 className="font-bold text-purple-400 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                <Milestone className="w-4 h-4 sm:w-5 sm:h-5" /> Transport Guide
              </h3>
              <div className="space-y-1 text-[10px] sm:text-xs">
                {transportModes?.map((mode: any) => (
                  <div key={mode.code} className="flex items-center justify-between py-1.5 sm:py-1 border-b border-slate-800/50">
                    <span className="flex items-center gap-1"><span>{mode.iconEmoji}</span> {mode.name}</span>
                    <span className="text-slate-400">{mode.speedMph} mph</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showTravelPlan && planMutation.data && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4" onClick={() => setShowTravelPlan(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-white/10 rounded-t-2xl sm:rounded-2xl p-4 sm:p-6 max-w-xl w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()} data-testid="modal-travel-plan">
              <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mb-3 sm:hidden" />
              <h2 className="text-lg sm:text-xl font-bold text-cyan-400 mb-3 sm:mb-4 flex items-center gap-2">
                <Navigation className="w-5 h-5 sm:w-6 sm:h-6" /> Journey Plan
              </h2>

              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 p-2 sm:p-3 bg-slate-800/50 rounded-lg">
                <div className="text-center min-w-0">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 mx-auto" />
                  <p className="text-xs sm:text-sm font-medium truncate">{planMutation.data.from?.name}</p>
                </div>
                <div className="flex-1 border-t border-dashed border-slate-600 relative">
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800 px-1.5 sm:px-2 text-[10px] sm:text-xs text-slate-400 whitespace-nowrap">
                    {planMutation.data.distanceMiles} mi
                  </span>
                </div>
                <div className="text-center min-w-0">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 mx-auto" />
                  <p className="text-xs sm:text-sm font-medium truncate">{planMutation.data.to?.name}</p>
                </div>
              </div>

              {planMutation.data.routeDescription && (
                <p className="text-sm text-slate-300 mb-4 italic border-l-2 border-cyan-500/30 pl-3">{planMutation.data.routeDescription}</p>
              )}

              <div className="flex items-center gap-2 mb-3 sm:mb-4 text-xs sm:text-sm text-slate-400">
                <span>{planMutation.data.transport?.emoji}</span>
                <span>{planMutation.data.transport?.name} at {planMutation.data.transport?.speedMph} mph</span>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {Object.values(planMutation.data.options || {}).map((option: any) => (
                  <div key={option.type} className="p-3 sm:p-4 rounded-lg border border-slate-700 hover:border-cyan-500/30 active:bg-white/5 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-xs sm:text-sm">{option.label}</h4>
                      <Badge className={`text-[10px] sm:text-xs ${option.type === "realtime" ? "bg-green-500/20 text-green-400" :
                        option.type === "compressed" ? "bg-amber-500/20 text-amber-400" : "bg-purple-500/20 text-purple-400"}`}>
                        {option.type === "realtime" ? "Best XP" : option.type === "compressed" ? "Balanced" : "Instant"}
                      </Badge>
                    </div>
                    <p className="text-[10px] sm:text-xs text-slate-400 mb-2 sm:mb-3">{option.description}</p>
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-[10px] sm:text-xs mb-2 sm:mb-3">
                      <div className="text-center p-1.5 sm:p-2 bg-slate-800/50 rounded">
                        <Clock className="w-3 h-3 text-cyan-400 mx-auto mb-0.5 sm:mb-1" />
                        <p className="text-slate-300">{option.travelTimeDisplay}</p>
                      </div>
                      <div className="text-center p-1.5 sm:p-2 bg-slate-800/50 rounded">
                        <Coins className="w-3 h-3 text-amber-400 mx-auto mb-0.5 sm:mb-1" />
                        <p className="text-slate-300">{option.echoCost} E</p>
                      </div>
                      <div className="text-center p-1.5 sm:p-2 bg-slate-800/50 rounded">
                        <Zap className="w-3 h-3 text-green-400 mx-auto mb-0.5 sm:mb-1" />
                        <p className="text-slate-300">{option.xpMultiplier}x XP</p>
                      </div>
                    </div>
                    <Button className="w-full min-h-[44px]" variant={option.type === "realtime" ? "default" : "outline"}
                      onClick={() => handleStartTravel(option.type)} disabled={startMutation.isPending}
                      data-testid={`btn-start-${option.type}`}>
                      <PlayCircle className="w-4 h-4 mr-2" /> {startMutation.isPending ? "Starting..." : `Start ${option.label}`}
                    </Button>
                  </div>
                ))}
              </div>

              <Button variant="ghost" className="w-full mt-3 sm:mt-4 min-h-[44px]" onClick={() => setShowTravelPlan(false)}>Cancel</Button>
            </motion.div>
          </motion.div>
        )}

        {showEncounter && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
              className={`bg-slate-900 border rounded-t-2xl sm:rounded-2xl p-4 sm:p-6 max-w-md w-full max-h-[85vh] overflow-y-auto ${currentEra === "medieval" ? "border-amber-500/30" :
                currentEra === "wildwest" ? "border-yellow-500/30" : "border-cyan-500/30"}`} data-testid="modal-encounter">
              <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mb-3 sm:hidden" />
              <div className="text-center mb-3 sm:mb-4">
                <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full mb-2 sm:mb-3 ${currentEra === "medieval" ? "bg-amber-500/20" :
                  currentEra === "wildwest" ? "bg-yellow-500/20" : "bg-cyan-500/20"}`}>
                  <AlertTriangle className={`w-6 h-6 sm:w-8 sm:h-8 ${currentEra === "medieval" ? "text-amber-400" :
                    currentEra === "wildwest" ? "text-yellow-400" : "text-cyan-400"}`} />
                </div>
                <Badge className="mb-2">{showEncounter.encounterType}</Badge>
                <h3 className="text-lg sm:text-xl font-bold">{showEncounter.title}</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mb-4 sm:mb-6 text-center">{showEncounter.description}</p>
              <div className="space-y-2">
                {JSON.parse(showEncounter.choices || "[]").map((choice: string, i: number) => (
                  <Button key={i} variant="outline" className="w-full justify-start text-left min-h-[48px] text-xs sm:text-sm" onClick={() => resolveMutation.mutate({ id: showEncounter.id, choiceIndex: i })}
                    disabled={resolveMutation.isPending} data-testid={`btn-encounter-choice-${i}`}>
                    <ChevronRight className="w-4 h-4 mr-2 flex-shrink-0" /> {choice}
                  </Button>
                ))}
              </div>
              <div className="flex items-center justify-center gap-4 mt-3 sm:mt-4 text-[10px] sm:text-xs text-slate-400">
                <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-green-400" /> +{showEncounter.xpReward} XP</span>
                <span className="flex items-center gap-1"><Coins className="w-3 h-3 text-amber-400" /> +{showEncounter.echoReward} Echoes</span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showArrival && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center px-6" onClick={() => setShowArrival(null)}>
            <motion.div initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.5, ease: "easeOut" }}
              className="text-center max-w-lg w-full" data-testid="modal-arrival">
              <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-cyan-400 mx-auto mb-4 sm:mb-6 animate-pulse" />
              </motion.div>
              <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }}
                className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3 sm:mb-4">
                You Have Arrived
              </motion.h2>
              <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.5 }}
                className="text-sm sm:text-lg text-slate-300 leading-relaxed italic">
                {showArrival.cinematic}
              </motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}
                className="text-xs sm:text-sm text-slate-500 mt-6 sm:mt-8">Tap anywhere to continue</motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
