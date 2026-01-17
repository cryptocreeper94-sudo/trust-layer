import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { GlassCard } from "@/components/glass-card";
import {
  Building2,
  Car,
  Heart,
  Users,
  Briefcase,
  Home,
  Calendar,
  Truck,
  Shield,
  Code,
  Palette,
  TrendingUp,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  Zap,
  Globe,
  Lock,
  Network,
  Sparkles,
  ShoppingBag,
  Siren,
  Lightbulb,
  Phone,
  Landmark,
  Wheat,
  GraduationCap,
  Bus,
  Scale,
  Factory,
  Music,
  Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Vertical {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  app?: string;
  appStatus: "live" | "built" | "building" | "planned";
  description: string;
  participants: string[];
  connectsTo: string[];
}

const verticals: Vertical[] = [
  {
    id: "staffing",
    name: "Staffing & HR",
    icon: <Users className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
    app: "Orbit Staffing",
    appStatus: "live",
    description: "Verified workers, employers, and agencies connected through trusted credentialing",
    participants: ["Employers", "Workers", "Agencies", "Payroll", "Background Check", "Training"],
    connectsTo: ["construction", "healthcare", "events", "hospitality", "automotive", "retail", "education", "legal"]
  },
  {
    id: "automotive",
    name: "Automotive",
    icon: <Car className="w-6 h-6" />,
    color: "from-orange-500 to-red-500",
    app: "GarageBot",
    appStatus: "built",
    description: "Parts suppliers, mechanics, dealers, and auctions with transparent pricing and verified service",
    participants: ["Dealers", "Mechanics", "Parts Suppliers", "Auctions", "Fleet Managers", "Insurance"],
    connectsTo: ["insurance", "staffing", "supplychain", "transportation", "banking"]
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: <Heart className="w-6 h-6" />,
    color: "from-pink-500 to-rose-500",
    app: "VedaSolus",
    appStatus: "built",
    description: "Practitioners of all traditions - Western, Eastern, Ayurvedic, Unani - with verified credentials",
    participants: ["Practitioners", "Patients", "Pharmacies", "Labs", "Insurance", "Telemedicine"],
    connectsTo: ["insurance", "staffing", "emergency", "education"]
  },
  {
    id: "trading",
    name: "Trading & Intel",
    icon: <TrendingUp className="w-6 h-6" />,
    color: "from-green-500 to-emerald-500",
    app: "Pulse / Strike Agent",
    appStatus: "live",
    description: "AI-powered market intelligence with verified data sources and transparent signals",
    participants: ["Traders", "Analysts", "Data Providers", "Exchanges", "Funds"],
    connectsTo: ["insurance", "realestate"]
  },
  {
    id: "insurance",
    name: "Insurance",
    icon: <Shield className="w-6 h-6" />,
    color: "from-violet-500 to-purple-500",
    app: "Insurance Compare",
    appStatus: "planned",
    description: "Transparent comparison across auto, health, property, business - verified quotes from verified providers",
    participants: ["Carriers", "Agents", "Adjusters", "Underwriters", "Policyholders"],
    connectsTo: ["automotive", "healthcare", "realestate", "construction", "events", "staffing", "agriculture", "retail", "emergency", "banking"]
  },
  {
    id: "construction",
    name: "Construction & Trades",
    icon: <Building2 className="w-6 h-6" />,
    color: "from-amber-500 to-yellow-500",
    app: undefined,
    appStatus: "planned",
    description: "Contractors, subcontractors, inspectors, and suppliers with verified licenses and transparent bids",
    participants: ["Contractors", "Subcontractors", "Inspectors", "Suppliers", "Architects", "Permitting"],
    connectsTo: ["realestate", "insurance", "staffing", "supplychain", "utilities", "legal"]
  },
  {
    id: "realestate",
    name: "Real Estate",
    icon: <Home className="w-6 h-6" />,
    color: "from-teal-500 to-cyan-500",
    app: undefined,
    appStatus: "planned",
    description: "Agents, buyers, sellers, and property managers with verified transactions and reputation",
    participants: ["Agents", "Buyers", "Sellers", "Property Managers", "Title/Escrow", "Appraisers"],
    connectsTo: ["construction", "insurance", "trading", "banking", "utilities", "legal"]
  },
  {
    id: "events",
    name: "Events & Venues",
    icon: <Calendar className="w-6 h-6" />,
    color: "from-fuchsia-500 to-pink-500",
    app: undefined,
    appStatus: "planned",
    description: "Stadiums, festivals, conferences - verified vendors, security, and transparent ticketing",
    participants: ["Venues", "Promoters", "Vendors", "Security", "Talent", "Ticketing"],
    connectsTo: ["staffing", "insurance", "hospitality", "supplychain", "transportation", "communications"]
  },
  {
    id: "hospitality",
    name: "Food & Hospitality",
    icon: <Briefcase className="w-6 h-6" />,
    color: "from-lime-500 to-green-500",
    app: undefined,
    appStatus: "planned",
    description: "Restaurants, hotels, catering with verified health standards and supplier transparency",
    participants: ["Restaurants", "Hotels", "Catering", "Suppliers", "Inspectors", "Delivery"],
    connectsTo: ["events", "staffing", "supplychain", "insurance", "agriculture", "retail"]
  },
  {
    id: "supplychain",
    name: "Supply Chain",
    icon: <Truck className="w-6 h-6" />,
    color: "from-slate-500 to-gray-500",
    app: undefined,
    appStatus: "planned",
    description: "Manufacturers to consumers with verified origins, transparent tracking, and accountability",
    participants: ["Manufacturers", "Distributors", "Warehouses", "Freight", "Customs", "Retail"],
    connectsTo: ["automotive", "construction", "hospitality", "events", "retail", "agriculture", "manufacturing"]
  },
  {
    id: "creative",
    name: "Creative & Digital",
    icon: <Palette className="w-6 h-6" />,
    color: "from-indigo-500 to-blue-500",
    app: "Web Design Studio",
    appStatus: "building",
    description: "Designers, developers, and marketers with verified portfolios and transparent project management",
    participants: ["Designers", "Developers", "Marketers", "Clients", "Hosting", "Content"],
    connectsTo: ["staffing"]
  },
  {
    id: "gaming",
    name: "Gaming & Entertainment",
    icon: <Sparkles className="w-6 h-6" />,
    color: "from-cyan-500 to-blue-500",
    app: "Chronicles",
    appStatus: "building",
    description: "Verified economies, fair play, and real ownership of digital assets",
    participants: ["Players", "Creators", "Guilds", "Marketplaces", "Streamers"],
    connectsTo: ["creative", "events"]
  },
  {
    id: "retail",
    name: "Retail",
    icon: <ShoppingBag className="w-6 h-6" />,
    color: "from-rose-500 to-orange-500",
    app: undefined,
    appStatus: "planned",
    description: "Storefronts, franchises, and local shops with verified inventory, transparent pricing, and trusted transactions",
    participants: ["Stores", "Franchises", "POS Systems", "Inventory", "Loss Prevention", "Customers"],
    connectsTo: ["supplychain", "staffing", "insurance", "realestate", "banking"]
  },
  {
    id: "emergency",
    name: "Emergency Services",
    icon: <Siren className="w-6 h-6" />,
    color: "from-red-600 to-red-500",
    app: undefined,
    appStatus: "planned",
    description: "Fire, EMS, and law enforcement with verified responders and transparent dispatch",
    participants: ["Fire Departments", "EMS", "Law Enforcement", "Dispatch", "Hospitals", "Insurance"],
    connectsTo: ["healthcare", "insurance", "utilities", "communications"]
  },
  {
    id: "utilities",
    name: "Utilities",
    icon: <Lightbulb className="w-6 h-6" />,
    color: "from-yellow-500 to-amber-500",
    app: undefined,
    appStatus: "planned",
    description: "Electric, water, gas, and waste services with transparent billing and verified service",
    participants: ["Providers", "Technicians", "Meters", "Billing", "Regulators", "Customers"],
    connectsTo: ["realestate", "construction", "agriculture", "emergency"]
  },
  {
    id: "communications",
    name: "Communications",
    icon: <Phone className="w-6 h-6" />,
    color: "from-sky-500 to-blue-500",
    app: undefined,
    appStatus: "planned",
    description: "Telecom, internet, and satellite services - the infrastructure that connects everything",
    participants: ["Carriers", "ISPs", "Satellite", "Installers", "Equipment", "Customers"],
    connectsTo: ["utilities", "retail", "emergency", "creative"]
  },
  {
    id: "banking",
    name: "Banking & Lending",
    icon: <Landmark className="w-6 h-6" />,
    color: "from-emerald-600 to-green-500",
    app: undefined,
    appStatus: "planned",
    description: "Loans, mortgages, and credit with transparent terms and verified participants (ISO compliant)",
    participants: ["Banks", "Credit Unions", "Lenders", "Underwriters", "Borrowers", "Regulators"],
    connectsTo: ["realestate", "automotive", "insurance", "retail", "trading"]
  },
  {
    id: "agriculture",
    name: "Agriculture",
    icon: <Wheat className="w-6 h-6" />,
    color: "from-lime-600 to-green-500",
    app: undefined,
    appStatus: "planned",
    description: "Farming, livestock, and equipment with verified origins and transparent supply chains",
    participants: ["Farmers", "Ranchers", "Equipment", "Seeds/Feed", "Distributors", "Markets"],
    connectsTo: ["supplychain", "hospitality", "retail", "utilities", "insurance"]
  },
  {
    id: "education",
    name: "Education & Training",
    icon: <GraduationCap className="w-6 h-6" />,
    color: "from-purple-500 to-indigo-500",
    app: undefined,
    appStatus: "planned",
    description: "Schools, certification programs, and training with verified credentials that travel with you",
    participants: ["Schools", "Trainers", "Students", "Certifications", "Employers", "Licensing"],
    connectsTo: ["staffing", "healthcare", "legal", "creative"]
  },
  {
    id: "transportation",
    name: "Transportation",
    icon: <Bus className="w-6 h-6" />,
    color: "from-blue-600 to-indigo-500",
    app: undefined,
    appStatus: "planned",
    description: "Rideshare, fleet, and public transit with verified drivers and transparent routing",
    participants: ["Drivers", "Fleet Managers", "Transit Authorities", "Passengers", "Dispatchers"],
    connectsTo: ["automotive", "events", "staffing", "insurance"]
  },
  {
    id: "legal",
    name: "Legal Services",
    icon: <Scale className="w-6 h-6" />,
    color: "from-gray-600 to-slate-500",
    app: undefined,
    appStatus: "planned",
    description: "Attorneys, notaries, and mediators with verified bar status and transparent billing",
    participants: ["Attorneys", "Notaries", "Mediators", "Courts", "Clients", "Paralegals"],
    connectsTo: ["realestate", "insurance", "banking", "construction", "staffing"]
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    icon: <Factory className="w-6 h-6" />,
    color: "from-zinc-600 to-slate-500",
    app: undefined,
    appStatus: "planned",
    description: "The origin point - where goods are created before entering the supply chain. Tractors, equipment, parts, electronics",
    participants: ["Factories", "Assembly", "Quality Control", "Parts Fabrication", "Heavy Equipment", "Electronics"],
    connectsTo: ["supplychain", "automotive", "agriculture", "construction", "retail", "staffing"]
  },
  {
    id: "arts",
    name: "Arts & Entertainment",
    icon: <Music className="w-6 h-6" />,
    color: "from-pink-600 to-purple-500",
    app: undefined,
    appStatus: "planned",
    description: "Music, theater, visual arts, museums, galleries - creative expression with verified artists and transparent royalties",
    participants: ["Artists", "Musicians", "Galleries", "Museums", "Labels", "Venues", "Agents"],
    connectsTo: ["events", "gaming", "creative", "legal", "insurance"]
  },
  {
    id: "sports",
    name: "Sports",
    icon: <Trophy className="w-6 h-6" />,
    color: "from-amber-500 to-orange-500",
    app: undefined,
    appStatus: "planned",
    description: "Professional and amateur sports - teams, athletes, leagues, venues with verified credentials and transparent contracts",
    participants: ["Athletes", "Teams", "Leagues", "Venues", "Agents", "Sponsors", "Media"],
    connectsTo: ["events", "insurance", "legal", "staffing", "healthcare", "retail"]
  }
];

function StatusBadge({ status }: { status: string }) {
  const styles = {
    live: "bg-green-500/20 text-green-400 border-green-500/30",
    built: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    building: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    planned: "bg-slate-500/20 text-slate-400 border-slate-500/30"
  };
  const labels = {
    live: "Live",
    built: "Built",
    building: "Building",
    planned: "Planned"
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${styles[status as keyof typeof styles]}`}>
      {labels[status as keyof typeof labels]}
    </span>
  );
}

function VerticalCard({ vertical, isSelected, onClick }: { vertical: Vertical; isSelected: boolean; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <GlassCard className={`p-4 transition-all duration-300 ${isSelected ? "ring-2 ring-cyan-500 shadow-[0_0_30px_rgba(0,255,255,0.3)]" : ""}`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${vertical.color} text-white`}>
            {vertical.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-semibold truncate">{vertical.name}</h3>
              <StatusBadge status={vertical.appStatus} />
            </div>
            {vertical.app && (
              <p className="text-xs text-cyan-400">{vertical.app}</p>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function FlowDiagram() {
  return (
    <div className="relative py-8">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
        {[
          { icon: <Users className="w-6 h-6" />, label: "You Need Something" },
          { icon: <Network className="w-6 h-6" />, label: "Trust Layer Matches" },
          { icon: <CheckCircle2 className="w-6 h-6" />, label: "Verified Participant" },
          { icon: <Lock className="w-6 h-6" />, label: "Recorded Forever" }
        ].map((step, i) => (
          <div key={i} className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-2">
                {step.icon}
              </div>
              <span className="text-xs text-slate-400 text-center max-w-[100px]">{step.label}</span>
            </motion.div>
            {i < 3 && (
              <ArrowRight className="w-5 h-5 text-slate-600 hidden md:block" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EcosystemMapPage() {
  const [selectedVertical, setSelectedVertical] = useState<string | null>("staffing");
  const selected = verticals.find(v => v.id === selectedVertical);
  const connectedVerticals = selected ? verticals.filter(v => selected.connectsTo.includes(v.id)) : [];

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-medium tracking-wide uppercase">The Ecosystem</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              One Network. Total Trust.
            </span>
          </h1>
          
          <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-8">
            Every vertical connected. Every participant verified. When you need someone, 
            you don't search and hope—you connect with confidence. The person on the other end 
            is verified, professional, and part of the same trusted network you are.
          </p>
        </motion.div>

        {/* The Difference Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <GlassCard className="p-6 md:p-8" glow>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Why This Changes Everything</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <h3 className="text-red-400 font-semibold mb-3">The Old Way</h3>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">✗</span>
                    <span>Search, compare, hope they're legitimate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">✗</span>
                    <span>Reviews can be faked, credentials can be lied about</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">✗</span>
                    <span>Every new transaction starts from zero trust</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">✗</span>
                    <span>Disputes become "he said, she said"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">✗</span>
                    <span>Bad actors vanish and reappear elsewhere</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <h3 className="text-cyan-400 font-semibold mb-3">The Trust Layer</h3>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>Verification happens before you ever connect</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>Credentials are cryptographically verified, not claimed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>Reputation travels with you across every vertical</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>Every agreement timestamped, every commitment recorded</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>Bad actors have nowhere to hide, nowhere to restart</span>
                  </li>
                </ul>
              </div>
            </div>

            <FlowDiagram />
          </GlassCard>
        </motion.div>

        {/* Fractal Pattern Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <GlassCard className="p-6 md:p-8" glow>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-4">The Fractal Pattern</h2>
                <p className="text-slate-300 mb-4">
                  A fractal repeats the same pattern at every scale. Zoom in or zoom out—the structure holds.
                  That's what we're building: a network where trust works the same way whether you're 
                  hiring one person or connecting entire industries.
                </p>
                <p className="text-slate-400 text-sm">
                  One real estate agent connects to verified inspectors, who connect to verified contractors, 
                  who connect to verified suppliers. Thousands of participants, but the pattern of verified 
                  trust repeats at every connection point. Unity through design, not chaos through chance.
                </p>
              </div>
              <div className="w-48 h-48 relative">
                <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-pulse" />
                <div className="absolute inset-4 rounded-full border-2 border-purple-500/30 animate-pulse" style={{ animationDelay: "0.5s" }} />
                <div className="absolute inset-8 rounded-full border-2 border-pink-500/30 animate-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute inset-12 rounded-full border-2 border-cyan-500/30 animate-pulse" style={{ animationDelay: "1.5s" }} />
                <div className="absolute inset-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 animate-pulse" style={{ animationDelay: "2s" }} />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Verticals Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Industry Verticals</h2>
          <p className="text-slate-400 text-center mb-8 max-w-2xl mx-auto">
            Click any vertical to see its participants and connections. Every vertical connects to others—
            that's the power of the unified Trust Layer.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {verticals.map((vertical) => (
              <VerticalCard
                key={vertical.id}
                vertical={vertical}
                isSelected={selectedVertical === vertical.id}
                onClick={() => setSelectedVertical(vertical.id)}
              />
            ))}
          </div>
        </motion.div>

        {/* Selected Vertical Detail */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-16"
            >
              <GlassCard className="p-6 md:p-8" glow>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${selected.color} text-white`}>
                        {selected.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{selected.name}</h3>
                        {selected.app && (
                          <div className="flex items-center gap-2">
                            <span className="text-cyan-400 text-sm">{selected.app}</span>
                            <StatusBadge status={selected.appStatus} />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-slate-300 mb-4">{selected.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2">Participants</h4>
                      <div className="flex flex-wrap gap-2">
                        {selected.participants.map((p) => (
                          <span key={p} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-64 md:border-l md:border-white/10 md:pl-6">
                    <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Connects To</h4>
                    <div className="space-y-2">
                      {connectedVerticals.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVertical(v.id)}
                          className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                        >
                          <div className={`p-1.5 rounded-lg bg-gradient-to-br ${v.color} text-white`}>
                            {v.icon}
                          </div>
                          <span className="text-sm text-slate-300">{v.name}</span>
                          <ChevronRight className="w-4 h-4 text-slate-500 ml-auto" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <GlassCard className="max-w-2xl mx-auto p-8" glow>
            <Zap className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Be Part of the Foundation</h3>
            <p className="text-slate-400 mb-6">
              The presale is live. Early supporters get the best Signal pricing and become 
              founding members of the Trust Layer. This is the future of verified business—
              and it's being built right now.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/presale">
                <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90 font-bold px-8">
                  Join Presale <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/learn">
                <Button variant="outline" className="border-white/20 hover:bg-white/5">
                  Learn More
                </Button>
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
