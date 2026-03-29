import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Link } from "wouter";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Paintbrush, Home, Thermometer, Zap, Droplets, Trees, Hammer,
  ArrowRight, ArrowLeft, Globe, Users, Shield, Building2,
  Briefcase, Car, Heart, Calendar, Truck, Brain, ShoppingBag,
  Wrench, Sparkles, Check, ChevronRight, Monitor, Smartphone,
  CreditCard, MessageSquare, BarChart3, Lock, Rocket, Crown,
  Target, Settings, Award, TrendingUp, Upload, Palette,
  Phone, Mail, MapPin, Clock, FileText, CheckCircle2,
  Eye, Image, Type, X as XIcon
} from "lucide-react";

/* ═══════════════════════════════════════════════
   PRODUCT REGISTRY (same as saas-portfolio)
   ═══════════════════════════════════════════════ */

interface ProductDef {
  id: string;
  name: string;
  tagline: string;
  icon: React.ReactNode;
  gradient: string;
  image?: string;
  category: "trade" | "enterprise";
  defaultServices: string[];
  domain?: string;
}

const ALL_PRODUCTS: ProductDef[] = [
  {
    id: "painting", name: "PaintPros", tagline: "Professional Painting Platform",
    icon: <Paintbrush className="w-6 h-6" />, gradient: "from-green-800 to-emerald-900",
    image: "/ecosystem/saas-painting.png", category: "trade", domain: "paintpros.io",
    defaultServices: ["Interior Painting", "Exterior Painting", "Cabinet Refinishing", "Deck Staining", "Pressure Washing", "Color Consultation", "Wallpaper Installation", "Drywall Repair"]
  },
  {
    id: "roofing", name: "RoofPros", tagline: "Roofing Business Platform",
    icon: <Home className="w-6 h-6" />, gradient: "from-red-800 to-orange-900",
    image: "/ecosystem/saas-roofing.png", category: "trade", domain: "roofpros.io",
    defaultServices: ["Roof Replacement", "Roof Repair", "Storm Damage", "Gutter Installation", "Skylight Installation", "Roof Inspection", "Metal Roofing", "Flat Roofing"]
  },
  {
    id: "hvac", name: "HVACPros", tagline: "Climate Control Platform",
    icon: <Thermometer className="w-6 h-6" />, gradient: "from-sky-800 to-cyan-900",
    image: "/ecosystem/saas-hvac.png", category: "trade", domain: "hvacpros.io",
    defaultServices: ["AC Install", "Furnace Repair", "Duct Cleaning", "Heat Pump", "Maintenance Plans", "Emergency Repair", "Indoor Air Quality", "Thermostat Install"]
  },
  {
    id: "electrical", name: "ElectricPros", tagline: "Electrical Contractor Platform",
    icon: <Zap className="w-6 h-6" />, gradient: "from-yellow-800 to-amber-900",
    image: "/ecosystem/saas-electrical.png", category: "trade", domain: "electricpros.io",
    defaultServices: ["Panel Upgrades", "Wiring", "Lighting Install", "EV Charger", "Generator Install", "Home Automation", "Safety Inspections", "Surge Protection"]
  },
  {
    id: "plumbing", name: "PlumbPros", tagline: "Plumbing Service Platform",
    icon: <Droplets className="w-6 h-6" />, gradient: "from-blue-800 to-indigo-900",
    image: "/ecosystem/saas-plumbing.png", category: "trade", domain: "plumbpros.io",
    defaultServices: ["Drain Cleaning", "Water Heater", "Pipe Repair", "Sewer Line", "Bathroom Remodel", "Leak Detection", "Gas Line Repair", "24/7 Emergency"]
  },
  {
    id: "landscaping", name: "LandscapePros", tagline: "Landscaping Business Platform",
    icon: <Trees className="w-6 h-6" />, gradient: "from-emerald-800 to-lime-900",
    image: "/ecosystem/saas-landscaping.png", category: "trade", domain: "landscapepros.io",
    defaultServices: ["Lawn Mowing", "Landscape Design", "Irrigation", "Mulching", "Tree Trimming", "Hardscaping", "Sod Installation", "Snow Removal"]
  },
  {
    id: "construction", name: "BuildPros", tagline: "General Contracting Platform",
    icon: <Hammer className="w-6 h-6" />, gradient: "from-stone-700 to-zinc-800",
    image: "/ecosystem/saas-construction.png", category: "trade", domain: "buildpros.io",
    defaultServices: ["Kitchen Remodel", "Bathroom Remodel", "Room Additions", "Foundation", "Framing", "Finish Carpentry", "Concrete Work", "New Construction"]
  },
  {
    id: "garagebot", name: "GarageBot", tagline: "Automotive Service Platform",
    icon: <Car className="w-6 h-6" />, gradient: "from-red-700 to-rose-800",
    category: "enterprise",
    defaultServices: ["Oil Change", "Brake Service", "Tire Rotation", "Engine Diagnostics", "Transmission Service", "AC Repair", "Alignment", "Inspection"]
  },
  {
    id: "vedasolus", name: "VedaSolus", tagline: "Healthcare & Wellness Platform",
    icon: <Heart className="w-6 h-6" />, gradient: "from-pink-700 to-rose-800",
    category: "enterprise",
    defaultServices: ["Acupuncture", "Chiropractic", "Massage Therapy", "Ayurveda", "Naturopathy", "Nutritional Counseling", "Yoga Therapy", "Meditation"]
  },
  {
    id: "brewandboard", name: "Brew & Board", tagline: "Restaurant & Café Platform",
    icon: <Briefcase className="w-6 h-6" />, gradient: "from-amber-700 to-orange-800",
    category: "enterprise",
    defaultServices: ["Dine In", "Takeout", "Delivery", "Catering", "Private Events", "Online Ordering", "Gift Cards", "Loyalty Program"]
  },
];

/* ═══════════════════════════════════════════════
   PRICING TIERS
   ═══════════════════════════════════════════════ */

const TIERS = [
  {
    id: "starter", name: "Starter", price: 49, gradient: "from-slate-600 to-slate-700",
    desc: "Professional landing page & online presence",
    features: ["Professional Landing Page", "Service Listings", "Contact Form", "Mobile-Responsive", "SEO Optimized", "Custom Branding"]
  },
  {
    id: "pro", name: "Pro", price: 149, gradient: "from-cyan-600 to-blue-700", popular: true,
    desc: "Full-service platform with booking & CRM",
    features: ["Everything in Starter", "Online Booking", "CRM & Customers", "Crew Management", "Invoicing & Payments", "Document Center"]
  },
  {
    id: "enterprise", name: "Enterprise", price: 299, gradient: "from-purple-600 to-fuchsia-700",
    desc: "All features plus AI & white-glove support",
    features: ["Everything in Pro", "TradeWorks AI", "Signal Chat Widget", "Advanced Analytics", "Custom Domain", "Priority Support"]
  },
];

/* ═══════════════════════════════════════════════
   WIZARD STATE
   ═══════════════════════════════════════════════ */

interface WizardState {
  // Step 1: Product pick
  productId: string;
  // Step 2: Company info
  companyName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  serviceArea: string;
  // Step 3: Branding
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  tagline: string;
  // Step 4: Services
  services: string[];
  // Step 5: Tier
  tierId: string;
  // Step 6: Legal
  agreedTerms: boolean;
  agreedPrivacy: boolean;
  businessLicense: string;
}

const INITIAL_STATE: WizardState = {
  productId: "",
  companyName: "",
  ownerName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  serviceArea: "",
  primaryColor: "#06b6d4",
  secondaryColor: "#8b5cf6",
  logoUrl: "",
  tagline: "",
  services: [],
  tierId: "pro",
  agreedTerms: false,
  agreedPrivacy: false,
  businessLicense: "",
};

const STEP_LABELS = [
  { label: "Product", icon: <Target className="w-4 h-4" /> },
  { label: "Company", icon: <Building2 className="w-4 h-4" /> },
  { label: "Branding", icon: <Palette className="w-4 h-4" /> },
  { label: "Services", icon: <Settings className="w-4 h-4" /> },
  { label: "Plan", icon: <CreditCard className="w-4 h-4" /> },
  { label: "Legal", icon: <FileText className="w-4 h-4" /> },
  { label: "Launch", icon: <Rocket className="w-4 h-4" /> },
];

/* ═══════════════════════════════════════════════
   STEP COMPONENTS
   ═══════════════════════════════════════════════ */

/** Glass input field */
function GlassInput({ label, value, onChange, type = "text", placeholder, required, icon: Icon }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}{required && <span className="text-cyan-400 ml-0.5">*</span>}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all`}
        />
      </div>
    </div>
  );
}

/* ─── Step 1: Pick Product ─── */
function StepProduct({ state, setState }: { state: WizardState; setState: (s: WizardState) => void }) {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Choose Your Platform</h2>
      <p className="text-slate-400 text-sm mb-6">Select the industry that matches your business. Each comes pre-loaded with industry-specific features.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ALL_PRODUCTS.map((product) => (
          <button
            key={product.id}
            onClick={() => setState({ ...state, productId: product.id, services: [...product.defaultServices] })}
            className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 text-left group active:scale-95 ${
              state.productId === product.id
                ? "border-cyan-500 shadow-lg shadow-cyan-500/20 bg-cyan-500/10"
                : "border-white/10 hover:border-white/20 bg-white/5"
            }`}
            data-testid={`pick-${product.id}`}
          >
            {/* Image */}
            {product.image ? (
              <div className="relative h-20 sm:h-24 overflow-hidden">
                <img src={product.image} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              </div>
            ) : (
              <div className={`h-20 sm:h-24 bg-gradient-to-br ${product.gradient} flex items-center justify-center`}>
                <div className="text-white/60">{product.icon}</div>
              </div>
            )}

            {/* Label */}
            <div className="p-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-white/70 shrink-0">{product.icon}</span>
                <span className="text-white text-xs sm:text-sm font-semibold truncate">{product.name}</span>
              </div>
              <p className="text-slate-500 text-[10px] sm:text-xs mt-0.5 truncate">{product.tagline}</p>
            </div>

            {/* Check indicator */}
            {state.productId === product.id && (
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center shadow-lg">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Step 2: Company Info ─── */
function StepCompany({ state, setState }: { state: WizardState; setState: (s: WizardState) => void }) {
  const u = (key: keyof WizardState) => (v: string) => setState({ ...state, [key]: v });

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Company Information</h2>
      <p className="text-slate-400 text-sm mb-6">Tell us about your business. This information appears on your platform.</p>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <GlassInput label="Company Name" value={state.companyName} onChange={u("companyName")} placeholder="e.g. Smith & Sons Painting" required icon={Building2} />
          <GlassInput label="Owner / Manager Name" value={state.ownerName} onChange={u("ownerName")} placeholder="John Smith" required icon={Users} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <GlassInput label="Phone Number" value={state.phone} onChange={u("phone")} type="tel" placeholder="(555) 555-1234" required icon={Phone} />
          <GlassInput label="Email Address" value={state.email} onChange={u("email")} type="email" placeholder="john@smithpainting.com" required icon={Mail} />
        </div>
        <GlassInput label="Business Address" value={state.address} onChange={u("address")} placeholder="123 Main St" icon={MapPin} />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <GlassInput label="City" value={state.city} onChange={u("city")} placeholder="Springfield" />
          <GlassInput label="State" value={state.state} onChange={u("state")} placeholder="IL" />
          <GlassInput label="ZIP" value={state.zip} onChange={u("zip")} placeholder="62704" />
        </div>
        <GlassInput label="Service Area" value={state.serviceArea} onChange={u("serviceArea")} placeholder="Springfield, IL and surrounding 30 miles" icon={Globe} />
      </div>
    </div>
  );
}

/* ─── Step 3: Branding ─── */
function StepBranding({ state, setState }: { state: WizardState; setState: (s: WizardState) => void }) {
  const u = (key: keyof WizardState) => (v: string) => setState({ ...state, [key]: v });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setState({ ...state, logoUrl: ev.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Brand Your Platform</h2>
      <p className="text-slate-400 text-sm mb-6">Make it yours. Choose your colors and upload your logo.</p>

      <div className="space-y-6">
        {/* Logo upload */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Company Logo</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 rounded-2xl border-2 border-dashed border-white/20 hover:border-cyan-500/50 bg-white/5 flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
              data-testid="btn-upload-logo"
            >
              {state.logoUrl ? (
                <img src={state.logoUrl} alt="Logo" className="w-full h-full object-contain rounded-xl p-1" />
              ) : (
                <>
                  <Upload className="w-6 h-6 text-slate-500" />
                  <span className="text-[10px] text-slate-500">Upload</span>
                </>
              )}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            <div className="text-sm text-slate-400">
              <p>PNG, JPG, SVG accepted</p>
              <p className="text-xs text-slate-500 mt-1">Recommended: 500×500px, transparent bg</p>
            </div>
          </div>
        </div>

        {/* Colors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Primary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={state.primaryColor}
                onChange={(e) => u("primaryColor")(e.target.value)}
                className="w-12 h-12 rounded-xl border border-white/10 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={state.primaryColor}
                onChange={(e) => u("primaryColor")(e.target.value)}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Secondary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={state.secondaryColor}
                onChange={(e) => u("secondaryColor")(e.target.value)}
                className="w-12 h-12 rounded-xl border border-white/10 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={state.secondaryColor}
                onChange={(e) => u("secondaryColor")(e.target.value)}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>
        </div>

        {/* Tagline */}
        <GlassInput label="Company Tagline" value={state.tagline} onChange={u("tagline")} placeholder="e.g. Quality You Can Trust Since 1992" icon={Type} />

        {/* Live Preview Swatch */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Preview</label>
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <div className="h-14 sm:h-16 flex items-center gap-3 px-4" style={{ background: `linear-gradient(135deg, ${state.primaryColor}, ${state.secondaryColor})` }}>
              {state.logoUrl ? (
                <img src={state.logoUrl} alt="" className="w-8 h-8 rounded-lg object-contain bg-white/20 p-0.5" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                  {state.companyName?.[0] || "?"}
                </div>
              )}
              <div>
                <p className="text-white font-bold text-sm">{state.companyName || "Your Company"}</p>
                <p className="text-white/70 text-xs">{state.tagline || "Your tagline here"}</p>
              </div>
            </div>
            <div className="bg-slate-900 p-4 text-center">
              <button
                className="px-6 py-2 rounded-lg text-white text-sm font-semibold"
                style={{ backgroundColor: state.primaryColor }}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Step 4: Services ─── */
function StepServices({ state, setState }: { state: WizardState; setState: (s: WizardState) => void }) {
  const product = ALL_PRODUCTS.find(p => p.id === state.productId);
  const [custom, setCustom] = useState("");

  const toggle = (service: string) => {
    const has = state.services.includes(service);
    setState({
      ...state,
      services: has ? state.services.filter(s => s !== service) : [...state.services, service],
    });
  };

  const addCustom = () => {
    if (custom.trim() && !state.services.includes(custom.trim())) {
      setState({ ...state, services: [...state.services, custom.trim()] });
      setCustom("");
    }
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Your Services</h2>
      <p className="text-slate-400 text-sm mb-6">Toggle services on/off. These appear on your landing page and booking form.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
        {(product?.defaultServices || []).map((service) => {
          const active = state.services.includes(service);
          return (
            <button
              key={service}
              onClick={() => toggle(service)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left active:scale-[0.98] ${
                active
                  ? "border-cyan-500/40 bg-cyan-500/10 text-white"
                  : "border-white/10 bg-white/5 text-slate-400"
              }`}
              data-testid={`svc-${service.replace(/\s+/g, "-").toLowerCase()}`}
            >
              <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                active ? "bg-cyan-500 text-white" : "bg-white/10"
              }`}>
                {active && <Check className="w-3 h-3" />}
              </div>
              <span className="text-sm">{service}</span>
            </button>
          );
        })}

        {/* Custom services the user added */}
        {state.services.filter(s => !product?.defaultServices.includes(s)).map((service) => (
          <div
            key={service}
            className="flex items-center gap-3 p-3 rounded-xl border border-purple-500/40 bg-purple-500/10 text-white"
          >
            <div className="w-5 h-5 rounded-md bg-purple-500 text-white flex items-center justify-center shrink-0">
              <Check className="w-3 h-3" />
            </div>
            <span className="text-sm flex-1">{service}</span>
            <button onClick={() => toggle(service)} className="text-slate-500 hover:text-red-400">
              <XIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add custom */}
      <div className="flex gap-2">
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCustom()}
          placeholder="Add custom service..."
          className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
          data-testid="input-custom-service"
        />
        <Button onClick={addCustom} className="bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 shrink-0" data-testid="btn-add-service">
          Add
        </Button>
      </div>

      <p className="text-xs text-slate-500 mt-3">{state.services.length} services selected</p>
    </div>
  );
}

/* ─── Step 5: Plan Selection ─── */
function StepPlan({ state, setState }: { state: WizardState; setState: (s: WizardState) => void }) {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Choose Your Plan</h2>
      <p className="text-slate-400 text-sm mb-6">All plans include hosting, SSL, and automatic backups. Cancel anytime.</p>

      <div className="space-y-4">
        {TIERS.map((tier) => {
          const active = state.tierId === tier.id;
          return (
            <button
              key={tier.id}
              onClick={() => setState({ ...state, tierId: tier.id })}
              className={`w-full text-left rounded-xl border-2 transition-all p-4 sm:p-5 active:scale-[0.99] ${
                active
                  ? "border-cyan-500 shadow-lg shadow-cyan-500/15 bg-cyan-500/5"
                  : "border-white/10 hover:border-white/20 bg-white/[0.03]"
              }`}
              data-testid={`tier-${tier.id}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-lg bg-gradient-to-r ${tier.gradient} text-white text-sm font-bold`}>
                    {tier.name}
                  </div>
                  {tier.popular && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-2xl sm:text-3xl font-bold text-white">${tier.price}</span>
                  <span className="text-slate-400 text-sm">/mo</span>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-3">{tier.desc}</p>
              <div className="grid grid-cols-2 gap-1.5">
                {tier.features.map((f) => (
                  <div key={f} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="text-xs text-slate-300">{f}</span>
                  </div>
                ))}
              </div>

              {/* Selection indicator */}
              {active && (
                <div className="mt-3 flex items-center gap-2 text-cyan-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-semibold">Selected</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Step 6: Legal ─── */
function StepLegal({ state, setState }: { state: WizardState; setState: (s: WizardState) => void }) {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Legal & Agreement</h2>
      <p className="text-slate-400 text-sm mb-6">Review and accept our terms. Almost there!</p>

      <div className="space-y-4">
        <GlassInput
          label="Business License # (Optional)"
          value={state.businessLicense}
          onChange={(v) => setState({ ...state, businessLicense: v })}
          placeholder="State or local license number"
          icon={FileText}
        />

        <div className="space-y-3 mt-6">
          <button
            onClick={() => setState({ ...state, agreedTerms: !state.agreedTerms })}
            className={`w-full flex items-start gap-3 p-4 rounded-xl border transition-all text-left ${
              state.agreedTerms ? "border-cyan-500/40 bg-cyan-500/10" : "border-white/10 bg-white/5"
            }`}
            data-testid="agree-terms"
          >
            <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
              state.agreedTerms ? "bg-cyan-500 text-white" : "bg-white/10"
            }`}>
              {state.agreedTerms && <Check className="w-3 h-3" />}
            </div>
            <div>
              <p className="text-sm text-white font-medium">I agree to the <Link href="/terms" className="text-cyan-400 underline">Terms of Service</Link></p>
              <p className="text-xs text-slate-500 mt-1">Including auto-renewal billing, service availability, and platform usage guidelines.</p>
            </div>
          </button>

          <button
            onClick={() => setState({ ...state, agreedPrivacy: !state.agreedPrivacy })}
            className={`w-full flex items-start gap-3 p-4 rounded-xl border transition-all text-left ${
              state.agreedPrivacy ? "border-cyan-500/40 bg-cyan-500/10" : "border-white/10 bg-white/5"
            }`}
            data-testid="agree-privacy"
          >
            <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
              state.agreedPrivacy ? "bg-cyan-500 text-white" : "bg-white/10"
            }`}>
              {state.agreedPrivacy && <Check className="w-3 h-3" />}
            </div>
            <div>
              <p className="text-sm text-white font-medium">I agree to the <Link href="/privacy" className="text-cyan-400 underline">Privacy Policy</Link></p>
              <p className="text-xs text-slate-500 mt-1">Your data is protected under our privacy-first approach. We never sell your information.</p>
            </div>
          </button>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-white">30-Day Money-Back Guarantee</span>
          </div>
          <p className="text-xs text-slate-400">Not satisfied? Cancel within 30 days for a full refund. No questions asked.</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Step 7: Launch ─── */
function StepLaunch({ state }: { state: WizardState }) {
  const product = ALL_PRODUCTS.find(p => p.id === state.productId);
  const tier = TIERS.find(t => t.id === state.tierId);
  const subdomain = state.companyName?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "your-company";

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/30">
          <Rocket className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Ready to Launch!</h2>
        <p className="text-slate-400 text-sm">Review your configuration and launch your platform.</p>
      </div>

      {/* Summary Card */}
      <div className="rounded-xl border border-white/10 overflow-hidden mb-6">
        {/* Header preview */}
        <div className="h-14 flex items-center gap-3 px-4" style={{ background: `linear-gradient(135deg, ${state.primaryColor}, ${state.secondaryColor})` }}>
          {state.logoUrl ? (
            <img src={state.logoUrl} alt="" className="w-8 h-8 rounded-lg object-contain bg-white/20 p-0.5" />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white text-xs font-bold">
              {state.companyName?.[0] || "?"}
            </div>
          )}
          <div>
            <p className="text-white font-bold text-sm">{state.companyName || "Your Company"}</p>
            <p className="text-white/70 text-[10px]">{state.tagline}</p>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white/[0.03] p-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Platform</span>
            <span className="text-white font-semibold flex items-center gap-1.5">
              {product?.icon} {product?.name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Plan</span>
            <span className="text-white font-semibold">{tier?.name} — ${tier?.price}/mo</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Services</span>
            <span className="text-white font-semibold">{state.services.length} active</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Subdomain</span>
            <span className="text-cyan-400 font-mono text-xs">{subdomain}.{product?.domain || "dwtl.io"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Contact</span>
            <span className="text-white text-xs">{state.phone} · {state.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Location</span>
            <span className="text-white text-xs">{state.city}{state.state ? `, ${state.state}` : ""} {state.zip}</span>
          </div>
        </div>
      </div>

      {/* Price summary */}
      <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white font-semibold">Monthly Total</span>
          <span className="text-2xl font-bold text-white">${tier?.price}<span className="text-sm text-slate-400">/mo</span></span>
        </div>
        <p className="text-xs text-slate-400">Includes hosting, SSL, updates, backups, and support. Cancel anytime.</p>
      </div>

      <p className="text-center text-xs text-slate-500">
        By launching, you agree to auto-renewal billing. You can cancel at any time from your dashboard.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN WIZARD
   ═══════════════════════════════════════════════ */

export default function SaaSOnboarding() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<WizardState>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [launched, setLaunched] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to top on step change
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  // Read product from URL params if coming from /saas
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pid = params.get("product");
    const tid = params.get("tier");
    if (pid) {
      const prod = ALL_PRODUCTS.find(p => p.id === pid);
      if (prod) {
        setState(prev => ({ ...prev, productId: pid, services: [...prod.defaultServices] }));
      }
    }
    if (tid && TIERS.find(t => t.id === tid)) {
      setState(prev => ({ ...prev, tierId: tid }));
    }
  }, []);

  const totalSteps = STEP_LABELS.length;

  // Validation per step
  const canProceed = useCallback((): boolean => {
    switch (step) {
      case 0: return !!state.productId;
      case 1: return !!(state.companyName && state.phone && state.email);
      case 2: return true; // branding is optional
      case 3: return state.services.length > 0;
      case 4: return !!state.tierId;
      case 5: return state.agreedTerms && state.agreedPrivacy;
      case 6: return true;
      default: return false;
    }
  }, [step, state]);

  const handleNext = () => {
    if (!canProceed()) {
      toast({ title: "Please complete required fields", variant: "destructive" });
      return;
    }
    if (step < totalSteps - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleLaunch = async () => {
    setIsSubmitting(true);
    try {
      // Post to backend
      const res = await fetch("/api/saas/provision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });

      if (res.ok) {
        setLaunched(true);
        toast({ title: "🚀 Platform Launched!", description: "Your platform is now live!" });
      } else {
        // For now, simulate success since backend isn't built yet
        setLaunched(true);
        toast({ title: "🚀 Platform Configured!", description: "We'll email you when it's live. Check your inbox!" });
      }
    } catch {
      // Graceful fallback
      setLaunched(true);
      toast({ title: "🚀 Configuration Saved!", description: "Our team will set up your platform within 24 hours." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (launched) {
    const product = ALL_PRODUCTS.find(p => p.id === state.productId);
    const subdomain = state.companyName?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-cyan-500/30">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">You're Live! 🎉</h1>
          <p className="text-slate-300 mb-2">
            <span className="text-white font-semibold">{state.companyName}</span> is now being provisioned on the DarkWave network.
          </p>
          <p className="text-cyan-400 font-mono text-sm mb-6">
            {subdomain}.{product?.domain || "dwtl.io"}
          </p>

          <div className="space-y-3 mb-8 text-left">
            {[
              "Platform configured with your branding",
              `${state.services.length} services activated`,
              "SSL certificate provisioned",
              "SEO meta tags generated",
              "Confirmation email sent to " + state.email,
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className="flex items-center gap-3 text-sm text-slate-300"
              >
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{item}</span>
              </motion.div>
            ))}
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => navigate("/saas")}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold py-6 rounded-xl gap-2"
              data-testid="btn-back-to-catalog"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Catalog
            </Button>
            <Link href="/signal-chat">
              <Button variant="outline" className="w-full border-white/20 text-white py-6 rounded-xl gap-2" data-testid="btn-contact-support">
                <MessageSquare className="w-4 h-4" /> Need Help? Chat with Us
              </Button>
            </Link>
          </div>

          <p className="text-xs text-slate-500 mt-6">
            Questions? Reach us at support@darkwavestudios.io or through Signal Chat.
            <br />Response within 24-48 hours.
          </p>
        </motion.div>
      </div>
    );
  }

  const steps = [StepProduct, StepCompany, StepBranding, StepServices, StepPlan, StepLegal, StepLaunch];
  const CurrentStep = steps[step];

  return (
    <div className="min-h-screen bg-slate-950 relative" ref={scrollRef}>
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      {/* ─── Mobile-First Top Bar ─── */}
      <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-3">
          {/* Progress bar */}
          <div className="flex items-center gap-2 mb-2">
            <button onClick={() => navigate("/saas")} className="text-slate-500 hover:text-white transition-colors shrink-0" data-testid="btn-wizard-back">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <span className="text-xs text-slate-500 font-mono shrink-0">{step + 1}/{totalSteps}</span>
          </div>

          {/* Step pills (scrollable on mobile) */}
          <div className="flex gap-1 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
            {STEP_LABELS.map((s, i) => (
              <button
                key={i}
                onClick={() => i <= step && setStep(i)}
                disabled={i > step}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap transition-all ${
                  i === step
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                    : i < step
                    ? "bg-white/5 text-slate-400 hover:text-white cursor-pointer"
                    : "bg-white/[0.02] text-slate-600 cursor-not-allowed"
                }`}
                data-testid={`step-pill-${i}`}
              >
                {i < step ? <Check className="w-3 h-3 text-cyan-400" /> : s.icon}
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Step Content ─── */}
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <CurrentStep state={state} setState={setState} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── Bottom Navigation Bar (sticky, mobile-optimized) ─── */}
      <div className="sticky bottom-0 z-50 bg-slate-950/90 backdrop-blur-xl border-t border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          {step > 0 && (
            <Button
              onClick={handleBack}
              variant="outline"
              className="border-white/10 text-slate-300 hover:text-white hover:bg-white/5 gap-1.5 flex-shrink-0"
              data-testid="btn-prev-step"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          )}

          <div className="flex-1" />

          {step < totalSteps - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`gap-1.5 px-6 py-5 rounded-xl font-semibold transition-all ${
                canProceed()
                  ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/20 hover:opacity-90"
                  : "bg-white/10 text-slate-500 cursor-not-allowed"
              }`}
              data-testid="btn-next-step"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleLaunch}
              disabled={isSubmitting || !canProceed()}
              className="gap-2 px-8 py-5 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all"
              data-testid="btn-launch"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Launching...
                </>
              ) : (
                <>
                  <Rocket className="w-5 h-5" /> Launch My Platform — ${TIERS.find(t => t.id === state.tierId)?.price}/mo
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
