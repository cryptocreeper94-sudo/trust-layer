import { motion } from "framer-motion";
import { ArrowLeft, Shield, Eye, Lock, Database, Globe, Mail } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/glass-card";

export default function Privacy() {
  const lastUpdated = "December 24, 2024";
  
  const dataPoints = [
    { icon: Globe, title: "IP Address", description: "For security and rate limiting" },
    { icon: Database, title: "Wallet Addresses", description: "For blockchain transactions" },
    { icon: Eye, title: "Usage Analytics", description: "To improve our services" },
    { icon: Mail, title: "Email (optional)", description: "For notifications if subscribed" },
  ];

  const sections = [
    {
      title: "1. Information We Collect",
      content: `We collect information you provide directly, such as wallet addresses, email addresses (if provided), and API key registrations. We also automatically collect certain information including IP addresses, browser type, device information, and usage patterns through cookies and similar technologies.`
    },
    {
      title: "2. Blockchain Data",
      content: `All blockchain transactions are publicly visible on the DarkWave Smart Chain. This includes transaction hashes, wallet addresses, amounts, and timestamps. This data is immutable and cannot be deleted. We recommend using separate wallets for privacy-sensitive activities.`
    },
    {
      title: "3. How We Use Information",
      content: `We use collected information to: (a) provide and maintain our Services; (b) process transactions and staking rewards; (c) send notifications and updates (with consent); (d) detect and prevent fraud and abuse; (e) improve our platform; (f) comply with legal obligations.`
    },
    {
      title: "4. Information Sharing",
      content: `We do not sell your personal information. We may share information with: (a) service providers who assist in operating our platform; (b) law enforcement when legally required; (c) in connection with a merger or acquisition; (d) with your consent.`
    },
    {
      title: "5. Cookies & Tracking",
      content: `We use cookies and similar technologies for authentication, preferences, and analytics. Essential cookies are required for the platform to function. You can manage cookie preferences in your browser settings, though some features may not work properly without them.`
    },
    {
      title: "6. Data Security",
      content: `We implement industry-standard security measures including encryption, secure protocols, and regular security audits. However, no system is completely secure. You are responsible for maintaining the security of your wallet and private keys.`
    },
    {
      title: "7. Data Retention",
      content: `We retain data for as long as necessary to provide our Services and comply with legal obligations. Blockchain data is permanent. Account data is retained for 3 years after account closure. You can request deletion of off-chain personal data.`
    },
    {
      title: "8. Your Rights",
      content: `Depending on your jurisdiction, you may have rights to: (a) access your personal data; (b) correct inaccurate data; (c) delete personal data (except blockchain data); (d) object to certain processing; (e) data portability; (f) withdraw consent.`
    },
    {
      title: "9. International Transfers",
      content: `Your data may be processed in countries other than your own. We ensure appropriate safeguards are in place for international data transfers in compliance with applicable laws.`
    },
    {
      title: "10. Children's Privacy",
      content: `Our Services are not intended for users under 18 years of age. We do not knowingly collect personal information from children. If we learn we have collected such information, we will delete it promptly.`
    },
    {
      title: "11. Third-Party Links",
      content: `Our platform may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to read their privacy policies.`
    },
    {
      title: "12. Changes to This Policy",
      content: `We may update this Privacy Policy periodically. Material changes will be communicated through the platform or via email (if provided). Continued use after changes constitutes acceptance of the updated policy.`
    },
    {
      title: "13. Contact Us",
      content: `For privacy-related inquiries, data access requests, or concerns, please contact our Privacy Team at privacy@darkwavestudios.io`
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-display font-bold flex items-center gap-3" data-testid="text-privacy-title">
                <Shield className="w-8 h-8 text-primary" />
                Privacy Policy
              </h1>
              <p className="text-muted-foreground" data-testid="text-last-updated">Last updated: {lastUpdated}</p>
            </div>
          </div>

          <GlassCard className="p-6 border-primary/20" data-testid="card-privacy-commitment">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-primary">Our Privacy Commitment</h3>
                <p className="text-sm text-muted-foreground">
                  DarkWave Studios is committed to protecting your privacy. This policy explains how we 
                  collect, use, and safeguard your information when you use DarkWave Smart Chain.
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6" data-testid="card-data-collected">
            <h2 className="text-lg font-semibold mb-4">Data We Collect</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {dataPoints.map((item, idx) => (
                <div key={idx} className="text-center p-4 bg-black/20 rounded-lg" data-testid={`data-point-${idx}`}>
                  <item.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="text-sm font-medium">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <div className="space-y-6">
            {sections.map((section, idx) => (
              <GlassCard key={idx} className="p-6" data-testid={`card-section-${idx + 1}`}>
                <h2 className="text-lg font-semibold mb-3 text-primary">{section.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{section.content}</p>
              </GlassCard>
            ))}
          </div>

          <div className="text-center text-sm text-muted-foreground py-8" data-testid="text-footer">
            <p>DarkWave Smart Chain - DarkWave Studios</p>
            <p>Privacy inquiries: privacy@darkwavestudios.io</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
