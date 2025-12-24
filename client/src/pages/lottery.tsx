import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowLeft, Ticket, Trophy, Clock, Users, Coins,
  Sparkles, Gift, Star, History, Zap
} from "lucide-react";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";

const JACKPOT = 1250000;
const TICKET_PRICE = 100;
const NEXT_DRAW = "2 days 14:32:08";

const PAST_WINNERS = [
  { draw: "#47", winner: "0x8F...3a2b", prize: 890000, date: "Dec 21, 2024" },
  { draw: "#46", winner: "0x2E...9c4d", prize: 756000, date: "Dec 14, 2024" },
  { draw: "#45", winner: "0xA1...7e8f", prize: 1120000, date: "Dec 7, 2024" },
];

const PRIZE_TIERS = [
  { match: "6 Numbers", prize: "Jackpot", odds: "1:13,983,816" },
  { match: "5 Numbers", prize: "50,000 DWC", odds: "1:55,492" },
  { match: "4 Numbers", prize: "1,000 DWC", odds: "1:1,032" },
  { match: "3 Numbers", prize: "100 DWC", odds: "1:57" },
  { match: "2 Numbers", prize: "10 DWC", odds: "1:8" },
];

function LotteryBall({ number, delay = 0 }: { number: number; delay?: number }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-lg shadow-lg"
    >
      {number}
    </motion.div>
  );
}

export default function Lottery() {
  const [tickets, setTickets] = useState(1);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [isQuickPick, setIsQuickPick] = useState(false);

  const quickPick = () => {
    const nums = new Set<number>();
    while (nums.size < 6) {
      nums.add(Math.floor(Math.random() * 49) + 1);
    }
    setSelectedNumbers(Array.from(nums).sort((a, b) => a - b));
    setIsQuickPick(true);
  };

  const toggleNumber = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else if (selectedNumbers.length < 6) {
      setSelectedNumbers([...selectedNumbers, num].sort((a, b) => a - b));
    }
    setIsQuickPick(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={darkwaveLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <Link href="/dashboard-pro">
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              <ArrowLeft className="w-3 h-3 mr-1" />
              Dashboard
            </Button>
          </Link>
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
                className="p-3 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30"
                animate={{ 
                  boxShadow: ["0 0 20px rgba(234,179,8,0.2)", "0 0 50px rgba(234,179,8,0.4)", "0 0 20px rgba(234,179,8,0.2)"],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Ticket className="w-7 h-7 text-yellow-400" />
              </motion.div>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
              DarkWave <span className="text-yellow-400">Lottery</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Weekly draws • Progressive jackpot • Provably fair
            </p>
          </motion.div>

          <GlassCard glow className="p-6 mb-6 text-center relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-amber-500/10"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="relative">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-medium text-yellow-400">CURRENT JACKPOT</span>
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </div>
              <motion.p
                className="text-5xl md:text-6xl font-bold font-mono bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {JACKPOT.toLocaleString()} DWC
              </motion.p>
              <p className="text-sm text-muted-foreground mt-2">≈ ${(JACKPOT * 0.152).toLocaleString()}</p>
              
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="text-center">
                  <Clock className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="font-mono text-lg">{NEXT_DRAW}</p>
                  <p className="text-xs text-muted-foreground">Next Draw</p>
                </div>
                <div className="text-center">
                  <Users className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="font-mono text-lg">12,847</p>
                  <p className="text-xs text-muted-foreground">Tickets Sold</p>
                </div>
              </div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <GlassCard className="p-4">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Ticket className="w-4 h-4 text-primary" />
                Pick Your Numbers
              </h3>
              
              <div className="grid grid-cols-7 gap-2 mb-4">
                {Array.from({ length: 49 }, (_, i) => i + 1).map((num) => (
                  <Button
                    key={num}
                    variant={selectedNumbers.includes(num) ? "default" : "outline"}
                    size="sm"
                    className={`w-full h-8 p-0 text-xs ${selectedNumbers.includes(num) ? "bg-gradient-to-r from-purple-500 to-pink-500" : ""}`}
                    onClick={() => toggleNumber(num)}
                    data-testid={`button-number-${num}`}
                  >
                    {num}
                  </Button>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 mb-4">
                {selectedNumbers.length > 0 ? (
                  selectedNumbers.map((num, i) => (
                    <LotteryBall key={num} number={num} delay={i * 0.1} />
                  ))
                ) : (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="w-12 h-12 rounded-full bg-white/10 border-2 border-dashed border-white/20 flex items-center justify-center text-muted-foreground">
                      ?
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-2 mb-4">
                <Button variant="outline" className="flex-1" onClick={quickPick} data-testid="button-quick-pick">
                  <Zap className="w-4 h-4 mr-2" />
                  Quick Pick
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setSelectedNumbers([])} data-testid="button-clear">
                  Clear
                </Button>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm">Tickets:</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setTickets(Math.max(1, tickets - 1))} data-testid="button-tickets-minus">-</Button>
                  <span className="w-8 text-center font-mono">{tickets}</span>
                  <Button variant="outline" size="sm" onClick={() => setTickets(tickets + 1)} data-testid="button-tickets-plus">+</Button>
                </div>
                <span className="text-muted-foreground">= {TICKET_PRICE * tickets} DWC</span>
              </div>

              <Button 
                className="w-full h-12 bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold"
                disabled={selectedNumbers.length !== 6}
                data-testid="button-buy-tickets"
              >
                <Ticket className="w-5 h-5 mr-2" />
                Buy {tickets} Ticket{tickets > 1 ? "s" : ""} for {TICKET_PRICE * tickets} DWC
              </Button>
            </GlassCard>

            <div className="space-y-4">
              <GlassCard className="p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  Prize Tiers
                </h3>
                <div className="space-y-2">
                  {PRIZE_TIERS.map((tier, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                      <div>
                        <p className="text-sm font-medium">{tier.match}</p>
                        <p className="text-xs text-muted-foreground">Odds: {tier.odds}</p>
                      </div>
                      <Badge className={i === 0 ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-black" : ""}>
                        {tier.prize}
                      </Badge>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <History className="w-4 h-4 text-primary" />
                  Past Winners
                </h3>
                <div className="space-y-2">
                  {PAST_WINNERS.map((winner, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[9px]">{winner.draw}</Badge>
                          <span className="text-xs font-mono">{winner.winner}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">{winner.date}</p>
                      </div>
                      <p className="font-mono text-green-400 text-sm">{winner.prize.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>

          <GlassCard className="p-4 text-center">
            <Gift className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <h3 className="font-bold mb-2">Hold DWC for Free Tickets!</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Stake 10,000+ DWC to receive 1 free lottery ticket every week.
              Diamond stakers get 5 free tickets!
            </p>
            <Link href="/staking">
              <Button variant="outline" data-testid="button-stake-now">
                <Star className="w-4 h-4 mr-2" />
                Start Staking
              </Button>
            </Link>
          </GlassCard>
        </div>
      </main>

      <Footer />
    </div>
  );
}
