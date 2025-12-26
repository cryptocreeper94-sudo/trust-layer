import { motion } from "framer-motion";
import { 
  Clock, Users, Sparkles, Coins, Star, Globe,
  Target, Scroll, Map, Compass, Eye, Lock, 
  ChevronRight, Activity, BarChart3, Swords, Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChronoLayout, HoloCard, chronoStyles } from "@/components/chrono-ui";
import { usePageAnalytics } from "@/hooks/use-analytics";

import medievalKingdom from "@assets/generated_images/medieval_fantasy_kingdom.png";
import quantumRealm from "@assets/generated_images/quantum_dimension_realm.png";

const MOCK_STATS = {
  era: "Age of Crowns",
  eraYear: "1247 CE",
  daysLived: 127,
  reputation: 72,
  wealth: "3,450 DWC",
  activeQuests: 4,
  completedQuests: 23,
  secretsFound: 7,
  realmsVisited: 3,
  relationships: 18,
};

const ACTIVE_QUESTS = [
  { 
    id: 1, 
    title: "The Dragon's Cipher", 
    type: "Legend", 
    progress: 65, 
    era: "Medieval",
    difficulty: "Epic",
    reward: "500 DWC"
  },
  { 
    id: 2, 
    title: "Merchant Guild Conspiracy", 
    type: "Political", 
    progress: 30, 
    era: "Medieval",
    difficulty: "Hard",
    reward: "200 DWC"
  },
  { 
    id: 3, 
    title: "Echoes of Rome", 
    type: "Time Rift", 
    progress: 10, 
    era: "Cross-Era",
    difficulty: "Legendary",
    reward: "1,000 DWC"
  },
  { 
    id: 4, 
    title: "The Alchemist's Secret", 
    type: "Mystery", 
    progress: 85, 
    era: "Medieval",
    difficulty: "Medium",
    reward: "150 DWC"
  },
];

const RECENT_ACTIVITY = [
  { action: "Discovered hidden passage in castle ruins", time: "2h ago", icon: Eye },
  { action: "Completed trade deal with Eastern Merchants", time: "5h ago", icon: Coins },
  { action: "Defended village from bandit raid", time: "8h ago", icon: Swords },
  { action: "Found fragment of the Dragon's Cipher", time: "1d ago", icon: Scroll },
  { action: "Formed alliance with House Valdren", time: "2d ago", icon: Crown },
];

export default function ChronoDashboard() {
  usePageAnalytics();
  
  return (
    <ChronoLayout currentPage="/dashboard">
      <section className="relative py-12 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src={medievalKingdom} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
        </div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                <Activity className="w-3 h-3 mr-1" /> Dashboard Preview
              </Badge>
              <Badge variant="outline" className="border-amber-500/30 text-amber-400 animate-pulse">
                Coming 2026
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
              Your Chronicle
            </h1>
            <p className="text-white/60">
              Track your journey across eras, monitor quests, and manage your legacy.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-white/50">Current Era</span>
                </div>
                <p className="text-lg font-bold text-white">{MOCK_STATS.era}</p>
                <p className="text-xs text-purple-400">{MOCK_STATS.eraYear}</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-white/50">Days Lived</span>
                </div>
                <p className="text-lg font-bold text-white">{MOCK_STATS.daysLived}</p>
                <p className="text-xs text-cyan-400">In current era</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-white/50">Wealth</span>
                </div>
                <p className="text-lg font-bold text-white">{MOCK_STATS.wealth}</p>
                <p className="text-xs text-amber-400">DarkWave Coin</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <div className="p-4 rounded-xl bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-pink-400" />
                  <span className="text-xs text-white/50">Reputation</span>
                </div>
                <p className="text-lg font-bold text-white">{MOCK_STATS.reputation}%</p>
                <Progress value={MOCK_STATS.reputation} className="h-1 mt-1" />
              </div>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-pink-400" />
                    <h2 className="text-xl font-bold text-white">Active Quests</h2>
                  </div>
                  <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30">
                    {MOCK_STATS.activeQuests} Active
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  {ACTIVE_QUESTS.map((quest) => (
                    <div 
                      key={quest.id}
                      className="p-4 rounded-xl bg-gradient-to-r from-white/5 to-transparent border border-white/10 hover:border-pink-500/30 transition-all cursor-pointer group"
                      data-testid={`quest-${quest.id}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-white group-hover:text-pink-300 transition-colors">{quest.title}</h3>
                            <Badge variant="outline" className="text-[10px] border-white/20 text-white/60">
                              {quest.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-white/50">
                            <span>{quest.era}</span>
                            <span className={`${quest.difficulty === 'Legendary' ? 'text-amber-400' : quest.difficulty === 'Epic' ? 'text-purple-400' : 'text-white/50'}`}>
                              {quest.difficulty}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-amber-400">{quest.reward}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={quest.progress} className="flex-1 h-2" />
                        <span className="text-xs text-white/60 w-10 text-right">{quest.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Button variant="outline" className="rounded-full gap-2 border-white/20 hover:bg-white/10" data-testid="view-all-quests">
                    View All Quests
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="space-y-6"
            >
              <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-lg font-bold text-white">Journey Stats</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Scroll className="w-4 h-4 text-amber-400" />
                      <span className="text-sm text-white/70">Quests Completed</span>
                    </div>
                    <span className="font-semibold text-white">{MOCK_STATS.completedQuests}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-white/70">Secrets Found</span>
                    </div>
                    <span className="font-semibold text-white">{MOCK_STATS.secretsFound}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-white/70">Realms Visited</span>
                    </div>
                    <span className="font-semibold text-white">{MOCK_STATS.realmsVisited}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-pink-400" />
                      <span className="text-sm text-white/70">Relationships</span>
                    </div>
                    <span className="font-semibold text-white">{MOCK_STATS.relationships}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-green-400" />
                  <h2 className="text-lg font-bold text-white">Recent Activity</h2>
                </div>
                
                <div className="space-y-3">
                  {RECENT_ACTIVITY.slice(0, 4).map((activity, i) => {
                    const Icon = activity.icon;
                    return (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-white/60" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white/80 truncate">{activity.action}</p>
                          <p className="text-xs text-white/40">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <HoloCard image={quantumRealm} glow="purple" className="min-h-[200px]">
              <div className="p-8 h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 shadow-xl">
                  <Map className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">World View</h3>
                <p className="text-white/60 mb-4 max-w-md">
                  Interactive map of your current era. See territories, track NPCs, and plan your next move.
                </p>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 animate-pulse">
                  <Sparkles className="w-3 h-3 mr-1" /> Coming Soon
                </Badge>
              </div>
            </HoloCard>
          </motion.div>
        </div>
      </section>
      
      <style>{chronoStyles}</style>
    </ChronoLayout>
  );
}
