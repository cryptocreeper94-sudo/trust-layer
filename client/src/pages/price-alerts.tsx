import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Bell, Plus, Trash2, TrendingUp, TrendingDown,
  Volume2, Mail, MessageSquare, Smartphone, CheckCircle2, Clock, Lock, Wallet
} from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";
import { useAuth } from "@/hooks/use-auth";

interface Alert {
  id: string;
  token: string;
  condition: "above" | "below";
  price: number;
  currentPrice: number;
  channels: string[];
  active: boolean;
}

const TOKENS = ["DWC", "BTC", "ETH", "SOL", "USDC"];

export default function PriceAlerts() {
  const { user } = useAuth();
  const isConnected = !!user;
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newAlert, setNewAlert] = useState({
    token: "DWC",
    condition: "above" as "above" | "below",
    price: "",
  });

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const createAlert = () => {
    if (!newAlert.price) return;
    const alert: Alert = {
      id: Date.now().toString(),
      token: newAlert.token,
      condition: newAlert.condition,
      price: parseFloat(newAlert.price),
      currentPrice: newAlert.token === "DWC" ? 0.152 : newAlert.token === "BTC" ? 98500 : 3450,
      channels: ["push"],
      active: true,
    };
    setAlerts([...alerts, alert]);
    setShowCreate(false);
    setNewAlert({ token: "DWC", condition: "above", price: "" });
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
          <div className="container mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <img src={darkwaveLogo} alt="DarkWave" className="w-7 h-7" />
              <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
            </Link>
            <BackButton />
          </div>
        </nav>

        <main className="flex-1 pt-16 pb-8 px-4 flex items-center justify-center">
          <GlassCard glow className="p-8 text-center max-w-md">
            <Bell className="w-16 h-16 mx-auto mb-4 text-orange-400" />
            <h2 className="text-2xl font-bold mb-2">Price Alerts</h2>
            <p className="text-muted-foreground mb-6">
              Never miss a price movement. Set custom alerts and get notified via push, email, or Telegram.
            </p>
            <Link href="/wallet">
              <Button className="bg-gradient-to-r from-orange-500 to-red-500" data-testid="button-connect-alerts">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet to Set Alerts
              </Button>
            </Link>
          </GlassCard>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={darkwaveLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <BackButton />
        </div>
      </nav>

      <main className="flex-1 pt-16 pb-8 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <motion.div 
                className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30"
                animate={{ 
                  boxShadow: ["0 0 20px rgba(249,115,22,0.2)", "0 0 50px rgba(249,115,22,0.4)", "0 0 20px rgba(249,115,22,0.2)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Bell className="w-7 h-7 text-orange-400" />
              </motion.div>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
              Price <span className="text-orange-400">Alerts</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Never miss a price movement • Multi-channel notifications
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <GlassCard hover={false} className="p-3 text-center">
              <Bell className="w-5 h-5 mx-auto mb-1 text-purple-400" />
              <p className="text-xl font-bold">{alerts.filter(a => a.active).length}</p>
              <p className="text-[10px] text-muted-foreground">Active Alerts</p>
            </GlassCard>
            <GlassCard hover={false} className="p-3 text-center">
              <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xl font-bold">0</p>
              <p className="text-[10px] text-muted-foreground">Triggered Today</p>
            </GlassCard>
            <GlassCard hover={false} className="p-3 text-center">
              <Clock className="w-5 h-5 mx-auto mb-1 text-blue-400" />
              <p className="text-xl font-bold">24/7</p>
              <p className="text-[10px] text-muted-foreground">Monitoring</p>
            </GlassCard>
            <GlassCard hover={false} className="p-3 text-center">
              <Volume2 className="w-5 h-5 mx-auto mb-1 text-amber-400" />
              <p className="text-xl font-bold">3</p>
              <p className="text-[10px] text-muted-foreground">Channels</p>
            </GlassCard>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Your Alerts</h2>
            <Dialog open={showCreate} onOpenChange={setShowCreate}>
              <DialogTrigger asChild>
                <Button className="gap-2" data-testid="button-create-alert">
                  <Plus className="w-4 h-4" />
                  New Alert
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-background border-white/10">
                <DialogHeader>
                  <DialogTitle>Create Price Alert</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm mb-2 block">Token</label>
                    <Select value={newAlert.token} onValueChange={(v) => setNewAlert({ ...newAlert, token: v })}>
                      <SelectTrigger className="bg-white/5 border-white/10" data-testid="select-token">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TOKENS.map(t => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm mb-2 block">Condition</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={newAlert.condition === "above" ? "default" : "outline"}
                        onClick={() => setNewAlert({ ...newAlert, condition: "above" })}
                        className={newAlert.condition === "above" ? "bg-green-500" : ""}
                        data-testid="button-condition-above"
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Goes Above
                      </Button>
                      <Button
                        variant={newAlert.condition === "below" ? "default" : "outline"}
                        onClick={() => setNewAlert({ ...newAlert, condition: "below" })}
                        className={newAlert.condition === "below" ? "bg-red-500" : ""}
                        data-testid="button-condition-below"
                      >
                        <TrendingDown className="w-4 h-4 mr-2" />
                        Goes Below
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm mb-2 block">Price</label>
                    <Input
                      type="number"
                      placeholder="Enter price..."
                      value={newAlert.price}
                      onChange={(e) => setNewAlert({ ...newAlert, price: e.target.value })}
                      className="bg-white/5 border-white/10"
                      data-testid="input-alert-price"
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-2 block">Notification Channels</label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 gap-1">
                        <Smartphone className="w-3 h-3" />
                        Push
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 gap-1">
                        <Mail className="w-3 h-3" />
                        Email
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 gap-1">
                        <MessageSquare className="w-3 h-3" />
                        Telegram
                      </Button>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500" 
                    onClick={createAlert}
                    disabled={!newAlert.price}
                    data-testid="button-save-alert"
                  >
                    Create Alert
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.map((alert, i) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <GlassCard className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${alert.condition === "above" ? "bg-green-500/20" : "bg-red-500/20"}`}>
                          {alert.condition === "above" ? (
                            <TrendingUp className="w-5 h-5 text-green-400" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{alert.token}</span>
                            <span className="text-sm text-muted-foreground">
                              {alert.condition === "above" ? "rises above" : "falls below"}
                            </span>
                            <span className="font-mono text-primary">${alert.price}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              Current: ${alert.currentPrice}
                            </span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <div className="flex gap-1">
                              {alert.channels.includes("push") && <Badge variant="outline" className="text-[8px] px-1">Push</Badge>}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={alert.active} 
                          onCheckedChange={() => toggleAlert(alert.id)}
                          data-testid={`switch-alert-${alert.id}`}
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-400"
                          onClick={() => deleteAlert(alert.id)}
                          data-testid={`button-delete-${alert.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          ) : (
            <GlassCard className="p-8 text-center">
              <Bell className="w-12 h-12 mx-auto mb-4 text-white/10" />
              <h3 className="font-bold mb-2">No Alerts Yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first price alert to never miss a market move.
              </p>
              <Button onClick={() => setShowCreate(true)} data-testid="button-create-first-alert">
                <Plus className="w-4 h-4 mr-2" />
                Create Alert
              </Button>
            </GlassCard>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
