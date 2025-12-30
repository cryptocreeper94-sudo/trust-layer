import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, FileText, Gift, AlertTriangle, Check, HelpCircle, Mail, MapPin, Clock, Coins, Sparkles, Scale, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export default function SweepstakesRules() {
  const [, navigate] = useLocation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f] text-white">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <BackButton />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-200 via-pink-300 to-purple-200 bg-clip-text text-transparent flex items-center gap-2">
              <Scale className="w-8 h-8 text-purple-400" />
              Official Sweepstakes Rules
            </h1>
            <p className="text-gray-400 text-sm">Last Updated: December 25, 2024</p>
          </div>
        </div>

        {/* Important Notice Banner */}
        <Card className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-purple-500/30 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/30 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-purple-300 mb-2">NO PURCHASE NECESSARY</h2>
                <p className="text-gray-300">
                  DarkWave Games operates as a sweepstakes platform. You can obtain Sweeps Coins (SC) for free 
                  through our Alternative Method of Entry (AMOE). A purchase will not increase your chances of winning.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Currency Explanation */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card className="bg-black/40 border-yellow-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Coins className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-yellow-400">Gold Coins (GC)</h3>
                  <Badge variant="outline" className="bg-yellow-500/10 border-yellow-500/30 text-yellow-400">
                    Virtual Currency
                  </Badge>
                </div>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  Used for entertainment purposes only
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  Cannot be redeemed for prizes
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  Included FREE with coin pack purchases
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  Available via daily bonuses
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-400">Sweeps Coins (SC)</h3>
                  <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-400">
                    Promotional Entries
                  </Badge>
                </div>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  Redeemable for DWC cryptocurrency
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  1 SC = 1 DWC redemption rate
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  Minimum 100 SC to redeem
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  Available FREE via AMOE or as bonus
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* AMOE Section */}
        <Card className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-green-500/30 mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-green-400 flex items-center gap-2">
              <Gift className="w-6 h-6" />
              Alternative Method of Entry (AMOE)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              You can receive FREE Sweeps Coins without making any purchase by using one of the following methods:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-black/30 rounded-xl p-4 border border-green-500/20">
                <h4 className="font-bold text-green-400 mb-2 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Mail-In Request
                </h4>
                <p className="text-sm text-gray-300 mb-3">
                  Send a handwritten request on a 4"x6" postcard to:
                </p>
                <address className="text-sm text-gray-400 not-italic bg-black/30 rounded-lg p-3">
                  DarkWave Studios, LLC<br />
                  AMOE Department<br />
                  [Address to be provided]<br />
                  Tennessee, USA
                </address>
                <p className="text-xs text-gray-500 mt-3">
                  Include your full name, email address registered with DarkWave Games, 
                  date of birth, and the words "SC Request".
                </p>
                <Badge variant="outline" className="mt-3 bg-green-500/10 border-green-500/30 text-green-400">
                  Receive 10 SC per valid request
                </Badge>
              </div>
              
              <div className="bg-black/30 rounded-xl p-4 border border-green-500/20">
                <h4 className="font-bold text-green-400 mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Daily Bonus
                </h4>
                <p className="text-sm text-gray-300 mb-3">
                  Log in daily to claim your free bonus coins:
                </p>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li className="flex justify-between">
                    <span>Day 1:</span>
                    <span className="text-green-400">0.5 SC + 100 GC</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Day 7 (Max Streak):</span>
                    <span className="text-green-400">5 SC + 2,000 GC</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => navigate("/daily-bonus")}
                  className="w-full mt-4 bg-green-600 hover:bg-green-500"
                >
                  Claim Daily Bonus
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Full Rules Accordion */}
        <Card className="bg-black/40 border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-purple-400 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Complete Official Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="space-y-2">
              <AccordionItem value="eligibility" className="border-white/10">
                <AccordionTrigger className="text-left hover:no-underline">
                  1. Eligibility Requirements
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 space-y-3">
                  <p>To participate in DarkWave Games Sweepstakes, you must:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Be at least 18 years of age (or the age of majority in your jurisdiction)</li>
                    <li>Be a legal resident of an eligible U.S. state or territory</li>
                    <li>Have a valid DarkWave Games account</li>
                    <li>Not be an employee, contractor, or immediate family member of DarkWave Studios, LLC</li>
                  </ul>
                  <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 mt-4">
                    <p className="text-red-300 text-sm flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      Residents of the following states are NOT eligible: Washington (WA), Idaho (ID), Montana (MT), 
                      Nevada (NV), and any other jurisdiction where sweepstakes are prohibited by law.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="how-to-play" className="border-white/10">
                <AccordionTrigger className="text-left hover:no-underline">
                  2. How to Play
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 space-y-3">
                  <p><strong>Gold Coins (GC):</strong> GC are virtual coins used for entertainment purposes only. 
                  They have no monetary value and cannot be redeemed for prizes. GC are included FREE with every 
                  coin pack purchase and through daily bonuses.</p>
                  
                  <p><strong>Sweeps Coins (SC):</strong> SC are promotional entries that can be used to play games. 
                  SC winnings can be redeemed for DWC cryptocurrency at a rate of 1 SC = 1 DWC.</p>
                  
                  <p><strong>Games:</strong> All games are games of chance. The odds of winning depend on the 
                  specific game mechanics. No skill is involved in determining outcomes. All results are 
                  determined by a provably fair random number generator (RNG).</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="redemption" className="border-white/10">
                <AccordionTrigger className="text-left hover:no-underline">
                  3. Redemption Process
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 space-y-3">
                  <p>To redeem your SC winnings for DWC cryptocurrency:</p>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Accumulate a minimum of 100 SC in your account</li>
                    <li>Complete identity verification (KYC) as required by law</li>
                    <li>Submit a redemption request through your account</li>
                    <li>Receive DWC to your connected wallet within 3-5 business days</li>
                  </ol>
                  <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3 mt-4">
                    <p className="text-yellow-300 text-sm flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      DarkWave Studios, LLC reserves the right to request additional verification 
                      and to deny redemption requests that violate these rules.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="prohibited" className="border-white/10">
                <AccordionTrigger className="text-left hover:no-underline">
                  4. Prohibited Activities
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 space-y-3">
                  <p>The following activities are strictly prohibited and may result in account termination:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Creating multiple accounts</li>
                    <li>Using VPNs or proxies to circumvent geographic restrictions</li>
                    <li>Exploiting bugs or glitches in games</li>
                    <li>Colluding with other players</li>
                    <li>Using automated software or bots</li>
                    <li>Selling or transferring accounts or coins</li>
                    <li>Any form of fraud or misrepresentation</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="fairness" className="border-white/10">
                <AccordionTrigger className="text-left hover:no-underline">
                  5. Provably Fair Gaming
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 space-y-3">
                  <p>All DarkWave Games use a provably fair system:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Game outcomes are determined by cryptographic random number generation</li>
                    <li>Server seeds are hashed and provided to players before each game</li>
                    <li>Players can verify the fairness of any game result</li>
                    <li>No manipulation of outcomes is possible by the operator or players</li>
                  </ul>
                  <p className="mt-3">
                    House edge varies by game and is clearly disclosed on each game page.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="taxes" className="border-white/10">
                <AccordionTrigger className="text-left hover:no-underline">
                  6. Tax Obligations
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 space-y-3">
                  <p>
                    Winners are responsible for all applicable taxes on prizes. DarkWave Studios, LLC 
                    will issue tax documentation (Form 1099 or equivalent) for prizes valued at $600 
                    or more within a calendar year, as required by U.S. law.
                  </p>
                  <p>
                    Consult a tax professional for guidance on your specific tax obligations.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="disputes" className="border-white/10">
                <AccordionTrigger className="text-left hover:no-underline">
                  7. Dispute Resolution
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 space-y-3">
                  <p>
                    Any disputes arising from participation in DarkWave Games shall be resolved through 
                    binding arbitration in accordance with the rules of the American Arbitration Association. 
                    The arbitration shall take place in the State of Tennessee. Participants waive the 
                    right to participate in class action lawsuits.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="changes" className="border-white/10">
                <AccordionTrigger className="text-left hover:no-underline">
                  8. Rule Modifications
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 space-y-3">
                  <p>
                    DarkWave Studios, LLC reserves the right to modify, suspend, or terminate the 
                    sweepstakes program at any time without prior notice. In the event of termination, 
                    outstanding SC balances may be redeemed within 30 days of the announcement.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="bg-black/40 border-white/10 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-bold text-purple-400">Questions?</h3>
            </div>
            <p className="text-gray-300 mb-4">
              For questions about these rules or the sweepstakes program, please contact:
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="mailto:support@darkwavestudios.io" 
                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Mail className="w-4 h-4" />
                support@darkwavestudios.io
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Sponsor */}
        <div className="text-center text-gray-500 text-sm pb-8">
          <p className="mb-2">
            <strong>Sponsor:</strong> DarkWave Studios, LLC<br />
            Tennessee, United States
          </p>
          <p>
            By participating in DarkWave Games, you agree to be bound by these Official Rules 
            and the decisions of DarkWave Studios, LLC, which are final and binding in all respects.
          </p>
        </div>
      </div>
    </div>
  );
}
