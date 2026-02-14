import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Shield, Coins } from "lucide-react";

export default function TeamMessage() {
  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              Team Communication
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Project Update & Milestones
            </h1>
            <p className="text-slate-400">Governance Structure & Allocation Details</p>
          </div>

          <GlassCard glow className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">On the Presale</h2>
            <div className="space-y-4 text-slate-300">
              <p>
                Yeah, it's on. I've put many thousands of dollars into this out of my own pocket 
                because I felt called to build it. At some point I need funding to keep pushing forward.
              </p>
              <p>
                The site isn't finished, but that's the reality of building something real. People will 
                understand "under construction / beta" - this is a working project, a work in progress, 
                and it will continue to be until we get it right.
              </p>
              <p>
                By the time we actually reach token release, it should be 100% complete without a doubt. 
                And we'll give everyone at least a month's notice - "Hey, we intend to release, everything 
                is tested and ready." No surprises.
              </p>
              <p className="text-cyan-400 font-medium">
                So yeah, I'd go ahead and grab yourself a bag if you want. But don't forget - you've got 
                your allocation coming. All we have to do is perform, pull this together, and make it real.
              </p>
            </div>
          </GlassCard>

          <GlassCard glow className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Governance Phases</h2>
              <Badge variant="outline" className="text-purple-400 border-purple-500/30">Member-Based</Badge>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">Phase 1</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Now</Badge>
                </div>
                <p className="text-slate-400">Founder stewardship - building the foundation</p>
              </div>
              
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">Phase 2</span>
                  <Badge variant="outline" className="text-cyan-400 border-cyan-500/30">1,000 Members</Badge>
                </div>
                <p className="text-slate-400">Operations Lead voice included in official releases</p>
              </div>
              
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">Phase 3</span>
                  <Badge variant="outline" className="text-purple-400 border-purple-500/30">5,000 Members</Badge>
                </div>
                <p className="text-slate-400">Community elections begin</p>
              </div>
              
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">Phase 4</span>
                  <Badge variant="outline" className="text-pink-400 border-pink-500/30">25,000 Members</Badge>
                </div>
                <p className="text-slate-400">Full council active, community-driven governance</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard glow className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-cyan-500/20">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Allocation Vesting</h2>
              <Badge variant="outline" className="text-cyan-400 border-cyan-500/30">Market Cap-Based</Badge>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Tier</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Market Cap</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">SIG Unlocked</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Cumulative</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-800">
                    <td className="py-3 px-4 text-white font-medium">Tier 1</td>
                    <td className="py-3 px-4 text-slate-300">$1,000,000</td>
                    <td className="py-3 px-4 text-cyan-400">500,000 SIG</td>
                    <td className="py-3 px-4 text-slate-400">500,000 SIG</td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-3 px-4 text-white font-medium">Tier 2</td>
                    <td className="py-3 px-4 text-slate-300">$2,500,000</td>
                    <td className="py-3 px-4 text-cyan-400">1,000,000 SIG</td>
                    <td className="py-3 px-4 text-slate-400">1,500,000 SIG</td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-3 px-4 text-white font-medium">Tier 3</td>
                    <td className="py-3 px-4 text-slate-300">$5,000,000</td>
                    <td className="py-3 px-4 text-cyan-400">1,250,000 SIG</td>
                    <td className="py-3 px-4 text-slate-400">2,750,000 SIG</td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-3 px-4 text-white font-medium">Tier 4</td>
                    <td className="py-3 px-4 text-slate-300">$7,500,000</td>
                    <td className="py-3 px-4 text-cyan-400">1,250,000 SIG</td>
                    <td className="py-3 px-4 text-slate-400">4,000,000 SIG</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-white font-medium">Tier 5</td>
                    <td className="py-3 px-4 text-slate-300">$10,000,000</td>
                    <td className="py-3 px-4 text-cyan-400">1,000,000 SIG</td>
                    <td className="py-3 px-4 text-green-400 font-semibold">5,000,000 SIG</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </GlassCard>

          <GlassCard glow className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-semibold text-white">Two Separate Tracks</h2>
            </div>
            <p className="text-slate-300">
              <span className="text-purple-400 font-medium">Governance</span> is about community growth - 
              your council seat activates at 1,000 members.
            </p>
            <p className="text-slate-300 mt-2">
              <span className="text-cyan-400 font-medium">Allocation</span> is about project success - 
              your full 5M SIG vests when we hit $10M market cap.
            </p>
            <p className="text-white font-medium mt-4">
              Both happen as we build this thing together.
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
