import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  BookOpen, Clock, Eye, Calendar, ArrowRight, Search, 
  Sparkles, TrendingUp, Tag, Filter, Loader2 
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/glass-card";

const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  category: string;
  tags: string[] | null;
  authorName: string;
  status: string;
  featured: boolean;
  readTimeMinutes: number;
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
}

const categoryColors: Record<string, string> = {
  blockchain: "from-cyan-500 to-blue-500",
  defi: "from-purple-500 to-pink-500",
  signal: "from-amber-500 to-orange-500",
  security: "from-red-500 to-rose-500",
  education: "from-green-500 to-emerald-500",
  general: "from-gray-500 to-slate-500",
};

function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  const gradient = categoryColors[post.category] || categoryColors.general;
  
  return (
    <Link href={`/blog/${post.slug}`}>
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ duration: 0.3 }}
        className={`group cursor-pointer h-full`}
        data-testid={`blog-card-${post.slug}`}
      >
        <GlassCard glow className="h-full overflow-hidden">
          <div className={`h-2 bg-gradient-to-r ${gradient}`} />
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent border-white/20`}>
                {post.category}
              </Badge>
              {post.featured && (
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            
            <h3 className={`font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors line-clamp-2 ${featured ? 'text-2xl' : 'text-lg'}`}>
              {post.title}
            </h3>
            
            <p className="text-gray-400 text-sm mb-4 line-clamp-3">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readTimeMinutes} min read
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {post.viewCount.toLocaleString()}
                </span>
              </div>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <div className="mt-4 flex items-center text-cyan-400 text-sm font-medium group-hover:gap-2 transition-all">
              <span>Read more</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
</motion.div>
    </Link>
  );
}

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { data: postsData, isLoading } = useQuery<{ posts: BlogPost[] }>({
    queryKey: ["/api/blog/posts", { status: "published" }],
  });

  const { data: categoriesData } = useQuery<{ categories: { id: string; name: string }[] }>({
    queryKey: ["/api/blog/categories"],
  });

  const posts = postsData?.posts || [];
  const categories = categoriesData?.categories || [];
  
  const filteredPosts = posts.filter(post => {
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = filteredPosts.filter(p => p.featured);
  const regularPosts = filteredPosts.filter(p => !p.featured);

  return (
    <div className="min-h-screen relative overflow-hidden pt-20 pb-12 text-white" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="linear-gradient(135deg, #06b6d4, #3b82f6)" size={500} top="-5%" left="60%" />
      <GlowOrb color="linear-gradient(135deg, #8b5cf6, #ec4899)" size={400} top="40%" left="-10%" delay={3} />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-300 text-sm font-medium">Trust Layer Blog</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Learn & Discover
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explore the future of blockchain, DeFi, and the Trust Layer ecosystem with our expert articles.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              data-testid="blog-search-input"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" : "border-white/10"}
              data-testid="filter-all"
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className={selectedCategory === cat.id 
                  ? `bg-gradient-to-r ${categoryColors[cat.id] || categoryColors.general} text-white` 
                  : "border-white/10"
                }
                data-testid={`filter-${cat.id}`}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No articles found</h3>
            <p className="text-gray-500">
              {searchQuery ? "Try a different search term" : "Check back soon for new content!"}
            </p>
          </div>
        ) : (
          <>
            {featuredPosts.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-amber-400" />
                  Featured Articles
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredPosts.slice(0, 2).map((post) => (
                    <BlogCard key={post.id} post={post} featured />
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Tag className="w-6 h-6 text-cyan-400" />
                Latest Articles
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
);
}
