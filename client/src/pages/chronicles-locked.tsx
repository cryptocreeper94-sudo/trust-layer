import { motion } from "framer-motion";
import { Construction, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/glass-card";
import { Link } from "wouter";

export default function ChroniclesLocked() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full relative z-10"
      >
        <GlassCard glow className="p-8 sm:p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center">
            <Construction className="w-10 h-10 text-amber-400" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Chronicles is Under Development
          </h1>

          <p className="text-slate-400 mb-3 leading-relaxed">
            This game is not ready yet. The core systems are being built, but the experience isn't where it needs to be for players.
          </p>

          <p className="text-slate-500 text-sm mb-8">
            We'll open access when it's actually worth your time. No date to announce yet.
          </p>

          <Link href="/">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 px-8 py-5 text-base"
              data-testid="button-back-home"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Trust Layer
            </Button>
          </Link>
        </GlassCard>
      </motion.div>
    </div>
  );
}
