import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Code, Copy, Check, Search, Filter, Terminal, Globe, Database, Coins, Image } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GlassCard } from "@/components/glass-card";
import { Footer } from "@/components/footer";
import { useToast } from "@/hooks/use-toast";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  language: "javascript" | "python" | "curl" | "solidity";
  category: "wallet" | "transactions" | "staking" | "nft" | "bridge" | "api";
  code: string;
}

const SNIPPETS: CodeSnippet[] = [
  {
    id: "connect-wallet",
    title: "Connect Wallet",
    description: "Initialize and connect to DarkWave wallet",
    language: "javascript",
    category: "wallet",
    code: `import { DarkWaveSDK } from '@darkwave/sdk';

const sdk = new DarkWaveSDK({ network: 'mainnet' });

// Create a new wallet
const wallet = await sdk.createWallet();
console.log('Address:', wallet.address);

// Or connect existing wallet
const connected = await sdk.connect();`
  },
  {
    id: "get-balance",
    title: "Get Wallet Balance",
    description: "Fetch balance for any wallet address",
    language: "javascript",
    category: "wallet",
    code: `const balance = await sdk.getBalance(walletAddress);
console.log('Balance:', balance.dwc, 'DWC');
console.log('USD Value:', balance.usd);`
  },
  {
    id: "send-transaction",
    title: "Send Transaction",
    description: "Transfer DWC to another wallet",
    language: "javascript",
    category: "transactions",
    code: `const tx = await sdk.sendTransaction({
  to: '0xRecipientAddress...',
  amount: '100', // DWC amount
  memo: 'Payment for services'
});

console.log('TX Hash:', tx.hash);
console.log('Status:', tx.status);`
  },
  {
    id: "stake-tokens",
    title: "Stake DWC Tokens",
    description: "Stake tokens to earn rewards",
    language: "javascript",
    category: "staking",
    code: `// Stake DWC tokens
const stake = await sdk.staking.stake({
  amount: '1000',
  tier: 'gold', // bronze, silver, gold, platinum
  lockPeriod: 30 // days
});

// Check staking rewards
const rewards = await sdk.staking.getRewards(walletAddress);
console.log('Pending Rewards:', rewards.pending);`
  },
  {
    id: "mint-nft",
    title: "Mint NFT",
    description: "Create and mint a new NFT",
    language: "javascript",
    category: "nft",
    code: `const nft = await sdk.nft.mint({
  name: 'My Awesome NFT',
  description: 'A unique digital collectible',
  image: imageFile, // File or URL
  attributes: [
    { trait_type: 'Rarity', value: 'Legendary' },
    { trait_type: 'Power', value: 100 }
  ],
  royalties: 5 // 5% royalties
});

console.log('NFT Token ID:', nft.tokenId);`
  },
  {
    id: "bridge-tokens",
    title: "Bridge to Ethereum",
    description: "Bridge DWC to wDWC on Ethereum",
    language: "javascript",
    category: "bridge",
    code: `// Lock DWC and mint wDWC on Ethereum
const bridge = await sdk.bridge.lock({
  amount: '500',
  targetChain: 'ethereum',
  recipientAddress: '0xEthereumAddress...'
});

// Track bridge status
const status = await sdk.bridge.getStatus(bridge.id);
console.log('Bridge Status:', status);`
  },
  {
    id: "api-blocks",
    title: "Fetch Blocks (REST)",
    description: "Get recent blocks via REST API",
    language: "curl",
    category: "api",
    code: `curl -X GET "https://api.darkwavechain.io/v1/blocks?limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`
  },
  {
    id: "api-transactions",
    title: "Get Transactions (REST)",
    description: "Fetch transaction history",
    language: "curl",
    category: "api",
    code: `curl -X GET "https://api.darkwavechain.io/v1/transactions" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"address": "DW7a8f9c3b2e...", "limit": 50}'`
  },
  {
    id: "python-sdk",
    title: "Python SDK Setup",
    description: "Initialize DarkWave Python SDK",
    language: "python",
    category: "api",
    code: `from darkwave import DarkWaveSDK

sdk = DarkWaveSDK(
    network="mainnet",
    api_key="your-api-key"
)

# Get wallet balance
balance = sdk.get_balance("DW7a8f9c3b2e...")
print(f"Balance: {balance['dwc']} DWC")

# Send transaction
tx = sdk.send_transaction(
    to="DWrecipient...",
    amount="50",
    private_key=private_key
)`
  },
  {
    id: "websocket",
    title: "WebSocket Subscription",
    description: "Subscribe to real-time events",
    language: "javascript",
    category: "api",
    code: `const ws = new WebSocket('wss://ws.darkwavechain.io');

ws.onopen = () => {
  // Subscribe to new blocks
  ws.send(JSON.stringify({
    type: 'subscribe',
    channel: 'blocks'
  }));
  
  // Subscribe to specific address
  ws.send(JSON.stringify({
    type: 'subscribe',
    channel: 'account',
    address: 'DW7a8f9c3b2e...'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Event:', data);
};`
  }
];

const LANGUAGE_COLORS = {
  javascript: "from-yellow-500 to-orange-500",
  python: "from-blue-500 to-green-500",
  curl: "from-gray-500 to-gray-700",
  solidity: "from-purple-500 to-pink-500",
};

export default function CodeSnippets() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = async (id: string, code: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(id);
    toast({ title: "Code Copied", description: "Snippet copied to clipboard" });
    setTimeout(() => setCopied(null), 2000);
  };

  const filtered = SNIPPETS.filter(s => {
    const matchesSearch = !search || 
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || s.category === category;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: "all", label: "All", icon: Code },
    { id: "wallet", label: "Wallet", icon: Coins },
    { id: "transactions", label: "Transactions", icon: Terminal },
    { id: "staking", label: "Staking", icon: Coins },
    { id: "nft", label: "NFTs", icon: Image },
    { id: "api", label: "API", icon: Globe },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg hidden sm:inline">DarkWave</span>
          </Link>
          <Link href="/developer-portal">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Developer Portal
            </Button>
          </Link>
        </div>
      </nav>

      <main className="flex-1 pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <Code className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-display font-bold" data-testid="text-title">Code Snippets</h1>
            </div>
            <p className="text-muted-foreground">Copy-paste examples to get started quickly</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 mb-6"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search snippets..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {categories.map(cat => (
              <Button
                key={cat.id}
                variant={category === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setCategory(cat.id)}
                className="gap-1"
                data-testid={`button-category-${cat.id}`}
              >
                <cat.icon className="w-3 h-3" />
                {cat.label}
              </Button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {filtered.map((snippet, idx) => (
              <GlassCard key={snippet.id} className="overflow-hidden" data-testid={`snippet-${snippet.id}`}>
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{snippet.title}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r ${LANGUAGE_COLORS[snippet.language]} text-white`}>
                          {snippet.language}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{snippet.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyCode(snippet.id, snippet.code)}
                      data-testid={`button-copy-${snippet.id}`}
                    >
                      {copied === snippet.id ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <pre className="p-4 bg-black/50 overflow-x-auto">
                  <code className="text-xs text-gray-300">{snippet.code}</code>
                </pre>
              </GlassCard>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Code className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No snippets found</p>
                <p className="text-xs mt-1">Try a different search or category</p>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
