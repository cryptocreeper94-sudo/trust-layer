import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Webhook, Plus, Trash2, Edit2, CheckCircle, XCircle,
  Clock, RefreshCw, Copy, Eye, EyeOff, ChevronDown, Loader2, Zap
} from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

interface WebhookData {
  id: string;
  url: string;
  secret: string;
  events: string[];
  isActive: boolean;
  failureCount: number;
  lastTriggeredAt?: string;
  createdAt: string;
}

interface WebhookLog {
  id: string;
  event: string;
  success: boolean;
  responseStatus?: number;
  createdAt: string;
}

const EVENT_TYPES = [
  { id: "transaction.created", label: "Transaction Created", desc: "When a new transaction is submitted" },
  { id: "transaction.confirmed", label: "Transaction Confirmed", desc: "When a transaction is confirmed on-chain" },
  { id: "block.created", label: "Block Created", desc: "When a new block is mined" },
  { id: "token.transfer", label: "Token Transfer", desc: "When DWC tokens are transferred" },
  { id: "nft.minted", label: "NFT Minted", desc: "When a new NFT is created" },
  { id: "nft.transferred", label: "NFT Transferred", desc: "When an NFT changes ownership" },
  { id: "swap.executed", label: "Swap Executed", desc: "When a DEX swap completes" },
  { id: "staking.deposit", label: "Staking Deposit", desc: "When tokens are staked" },
  { id: "staking.withdraw", label: "Staking Withdrawal", desc: "When staked tokens are withdrawn" },
];


const SAMPLE_LOGS: WebhookLog[] = [
  { id: "1", event: "transaction.confirmed", success: true, responseStatus: 200, createdAt: new Date().toISOString() },
  { id: "2", event: "token.transfer", success: true, responseStatus: 200, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "3", event: "swap.executed", success: false, responseStatus: 500, createdAt: new Date(Date.now() - 7200000).toISOString() },
];

function WebhookCard({ webhook, onEdit, onDelete, onToggle }: { webhook: WebhookData; onEdit: () => void; onDelete: () => void; onToggle: () => void }) {
  const [showSecret, setShowSecret] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);
  const { toast } = useToast();
  
  const { data: logsData } = useQuery<{ logs: WebhookLog[] }>({
    queryKey: ["/api/webhooks", webhook.id, "logs"],
    queryFn: async () => {
      const res = await fetch(`/api/webhooks/${webhook.id}/logs`);
      if (!res.ok) return { logs: [] };
      return res.json();
    },
    enabled: logsOpen,
  });
  const webhookLogs = logsData?.logs || [];

  const copySecret = () => {
    navigator.clipboard.writeText(webhook.secret);
    toast({ title: "Copied!", description: "Secret copied to clipboard" });
  };

  return (
    <Collapsible open={logsOpen} onOpenChange={setLogsOpen}>
      <GlassCard>
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge className={`text-[9px] ${webhook.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                  {webhook.isActive ? 'Active' : 'Paused'}
                </Badge>
                {webhook.failureCount > 0 && (
                  <Badge className="text-[9px] bg-red-500/20 text-red-400">
                    {webhook.failureCount} failures
                  </Badge>
                )}
              </div>
              <p className="text-sm font-mono text-white truncate">{webhook.url}</p>
            </div>
            <Switch checked={webhook.isActive} onCheckedChange={onToggle} />
          </div>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {webhook.events.map(event => (
              <Badge key={event} variant="outline" className="text-[9px] border-primary/30">
                {event}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 flex items-center gap-2 p-2 rounded bg-white/5 font-mono text-xs">
              <span className="text-muted-foreground">Secret:</span>
              <span className="flex-1 truncate">{showSecret ? webhook.secret : '••••••••••••••••'}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowSecret(!showSecret)}>
                {showSecret ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copySecret}>
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <Clock className="w-3 h-3" />
              {webhook.lastTriggeredAt ? `Last triggered ${new Date(webhook.lastTriggeredAt).toLocaleString()}` : 'Never triggered'}
            </div>
            <div className="flex gap-1">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                  Logs <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${logsOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}>
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-red-500/20" onClick={onDelete}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
        
        <CollapsibleContent>
          <div className="px-4 pb-4 border-t border-white/5 pt-3">
            <h4 className="text-xs font-bold mb-2">Recent Deliveries</h4>
            <div className="space-y-2">
              {webhookLogs.length === 0 ? (
                <div className="text-xs text-muted-foreground p-2">No delivery logs yet</div>
              ) : webhookLogs.map(log => (
                <div key={log.id} className="flex items-center justify-between p-2 rounded bg-white/5 text-xs">
                  <div className="flex items-center gap-2">
                    {log.success ? (
                      <CheckCircle className="w-3 h-3 text-green-400" />
                    ) : (
                      <XCircle className="w-3 h-3 text-red-400" />
                    )}
                    <span className="font-mono">{log.event}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Badge variant="outline" className={`text-[9px] ${log.success ? 'border-green-500/30' : 'border-red-500/30'}`}>
                      {log.responseStatus}
                    </Badge>
                    <span>{new Date(log.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </GlassCard>
    </Collapsible>
  );
}

export default function Webhooks() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookData | null>(null);
  const [formData, setFormData] = useState({ url: "", events: [] as string[] });
  const [editFormData, setEditFormData] = useState({ url: "", events: [] as string[] });

  const { data: webhooksData, isLoading } = useQuery<{ webhooks: WebhookData[] }>({
    queryKey: ["/api/webhooks"],
  });

  const webhooks = webhooksData?.webhooks || [];

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/webhooks", {
        url: formData.url,
        events: formData.events,
      });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Webhook Created!", description: "Your webhook endpoint is now active" });
      queryClient.invalidateQueries({ queryKey: ["/api/webhooks"] });
      setCreateOpen(false);
      setFormData({ url: "", events: [] });
    },
    onError: (error: any) => {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/webhooks/${id}`);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Webhook Deleted", description: "Webhook has been removed" });
      queryClient.invalidateQueries({ queryKey: ["/api/webhooks"] });
    },
    onError: (error: any) => {
      toast({ title: "Delete Failed", description: error.message, variant: "destructive" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await apiRequest("PATCH", `/api/webhooks/${id}`, { isActive });
      return res.json();
    },
    onSuccess: (_, variables) => {
      toast({ title: variables.isActive ? "Webhook Activated" : "Webhook Paused" });
      queryClient.invalidateQueries({ queryKey: ["/api/webhooks"] });
    },
    onError: (error: any) => {
      toast({ title: "Toggle Failed", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, url, events }: { id: string; url: string; events: string[] }) => {
      const res = await apiRequest("PATCH", `/api/webhooks/${id}`, { url, events });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Webhook Updated!", description: "Changes have been saved" });
      queryClient.invalidateQueries({ queryKey: ["/api/webhooks"] });
      setEditOpen(false);
      setEditingWebhook(null);
    },
    onError: (error: any) => {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    },
  });

  const openEditModal = (webhook: WebhookData) => {
    setEditingWebhook(webhook);
    setEditFormData({ url: webhook.url, events: [...webhook.events] });
    setEditOpen(true);
  };

  const toggleEditEvent = (eventId: string) => {
    setEditFormData(prev => ({
      ...prev,
      events: prev.events.includes(eventId)
        ? prev.events.filter(e => e !== eventId)
        : [...prev.events, eventId]
    }));
  };

  const toggleEvent = (eventId: string) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.includes(eventId)
        ? prev.events.filter(e => e !== eventId)
        : [...prev.events, eventId]
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 text-[10px]">API</Badge>
            <BackButton />
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-16 pb-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <motion.div className="p-2 rounded-xl bg-yellow-500/20 border border-yellow-500/30" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <Webhook className="w-6 h-6 text-yellow-400" />
              </motion.div>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
              Webhooks & <span className="text-yellow-400">Events API</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Get real-time notifications for blockchain events. Build reactive applications.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <GlassCard hover={false}>
              <div className="p-3 text-center">
                <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">{webhooks.length}</div>
                <div className="text-[10px] text-muted-foreground">Active Webhooks</div>
              </div>
            </GlassCard>
            <GlassCard hover={false}>
              <div className="p-3 text-center">
                <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">99.9%</div>
                <div className="text-[10px] text-muted-foreground">Delivery Rate</div>
              </div>
            </GlassCard>
            <GlassCard hover={false}>
              <div className="p-3 text-center">
                <Clock className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">&lt;100ms</div>
                <div className="text-[10px] text-muted-foreground">Avg Latency</div>
              </div>
            </GlassCard>
            <GlassCard hover={false}>
              <div className="p-3 text-center">
                <RefreshCw className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">3</div>
                <div className="text-[10px] text-muted-foreground">Auto Retries</div>
              </div>
            </GlassCard>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
            <h2 className="text-xl font-bold">Your Webhooks</h2>
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black h-10 px-4" data-testid="button-create-webhook">
                  <Plus className="w-4 h-4 mr-2" /> Create Webhook
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-background border-white/10">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Webhook className="w-5 h-5 text-yellow-400" /> Create Webhook
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label className="text-xs">Endpoint URL</Label>
                    <Input placeholder="https://your-app.com/webhook" value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})} className="bg-white/5 border-white/10 font-mono text-sm" data-testid="input-webhook-url" />
                  </div>
                  
                  <div>
                    <Label className="text-xs mb-2 block">Events to Subscribe</Label>
                    <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                      {EVENT_TYPES.map(event => (
                        <label key={event.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                          <Checkbox checked={formData.events.includes(event.id)} onCheckedChange={() => toggleEvent(event.id)} className="mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">{event.label}</p>
                            <p className="text-[10px] text-muted-foreground">{event.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black" onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !formData.url || formData.events.length === 0} data-testid="button-submit-webhook">
                    {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    Create Webhook
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {webhooks.length === 0 && !isLoading ? (
              <GlassCard>
                <div className="p-8 text-center">
                  <Webhook className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">No webhooks configured</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create your first webhook to receive real-time blockchain event notifications.
                  </p>
                  <Button onClick={() => setCreateOpen(true)} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                    <Plus className="w-4 h-4 mr-2" /> Create Your First Webhook
                  </Button>
                </div>
              </GlassCard>
            ) : (
              webhooks.map(webhook => (
                <WebhookCard
                  key={webhook.id}
                  webhook={webhook}
                  onEdit={() => openEditModal(webhook)}
                  onDelete={() => {
                    if (confirm("Are you sure you want to delete this webhook?")) {
                      deleteMutation.mutate(webhook.id);
                    }
                  }}
                  onToggle={() => toggleMutation.mutate({ id: webhook.id, isActive: !webhook.isActive })}
                />
              ))
            )}
          </div>

          <GlassCard className="mt-8" glow>
            <div className="p-6">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" /> Quick Start
              </h3>
              <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-green-400/80 overflow-x-auto">
                <pre>{`// Example webhook payload
{
  "event": "transaction.confirmed",
  "timestamp": "${new Date().toISOString()}",
  "data": {
    "txHash": "0x1234...abcd",
    "blockNumber": 12345678,
    "from": "0xabc...123",
    "to": "0xdef...456",
    "value": "1000000000000000000"
  }
}`}</pre>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Verify webhook signatures using the HMAC-SHA256 algorithm with your webhook secret.
              </p>
            </div>
          </GlassCard>
        </div>
      </main>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-background border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-yellow-400" /> Edit Webhook
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-xs">Endpoint URL</Label>
              <Input 
                placeholder="https://your-app.com/webhook" 
                value={editFormData.url} 
                onChange={(e) => setEditFormData({...editFormData, url: e.target.value})} 
                className="bg-white/5 border-white/10 font-mono text-sm" 
                data-testid="input-edit-webhook-url" 
              />
            </div>
            
            <div>
              <Label className="text-xs mb-2 block">Events to Subscribe</Label>
              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                {EVENT_TYPES.map(event => (
                  <label key={event.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                    <Checkbox 
                      checked={editFormData.events.includes(event.id)} 
                      onCheckedChange={() => toggleEditEvent(event.id)} 
                      className="mt-0.5" 
                    />
                    <div>
                      <p className="text-sm font-medium">{event.label}</p>
                      <p className="text-[10px] text-muted-foreground">{event.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            <Button 
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black" 
              onClick={() => editingWebhook && updateMutation.mutate({ 
                id: editingWebhook.id, 
                url: editFormData.url, 
                events: editFormData.events 
              })} 
              disabled={updateMutation.isPending || !editFormData.url || editFormData.events.length === 0}
              data-testid="button-save-webhook"
            >
              {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
}
