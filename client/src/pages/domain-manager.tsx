import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useParams, Link } from "wouter";
import { 
  Globe, Shield, Settings, Server, Mail, Link2, Wallet, 
  Plus, Trash2, Save, RefreshCw, Copy, ExternalLink, Clock, 
  Crown, Infinity as InfinityIcon, AlertCircle, Check, ChevronDown
} from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { apiRequest } from "@/lib/queryClient";
import { WalletButton } from "@/components/wallet-button";
import { useWallet } from "@/hooks/use-wallet";
import { toast } from "sonner";

interface DomainRecord {
  id: string;
  domainId: string;
  recordType: string;
  key: string;
  value: string;
  ttl?: number;
  priority?: number;
  createdAt: string;
  updatedAt: string;
}

interface BlockchainDomain {
  id: string;
  name: string;
  tld: string;
  ownerAddress: string;
  registeredAt: string;
  expiresAt: string | null;
  ownershipType: "term" | "lifetime";
  isPremium: boolean;
  isProtected: boolean;
  primaryWallet?: string;
  avatarUrl?: string;
  description?: string;
  website?: string;
  email?: string;
  twitter?: string;
  discord?: string;
  telegram?: string;
  records?: DomainRecord[];
}

const DNS_RECORD_TYPES = [
  { value: "A", label: "A Record", description: "Maps domain to IPv4 address", placeholder: "192.168.1.1" },
  { value: "AAAA", label: "AAAA Record", description: "Maps domain to IPv6 address", placeholder: "2001:0db8:85a3:0000:0000:8a2e:0370:7334" },
  { value: "CNAME", label: "CNAME Record", description: "Alias to another domain", placeholder: "example.replit.app" },
  { value: "MX", label: "MX Record", description: "Mail server", placeholder: "mail.example.com" },
  { value: "TXT", label: "TXT Record", description: "Text record (SPF, DKIM, verification)", placeholder: "v=spf1 include:_spf.google.com ~all" },
  { value: "URL", label: "URL Redirect", description: "Redirect visitors to URL", placeholder: "https://myapp.replit.app" },
  { value: "NS", label: "NS Record", description: "Nameserver delegation", placeholder: "ns1.example.com" },
];

const WALLET_TYPES = [
  { value: "eth", label: "Ethereum (ETH)", placeholder: "0x..." },
  { value: "sol", label: "Solana (SOL)", placeholder: "..." },
  { value: "btc", label: "Bitcoin (BTC)", placeholder: "bc1..." },
  { value: "dwc", label: "DarkWave (DWC)", placeholder: "0x..." },
];

const TTL_OPTIONS = [
  { value: 300, label: "5 minutes" },
  { value: 3600, label: "1 hour" },
  { value: 14400, label: "4 hours" },
  { value: 86400, label: "1 day" },
];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function RecordRow({ 
  record, 
  onDelete, 
  onUpdate 
}: { 
  record: DomainRecord; 
  onDelete: () => void;
  onUpdate: (updates: Partial<DomainRecord>) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(record.value);

  const handleSave = () => {
    onUpdate({ value: editValue });
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10" data-testid={`row-record-${record.id}`}>
      <div className="flex-shrink-0">
        <Badge variant="outline" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30" data-testid={`badge-record-type-${record.id}`}>
          {record.recordType}
        </Badge>
      </div>
      <div className="flex-shrink-0 min-w-[80px]">
        <span className="text-white/60 text-sm font-mono" data-testid={`text-record-key-${record.id}`}>{record.key}</span>
      </div>
      <div className="flex-1">
        {isEditing ? (
          <Input 
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="bg-white/5 border-white/20 text-white h-8"
            data-testid={`input-record-value-${record.id}`}
          />
        ) : (
          <span className="text-white font-mono text-sm break-all" data-testid={`text-record-value-${record.id}`}>{record.value}</span>
        )}
      </div>
      {record.ttl && (
        <div className="flex-shrink-0 text-white/40 text-xs" data-testid={`text-record-ttl-${record.id}`}>
          TTL: {record.ttl}s
        </div>
      )}
      <div className="flex-shrink-0 flex items-center gap-1">
        {isEditing ? (
          <>
            <Button size="sm" variant="ghost" onClick={handleSave} className="h-7 w-7 p-0 text-green-400" data-testid={`button-save-record-${record.id}`}>
              <Check className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} className="h-7 w-7 p-0 text-white/60" data-testid={`button-cancel-edit-${record.id}`}>
              <AlertCircle className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)} className="h-7 w-7 p-0 text-white/60 hover:text-white" data-testid={`button-edit-record-${record.id}`}>
              <Settings className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={onDelete} className="h-7 w-7 p-0 text-red-400 hover:text-red-300" data-testid={`button-delete-record-${record.id}`}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default function DomainManager() {
  const { name } = useParams<{ name: string }>();
  const queryClient = useQueryClient();
  const { evmAddress, solanaAddress, isConnected } = useWallet();
  const walletAddress = evmAddress || solanaAddress;
  
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [newRecordType, setNewRecordType] = useState("A");
  const [newRecordKey, setNewRecordKey] = useState("@");
  const [newRecordValue, setNewRecordValue] = useState("");
  const [newRecordTtl, setNewRecordTtl] = useState(3600);
  const [newRecordPriority, setNewRecordPriority] = useState(10);
  
  const [showRenewDialog, setShowRenewDialog] = useState(false);
  const [renewYears, setRenewYears] = useState(1);

  const { data: domain, isLoading, error } = useQuery<BlockchainDomain>({
    queryKey: ["/api/domains", name],
    enabled: !!name,
  });

  const isOwner = domain && walletAddress && 
    domain.ownerAddress.toLowerCase() === walletAddress.toLowerCase();

  const addRecordMutation = useMutation({
    mutationFn: async (data: { recordType: string; key: string; value: string; ttl?: number; priority?: number }) => {
      const res = await apiRequest("POST", `/api/domains/${domain?.id}/records`, data);
      return res.json();
    },
    onSuccess: () => {
      toast.success("Record added successfully!");
      setShowAddRecord(false);
      setNewRecordValue("");
      queryClient.invalidateQueries({ queryKey: ["/api/domains", name] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add record");
    },
  });

  const deleteRecordMutation = useMutation({
    mutationFn: async (recordId: string) => {
      const res = await apiRequest("DELETE", `/api/domains/${domain?.id}/records/${recordId}`);
      return res.json();
    },
    onSuccess: () => {
      toast.success("Record deleted!");
      queryClient.invalidateQueries({ queryKey: ["/api/domains", name] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete record");
    },
  });

  const updateRecordMutation = useMutation({
    mutationFn: async ({ recordId, updates }: { recordId: string; updates: { value?: string; ttl?: number; priority?: number } }) => {
      const res = await apiRequest("PATCH", `/api/domains/${domain?.id}/records/${recordId}`, updates);
      return res.json();
    },
    onSuccess: () => {
      toast.success("Record updated!");
      queryClient.invalidateQueries({ queryKey: ["/api/domains", name] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update record");
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<BlockchainDomain>) => {
      const res = await apiRequest("PUT", `/api/domains/${domain?.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      toast.success("Profile updated!");
      queryClient.invalidateQueries({ queryKey: ["/api/domains", name] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  const handleAddRecord = () => {
    if (!newRecordValue.trim()) {
      toast.error("Please enter a value");
      return;
    }
    addRecordMutation.mutate({
      recordType: newRecordType,
      key: newRecordKey,
      value: newRecordValue,
      ttl: newRecordTtl,
      priority: newRecordType === "MX" ? newRecordPriority : undefined,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !domain) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <GlassCard className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Domain Not Found</h2>
          <p className="text-white/60 mb-4">The domain "{name}.dwsc" could not be found.</p>
          <Link href="/domains">
            <Button>Back to Domains</Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  const dnsRecords = domain.records?.filter(r => 
    ["A", "AAAA", "CNAME", "MX", "TXT", "URL", "NS"].includes(r.recordType)
  ) || [];
  
  const walletRecords = domain.records?.filter(r => r.recordType === "WALLET") || [];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 backdrop-blur-xl bg-black/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <BackButton />
          <WalletButton />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    {domain.name}.{domain.tld}
                  </span>
                </h1>
                {domain.isPremium && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black">
                    <Crown className="w-3 h-3 mr-1" /> Premium
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-white/60">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Registered {formatDate(domain.registeredAt)}
                </span>
                {domain.ownershipType === "lifetime" ? (
                  <span className="flex items-center gap-1 text-cyan-400">
                    <InfinityIcon className="w-4 h-4" /> Owned Forever
                  </span>
                ) : domain.expiresAt && (
                  <span className="flex items-center gap-1">
                    Expires {formatDate(domain.expiresAt)}
                  </span>
                )}
              </div>
            </div>
            
            {isOwner && domain.ownershipType === "term" && (
              <Button 
                onClick={() => setShowRenewDialog(true)}
                className="bg-gradient-to-r from-cyan-500 to-purple-500"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Renew Domain
              </Button>
            )}
          </div>
        </motion.div>

        {!isOwner && (
          <GlassCard className="p-4 mb-6 border-amber-500/30 bg-amber-500/10">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-amber-400" />
              <p className="text-amber-200">
                You are viewing this domain. Connect the owner wallet to make changes.
              </p>
            </div>
          </GlassCard>
        )}

        <Tabs defaultValue="dns" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="dns" className="data-[state=active]:bg-cyan-500/20" data-testid="tab-dns">
              <Server className="w-4 h-4 mr-2" /> DNS Records
            </TabsTrigger>
            <TabsTrigger value="wallets" className="data-[state=active]:bg-cyan-500/20" data-testid="tab-wallets">
              <Wallet className="w-4 h-4 mr-2" /> Wallet Links
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-cyan-500/20" data-testid="tab-profile">
              <Settings className="w-4 h-4 mr-2" /> Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dns">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">DNS Records</h2>
                  <p className="text-white/60 text-sm">Configure A, AAAA, CNAME, MX, TXT records and URL redirects</p>
                </div>
                {isOwner && (
                  <Button onClick={() => setShowAddRecord(true)} className="gap-2" data-testid="button-add-record">
                    <Plus className="w-4 h-4" /> Add Record
                  </Button>
                )}
              </div>

              {dnsRecords.length === 0 ? (
                <div className="text-center py-12 text-white/40">
                  <Server className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No DNS records configured yet</p>
                  {isOwner && (
                    <Button variant="outline" onClick={() => setShowAddRecord(true)} className="mt-4">
                      Add Your First Record
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {dnsRecords.map((record) => (
                    <RecordRow
                      key={record.id}
                      record={record}
                      onDelete={() => deleteRecordMutation.mutate(record.id)}
                      onUpdate={(updates) => {
                        updateRecordMutation.mutate({ recordId: record.id, updates });
                      }}
                    />
                  ))}
                </div>
              )}

              <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <h3 className="font-medium text-white mb-2">Quick Setup for Replit</h3>
                <p className="text-white/60 text-sm mb-3">
                  To connect your Replit app to this domain:
                </p>
                <ol className="list-decimal list-inside text-white/60 text-sm space-y-1">
                  <li>Add a CNAME record with key "@" pointing to your Replit app URL</li>
                  <li>Or add a URL redirect to forward visitors to your app</li>
                  <li>In Replit, go to Settings → Custom Domain and add <code className="bg-white/10 px-1 rounded">{domain.name}.dwsc</code></li>
                </ol>
              </div>
            </GlassCard>
          </TabsContent>

          <TabsContent value="wallets">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Linked Wallets</h2>
                  <p className="text-white/60 text-sm">People can send crypto to {domain.name}.dwsc</p>
                </div>
              </div>

              <div className="space-y-4">
                {WALLET_TYPES.map((wallet) => {
                  const record = walletRecords.find(r => r.key === wallet.value);
                  return (
                    <div key={wallet.value} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="w-24">
                        <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                          {wallet.label}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        {record ? (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-white text-sm">{record.value}</span>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => copyToClipboard(record.value)}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <Input 
                            placeholder={wallet.placeholder}
                            disabled={!isOwner}
                            className="bg-white/5 border-white/20 text-white"
                            onBlur={(e) => {
                              if (e.target.value && isOwner) {
                                addRecordMutation.mutate({
                                  recordType: "WALLET",
                                  key: wallet.value,
                                  value: e.target.value,
                                });
                              }
                            }}
                          />
                        )}
                      </div>
                      {record && isOwner && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => deleteRecordMutation.mutate(record.id)}
                          className="text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </TabsContent>

          <TabsContent value="profile">
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Domain Profile</h2>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                updateProfileMutation.mutate({
                  description: formData.get("description") as string,
                  website: formData.get("website") as string,
                  email: formData.get("email") as string,
                  twitter: formData.get("twitter") as string,
                  discord: formData.get("discord") as string,
                  telegram: formData.get("telegram") as string,
                });
              }} className="space-y-6">
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    name="description"
                    defaultValue={domain.description || ""}
                    placeholder="Tell people about this domain..."
                    disabled={!isOwner}
                    className="bg-white/5 border-white/20 text-white mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input 
                      id="website"
                      name="website"
                      defaultValue={domain.website || ""}
                      placeholder="https://..."
                      disabled={!isOwner}
                      className="bg-white/5 border-white/20 text-white mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={domain.email || ""}
                      placeholder="contact@..."
                      disabled={!isOwner}
                      className="bg-white/5 border-white/20 text-white mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input 
                      id="twitter"
                      name="twitter"
                      defaultValue={domain.twitter || ""}
                      placeholder="@username"
                      disabled={!isOwner}
                      className="bg-white/5 border-white/20 text-white mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="discord">Discord</Label>
                    <Input 
                      id="discord"
                      name="discord"
                      defaultValue={domain.discord || ""}
                      placeholder="username#1234"
                      disabled={!isOwner}
                      className="bg-white/5 border-white/20 text-white mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="telegram">Telegram</Label>
                    <Input 
                      id="telegram"
                      name="telegram"
                      defaultValue={domain.telegram || ""}
                      placeholder="@username"
                      disabled={!isOwner}
                      className="bg-white/5 border-white/20 text-white mt-1"
                    />
                  </div>
                </div>

                {isOwner && (
                  <Button type="submit" className="gap-2" disabled={updateProfileMutation.isPending}>
                    <Save className="w-4 h-4" />
                    {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
                  </Button>
                )}
              </form>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={showAddRecord} onOpenChange={setShowAddRecord}>
        <DialogContent className="bg-slate-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Add DNS Record</DialogTitle>
            <DialogDescription className="text-white/60">
              Configure a new record for {domain.name}.dwsc
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label>Record Type</Label>
              <Select value={newRecordType} onValueChange={setNewRecordType}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/10">
                  {DNS_RECORD_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <span className="font-medium">{type.label}</span>
                        <span className="text-white/40 ml-2 text-xs">{type.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Host / Key</Label>
              <Input 
                value={newRecordKey}
                onChange={(e) => setNewRecordKey(e.target.value)}
                placeholder="@ for root, www, mail, etc."
                className="bg-white/5 border-white/20 text-white mt-1"
              />
              <p className="text-xs text-white/40 mt-1">Use @ for the root domain</p>
            </div>

            <div>
              <Label>Value</Label>
              <Input 
                value={newRecordValue}
                onChange={(e) => setNewRecordValue(e.target.value)}
                placeholder={DNS_RECORD_TYPES.find(t => t.value === newRecordType)?.placeholder}
                className="bg-white/5 border-white/20 text-white mt-1"
              />
            </div>

            {newRecordType === "MX" && (
              <div>
                <Label>Priority</Label>
                <Input 
                  type="number"
                  value={newRecordPriority}
                  onChange={(e) => setNewRecordPriority(parseInt(e.target.value))}
                  className="bg-white/5 border-white/20 text-white mt-1"
                />
              </div>
            )}

            <div>
              <Label>TTL (Time to Live)</Label>
              <Select value={newRecordTtl.toString()} onValueChange={(v) => setNewRecordTtl(parseInt(v))}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/10">
                  {TTL_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddRecord(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRecord} disabled={addRecordMutation.isPending}>
              {addRecordMutation.isPending ? "Adding..." : "Add Record"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRenewDialog} onOpenChange={setShowRenewDialog}>
        <DialogContent className="bg-slate-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Renew Domain</DialogTitle>
            <DialogDescription className="text-white/60">
              Extend ownership of {domain.name}.dwsc
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label>Renewal Period</Label>
            <Select value={renewYears.toString()} onValueChange={(v) => setRenewYears(parseInt(v))}>
              <SelectTrigger className="bg-white/5 border-white/20 text-white mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/10">
                {[1, 2, 3, 5, 10].map((years) => (
                  <SelectItem key={years} value={years.toString()}>
                    {years} year{years > 1 ? "s" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-white/40 mt-2">
              Current expiry: {domain.expiresAt ? formatDate(domain.expiresAt) : "N/A"}
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenewDialog(false)}>
              Cancel
            </Button>
            <Button onClick={async () => {
              try {
                const res = await fetch(`/api/domains/${domain.id}/renew`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ years: renewYears }),
                });
                if (res.ok) {
                  toast.success(`Domain renewed for ${renewYears} year${renewYears > 1 ? 's' : ''}!`);
                  setShowRenewDialog(false);
                  queryClient.invalidateQueries({ queryKey: ['/api/domains'] });
                } else {
                  const err = await res.json();
                  toast.error(err.error || 'Renewal failed');
                }
              } catch (err: any) {
                toast.error(err.message || 'Renewal failed');
              }
            }}>
              Renew Domain
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
