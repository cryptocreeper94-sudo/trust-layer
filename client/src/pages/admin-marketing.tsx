import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Send, Plus, Trash2, Edit3, Save, X, RefreshCw, 
  MessageSquare, Hash, Settings, Clock, CheckCircle2, 
  XCircle, Loader2, AlertTriangle, Zap, Globe, Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MobileNav } from "@/components/mobile-nav";
import { Link } from "wouter";

interface MarketingPost {
  id: string;
  platform: string;
  content: string;
  imageUrl: string | null;
  category: string;
  status: string;
  usedCount: number;
  lastUsedAt: string | null;
  createdAt: string;
}

interface ScheduleConfig {
  id: string;
  platform: string;
  isActive: boolean;
  intervalMinutes: number;
  lastDeployedAt: string | null;
  webhookUrl: string | null;
  channelId: string | null;
  updatedAt: string;
}

interface DeployLog {
  id: string;
  postId: string;
  platform: string;
  status: string;
  externalId: string | null;
  errorMessage: string | null;
  deployedAt: string;
}

const PLATFORMS = [
  { id: "discord", label: "Discord", icon: "💬", color: "from-indigo-500 to-purple-600" },
  { id: "telegram", label: "Telegram", icon: "✈️", color: "from-blue-400 to-cyan-500" },
  { id: "twitter", label: "X (Twitter)", icon: "𝕏", color: "from-gray-700 to-gray-900" },
  { id: "facebook", label: "Facebook", icon: "📘", color: "from-blue-600 to-blue-800" },
];

const CATEGORIES = ["general", "vision", "tech", "community", "hype", "news"];

export default function AdminMarketing() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [newPost, setNewPost] = useState({ platform: "discord", content: "", imageUrl: "", category: "general" });
  const [editingPost, setEditingPost] = useState<MarketingPost | null>(null);
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  // Fetch posts
  const { data: postsData, isLoading: loadingPosts } = useQuery({
    queryKey: ["/api/marketing/posts", selectedPlatform],
    queryFn: async () => {
      const params = selectedPlatform !== "all" ? `?platform=${selectedPlatform}` : "";
      const res = await fetch(`/api/marketing/posts${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
  });

  // Fetch configs
  const { data: configsData } = useQuery({
    queryKey: ["/api/marketing/config"],
    queryFn: async () => {
      const res = await fetch("/api/marketing/config", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch configs");
      return res.json();
    },
  });

  // Fetch logs
  const { data: logsData } = useQuery({
    queryKey: ["/api/marketing/logs"],
    queryFn: async () => {
      const res = await fetch("/api/marketing/logs", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch logs");
      return res.json();
    },
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (post: typeof newPost) => {
      const res = await fetch("/api/marketing/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(post),
      });
      if (!res.ok) throw new Error("Failed to create post");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/marketing/posts"] });
      setNewPost({ platform: "discord", content: "", imageUrl: "", category: "general" });
      setShowNewPostForm(false);
      toast({ title: "Post created", description: "New marketing post added to library" });
    },
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/marketing/posts/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete post");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/marketing/posts"] });
      toast({ title: "Post deleted" });
    },
  });

  // Deploy mutation
  const deployMutation = useMutation({
    mutationFn: async ({ platform, postId }: { platform: string; postId?: string }) => {
      const res = await fetch(`/api/marketing/deploy/${platform}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ postId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to deploy");
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/marketing/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/marketing/logs"] });
      if (data.success) {
        toast({ title: "Deployed!", description: `Posted to ${data.post?.platform}` });
      } else {
        toast({ title: "Deploy failed", description: data.result?.error, variant: "destructive" });
      }
    },
    onError: (error: Error) => {
      toast({ title: "Deploy failed", description: error.message, variant: "destructive" });
    },
  });

  // Update config mutation
  const updateConfigMutation = useMutation({
    mutationFn: async ({ platform, config }: { platform: string; config: Partial<ScheduleConfig> }) => {
      const res = await fetch(`/api/marketing/config/${platform}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error("Failed to update config");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/marketing/config"] });
      toast({ title: "Config updated" });
    },
  });

  const posts: MarketingPost[] = postsData?.posts || [];
  const configs: ScheduleConfig[] = configsData?.configs || [];
  const logs: DeployLog[] = logsData?.logs || [];

  const getConfigForPlatform = (platform: string) => 
    configs.find(c => c.platform === platform);

  const getPlatformInfo = (platformId: string) =>
    PLATFORMS.find(p => p.id === platformId) || PLATFORMS[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <MobileNav />
      
      {/* Floating ambient glow orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 pt-20">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/admin" className="text-cyan-400 hover:text-cyan-300 text-sm mb-4 inline-block">
            ← Back to Admin
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Marketing Command Center
          </h1>
          <p className="text-slate-400 mt-2">Proprietary social media auto-deployment system</p>
        </motion.div>

        {/* Platform Status Cards */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {PLATFORMS.map((platform, index) => {
            const config = getConfigForPlatform(platform.id);
            const platformPosts = posts.filter(p => p.platform === platform.id);
            
            return (
              <motion.div
                key={platform.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-4 rounded-xl border border-white/10 bg-gradient-to-br ${platform.color} bg-opacity-20 backdrop-blur-lg overflow-hidden group hover:scale-105 transition-transform cursor-pointer`}
                onClick={() => setSelectedPlatform(platform.id)}
                data-testid={`platform-card-${platform.id}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{platform.icon}</span>
                    {config?.isActive ? (
                      <div className="flex items-center gap-1 text-green-400 text-xs">
                        <Zap className="w-3 h-3" />
                        Active
                      </div>
                    ) : (
                      <div className="text-slate-500 text-xs">Inactive</div>
                    )}
                  </div>
                  <h3 className="font-semibold text-white">{platform.label}</h3>
                  <p className="text-sm text-white/70">{platformPosts.length} posts</p>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-2 w-full bg-white/10 hover:bg-white/20 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      deployMutation.mutate({ platform: platform.id });
                    }}
                    disabled={deployMutation.isPending || platformPosts.length === 0}
                    data-testid={`deploy-btn-${platform.id}`}
                  >
                    {deployMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-1" /> Deploy Now
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Posts Library */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="p-6 rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                  Content Library
                </h2>
                <div className="flex gap-2">
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger className="w-32 bg-slate-800 border-white/10" data-testid="filter-platform">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {PLATFORMS.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={() => setShowNewPostForm(true)}
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                    data-testid="add-post-btn"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Post
                  </Button>
                </div>
              </div>

              {/* New Post Form */}
              <AnimatePresence>
                {showNewPostForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-4 rounded-lg bg-slate-800/50 border border-cyan-500/30"
                  >
                    <h3 className="text-lg font-medium text-white mb-4">New Post</h3>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <Select value={newPost.platform} onValueChange={(v) => setNewPost({ ...newPost, platform: v })}>
                        <SelectTrigger className="bg-slate-700 border-white/10" data-testid="new-post-platform">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PLATFORMS.map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.icon} {p.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={newPost.category} onValueChange={(v) => setNewPost({ ...newPost, category: v })}>
                        <SelectTrigger className="bg-slate-700 border-white/10" data-testid="new-post-category">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map(c => (
                            <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Textarea
                      placeholder="Post content..."
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      className="bg-slate-700 border-white/10 mb-4 min-h-24"
                      data-testid="new-post-content"
                    />
                    <Input
                      placeholder="Image URL (optional)"
                      value={newPost.imageUrl}
                      onChange={(e) => setNewPost({ ...newPost, imageUrl: e.target.value })}
                      className="bg-slate-700 border-white/10 mb-4"
                      data-testid="new-post-image"
                    />
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" onClick={() => setShowNewPostForm(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={() => createPostMutation.mutate(newPost)}
                        disabled={!newPost.content || createPostMutation.isPending}
                        className="bg-gradient-to-r from-cyan-500 to-purple-500"
                        data-testid="save-new-post"
                      >
                        {createPostMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                        Save Post
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Posts List */}
              {loadingPosts ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No posts yet. Add your first marketing post!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {posts.map((post, index) => {
                    const platformInfo = getPlatformInfo(post.platform);
                    return (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 rounded-lg bg-slate-800/50 border border-white/10 hover:border-cyan-500/30 transition-colors group"
                        data-testid={`post-item-${post.id}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg">{platformInfo.icon}</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                                {post.category}
                              </span>
                              {post.usedCount > 0 && (
                                <span className="text-xs text-slate-500">
                                  Used {post.usedCount}x
                                </span>
                              )}
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                post.status === "active" ? "bg-green-500/20 text-green-400" : "bg-slate-700 text-slate-400"
                              }`}>
                                {post.status}
                              </span>
                            </div>
                            <p className="text-white/90 text-sm whitespace-pre-wrap">
                              {post.content.length > 200 ? `${post.content.slice(0, 200)}...` : post.content}
                            </p>
                            {post.imageUrl && (
                              <p className="text-xs text-cyan-400 mt-1 truncate">
                                📷 {post.imageUrl}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-cyan-400 hover:bg-cyan-500/20"
                              onClick={() => deployMutation.mutate({ platform: post.platform, postId: post.id })}
                              disabled={deployMutation.isPending}
                              data-testid={`deploy-post-${post.id}`}
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-red-400 hover:bg-red-500/20"
                              onClick={() => deletePostMutation.mutate(post.id)}
                              disabled={deletePostMutation.isPending}
                              data-testid={`delete-post-${post.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Sidebar - Logs & Config */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Recent Deploys */}
            <div className="p-4 rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-lg">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                Recent Deploys
              </h3>
              {logs.length === 0 ? (
                <p className="text-slate-400 text-sm">No deploys yet</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {logs.slice(0, 10).map((log) => {
                    const platformInfo = getPlatformInfo(log.platform);
                    return (
                      <div 
                        key={log.id}
                        className="flex items-center gap-2 text-sm p-2 rounded bg-slate-800/50"
                      >
                        <span>{platformInfo.icon}</span>
                        {log.status === "success" ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                        <span className="text-slate-400 text-xs">
                          {new Date(log.deployedAt).toLocaleTimeString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Setup Instructions */}
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 backdrop-blur-lg">
              <h3 className="text-lg font-semibold text-amber-400 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Platform Setup
              </h3>
              <div className="space-y-3 text-sm text-slate-300">
                <div>
                  <p className="font-medium text-white">Discord</p>
                  <p className="text-xs text-slate-400">Set DISCORD_WEBHOOK_URL</p>
                </div>
                <div>
                  <p className="font-medium text-white">Telegram</p>
                  <p className="text-xs text-slate-400">Set TELEGRAM_BOT_TOKEN & TELEGRAM_CHANNEL_ID</p>
                </div>
                <div>
                  <p className="font-medium text-white">X (Twitter)</p>
                  <p className="text-xs text-slate-400">Set TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET</p>
                </div>
                <div>
                  <p className="font-medium text-white">Facebook</p>
                  <p className="text-xs text-slate-400">Set FACEBOOK_PAGE_ID & FACEBOOK_PAGE_ACCESS_TOKEN</p>
                </div>
              </div>
            </div>

            {/* Character Limits Reference */}
            <div className="p-4 rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-lg">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Hash className="w-4 h-4 text-cyan-400" />
                Character Limits
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>X/Twitter</span>
                  <span className="text-cyan-400">280 chars</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Facebook</span>
                  <span className="text-cyan-400">~500 optimal</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Telegram</span>
                  <span className="text-cyan-400">4,096 chars</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Discord</span>
                  <span className="text-cyan-400">2,000 chars</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
