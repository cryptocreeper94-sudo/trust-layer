import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Building, Activity, AlertTriangle, Globe, Zap } from 'lucide-react';
import { Link } from 'wouter';

const SHIELD_TIERS = [
  {
    name: "Guardian Watch",
    price: "$299",
    priceNote: "per month",
    features: [
      "24/7 automated smart contract monitoring",
      "Unusual transaction pattern alerts",
      "Weekly security reports",
      "Email & Discord notifications",
      "Up to 5 contracts monitored",
      "Basic threat intelligence feed"
    ],
    icon: Eye,
    color: "cyan"
  },
  {
    name: "Guardian Shield",
    price: "$999",
    priceNote: "per month",
    features: [
      "Everything in Guardian Watch",
      "Real-time incident alerts (< 1 min)",
      "Governance attack detection",
      "Bridge & liquidity pool monitoring",
      "Whale movement tracking",
      "Up to 25 contracts monitored",
      "Dedicated Slack channel",
      "Monthly security review calls"
    ],
    highlight: true,
    icon: Shield,
    color: "purple"
  },
  {
    name: "Guardian Command",
    price: "$2,999",
    priceNote: "per month",
    features: [
      "Everything in Guardian Shield",
      "24/7 Security Operations Center",
      "Active threat mitigation",
      "Rug pull early warning system",
      "Unlimited contract monitoring",
      "Custom detection rules",
      "Incident response team",
      "Quarterly penetration testing",
      "Executive security briefings"
    ],
    icon: Building,
    color: "pink"
  }
];

const FEATURES = [
  { icon: Activity, title: "Real-Time Monitoring", description: "24/7 surveillance of your smart contracts and on-chain activity" },
  { icon: AlertTriangle, title: "Threat Detection", description: "AI-powered anomaly detection for unusual patterns and attacks" },
  { icon: Globe, title: "Multi-Chain Coverage", description: "Monitor assets across Ethereum, BSC, Polygon, and 20+ chains" },
  { icon: Zap, title: "Instant Alerts", description: "Sub-minute notifications via email, Slack, Discord, and SMS" }
];

export default function GuardianShieldPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-4" data-testid="guardian-shield-page">
      <section className="max-w-6xl mx-auto py-8 text-white">
        <div className="mb-4">
          <Link href="/" className="text-cyan-400 hover:text-cyan-300 text-sm">← Back to Portal</Link>
        </div>
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Guardian Shield — Monitoring & Response</h1>
            <p className="text-slate-400 mt-2">Continuous security monitoring and alerting for your smart contracts and infrastructure.</p>
          </div>
          <div className="hidden sm:block">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500 text-black text-xs font-semibold">
              <Shield className="w-4 h-4" />
              Coming Soon
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid sm:grid-cols-2 md:grid-cols-4 gap-4"
          >
            {FEATURES.map((feature, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-950/30 border border-slate-800/40">
                <feature.icon className="w-8 h-8 text-cyan-400 mb-3" />
                <h3 className="text-sm font-semibold text-white">{feature.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{feature.description}</p>
              </div>
            ))}
          </motion.div>

          <div className="p-4 rounded-xl bg-slate-950/30 border border-slate-800/40">
            <h3 className="text-lg font-semibold mb-4">Tier Comparison</h3>
            <div className="overflow-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800">
                    <th className="p-3">Feature</th>
                    <th className="p-3">Watch $299</th>
                    <th className="p-3">Shield $999</th>
                    <th className="p-3">Command $2,999</th>
                  </tr>
                </thead>
                <tbody className="text-white">
                  <tr className="border-b border-slate-800/40"><td className="p-3">Contracts Monitored</td><td className="p-3">5</td><td className="p-3">25</td><td className="p-3">Unlimited</td></tr>
                  <tr className="border-b border-slate-800/40"><td className="p-3">Alert Speed</td><td className="p-3">5 min</td><td className="p-3">&lt; 1 min</td><td className="p-3">Real-time</td></tr>
                  <tr className="border-b border-slate-800/40"><td className="p-3">Incident Response</td><td className="p-3">—</td><td className="p-3">Included</td><td className="p-3">24/7 Team</td></tr>
                  <tr className="border-b border-slate-800/40"><td className="p-3">Custom Rules</td><td className="p-3">—</td><td className="p-3">—</td><td className="p-3">✓</td></tr>
                  <tr><td className="p-3">Pen Testing</td><td className="p-3">—</td><td className="p-3">—</td><td className="p-3">Quarterly</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {SHIELD_TIERS.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-4 rounded-xl border ${tier.highlight ? 'bg-gradient-to-br from-purple-950/30 to-slate-950/30 border-purple-500/40' : 'bg-slate-950/30 border-slate-800/40'}`}
              >
                <tier.icon className={`w-8 h-8 mb-3 ${tier.color === 'cyan' ? 'text-cyan-400' : tier.color === 'purple' ? 'text-purple-400' : 'text-pink-400'}`} />
                <h3 className="text-lg font-semibold text-white">{tier.name}</h3>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-white">{tier.price}</span>
                  <span className="text-slate-400 text-sm">/{tier.priceNote}</span>
                </div>
                <ul className="mt-4 space-y-2">
                  {tier.features.slice(0, 5).map((f, j) => (
                    <li key={j} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-cyan-400 mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button className="w-full mt-4 py-2 rounded-md bg-slate-800/60 text-slate-400 text-sm cursor-not-allowed">
                  Coming Soon
                </button>
              </motion.div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-950/30 border border-slate-800/40">
            <h3 className="text-lg font-semibold mb-2">Live Stats</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              <div>
                <div className="text-2xl font-bold text-cyan-400">99.99%</div>
                <div className="text-xs text-slate-400">Uptime</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">0</div>
                <div className="text-xs text-slate-400">Active Alerts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">24/7</div>
                <div className="text-xs text-slate-400">Monitoring</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-pink-400">&lt;1m</div>
                <div className="text-xs text-slate-400">Alert Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
