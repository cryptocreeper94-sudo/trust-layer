import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import {
  Building2,
  Shield,
  CheckCircle,
  AlertCircle,
  Globe,
  FileText,
  Users,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Lock,
  BadgeCheck,
  Sparkles,
  Clock,
  Zap,
  Key,
  Webhook
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { SimpleLoginModal } from "@/components/simple-login";

const businessBenefits = [
  { icon: BadgeCheck, title: "Verified Status", description: "Blockchain-backed business authenticity" },
  { icon: Key, title: "API Access", description: "Integrate trust verification into your systems" },
  { icon: Webhook, title: "Webhooks", description: "Real-time transaction notifications" },
  { icon: Users, title: "Team Seats", description: "Multiple users under one organization" },
  { icon: Zap, title: "2.5x Referral Bonus", description: "Enhanced rewards on all referrals" },
  { icon: Shield, title: "Priority Support", description: "Dedicated business support channel" },
];


const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

export default function BusinessApplication() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    businessName: "",
    einNumber: "",
    website: "",
    contactName: user?.displayName || user?.firstName || "",
    contactEmail: user?.email || "",
    contactPhone: "",
    businessDescription: "",
    intendedUse: "",
    employeeCount: "",
    country: "United States",
  });
  
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const isValidEIN = /^\d{2}-?\d{7}$/.test(formData.einNumber.replace(/\s/g, ""));
  const isValidWebsite = formData.website.includes(".") || formData.website === "";
  const isValidEmail = formData.contactEmail.includes("@") && formData.contactEmail.includes(".");
  
  const isStep1Valid = formData.businessName.length >= 2 && formData.contactEmail && isValidEmail;
  const isStep2Valid = formData.einNumber.length >= 9 && formData.businessDescription.length >= 20;
  const isStep3Valid = agreedToTerms;
  
  const submitMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/business/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit application");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted!",
        description: "We'll review your application and respond within 2-3 business days.",
      });
      navigate("/business-portal");
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleSubmit = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    submitMutation.mutate();
  };

  return (
    <div className="min-h-screen relative overflow-hidden pt-20 pb-12" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #3b82f6)" size={500} top="-5%" left="60%" />
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={400} top="40%" left="-10%" delay={3} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link href="/presale">
            <Button variant="ghost" size="sm" className="mb-4 text-white/60 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Presale
            </Button>
          </Link>
          
          <Badge className="mb-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30">
            <Building2 className="w-3 h-3 mr-1" />
            Business Verification
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-4">
            Business Member Application
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Join as a verified business to unlock API access, enhanced referral rewards, 
            and become a trusted partner in the Trust Layer network.
          </p>
        </motion.div>

        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= s 
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white" 
                    : "bg-white/10 text-white/40"
                }`}>
                  {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-12 h-1 mx-2 rounded ${step > s ? "bg-amber-500" : "bg-white/10"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <GlassCard glow className="p-6 md:p-8 mb-8">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Business Information</h2>
                <p className="text-white/60 text-sm">Tell us about your organization</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/70 mb-2 block">Business Name *</label>
                  <Input
                    placeholder="Your Company, LLC"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="bg-white/5 border-white/10"
                    data-testid="input-business-name"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/70 mb-2 block">Website</label>
                  <Input
                    placeholder="https://yourcompany.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className={`bg-white/5 border-white/10 ${formData.website && !isValidWebsite ? "border-red-500/50" : ""}`}
                    data-testid="input-website"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/70 mb-2 block">Contact Name *</label>
                  <Input
                    placeholder="John Smith"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="bg-white/5 border-white/10"
                    data-testid="input-contact-name"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/70 mb-2 block">Contact Email *</label>
                  <Input
                    type="email"
                    placeholder="john@company.com"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className={`bg-white/5 border-white/10 ${formData.contactEmail && !isValidEmail ? "border-red-500/50" : ""}`}
                    data-testid="input-contact-email"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/70 mb-2 block">Phone Number</label>
                  <Input
                    placeholder="+1 (555) 123-4567"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="bg-white/5 border-white/10"
                    data-testid="input-phone"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/70 mb-2 block">Employee Count</label>
                  <select
                    value={formData.employeeCount}
                    onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                    className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-md text-white"
                    data-testid="select-employees"
                  >
                    <option value="">Select...</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201-500">201-500</option>
                    <option value="500+">500+</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={() => setStep(2)} 
                  disabled={!isStep1Valid}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500"
                  data-testid="button-next-step1"
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
          
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Verification Details</h2>
                <p className="text-white/60 text-sm">We verify businesses to maintain network integrity</p>
              </div>
              
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <p className="text-amber-300 font-medium text-sm">Why We Verify</p>
                    <p className="text-white/60 text-xs mt-1">
                      Business verification prevents fraud and ensures every business in our network 
                      is legitimate. Your EIN is used only for verification and is stored securely.
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-white/70 mb-2 block">
                  EIN (Employer Identification Number) *
                </label>
                <Input
                  placeholder="XX-XXXXXXX"
                  value={formData.einNumber}
                  onChange={(e) => {
                    let val = e.target.value.replace(/[^\d-]/g, "");
                    if (val.length === 2 && !val.includes("-")) val += "-";
                    setFormData({ ...formData, einNumber: val.slice(0, 10) });
                  }}
                  className={`bg-white/5 border-white/10 font-mono ${
                    formData.einNumber && !isValidEIN ? "border-red-500/50" : ""
                  } ${isValidEIN ? "border-green-500/50" : ""}`}
                  data-testid="input-ein"
                />
                <p className="text-xs text-white/40 mt-1">
                  Format: XX-XXXXXXX (9 digits). Non-US businesses can use your tax ID or registration number.
                </p>
              </div>
              
              <div>
                <label className="text-sm text-white/70 mb-2 block">Business Description *</label>
                <Textarea
                  placeholder="Describe what your business does and how you plan to use the Trust Layer..."
                  value={formData.businessDescription}
                  onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                  className="bg-white/5 border-white/10 min-h-[100px]"
                  data-testid="input-description"
                />
                <p className="text-xs text-white/40 mt-1">
                  Minimum 20 characters ({formData.businessDescription.length}/20)
                </p>
              </div>
              
              <div>
                <label className="text-sm text-white/70 mb-2 block">Intended Use Case</label>
                <Textarea
                  placeholder="How do you plan to integrate with our API? What features are most important to you?"
                  value={formData.intendedUse}
                  onChange={(e) => setFormData({ ...formData, intendedUse: e.target.value })}
                  className="bg-white/5 border-white/10 min-h-[80px]"
                  data-testid="input-use-case"
                />
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)} className="border-white/20">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button 
                  onClick={() => setStep(3)} 
                  disabled={!isStep2Valid}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500"
                  data-testid="button-next-step2"
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
          
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Review & Submit</h2>
                <p className="text-white/60 text-sm">Please review your application before submitting</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-xs text-white/40 mb-1">Business Name</p>
                  <p className="text-white font-medium">{formData.businessName}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-xs text-white/40 mb-1">EIN</p>
                  <p className="text-white font-mono">{formData.einNumber}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-xs text-white/40 mb-1">Contact</p>
                  <p className="text-white">{formData.contactName}</p>
                  <p className="text-white/60 text-sm">{formData.contactEmail}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-xs text-white/40 mb-1">Website</p>
                  <p className="text-white">{formData.website || "Not provided"}</p>
                </div>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-xs text-white/40 mb-1">Business Description</p>
                <p className="text-white/80 text-sm">{formData.businessDescription}</p>
              </div>
              
              <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-purple-300 font-medium text-sm">What Happens Next</p>
                    <p className="text-white/60 text-xs mt-1">
                      Our team will review your application within 2-3 business days. 
                      You'll receive an email with your verification status and next steps.
                    </p>
                  </div>
                </div>
              </div>
              
              <label className="flex items-start gap-3 p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1"
                  data-testid="checkbox-terms"
                />
                <span className="text-sm text-white/70">
                  I certify that the information provided is accurate and that I am authorized to 
                  submit this application on behalf of the business. I agree to the{" "}
                  <Link href="/terms" className="text-cyan-400 hover:underline">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="text-cyan-400 hover:underline">Privacy Policy</Link>.
                </span>
              </label>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)} className="border-white/20">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={!isStep3Valid || submitMutation.isPending}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 min-w-[160px]"
                  data-testid="button-submit"
                >
                  {submitMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application <CheckCircle className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </GlassCard>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-bold text-white text-center mb-6">Business Member Benefits</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {businessBenefits.map((benefit, i) => (
              <GlassCard key={i} className="p-4 text-center">
                <benefit.icon className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-white mb-1">{benefit.title}</p>
                <p className="text-xs text-white/50">{benefit.description}</p>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      </div>
      
      <SimpleLoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onSuccess={() => {
          setShowLoginModal(false);
          submitMutation.mutate();
        }}
      />
    </div>
  );
}
