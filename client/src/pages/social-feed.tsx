import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowLeft, MessageSquare, Heart, Share2, Repeat2, Send,
  Image, Smile, MoreHorizontal, TrendingUp, Users, Flame,
  Award, Coins, UserPlus, Bookmark
} from "lucide-react";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";

interface Post {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    verified: boolean;
    badge?: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  reposts: number;
  tips: number;
  liked: boolean;
  image?: string;
}

const POSTS: Post[] = [
  {
    id: "1",
    author: {
      name: "WhaleWatcher",
      handle: "whale.dwc",
      avatar: "🐋",
      verified: true,
      badge: "Top Trader",
    },
    content: "Just spotted a massive 500K DWC accumulation by a new wallet. This is extremely bullish! 🚀 The whale activity over the past 24 hours has been insane. Get ready for launch day! #DarkWave #DWC",
    timestamp: "2m ago",
    likes: 342,
    comments: 56,
    reposts: 89,
    tips: 1250,
    liked: false,
  },
  {
    id: "2",
    author: {
      name: "CryptoQueen",
      handle: "crypto_queen",
      avatar: "👑",
      verified: true,
      badge: "Diamond Hands",
    },
    content: "The new staking rewards are incredible! Just locked up my DWC for 365 days and earning 12.5% APY. This is the way 💎🙌",
    timestamp: "15m ago",
    likes: 189,
    comments: 34,
    reposts: 45,
    tips: 500,
    liked: true,
  },
  {
    id: "3",
    author: {
      name: "DeFi Degen",
      handle: "defi_king",
      avatar: "🎰",
      verified: false,
    },
    content: "Won 5,000 DWC on the crash game with a 25x multiplier! The arcade is absolutely addicting. Who else is grinding? 🎲",
    timestamp: "1h ago",
    likes: 98,
    comments: 23,
    reposts: 12,
    tips: 200,
    liked: false,
  },
  {
    id: "4",
    author: {
      name: "NFT Artist",
      handle: "pixel_dreams",
      avatar: "🎨",
      verified: true,
      badge: "Creator",
    },
    content: "Just minted my new collection on DarkWave NFT marketplace! 100 unique pieces inspired by the cosmos. First 50 buyers get a special airdrop 🌌✨",
    timestamp: "2h ago",
    likes: 456,
    comments: 78,
    reposts: 156,
    tips: 3200,
    liked: false,
    image: "nft-collection",
  },
];

const TRENDING_TOPICS = [
  { tag: "#DarkWaveLaunch", posts: 12500 },
  { tag: "#DWCStaking", posts: 8900 },
  { tag: "#NFTDrop", posts: 5600 },
  { tag: "#WhaleAlert", posts: 4200 },
  { tag: "#CrashGame", posts: 3100 },
];

const TOP_CREATORS = [
  { name: "WhaleWatcher", handle: "whale.dwc", avatar: "🐋", followers: 12500, tips: 45000 },
  { name: "CryptoQueen", handle: "crypto_queen", avatar: "👑", followers: 9800, tips: 32000 },
  { name: "NFT Artist", handle: "pixel_dreams", avatar: "🎨", followers: 7600, tips: 28000 },
];

function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);
  const [showTip, setShowTip] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  return (
    <GlassCard className="p-4">
      <div className="flex gap-3">
        <Avatar className="w-10 h-10 text-xl flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10">
          <span>{post.author.avatar}</span>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-sm">{post.author.name}</span>
            {post.author.verified && (
              <Badge className="bg-blue-500/20 text-blue-400 text-[8px] px-1">✓</Badge>
            )}
            {post.author.badge && (
              <Badge variant="outline" className="text-[8px]">{post.author.badge}</Badge>
            )}
            <span className="text-xs text-muted-foreground">@{post.author.handle}</span>
            <span className="text-xs text-muted-foreground">• {post.timestamp}</span>
          </div>
          
          <p className="text-sm mb-3 whitespace-pre-wrap">{post.content}</p>
          
          {post.image && (
            <div className="mb-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 h-48 flex items-center justify-center border border-white/10">
              <span className="text-4xl">🖼️</span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1 text-xs h-8"
              onClick={handleLike}
              data-testid={`button-like-${post.id}`}
            >
              <Heart className={`w-4 h-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
              {likes}
            </Button>
            <Button variant="ghost" size="sm" className="gap-1 text-xs h-8" data-testid={`button-comment-${post.id}`}>
              <MessageSquare className="w-4 h-4" />
              {post.comments}
            </Button>
            <Button variant="ghost" size="sm" className="gap-1 text-xs h-8" data-testid={`button-repost-${post.id}`}>
              <Repeat2 className="w-4 h-4" />
              {post.reposts}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1 text-xs h-8 text-yellow-400"
              onClick={() => setShowTip(!showTip)}
              data-testid={`button-tip-${post.id}`}
            >
              <Coins className="w-4 h-4" />
              {post.tips}
            </Button>
            <Button variant="ghost" size="sm" className="h-8" data-testid={`button-bookmark-${post.id}`}>
              <Bookmark className="w-4 h-4" />
            </Button>
          </div>

          <AnimatePresence>
            {showTip && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
              >
                <div className="flex gap-2">
                  {[10, 50, 100, 500].map((amount) => (
                    <Button 
                      key={amount}
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-xs"
                      data-testid={`button-tip-${amount}-${post.id}`}
                    >
                      {amount} DWC
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </GlassCard>
  );
}

export default function SocialFeed() {
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
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

              <Tabs defaultValue="following">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="following" data-testid="tab-following">Following</TabsTrigger>
                  <TabsTrigger value="trending" data-testid="tab-trending">Trending</TabsTrigger>
                  <TabsTrigger value="latest" data-testid="tab-latest">Latest</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-4">
                {POSTS.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <PostCard post={post} />
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <GlassCard className="p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  Trending Topics
                </h3>
                <div className="space-y-3">
                  {TRENDING_TOPICS.map((topic, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-primary">{topic.tag}</p>
                        <p className="text-xs text-muted-foreground">{topic.posts.toLocaleString()} posts</p>
                      </div>
                      <TrendingUp className="w-4 h-4 text-green-400" />
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
                        <span className="text-xl">{creator.avatar}</span>
                        <div>
                          <p className="font-medium text-sm">{creator.name}</p>
                          <p className="text-xs text-muted-foreground">{(creator.followers/1000).toFixed(1)}K followers</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="h-7 text-xs gap-1" data-testid={`button-follow-${creator.handle}`}>
                        <UserPlus className="w-3 h-3" />
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
                    <p className="text-lg font-bold">12.5K</p>
                    <p className="text-[10px] text-muted-foreground">Members</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 text-center">
                    <p className="text-lg font-bold">4.2K</p>
                    <p className="text-[10px] text-muted-foreground">Online Now</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 text-center">
                    <p className="text-lg font-bold">89K</p>
                    <p className="text-[10px] text-muted-foreground">Posts Today</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 text-center">
                    <p className="text-lg font-bold">250K</p>
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
