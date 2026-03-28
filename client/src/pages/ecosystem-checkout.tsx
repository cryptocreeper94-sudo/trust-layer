import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, Lock, ArrowRight, Wallet, CheckCircle2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function EcosystemCheckout() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [productDetails, setProductDetails] = useState<{
    appName: string;
    productName: string;
    description: string;
    priceDetails: string;
  } | null>(null);

  const searchParams = new URLSearchParams(window.location.search);
  const appParam = searchParams.get("app");
  const productParam = searchParams.get("product");
  const returnUrl = searchParams.get("returnUrl");

  // Registry of known external ecosystem products for display purposes before checkout
  const productRegistry: Record<string, any> = {
    "arbora_premium": {
      appName: "Arbora",
      productName: "Arbora Premium Access",
      description: "Unlock advanced predictive forestry analytics and unlimited canopy queries.",
      priceDetails: "$49 / month"
    },
    "veil_audio": {
      appName: "Through the Veil",
      productName: "Premium Audio Narration",
      description: "Lifetime access to the AI-voiced audiobook chapters for Through the Veil.",
      priceDetails: "$15 one-time"
    },
    "trust_book_pro": {
      appName: "Trust Book",
      productName: "Trust Book Professional",
      description: "Enhanced identity verification and multi-signature security ledgers.",
      priceDetails: "$29 / month"
    }
  };

  useEffect(() => {
    document.title = "Trust Layer Ecosystem | Secure Checkout";
    
    // Check if we have valid params
    if (!appParam || !productParam || !returnUrl) {
      toast({
        title: "Invalid Checkout Session",
        description: "Missing required ecosystem routing parameters.",
        variant: "destructive"
      });
      return;
    }

    const key = `${appParam}_${productParam}`.toLowerCase();
    const knownProduct = productRegistry[key];

    if (knownProduct) {
      setProductDetails(knownProduct);
    } else {
      // Fallback for dynamic/unregistered products passed through query params
      setProductDetails({
        appName: appParam.charAt(0).toUpperCase() + appParam.slice(1),
        productName: productParam.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
        description: "Ecosystem Partner Digital Asset or Subscription",
        priceDetails: "Calculated at secure terminal"
      });
    }
  }, [appParam, productParam, returnUrl, toast]);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      // Hit the centralized universal checkout route
      const response = await apiRequest("POST", "/api/checkout/universal", {
        app: appParam,
        product: productParam,
        returnUrl: returnUrl,
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No Stripe checkout URL returned.");
      }
    } catch (err: any) {
      toast({
        title: "Checkout Initialization Failed",
        description: err.message || "Could not generate secure session.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (returnUrl) {
      window.location.href = returnUrl;
    } else {
      setLocation("/");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#020617] relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background Ambience */}
      <div className="absolute top-1/4 -left-1/4 w-[1000px] h-[1000px] bg-cyan-900/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-[1000px] h-[1000px] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 w-full max-w-xl">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
              <ShieldCheck className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Central Authorization</h1>
            <p className="text-slate-400">Trust Layer Global Ecosystem Hub</p>
          </div>

          {!productDetails ? (
             <div className="flex justify-center p-12">
               <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
             </div>
          ) : (
            <GlassCard glow className="overflow-hidden border-cyan-500/20">
              {/* Receipt Header */}
              <div className="bg-slate-900/50 p-6 sm:p-8 border-b border-white/5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1 block">
                      Target Protocol: {productDetails.appName}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      {productDetails.productName}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-white block">
                       {productDetails.priceDetails}
                    </span>
                  </div>
                </div>
                <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                  {productDetails.description}
                </p>
              </div>

              {/* Security Badges */}
              <div className="p-6 sm:p-8 bg-slate-950/30">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">End-to-End Encrypted</p>
                      <p className="text-xs text-slate-500">Processed natively via Stripe Terminal</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                      <Wallet className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">Unified Portfolio Unlocked</p>
                      <p className="text-xs text-slate-500">Instant cross-platform state sync</p>
                    </div>
                  </li>
                </ul>

                <Button 
                  onClick={handleCheckout} 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 py-6 text-base font-semibold shadow-lg shadow-cyan-500/20"
                >
                  {isLoading ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Securing Session...</>
                  ) : (
                    <><Lock className="w-4 h-4 mr-2" /> Continue to Secure Payment <ArrowRight className="w-4 h-4 ml-2" /></>
                  )}
                </Button>
                
                <button 
                  onClick={handleCancel}
                  className="w-full mt-4 py-3 text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Cancel and return to {productDetails.appName}
                </button>
              </div>
            </GlassCard>
          )}

          <div className="mt-8 text-center px-4">
            <p className="text-xs text-slate-600">
              Payments are processed centrally by DarkWave Technologies LLC for the Trust Layer Ecosystem.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
