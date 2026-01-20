import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  ArrowLeft, Users, Shield, MapPin, Search, Globe, Building, 
  User, CheckCircle2, Star, ChevronRight, Filter, BadgeCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/glass-card";
import { Footer } from "@/components/footer";
import { useSimpleAuth } from "@/hooks/use-simple-auth";
import { useQuery } from "@tanstack/react-query";
import { MobileNav } from "@/components/mobile-nav";
import { WalletButton } from "@/components/wallet-button";

interface MemberProfile {
  id: number;
  displayName: string;
  memberNumber: number;
  location?: string;
  businessType?: string;
  isVerified: boolean;
  isEarlyAdopter: boolean;
  joinedAt: string;
}

export default function Members() {
  const { user } = useSimpleAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const { data: membersData, isLoading } = useQuery<{ members: MemberProfile[]; total: number }>({
    queryKey: ["/api/members/directory", searchQuery, locationFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (locationFilter) params.set("location", locationFilter);
      const res = await fetch(`/api/members/directory?${params}`);
      if (!res.ok) return { members: [], total: 0 };
      return res.json();
    },
  });

  const members = membersData?.members || [];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-cyan-900/20 pointer-events-none" />
      
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="w-full px-4 h-14 flex items-center justify-between">
          <Link href="/my-hub" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-display font-bold text-xl tracking-tight">Trust Circle</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <WalletButton />
            <MobileNav />
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 mb-4">
              <Shield className="w-3 h-3 mr-1" /> Verified Members
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Trust Circle Directory
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Find verified Trust Layer members near you. Connect with trusted businesses and individuals in your local community.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <GlassCard className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search by name or business..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-500/50"
                    data-testid="input-search-members"
                  />
                </div>
                <div className="relative md:w-64">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    placeholder="Filter by location..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-500/50"
                    data-testid="input-filter-location"
                  />
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/60">
                {membersData?.total || 0} verified members
              </p>
              <div className="flex items-center gap-2">
                <Badge className="bg-white/10 text-white/60">
                  <Filter className="w-3 h-3 mr-1" /> All Types
                </Badge>
              </div>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-40 bg-white/5 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : members.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((member) => (
                  <motion.div
                    key={member.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 hover:border-emerald-500/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center border border-emerald-500/30">
                        {member.businessType ? (
                          <Building className="w-6 h-6 text-emerald-400" />
                        ) : (
                          <User className="w-6 h-6 text-cyan-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold">{member.displayName}</h3>
                          {member.isVerified && (
                            <BadgeCheck className="w-4 h-4 text-emerald-400" />
                          )}
                        </div>
                        <p className="text-sm text-white/50">Member #{member.memberNumber}</p>
                        {member.location && (
                          <p className="text-sm text-white/40 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" /> {member.location}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          {member.isEarlyAdopter && (
                            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]">
                              <Star className="w-2 h-2 mr-1" /> Early Adopter
                            </Badge>
                          )}
                          {member.businessType && (
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-[10px]">
                              {member.businessType}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-emerald-400 transition-colors" />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <GlassCard className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Users className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Growing Trust Circle</h3>
                <p className="text-white/60 mb-6 max-w-md mx-auto">
                  The member directory is building as more people join and verify their profiles. Be one of the first to complete your profile and be discoverable!
                </p>
                <Link href="/profile/edit">
                  <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500">
                    Complete Your Profile
                  </Button>
                </Link>
              </GlassCard>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <GlassCard className="p-6 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-emerald-500/30">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="p-3 rounded-2xl bg-emerald-500/20">
                  <Shield className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-lg font-bold mb-1">Why Trust Circle?</h3>
                  <p className="text-white/60 text-sm">
                    All members are verified through the DarkWave Trust Layer. Find local businesses and individuals you can trust for transactions, collaborations, and partnerships.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Badge className="bg-white/10">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-400" /> Verified Identity
                  </Badge>
                  <Badge className="bg-white/10">
                    <Globe className="w-3 h-3 mr-1 text-cyan-400" /> Global Network
                  </Badge>
                </div>
              </div>
            </GlassCard>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
