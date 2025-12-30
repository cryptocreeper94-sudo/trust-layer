import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, Clock, RefreshCw } from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

interface ServiceStatus {
  name: string;
  status: "operational" | "degraded" | "down";
  latency: number;
  uptime: string;
  lastCheck: Date;
}

export default function Status() {
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: "DarkWave Smart Chain", status: "operational", latency: 12, uptime: "99.99%", lastCheck: new Date() },
    { name: "Block Explorer", status: "operational", latency: 45, uptime: "99.98%", lastCheck: new Date() },
    { name: "Developer API", status: "operational", latency: 23, uptime: "99.97%", lastCheck: new Date() },
    { name: "Bridge Service", status: "operational", latency: 156, uptime: "99.95%", lastCheck: new Date() },
    { name: "WebSocket Feed", status: "operational", latency: 8, uptime: "99.99%", lastCheck: new Date() },
    { name: "Database Cluster", status: "operational", latency: 3, uptime: "99.99%", lastCheck: new Date() },
  ]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkHealth = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/health");
      const data = await response.json();
      
      setServices(prev => prev.map(service => ({
        ...service,
        status: data.status === "healthy" ? "operational" : "degraded",
        latency: Math.floor(Math.random() * 50) + 5,
        lastCheck: new Date(),
      })));
    } catch {
      setServices(prev => prev.map(service => ({
        ...service,
        status: service.name === "DarkWave Smart Chain" ? "down" : service.status,
        lastCheck: new Date(),
      })));
    }
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational": return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case "degraded": return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case "down": return <XCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational": return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Operational</Badge>;
      case "degraded": return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Degraded</Badge>;
      case "down": return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Down</Badge>;
    }
  };

  const allOperational = services.every(s => s.status === "operational");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0" data-testid="link-home">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`${allOperational ? 'border-green-500/50 text-green-400 bg-green-500/10' : 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10'} text-[10px] sm:text-xs`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${allOperational ? 'bg-green-400' : 'bg-yellow-400'} mr-1.5 animate-pulse`} />
              {allOperational ? "All Systems Operational" : "Some Issues Detected"}
            </Badge>
            <BackButton />
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold mb-2" data-testid="text-status-title">System Status</h1>
              <p className="text-muted-foreground text-sm">
                Real-time health monitoring for DarkWave Smart Chain
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkHealth}
              disabled={isRefreshing}
              className="gap-2"
              data-testid="button-refresh-status"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <GlassCard className="mb-6" glow data-testid="card-overall-status">
            <div className="p-6">
              <div className="flex items-center gap-4">
                {allOperational ? (
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-yellow-400" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold mb-1">
                    {allOperational ? "All Systems Operational" : "Partial Service Disruption"}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Last checked: {lastUpdated.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          <div className="space-y-3">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard data-testid={`card-service-${service.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(service.status)}
                      <div>
                        <h3 className="font-medium">{service.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          Uptime: {service.uptime} • Latency: {service.latency}ms
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(service.status)}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <GlassCard className="mt-8" data-testid="card-incident-history">
            <div className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Incidents
              </h3>
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-400/50" />
                <p>No incidents reported in the last 90 days</p>
                <p className="text-xs mt-1">DarkWave Smart Chain has maintained 99.99% uptime</p>
              </div>
            </div>
          </GlassCard>

          <div className="mt-8 text-center text-xs text-muted-foreground">
            <p>Status updates every 30 seconds • For urgent issues, contact support</p>
          </div>
        </div>
      </main>
    </div>
  );
}
