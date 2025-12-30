import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Vote, Users, Clock, CheckCircle2, XCircle,
  TrendingUp, MessageSquare, Plus, ExternalLink, Filter,
  ThumbsUp, ThumbsDown, AlertCircle
} from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";

interface Proposal {
  id: string;
  title: string;
  description: string;
  author: string;
  status: "active" | "passed" | "rejected" | "pending";
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  quorum: number;
  endsIn: string;
  createdAt: string;
  category: string;
}

const PROPOSALS: Proposal[] = [
  {
    id: "DWP-001",
    title: "Increase Staking Rewards to 15% APY",
    description: "Proposal to increase the base staking APY from 12.5% to 15% to incentivize long-term holding and reduce selling pressure.",
    author: "whale.dwc",
    status: "active",
    votesFor: 2500000,
    votesAgainst: 800000,
    totalVotes: 3300000,
    quorum: 5000000,
    endsIn: "2 days",
    createdAt: "Dec 20, 2024",
    category: "Treasury",
  },
  {
    id: "DWP-002",
    title: "Launch Community Grant Program",
    description: "Allocate 1M DWC from treasury to fund developer grants and community projects building on DarkWave.",
    author: "defi_king",
    status: "active",
    votesFor: 1800000,
    votesAgainst: 450000,
    totalVotes: 2250000,
    quorum: 5000000,
    endsIn: "4 days",
    createdAt: "Dec 18, 2024",
    category: "Grants",
  },
  {
    id: "DWP-003",
    title: "Add Polygon Bridge Support",
    description: "Integrate Polygon network into the cross-chain bridge to enable DWC transfers to and from Polygon.",
    author: "satoshi.eth",
    status: "passed",
    votesFor: 4200000,
    votesAgainst: 650000,
    totalVotes: 4850000,
    quorum: 5000000,
    endsIn: "Ended",
    createdAt: "Dec 10, 2024",
    category: "Technical",
  },
  {
    id: "DWP-004",
    title: "Reduce Swap Fees to 0.2%",
    description: "Lower DEX swap fees from 0.3% to 0.2% to be more competitive with other platforms.",
    author: "alpha_hunter",
    status: "rejected",
    votesFor: 1200000,
    votesAgainst: 3800000,
    totalVotes: 5000000,
    quorum: 5000000,
    endsIn: "Ended",
    createdAt: "Dec 5, 2024",
    category: "Protocol",
  },
];

const STATS = {
  totalProposals: 42,
  activeProposals: 2,
  totalVoters: 8542,
  votingPower: 25000,
};

function ProposalCard({ proposal }: { proposal: Proposal }) {
  const forPercent = (proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100;
  const quorumPercent = (proposal.totalVotes / proposal.quorum) * 100;
  
  const statusConfig = {
    active: { color: "bg-blue-500/20 text-blue-400", icon: Clock },
    passed: { color: "bg-green-500/20 text-green-400", icon: CheckCircle2 },
    rejected: { color: "bg-red-500/20 text-red-400", icon: XCircle },
    pending: { color: "bg-yellow-500/20 text-yellow-400", icon: AlertCircle },
  };
  
  const status = statusConfig[proposal.status];
  const StatusIcon = status.icon;

  return (
    <GlassCard className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[9px]">{proposal.id}</Badge>
            <Badge variant="outline" className="text-[9px]">{proposal.category}</Badge>
            <Badge className={`${status.color} text-[9px]`}>
              <StatusIcon className="w-3 h-3 mr-0.5" />
              {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
            </Badge>
          </div>
          <h3 className="font-bold text-sm mb-1">{proposal.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2">{proposal.description}</p>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-green-400">For: {(proposal.votesFor/1000000).toFixed(1)}M</span>
          <span className="text-red-400">Against: {(proposal.votesAgainst/1000000).toFixed(1)}M</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-green-500"
            style={{ width: `${forPercent}%` }}
          />
          <div 
            className="h-full bg-red-500"
            style={{ width: `${100 - forPercent}%` }}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
        <span>Quorum: {quorumPercent.toFixed(0)}%</span>
        <span>By @{proposal.author}</span>
        <span>{proposal.endsIn === "Ended" ? proposal.createdAt : `Ends in ${proposal.endsIn}`}</span>
      </div>
      
      {proposal.status === "active" && (
        <div className="flex gap-2">
          <Button size="sm" className="flex-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 gap-1" data-testid={`button-vote-for-${proposal.id}`}>
            <ThumbsUp className="w-3 h-3" />
            Vote For
          </Button>
          <Button size="sm" className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 gap-1" data-testid={`button-vote-against-${proposal.id}`}>
            <ThumbsDown className="w-3 h-3" />
            Vote Against
          </Button>
        </div>
      )}
    </GlassCard>
  );
}

export default function DAOGovernance() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={darkwaveLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <BackButton />
        </div>
      </nav>

      <main className="flex-1 pt-16 pb-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <motion.div 
                className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30"
                animate={{ 
                  boxShadow: ["0 0 20px rgba(99,102,241,0.2)", "0 0 50px rgba(99,102,241,0.4)", "0 0 20px rgba(99,102,241,0.2)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Vote className="w-7 h-7 text-indigo-400" />
              </motion.div>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
              DAO <span className="text-indigo-400">Governance</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Shape the future of DarkWave through community voting
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <GlassCard hover={false} className="p-3">
              <div className="text-[10px] text-muted-foreground mb-1">Total Proposals</div>
              <div className="text-xl font-bold">{STATS.totalProposals}</div>
            </GlassCard>
            <GlassCard hover={false} className="p-3">
              <div className="text-[10px] text-muted-foreground mb-1">Active Now</div>
              <div className="text-xl font-bold text-blue-400">{STATS.activeProposals}</div>
            </GlassCard>
            <GlassCard hover={false} className="p-3">
              <div className="text-[10px] text-muted-foreground mb-1">Total Voters</div>
              <div className="text-xl font-bold">{STATS.totalVoters.toLocaleString()}</div>
            </GlassCard>
            <GlassCard hover={false} className="p-3">
              <div className="text-[10px] text-muted-foreground mb-1">Your Voting Power</div>
              <div className="text-xl font-bold text-primary">{STATS.votingPower.toLocaleString()}</div>
            </GlassCard>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                <Filter className="w-3 h-3" />
                All Categories
              </Button>
            </div>
            <Dialog open={showCreate} onOpenChange={setShowCreate}>
              <DialogTrigger asChild>
                <Button className="gap-2" data-testid="button-new-proposal">
                  <Plus className="w-4 h-4" />
                  New Proposal
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg bg-background border-white/10">
                <DialogHeader>
                  <DialogTitle>Create Proposal</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm mb-2 block">Title</label>
                    <Input placeholder="Enter proposal title..." className="bg-white/5 border-white/10" />
                  </div>
                  <div>
                    <label className="text-sm mb-2 block">Description</label>
                    <Textarea 
                      placeholder="Describe your proposal in detail..." 
                      className="min-h-[100px] bg-white/5 border-white/10"
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-2 block">Category</label>
                    <Input placeholder="e.g., Treasury, Technical, Grants" className="bg-white/5 border-white/10" />
                  </div>
                  <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <div className="flex items-center gap-2 text-yellow-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      Requires 10,000 DWC to submit a proposal
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white" data-testid="button-submit-proposal">
                    Submit Proposal
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Tabs defaultValue="active">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="active" className="text-xs" data-testid="tab-proposals-active">Active</TabsTrigger>
              <TabsTrigger value="passed" className="text-xs" data-testid="tab-proposals-passed">Passed</TabsTrigger>
              <TabsTrigger value="rejected" className="text-xs" data-testid="tab-proposals-rejected">Rejected</TabsTrigger>
              <TabsTrigger value="all" className="text-xs" data-testid="tab-proposals-all">All</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-4 space-y-3">
              {PROPOSALS.filter(p => p.status === "active").map((proposal, i) => (
                <motion.div
                  key={proposal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ProposalCard proposal={proposal} />
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="passed" className="mt-4 space-y-3">
              {PROPOSALS.filter(p => p.status === "passed").map((proposal, i) => (
                <motion.div
                  key={proposal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ProposalCard proposal={proposal} />
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="rejected" className="mt-4 space-y-3">
              {PROPOSALS.filter(p => p.status === "rejected").map((proposal, i) => (
                <motion.div
                  key={proposal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ProposalCard proposal={proposal} />
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="all" className="mt-4 space-y-3">
              {PROPOSALS.map((proposal, i) => (
                <motion.div
                  key={proposal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ProposalCard proposal={proposal} />
                </motion.div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
