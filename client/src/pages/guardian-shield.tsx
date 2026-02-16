import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Sparkles, Radar, Brain, TrendingUp, Calendar, Download, Share, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GuardianShieldPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const existingManifest = document.querySelector('link[rel="manifest"]');
    const screenerManifest = document.createElement('link');
    screenerManifest.rel = 'manifest';
    screenerManifest.href = '/manifest-guardian-screener.webmanifest';
    if (existingManifest) existingManifest.remove();
    document.head.appendChild(screenerManifest);

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute('content', '#06b6d4');

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/guardian-screener-sw.js', { scope: '/guardian-shield' }).catch(() => {});
    }

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      if (existingManifest) document.head.appendChild(existingManifest);
      screenerManifest.remove();
      if (themeColor) themeColor.setAttribute('content', '#00ffff');
    };
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIos) {
        alert('To install: tap the Share button in Safari, then "Add to Home Screen"');
      } else {
        alert('To install: open the browser menu (three dots) and tap "Install app" or "Add to Home Screen"');
      }
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <main className="min-h-screen pt-14 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" data-testid="guardian-shield-page">
      <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-full" />
          
          <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 text-center">
            <motion.div
              animate={{ 
                boxShadow: [
                  '0 0 30px rgba(6, 182, 212, 0.3)',
                  '0 0 60px rgba(168, 85, 247, 0.3)',
                  '0 0 30px rgba(236, 72, 153, 0.3)',
                  '0 0 60px rgba(6, 182, 212, 0.3)'
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 p-[2px]"
            >
              <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center">
                <Shield className="w-12 h-12 text-cyan-400" />
              </div>
            </motion.div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 mb-6">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-cyan-400">Under Development</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Guardian Screener
            </h1>
            
            <p className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-semibold mb-6">
              Advanced DEX Screener & Security Monitor
            </p>

            <p className="text-slate-300 mb-8 leading-relaxed">
              We're building something special. Guardian Screener will be a high-powered DEX screener with 
              AI-driven threat detection, predictive market intelligence, and real-time security monitoring. 
              We're taking the time to get this right — so when it launches, it will be exactly what 
              the Trust Layer community deserves.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <Brain className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">AI Capabilities</p>
                <p className="text-xs text-slate-400">Smart pattern detection</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">Predictive Analytics</p>
                <p className="text-xs text-slate-400">Market intelligence</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <Radar className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">Real-Time Scanning</p>
                <p className="text-xs text-slate-400">24/7 monitoring</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-purple-500/30 mb-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                <span className="text-lg font-bold text-white">Launching at TGE</span>
              </div>
              <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                Coming Soon
              </p>
              <p className="text-sm text-slate-400 mt-2">Token Generation Event</p>
            </div>

            {!isInstalled && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-6"
              >
                <button
                  onClick={handleInstallPWA}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold text-white text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: 'linear-gradient(135deg, #06b6d4, #8b5cf6, #ec4899)',
                    boxShadow: '0 0 30px rgba(6, 182, 212, 0.3), 0 0 60px rgba(139, 92, 246, 0.15)',
                  }}
                  data-testid="button-install-screener"
                >
                  <Download className="w-5 h-5" />
                  Install Guardian Screener
                  <Smartphone className="w-5 h-5" />
                </button>
                <p className="text-xs text-slate-500 mt-3">
                  Add to your home screen for instant access
                </p>
              </motion.div>
            )}

            {isInstalled && (
              <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30">
                <Sparkles className="w-4 h-4 text-green-400" />
                <span className="text-sm font-semibold text-green-400">Installed on your device</span>
              </div>
            )}

            <motion.div 
              className="flex items-center justify-center gap-2 text-slate-400"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm">Hang tight — it's going to be worth the wait</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
