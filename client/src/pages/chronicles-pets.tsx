import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { getChroniclesSession } from "./chronicles-login";
import {
  ArrowLeft, Heart, Zap, Shield, Star, Sparkles, Loader2,
  PawPrint, Activity, ChevronRight, Crown, Utensils, Dumbbell,
  Gamepad2, Moon, Plus, X, Check, AlertTriangle, Trophy
} from "lucide-react";

const ERA_CONFIG: Record<string, { name: string; emoji: string; color: string; borderColor: string; bgGrad: string }> = {
  medieval: { name: "Medieval", emoji: "🏰", color: "text-amber-400", borderColor: "border-amber-500/30", bgGrad: "from-amber-500/20 to-orange-600/20" },
  wildwest: { name: "Wild West", emoji: "🤠", color: "text-yellow-400", borderColor: "border-yellow-500/30", bgGrad: "from-yellow-500/20 to-orange-600/20" },
  modern: { name: "Modern", emoji: "🏙️", color: "text-cyan-400", borderColor: "border-cyan-500/30", bgGrad: "from-cyan-500/20 to-blue-600/20" },
};

const STAGE_CONFIG: Record<string, { label: string; color: string; emoji: string }> = {
  young: { label: "Young", color: "bg-green-500/20 text-green-400", emoji: "🌱" },
  adolescent: { label: "Adolescent", color: "bg-blue-500/20 text-blue-400", emoji: "🌿" },
  adult: { label: "Adult", color: "bg-purple-500/20 text-purple-400", emoji: "🌳" },
  legendary: { label: "Legendary", color: "bg-yellow-500/20 text-yellow-400", emoji: "✨" },
};

const RARITY_CONFIG: Record<string, { color: string; glow: string }> = {
  common: { color: "text-gray-400", glow: "" },
  uncommon: { color: "text-green-400", glow: "shadow-green-500/20" },
  rare: { color: "text-blue-400", glow: "shadow-blue-500/30" },
  legendary: { color: "text-yellow-400", glow: "shadow-yellow-500/30" },
};

const authFetch = async (url: string, opts: RequestInit = {}) => {
  const session = getChroniclesSession();
  const headers: any = { "Content-Type": "application/json", ...(opts.headers || {}) };
  if (session?.token) headers.Authorization = `Bearer ${session.token}`;
  return fetch(url, { ...opts, headers });
};

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

function PetCard({ pet, onInteract, onSetCompanion, isInteracting }: {
  pet: any;
  onInteract: (petId: string, action: string) => void;
  onSetCompanion: (petId: string) => void;
  isInteracting: boolean;
}) {
  const stage = STAGE_CONFIG[pet.stage] || STAGE_CONFIG.young;
  const appearance = typeof pet.appearance === "string" ? JSON.parse(pet.appearance) : pet.appearance || {};
  const rarity = RARITY_CONFIG[appearance.rarity] || RARITY_CONFIG.common;
  const traits = typeof pet.traits === "string" ? JSON.parse(pet.traits) : pet.traits || [];

  const needsFood = pet.lastFed ? (Date.now() - new Date(pet.lastFed).getTime()) > 3600000 : true;
  const needsPlay = pet.happiness < 40;

  return (
    <motion.div variants={fadeUp}>
      <GlassCard glow={pet.isCompanion} className={`p-4 relative overflow-hidden ${pet.isCompanion ? "border-cyan-500/30" : "border-white/5"}`}>
        {pet.isCompanion && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 text-[9px]" data-testid={`badge-companion-${pet.id}`}>
              <Crown className="w-2.5 h-2.5 mr-0.5" /> Companion
            </Badge>
          </div>
        )}

        {pet.stage === "legendary" && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-transparent to-yellow-500/5"
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}

        <div className="flex items-start gap-3 mb-3 relative z-10">
          <motion.div
            className="text-4xl"
            animate={pet.happiness > 70 ? { y: [0, -3, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {pet.emoji}
          </motion.div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-base truncate" data-testid={`pet-name-${pet.id}`}>{pet.name}</h3>
            <p className="text-gray-500 text-xs">{pet.breed} &middot; {pet.species}</p>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <Badge className={`${stage.color} text-[9px]`}>{stage.emoji} {stage.label}</Badge>
              <Badge className={`${rarity.color} bg-white/5 text-[9px]`}>{appearance.rarity || "common"}</Badge>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between text-[10px] mb-0.5">
                <span className="text-gray-500">Bond</span>
                <span className="text-pink-400">{pet.bondLevel}/{pet.maxBond}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(pet.bondLevel / pet.maxBond) * 100}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between text-[10px] mb-0.5">
                <span className="text-gray-500">Happiness</span>
                <span className={pet.happiness < 30 ? "text-red-400" : "text-yellow-400"}>{pet.happiness}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${pet.happiness < 30 ? "bg-red-500" : "bg-gradient-to-r from-yellow-500 to-amber-400"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pet.happiness}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between text-[10px] mb-0.5">
                <span className="text-gray-500">Energy</span>
                <span className={pet.energy < 20 ? "text-red-400" : "text-blue-400"}>{pet.energy}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${pet.energy < 20 ? "bg-red-500" : "bg-gradient-to-r from-blue-500 to-cyan-400"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pet.energy}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between text-[10px] mb-0.5">
                <span className="text-gray-500">Health</span>
                <span className="text-green-400">{pet.health}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${pet.health}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </div>
        </div>

        {traits.length > 0 && (
          <div className="flex gap-1 mb-3 flex-wrap">
            {traits.map((t: string) => (
              <span key={t} className="text-[9px] bg-white/5 text-gray-400 px-1.5 py-0.5 rounded">{t}</span>
            ))}
          </div>
        )}

        {(needsFood || needsPlay) && (
          <div className="flex items-center gap-1 mb-3">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span className="text-[10px] text-amber-400">
              {needsFood && needsPlay ? "Hungry & unhappy" : needsFood ? "Ready to eat" : "Needs attention"}
            </span>
          </div>
        )}

        <div className="grid grid-cols-4 gap-1.5">
          <Button
            size="sm"
            variant="ghost"
            className="flex flex-col items-center gap-0.5 h-auto py-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 min-h-[48px] active:scale-95"
            onClick={() => onInteract(pet.id, "feed")}
            disabled={isInteracting}
            data-testid={`btn-feed-${pet.id}`}
          >
            <Utensils className="w-4 h-4" />
            <span className="text-[9px]">Feed</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="flex flex-col items-center gap-0.5 h-auto py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 min-h-[48px] active:scale-95"
            onClick={() => onInteract(pet.id, "train")}
            disabled={isInteracting}
            data-testid={`btn-train-${pet.id}`}
          >
            <Dumbbell className="w-4 h-4" />
            <span className="text-[9px]">Train</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="flex flex-col items-center gap-0.5 h-auto py-2 text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 min-h-[48px] active:scale-95"
            onClick={() => onInteract(pet.id, "play")}
            disabled={isInteracting}
            data-testid={`btn-play-${pet.id}`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span className="text-[9px]">Play</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="flex flex-col items-center gap-0.5 h-auto py-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 min-h-[48px] active:scale-95"
            onClick={() => onInteract(pet.id, "rest")}
            disabled={isInteracting}
            data-testid={`btn-rest-${pet.id}`}
          >
            <Moon className="w-4 h-4" />
            <span className="text-[9px]">Rest</span>
          </Button>
        </div>

        {!pet.isCompanion && (
          <Button
            size="sm"
            variant="outline"
            className="w-full mt-2 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/10 min-h-[44px] active:scale-95"
            onClick={() => onSetCompanion(pet.id)}
            data-testid={`btn-set-companion-${pet.id}`}
          >
            <Crown className="w-3.5 h-3.5 mr-1" /> Set as Companion
          </Button>
        )}
      </GlassCard>
    </motion.div>
  );
}

function AdoptionModal({ era, onClose, onAdopt }: { era: string; onClose: () => void; onAdopt: (index: number, name: string) => void }) {
  const [petName, setPetName] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["/api/chronicles/pets/available", era],
    queryFn: async () => {
      const res = await authFetch(`/api/chronicles/pets/available?era=${era}`);
      if (!res.ok) return { pets: [] };
      return res.json();
    },
  });

  const available = data?.pets || [];
  const abilities = data?.abilityDescriptions || {};

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="bg-slate-900 border border-white/10 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[85vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-lg">Adopt a Companion</h3>
            <p className="text-gray-500 text-xs">{ERA_CONFIG[era]?.emoji} {ERA_CONFIG[era]?.name} Era</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="min-h-[44px] min-w-[44px]" data-testid="btn-close-adopt">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[60vh] p-4 space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
            </div>
          ) : (
            available.map((pet: any, i: number) => {
              const isSelected = selectedIndex === i;
              const abilityInfo = abilities[pet.ability];
              const rarity = RARITY_CONFIG[pet.rarity] || RARITY_CONFIG.common;
              return (
                <motion.button
                  key={`${pet.breed}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedIndex(i)}
                  className={`w-full text-left p-3 rounded-xl border transition-all active:scale-[0.98] min-h-[64px] ${
                    isSelected
                      ? "border-cyan-500/40 bg-cyan-500/10"
                      : "border-white/5 bg-white/3 hover:border-white/10"
                  }`}
                  data-testid={`adopt-option-${i}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{pet.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-white font-medium text-sm">{pet.breed}</span>
                        <Badge className={`${rarity.color} bg-white/5 text-[8px]`}>{pet.rarity}</Badge>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-snug">{pet.description}</p>
                      {abilityInfo && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-[10px]">{abilityInfo.icon}</span>
                          <span className="text-[10px] text-cyan-400">{abilityInfo.name}</span>
                          {pet.secondaryAbility && abilities[pet.secondaryAbility] && (
                            <>
                              <span className="text-[10px] text-gray-600">+</span>
                              <span className="text-[10px]">{abilities[pet.secondaryAbility].icon}</span>
                              <span className="text-[10px] text-gray-400">{abilities[pet.secondaryAbility].name}</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-1" />}
                  </div>
                </motion.button>
              );
            })
          )}
        </div>

        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border-t border-white/5"
          >
            <Input
              placeholder="Name your new companion..."
              value={petName}
              onChange={e => setPetName(e.target.value)}
              maxLength={30}
              className="bg-white/5 border-white/10 text-white mb-3 min-h-[44px]"
              data-testid="input-pet-name"
            />
            <Button
              className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 min-h-[48px] active:scale-95"
              disabled={!petName.trim()}
              onClick={() => {
                if (petName.trim() && selectedIndex !== null) {
                  onAdopt(selectedIndex, petName.trim());
                }
              }}
              data-testid="btn-confirm-adopt"
            >
              <PawPrint className="w-4 h-4 mr-2" /> Adopt {available[selectedIndex]?.breed}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function ChroniclesPetsPage() {
  const [selectedEra, setSelectedEra] = useState("modern");
  const [showAdopt, setShowAdopt] = useState(false);
  const [interactionMessage, setInteractionMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["/api/chronicles/pets", selectedEra],
    queryFn: async () => {
      const res = await authFetch(`/api/chronicles/pets?era=${selectedEra}`);
      if (!res.ok) return { pets: [], totalPets: 0 };
      return res.json();
    },
    staleTime: 15000,
  });

  const interactMutation = useMutation({
    mutationFn: async ({ petId, action }: { petId: string; action: string }) => {
      const res = await authFetch(`/api/chronicles/pets/${petId}/interact`, {
        method: "POST",
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: (data) => {
      if (data.message) setInteractionMessage(data.message);
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/pets"] });
      setTimeout(() => setInteractionMessage(null), 4000);
    },
  });

  const companionMutation = useMutation({
    mutationFn: async (petId: string) => {
      const res = await authFetch(`/api/chronicles/pets/${petId}/companion`, { method: "POST" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: (data) => {
      if (data.message) setInteractionMessage(data.message);
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/pets"] });
      setTimeout(() => setInteractionMessage(null), 4000);
    },
  });

  const adoptMutation = useMutation({
    mutationFn: async ({ index, name }: { index: number; name: string }) => {
      const res = await authFetch("/api/chronicles/pets/adopt", {
        method: "POST",
        body: JSON.stringify({ era: selectedEra, petIndex: index, name }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed" }));
        throw new Error(err.error || "Failed to adopt");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setShowAdopt(false);
      if (data.message) setInteractionMessage(data.message);
      queryClient.invalidateQueries({ queryKey: ["/api/chronicles/pets"] });
      setTimeout(() => setInteractionMessage(null), 5000);
    },
    onError: (err: Error) => {
      setInteractionMessage(err.message);
      setTimeout(() => setInteractionMessage(null), 4000);
    },
  });

  const pets = data?.pets || [];

  return (
    <div className="min-h-screen bg-slate-950 pb-20" data-testid="pets-page">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/chronicles/play">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white min-h-[44px] min-w-[44px]" data-testid="back-to-play">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Your Companions
            </h1>
            <p className="text-[10px] text-gray-500">Bond with pets, train abilities, and adventure together</p>
          </div>
          <Button
            size="icon"
            className="bg-gradient-to-r from-cyan-600 to-purple-600 min-h-[44px] min-w-[44px] active:scale-95"
            onClick={() => setShowAdopt(true)}
            data-testid="btn-adopt-new"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
          {(Object.keys(ERA_CONFIG) as string[]).map((era, idx) => {
            const c = ERA_CONFIG[era];
            const isSelected = selectedEra === era;
            return (
              <motion.button
                key={era}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.08 }}
                onClick={() => setSelectedEra(era)}
                className={`flex-shrink-0 px-5 py-3 rounded-xl text-sm font-medium transition-all min-h-[48px] relative overflow-hidden active:scale-95 ${
                  isSelected
                    ? `bg-gradient-to-r ${c.bgGrad} ${c.color} border ${c.borderColor} shadow-lg`
                    : "bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent"
                }`}
                data-testid={`era-tab-${era}`}
              >
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  />
                )}
                <span className="relative z-10">{c.emoji} {c.name}</span>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {interactionMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="mb-4"
            >
              <GlassCard className="p-3 border border-cyan-500/20 bg-cyan-500/5">
                <div className="flex items-center gap-2">
                  <PawPrint className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <p className="text-sm text-cyan-300">{interactionMessage}</p>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        ) : pets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard className="p-8 text-center border border-white/5">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                🐾
              </motion.div>
              <h3 className="text-white font-bold text-lg mb-2">No Companions Yet</h3>
              <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                Every great adventurer needs a loyal companion by their side. Adopt your first pet and begin your bond!
              </p>
              <Button
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 min-h-[48px] active:scale-95"
                onClick={() => setShowAdopt(true)}
                data-testid="btn-adopt-first"
              >
                <PawPrint className="w-4 h-4 mr-2" /> Adopt Your First Companion
              </Button>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {pets.map((pet: any) => (
              <PetCard
                key={pet.id}
                pet={pet}
                onInteract={(petId, action) => interactMutation.mutate({ petId, action })}
                onSetCompanion={(petId) => companionMutation.mutate(petId)}
                isInteracting={interactMutation.isPending}
              />
            ))}

            {pets.length < 5 && (
              <motion.div variants={fadeUp}>
                <button
                  onClick={() => setShowAdopt(true)}
                  className="w-full h-full min-h-[200px] rounded-xl border-2 border-dashed border-white/10 hover:border-cyan-500/30 transition-all flex flex-col items-center justify-center gap-2 active:scale-95"
                  data-testid="btn-adopt-more"
                >
                  <Plus className="w-8 h-8 text-gray-600" />
                  <span className="text-sm text-gray-500">Adopt Another</span>
                  <span className="text-[10px] text-gray-600">{pets.length}/5 slots used</span>
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showAdopt && (
          <AdoptionModal
            era={selectedEra}
            onClose={() => setShowAdopt(false)}
            onAdopt={(index, name) => adoptMutation.mutate({ index, name })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}