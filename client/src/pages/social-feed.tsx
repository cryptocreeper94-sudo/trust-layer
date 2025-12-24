import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowLeft, MessageSquare, Heart, Share2, Repeat2, Send,
  Image, Smile, MoreHorizontal, TrendingUp, Users, Flame,
  Award, Coins, UserPlus, Bookmark, Lock, PenSquare
} from "lucide-react";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";
import { useAuth } from "@/hooks/use-auth";

export default function SocialFeed() {
  const { user } = useAuth();
  const isConnected = !!user;
  const [newPost, setNewPost] = useState("");

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={darkwaveLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <Link href="/dashboard-pro">
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              <ArrowLeft className="w-3 h-3 mr-1" />
              Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      <main className="flex-1 pt-16 pb-8 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <motion.div 
                className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30"
                animate={{ 
                  boxShadow: ["0 0 20px rgba(59,130,246,0.2)", "0 0 50px rgba(59,130,246,0.4)", "0 0 20px rgba(59,130,246,0.2)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Users className="w-7 h-7 text-blue-400" />
              </motion.div>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
              Social <span className="text-blue-400">Feed</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Connect with the DarkWave community • Share insights • Tip creators
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              {isConnected ? (
                <GlassCard glow className="p-4">
                  <div className="flex gap-3">
                    <Avatar className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500">
                      <span className="text-lg">👤</span>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="What's happening in DarkWave?"
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="bg-white/5 border-white/10 min-h-[80px] resize-none mb-3"
                        data-testid="input-new-post"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="h-8">
                            <Image className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8">
                            <Smile className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 gap-2"
                          disabled={!newPost.trim()}
                          data-testid="button-post"
                        >
                          <Send className="w-4 h-4" />
                          Post
                        </Button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ) : (
                <GlassCard glow className="p-6 text-center">
                  <Lock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-bold text-lg mb-2">Join the Conversation</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect your wallet to post, comment, and tip other users.
                  </p>
                  <Link href="/wallet">
                    <Button className="bg-gradient-to-r from-blue-500 to-cyan-500" data-testid="button-connect-social">
                      <Users className="w-4 h-4 mr-2" />
                      Connect Wallet
                    </Button>
                  </Link>
                </GlassCard>
              )}

              <Tabs defaultValue="following">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="following" data-testid="tab-following">Following</TabsTrigger>
                  <TabsTrigger value="trending" data-testid="tab-trending">Trending</TabsTrigger>
                  <TabsTrigger value="latest" data-testid="tab-latest">Latest</TabsTrigger>
                </TabsList>
              </Tabs>

              <GlassCard className="p-8 text-center">
                <PenSquare className="w-16 h-16 mx-auto mb-4 text-white/10" />
                <h3 className="font-bold text-lg mb-2">No Posts Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {isConnected 
                    ? "Be the first to share something with the community!"
                    : "Connect your wallet to see posts from people you follow."
                  }
                </p>
                {isConnected && (
                  <Button className="bg-gradient-to-r from-blue-500 to-cyan-500" data-testid="button-create-first-post">
                    <PenSquare className="w-4 h-4 mr-2" />
                    Create First Post
                  </Button>
                )}
              </GlassCard>
            </div>

            <div className="space-y-4">
              <GlassCard className="p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  Trending Topics
                </h3>
                <div className="text-center py-6 text-muted-foreground">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No trending topics yet</p>
                  <p className="text-xs">Start posting to create trends</p>
                </div>
              </GlassCard>

              <GlassCard className="p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  Top Creators
                </h3>
                <div className="text-center py-6 text-muted-foreground">
                  <Award className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No creators yet</p>
                  <p className="text-xs">Top contributors will appear here</p>
                </div>
              </GlassCard>

              <GlassCard className="p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  Community Stats
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 rounded-lg bg-white/5 text-center">
                    <p className="text-lg font-bold">--</p>
                    <p className="text-[10px] text-muted-foreground">Members</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 text-center">
                    <p className="text-lg font-bold">--</p>
                    <p className="text-[10px] text-muted-foreground">Online Now</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 text-center">
                    <p className="text-lg font-bold">--</p>
                    <p className="text-[10px] text-muted-foreground">Posts Today</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 text-center">
                    <p className="text-lg font-bold">--</p>
                    <p className="text-[10px] text-muted-foreground">Tips Sent</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
