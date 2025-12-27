import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Users, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { ReferralTracker } from "@/components/referral-tracker";
import { AirdropDashboard } from "@/components/airdrop-dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";

export default function Referrals() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <img src={darkwaveLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight">DarkWave</span>
          </Link>
          <div className="ml-auto">
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-8 text-xs" data-testid="button-back">
                <ArrowLeft className="w-3 h-3 mr-1" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-16 pb-8 px-4">
        <div className="container mx-auto max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
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
              <h1 className="text-2xl md:text-3xl font-display font-bold">
                Rewards & Referrals
              </h1>
            </div>
            <p className="text-xs text-muted-foreground">
              Earn DWC tokens and exclusive rewards
            </p>
          </motion.div>

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
        </div>
      </main>

      <Footer />
    </div>
  );
}
