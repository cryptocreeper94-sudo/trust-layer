import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Code2, Upload, CheckCircle2, XCircle, Clock, Sparkles,
  Shield, Zap, FileCode, Github, ExternalLink, Bot, AlertTriangle,
  Trophy, Users, Coins, Play, ChevronRight, Lock, Rocket
} from "lucide-react";
import { Footer } from "@/components/footer";
import { BackButton } from "@/components/page-nav";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";

const REVIEW_CRITERIA = [
  {
    icon: Shield,
    title: "Security Audit",
    description: "Smart contract vulnerabilities, input validation, access controls",
    weight: "30%",
  },
  {
    icon: Sparkles,
    title: "Provable Fairness",
    description: "RNG implementation, on-chain verification, transparency",
    weight: "25%",
  },
  {
    icon: Zap,
    title: "Performance",
    description: "Gas efficiency, response times, scalability",
    weight: "20%",
  },
  {
    icon: Users,
    title: "User Experience",
    description: "Interface quality, responsiveness, accessibility",
    weight: "15%",
  },
  {
    icon: FileCode,
    title: "Code Quality",
    description: "Documentation, best practices, maintainability",
    weight: "10%",
  },
];

const SUBMISSION_STEPS = [
  { step: 1, title: "Submit Code", description: "Provide GitHub repo or upload files" },
  { step: 2, title: "AI Analysis", description: "Automated security & fairness testing" },
  { step: 3, title: "Human Review", description: "Final approval by DarkWave team" },
  { step: 4, title: "Go Live", description: "Your game joins the ecosystem" },
];


export default function GameDeveloper() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [gameName, setGameName] = useState("");
  const [gameDescription, setGameDescription] = useState("");
  const [repoUrl, setRepoUrl] = useState("");

  const { data: recentSubmissions } = useQuery<{ submissions: any[] }>({
    queryKey: ["/api/games/recent-submissions"],
    refetchInterval: 10000,
  });

  const { data: mySubmissions } = useQuery<{ submissions: any[] }>({
    queryKey: ["/api/games/submissions"],
    enabled: !!user,
    refetchInterval: 5000,
  });

  const submitMutation = useMutation({
    mutationFn: async (data: { gameName: string; description: string; repoUrl: string }) => {
      const response = await apiRequest("POST", "/api/games/submit", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Submission Received!",
        description: "Your game is now in the AI review queue. You'll see results within a few minutes.",
      });
      setGameName("");
      setGameDescription("");
      setRepoUrl("");
      queryClient.invalidateQueries({ queryKey: ["/api/games/submissions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/games/recent-submissions"] });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please connect your wallet to submit a game",
        variant: "destructive",
      });
      return;
    }
    
    submitMutation.mutate({ gameName, description: gameDescription, repoUrl });
  };
  
  const displaySubmissions = (mySubmissions?.submissions?.length ?? 0) > 0 
    ? mySubmissions?.submissions ?? []
    : recentSubmissions?.submissions || [];

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={darkwaveLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight">
              DarkWave <span className="text-pink-400">Games</span>
            </span>
          </Link>
          <BackButton />
        </div>
      </nav>

      <main className="flex-1 pt-16 pb-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <Badge className="mb-4 bg-pink-500/20 text-pink-400 border-pink-500/30">
              <Code2 className="w-3 h-3 mr-1" />
              Game Developer Portal
            </Badge>
            
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Build Games for <span className="text-pink-400">DarkWave</span>
            </h1>
            
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Submit your provably fair game for AI-powered review. Approved games join the DarkWave Games ecosystem and earn revenue from player activity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
            {SUBMISSION_STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="p-4 h-full relative">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                    <h3 className="font-bold text-sm">{step.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                  {i < SUBMISSION_STEPS.length - 1 && (
                    <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground hidden md:block" />
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <GlassCard glow className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30">
                    <Bot className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Submit Your Game</h2>
                    <p className="text-sm text-muted-foreground">AI-powered review in under 48 hours</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="gameName">Game Name</Label>
                    <Input
                      id="gameName"
                      value={gameName}
                      onChange={(e) => setGameName(e.target.value)}
                      placeholder="e.g., Lucky Dice, Moon Roulette"
                      className="bg-white/5 border-white/10 mt-1"
                      required
                      data-testid="input-game-name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="gameDescription">Game Description</Label>
                    <Textarea
                      id="gameDescription"
                      value={gameDescription}
                      onChange={(e) => setGameDescription(e.target.value)}
                      placeholder="Describe your game mechanics, RNG implementation, and how provable fairness works..."
                      className="bg-white/5 border-white/10 mt-1 min-h-[100px]"
                      required
                      data-testid="input-game-description"
                    />
                  </div>

                  <div>
                    <Label htmlFor="repoUrl">GitHub Repository URL</Label>
                    <div className="flex gap-2 mt-1">
                      <div className="relative flex-1">
                        <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="repoUrl"
                          value={repoUrl}
                          onChange={(e) => setRepoUrl(e.target.value)}
                          placeholder="https://github.com/your-org/your-game"
                          className="bg-white/5 border-white/10 pl-10"
                          required
                          data-testid="input-repo-url"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Repository must be public or you can invite @darkwave-ai as a collaborator
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-400">Requirements</p>
                        <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                          <li>• Game must use verifiable on-chain randomness</li>
                          <li>• Smart contracts must be included for review</li>
                          <li>• RTP must be documented and at least 90%</li>
                          <li>• No external API dependencies for game logic</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {user ? (
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                      disabled={submitMutation.isPending}
                      data-testid="button-submit-game"
                    >
                      {submitMutation.isPending ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Submit for AI Review
                        </>
                      )}
                    </Button>
                  ) : (
                    <Link href="/wallet">
                      <Button className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-500" data-testid="button-connect-to-submit">
                        <Lock className="w-4 h-4 mr-2" />
                        Connect Wallet to Submit
                      </Button>
                    </Link>
                  )}
                </form>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  AI Review Criteria
                </h3>
                
                <div className="space-y-3">
                  {REVIEW_CRITERIA.map((criteria, i) => (
                    <motion.div
                      key={criteria.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-white/5"
                    >
                      <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                        <criteria.icon className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{criteria.title}</p>
                          <Badge variant="outline" className="text-[10px]">{criteria.weight}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{criteria.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </div>

            <div className="space-y-6">
              <GlassCard className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Recent Submissions
                </h3>
                
                <div className="space-y-3">
                  {displaySubmissions.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No submissions yet. Be the first to submit your game!
                    </p>
                  ) : (
                    displaySubmissions.map((submission: any, i: number) => (
                      <motion.div
                        key={submission.id || submission.gameName}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-3 rounded-lg bg-white/5"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm">{submission.gameName}</p>
                          {submission.status === "approved" && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px]">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Approved
                            </Badge>
                          )}
                          {submission.status === "pending" && (
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-[10px]">
                              <Clock className="w-3 h-3 mr-1 animate-spin" />
                              In Review
                            </Badge>
                          )}
                          {submission.status === "rejected" && (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px]">
                              <XCircle className="w-3 h-3 mr-1" />
                              Rejected
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Submitted {new Date(submission.createdAt).toLocaleDateString()}</span>
                          {submission.overallScore && (
                            <span className={submission.overallScore >= 70 ? "text-green-400" : "text-red-400"}>
                              Score: {submission.overallScore}/100
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </GlassCard>

              <GlassCard className="p-6 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-500/20">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-pink-400" />
                  Developer Benefits
                </h3>
                
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span>70% revenue share on game earnings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>Access to 10,000+ active players</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span>Verified "DarkWave Approved" badge</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span>Integration with DWC payments</span>
                  </li>
                </ul>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-cyan-400" />
                  Resources
                </h3>
                
                <div className="space-y-2">
                  <Link href="/docs" className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <span className="text-sm">SDK Documentation</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </Link>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 opacity-50 cursor-not-allowed">
                    <span className="text-sm">Example Games (Coming Soon)</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <Link href="/docs#security" className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <span className="text-sm">RNG Best Practices</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </Link>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
