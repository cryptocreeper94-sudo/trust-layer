import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Sparkles, Shield, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/glass-card";
import { useToast } from "@/hooks/use-toast";

const HANDOFF_CONTENT = `
================================================================================
                    DARKWAVE TRUST LAYER - ADMIN HANDOFF
                         Development Update Summary
================================================================================

Hey Team,

We're now in a solid position to really start getting people going. Here's a comprehensive breakdown of everything that's been added and is ready for launch:

--------------------------------------------------------------------------------
                         1. SUBSCRIPTION-GATED PREMIUM TOOLS
--------------------------------------------------------------------------------

Both AI trading tools are now protected by subscription gates:

PULSE PRO ($14.99/mo)
• AI-powered market intelligence with ML predictions
• Fear & Greed tracking and verified accuracy analytics
• Non-subscribers see premium upgrade screen with feature description
• Links to billing page for easy subscription

STRIKE AGENT ($30/mo)
• Solana memecoin sniper with AI risk scoring
• Honeypot detection and one-click Phantom wallet integration
• Subscription gate with upgrade call-to-action
• Premium features locked until subscribed

COMPLETE BUNDLE ($39.99/mo)
• Access to both Pulse Pro and Strike Agent
• Best value for power users

WHITELIST SYSTEM
• Admins and beta testers can bypass subscription gates
• Controlled via user whitelist in database

--------------------------------------------------------------------------------
                         2. THE TRANSMISSION (EXECUTIVE SUMMARY)
--------------------------------------------------------------------------------

The executive summary is now prominently featured as "The Transmission":

HEADER BUTTON
• Gradient cyan-to-purple button in main navigation bar
• Shows "The Transmission" on desktop, "Vision" on mobile
• Visible on every page via header

HAMBURGER MENU
• First item in "About" section with "Read" badge
• Easy access on mobile devices

CONTENT
• Trust Layer Vision explaining coordinated trust infrastructure
• Not positioned as cryptocurrency - it's verified intent transmission
• Complete whitepaper and ecosystem overview

--------------------------------------------------------------------------------
                         3. PRESALE IMPROVEMENTS
--------------------------------------------------------------------------------

FIXED STATS DISPLAY
• Presale stats now correctly show total raised ($20 currently)
• Fixed database column name (usd_amount_cents)
• Shows tokens sold, unique holders, and purchase count

AUTO-POPUP MODAL
• Buy modal automatically opens when visiting presale page
• Captures attention immediately during presale period
• Users can close and browse if they prefer

UPDATED MESSAGING
• Changed "Launching October 2026" to "Live Now"
• Removed specific TGE dates from copy
• Displays conversion rate and ROI potential

--------------------------------------------------------------------------------
                         4. PULSE AI TRADING INTELLIGENCE
--------------------------------------------------------------------------------

Pulse is our AI-powered market intelligence and prediction system:

PREDICTION TRACKING SERVICE
• Logs every market signal with SHA-256 hashing for blockchain verification
• Tracks BUY/SELL/HOLD/STRONG_BUY/STRONG_SELL signals with confidence levels
• Records full indicator snapshots: RSI, MACD, EMA (9/21/50/200), SMA, Bollinger Bands
• Multiple time horizons: 1h, 4h, 24h, 7d outcome tracking
• Accuracy statistics calculated per ticker and globally
• Immutable proof via Trust Layer stamping

SAFETY ENGINE SERVICE
• Full Solana token safety analysis
• Authority checks: Mint Authority, Freeze Authority detection
• Liquidity safety: Lock detection, LP burn verification
• Honeypot detection: Simulated buy/sell to detect traps
• Creator analysis: Previous tokens, rug count, success rate, risk score
• Holder distribution: Top 10 holders %, total holder count
• Safety grades: A through F with detailed risk warnings

--------------------------------------------------------------------------------
                         5. STRIKE AGENT TRACKING SYSTEM
--------------------------------------------------------------------------------

Strike Agent is our autonomous trading signal tracker for memecoin/new token analysis:

FEATURES
• Tracks AI recommendations: SNIPE, WATCH, AVOID
• Full token metrics: price, market cap, liquidity, holder count
• Safety metrics integration: bot %, bundle %, top 10 holders %
• Movement metrics: price change %, volume multiplier, trades/minute
• Authority flags: Mint Authority, Freeze Authority, Honeypot detection
• Pump.fun token identification

OUTCOME TRACKING
• Automatic price checks at 1h, 4h, 24h, 7d intervals
• Outcome classification: MOON (500%+), PUMP (50%+), SIDEWAYS, RUG (-50%+)
• Hit tracking: 2x, 5x, 10x gains
• Rug detection: liquidity drain, token death

--------------------------------------------------------------------------------
                    6. TRUST LAYER MEMBERSHIP & TRUST CARDS
--------------------------------------------------------------------------------

The Trust Layer membership system is live with downloadable Trust Cards:

TRUST CARDS (BETA)
• Unique Trust Number assigned to each member (format: TL-XXXXXX)
• Beautiful SVG cards with gradient design and QR code
• QR code embedded directly in downloadable SVG
• Blockchain-anchored: Each card creation logged to Trust Layer chain
• Data hash verification for authenticity
• Transaction counter with atomic locking (FOR UPDATE)

MEMBER TIERS
• Pioneer (Individual - Free)
• Guardian (Individual - Premium)
• Startup (Business)
• Professional (Business)
• Enterprise (Business)

BETA LABELS & DYOR DISCLAIMERS
• All Trust Cards display "BETA" badge prominently
• DYOR (Do Your Own Research) warning on cards
• Trust Layer page includes disclaimer about beta status
• "Participate at your own risk" language included
• Clear communication that features are in development

TECHNICAL IMPLEMENTATION
• Database table: memberTrustCards with all fields
• Atomic transaction wrapping for card creation
• Counter locked with FOR UPDATE to prevent race conditions
• Trust Layer hash submission for immutability
• QR code SVG stored for instant retrieval

--------------------------------------------------------------------------------
                      4. BLOCKCHAIN ENGINE (400ms BLOCKS)
--------------------------------------------------------------------------------

The Trust Layer is running at impressive speed:

• Block time: 400ms (2.5 blocks per second)
• BFT-PoA consensus with stake-weighted validator selection
• SHA-256 hashing with Merkle tree verification
• Epoch-based finality
• Native asset: Signal (SIG) - Trust Network Access
• NOT positioned as cryptocurrency - it's verified intent transmission

--------------------------------------------------------------------------------
                         8. INFRASTRUCTURE READY
--------------------------------------------------------------------------------

Everything is published and ready:

✅ Subscription gating active for Pulse Pro & Strike Agent
✅ "The Transmission" button prominent in header
✅ Presale stats displaying correctly ($20 raised)
✅ Presale modal auto-opens for maximum conversion
✅ 21 documents in Doc Hub (more than required 16)
✅ Pulse AI services loaded and operational
✅ Strike Agent tracking database schema deployed
✅ Trust Card creation API with blockchain anchoring
✅ Safety Engine with full Solana token analysis
✅ Hallmark genesis verification system operational
✅ All BETA labels and disclaimers in place
✅ App published and accessible

--------------------------------------------------------------------------------
                         NEXT STEPS - LET'S GO!
--------------------------------------------------------------------------------

We're ready to:
1. Start onboarding early adopters to the Trust Layer
2. Drive subscriptions to Pulse Pro and Strike Agent
3. Promote "The Transmission" as the vision document
4. Issue Trust Cards to founding members
5. Maximize presale conversions with auto-popup modal
6. Begin collecting prediction data for ML training

The foundation is solid. Let's start bringing people in!

Best,
Development Team

================================================================================
                          END OF HANDOFF DOCUMENT
================================================================================
`.trim();


const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

export default function AdminHandoff() {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(HANDOFF_CONTENT);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Handoff document copied to clipboard",
      });
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please select and copy manually",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden pt-20 pb-12" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #3b82f6)" size={500} top="-5%" left="60%" />
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={400} top="40%" left="-10%" delay={3} />
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Shield className="w-10 h-10 text-purple-400" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Admin Handoff Document
            </h1>
            <Sparkles className="w-10 h-10 text-pink-400" />
          </div>
          <p className="text-slate-400 text-lg">
            Complete development update summary - one click to copy everything
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard glow className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-cyan-400" />
                <span className="text-lg font-semibold text-white">Handoff Content</span>
              </div>
              <Button
                onClick={copyToClipboard}
                size="lg"
                className={`${
                  copied
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                } text-white font-semibold transition-all duration-300`}
                data-testid="button-copy-handoff"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 mr-2" />
                    Copy All
                  </>
                )}
              </Button>
            </div>

            <div
              className="bg-slate-900/80 rounded-lg p-4 max-h-[600px] overflow-y-auto border border-purple-500/20"
              data-testid="text-handoff-content"
            >
              <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                {HANDOFF_CONTENT}
              </pre>
            </div>

            <p className="text-center text-slate-500 text-sm">
              Click the "Copy All" button above to copy the entire document to your clipboard
            </p>
</motion.div>
    </div>
    </div>
  );
}
