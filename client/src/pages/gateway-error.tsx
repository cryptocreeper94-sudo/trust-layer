import { useEffect, useState } from "react";
import { ArrowRight, AlertCircle, Construction } from "lucide-react";

type ErrorType = "not-found" | "no-website" | "under-construction";

export default function GatewayError() {
  const [errorType, setErrorType] = useState<ErrorType>("not-found");
  const [domainName, setDomainName] = useState<string>("");

  useEffect(() => {
    // Get domain name from hostname
    const host = window.location.hostname;
    const parts = host.split(".");
    
    if (parts.length > 2) {
      // Extract subdomain (e.g., "alice" from "alice.dwsc.io")
      const subdomain = parts[0];
      setDomainName(subdomain);
    }

    // Determine error type from query parameter or hash
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error") as ErrorType | null;
    if (error && ["not-found", "no-website", "under-construction"].includes(error)) {
      setErrorType(error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-950 flex items-center justify-center p-4">
      {/* Ambient glow orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Error card with glassmorphism */}
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 shadow-2xl">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            {errorType === "not-found" && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-full">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
            )}
            {errorType === "no-website" && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-full">
                <AlertCircle className="w-8 h-8 text-yellow-400" />
              </div>
            )}
            {errorType === "under-construction" && (
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-full">
                <Construction className="w-8 h-8 text-blue-400" />
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-3 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {errorType === "not-found" && "Domain Not Found"}
            {errorType === "no-website" && "No Website Configured"}
            {errorType === "under-construction" && "Under Construction"}
          </h1>

          {/* Message */}
          <p className="text-center text-slate-300 mb-6">
            {errorType === "not-found" && (
              <>
                The domain <span className="font-mono text-cyan-400">{domainName}.dwsc</span> is not registered.
              </>
            )}
            {errorType === "no-website" && (
              <>
                The domain <span className="font-mono text-cyan-400">{domainName}.dwsc</span> exists but hasn't configured a website yet.
              </>
            )}
            {errorType === "under-construction" && (
              <>
                The domain <span className="font-mono text-cyan-400">{domainName}.dwsc</span> is under construction.
              </>
            )}
          </p>

          {/* Details */}
          <div className="bg-slate-950/50 border border-slate-700/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-slate-400">
              {errorType === "not-found" && (
                "This domain is not yet registered on the DarkWave ecosystem. Search and register your .dwsc domain at "
              )}
              {errorType === "no-website" && (
                "Domain owners can configure their website in the Domain Manager. This domain hasn't been set up yet. "
              )}
              {errorType === "under-construction" && (
                "The domain owner is currently setting up their website. Please check back later. "
              )}
              <span className="text-cyan-400 font-medium">dwsc.io/domains</span>
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <a
              href="https://dwsc.io/domains"
              className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 group"
              data-testid="button-domain-search"
            >
              Search Domains
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="https://dwsc.io"
              className="w-full px-4 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition-all duration-300 border border-slate-600/50"
              data-testid="button-home"
            >
              Back to Home
            </a>
          </div>

          {/* Footer */}
          <p className="text-xs text-slate-500 text-center mt-6">
            DarkWave Smart Chain • .dwsc Domain Gateway
          </p>
        </div>
      </div>
    </div>
  );
}
