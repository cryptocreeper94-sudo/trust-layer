import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import {
  Paintbrush, Home, Thermometer, Zap, Droplets, Trees, Hammer,
  ArrowRight, Globe, Users, Shield, CheckCircle2, Building2,
  Briefcase, Car, Heart, Calendar, Truck, Brain, ShoppingBag,
  Wrench, Star, Sparkles, ChevronRight, Play, Monitor, Smartphone,
  CreditCard, MessageSquare, BarChart3, Lock, Rocket, Crown,
  Check, X as XIcon, Target, Settings, Award, TrendingUp,
  PawPrint, GraduationCap, Music, Phone
} from "lucide-react";

/* ─── Product Data ─── */

interface Product {
  id: string;
  name: string;
  tagline: string;
  icon: React.ReactNode;
  gradient: string;
  glowColor: string;
  image?: string;
  status: "live" | "ready" | "coming";
  category: "trade" | "enterprise" | "ai";
  features: string[];
  domain?: string;
  market?: string;
}

const TRADE_VERTICALS: Product[] = [
  {
    id: "painting", name: "PaintPros", tagline: "Professional Painting Platform",
    icon: <Paintbrush className="w-6 h-6" />, gradient: "from-green-800 to-emerald-900",
    glowColor: "shadow-green-500/20", image: "/ecosystem/saas-painting.png",
    status: "live", category: "trade", domain: "paintpros.io", market: "$46.5B",
    features: ["Online Booking", "Instant Estimates", "Crew Management", "Color Scanner AI", "CRM", "Payments"]
  },
  {
    id: "roofing", name: "RoofPros", tagline: "Roofing Business Platform",
    icon: <Home className="w-6 h-6" />, gradient: "from-red-800 to-orange-900",
    glowColor: "shadow-red-500/20", image: "/ecosystem/saas-roofing.png",
    status: "ready", category: "trade", domain: "roofpros.io", market: "$56B",
    features: ["Drone Assessment", "Material Calculator", "Storm Damage Claims", "CRM", "Crew Dispatch", "Payments"]
  },
  {
    id: "hvac", name: "HVACPros", tagline: "Climate Control Platform",
    icon: <Thermometer className="w-6 h-6" />, gradient: "from-sky-800 to-cyan-900",
    glowColor: "shadow-cyan-500/20", image: "/ecosystem/saas-hvac.png",
    status: "ready", category: "trade", domain: "hvacpros.io", market: "$130B",
    features: ["BTU Calculator", "Maintenance Scheduling", "Remote Diagnostics", "Equipment Tracking", "Dispatch", "Payments"]
  },
  {
    id: "electrical", name: "ElectricPros", tagline: "Electrical Contractor Platform",
    icon: <Zap className="w-6 h-6" />, gradient: "from-yellow-800 to-amber-900",
    glowColor: "shadow-yellow-500/20", image: "/ecosystem/saas-electrical.png",
    status: "ready", category: "trade", domain: "electricpros.io", market: "$200B",
    features: ["Wire Sizing Calc", "Voltage Drop Calc", "Permit Management", "Load Analysis", "NEC Compliance", "Payments"]
  },
  {
    id: "plumbing", name: "PlumbPros", tagline: "Plumbing Service Platform",
    icon: <Droplets className="w-6 h-6" />, gradient: "from-blue-800 to-indigo-900",
    glowColor: "shadow-blue-500/20",
    status: "ready", category: "trade", domain: "plumbpros.io", market: "$130B",
    features: ["Pipe Sizing Calc", "24/7 Emergency Booking", "Camera Inspection", "Parts Inventory", "Dispatch", "Payments"]
  },
  {
    id: "landscaping", name: "LandscapePros", tagline: "Landscaping Business Platform",
    icon: <Trees className="w-6 h-6" />, gradient: "from-emerald-800 to-lime-900",
    glowColor: "shadow-emerald-500/20",
    status: "ready", category: "trade", domain: "landscapepros.io", market: "$130B",
    features: ["3D Design Tool", "Mulch/Sod Calculator", "Irrigation Planner", "Weather Integration", "Crew Routes", "Payments"]
  },
  {
    id: "construction", name: "BuildPros", tagline: "General Contracting Platform",
    icon: <Hammer className="w-6 h-6" />, gradient: "from-stone-700 to-zinc-800",
    glowColor: "shadow-stone-500/20",
    status: "ready", category: "trade", domain: "buildpros.io", market: "$1.5T",
    features: ["Project Management", "Bid Management", "3D Renderings", "Gantt Scheduling", "Cost Tracking", "Payments"]
  },
];

const ENTERPRISE_APPS: Product[] = [
  {
    id: "orbit", name: "Orbit Staffing", tagline: "Workforce Management Platform",
    icon: <Users className="w-6 h-6" />, gradient: "from-blue-700 to-cyan-800",
    glowColor: "shadow-blue-500/20", status: "live", category: "enterprise",
    features: ["Shift Scheduling", "Credential Verification", "Payroll Integration", "Compliance Tracking", "Worker Portal", "Mobile App"]
  },
  {
    id: "garagebot", name: "GarageBot", tagline: "Automotive Service Platform",
    icon: <Car className="w-6 h-6" />, gradient: "from-red-700 to-rose-800",
    glowColor: "shadow-red-500/20", status: "ready", category: "enterprise",
    features: ["VIN Scanner", "Parts Catalog", "Service History", "Customer Portal", "Invoicing", "Inventory"]
  },
  {
    id: "vedasolus", name: "VedaSolus", tagline: "Healthcare & Wellness Platform",
    icon: <Heart className="w-6 h-6" />, gradient: "from-pink-700 to-rose-800",
    glowColor: "shadow-pink-500/20", status: "ready", category: "enterprise",
    features: ["Patient Portal", "Appointment Booking", "Telemedicine", "Multi-Tradition Support", "Insurance Verify", "Records"]
  },
  {
    id: "brewandboard", name: "Brew & Board", tagline: "Restaurant & Café Platform",
    icon: <Briefcase className="w-6 h-6" />, gradient: "from-amber-700 to-orange-800",
    glowColor: "shadow-amber-500/20", status: "ready", category: "enterprise",
    features: ["Table Reservations", "Online Ordering", "Menu Builder", "POS Integration", "Review Management", "Loyalty"]
  },
  {
    id: "happyeats", name: "Happy Eats", tagline: "Food Delivery Platform",
    icon: <ShoppingBag className="w-6 h-6" />, gradient: "from-orange-700 to-red-800",
    glowColor: "shadow-orange-500/20", status: "ready", category: "enterprise",
    features: ["Order Management", "Driver Dispatch", "Menu Management", "Customer App", "Live Tracking", "Payments"]
  },
  {
    id: "trusthome", name: "Trust Home", tagline: "Real Estate Platform",
    icon: <Building2 className="w-6 h-6" />, gradient: "from-teal-700 to-cyan-800",
    glowColor: "shadow-teal-500/20", status: "ready", category: "enterprise",
    features: ["Property Listings", "Virtual Tours", "Lead Management", "Transaction Tracking", "Agent Portal", "CRM"]
  },
  {
    id: "trustgolf", name: "Trust Golf", tagline: "Sports & Recreation Platform",
    icon: <Target className="w-6 h-6" />, gradient: "from-green-700 to-emerald-800",
    glowColor: "shadow-green-500/20", status: "ready", category: "enterprise",
    features: ["Tee Time Booking", "Tournament Manager", "Handicap Tracking", "Pro Shop", "Member Portal", "Events"]
  },
  {
    id: "lotopspro", name: "LotOps Pro", tagline: "Auction & Lot Management",
    icon: <Truck className="w-6 h-6" />, gradient: "from-slate-700 to-zinc-800",
    glowColor: "shadow-slate-500/20", status: "ready", category: "enterprise",
    features: ["Lot Management", "Auction Tracking", "Vehicle Processing", "Condition Reports", "Fleet Analytics", "Invoicing"]
  },
  {
    id: "trustbook", name: "Trust Book", tagline: "Publishing & Booking Platform",
    icon: <Calendar className="w-6 h-6" />, gradient: "from-purple-700 to-violet-800",
    glowColor: "shadow-purple-500/20", status: "ready", category: "enterprise",
    features: ["Event Booking", "Resource Calendar", "Digital Publishing", "Member Management", "Notifications", "Analytics"]
  },
  {
    id: "verdara", name: "Verdara / Arbora", tagline: "Environmental Services Platform",
    icon: <Trees className="w-6 h-6" />, gradient: "from-lime-700 to-green-800",
    glowColor: "shadow-lime-500/20", status: "ready", category: "enterprise",
    features: ["Service Scheduling", "Environmental Reports", "Compliance Tracking", "Route Optimization", "Customer Portal", "Analytics"]
  },
];

const AI_TOOLS: Product[] = [
  {
    id: "tradeworks", name: "TradeWorks AI", tagline: "Professional Field Toolkit",
    icon: <Brain className="w-6 h-6" />, gradient: "from-purple-700 to-fuchsia-800",
    glowColor: "shadow-purple-500/20", status: "live", category: "ai",
    features: ["80+ Trade Calculators", "Voice Assistant", "AI Color Scanner", "Material Estimator", "Supply Store Finder", "Offline Mode"]
  },
  {
    id: "trustgen", name: "TrustGen 3D", tagline: "AI-Powered 3D Creation Suite",
    icon: <Sparkles className="w-6 h-6" />, gradient: "from-cyan-700 to-blue-800",
    glowColor: "shadow-cyan-500/20", status: "live", category: "ai",
    features: ["AI 3D Generation", "WebGL Viewport", "PBR Materials", "Animation Timeline", "Code Editor", "Asset Library"]
  },
];

/* ─── Pricing ─── */

const PRICING_TIERS = [
  {
    name: "Starter",
    price: "$49",
    period: "/mo",
    description: "Perfect for solo contractors getting online",
    gradient: "from-slate-600 to-slate-700",
    features: [
      { text: "Professional Landing Page", included: true },
      { text: "Service Listings", included: true },
      { text: "Contact Form & Phone CTA", included: true },
      { text: "Mobile-Responsive Design", included: true },
      { text: "SEO Optimization", included: true },
      { text: "Custom Branding & Colors", included: true },
      { text: "Online Booking", included: false },
      { text: "CRM & Customer Management", included: false },
      { text: "TradeWorks AI Toolkit", included: false },
      { text: "Signal Chat Support Widget", included: false },
    ]
  },
  {
    name: "Pro",
    price: "$149",
    period: "/mo",
    description: "Full-service platform for growing teams",
    gradient: "from-cyan-600 to-blue-700",
    popular: true,
    features: [
      { text: "Everything in Starter", included: true },
      { text: "Online Booking System", included: true },
      { text: "CRM & Customer Management", included: true },
      { text: "Crew Management", included: true },
      { text: "Invoice & Payment Processing", included: true },
      { text: "Document Center", included: true },
      { text: "TradeWorks AI Toolkit", included: false },
      { text: "Signal Chat Support Widget", included: false },
      { text: "Custom Domain", included: false },
      { text: "Priority Support", included: false },
    ]
  },
  {
    name: "Enterprise",
    price: "$299",
    period: "/mo",
    description: "Everything, plus AI and white-glove support",
    gradient: "from-purple-600 to-fuchsia-700",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "TradeWorks AI Toolkit", included: true },
      { text: "Signal Chat Support Widget", included: true },
      { text: "Advanced Analytics Dashboard", included: true },
      { text: "Custom Domain (CNAME)", included: true },
      { text: "Blockchain Verification Badge", included: true },
      { text: "Priority Support (24h)", included: true },
      { text: "Multi-Location Support", included: true },
      { text: "API Access", included: true },
      { text: "White-Label Branding", included: true },
    ]
  },
];

/* ─── Components ─── */

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    live: "bg-green-500/20 text-green-400 border-green-500/30",
    ready: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    coming: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  };
  const labels: Record<string, string> = {
    live: "● Live",
    ready: "Ready to Deploy",
    coming: "Coming Soon",
  };
  return (
    <span className={`px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase rounded-full border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group"
    >
      <GlassCard className={`overflow-hidden h-full transition-all duration-500 ${hovered ? `shadow-2xl ${product.glowColor} ring-1 ring-white/20` : ""}`}>
        {/* Image / Gradient Hero */}
        <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${product.gradient}`}>
          {product.image ? (
            <>
              <img
                src={product.image}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/80 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                {product.icon}
              </div>
            </div>
          )}

          {/* Status badge */}
          <div className="absolute top-3 right-3">
            <StatusBadge status={product.status} />
          </div>

          {/* Market size */}
          {product.market && (
            <div className="absolute bottom-3 right-3">
              <span className="px-2 py-0.5 text-[10px] font-mono text-white/60 bg-black/40 backdrop-blur-sm rounded-md border border-white/10">
                TAM {product.market}
              </span>
            </div>
          )}

          {/* Name overlay */}
          <div className="absolute bottom-3 left-4">
            <h3 className="text-xl font-bold text-white drop-shadow-lg">{product.name}</h3>
            {product.domain && (
              <p className="text-xs text-white/60 font-mono">{product.domain}</p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-slate-400 mb-3">{product.tagline}</p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.features.slice(0, 4).map((f) => (
              <span key={f} className="px-2 py-0.5 text-[10px] font-medium text-slate-300 bg-white/5 border border-white/10 rounded-full">
                {f}
              </span>
            ))}
            {product.features.length > 4 && (
              <span className="px-2 py-0.5 text-[10px] font-medium text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                +{product.features.length - 4} more
              </span>
            )}
          </div>

          {/* CTA */}
          <Button
            className="w-full gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm"
            data-testid={`btn-demo-${product.id}`}
          >
            {product.status === "live" ? (
              <>
                <Play className="w-3.5 h-3.5" /> View Live Demo
              </>
            ) : (
              <>
                <Rocket className="w-3.5 h-3.5" /> Request Demo
              </>
            )}
          </Button>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function PricingCard({ tier, index }: { tier: typeof PRICING_TIERS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative"
    >
      {tier.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-full shadow-lg shadow-cyan-500/30">
            Most Popular
          </span>
        </div>
      )}
      <GlassCard className={`p-6 h-full ${tier.popular ? "ring-2 ring-cyan-500/50 shadow-2xl shadow-cyan-500/10" : ""}`}>
        <div className={`inline-flex px-3 py-1 rounded-lg bg-gradient-to-r ${tier.gradient} text-white text-sm font-semibold mb-4`}>
          {tier.name}
        </div>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-4xl font-bold text-white">{tier.price}</span>
          <span className="text-slate-400 text-sm">{tier.period}</span>
        </div>
        <p className="text-sm text-slate-400 mb-6">{tier.description}</p>

        <div className="space-y-3 mb-6">
          {tier.features.map((f) => (
            <div key={f.text} className="flex items-center gap-2.5">
              {f.included ? (
                <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              ) : (
                <XIcon className="w-4 h-4 text-slate-600 flex-shrink-0" />
              )}
              <span className={`text-sm ${f.included ? "text-slate-300" : "text-slate-600"}`}>{f.text}</span>
            </div>
          ))}
        </div>

        <Button
          className={`w-full gap-2 ${tier.popular ? "bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90 text-white font-bold" : "bg-white/5 hover:bg-white/10 border border-white/10 text-white"}`}
          data-testid={`btn-pricing-${tier.name.toLowerCase()}`}
        >
          Get Started <ArrowRight className="w-4 h-4" />
        </Button>
      </GlassCard>
    </motion.div>
  );
}

/* ─── Main Page ─── */

export default function SaaSPortfolio() {
  const [activeTab, setActiveTab] = useState<"trades" | "enterprise" | "ai">("trades");

  const tabProducts = {
    trades: TRADE_VERTICALS,
    enterprise: ENTERPRISE_APPS,
    ai: AI_TOOLS,
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/3 rounded-full blur-[150px]" />
      </div>

      {/* ─── Hero ─── */}
      <section className="relative pt-20 pb-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-400 text-sm font-medium tracking-wide uppercase">DarkWave Studios SaaS Portfolio</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Your Industry.</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Your Brand. Live Instantly.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Pick your trade. Add your brand. Configure your features. Pay and launch — your
              professional SaaS platform goes live in minutes, not months. No developers needed.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90 text-white font-bold px-8 py-6 text-lg gap-2 rounded-xl shadow-lg shadow-cyan-500/20" data-testid="hero-get-started">
                <Rocket className="w-5 h-5" /> Get Started
              </Button>
              <Button variant="outline" className="border-white/20 hover:bg-white/5 text-white px-8 py-6 text-lg gap-2 rounded-xl" data-testid="hero-watch-demo">
                <Play className="w-5 h-5" /> Watch Demo
              </Button>
            </div>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <GlassCard className="max-w-4xl mx-auto p-1">
              <div className="grid grid-cols-2 md:grid-cols-4">
                {[
                  { value: "17+", label: "Products" },
                  { value: "$2.2T+", label: "Combined TAM" },
                  { value: "< 5 min", label: "Setup Time" },
                  { value: "$49", label: "Starting At" },
                ].map((stat, i) => (
                  <div key={i} className="text-center py-4 px-2">
                    <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{stat.value}</div>
                    <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Vending Machine Simple</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Four steps. No code. No waiting. Your professional platform goes live instantly.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", icon: <Target className="w-7 h-7" />, title: "Pick Your Product", desc: "Choose from trade verticals or enterprise platforms. Each comes pre-loaded with industry-specific features.", color: "cyan" },
              { step: "02", icon: <Settings className="w-7 h-7" />, title: "Configure & Brand", desc: "Add your company name, logo, colors. Toggle services on/off. Set your service area and contact info.", color: "purple" },
              { step: "03", icon: <CreditCard className="w-7 h-7" />, title: "Pay & Launch", desc: "Select your tier, complete checkout. Your custom platform goes live on your subdomain instantly.", color: "blue" },
              { step: "04", icon: <TrendingUp className="w-7 h-7" />, title: "Grow Your Business", desc: "Manage bookings, track leads, dispatch crews, process payments. All from your branded platform.", color: "green" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <GlassCard className="p-6 h-full relative overflow-hidden group">
                  <div className={`absolute top-0 right-0 text-[80px] font-black text-white/[0.03] leading-none select-none group-hover:text-white/[0.06] transition-colors duration-500`}>
                    {item.step}
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/10 border border-${item.color}-500/20 flex items-center justify-center text-${item.color}-400 mb-4`}>
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                  {i < 3 && (
                    <ChevronRight className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 text-slate-700 z-10" />
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Product Catalog ─── */}
      <section className="py-16 px-4 md:px-8" id="products">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Product Catalog</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Every product includes a professional landing page, mobile-responsive design, SEO, and blockchain verification. Choose your industry.</p>
          </motion.div>

          {/* Tabs */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-white/5 rounded-2xl p-1.5 border border-white/10">
              {[
                { id: "trades" as const, label: "Trade Verticals", count: TRADE_VERTICALS.length, icon: <Wrench className="w-4 h-4" /> },
                { id: "enterprise" as const, label: "Enterprise", count: ENTERPRISE_APPS.length, icon: <Building2 className="w-4 h-4" /> },
                { id: "ai" as const, label: "AI Tools", count: AI_TOOLS.length, icon: <Brain className="w-4 h-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                  data-testid={`tab-${tab.id}`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className={`px-1.5 py-0.5 text-[10px] rounded-full ${
                    activeTab === tab.id ? "bg-cyan-500/30 text-cyan-300" : "bg-white/10 text-slate-500"
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`grid gap-6 ${
                activeTab === "ai"
                  ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              }`}
            >
              {tabProducts[activeTab].map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ─── What's Included ─── */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Every Platform Includes</h2>
            <p className="text-slate-400">Enterprise-grade features, included from day one.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Monitor className="w-6 h-6" />, label: "Responsive Design", desc: "Desktop, tablet & mobile" },
              { icon: <Smartphone className="w-6 h-6" />, label: "PWA Ready", desc: "Install as native app" },
              { icon: <Shield className="w-6 h-6" />, label: "SSL & Security", desc: "Enterprise-grade protection" },
              { icon: <Globe className="w-6 h-6" />, label: "SEO Optimized", desc: "Google-ready from launch" },
              { icon: <MessageSquare className="w-6 h-6" />, label: "Signal Chat", desc: "AI-powered support" },
              { icon: <Lock className="w-6 h-6" />, label: "Blockchain Verified", desc: "Trust Layer certification" },
              { icon: <BarChart3 className="w-6 h-6" />, label: "Analytics", desc: "Real-time business insights" },
              { icon: <Award className="w-6 h-6" />, label: "White Label", desc: "100% your brand" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <GlassCard className="p-4 text-center h-full group hover:border-cyan-500/20 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mx-auto mb-3 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1">{feature.label}</h4>
                  <p className="text-xs text-slate-400">{feature.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section className="py-16 px-4 md:px-8" id="pricing">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-slate-400 max-w-xl mx-auto">No setup fees. No contracts. Cancel anytime. Your platform, your terms.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_TIERS.map((tier, i) => (
              <PricingCard key={tier.name} tier={tier} index={i} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <p className="text-sm text-slate-500">
              All plans include SSL, hosting, updates, and backups. Need a custom solution?{" "}
              <button className="text-cyan-400 hover:underline" data-testid="btn-contact-custom">Contact us</button>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-8 md:p-12 text-center relative overflow-hidden" glow>
              {/* Gradient orb behind */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/30">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Launch Your Platform?
                </h2>
                <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
                  Pick your product, add your brand, and go live in under 5 minutes.
                  No developers. No design team. No waiting.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90 text-white font-bold px-10 py-6 text-lg gap-2 rounded-xl shadow-lg shadow-cyan-500/20" data-testid="cta-get-started">
                    <Rocket className="w-5 h-5" /> Launch My Platform
                  </Button>
                  <Link href="/signal-chat">
                    <Button variant="outline" className="border-white/20 hover:bg-white/5 text-white px-8 py-6 text-lg gap-2 rounded-xl" data-testid="cta-talk-to-us">
                      <MessageSquare className="w-5 h-5" /> Talk to Us
                    </Button>
                  </Link>
                </div>
                <p className="text-xs text-slate-500 mt-6">
                  Powered by DarkWave Studios · Built on the Trust Layer · Blockchain Verified
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
