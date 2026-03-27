import { motion } from "framer-motion";
import { Heart, Shield, Users, Copy, Check } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";

const facebookPost = `Hey there,

My name is Jason, and I lead the team behind Trust Layer. I want to have an honest conversation with you — the kind I wish someone had with me years ago.

I UNDERSTAND YOUR SKEPTICISM

Truly, I do. And I don't blame you one bit.

Over the past decade, I've personally lost well over $50,000 in this space. Probably more if I'm being honest. Pump and dumps. Straight-up app scams with beautiful websites and big promises. A market that seems to have an almost supernatural ability to move against you the exact moment you buy in.

If you've been in crypto for any length of time, you probably have similar stories. The wounds are real. The distrust is earned.

That's exactly why we're building this.

WHY WE CALL IT "SIGNAL" — NOT A COIN, NOT A TOKEN

You'll notice we don't call it a "coin" or "token" or "currency." That's very intentional.

Those words have been weaponized. They carry hidden meanings that affect you subconsciously — promises of spending power that never materializes, utility that's always "coming soon," cycles of hype followed by silence. Language has become a tool of manipulation.

How many times have you heard "just wait, you'll see" only to wait... and wait... and nothing ever happens?

We call it Signal because a signal is something pure. It can't be twisted. It can't be demonized. It can't be used against you with clever psychology. A signal simply IS — a transmission of verified intent within a trusted network.

WHAT WE'RE ACTUALLY BUILDING

We're not promising you'll get rich. We're not selling you a dream of easy money.

We're building real infrastructure. Real software. Real tools that real businesses can use. And instead of telling you to wait, we're making strides DAILY to actually show you progress.

Trust Layer is a Trusted Network — a place where seeing another member means you're on the same team. A community of builders and people who are just tired of the way things have been.

AN INVITATION, NOT A SALES PITCH

We're not asking you to throw money at us blindly. We're asking you to stick around. Watch what we do. Join the community. See for yourself whether our actions match our words.

That's how trust is built — not with promises, but with consistent action.

It's nice to meet you. We're genuinely glad you're here.

— Jason & The Trust Layer Team

Read the full letter: https://dwsc.io/note
Join the community: https://dwsc.io/community

#DarkWave #TrustNetwork #Signal #Blockchain #Web3 #Community #Builders #CryptoRecovery #RealTalk #TrustLayer #DecentralizedTrust #BlockchainCommunity #CryptoSkepticism #HonestCrypto #NoMoreScams`;

import fantasyWorld from "@assets/generated_images/fantasy_sci-fi_world_landscape.jpg";

export default function DevelopersNote() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(facebookPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img src={fantasyWorld} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/90 to-slate-950" />
      </div>
      
      <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6"
            >
              <Heart className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-300">A Personal Message</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                A Note From Our Team
              </span>
            </h1>
          </div>
          
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 md:p-12 shadow-2xl">
            <div className="prose prose-invert max-w-none">
              <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-6">
                Hey there,
              </p>
              
              <p className="text-white/80 leading-relaxed mb-6">
                My name is Jason, and I lead the team behind Trust Layer. Before you go any further, I want to have an honest conversation with you — the kind of conversation I wish someone had with me years ago.
              </p>
              
              <h3 className="text-xl font-semibold text-cyan-400 mt-8 mb-4">I Understand Your Skepticism</h3>
              
              <p className="text-white/80 leading-relaxed mb-6">
                Truly, I do. And I don't blame you one bit.
              </p>
              
              <p className="text-white/80 leading-relaxed mb-6">
                Over the past decade, I've personally lost well over $50,000 in this space. Probably more if I'm being completely honest. Pump and dumps that seemed so promising. Straight-up app scams with beautiful websites and big promises. A market that seems to have an almost supernatural ability to move against you the exact moment you buy in. The timing always felt like more than coincidence.
              </p>
              
              <p className="text-white/80 leading-relaxed mb-6">
                If you've been in crypto for any length of time, you probably have similar stories. Maybe worse. The wounds are real. The distrust is earned. Every new project that pops up feels like another potential trap — because honestly, most of them are.
              </p>
              
              <p className="text-white/80 leading-relaxed mb-6">
                So when you look at Trust Layer and feel that familiar hesitation, that voice in your head saying "here we go again" — I get it. I've felt that same thing a hundred times.
              </p>
              
              <p className="text-white/80 leading-relaxed mb-6">
                <strong className="text-purple-400">That's exactly why we're building this.</strong>
              </p>

              <h3 className="text-xl font-semibold text-purple-400 mt-10 mb-4">Why We Call It "Signal" — Not a Coin, Not a Token</h3>
              
              <p className="text-white/80 leading-relaxed mb-6">
                You'll notice we don't call it a "coin" or "token" or "currency." That's very intentional.
              </p>
              
              <p className="text-white/80 leading-relaxed mb-6">
                Those words have been weaponized. They carry hidden meanings that affect you subconsciously — promises of spending power that never materializes, utility that's always "coming soon," cycles of hype followed by silence. Language has become a tool of manipulation in this space. Words are chosen carefully to trigger your hope, your greed, your fear of missing out.
              </p>
              
              <p className="text-white/80 leading-relaxed mb-6">
                How many times have you heard "just wait, you'll see" only to wait... and wait... and nothing ever happens? The roadmap keeps getting pushed. The utility never arrives. The community dies. And you're left holding something worthless, wondering why you fell for it again.
              </p>
              
              <p className="text-white/80 leading-relaxed mb-6">
                We call it <strong className="text-cyan-400">Signal</strong> because a signal is something pure. A signal can't be twisted. It can't be demonized. It can't be used against you with clever marketing psychology or reverse psychology tricks. A signal simply <em>is</em> — a transmission of verified intent within a trusted network.
              </p>
              
              <p className="text-white/80 leading-relaxed mb-6">
                We're breaking the pattern. We're rejecting the manipulative language that this industry uses to extract money from regular people. Signal represents access to a trust network, participation in something real, and proof that you're part of a community that actually builds things.
              </p>

              <h3 className="text-xl font-semibold text-purple-400 mt-10 mb-4">What We're Actually Building</h3>
              
              <p className="text-white/80 leading-relaxed mb-6">
                We're not promising you'll get rich. We're not selling you a dream of easy money. We're not going to tell you to "just wait" while we work on things behind closed doors.
              </p>
              
              <p className="text-white/80 leading-relaxed mb-6">
                We're building real infrastructure. Real software. Real tools that real businesses can use. Every piece connects. And instead of telling you to wait, we're making strides <em>daily</em> to actually show you progress. You can watch it happen. You can see the commits, the updates, the growth. 
              </p>
              
              <p className="text-white/80 leading-relaxed mb-6">
                Trust Layer is a <strong className="text-purple-400">Trusted Network</strong> — a place where seeing another member means you're on the same team. Where we're all here to genuinely help each other succeed instead of trying to exploit each other for quick gains. A community of builders, creators, and people who are just tired of the way things have been.
              </p>
              
              <p className="text-white/80 leading-relaxed mb-6">
                We want to create something where trust actually means something. Where your participation matters. Where the people at the top aren't there to drain value from the people at the bottom — because we're all building this together.
              </p>

              <h3 className="text-xl font-semibold text-pink-400 mt-10 mb-4">An Invitation, Not a Sales Pitch</h3>
              
              <p className="text-white/80 leading-relaxed mb-6">
                We're not asking you to throw money at us blindly. We're not trying to create urgency or fear of missing out. 
              </p>
              
              <p className="text-white/80 leading-relaxed mb-6">
                We're asking you to stick around. Watch what we do. Join the community. Become part of this. See for yourself whether our actions match our words over time. That's how trust is built — not with promises, but with consistent action.
              </p>
              
              <div className="my-8 p-6 rounded-xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-white/10">
                <p className="text-white/90 text-lg italic mb-0">
                  "We're trying to build something better than what's out there. More honest. More fair. A network where trust actually means something. Where seeing another member means you're on the same team."
                </p>
              </div>
              
              <p className="text-white/80 leading-relaxed mb-6">
                So from all of us here at Trust Layer — it's nice to meet you. We're genuinely glad you're here, whether you decide to participate or just watch from the sidelines for now. Either way, you're welcome.
              </p>
              
              <p className="text-white/80 leading-relaxed mb-8">
                Join the family. Let's all benefit together and build something that actually matters.
              </p>
              
              <p className="text-cyan-400 font-medium text-lg">
                — Jason & The Trust Layer Team
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Share on Social Media</h3>
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="sm"
                  className={`gap-2 transition-all ${copied ? 'bg-green-500/20 border-green-500 text-green-400' : 'border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10'}`}
                  data-testid="button-copy-post"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy to Clipboard
                    </>
                  )}
                </Button>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-white/10">
                <pre className="text-white/70 text-sm whitespace-pre-wrap font-sans leading-relaxed">{facebookPost}</pre>
              </div>
            </GlassCard>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <Link href="/community">
              <GlassCard className="p-6 text-center cursor-pointer hover:border-cyan-500/50 transition-all group">
                <Users className="w-8 h-8 text-cyan-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-white mb-1">Join Community</h3>
                <p className="text-sm text-white/60">Connect with the family</p>
              </GlassCard>
            </Link>
            
            <Link href="/crowdfund">
              <GlassCard className="p-6 text-center cursor-pointer hover:border-purple-500/50 transition-all group">
                <Heart className="w-8 h-8 text-purple-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-white mb-1">Support Development</h3>
                <p className="text-sm text-white/60">Help us build this</p>
              </GlassCard>
            </Link>
            
            <Link href="/presale">
              <GlassCard className="p-6 text-center cursor-pointer hover:border-pink-500/50 transition-all group">
                <Shield className="w-8 h-8 text-pink-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-white mb-1">Get Signal</h3>
                <p className="text-sm text-white/60">Join the Trust Network</p>
              </GlassCard>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
