import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { getChroniclesSession } from "./chronicles-login";
import {
  Home,
  Briefcase,
  Coffee,
  TreePine,
  BookOpen,
  ShoppingBag,
  Utensils,
  Dumbbell,
  Bed,
  Users,
  Heart,
  Zap,
  Smile,
  Apple,
  MapPin,
  Clock,
  Star,
  ChevronRight,
  Sun,
  Moon,
  Sparkles,
  Activity,
  ChevronLeft,
} from "lucide-react";

const locationIcons: Record<string, any> = {
  home: Home,
  office: Briefcase,
  gym: Dumbbell,
  cafe: Coffee,
  park: TreePine,
  library: BookOpen,
  mall: ShoppingBag,
  restaurant: Utensils,
};

const activityIcons: Record<string, any> = {
  sleep: Bed,
  eat: Utensils,
  exercise: Dumbbell,
  work: Briefcase,
  socialize: Users,
  relax: Coffee,
  study: BookOpen,
  shop: ShoppingBag,
  cook: Utensils,
  meditate: Sparkles,
};

interface ChronicleCharacter {
  id: string;
  name: string;
  era: string;
  energy: number;
  mood: number;
  health: number;
  social: number;
  hunger: number;
  currentLocation: string;
  currentActivity: string | null;
  experience: number;
  level: number;
  checkInStreak: number;
}

interface ActivityType {
  code: string;
  name: string;
  description: string;
  minEnergy: number | null;
  minMood: number | null;
  energyChange: number | null;
  moodChange: number | null;
  healthChange: number | null;
  socialChange: number | null;
  hungerChange: number | null;
  durationMinutes: number;
  shellReward: number | null;
  xpReward: number | null;
  locations: string[];
}

interface LocationType {
  code: string;
  name: string;
  description: string;
  era: string;
  availableActivities: string[];
}

function NeedBar({ label, value, icon: Icon, color, warning = 30 }: { 
  label: string; 
  value: number; 
  icon: any; 
  color: string;
  warning?: number;
}) {
  const isLow = label === "Hunger" ? value > (100 - warning) : value < warning;
  
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5" data-testid={`need-bar-${label.toLowerCase()}`}>
      <Icon className={`w-5 h-5 ${isLow ? "text-red-400 animate-pulse" : color}`} />
      <div className="flex-1">
        <div className="flex justify-between text-xs mb-1">
          <span className={`${isLow ? "text-red-400" : "text-gray-400"}`}>{label}</span>
          <span className={`${isLow ? "text-red-400 font-bold" : "text-gray-400"}`}>{Math.round(value)}%</span>
        </div>
        <Progress 
          value={value} 
          className={`h-2 ${isLow ? "[&>div]:bg-red-500" : `[&>div]:${color.replace("text-", "bg-")}`}`} 
        />
      </div>
    </div>
  );
}

function LocationCard({ location, isCurrentLocation, onTravel, disabled }: {
  location: LocationType;
  isCurrentLocation: boolean;
  onTravel: () => void;
  disabled: boolean;
}) {
  const Icon = locationIcons[location.code] || MapPin;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => !isCurrentLocation && !disabled && onTravel()}
      data-testid={`location-${location.code}`}
    >
      <GlassCard 
        glow={isCurrentLocation}
        className={`p-4 cursor-pointer transition-all ${
          isCurrentLocation 
            ? "ring-2 ring-cyan-400/50 bg-cyan-500/10" 
            : "hover:bg-white/5"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${isCurrentLocation ? "bg-cyan-500/20" : "bg-white/10"}`}>
            <Icon className={`w-6 h-6 ${isCurrentLocation ? "text-cyan-400" : "text-gray-400"}`} />
          </div>
          <div className="flex-1">
            <h4 className={`font-semibold ${isCurrentLocation ? "text-cyan-400" : "text-white"}`}>
              {location.name}
            </h4>
            <p className="text-xs text-gray-500 mt-1">{location.description}</p>
            {isCurrentLocation && (
              <span className="inline-flex items-center gap-1 mt-2 text-xs text-cyan-400">
                <MapPin className="w-3 h-3" /> You are here
              </span>
            )}
          </div>
          {!isCurrentLocation && (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          )}
        </div>
</motion.div>
  );
}

function ActivityCard({ activity, onPerform, disabled, energyLow, moodLow }: {
  activity: ActivityType;
  onPerform: () => void;
  disabled: boolean;
  energyLow: boolean;
  moodLow: boolean;
}) {
  const Icon = activityIcons[activity.code] || Activity;
  const cannotPerform = (activity.minEnergy && energyLow) || (activity.minMood && moodLow);
  
  return (
    <motion.div
      whileHover={{ scale: cannotPerform ? 1 : 1.02 }}
      whileTap={{ scale: cannotPerform ? 1 : 0.98 }}
      onClick={() => !cannotPerform && !disabled && onPerform()}
      data-testid={`activity-${activity.code}`}
    >
      <GlassCard 
        className={`p-4 transition-all ${
          cannotPerform 
            ? "opacity-50 cursor-not-allowed" 
            : "cursor-pointer hover:bg-white/5"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-purple-500/20">
            <Icon className="w-6 h-6 text-purple-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-white">{activity.name}</h4>
            <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
            
            <div className="flex flex-wrap gap-2 mt-3">
              {activity.energyChange && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activity.energyChange > 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                }`}>
                  {activity.energyChange > 0 ? "+" : ""}{activity.energyChange} Energy
                </span>
              )}
              {activity.moodChange && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activity.moodChange > 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                }`}>
                  {activity.moodChange > 0 ? "+" : ""}{activity.moodChange} Mood
                </span>
              )}
              {activity.shellReward && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">
                  +{activity.shellReward} Shells
                </span>
              )}
              {activity.xpReward && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
                  +{activity.xpReward} XP
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{activity.durationMinutes} min</span>
            </div>
          </div>
        </div>
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

export default function ChroniclesLife() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  
  const isNight = currentTime.getHours() >= 21 || currentTime.getHours() < 6;
  
  const getAuthHeaders = (): Record<string, string> => {
    const session = getChroniclesSession();
    if (session?.token) {
      return { Authorization: `Bearer ${session.token}` };
    }
    return {};
  };
  
  const { data: characterData, isLoading: loadingCharacter } = useQuery({
    queryKey: ["/api/chronicles/character/status"],
    queryFn: async () => {
      const res = await fetch("/api/chronicles/character/status", {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to load character");
      return res.json();
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });
  
  const { data: locationsData, isLoading: loadingLocations } = useQuery({
    queryKey: ["/api/chronicles/locations", "modern"],
    queryFn: async () => {
      const res = await fetch("/api/chronicles/locations?era=modern", {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to load locations");
      return res.json();
    },
    staleTime: 300000,
  });
  
  const { data: activitiesData, isLoading: loadingActivities } = useQuery({
    queryKey: ["/api/chronicles/activities", characterData?.character?.currentLocation],
    queryFn: async () => {
      const location = characterData?.character?.currentLocation || "home";
      const res = await fetch(`/api/chronicles/activities?location=${location}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to load activities");
      return res.json();
    },
    enabled: !!characterData?.character,
    staleTime: 60000,
  });
  
  const checkInMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/chronicles/daily-check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ characterId: characterData?.character?.id }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Check-in failed");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Daily Check-In!",
        description: `Day ${data.streak} streak! +${data.shellsEarned} Shells, +${data.xpEarned} XP`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/character/status"] });
    },
    onError: (error: Error) => {
      toast({
        title: error.message,
        variant: error.message.includes("Already") ? "default" : "destructive",
      });
    },
  });
  
  const travelMutation = useMutation({
    mutationFn: async (locationCode: string) => {
      const res = await fetch("/api/chronicles/travel", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ 
          characterId: characterData?.character?.id,
          locationCode 
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Travel failed");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: `Arrived at ${data.location.name}`,
        description: "You can now do activities at this location",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/character/status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/activities"] });
    },
    onError: (error: Error) => {
      toast({ title: error.message, variant: "destructive" });
    },
  });
  
  const activityMutation = useMutation({
    mutationFn: async (activityCode: string) => {
      const res = await fetch("/api/chronicles/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ 
          characterId: characterData?.character?.id,
          activityCode 
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Activity failed");
      }
      return res.json();
    },
    onSuccess: (data) => {
      const changes = data.changes;
      const rewards = [];
      if (changes.shells > 0) rewards.push(`+${changes.shells} Shells`);
      if (changes.xp > 0) rewards.push(`+${changes.xp} XP`);
      
      toast({
        title: `Completed: ${data.activity.name}`,
        description: rewards.length > 0 ? rewards.join(", ") : "Your needs have been updated",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/character/status"] });
    },
    onError: (error: Error) => {
      toast({ title: error.message, variant: "destructive" });
    },
  });
  
  const character: ChronicleCharacter | null = characterData?.character || null;
  const locations: LocationType[] = locationsData?.locations || [];
  const activities: ActivityType[] = activitiesData?.activities || [];
  
  if (loadingCharacter) {
    return (
      <div className="min-h-screen relative overflow-hidden pt-20 pb-12" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #3b82f6)" size={500} top="-5%" left="60%" />
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={400} top="40%" left="-10%" delay={3} />
        <div className="w-10 h-10 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!character) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <GlassCard glow className="p-8 text-center max-w-md">
          <Sparkles className="w-16 h-16 mx-auto text-cyan-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Start Your Journey</h2>
          <p className="text-gray-400 mb-6">Create your character to begin living your parallel life in Chronicles</p>
          <Link href="/chronicles/onboarding">
            <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white" data-testid="button-create-character">
              Create Character
            </Button>
          </Link>
</div>
    );
  }
  
  const isActing = travelMutation.isPending || activityMutation.isPending;
  
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-20 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
          isNight ? "bg-indigo-500/5" : "bg-cyan-500/10"
        }`} />
        <div className={`absolute bottom-40 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse ${
          isNight ? "bg-purple-500/5" : "bg-purple-500/10"
        }`} style={{ animationDelay: "1s" }} />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/chronicles">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" data-testid="button-back">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" data-testid="button-home">
                <Home className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {character.name}'s Life
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                {isNight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                <span>Modern Era • {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm text-gray-400">Level {character.level}</div>
              <div className="text-xs text-gray-500">{character.experience} XP</div>
            </div>
            <Button
              onClick={() => checkInMutation.mutate()}
              disabled={checkInMutation.isPending}
              className="bg-gradient-to-r from-yellow-500 to-orange-500"
              data-testid="button-daily-checkin"
            >
              <Star className="w-4 h-4 mr-1" />
              Check In
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <NeedBar label="Energy" value={character.energy} icon={Zap} color="text-yellow-400" />
          <NeedBar label="Mood" value={character.mood} icon={Smile} color="text-green-400" />
          <NeedBar label="Health" value={character.health} icon={Heart} color="text-red-400" />
          <NeedBar label="Social" value={character.social} icon={Users} color="text-blue-400" />
          <NeedBar label="Hunger" value={character.hunger} icon={Apple} color="text-orange-400" warning={70} />
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" />
              Locations
            </h2>
            <div className="space-y-3" data-testid="locations-list">
              {loadingLocations ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : locations.map((loc) => (
                <LocationCard
                  key={loc.code}
                  location={loc}
                  isCurrentLocation={character.currentLocation === loc.code}
                  onTravel={() => travelMutation.mutate(loc.code)}
                  disabled={isActing}
                />
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              Activities at {locations.find(l => l.code === character.currentLocation)?.name || "Home"}
            </h2>
            <div className="space-y-3" data-testid="activities-list">
              <AnimatePresence mode="wait">
                {loadingActivities ? (
                  <div className="flex justify-center py-8">
                    <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : activities.length > 0 ? (
                  activities.map((act) => (
                    <ActivityCard
                      key={act.code}
                      activity={act}
                      onPerform={() => activityMutation.mutate(act.code)}
                      disabled={isActing}
                      energyLow={character.energy < (act.minEnergy || 0)}
                      moodLow={character.mood < (act.minMood || 0)}
                    />
                  ))
                ) : (
                  <GlassCard className="p-6 text-center">
                    <p className="text-gray-400">No activities available here right now</p>
)}
              </AnimatePresence>
            </div>
          </div>
        </div>
        
        {character.checkInStreak > 0 && (
          <div className="mt-6">
            <GlassCard className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-yellow-500/20">
                    <Star className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">{character.checkInStreak} Day Streak!</div>
                    <div className="text-xs text-gray-400">Keep checking in for bonus rewards</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-yellow-400 font-bold">
                    {character.checkInStreak >= 100 ? "3.0x" :
                     character.checkInStreak >= 60 ? "2.5x" :
                     character.checkInStreak >= 30 ? "2.0x" :
                     character.checkInStreak >= 14 ? "1.75x" :
                     character.checkInStreak >= 7 ? "1.5x" :
                     character.checkInStreak >= 3 ? "1.25x" : "1.0x"} Bonus
                  </div>
                  <div className="text-xs text-gray-500">Current multiplier</div>
                </div>
              </div>
</div>
        )}
      </div>
    </div>
</h1>
  );
}
