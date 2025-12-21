import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Box, Clock, Globe, QrCode, AlertCircle, CheckCircle2, Search, Zap } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import explorerBg from "@assets/generated_images/futuristic_blockchain_network_activity_monitor.png";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Footer } from "@/components/footer";
import { usePageAnalytics } from "@/hooks/use-analytics";

interface HallmarkData {
  hallmarkId: string;
  masterSequence: string;
  subSequence: string;
  appId: string;
  appName: string;
  productName: string;
  version: string;
  releaseType: string;
  dataHash: string;
  metadata: Record<string, unknown> | null;
  darkwave: {
    txHash: string | null;
    blockHeight: number | null;
    status: string;
  };
  verified: boolean;
  message: string;
  createdAt: string;
}

export default function Explorer() {
  usePageAnalytics();
  const [hallmarkSearch, setHallmarkSearch] = useState("");
  const [hallmarkData, setHallmarkData] = useState<HallmarkData | null>(null);
  const [hallmarkLoading, setHallmarkLoading] = useState(false);
  const [hallmarkError, setHallmarkError] = useState<string | null>(null);

  const searchHallmark = async () => {
    if (!hallmarkSearch.trim()) return;
    
    setHallmarkLoading(true);
    setHallmarkError(null);
    setHallmarkData(null);

    try {
      const response = await fetch(`/api/hallmark/${hallmarkSearch.trim()}`);
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Hallmark not found");
      }
      const data = await response.json();
      setHallmarkData(data);
    } catch (error) {
      setHallmarkError(error instanceof Error ? error.message : "Failed to fetch hallmark");
    } finally {
      setHallmarkLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary font-mono">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md font-sans">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors cursor-pointer group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-display font-medium">Back to Orbit</span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-mono text-green-500">Mainnet Beta</span>
          </div>
        </div>
      </nav>

      {/* Header / Search */}
      <section className="pt-32 pb-12 relative border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <img 
            src={explorerBg} 
            alt="Background" 
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/95 to-background"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-display font-bold">
              Orbit<span className="text-primary">Scan</span>
            </h1>
            <p className="text-muted-foreground">
              The Window into the Ledger. Track every block, transaction, and contract in real-time.
            </p>
            
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search by Address / Txn Hash / Block / Token" 
                className="pl-12 h-14 bg-black/50 border-white/10 rounded-xl font-mono text-sm focus:border-primary/50 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Network Stats */}
      <section className="py-8 bg-white/5 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
             <div className="space-y-1">
               <div className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                 <Zap className="w-4 h-4 text-primary" /> TPS (Live)
               </div>
               <div className="text-2xl font-bold text-white">4,892</div>
             </div>
             <div className="space-y-1">
               <div className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                 <Box className="w-4 h-4 text-secondary" /> Latest Block
               </div>
               <div className="text-2xl font-bold text-white">#8,921,054</div>
             </div>
             <div className="space-y-1">
               <div className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                 <Globe className="w-4 h-4 text-blue-400" /> Active Nodes
               </div>
               <div className="text-2xl font-bold text-white">1,240</div>
             </div>
             <div className="space-y-1">
               <div className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                 <Clock className="w-4 h-4 text-orange-400" /> Finality
               </div>
               <div className="text-2xl font-bold text-white">0.4s</div>
             </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Latest Blocks */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm overflow-hidden">
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-bold font-display text-lg">Latest Blocks</h3>
                <Button variant="outline" size="sm" className="h-8 text-xs border-white/10 hover:bg-white/5">View All</Button>
              </div>
              <div className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-xs text-muted-foreground">Block</TableHead>
                      <TableHead className="text-xs text-muted-foreground">Validator</TableHead>
                      <TableHead className="text-xs text-muted-foreground text-right">Reward</TableHead>
                      <TableHead className="text-xs text-muted-foreground text-right">Age</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(6)].map((_, i) => (
                      <TableRow key={i} className="border-white/5 hover:bg-white/5">
                        <TableCell className="font-medium text-primary">#{8921054 - i}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-500 to-purple-500"></div>
                            <span className="text-xs text-white/80">Validator {i + 1}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-xs">32.5 DARK</TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">{i * 2}s ago</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>

            {/* Latest Transactions */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm overflow-hidden">
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-bold font-display text-lg">Latest Transactions</h3>
                <Button variant="outline" size="sm" className="h-8 text-xs border-white/10 hover:bg-white/5">View All</Button>
              </div>
              <div className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-xs text-muted-foreground">Txn Hash</TableHead>
                      <TableHead className="text-xs text-muted-foreground">From / To</TableHead>
                      <TableHead className="text-xs text-muted-foreground text-right">Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(6)].map((_, i) => (
                      <TableRow key={i} className="border-white/5 hover:bg-white/5">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <span className="bg-white/10 p-1 rounded text-[10px] text-muted-foreground">TX</span>
                            <span className="text-primary text-xs font-mono">0x7a...8b{i}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              From: <span className="text-white">0x12...34</span>
                            </div>
                             <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              To: <span className="text-white">0x88...99</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary" className="bg-secondary/10 text-secondary border-none text-[10px]">
                            {100 * (i + 1)} DARK
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>

          </div>
        </div>
      </section>

      {/* Hallmark Verification */}
      <section className="py-12 border-t border-white/5">
        <div className="container mx-auto px-6">
          <Card className="bg-black/40 border-white/10 backdrop-blur-sm overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold font-display text-lg">Hallmark Verification</h3>
                  <p className="text-xs text-muted-foreground">Verify authenticity of DarkWave ecosystem products</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex gap-3">
                <Input 
                  placeholder="Enter hallmark ID (e.g., 000000001-01)"
                  value={hallmarkSearch}
                  onChange={(e) => setHallmarkSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchHallmark()}
                  className="flex-1 bg-black/50 border-white/10 font-mono"
                  data-testid="input-hallmark-search"
                />
                <Button 
                  onClick={searchHallmark}
                  disabled={hallmarkLoading}
                  className="bg-primary hover:bg-primary/90"
                  data-testid="button-hallmark-search"
                >
                  {hallmarkLoading ? "Verifying..." : "Verify"}
                </Button>
              </div>

              {hallmarkError && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400">{hallmarkError}</span>
                </div>
              )}

              {hallmarkData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                    <div className="flex-shrink-0">
                      {hallmarkData.verified ? (
                        <div className="w-16 h-16 rounded-xl bg-green-500/20 flex items-center justify-center">
                          <CheckCircle2 className="w-8 h-8 text-green-400" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                          <Clock className="w-8 h-8 text-yellow-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge 
                            variant={hallmarkData.verified ? "default" : "secondary"}
                            className={hallmarkData.verified ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"}
                          >
                            {hallmarkData.verified ? "Verified on Chain" : "Pending Confirmation"}
                          </Badge>
                          <h4 className="font-bold text-xl mt-2 font-mono" data-testid="text-hallmark-id">{hallmarkData.hallmarkId}</h4>
                        </div>
                        <img 
                          src={`/api/hallmark/${hallmarkData.hallmarkId}/qr`} 
                          alt="QR Code" 
                          className="w-20 h-20 bg-white p-1 rounded"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-3 border-t border-white/10">
                        <div>
                          <span className="text-xs text-muted-foreground">App</span>
                          <p className="font-medium">{hallmarkData.appName}</p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Product</span>
                          <p className="font-medium">{hallmarkData.productName}</p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Version</span>
                          <p className="font-medium">{hallmarkData.version}</p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Release Type</span>
                          <p className="font-medium capitalize">{hallmarkData.releaseType}</p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Status</span>
                          <p className="font-medium capitalize">{hallmarkData.darkwave.status}</p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Created</span>
                          <p className="font-medium">{new Date(hallmarkData.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {hallmarkData.darkwave.txHash && (
                        <div className="pt-3 border-t border-white/10">
                          <span className="text-xs text-muted-foreground">DarkWave Transaction</span>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="text-xs text-primary font-mono bg-primary/10 px-2 py-1 rounded">
                              {hallmarkData.darkwave.txHash}
                            </code>
                            {hallmarkData.darkwave.blockHeight && (
                              <Badge variant="outline" className="text-xs">
                                Block #{hallmarkData.darkwave.blockHeight}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="pt-3 border-t border-white/10">
                        <span className="text-xs text-muted-foreground">Data Hash</span>
                        <code className="block text-xs text-muted-foreground font-mono mt-1 break-all">
                          {hallmarkData.dataHash}
                        </code>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </Card>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
