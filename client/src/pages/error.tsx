import { Link } from "wouter";
import { Home, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function ErrorPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-8 p-8 relative z-10"
      >
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="flex items-center justify-center gap-4"
        >
          <AlertTriangle className="h-16 w-16 text-red-500" data-testid="icon-500" />
          <h1 className="text-8xl font-display font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent" data-testid="text-500">
            500
          </h1>
        </motion.div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold" data-testid="text-server-error">Something Went Wrong</h2>
          <p className="text-muted-foreground max-w-md mx-auto" data-testid="text-500-description">
            We're experiencing technical difficulties. Our team has been notified 
            and is working to fix the issue.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white gap-2"
            data-testid="button-retry"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" className="gap-2" data-testid="button-go-home">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <div className="pt-8 space-y-2">
          <p className="text-sm text-muted-foreground" data-testid="text-status-link">
            Check our{" "}
            <Link href="/status" className="text-primary hover:underline" data-testid="link-status-page">
              Status Page
            </Link>{" "}
            for system updates
          </p>
          <p className="text-xs text-muted-foreground" data-testid="text-support-email">
            Need help? Contact{" "}
            <a href="mailto:support@darkwavestudios.io" className="text-primary hover:underline" data-testid="link-support-email">
              support@darkwavestudios.io
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
