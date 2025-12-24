import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Users, Gift, Coins, Plus, Trash2, Edit2, Check, X, Crown, Star, Sparkles, Award } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlassCard } from "@/components/glass-card";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

interface BetaTesterTier {
  id: string;
  name: string;
  description: string | null;
  allocation: string;
  multiplier: string;
  maxMembers: number | null;
  benefits: string | null;
  createdAt: string;
}

interface BetaTester {
  id: string;
  userId: string | null;
  email: string | null;
  walletAddress: string | null;
  tierId: string | null;
  status: string;
  contributionScore: number;
  contributionNotes: string | null;
  referralCode: string | null;
  addedBy: string | null;
  createdAt: string;
}

interface TokenGift {
  id: string;
  recipientEmail: string | null;
  recipientWallet: string | null;
  recipientName: string | null;
  amount: string;
  reason: string | null;
  category: string;
  status: string;
  grantedBy: string | null;
  createdAt: string;
}

interface AirdropAllocation {
  id: string;
  name: string;
  category: string;
  totalAmount: string;
  claimedAmount: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminRewards() {
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("testers");
  const [showTierDialog, setShowTierDialog] = useState(false);
  const [showTesterDialog, setShowTesterDialog] = useState(false);
  const [showGiftDialog, setShowGiftDialog] = useState(false);
  const [showAirdropDialog, setShowAirdropDialog] = useState(false);

  const { data: tiersData } = useQuery<{ tiers: BetaTesterTier[] }>({
    queryKey: ["/api/admin/beta-testers/tiers"],
  });

  const { data: testersData } = useQuery<{ testers: BetaTester[] }>({
    queryKey: ["/api/admin/beta-testers"],
  });

  const { data: giftsData } = useQuery<{ gifts: TokenGift[] }>({
    queryKey: ["/api/admin/gifts"],
  });

  const { data: airdropsData } = useQuery<{ allocations: AirdropAllocation[] }>({
    queryKey: ["/api/admin/airdrops"],
  });

  const tiers = tiersData?.tiers || [];
  const testers = testersData?.testers || [];
  const gifts = giftsData?.gifts || [];
  const airdrops = airdropsData?.allocations || [];

  const totalAllocated = gifts.reduce((sum, g) => sum + parseFloat(g.amount || "0"), 0);
  const pendingGifts = gifts.filter(g => g.status === "pending").length;
  const approvedTesters = testers.filter(t => t.status === "approved").length;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <GlassCard className="p-8 text-center">
          <h2 className="text-xl font-bold mb-4">Admin Access Required</h2>
          <p className="text-muted-foreground mb-4">Please sign in to access this page.</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-purple-500/50 text-purple-400 bg-purple-500/10">
              <Crown className="w-3 h-3 mr-1" /> Admin
            </Badge>
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 hover:bg-white/5 px-2" data-testid="button-back">
                <ArrowLeft className="w-3 h-3" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">
              Early Adopter <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Rewards</span>
            </h1>
            <p className="text-muted-foreground">Manage beta testers, airdrops, and token gifts</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <GlassCard hover={false}>
              <div className="p-4 text-center">
                <Users className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                <div className="text-2xl font-bold">{testers.length}</div>
                <div className="text-xs text-muted-foreground">Beta Testers</div>
              </div>
            </GlassCard>
            <GlassCard hover={false}>
              <div className="p-4 text-center">
                <Check className="w-6 h-6 mx-auto mb-2 text-green-400" />
                <div className="text-2xl font-bold">{approvedTesters}</div>
                <div className="text-xs text-muted-foreground">Approved</div>
              </div>
            </GlassCard>
            <GlassCard hover={false}>
              <div className="p-4 text-center">
                <Gift className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                <div className="text-2xl font-bold">{pendingGifts}</div>
                <div className="text-xs text-muted-foreground">Pending Gifts</div>
              </div>
            </GlassCard>
            <GlassCard hover={false}>
              <div className="p-4 text-center">
                <Coins className="w-6 h-6 mx-auto mb-2 text-amber-400" />
                <div className="text-2xl font-bold">{totalAllocated.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">DWC Allocated</div>
              </div>
            </GlassCard>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white/5 border border-white/10" data-testid="tabs-rewards">
              <TabsTrigger value="testers" className="data-[state=active]:bg-white/10" data-testid="tab-testers">
                <Users className="w-4 h-4 mr-2" /> Beta Testers
              </TabsTrigger>
              <TabsTrigger value="tiers" className="data-[state=active]:bg-white/10" data-testid="tab-tiers">
                <Star className="w-4 h-4 mr-2" /> Tiers
              </TabsTrigger>
              <TabsTrigger value="gifts" className="data-[state=active]:bg-white/10" data-testid="tab-gifts">
                <Gift className="w-4 h-4 mr-2" /> Token Gifts
              </TabsTrigger>
              <TabsTrigger value="airdrops" className="data-[state=active]:bg-white/10" data-testid="tab-airdrops">
                <Sparkles className="w-4 h-4 mr-2" /> Airdrops
              </TabsTrigger>
            </TabsList>

            <TabsContent value="testers">
              <BetaTestersTab 
                testers={testers} 
                tiers={tiers} 
                queryClient={queryClient}
                showDialog={showTesterDialog}
                setShowDialog={setShowTesterDialog}
              />
            </TabsContent>

            <TabsContent value="tiers">
              <TiersTab 
                tiers={tiers} 
                queryClient={queryClient}
                showDialog={showTierDialog}
                setShowDialog={setShowTierDialog}
              />
            </TabsContent>

            <TabsContent value="gifts">
              <GiftsTab 
                gifts={gifts} 
                queryClient={queryClient}
                showDialog={showGiftDialog}
                setShowDialog={setShowGiftDialog}
              />
            </TabsContent>

            <TabsContent value="airdrops">
              <AirdropsTab 
                airdrops={airdrops} 
                queryClient={queryClient}
                showDialog={showAirdropDialog}
                setShowDialog={setShowAirdropDialog}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

function BetaTestersTab({ testers, tiers, queryClient, showDialog, setShowDialog }: any) {
  const [formData, setFormData] = useState({
    email: "",
    walletAddress: "",
    tierId: "",
    status: "pending",
    contributionScore: 0,
    contributionNotes: "",
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/beta-testers", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/beta-testers"] });
      setShowDialog(false);
      setFormData({ email: "", walletAddress: "", tierId: "", status: "pending", contributionScore: 0, contributionNotes: "" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => apiRequest("PUT", `/api/admin/beta-testers/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/beta-testers"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/beta-testers/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/beta-testers"] }),
  });

  const getTierName = (tierId: string | null) => {
    if (!tierId) return "No Tier";
    const tier = tiers.find((t: BetaTesterTier) => t.id === tierId);
    return tier?.name || "Unknown";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Beta Testers List</h2>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2" data-testid="button-add-tester">
              <Plus className="w-4 h-4" /> Add Tester
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-background border-white/10">
            <DialogHeader>
              <DialogTitle>Add Beta Tester</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                data-testid="input-tester-email"
              />
              <Input
                placeholder="Wallet Address (optional)"
                value={formData.walletAddress}
                onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                data-testid="input-tester-wallet"
              />
              <Select value={formData.tierId} onValueChange={(v) => setFormData({ ...formData, tierId: v })}>
                <SelectTrigger data-testid="select-tester-tier">
                  <SelectValue placeholder="Select Tier" />
                </SelectTrigger>
                <SelectContent>
                  {tiers.map((tier: BetaTesterTier) => (
                    <SelectItem key={tier.id} value={tier.id}>{tier.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger data-testid="select-tester-status">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Contribution Score"
                value={formData.contributionScore}
                onChange={(e) => setFormData({ ...formData, contributionScore: parseInt(e.target.value) || 0 })}
                data-testid="input-tester-score"
              />
              <Textarea
                placeholder="Contribution Notes"
                value={formData.contributionNotes}
                onChange={(e) => setFormData({ ...formData, contributionNotes: e.target.value })}
                data-testid="input-tester-notes"
              />
              <Button 
                onClick={() => createMutation.mutate(formData)} 
                className="w-full"
                disabled={createMutation.isPending}
                data-testid="button-save-tester"
              >
                {createMutation.isPending ? "Adding..." : "Add Tester"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {testers.map((tester: BetaTester) => (
            <motion.div
              key={tester.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <GlassCard className="p-4" data-testid={`card-tester-${tester.id}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium">{tester.email || tester.walletAddress?.slice(0, 10) + "..." || "No contact"}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <Badge variant="outline" className={
                          tester.status === "approved" ? "border-green-500/50 text-green-400" :
                          tester.status === "rejected" ? "border-red-500/50 text-red-400" :
                          "border-amber-500/50 text-amber-400"
                        }>
                          {tester.status}
                        </Badge>
                        <span>{getTierName(tester.tierId)}</span>
                        <span>Score: {tester.contributionScore}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {tester.status === "pending" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-green-400 hover:text-green-300"
                        onClick={() => updateMutation.mutate({ id: tester.id, data: { status: "approved", approvedAt: new Date() } })}
                        data-testid={`button-approve-${tester.id}`}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:text-red-300"
                      onClick={() => deleteMutation.mutate(tester.id)}
                      data-testid={`button-delete-tester-${tester.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
        {testers.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No beta testers yet. Add your first tester above.
          </div>
        )}
      </div>
    </div>
  );
}

function TiersTab({ tiers, queryClient, showDialog, setShowDialog }: any) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    allocation: "1000",
    multiplier: "1",
    maxMembers: "",
    benefits: "",
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/beta-testers/tiers", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/beta-testers/tiers"] });
      setShowDialog(false);
      setFormData({ name: "", description: "", allocation: "1000", multiplier: "1", maxMembers: "", benefits: "" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/beta-testers/tiers/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/beta-testers/tiers"] }),
  });

  const tierIcons: Record<string, any> = {
    "Founder": Crown,
    "Genesis": Star,
    "Early Adopter": Sparkles,
    "Contributor": Award,
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Beta Tester Tiers</h2>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2" data-testid="button-add-tier">
              <Plus className="w-4 h-4" /> Add Tier
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-background border-white/10">
            <DialogHeader>
              <DialogTitle>Create Tier</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Tier Name (e.g., Genesis, Founder)"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                data-testid="input-tier-name"
              />
              <Textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                data-testid="input-tier-description"
              />
              <Input
                placeholder="Token Allocation (DWC per member)"
                value={formData.allocation}
                onChange={(e) => setFormData({ ...formData, allocation: e.target.value })}
                data-testid="input-tier-allocation"
              />
              <Input
                placeholder="Reward Multiplier (e.g., 1.5)"
                value={formData.multiplier}
                onChange={(e) => setFormData({ ...formData, multiplier: e.target.value })}
                data-testid="input-tier-multiplier"
              />
              <Input
                type="number"
                placeholder="Max Members (leave empty for unlimited)"
                value={formData.maxMembers}
                onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value })}
                data-testid="input-tier-max"
              />
              <Textarea
                placeholder="Benefits (comma separated)"
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                data-testid="input-tier-benefits"
              />
              <Button 
                onClick={() => createMutation.mutate({
                  ...formData,
                  maxMembers: formData.maxMembers ? parseInt(formData.maxMembers) : null,
                })} 
                className="w-full"
                disabled={createMutation.isPending}
                data-testid="button-save-tier"
              >
                {createMutation.isPending ? "Creating..." : "Create Tier"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {tiers.map((tier: BetaTesterTier) => {
          const Icon = tierIcons[tier.name] || Star;
          return (
            <GlassCard key={tier.id} className="p-5" data-testid={`card-tier-${tier.id}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{tier.name}</h3>
                    <p className="text-sm text-muted-foreground">{tier.description || "No description"}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-400 hover:text-red-300"
                  onClick={() => deleteMutation.mutate(tier.id)}
                  data-testid={`button-delete-tier-${tier.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white/5 rounded-lg p-2">
                  <div className="text-lg font-bold text-amber-400">{parseInt(tier.allocation).toLocaleString()}</div>
                  <div className="text-[10px] text-muted-foreground">DWC/Member</div>
                </div>
                <div className="bg-white/5 rounded-lg p-2">
                  <div className="text-lg font-bold text-purple-400">{tier.multiplier}x</div>
                  <div className="text-[10px] text-muted-foreground">Multiplier</div>
                </div>
                <div className="bg-white/5 rounded-lg p-2">
                  <div className="text-lg font-bold text-blue-400">{tier.maxMembers || "∞"}</div>
                  <div className="text-[10px] text-muted-foreground">Max Slots</div>
                </div>
              </div>
            </GlassCard>
          );
        })}
        {tiers.length === 0 && (
          <div className="col-span-2 text-center py-12 text-muted-foreground">
            No tiers created yet. Create your first tier to categorize beta testers.
          </div>
        )}
      </div>
    </div>
  );
}

function GiftsTab({ gifts, queryClient, showDialog, setShowDialog }: any) {
  const [formData, setFormData] = useState({
    recipientEmail: "",
    recipientName: "",
    recipientWallet: "",
    amount: "1000",
    reason: "",
    category: "gift",
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/gifts", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/gifts"] });
      setShowDialog(false);
      setFormData({ recipientEmail: "", recipientName: "", recipientWallet: "", amount: "1000", reason: "", category: "gift" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/gifts/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/gifts"] }),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Token Gifts</h2>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2" data-testid="button-add-gift">
              <Plus className="w-4 h-4" /> Add Gift
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-background border-white/10">
            <DialogHeader>
              <DialogTitle>Gift Tokens</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Recipient Name"
                value={formData.recipientName}
                onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                data-testid="input-gift-name"
              />
              <Input
                placeholder="Recipient Email"
                value={formData.recipientEmail}
                onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                data-testid="input-gift-email"
              />
              <Input
                placeholder="Wallet Address (optional)"
                value={formData.recipientWallet}
                onChange={(e) => setFormData({ ...formData, recipientWallet: e.target.value })}
                data-testid="input-gift-wallet"
              />
              <Input
                type="number"
                placeholder="Amount (DWC)"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                data-testid="input-gift-amount"
              />
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger data-testid="select-gift-category">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gift">Personal Gift</SelectItem>
                  <SelectItem value="bonus">Performance Bonus</SelectItem>
                  <SelectItem value="contribution">Contribution Reward</SelectItem>
                  <SelectItem value="referral">Referral Bonus</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Reason for gift"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                data-testid="input-gift-reason"
              />
              <Button 
                onClick={() => createMutation.mutate(formData)} 
                className="w-full"
                disabled={createMutation.isPending}
                data-testid="button-save-gift"
              >
                {createMutation.isPending ? "Creating..." : "Create Gift"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {gifts.map((gift: TokenGift) => (
          <GlassCard key={gift.id} className="p-4" data-testid={`card-gift-${gift.id}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">{gift.recipientName || gift.recipientEmail || "Unknown"}</div>
                  <div className="text-xs text-muted-foreground">
                    {parseFloat(gift.amount).toLocaleString()} DWC • {gift.category} • {gift.reason || "No reason"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={
                  gift.status === "claimed" ? "border-green-500/50 text-green-400" :
                  "border-amber-500/50 text-amber-400"
                }>
                  {gift.status}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-400 hover:text-red-300"
                  onClick={() => deleteMutation.mutate(gift.id)}
                  data-testid={`button-delete-gift-${gift.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </GlassCard>
        ))}
        {gifts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No token gifts yet. Gift tokens to individuals you want to reward.
          </div>
        )}
      </div>
    </div>
  );
}

function AirdropsTab({ airdrops, queryClient, showDialog, setShowDialog }: any) {
  const [formData, setFormData] = useState({
    name: "",
    category: "genesis",
    totalAmount: "100000",
    isActive: false,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/airdrops", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/airdrops"] });
      setShowDialog(false);
      setFormData({ name: "", category: "genesis", totalAmount: "100000", isActive: false });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => apiRequest("PUT", `/api/admin/airdrops/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/airdrops"] }),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Airdrop Campaigns</h2>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2" data-testid="button-add-airdrop">
              <Plus className="w-4 h-4" /> Create Airdrop
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-background border-white/10">
            <DialogHeader>
              <DialogTitle>Create Airdrop Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Campaign Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                data-testid="input-airdrop-name"
              />
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger data-testid="select-airdrop-category">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="genesis">Genesis Airdrop</SelectItem>
                  <SelectItem value="beta">Beta Tester Airdrop</SelectItem>
                  <SelectItem value="community">Community Airdrop</SelectItem>
                  <SelectItem value="promotional">Promotional</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Total Amount (DWC)"
                value={formData.totalAmount}
                onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                data-testid="input-airdrop-amount"
              />
              <Button 
                onClick={() => createMutation.mutate(formData)} 
                className="w-full"
                disabled={createMutation.isPending}
                data-testid="button-save-airdrop"
              >
                {createMutation.isPending ? "Creating..." : "Create Campaign"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {airdrops.map((airdrop: AirdropAllocation) => {
          const claimed = parseFloat(airdrop.claimedAmount);
          const total = parseFloat(airdrop.totalAmount);
          const progress = total > 0 ? (claimed / total) * 100 : 0;
          
          return (
            <GlassCard key={airdrop.id} className="p-5" data-testid={`card-airdrop-${airdrop.id}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{airdrop.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {airdrop.category}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant={airdrop.isActive ? "default" : "outline"}
                  onClick={() => updateMutation.mutate({ id: airdrop.id, data: { isActive: !airdrop.isActive } })}
                  data-testid={`button-toggle-airdrop-${airdrop.id}`}
                >
                  {airdrop.isActive ? "Active" : "Inactive"}
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span>{claimed.toLocaleString()} / {total.toLocaleString()} DWC</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </GlassCard>
          );
        })}
        {airdrops.length === 0 && (
          <div className="col-span-2 text-center py-12 text-muted-foreground">
            No airdrop campaigns yet. Create one to distribute tokens to eligible users.
          </div>
        )}
      </div>
    </div>
  );
}
