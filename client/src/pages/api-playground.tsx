import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Play, Copy, Check, Code, Zap, Globe, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";
import { Footer } from "@/components/footer";
import { usePageAnalytics } from "@/hooks/use-analytics";

const apiExamples = {
  crossChainTransfer: {
    name: "Cross-Chain Transfer",
    description: "Transfer assets from Ethereum to Solana using chain abstraction",
    method: "POST",
    endpoint: "/api/v1/chain-abstraction/transfer",
    request: `{
  "from": {
    "chain": "ethereum",
    "address": "0x742d35Cc6634C0532925a3b844Bc9e..."
  },
  "to": {
    "chain": "solana", 
    "address": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL..."
  },
  "asset": "USDC",
  "amount": "1000.00"
}`,
    response: `{
  "success": true,
  "transactionId": "orb_tx_8f7d3c2a1b0e9...",
  "status": "pending",
  "estimatedTime": "12 seconds",
  "fees": {
    "protocol": "0.001 ORB",
    "gas": "0.0001 ETH"
  }
}`,
  },
  getBalance: {
    name: "Multi-Chain Balance",
    description: "Get unified balance across all connected chains",
    method: "GET",
    endpoint: "/api/v1/account/balances",
    request: `// Query parameters
?address=0x742d35Cc6634C0532925a3b844Bc9e...
&chains=ethereum,solana,polygon,arbitrum`,
    response: `{
  "totalValueUsd": "45,231.89",
  "balances": [
    {
      "chain": "ethereum",
      "assets": [
        { "symbol": "ETH", "balance": "2.5", "valueUsd": "4,500" },
        { "symbol": "USDC", "balance": "10000", "valueUsd": "10,000" }
      ]
    },
    {
      "chain": "solana",
      "assets": [
        { "symbol": "SOL", "balance": "150", "valueUsd": "15,000" }
      ]
    }
  ]
}`,
  },
  executeSwap: {
    name: "Cross-Chain Swap",
    description: "Swap tokens across different chains atomically",
    method: "POST",
    endpoint: "/api/v1/dex/swap",
    request: `{
  "fromChain": "ethereum",
  "fromToken": "ETH",
  "toChain": "polygon",
  "toToken": "MATIC",
  "amount": "1.5",
  "slippage": 0.5,
  "deadline": 300
}`,
    response: `{
  "success": true,
  "swapId": "orb_swap_9c8b7a6d5e4f...",
  "route": [
    { "step": 1, "action": "wrap", "chain": "ethereum" },
    { "step": 2, "action": "bridge", "from": "ethereum", "to": "polygon" },
    { "step": 3, "action": "swap", "chain": "polygon" }
  ],
  "expectedOutput": "2847.32 MATIC",
  "priceImpact": "0.12%"
}`,
  },
};

export default function ApiPlayground() {
  usePageAnalytics();
  const [activeExample, setActiveExample] = useState<keyof typeof apiExamples>("crossChainTransfer");
  const [isExecuting, setIsExecuting] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const example = apiExamples[activeExample];

  const handleExecute = async () => {
    setIsExecuting(true);
    setResponse(null);
    
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setResponse(example.response);
    setIsExecuting(false);
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="hover:bg-white/5">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <img src={orbitLogo} alt="Orbit Logo" className="w-8 h-8" />
              <span className="font-display font-bold text-xl">API Playground</span>
            </div>
          </div>
          <Badge variant="outline" className="border-primary/50 text-primary">
            Testnet Mode
          </Badge>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Chain Abstraction <span className="text-primary">API</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Test and explore the Orbit Chain APIs. Execute cross-chain operations 
              without bridges using our protocol-level messaging.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">API Endpoints</h3>
              {Object.entries(apiExamples).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => {
                    setActiveExample(key as keyof typeof apiExamples);
                    setResponse(null);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    activeExample === key
                      ? "bg-primary/10 border-primary/50"
                      : "bg-black/20 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        value.method === "GET" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {value.method}
                    </Badge>
                    <span className="font-medium text-white">{value.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </button>
              ))}
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5 text-primary" />
                      {example.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1 font-mono">
                      {example.method} {example.endpoint}
                    </p>
                  </div>
                  <Button
                    onClick={handleExecute}
                    disabled={isExecuting}
                    className="bg-primary text-background hover:bg-primary/90"
                    data-testid="button-execute-api"
                  >
                    {isExecuting ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    {isExecuting ? "Executing..." : "Execute"}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Tabs defaultValue="request" className="w-full">
                    <TabsList className="bg-white/5">
                      <TabsTrigger value="request">Request</TabsTrigger>
                      <TabsTrigger value="response">Response</TabsTrigger>
                    </TabsList>
                    <TabsContent value="request" className="mt-4">
                      <div className="relative">
                        <CodeBlock 
                          code={example.request} 
                          language="json" 
                          filename="request.json" 
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="response" className="mt-4">
                      {response ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <CodeBlock 
                            code={response} 
                            language="json" 
                            filename="response.json" 
                          />
                        </motion.div>
                      ) : (
                        <div className="p-8 rounded-xl border border-dashed border-white/20 text-center text-muted-foreground">
                          <Zap className="w-8 h-8 mx-auto mb-3 opacity-50" />
                          <p>Click "Execute" to see the API response</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-black/20 border-white/10 p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Sub-second</div>
                      <div className="text-xs text-muted-foreground">Finality Time</div>
                    </div>
                  </div>
                </Card>
                <Card className="bg-black/20 border-white/10 p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">10+ Chains</div>
                      <div className="text-xs text-muted-foreground">Connected</div>
                    </div>
                  </div>
                </Card>
                <Card className="bg-black/20 border-white/10 p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                      <Code className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">REST & WS</div>
                      <div className="text-xs text-muted-foreground">API Types</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
