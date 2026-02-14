import { motion } from "framer-motion";
import { Users, Coins } from "lucide-react";
import { ReferralTracker } from "@/components/referral-tracker";
import { AirdropDashboard } from "@/components/airdrop-dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

export default function Referrals() {
  return (
    <div className="min-h-screen relative overflow-hidden pt-20 pb-12" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={400} top="10%" left="5%" />
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #8b5cf6)" size={350} top="60%" left="75%" delay={2} />

      <div className="relative z-10 container mx-auto max-w-lg px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <motion.div
              className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30"
              animate={{
                boxShadow: ["0 0 20px rgba(168,85,247,0.2)", "0 0 40px rgba(168,85,247,0.4)", "0 0 20px rgba(168,85,247,0.2)"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Users className="w-5 h-5 text-purple-400" />
            </motion.div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Rewards & Referrals
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Earn SIG tokens and exclusive rewards
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}
        >
          <Tabs defaultValue="airdrop" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="airdrop" className="flex items-center gap-2" data-testid="tab-airdrop">
                <Coins className="w-4 h-4" />
                Airdrop
              </TabsTrigger>
              <TabsTrigger value="referrals" className="flex items-center gap-2" data-testid="tab-referrals">
                <Users className="w-4 h-4" />
                Referrals
              </TabsTrigger>
            </TabsList>

            <TabsContent value="airdrop">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <AirdropDashboard />
              </motion.div>
            </TabsContent>

            <TabsContent value="referrals">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <ReferralTracker />
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
