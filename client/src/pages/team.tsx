import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Settings, Users, Shield, Database, Code, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/glass-card";
import { Footer } from "@/components/footer";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

export default function Team() {
  const adminLinks = [
    { title: "DarkWave Studio", href: "/studio", icon: Code, description: "Web IDE and development environment" },
    { title: "Developer Portal", href: "/developer-portal", icon: Shield, description: "API keys and developer access" },
    { title: "Treasury", href: "/treasury", icon: Database, description: "Token treasury management" },
    { title: "Billing Admin", href: "/billing", icon: Settings, description: "Subscriptions and payments" },
    { title: "Block Explorer", href: "/explorer", icon: Rocket, description: "Blockchain explorer and stats" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight">DarkWave</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-white">
              <ArrowLeft className="w-4 h-4" /> Home
            </Button>
          </Link>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-4 flex-1">
        <div className="container max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-4">
                <Users className="w-4 h-4" />
                <span>Team Access</span>
              </div>
              <h1 className="text-3xl font-display font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, Creator</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {adminLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <GlassCard hover className="h-full">
                    <div className="p-5 flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <link.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white mb-1">{link.title}</h3>
                        <p className="text-sm text-muted-foreground">{link.description}</p>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
