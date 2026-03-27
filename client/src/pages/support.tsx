import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Send, Clock, CheckCircle, AlertCircle, MessageSquare, ChevronDown, ChevronUp, Sparkles, Shield, Zap, HeartHandshake, Home } from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { GlassCard } from "@/components/glass-card";
import { useAuth } from "@/hooks/use-auth";

const CATEGORIES = [
  { id: "general", label: "General Question", icon: "?" },
  { id: "account", label: "Account Issue", icon: "?" },
  { id: "wallet", label: "Wallet / Transactions", icon: "?" },
  { id: "chronicles", label: "Chronicles", icon: "?" },
  { id: "staking", label: "Staking", icon: "?" },
  { id: "bridge", label: "Bridge", icon: "?" },
  { id: "bug", label: "Bug Report", icon: "?" },
  { id: "feature", label: "Feature Request", icon: "?" },
];

const QUICK_LINKS = [
  { icon: Zap, title: "FAQ", description: "Common questions answered", href: "/faq", color: "from-cyan-500 to-blue-500" },
  { icon: Shield, title: "Documentation", description: "Technical guides & specs", href: "/doc-hub", color: "from-purple-500 to-pink-500" },
  { icon: HeartHandshake, title: "Community", description: "Join the conversation", href: "/community-hub", color: "from-cyan-500 to-red-500" },
];

interface SupportTicket {
  id: string;
  category: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export default function SupportPage() {
  usePageAnalytics();
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  
  const [category, setCategory] = useState("general");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);

  const { data: ticketsData, isLoading: ticketsLoading } = useQuery({
    queryKey: ["support-tickets"],
    queryFn: async () => {
      const res = await fetch("/api/support/tickets", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch tickets");
      return res.json();
    },
    enabled: !!user,
  });

  const createTicketMutation = useMutation({
    mutationFn: async (data: { category: string; subject: string; message: string }) => {
      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create ticket");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      setSubject("");
      setMessage("");
      setCategory("general");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    createTicketMutation.mutate({ category, subject, message });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return <Clock className="w-4 h-4 text-teal-400" />;
      case "in_progress": return <AlertCircle className="w-4 h-4 text-blue-400" />;
      case "resolved": return <CheckCircle className="w-4 h-4 text-green-400" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open": return "Open";
      case "in_progress": return "In Progress";
      case "resolved": return "Resolved";
      default: return status;
    }
  };

  const tickets: SupportTicket[] = ticketsData?.tickets || [];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }} />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <div className="flex items-center gap-3">
            <BackButton />
            <h1 className="text-lg font-bold text-white">Support Center</h1>
          </div>
          <Link href="/" className="ml-auto">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/10">
              <Home className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </nav>

      <section className="relative pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/30 text-white text-xs">
              <HelpCircle className="w-3 h-3 mr-1.5" />
              We're Here to Help
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-black mb-4">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Support Center
              </span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Get help from the Trust Layer team. Submit a ticket and we'll respond as quickly as possible.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
          >
            {QUICK_LINKS.map((link, idx) => (
              <Link key={link.href} href={link.href}>
                <GlassCard glow>
                  <motion.div 
                    className="p-5 cursor-pointer group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${link.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <link.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">{link.title}</h3>
                    <p className="text-xs text-white/50">{link.description}</p>
                  </motion.div>
                </GlassCard>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {!user ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard glow hover={false}>
                <div className="p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center mx-auto mb-6">
                    <HelpCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Sign In Required</h3>
                  <p className="text-sm text-white/60 mb-6 max-w-md mx-auto">
                    Please sign in to submit a support ticket or view your existing tickets. We verify all submissions to prevent spam.
                  </p>
                  <Link href="/login">
                    <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8" data-testid="button-login">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Sign In to Continue
                    </Button>
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-5">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-3"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                    <Send className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Submit a Ticket</h2>
                </div>
                
                <GlassCard glow hover={false}>
                  <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-white/60 mb-2 block font-medium">Category</label>
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger className="bg-black/30 border-white/10 h-11" data-testid="select-category">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-xs text-white/60 mb-2 block font-medium">Subject</label>
                        <Input
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="Brief description of your issue"
                          className="bg-black/30 border-white/10 h-11"
                          data-testid="input-subject"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs text-white/60 mb-2 block font-medium">Message</label>
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Please describe your issue in detail. Include any relevant transaction hashes, wallet addresses, or screenshots if applicable..."
                        className="min-h-[160px] bg-black/30 border-white/10 resize-none"
                        data-testid="input-message"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <p className="text-[10px] text-white/40">
                        Response time: Usually within 24-48 hours
                      </p>
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6"
                        disabled={createTicketMutation.isPending || !subject.trim() || !message.trim()}
                        data-testid="button-submit-ticket"
                      >
                        {createTicketMutation.isPending ? (
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        ) : (
                          <Send className="w-4 h-4 mr-2" />
                        )}
                        Submit Ticket
                      </Button>
                    </div>
                    
                    <AnimatePresence>
                      {createTicketMutation.isSuccess && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20"
                        >
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <p className="text-xs text-green-400">Ticket submitted successfully! We'll get back to you soon.</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                </GlassCard>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Your Tickets</h2>
                  {tickets.length > 0 && (
                    <Badge variant="outline" className="ml-auto border-white/10 text-white/60 text-[10px]">
                      {tickets.length} total
                    </Badge>
                  )}
                </div>
                
                {ticketsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <GlassCard glow key={i}><div className="p-4 h-24 animate-pulse bg-white/5 rounded" /></GlassCard>
                    ))}
                  </div>
                ) : tickets.length === 0 ? (
                  <GlassCard glow hover={false}>
                    <div className="p-10 text-center">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="w-6 h-6 text-white/20" />
                      </div>
                      <p className="text-sm text-white/40 mb-1">No tickets yet</p>
                      <p className="text-xs text-white/30">Submit your first ticket using the form</p>
                    </div>
                  </GlassCard>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {tickets.map((ticket, idx) => (
                      <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <GlassCard glow>
                          <div className="p-4">
                            <button
                              onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
                              className="w-full text-left"
                              data-testid={`button-expand-ticket-${ticket.id}`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    {getStatusIcon(ticket.status)}
                                    <span className="text-sm font-bold text-white truncate">{ticket.subject}</span>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant="outline" className="text-[9px] border-white/10 text-white/40">
                                      {CATEGORIES.find(c => c.id === ticket.category)?.label || ticket.category}
                                    </Badge>
                                    <Badge 
                                      variant="outline" 
                                      className={`text-[9px] ${
                                        ticket.status === "resolved" ? "border-green-500/30 text-green-400 bg-green-500/10" :
                                        ticket.status === "in_progress" ? "border-blue-500/30 text-blue-400 bg-blue-500/10" :
                                        "border-teal-500/30 text-teal-400 bg-teal-500/10"
                                      }`}
                                    >
                                      {getStatusLabel(ticket.status)}
                                    </Badge>
                                  </div>
                                </div>
                                <motion.div
                                  animate={{ rotate: expandedTicket === ticket.id ? 180 : 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <ChevronDown className="w-4 h-4 text-white/40" />
                                </motion.div>
                              </div>
                            </button>
                            
                            <AnimatePresence>
                              {expandedTicket === ticket.id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="mt-4 pt-4 border-t border-white/10">
                                    <p className="text-xs text-white/60 mb-3 leading-relaxed">{ticket.message}</p>
                                    {ticket.admin_notes && (
                                      <div className="p-3 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
                                        <div className="flex items-center gap-2 mb-2">
                                          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                                            <Sparkles className="w-3 h-3 text-white" />
                                          </div>
                                          <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Support Response</p>
                                        </div>
                                        <p className="text-xs text-white/80 leading-relaxed">{ticket.admin_notes}</p>
                                      </div>
                                    )}
                                    <p className="text-[10px] text-white/30 mt-3">
                                      Submitted: {new Date(ticket.created_at).toLocaleDateString()} at {new Date(ticket.created_at).toLocaleTimeString()}
                                    </p>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </GlassCard>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </div>
      </section>

      
    </div>
  );
}
