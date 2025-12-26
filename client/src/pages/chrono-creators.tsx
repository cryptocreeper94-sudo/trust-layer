import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Palette, FileText, Users, Sparkles, ArrowRight, Download, Upload,
  Code, Scroll, Crown, Building, Coins, Shield, Lock, Check, Star,
  Map, BookOpen, Wand2, Music, Image, MessageSquare, Zap, ExternalLink,
  AlertCircle, Heart, Layers, Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChronoLayout, HoloCard, chronoStyles } from "@/components/chrono-ui";
import { usePageAnalytics } from "@/hooks/use-analytics";

import fantasyWorld from "@assets/generated_images/fantasy_sci-fi_world_landscape.png";
import medievalKingdom from "@assets/generated_images/medieval_fantasy_kingdom.png";
import quantumRealm from "@assets/generated_images/quantum_dimension_realm.png";
import deepSpace from "@assets/generated_images/deep_space_station.png";
import cyberpunkCity from "@assets/generated_images/cyberpunk_neon_city.png";
import renaissanceFlorence from "@assets/generated_images/renaissance_florence_italy_scene.png";

const CREATION_TYPES = [
  {
    title: "Quests & Storylines",
    description: "Craft adventures, mysteries, and narrative arcs that players will experience across the ChronoVerse.",
    icon: Scroll,
    difficulty: "Beginner",
    image: medievalKingdom,
  },
  {
    title: "Characters & NPCs",
    description: "Design unique personalities with emotions, beliefs, dialogue trees, and behavioral patterns.",
    icon: Users,
    difficulty: "Beginner",
    image: renaissanceFlorence,
  },
  {
    title: "Locations & Buildings",
    description: "Build taverns, castles, markets, temples - places where stories unfold and players gather.",
    icon: Building,
    difficulty: "Intermediate",
    image: fantasyWorld,
  },
  {
    title: "Items & Artifacts",
    description: "Create legendary weapons, mystical objects, trade goods, and collectibles with real value.",
    icon: Crown,
    difficulty: "Beginner",
    image: quantumRealm,
  },
  {
    title: "Events & Festivals",
    description: "Design recurring events, holidays, political gatherings, and world-changing moments.",
    icon: Sparkles,
    difficulty: "Intermediate",
    image: deepSpace,
  },
  {
    title: "AI Behaviors & Scripts",
    description: "For advanced creators: program complex AI logic, economic systems, and game mechanics.",
    icon: Code,
    difficulty: "Advanced",
    image: cyberpunkCity,
  },
];

const OWNERSHIP_TIERS = [
  {
    tier: "Contributor",
    price: "Free",
    description: "Share your ideas and help shape the ChronoVerse",
    features: [
      "Submit ideas and suggestions",
      "Participate in community votes",
      "Get credited for contributions",
      "Access to Creator Community",
    ],
    limitations: [
      "No ownership rights",
      "No revenue share",
      "Content may be modified",
    ],
    cta: "Start Contributing",
    highlight: false,
  },
  {
    tier: "Creator License",
    price: "500 DWC",
    description: "Own your creations as digital real estate",
    features: [
      "Full ownership rights to your content",
      "Revenue share from player interactions",
      "Protected intellectual property",
      "Trade or sell your creations",
      "Priority review queue",
      "Creator badge & recognition",
    ],
    limitations: [],
    cta: "Coming Soon",
    highlight: true,
  },
  {
    tier: "Studio Partner",
    price: "Custom",
    description: "For professional creators and teams",
    features: [
      "Everything in Creator License",
      "Bulk creation rights",
      "Direct collaboration with team",
      "Featured placement",
      "Advanced analytics",
      "Custom revenue agreements",
    ],
    limitations: [],
    cta: "Contact Us",
    highlight: false,
  },
];

const TEMPLATES = [
  { name: "Quest Template", type: "JSON", icon: Scroll, description: "Basic quest structure with objectives and rewards" },
  { name: "NPC Personality", type: "JSON", icon: Users, description: "Character template with emotions and beliefs" },
  { name: "Dialogue Tree", type: "JSON", icon: MessageSquare, description: "Branching conversation structure" },
  { name: "Location Blueprint", type: "JSON", icon: Map, description: "Building/area configuration template" },
  { name: "Item Definition", type: "JSON", icon: Gift, description: "Weapon, artifact, or trade good template" },
  { name: "Event Script", type: "JSON", icon: Sparkles, description: "Triggered event or festival structure" },
];

export default function ChronoCreators() {
  usePageAnalytics();
  
  return (
    <ChronoLayout currentPage="/creators">
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src={fantasyWorld} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30">
              <Palette className="w-3 h-3 mr-1" /> Creator Hub
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-white">
              Build the <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">ChronoVerse</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto mb-6">
              Create quests, characters, locations, and stories. Your creations become real estate in a living world - 
              owned, traded, and valued by the community.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="rounded-full gap-2 bg-gradient-to-r from-amber-600 to-orange-600" data-testid="get-started-creator">
                <Wand2 className="w-5 h-5" />
                Start Creating
              </Button>
              <a href="https://dwsc.io/studio" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="rounded-full gap-2 border-white/20 hover:bg-white/10" data-testid="advanced-studio-link">
                  <Code className="w-5 h-5" />
                  Advanced Code Editor
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <Layers className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white">What You Can Create</h2>
            </div>
            <p className="text-white/60 max-w-2xl">
              From simple storylines to complex AI behaviors - there's a place for every skill level. 
              Start simple, grow your portfolio, build your legacy.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CREATION_TYPES.map((type, i) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <div className="relative h-full rounded-xl overflow-hidden border border-white/10 hover:border-amber-500/30 transition-all">
                    <img src={type.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                    <div className="relative z-10 p-6 h-full flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <Badge className={`text-xs ${
                          type.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                          type.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                          'bg-purple-500/20 text-purple-400 border-purple-500/30'
                        }`}>
                          {type.difficulty}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{type.title}</h3>
                      <p className="text-white/60 text-sm flex-1">{type.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-b from-transparent via-amber-950/10 to-transparent">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white">Ownership & Rights</h2>
            </div>
            <p className="text-white/60 max-w-3xl">
              Your creations are <span className="text-amber-400 font-semibold">digital real estate</span>. 
              Like property in the real world, ownership comes with investment. 
              Contributors can participate freely, but true ownership - the right to profit, trade, and control your creations - 
              requires a Creator License.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {OWNERSHIP_TIERS.map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`h-full rounded-2xl border p-6 ${
                  tier.highlight 
                    ? 'bg-gradient-to-b from-amber-500/10 to-transparent border-amber-500/30 ring-1 ring-amber-500/20' 
                    : 'bg-white/5 border-white/10'
                }`}>
                  {tier.highlight && (
                    <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30">
                      <Star className="w-3 h-3 mr-1" /> Recommended
                    </Badge>
                  )}
                  <h3 className="text-xl font-bold text-white mb-1">{tier.tier}</h3>
                  <div className="text-2xl font-bold mb-2">
                    <span className={tier.highlight ? 'text-amber-400' : 'text-white'}>{tier.price}</span>
                    {tier.price !== "Free" && tier.price !== "Custom" && (
                      <span className="text-sm text-white/40 font-normal ml-1">one-time</span>
                    )}
                  </div>
                  <p className="text-white/60 text-sm mb-6">{tier.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    {tier.features.map((feature, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-white/70">{feature}</span>
                      </div>
                    ))}
                    {tier.limitations.map((limit, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-white/30 shrink-0 mt-0.5" />
                        <span className="text-sm text-white/40">{limit}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className={`w-full rounded-full ${
                      tier.highlight 
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                    disabled={tier.cta === "Coming Soon"}
                    data-testid={`tier-${tier.tier.toLowerCase().replace(' ', '-')}-cta`}
                  >
                    {tier.cta === "Coming Soon" && <Lock className="w-4 h-4 mr-2" />}
                    {tier.cta}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
          >
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white mb-1">Important: Ownership Terms</h4>
                <p className="text-sm text-white/60">
                  All content submitted to the ChronoVerse is subject to our Creator Terms of Service. 
                  Free contributions grant DarkWave Studios a perpetual license to use, modify, and distribute your content. 
                  <span className="text-amber-400"> Creator License holders retain full ownership rights</span>, 
                  including the ability to sell, trade, or remove their content. 
                  Ownership is recorded on the DarkWave Smart Chain for transparency and protection.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <Download className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white">Templates & Tools</h2>
            </div>
            <p className="text-white/60 max-w-2xl">
              Download ready-to-use templates. Fill in the blanks, customize to your vision, and submit. 
              No coding required for most creation types.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEMPLATES.map((template, i) => {
              const Icon = template.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all group cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white truncate">{template.name}</h3>
                          <Badge variant="outline" className="text-xs border-white/20 text-white/50 shrink-0">{template.type}</Badge>
                        </div>
                        <p className="text-sm text-white/50">{template.description}</p>
                      </div>
                      <Download className="w-5 h-5 text-white/30 group-hover:text-cyan-400 transition-colors shrink-0" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <p className="text-white/40 text-sm mb-4">Templates coming soon. Join the community to get early access.</p>
            <Link href="/community">
              <Button variant="outline" className="rounded-full gap-2 border-white/20" data-testid="join-for-templates">
                <Heart className="w-4 h-4" />
                Join Community
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white">How It Works</h2>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: 1, title: "Choose Your Path", desc: "Pick a creation type that matches your skills and interests", icon: BookOpen },
              { step: 2, title: "Use Templates", desc: "Download templates, fill in your content, or code from scratch", icon: FileText },
              { step: 3, title: "Submit for Review", desc: "Upload your creation. Our team reviews for quality and fit", icon: Upload },
              { step: 4, title: "Own & Earn", desc: "Approved? Get your Creator License and start earning from interactions", icon: Coins },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="text-center p-6 rounded-xl bg-white/5 border border-white/10 h-full">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-bold text-white">{item.step}</span>
                    </div>
                    <Icon className="w-6 h-6 text-purple-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-white/50">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <Building className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white">Business Partnerships</h2>
            </div>
            <p className="text-white/60 max-w-3xl">
              <span className="text-emerald-400 font-semibold">Storefront Sponsorships</span> - Real businesses can sponsor in-game locations. 
              A medieval blacksmith becomes a portal to an outdoor gear company. A Victorian clockmaker links to a watch brand. 
              Location-based pricing means prime spots are worth more - just like real estate.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              {
                title: "Storefront Properties",
                description: "Sponsor shops, taverns, guilds, and marketplaces across 70+ historical eras. Players who 'enter' your location connect to your brand.",
                icon: Building,
                features: ["Era-appropriate branding", "Location-based pricing", "Traffic analytics"]
              },
              {
                title: "Premium Locations",
                description: "Town squares, festival grounds, royal courts - high-traffic areas command premium licensing fees but deliver maximum exposure.",
                icon: Crown,
                features: ["Auction system for prime spots", "Surge pricing during events", "Exclusive district rights"]
              },
              {
                title: "Revenue Model",
                description: "Monthly licensing, per-visit royalties, conversion bonuses. Full analytics dashboard shows traffic, engagement, and ROI.",
                icon: Coins,
                features: ["Transparent blockchain tracking", "Real-time analytics", "Conversion attribution"]
              }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="h-full p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-white/60 text-sm mb-4">{item.description}</p>
                    <ul className="space-y-1">
                      {item.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2 text-xs text-emerald-300">
                          <Check className="w-3 h-3" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white mb-1">Coming Phase 1-2 (Q3 2025 - Q2 2026)</h4>
                <p className="text-sm text-white/60">
                  Storefront sponsorships are part of our roadmap. Property registry, licensing system, 
                  and business partner portal are scheduled for Phase 1. Full marketplace launch in Phase 2.
                  <Link href="/team" className="text-emerald-400 hover:underline ml-1">View full roadmap →</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <HoloCard image={deepSpace} glow="amber" className="min-h-[200px]">
            <div className="p-8 text-center">
              <Code className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">Advanced Developers</h3>
              <p className="text-white/60 mb-6 max-w-xl mx-auto">
                Ready to dive deeper? DarkWave Studio provides a full code editor for AI behaviors, 
                game mechanics, smart contract integration, and complex scripting. 
                Build with our SDK and APIs for maximum control.
              </p>
              <a href="https://dwsc.io/studio" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="rounded-full gap-2 bg-gradient-to-r from-amber-600 to-orange-600" data-testid="go-to-studio">
                  <Code className="w-5 h-5" />
                  Open DarkWave Studio
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </HoloCard>
        </div>
      </section>
      
      <style>{chronoStyles}</style>
    </ChronoLayout>
  );
}
