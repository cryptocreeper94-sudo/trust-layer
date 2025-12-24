import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Code2, Key, Zap, Shield, Globe, Copy, Check, ChevronDown, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

interface Endpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  auth: boolean;
  params?: { name: string; type: string; required: boolean; description: string }[];
  response?: string;
}

const endpoints: Record<string, Endpoint[]> = {
  blockchain: [
    { method: "GET", path: "/api/chain/stats", description: "Get current blockchain statistics", auth: false, response: '{ "tps": "187432", "blockHeight": 8847623, "validators": 5 }' },
    { method: "GET", path: "/api/chain/block/:height", description: "Get block by height", auth: false, params: [{ name: "height", type: "number", required: true, description: "Block height" }] },
    { method: "GET", path: "/api/chain/tx/:hash", description: "Get transaction by hash", auth: false, params: [{ name: "hash", type: "string", required: true, description: "Transaction hash" }] },
    { method: "GET", path: "/api/chain/address/:address", description: "Get address balance and history", auth: false },
  ],
  wallet: [
    { method: "POST", path: "/api/wallet/create", description: "Generate new wallet keypair", auth: true },
    { method: "GET", path: "/api/wallet/balance/:address", description: "Get wallet DWC balance", auth: false },
    { method: "POST", path: "/api/wallet/transfer", description: "Transfer DWC between addresses", auth: true, params: [{ name: "from", type: "string", required: true, description: "Sender address" }, { name: "to", type: "string", required: true, description: "Recipient address" }, { name: "amount", type: "string", required: true, description: "Amount in DWC" }] },
  ],
  staking: [
    { method: "GET", path: "/api/staking/pools", description: "List all staking pools", auth: false },
    { method: "POST", path: "/api/staking/stake", description: "Stake DWC tokens", auth: true },
    { method: "POST", path: "/api/staking/unstake", description: "Unstake DWC tokens", auth: true },
    { method: "GET", path: "/api/staking/rewards/:address", description: "Get pending rewards", auth: false },
  ],
  webhooks: [
    { method: "POST", path: "/api/webhooks/register", description: "Register a webhook endpoint", auth: true, params: [{ name: "url", type: "string", required: true, description: "Your webhook URL" }, { name: "events", type: "string[]", required: true, description: "Events to subscribe to" }, { name: "secret", type: "string", required: true, description: "HMAC secret for signature verification" }] },
    { method: "GET", path: "/api/webhooks/list", description: "List your registered webhooks", auth: true },
    { method: "DELETE", path: "/api/webhooks/:id", description: "Delete a webhook", auth: true },
  ],
};

const webhookEvents = [
  { event: "swap.executed", description: "DEX trade completed" },
  { event: "stake.created", description: "New staking position" },
  { event: "stake.claimed", description: "Rewards claimed" },
  { event: "block.produced", description: "New block mined" },
  { event: "transaction.confirmed", description: "Transaction confirmed" },
  { event: "liquidity.added", description: "LP deposit" },
  { event: "token.launched", description: "New token on launchpad" },
  { event: "bridge.locked", description: "DWC locked for bridge" },
  { event: "bridge.released", description: "DWC released from bridge" },
];

export default function ApiDocs() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "POST": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "PUT": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "DELETE": return "bg-red-500/20 text-red-400 border-red-500/30";
    }
  };

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://darkwave.app';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0" data-testid="link-home">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/developers">
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 hover:bg-white/5 px-2" data-testid="link-get-api-key">
                <Key className="w-3 h-3" />
                <span className="hidden sm:inline">Get API Key</span>
              </Button>
            </Link>
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
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2" data-testid="text-api-docs-title">API Documentation</h1>
            <p className="text-muted-foreground">
              Integrate DarkWave Smart Chain into your applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <GlassCard className="p-4" data-testid="card-base-url">
              <div className="flex items-center gap-3 mb-2">
                <Globe className="w-5 h-5 text-primary" />
                <span className="font-medium">Base URL</span>
              </div>
              <code className="text-xs bg-black/30 px-2 py-1 rounded block truncate">{baseUrl}/api</code>
            </GlassCard>
            <GlassCard className="p-4" data-testid="card-auth">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-medium">Authentication</span>
              </div>
              <code className="text-xs bg-black/30 px-2 py-1 rounded block">X-API-Key: your_key</code>
            </GlassCard>
            <GlassCard className="p-4" data-testid="card-rate-limit">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="font-medium">Rate Limit</span>
              </div>
              <code className="text-xs bg-black/30 px-2 py-1 rounded block">1000 req/min</code>
            </GlassCard>
          </div>

          <Tabs defaultValue="blockchain" className="w-full">
            <TabsList className="w-full justify-start mb-6 bg-white/5 overflow-x-auto" data-testid="tabs-api-categories">
              <TabsTrigger value="blockchain" className="text-xs sm:text-sm" data-testid="tab-blockchain">Blockchain</TabsTrigger>
              <TabsTrigger value="wallet" className="text-xs sm:text-sm" data-testid="tab-wallet">Wallet</TabsTrigger>
              <TabsTrigger value="staking" className="text-xs sm:text-sm" data-testid="tab-staking">Staking</TabsTrigger>
              <TabsTrigger value="webhooks" className="text-xs sm:text-sm" data-testid="tab-webhooks">Webhooks</TabsTrigger>
              <TabsTrigger value="events" className="text-xs sm:text-sm" data-testid="tab-events">Events</TabsTrigger>
            </TabsList>

            {Object.entries(endpoints).map(([category, categoryEndpoints]) => (
              <TabsContent key={category} value={category} className="space-y-3">
                {categoryEndpoints.map((endpoint, idx) => (
                  <motion.div
                    key={`${endpoint.method}-${endpoint.path}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div 
                      className="cursor-pointer hover:bg-white/5 transition-colors rounded-lg border border-white/10 bg-white/5 backdrop-blur-md"
                      onClick={() => setExpandedEndpoint(expandedEndpoint === `${category}-${idx}` ? null : `${category}-${idx}`)}
                      data-testid={`card-endpoint-${category}-${idx}`}
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-wrap">
                            <Badge className={`${getMethodColor(endpoint.method)} font-mono text-xs`}>
                              {endpoint.method}
                            </Badge>
                            <code className="text-sm font-mono">{endpoint.path}</code>
                            {endpoint.auth && (
                              <Badge variant="outline" className="text-[10px] border-yellow-500/30 text-yellow-400">
                                <Key className="w-2.5 h-2.5 mr-1" /> Auth Required
                              </Badge>
                            )}
                          </div>
                          {expandedEndpoint === `${category}-${idx}` ? (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{endpoint.description}</p>
                        
                        {expandedEndpoint === `${category}-${idx}` && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-4 pt-4 border-t border-white/10"
                          >
                            {endpoint.params && (
                              <div className="mb-4">
                                <h4 className="text-xs font-medium text-muted-foreground mb-2">Parameters</h4>
                                <div className="space-y-2">
                                  {endpoint.params.map(param => (
                                    <div key={param.name} className="flex items-start gap-2 text-xs">
                                      <code className="bg-black/30 px-1.5 py-0.5 rounded">{param.name}</code>
                                      <span className="text-muted-foreground">{param.type}</span>
                                      {param.required && <Badge className="text-[9px] bg-red-500/20 text-red-400">Required</Badge>}
                                      <span className="text-muted-foreground">- {param.description}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div>
                              <h4 className="text-xs font-medium text-muted-foreground mb-2">Example Request</h4>
                              <div className="relative">
                                <pre className="bg-black/50 p-3 rounded text-xs overflow-x-auto">
                                  <code>{`curl -X ${endpoint.method} "${baseUrl}${endpoint.path}" \\
  -H "X-API-Key: your_api_key"`}</code>
                                </pre>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="absolute top-2 right-2 h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(`curl -X ${endpoint.method} "${baseUrl}${endpoint.path}" -H "X-API-Key: your_api_key"`, `${category}-${idx}`);
                                  }}
                                  data-testid={`button-copy-${category}-${idx}`}
                                >
                                  {copiedCode === `${category}-${idx}` ? (
                                    <Check className="w-3 h-3 text-green-400" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </TabsContent>
            ))}

            <TabsContent value="events" className="space-y-4">
              <GlassCard className="p-6" data-testid="card-webhook-events">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Webhook Events
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Subscribe to these events to receive real-time notifications. All webhook payloads include HMAC-SHA256 signatures.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {webhookEvents.map(event => (
                    <div key={event.event} className="flex items-center justify-between p-3 bg-black/20 rounded">
                      <code className="text-xs text-primary">{event.event}</code>
                      <span className="text-xs text-muted-foreground">{event.description}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-6" data-testid="card-signature-verification">
                <h3 className="font-bold mb-4">Signature Verification</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Verify webhook authenticity using HMAC-SHA256:
                </p>
                <pre className="bg-black/50 p-4 rounded text-xs overflow-x-auto">
{`const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload.data))
    .digest('hex');
  return signature === expected;
}`}
                </pre>
              </GlassCard>
            </TabsContent>
          </Tabs>

          <GlassCard className="mt-8 p-6" data-testid="card-sdk">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-primary" />
              SDK & Libraries
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-black/20 rounded">
                <h4 className="font-medium mb-2">JavaScript/TypeScript</h4>
                <code className="text-xs bg-black/30 px-2 py-1 rounded block">npm install @darkwave/sdk</code>
              </div>
              <div className="p-4 bg-black/20 rounded">
                <h4 className="font-medium mb-2">Python</h4>
                <code className="text-xs bg-black/30 px-2 py-1 rounded block">pip install darkwave-sdk</code>
              </div>
              <div className="p-4 bg-black/20 rounded">
                <h4 className="font-medium mb-2">Go</h4>
                <code className="text-xs bg-black/30 px-2 py-1 rounded block">go get darkwave.io/sdk</code>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              SDKs coming soon. Use the REST API in the meantime.
            </p>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
