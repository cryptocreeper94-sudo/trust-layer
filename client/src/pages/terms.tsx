import { motion } from "framer-motion";
import { FileText, Shield, Scale, AlertCircle } from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/glass-card";

export default function Terms() {
  const lastUpdated = "December 24, 2024";
  
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing or using the DarkWave Smart Chain platform, including the DarkWave Portal, APIs, and related services (collectively, the "Services"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use our Services.`
    },
    {
      title: "2. Description of Services",
      content: `DarkWave Smart Chain provides a Layer 1 blockchain platform, including but not limited to: block explorer, developer APIs, staking services, cross-chain bridge, NFT marketplace, decentralized exchange, and development tools. The Services are provided "as is" without warranties of any kind.`
    },
    {
      title: "3. User Responsibilities",
      content: `You are responsible for: (a) maintaining the security of your wallet and private keys; (b) all activities that occur under your account; (c) ensuring compliance with applicable laws and regulations; (d) the accuracy of information you provide; (e) backing up your data and assets.`
    },
    {
      title: "4. Prohibited Activities",
      content: `You agree not to: (a) use the Services for any illegal purpose; (b) attempt to hack, disrupt, or exploit the platform; (c) engage in market manipulation or fraudulent activities; (d) distribute malware or malicious code; (e) violate intellectual property rights; (f) harass other users or DarkWave staff.`
    },
    {
      title: "5. Digital Assets & Risks",
      content: `Digital assets are volatile and risky. You acknowledge that: (a) the value of DWC and other tokens may fluctuate significantly; (b) blockchain transactions are irreversible; (c) you may lose some or all of your digital assets; (d) past performance does not guarantee future results. You should only use funds you can afford to lose.`
    },
    {
      title: "6. Staking & Rewards",
      content: `Staking rewards are distributed based on network participation and are not guaranteed. Reward rates may change. Unstaking may be subject to lockup periods. The platform reserves the right to modify staking parameters with reasonable notice.`
    },
    {
      title: "7. Bridge Services",
      content: `Cross-chain bridge services involve additional risks including smart contract vulnerabilities, network congestion, and validator failures. Bridge transactions may take time to complete and are subject to network conditions on both chains.`
    },
    {
      title: "8. API Usage",
      content: `API access is subject to rate limits and usage quotas. Excessive or abusive API usage may result in temporary or permanent restrictions. API keys are confidential and must not be shared.`
    },
    {
      title: "9. Intellectual Property",
      content: `The DarkWave name, logo, and related marks are trademarks of DarkWave Studios. You may not use our branding without written permission. User-generated content remains the property of the respective users.`
    },
    {
      title: "10. Limitation of Liability",
      content: `To the maximum extent permitted by law, DarkWave Studios shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or digital assets.`
    },
    {
      title: "11. Indemnification",
      content: `You agree to indemnify and hold harmless DarkWave Studios and its affiliates from any claims, damages, or expenses arising from your use of the Services or violation of these terms.`
    },
    {
      title: "12. Modifications",
      content: `We reserve the right to modify these terms at any time. Material changes will be communicated through the platform. Continued use after changes constitutes acceptance of the modified terms.`
    },
    {
      title: "13. Governing Law",
      content: `These terms shall be governed by and construed in accordance with the laws of the jurisdiction where DarkWave Studios is incorporated, without regard to conflict of law principles.`
    },
    {
      title: "14. Contact",
      content: `For questions about these Terms of Service, please contact us at legal@darkwavestudios.io`
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
            <BackButton />
            <div>
              <h1 className="text-3xl font-display font-bold flex items-center gap-3" data-testid="text-terms-title">
                <FileText className="w-8 h-8 text-primary" />
                Terms of Service
              </h1>
              <p className="text-muted-foreground" data-testid="text-last-updated">Last updated: {lastUpdated}</p>
            </div>
          </div>

          <GlassCard className="p-6 border-yellow-500/20 bg-yellow-500/5" data-testid="card-important-notice">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-500">Important Notice</h3>
                <p className="text-sm text-muted-foreground">
                  Please read these terms carefully before using DarkWave Smart Chain. 
                  By using our services, you agree to be legally bound by these terms.
                </p>
              </div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassCard className="p-4 flex items-center gap-3" data-testid="card-security-first">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-semibold">Security First</h3>
                <p className="text-xs text-muted-foreground">Your assets are your responsibility</p>
              </div>
            </GlassCard>
            <GlassCard className="p-4 flex items-center gap-3" data-testid="card-fair-terms">
              <Scale className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-semibold">Fair Terms</h3>
                <p className="text-xs text-muted-foreground">Clear, transparent policies</p>
              </div>
            </GlassCard>
          </div>

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
            <p>For questions, contact legal@darkwavestudios.io</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
