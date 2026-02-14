import { motion } from "framer-motion";
import { FileText, Shield, AlertTriangle, Coins, ArrowRightLeft, Clock, Scale } from "lucide-react";

import { GlassCard } from "@/components/glass-card";

export default function VirtualCurrencyTerms() {
  const lastUpdated = "Current Version";
  const tosVersion = "1.0.0";
  
  const sections = [
    {
      icon: Coins,
      title: "1. Virtual Currency Definition",
      content: `"Shells" are a virtual currency used within the Trust Layer ecosystem, including Chronicles, ChronoChat, and related applications. Shells have no intrinsic value outside the Trust Layer platform and are not legal tender, securities, or commodities. Shells are licensed, not sold, and remain the property of Trust Layer Studios. Your purchase grants you a limited, non-transferable license to use Shells within our platform.`
    },
    {
      icon: ArrowRightLeft,
      title: "2. Signal (SIG) Conversion",
      content: `At mainnet launch, Signal (SIG) will launch as the native cryptocurrency of Trust Layer. All Shells in your account will be eligible for conversion to SIG at a rate of 100 Shells = 1 SIG. This conversion rate is fixed and guaranteed for all Shells purchased before launch. After conversion, Shells will no longer be available as SIG will serve as the primary currency. You acknowledge that SIG is a cryptocurrency subject to market volatility, and its value may fluctuate significantly after launch.`
    },
    {
      icon: AlertTriangle,
      title: "3. Purchase Terms & Refunds",
      content: `All Shell purchases are final and non-refundable except as required by applicable law. Purchases are processed through Stripe's secure payment platform. By completing a purchase, you confirm that you are of legal age in your jurisdiction and authorized to use the payment method. We reserve the right to limit purchase amounts and refuse transactions at our discretion. Promotional bonuses and discounts are subject to terms specified at time of offer and may be revoked if obtained fraudulently.`
    },
    {
      icon: Shield,
      title: "4. Custody & Security",
      content: `Your Shells are linked to your Trust Layer account and secured by your account credentials. You are responsible for maintaining the security of your account. Trust Layer is not liable for unauthorized access resulting from your failure to secure your credentials. We employ industry-standard security measures but cannot guarantee absolute security. In the event of a security breach, we will notify affected users as required by law.`
    },
    {
      icon: Scale,
      title: "5. Risk Disclosures",
      content: `IMPORTANT: Virtual currencies and cryptocurrencies involve significant risks including but not limited to: (a) complete loss of value; (b) high price volatility; (c) regulatory changes that may affect legality or usability; (d) technical failures, bugs, or security vulnerabilities; (e) network congestion or downtime; (f) changes to the Trust Layer platform or services. Past performance does not guarantee future results. You should only purchase what you can afford to lose entirely. This is not financial advice.`
    },
    {
      icon: FileText,
      title: "6. Crypto Payment Onboarding",
      content: `Trust Layer uses Stripe for crypto payment processing. When using cryptocurrency payments, you agree to Stripe's terms of service and acknowledge that: (a) you may be subject to identity verification (KYC); (b) certain jurisdictions may be restricted; (c) crypto transactions may be considered taxable events in your jurisdiction - consult a tax professional; (d) transaction fees may apply; (e) processing times may vary based on network conditions.`
    },
    {
      icon: Clock,
      title: "7. Service Availability",
      content: `Shell purchases and usage depend on the availability of Trust Layer services. We do not guarantee uninterrupted access. Scheduled maintenance, updates, or unforeseen issues may temporarily affect your ability to purchase or use Shells. We will make reasonable efforts to provide advance notice of scheduled downtime.`
    },
    {
      icon: AlertTriangle,
      title: "8. Regulatory Compliance",
      content: `You acknowledge that cryptocurrency and virtual currency regulations vary by jurisdiction and may change. You are solely responsible for complying with applicable laws in your jurisdiction. Trust Layer reserves the right to restrict or terminate services in any jurisdiction due to regulatory requirements. Users in prohibited jurisdictions are not permitted to use our services.`
    },
    {
      icon: Scale,
      title: "9. Dispute Resolution",
      content: `Any disputes arising from these terms or your use of Shells shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. You waive your right to participate in class action lawsuits. The arbitrator's decision shall be final and binding. This agreement shall be governed by the laws of the State of Delaware, USA.`
    },
    {
      icon: FileText,
      title: "10. Modifications",
      content: `Trust Layer may modify these terms at any time. Material changes will be communicated through the platform and/or email at least 30 days before taking effect. Continued use of Shell purchasing or services after modifications constitute acceptance. If you disagree with changes, you should cease using our services. Your existing Shell balance will remain subject to the terms at time of purchase.`
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent" data-testid="text-vc-terms-title">
                <Coins className="w-8 h-8 text-cyan-400" />
                Virtual Currency Terms
              </h1>
              <p className="text-gray-400" data-testid="text-last-updated">Last updated: {lastUpdated} • Version {tosVersion}</p>
            </div>
          </div>

          <GlassCard className="p-6 border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-purple-500/5" glow data-testid="card-dwc-conversion-notice">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-cyan-500/20">
                <ArrowRightLeft className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-semibold text-cyan-400 text-lg">SIG Conversion Promise</h3>
                <p className="text-gray-300 mt-1">
                  All Shells purchased before launch will convert to Signal (SIG) at a guaranteed rate of <span className="text-cyan-400 font-bold">100 Shells = 1 SIG</span>. Your purchase history is permanently recorded and your conversion eligibility is guaranteed.
                </p>
              </div>
            </div>
<GlassCard className="p-6 border-yellow-500/30 bg-yellow-500/5" data-testid="card-risk-warning">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-500 text-lg">Important Risk Warning</h3>
                <p className="text-gray-300 text-sm mt-1">
                  Virtual currencies and cryptocurrencies are highly speculative and involve substantial risk. 
                  The value of SIG after launch is not guaranteed and may fluctuate significantly. 
                  Only purchase what you can afford to lose. This is not investment advice.
                </p>
              </div>
            </div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassCard className="p-4 flex items-center gap-3" data-testid="card-stripe-secure">
              <Shield className="w-8 h-8 text-cyan-400" />
              <div>
                <h3 className="font-semibold text-white">Stripe Secure</h3>
                <p className="text-xs text-gray-400">PCI-compliant payments</p>
              </div>
<GlassCard className="p-4 flex items-center gap-3" data-testid="card-conversion-tracked">
              <FileText className="w-8 h-8 text-purple-400" />
              <div>
                <h3 className="font-semibold text-white">Tracked Forever</h3>
                <p className="text-xs text-gray-400">Full audit trail on purchases</p>
              </div>
<GlassCard className="p-4 flex items-center gap-3" data-testid="card-guaranteed-rate">
              <Coins className="w-8 h-8 text-pink-400" />
              <div>
                <h3 className="font-semibold text-white">Guaranteed Rate</h3>
                <p className="text-xs text-gray-400">100 Shells = 1 SIG</p>
              </div>
</div>

          <div className="space-y-6">
            {sections.map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <GlassCard className="p-6" data-testid={`card-section-${idx + 1}`}>
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex-shrink-0">
                      <section.icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold mb-3 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{section.title}</h2>
                      <p className="text-gray-300 text-sm leading-relaxed">{section.content}</p>
                    </div>
                  </div>
</motion.div>
            ))}
          </div>

          <GlassCard className="p-6 border-cyan-500/20" data-testid="card-contact">
            <h3 className="font-semibold text-cyan-400 mb-2">Questions About These Terms?</h3>
            <p className="text-gray-300 text-sm">
              For questions about virtual currency purchases, SIG conversion, or these terms, 
              please contact us at <a href="mailto:legal@darkwavestudios.io" className="text-cyan-400 hover:underline">legal@darkwavestudios.io</a>
            </p>
<div className="text-center text-gray-500 text-xs pb-8">
            <p>By purchasing Shells or using our virtual currency services, you agree to these terms.</p>
            <p className="mt-1">DarkWave Studios © 2024-2026. All rights reserved.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
