import { motion } from "framer-motion";
import { ArrowLeft, Box, Check, Clock, Code, Cpu, Database, Globe, Hash, Search, Server, Shield, Zap } from "lucide-react";
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

export default function Explorer() {
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
      
      {/* Footer */}
      <footer className="bg-black py-12 border-t border-white/10 mt-20 font-sans">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img src={orbitLogo} alt="Logo" className="w-6 h-6 opacity-50" />
            <span className="text-sm text-muted-foreground">© 2025 Orbit Foundation</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
             <span className="flex items-center gap-1 text-green-500"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> All Systems Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
