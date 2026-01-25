import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Users, Heart, Shield, Zap, Globe, ArrowRight,
  Network, Handshake, MapPin, GitBranch, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { BackButton } from "@/components/page-nav";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function TrustCooperative() {
  return (
    <div className="min-h-screen bg-slate-950">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <BackButton />
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto space-y-12"
        >
          {/* Hero */}
          <motion.div variants={itemVariants} className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
              <Handshake className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-400">The Trust Cooperative</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Not a Platform.
              </span>
              <br />
              <span className="text-white">A Cooperative.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Trust Layer isn't something you use. It's something you're part of. 
              Member-owned, member-governed, member-benefited.
            </p>
          </motion.div>

          {/* The Problem */}
          <motion.div variants={itemVariants} className="p-6 md:p-8 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10">
            <h2 className="font-display text-2xl font-bold text-white mb-4">
              The Problem With "Platforms"
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Most platforms extract value from you. Your data, your attention, your content - 
                all monetized to benefit shareholders you'll never meet. You're the product, not the customer.
              </p>
              <p>
                Most crypto projects promise decentralization but deliver the opposite. 
                Three whales control the votes. Founders exit-scam. "Community" is just a Discord 
                full of bots and shills.
              </p>
              <p className="text-white font-medium">
                We're building something different.
              </p>
            </div>
          </motion.div>

          {/* What is a Trust Cooperative */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white text-center">
              What is a Trust Cooperative?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                <Network className="w-8 h-8 text-cyan-400 mb-4" />
                <h3 className="font-semibold text-lg text-white mb-2">Member-Owned</h3>
                <p className="text-sm text-muted-foreground">
                  No outside investors extracting profits. No shareholders demanding growth at any cost. 
                  The members are the owners. Your stake is your stake.
                </p>
              </div>
              
              <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <Users className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="font-semibold text-lg text-white mb-2">Member-Governed</h3>
                <p className="text-sm text-muted-foreground">
                  Governance transitions from founding stewardship to full community control. 
                  As we grow, you gain more voice. At 25,000 members, the council is fully elected.
                </p>
              </div>
              
              <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <Heart className="w-8 h-8 text-green-400 mb-4" />
                <h3 className="font-semibold text-lg text-white mb-2">Member-Benefited</h3>
                <p className="text-sm text-muted-foreground">
                  Protocol fees go back to the treasury. The treasury serves the members. 
                  No value extraction to distant shareholders. What we build, we keep.
                </p>
              </div>
              
              <div className="p-6 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                <Shield className="w-8 h-8 text-amber-400 mb-4" />
                <h3 className="font-semibold text-lg text-white mb-2">Trust-Based</h3>
                <p className="text-sm text-muted-foreground">
                  Not a system of laws with loopholes and lawyers. A system of trust where 
                  your reputation is your capital. Bad actors get identified and excluded.
                </p>
              </div>
            </div>
          </motion.div>

          {/* The Fractal Network */}
          <motion.div variants={itemVariants} className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-6">
              <GitBranch className="w-8 h-8 text-purple-400" />
              <h2 className="font-display text-2xl font-bold text-white">The Fractal Network</h2>
            </div>
            
            <div className="space-y-4 text-muted-foreground">
              <p>
                Trust doesn't scale through algorithms. It scales through <span className="text-white font-medium">relationships</span>.
              </p>
              <p>
                Someone you trust recommends someone they trust. That person recommends someone they trust. 
                Suddenly you have a network of people who are all connected by real human vouching.
              </p>
              <p>
                In your local community, you start to actually <span className="text-white font-medium">know each other</span>. 
                Not usernames and avatars - real people. "I never knew I could call you for this." 
                That's the magic moment.
              </p>
              <p>
                Each local node mirrors the structure of the whole network. That's the fractal pattern. 
                Trust compounds at every level - local, regional, global.
              </p>
            </div>
            
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-white/5">
                <MapPin className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-white">Local Nodes</p>
                <p className="text-xs text-muted-foreground">People you actually know</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <Network className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-white">Regional Networks</p>
                <p className="text-xs text-muted-foreground">Connected communities</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <Globe className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-white">Global Trust Layer</p>
                <p className="text-xs text-muted-foreground">One unified network</p>
              </div>
            </div>
          </motion.div>

          {/* Different from Traditional Crypto */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white text-center">
              How This Is Different
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium"></th>
                    <th className="text-center py-3 px-4 text-red-400 font-medium">Traditional Crypto</th>
                    <th className="text-center py-3 px-4 text-cyan-400 font-medium">Trust Layer Co-op</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-3 px-4 text-muted-foreground">Ownership</td>
                    <td className="py-3 px-4 text-center text-white/60">VCs and early whales</td>
                    <td className="py-3 px-4 text-center text-white">Members</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-muted-foreground">Governance</td>
                    <td className="py-3 px-4 text-center text-white/60">Token-weighted (whales win)</td>
                    <td className="py-3 px-4 text-center text-white">Graduated community control</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-muted-foreground">Purpose</td>
                    <td className="py-3 px-4 text-center text-white/60">Speculation</td>
                    <td className="py-3 px-4 text-center text-white">Building trusted relationships</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-muted-foreground">Community</td>
                    <td className="py-3 px-4 text-center text-white/60">Bots and shills</td>
                    <td className="py-3 px-4 text-center text-white">Real people who vouch for each other</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-muted-foreground">Value Flow</td>
                    <td className="py-3 px-4 text-center text-white/60">Extracted to investors</td>
                    <td className="py-3 px-4 text-center text-white">Stays with members</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-muted-foreground">Exit Strategy</td>
                    <td className="py-3 px-4 text-center text-white/60">Pump and dump</td>
                    <td className="py-3 px-4 text-center text-white">Long-term network building</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* The Vision */}
          <motion.div variants={itemVariants} className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/20 text-center">
            <Sparkles className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-white mb-4">The Vision</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Imagine knowing that anyone in your trusted network is someone you can actually rely on. 
              Not because a platform verified their ID, but because someone you trust vouched for them, 
              and someone vouched for that person, all the way back to people you personally know.
            </p>
            <p className="text-white font-medium mb-6">
              That's not a fantasy. That's how trust actually works. We're just building the infrastructure for it.
            </p>
            <Link href="/join">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600" data-testid="button-join-coop">
                Join the Cooperative
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {/* Related Links */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/signal-core">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer group" data-testid="link-signal-core">
                <Zap className="w-5 h-5 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-white text-sm">Signal Core</h4>
                <p className="text-xs text-muted-foreground">Our immutable principles</p>
              </div>
            </Link>
            <Link href="/governance-charter">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all cursor-pointer group" data-testid="link-governance-charter">
                <Users className="w-5 h-5 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-white text-sm">Governance Charter</h4>
                <p className="text-xs text-muted-foreground">How we transition to community control</p>
              </div>
            </Link>
            <Link href="/governance-treasury">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all cursor-pointer group" data-testid="link-governance-treasury">
                <Shield className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-white text-sm">Governance Treasury</h4>
                <p className="text-xs text-muted-foreground">Multi-sig controlled funds</p>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
