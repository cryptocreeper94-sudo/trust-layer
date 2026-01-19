import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  BookOpen, Clock, Eye, Calendar, ArrowLeft, Share2, 
  Twitter, Linkedin, Facebook, Copy, Check, User, Tag,
  Loader2, AlertCircle
} from "lucide-react";
import { useState } from "react";
import { BackButton } from "@/components/page-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/glass-card";
import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string[] | null;
  category: string;
  tags: string[] | null;
  authorName: string;
  authorAvatar: string | null;
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

function MarkdownContent({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactElement[] = [];
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let codeBlockLang = '';
  
  lines.forEach((line, index) => {
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockLang = line.slice(3).trim();
        codeBlockContent = [];
      } else {
        elements.push(
          <pre key={index} className="bg-black/50 border border-white/10 rounded-lg p-4 overflow-x-auto my-4">
            <code className="text-sm text-gray-300 font-mono">{codeBlockContent.join('\n')}</code>
          </pre>
        );
        inCodeBlock = false;
      }
      return;
    }
    
    if (inCodeBlock) {
      codeBlockContent.push(line);
      return;
    }
    
    if (line.startsWith('# ')) {
      elements.push(<h1 key={index} className="text-3xl font-bold text-white mt-8 mb-4">{line.slice(2)}</h1>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={index} className="text-2xl font-bold text-white mt-6 mb-3">{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={index} className="text-xl font-semibold text-white mt-4 mb-2">{line.slice(4)}</h3>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <li key={index} className="text-gray-300 ml-6 list-disc">{line.slice(2)}</li>
      );
    } else if (line.match(/^\d+\. /)) {
      elements.push(
        <li key={index} className="text-gray-300 ml-6 list-decimal">{line.replace(/^\d+\. /, '')}</li>
      );
    } else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={index} className="border-l-4 border-cyan-500 pl-4 py-2 my-4 bg-cyan-500/5 rounded-r text-gray-300 italic">
          {line.slice(2)}
        </blockquote>
      );
    } else if (line.trim() === '') {
      elements.push(<br key={index} />);
    } else {
      let formatted = line
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code class="bg-white/10 px-1.5 py-0.5 rounded text-cyan-300 text-sm">$1</code>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-cyan-400 hover:text-cyan-300 underline">$1</a>');
      elements.push(
        <p key={index} className="text-gray-300 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    }
  });
  
  return <div className="prose-custom">{elements}</div>;
}

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const { data, isLoading, error } = useQuery<{ post: BlogPost }>({
    queryKey: [`/api/blog/posts/${params.slug}`],
    enabled: !!params.slug,
  });

  const post = data?.post;
  const gradient = post ? (categoryColors[post.category] || categoryColors.general) : categoryColors.general;

  useEffect(() => {
    if (post) {
      document.title = post.metaTitle || post.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && post.metaDescription) {
        metaDesc.setAttribute('content', post.metaDescription);
      }
    }
  }, [post]);

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = post?.title || '';
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast({ title: "Link copied!", description: "Article link copied to clipboard" });
        setTimeout(() => setCopied(false), 2000);
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080c18] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#080c18] text-white">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Article Not Found</h1>
          <p className="text-gray-400 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link href="/blog">
            <Button className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080c18] text-white">
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: "radial-gradient(circle at 50% 20%, rgba(0,200,255,0.2) 0%, transparent 50%)",
        }}
      />
      
      <article className="relative max-w-4xl mx-auto px-4 py-12">
        <BackButton />

        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Badge className={`bg-gradient-to-r ${gradient} text-white border-0`}>
              {post.category}
            </Badge>
            <span className="text-gray-500">|</span>
            <span className="flex items-center gap-1 text-gray-400 text-sm">
              <Clock className="w-4 h-4" />
              {post.readTimeMinutes} min read
            </span>
            <span className="text-gray-500">|</span>
            <span className="flex items-center gap-1 text-gray-400 text-sm">
              <Eye className="w-4 h-4" />
              {post.viewCount.toLocaleString()} views
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-xl text-gray-400 mb-8">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-white">{post.authorName}</p>
                <p className="text-sm text-gray-500">
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 mr-2">Share:</span>
              <Button size="sm" variant="ghost" onClick={() => handleShare('twitter')} className="p-2 hover:bg-white/10">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleShare('linkedin')} className="p-2 hover:bg-white/10">
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleShare('facebook')} className="p-2 hover:bg-white/10">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleShare('copy')} className="p-2 hover:bg-white/10">
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </motion.header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard glow className="p-8 md:p-12">
            <MarkdownContent content={post.content} />
          </GlassCard>
        </motion.div>

        {post.tags && post.tags.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex items-center gap-2 flex-wrap"
          >
            <Tag className="w-4 h-4 text-gray-500" />
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="border-white/10 text-gray-400">
                {tag}
              </Badge>
            ))}
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-8 border-t border-white/10"
        >
          <Link href="/blog">
            <Button variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </motion.div>
      </article>
    </div>
  );
}
