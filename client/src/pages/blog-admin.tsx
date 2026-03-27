import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  BookOpen, Sparkles, Loader2, Trash2, Eye, Edit, Check, X,
  Plus, RefreshCw, Send, FileText, Tag, Calendar
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/glass-card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  status: string;
  featured: boolean;
  viewCount: number;
  createdAt: string;
  publishedAt: string | null;
}

interface Category {
  id: string;
  name: string;
  topics: string[];
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  published: "bg-green-500/20 text-green-300 border-green-500/30",
  archived: "bg-red-500/20 text-red-300 border-red-500/30",
};

export default function BlogAdmin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [customTopic, setCustomTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const { data: postsData, isLoading: postsLoading } = useQuery<{ posts: BlogPost[] }>({
    queryKey: ["/api/blog/posts"],
  });

  const { data: categoriesData } = useQuery<{ categories: Category[] }>({
    queryKey: ["/api/blog/categories"],
  });

  const { data: topicsData } = useQuery<{ topics: string[] }>({
    queryKey: ["/api/blog/topic-suggestions", { category: selectedCategory }],
    enabled: !!selectedCategory,
  });

  const posts = postsData?.posts || [];
  const categories = categoriesData?.categories || [];
  const suggestedTopics = topicsData?.topics || [];

  const generateMutation = useMutation({
    mutationFn: async (data: { topic?: string; category?: string }) => {
      const res = await fetch("/api/blog/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to generate post");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] });
      toast({ title: "Post Generated!", description: "New blog post created successfully" });
      setCustomTopic("");
      setIsGenerating(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to generate post", variant: "destructive" });
      setIsGenerating(false);
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/blog/posts/${id}/publish`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to publish");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] });
      toast({ title: "Published!", description: "Post is now live" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/blog/posts/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] });
      toast({ title: "Deleted", description: "Post removed" });
    },
  });

  const handleGenerate = (topic?: string) => {
    setIsGenerating(true);
    generateMutation.mutate({ 
      topic: topic || customTopic || undefined, 
      category: selectedCategory || undefined 
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#080c18] flex items-center justify-center text-white">
        <GlassCard glow className="p-8 text-center">
          <BookOpen className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
          <p className="text-gray-400">Please log in to access the blog admin.</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080c18] text-white">
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(circle at 30% 20%, rgba(0,200,255,0.15) 0%, transparent 50%)",
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">AI Blog Generator</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Blog Administration
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Generate SEO-optimized blog posts with AI, manage content, and publish to drive organic traffic.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <GlassCard glow className="lg:col-span-2 p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-cyan-400" />
              Generate New Post
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-black/30 border-white/10">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Custom Topic (optional)</label>
                <Input
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="Enter a custom topic or leave blank for suggestions"
                  className="bg-black/30 border-white/10"
                  data-testid="custom-topic-input"
                />
              </div>

              <Button
                onClick={() => handleGenerate()}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                data-testid="generate-post-button"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Blog Post
                  </>
                )}
              </Button>
            </div>
          </GlassCard>

          <GlassCard glow className="p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-purple-400" />
              Quick Topics
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {suggestedTopics.length > 0 ? (
                suggestedTopics.map((topic, i) => (
                  <button
                    key={i}
                    onClick={() => handleGenerate(topic)}
                    disabled={isGenerating}
                    className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-gray-300 transition-colors disabled:opacity-50"
                    data-testid={`topic-${i}`}
                  >
                    {topic}
                  </button>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Select a category to see topic suggestions</p>
              )}
            </div>
          </GlassCard>
        </div>

        <GlassCard glow className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              All Posts ({posts.length})
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] })}
              className="border-white/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          {postsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No blog posts yet. Generate your first post above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
                  data-testid={`post-row-${post.id}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-white truncate">{post.title}</h3>
                      <Badge className={statusColors[post.status]}>{post.status}</Badge>
                      {post.featured && (
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{post.category}</span>
                      <span>{post.viewCount} views</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <Eye className="w-4 h-4 text-gray-400" />
                    </a>
                    
                    {post.status === "draft" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => publishMutation.mutate(post.id)}
                        disabled={publishMutation.isPending}
                        className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteMutation.mutate(post.id)}
                      disabled={deleteMutation.isPending}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
