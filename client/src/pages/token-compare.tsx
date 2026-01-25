import { motion } from "framer-motion";
import { ArrowLeftRight, Clock } from "lucide-react";
import { Link } from "wouter";
import { BackButton } from "@/components/page-nav";
import { GlassCard } from "@/components/glass-card";
import { Footer } from "@/components/footer";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";

export default function TokenCompare() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src={darkwaveLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg hidden sm:inline">DarkWave</span>
          </Link>
          <BackButton />
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
              <ArrowLeftRight className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-display font-bold" data-testid="text-title">Token Comparison</h1>
            </div>
            <p className="text-muted-foreground">Compare tokens side-by-side</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-12 text-center" data-testid="card-coming-soon">
              <div className="flex flex-col items-center justify-center gap-6">
                <div className="relative">
                  <motion.div
                    className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Clock className="w-10 h-10 text-cyan-400" />
                  </motion.div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-display font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Launching Soon
                  </h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Real-time token comparison with live price feeds, volume data, and market analytics 
                    will be available when Trust Layer mainnet goes live.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {["Price", "Volume", "Market Cap", "Holders"].map((metric, i) => (
                    <motion.div
                      key={metric}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="p-4 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="text-2xl font-bold text-muted-foreground/50">--</div>
                      <div className="text-xs text-muted-foreground mt-1">{metric}</div>
                    </motion.div>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground/60 mt-4">
                  Join our testnet today to be ready for mainnet launch
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
