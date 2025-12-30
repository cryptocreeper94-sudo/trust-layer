import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  MessageSquare, Heart, Share2, Repeat2, Send,
  Image, Smile, TrendingUp, Users, Flame,
  Award, Coins, UserPlus, PenSquare, Sparkles
} from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";
import { useAuth } from "@/hooks/use-auth";

// Simulated global community stats (would come from API)
const COMMUNITY_STATS = {
  members: 12847,
  onlineNow: 423,
  postsToday: 156,
  tipsSent: "45.2K",
};

const TRENDING_TOPICS = [
  { tag: "#DWCMoon", posts: 234 },
  { tag: "#StakingRewards", posts: 189 },
  { tag: "#NFTLaunch", posts: 145 },
  { tag: "#BridgeLive", posts: 98 },
];

const TOP_CREATORS = [
  { name: "CryptoVision", followers: "12.4K", tips: "8,500 DWC" },
  { name: "DarkWaveAlpha", followers: "9.8K", tips: "6,200 DWC" },
  { name: "ChainAnalyst", followers: "7.2K", tips: "4,100 DWC" },
];

const FEATURED_POSTS = [
  {
    id: "1",
    author: "DarkWaveTeam",
    handle: "@darkwave_official",
    verified: true,
    content: "Bridge to Ethereum is now LIVE! Lock your DWC and receive wDWC on Ethereum. Cross-chain future is here 🚀",
    likes: 847,
    comments: 156,
    reposts: 234,
    tips: "2,450 DWC",
    time: "2h ago",
  },
  {
    id: "2",
    author: "CryptoVision",
    handle: "@cryptovision",
    verified: false,
    content: "Just hit 100K DWC staked! The APY on this chain is unreal. Who else is diamond handing? 💎",
    likes: 423,
    comments: 67,
    reposts: 89,
    tips: "850 DWC",
    time: "4h ago",
  },
];

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
          <BackButton />
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
              {/* Compose Post */}
              <GlassCard glow className="p-4">
                <div className="flex gap-3">
                  <Avatar className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500">
                    <AvatarFallback>
                      {isConnected ? "👤" : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder={isConnected ? "What's happening in DarkWave?" : "Connect wallet to post..."}
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="bg-white/5 border-white/10 min-h-[80px] resize-none mb-3"
                      disabled={!isConnected}
                      data-testid="input-new-post"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8" disabled={!isConnected}>
                          <Image className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8" disabled={!isConnected}>
                          <Smile className="w-4 h-4" />
                        </Button>
                      </div>
                      {isConnected ? (
                        <Button 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 gap-2"
                          disabled={!newPost.trim()}
                          data-testid="button-post"
                        >
                          <Send className="w-4 h-4" />
                          Post
                        </Button>
                      ) : (
                        <Link href="/wallet">
                          <Button className="bg-gradient-to-r from-blue-500 to-cyan-500" data-testid="button-connect-social">
                            Connect Wallet
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>

              <Tabs defaultValue="featured">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="featured" data-testid="tab-featured">Featured</TabsTrigger>
                  <TabsTrigger value="following" data-testid="tab-following">Following</TabsTrigger>
                  <TabsTrigger value="latest" data-testid="tab-latest">Latest</TabsTrigger>
                </TabsList>

                <TabsContent value="featured" className="space-y-4 mt-4">
                  {FEATURED_POSTS.map((post) => (
                    <GlassCard key={post.id} className="p-4">
                      <div className="flex gap-3">
                        <Avatar className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500">
                          <AvatarFallback>{post.author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold">{post.author}</span>
                            {post.verified && (
                              <Badge className="bg-blue-500/20 text-blue-400 text-[9px] px-1">✓</Badge>
                            )}
                            <span className="text-sm text-muted-foreground">{post.handle}</span>
                            <span className="text-xs text-muted-foreground">• {post.time}</span>
                          </div>
                          <p className="text-sm mb-3">{post.content}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex gap-4">
                              <button className="flex items-center gap-1 text-muted-foreground hover:text-pink-400 transition-colors">
                                <Heart className="w-4 h-4" />
                                <span className="text-xs">{post.likes}</span>
                              </button>
                              <button className="flex items-center gap-1 text-muted-foreground hover:text-blue-400 transition-colors">
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-xs">{post.comments}</span>
                              </button>
                              <button className="flex items-center gap-1 text-muted-foreground hover:text-green-400 transition-colors">
                                <Repeat2 className="w-4 h-4" />
                                <span className="text-xs">{post.reposts}</span>
                              </button>
                            </div>
                            <Badge className="bg-amber-500/20 text-amber-400 text-[10px]">
                              <Coins className="w-3 h-3 mr-1" />
                              {post.tips}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </TabsContent>

                <TabsContent value="following" className="mt-4">
                  <GlassCard className="p-8 text-center">
                    {isConnected ? (
                      <>
                        <UserPlus className="w-12 h-12 mx-auto mb-4 text-white/10" />
                        <h3 className="font-bold mb-2">Your Feed is Empty</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Follow other users to see their posts here.
                        </p>
                        <Button variant="outline">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Discover People
                        </Button>
                      </>
                    ) : (
                      <>
                        <Users className="w-12 h-12 mx-auto mb-4 text-white/10" />
                        <h3 className="font-bold mb-2">Connect to See Your Feed</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Connect your wallet to follow users and see their posts.
                        </p>
                        <Link href="/wallet">
                          <Button className="bg-gradient-to-r from-blue-500 to-cyan-500">
                            Connect Wallet
                          </Button>
                        </Link>
                      </>
                    )}
                  </GlassCard>
                </TabsContent>

                <TabsContent value="latest" className="space-y-4 mt-4">
                  {FEATURED_POSTS.slice().reverse().map((post) => (
                    <GlassCard key={post.id} className="p-4">
                      <div className="flex gap-3">
                        <Avatar className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500">
                          <AvatarFallback>{post.author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold">{post.author}</span>
                            {post.verified && (
                              <Badge className="bg-blue-500/20 text-blue-400 text-[9px] px-1">✓</Badge>
                            )}
                            <span className="text-sm text-muted-foreground">{post.handle}</span>
                            <span className="text-xs text-muted-foreground">• {post.time}</span>
                          </div>
                          <p className="text-sm mb-3">{post.content}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex gap-4">
                              <button className="flex items-center gap-1 text-muted-foreground hover:text-pink-400 transition-colors">
                                <Heart className="w-4 h-4" />
                                <span className="text-xs">{post.likes}</span>
                              </button>
                              <button className="flex items-center gap-1 text-muted-foreground hover:text-blue-400 transition-colors">
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-xs">{post.comments}</span>
                              </button>
                              <button className="flex items-center gap-1 text-muted-foreground hover:text-green-400 transition-colors">
                                <Repeat2 className="w-4 h-4" />
                                <span className="text-xs">{post.reposts}</span>
                              </button>
                            </div>
                            <Badge className="bg-amber-500/20 text-amber-400 text-[10px]">
                              <Coins className="w-3 h-3 mr-1" />
                              {post.tips}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-4">
              <GlassCard className="p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  Trending Topics
                </h3>
                <div className="space-y-2">
                  {TRENDING_TOPICS.map((topic, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                      <span className="font-medium text-blue-400">{topic.tag}</span>
                      <span className="text-xs text-muted-foreground">{topic.posts} posts</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  Top Creators
                </h3>
                <div className="space-y-3">
                  {TOP_CREATORS.map((creator, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500">
                          <AvatarFallback className="text-xs">{creator.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{creator.name}</p>
                          <p className="text-xs text-muted-foreground">{creator.followers} followers</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        Follow
                      </Button>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  Community Stats
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 rounded-lg bg-white/5 text-center">
                    <p className="text-lg font-bold">{COMMUNITY_STATS.members.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">Members</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 text-center">
                    <p className="text-lg font-bold text-green-400">{COMMUNITY_STATS.onlineNow}</p>
                    <p className="text-[10px] text-muted-foreground">Online Now</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 text-center">
                    <p className="text-lg font-bold">{COMMUNITY_STATS.postsToday}</p>
                    <p className="text-[10px] text-muted-foreground">Posts Today</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 text-center">
                    <p className="text-lg font-bold text-amber-400">{COMMUNITY_STATS.tipsSent}</p>
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
