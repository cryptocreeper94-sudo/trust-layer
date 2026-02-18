import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, ChevronLeft, ChevronRight, Menu, X, Home, 
  BookMarked, ScrollText, FileText, ExternalLink, Volume2, VolumeX, Pause, Play, Download, ArrowLeft, Sparkles, Bell, Loader2
} from "lucide-react";
import { Link } from "wouter";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type ChangelogEntry = {
  version: string;
  date: string;
  updates: {
    type: 'added' | 'updated' | 'removed';
    description: string;
    chapterId?: string;
    volumeIndex?: number;
  }[];
};

const EBOOK_CHANGELOG: ChangelogEntry[] = [
  {
    version: "3.0.0",
    date: "February 4, 2026",
    updates: [
      { type: 'added', description: 'MAJOR: E-reader now syncs directly with the master ebook file', chapterId: 'v1-introduction', volumeIndex: 0 },
      { type: 'added', description: 'All 44+ chapters now display complete content from the source document', chapterId: 'v1-introduction', volumeIndex: 0 },
      { type: 'added', description: 'Added Leviathan vs Ouroboros distinction - biblical creature vs pagan eternal cycle symbol', chapterId: 'v1-dragons', volumeIndex: 0 },
      { type: 'updated', description: 'Replaced "hell" with "Tartaros" in 2 Peter 2:4 references (accurate to Greek original)', chapterId: 'v1-watchers', volumeIndex: 0 },
    ]
  },
  {
    version: "2.1.0",
    date: "February 4, 2026",
    updates: [
      { type: 'added', description: 'NEW SECTION: The Planet X Deception - exposing the deliberate conflation of two unrelated concepts', chapterId: 'v1-forbidden-knowledge', volumeIndex: 0 },
      { type: 'added', description: 'Planet X history: legitimate 1902-1930s astronomy (Lowell, Tombaugh, Pluto) vs Sitchin\'s 1976 fabrication', chapterId: 'v1-forbidden-knowledge', volumeIndex: 0 },
    ]
  },
  {
    version: "2.0.0",
    date: "February 4, 2026",
    updates: [
      { type: 'added', description: 'NEW EPIGRAPH PAGE: Revelation 22:18-19 placed prominently in front matter before any content begins', chapterId: 'v1-front-matter', volumeIndex: 0 },
      { type: 'added', description: 'Clear author statement: "I do not add to Scripture. I do not take away from it. I simply illuminate what is already written."', chapterId: 'v1-front-matter', volumeIndex: 0 },
    ]
  },
  {
    version: "1.0.0",
    date: "January 28, 2026",
    updates: [
      { type: 'added', description: 'Initial release - complete ebook with all chapters', chapterId: 'v1-introduction', volumeIndex: 0 },
    ]
  }
];

const CURRENT_VERSION = "3.0.0";
const STORAGE_KEY = 'veil-reader-user-data';

function useVeilPWA() {
  useEffect(() => {
    document.title = "Through The Veil | The Greatest Story Ever Stole?";
    
    let manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    if (manifestLink) {
      manifestLink.href = '/manifest-veil.webmanifest';
    }
    
    let themeColor = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
    if (themeColor) {
      themeColor.content = '#a855f7';
    }
    
    let appleTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]') as HTMLMetaElement;
    if (appleTitle) {
      appleTitle.content = 'Through The Veil';
    }

    let appleIcon = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement;
    if (appleIcon) {
      appleIcon.href = '/icons/veil-192x192.png';
    }

    return () => {
      if (manifestLink) manifestLink.href = '/manifest.webmanifest';
      if (themeColor) themeColor.content = '#00ffff';
      if (appleTitle) appleTitle.content = 'Trust Layer';
      if (appleIcon) appleIcon.href = '/icons/icon-192x192.png';
    };
  }, []);
}

type Chapter = {
  id: string;
  title: string;
  content: string;
  partTitle?: string;
};

type Volume = {
  id: string;
  title: string;
  subtitle: string;
  chapters: Chapter[];
};

function parseMarkdownToChapters(markdown: string): Volume[] {
  const lines = markdown.split('\n');
  const chapters: Chapter[] = [];
  let currentChapter: Chapter | null = null;
  let currentContent: string[] = [];
  let currentPart = "";
  let inFrontMatter = true;
  let frontMatterContent: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect PART headers (including PART FOUR-B style variations)
    if (line.match(/^# PART [IVXLC]+[-]?[A-Z]?:/i) || line.match(/^# PART (ONE|TWO|THREE|FOUR|FIVE|SIX|SEVEN|EIGHT|NINE|TEN|ELEVEN|TWELVE)[-]?[A-Z]?:/i)) {
      currentPart = line.replace(/^# /, '').trim();
      continue;
    }
    
    // Detect chapter headers (including appendices)
    const chapterMatch = line.match(/^# (CHAPTER \d+[A-Z]?:.+)$/i);
    const appendixMatch = line.match(/^# (APPENDIX[^:]*:.*)$/i) || line.match(/^# (APPENDIX.*)$/i);
    
    if (chapterMatch || appendixMatch) {
      inFrontMatter = false;
      
      // Save previous chapter
      if (currentChapter) {
        currentChapter.content = currentContent.join('\n').trim();
        chapters.push(currentChapter);
      }
      
      const title = (chapterMatch ? chapterMatch[1] : appendixMatch![1]).trim();
      const id = 'ch-' + title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').substring(0, 50);
      
      // Set appendices to their own part
      if (appendixMatch && !currentPart.includes('APPENDIX')) {
        currentPart = 'APPENDIX: Reference Materials';
      }
      
      currentChapter = {
        id,
        title,
        content: '',
        partTitle: currentPart
      };
      currentContent = [];
      continue;
    }
    
    // Skip table of contents
    if (line.match(/^## TABLE OF CONTENTS/i)) {
      // Skip until next major section
      while (i < lines.length - 1 && !lines[i + 1].match(/^# PART/i)) {
        i++;
      }
      continue;
    }
    
    // Collect front matter before first chapter
    if (inFrontMatter && !line.match(/^# PART/)) {
      frontMatterContent.push(line);
    }
    
    // Collect chapter content
    if (currentChapter) {
      currentContent.push(line);
    }
  }
  
  // Save last chapter
  if (currentChapter) {
    currentChapter.content = currentContent.join('\n').trim();
    chapters.push(currentChapter);
  }
  
  // Create front matter chapter
  const frontMatter: Chapter = {
    id: 'front-matter',
    title: 'Introduction & Front Matter',
    content: frontMatterContent.join('\n').trim(),
    partTitle: 'Front Matter'
  };
  
  // Group chapters by part
  const partMap = new Map<string, Chapter[]>();
  partMap.set('Front Matter', [frontMatter]);
  
  for (const chapter of chapters) {
    const part = chapter.partTitle || 'Main Content';
    if (!partMap.has(part)) {
      partMap.set(part, []);
    }
    partMap.get(part)!.push(chapter);
  }
  
  // Convert to volumes
  const volumes: Volume[] = [];
  let volumeIndex = 0;
  
  const partEntries = Array.from(partMap.entries());
  for (let i = 0; i < partEntries.length; i++) {
    const partTitle = partEntries[i][0];
    const partChapters = partEntries[i][1];
    if (partChapters.length === 0) continue;
    
    volumes.push({
      id: `volume-${volumeIndex}`,
      title: partTitle === 'Front Matter' ? 'Front Matter' : partTitle,
      subtitle: partTitle === 'Front Matter' 
        ? 'Introduction, dedication, and author notes' 
        : `${partChapters.length} chapter${partChapters.length > 1 ? 's' : ''}`,
      chapters: partChapters
    });
    volumeIndex++;
  }
  
  return volumes;
}

export default function VeilReader() {
  useVeilPWA();
  
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentVolume, setCurrentVolume] = useState(0);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showWhatsNew, setShowWhatsNew] = useState(false);
  const [hasSeenUpdates, setHasSeenUpdates] = useState(false);
  const [newUpdatesSinceVisit, setNewUpdatesSinceVisit] = useState<ChangelogEntry[]>([]);
  
  // TTS state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [useAIVoice, setUseAIVoice] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastPlayedChapterRef = useRef<string | null>(null);

  // Load markdown
  useEffect(() => {
    async function loadEbook() {
      try {
        const response = await fetch('/through-the-veil.md');
        if (!response.ok) {
          throw new Error('Failed to load ebook');
        }
        const markdown = await response.text();
        const parsedVolumes = parseMarkdownToChapters(markdown);
        setVolumes(parsedVolumes);
        setLoading(false);
      } catch (err) {
        console.error('Error loading ebook:', err);
        setError('Failed to load ebook content');
        setLoading(false);
      }
    }
    loadEbook();
  }, []);

  // Check speech support
  useEffect(() => {
    setSpeechSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  // Handle URL hash navigation (e.g., /veil/read#chapter-38)
  useEffect(() => {
    if (volumes.length === 0) return;
    
    const hash = window.location.hash.slice(1); // Remove the #
    if (hash) {
      // Search for chapter matching the hash
      for (let volIdx = 0; volIdx < volumes.length; volIdx++) {
        const vol = volumes[volIdx];
        for (let chapIdx = 0; chapIdx < vol.chapters.length; chapIdx++) {
          const chap = vol.chapters[chapIdx];
          // Match by id or by partial title match
          const normalizedHash = hash.toLowerCase().replace(/-/g, ' ');
          const normalizedTitle = chap.title.toLowerCase();
          const normalizedId = chap.id.toLowerCase().replace(/-/g, ' ');
          
          if (chap.id === hash || 
              normalizedId.includes(normalizedHash) || 
              normalizedTitle.includes(normalizedHash) ||
              normalizedHash.includes('chapter') && normalizedTitle.includes(normalizedHash.replace('chapter', '').trim())) {
            setCurrentVolume(volIdx);
            setCurrentChapter(chapIdx);
            window.scrollTo(0, 0);
            // Clear hash after navigation
            window.history.replaceState(null, '', window.location.pathname);
            return;
          }
        }
      }
    }
  }, [volumes]);

  // Load saved position and check for updates (only if no hash navigation)
  useEffect(() => {
    if (volumes.length === 0) return;
    
    // Skip if we just navigated via hash
    const hash = window.location.hash.slice(1);
    if (hash) return;
    
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.currentVolume !== undefined && data.currentVolume < volumes.length) {
          setCurrentVolume(data.currentVolume);
        }
        if (data.currentChapter !== undefined) {
          const vol = volumes[data.currentVolume || 0];
          if (vol && data.currentChapter < vol.chapters.length) {
            setCurrentChapter(data.currentChapter);
          }
        }
        
        if (data.lastSeenVersion) {
          const newUpdates = EBOOK_CHANGELOG.filter(entry => {
            return entry.version > data.lastSeenVersion;
          });
          setNewUpdatesSinceVisit(newUpdates);
          if (newUpdates.length > 0) {
            setShowWhatsNew(true);
          }
        }
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    }
  }, [volumes]);

  // Save position
  useEffect(() => {
    if (volumes.length === 0) return;
    
    const data = {
      currentVolume,
      currentChapter,
      lastSeenVersion: hasSeenUpdates ? CURRENT_VERSION : undefined
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [currentVolume, currentChapter, hasSeenUpdates, volumes]);

  // TTS state for error display
  const [ttsError, setTtsError] = useState<string | null>(null);

  // TTS functions
  const playWithAIVoice = async (text: string) => {
    setIsLoading(true);
    setTtsError(null);
    try {
      const response = await fetch('/api/voice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.substring(0, 4000) })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'AI voice failed');
      }

      const blob = await response.blob();
      if (blob.size < 100) {
        throw new Error('Empty audio response');
      }
      
      const url = URL.createObjectURL(blob);
      
      audioRef.current = new Audio(url);
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
        URL.revokeObjectURL(url);
        handleNextChapterAuto();
      };
      audioRef.current.onerror = (e) => {
        console.error('Audio playback error:', e);
        setIsPlaying(false);
        setIsLoading(false);
        URL.revokeObjectURL(url);
        setUseAIVoice(false);
        // Try browser speech as fallback
        tryBrowserSpeech(text);
      };
      
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        setIsLoading(false);
      } catch (playErr: any) {
        console.error('Audio play() failed:', playErr);
        URL.revokeObjectURL(url);
        setUseAIVoice(false);
        setIsLoading(false);
        // Try browser speech as fallback
        tryBrowserSpeech(text);
      }
    } catch (err: any) {
      console.error('AI voice error:', err);
      setUseAIVoice(false);
      setIsLoading(false);
      // Try browser speech as fallback
      tryBrowserSpeech(text);
    }
  };

  const tryBrowserSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      playWithBrowserSpeech(text);
    } else {
      setTtsError('Voice playback not available. Try downloading the PDF and using Adobe Reader.');
    }
  };

  const playWithBrowserSpeech = (text: string) => {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => {
        setIsPlaying(true);
        setTtsError(null);
      };
      
      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        handleNextChapterAuto();
      };
      
      utterance.onerror = (e) => {
        console.error('Browser speech error:', e);
        setIsPlaying(false);
        setTtsError('Browser voice failed. Try the PDF with Adobe Reader instead.');
      };
      
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    } catch (e) {
      console.error('Browser speech exception:', e);
      setTtsError('Voice not available. Download PDF and use Adobe Reader.');
    }
  };

  // Clear error after 5 seconds
  useEffect(() => {
    if (ttsError) {
      const timer = setTimeout(() => setTtsError(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [ttsError]);

  // Legacy function for compatibility
  const playWithBrowserSpeechLegacy = (text: string) => {
    if (!speechSupported) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      handleNextChapterAuto();
    };
    utterance.onerror = () => {
      setIsPlaying(false);
    };
    
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const autoPlayNextRef = useRef(false);

  // Auto-advance to next chapter (called when audio ends)
  const handleNextChapterAuto = () => {
    if (volumes.length === 0) return;
    
    const volume = volumes[currentVolume];
    if (!volume) return;
    
    // Check if there's a next chapter in this volume
    if (currentChapter < volume.chapters.length - 1) {
      const nextChapter = currentChapter + 1;
      setCurrentChapter(nextChapter);
      lastPlayedChapterRef.current = null;
      autoPlayNextRef.current = true;
      window.scrollTo(0, 0);
    } 
    // Check if there's a next volume
    else if (currentVolume < volumes.length - 1) {
      const nextVolume = currentVolume + 1;
      setCurrentVolume(nextVolume);
      setCurrentChapter(0);
      lastPlayedChapterRef.current = null;
      autoPlayNextRef.current = true;
      window.scrollTo(0, 0);
    }
    // End of book - just stop
  };

  // Auto-play next chapter after navigation
  useEffect(() => {
    if (autoPlayNextRef.current && volumes.length > 0) {
      autoPlayNextRef.current = false;
      const timer = setTimeout(() => {
        handlePlay();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentVolume, currentChapter]);

  const handlePlay = async () => {
    if (volumes.length === 0) return;
    
    // Reset to try AI voice again on each play attempt
    setUseAIVoice(true);
    
    const volume = volumes[currentVolume];
    const chapter = volume.chapters[currentChapter];
    const chapterId = `${currentVolume}-${currentChapter}`;
    
    // Resume if paused on same chapter
    if (isPaused && lastPlayedChapterRef.current === chapterId) {
      if (audioRef.current) {
        await audioRef.current.play();
        setIsPlaying(true);
        setIsPaused(false);
        return;
      }
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
        setIsPaused(false);
        return;
      }
    }
    
    // Stop existing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    let text = chapter.content
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/https?:\/\/[^\s)]+/g, '')
      .replace(/[\u2600-\u27BF\uD83C-\uDBFF\uDC00-\uDFFF\uFE0F\u200D]+/g, '')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/[*_~`]/g, '')
      .replace(/^[\-*]\s+/gm, '')
      .replace(/^\d+\.\s+/gm, '')
      .replace(/^>\s?/gm, '')
      .replace(/\|/g, ',')
      .replace(/---+/g, '')
      .replace(/[!]{2,}/g, '!')
      .replace(/[?]{2,}/g, '?')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (!text || text.length === 0) {
      console.error('No text to play');
      return;
    }
    
    lastPlayedChapterRef.current = chapterId;
    
    // Mobile audio unlock
    try {
      const silentAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
      await silentAudio.play();
      silentAudio.pause();
    } catch (e) {
      // Continue anyway
    }
    
    if (useAIVoice) {
      await playWithAIVoice(text);
    } else if (speechSupported) {
      playWithBrowserSpeech(text);
    }
  };

  const handlePause = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPaused(true);
      setIsPlaying(false);
    } else if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handleDownloadPDF = () => {
    // Open markdown in new tab for now - full PDF generation is complex
    window.open('/through-the-veil.md', '_blank');
  };

  const navigateToUpdate = (volumeIndex?: number, chapterId?: string) => {
    if (volumeIndex !== undefined && volumes.length > volumeIndex) {
      setCurrentVolume(volumeIndex);
      if (chapterId) {
        const chapIdx = volumes[volumeIndex].chapters.findIndex(ch => ch.id === chapterId);
        if (chapIdx >= 0) {
          setCurrentChapter(chapIdx);
        }
      }
    }
    setShowWhatsNew(false);
    setHasSeenUpdates(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 animate-ping" />
            <div className="absolute inset-0 rounded-full border-2 border-t-purple-400 border-r-cyan-400 border-b-transparent border-l-transparent animate-spin" />
            <BookOpen className="absolute inset-0 m-auto w-6 h-6 text-purple-400" />
          </div>
          <p className="text-slate-300 text-lg font-medium mb-1">Loading</p>
          <p className="text-sm bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent font-medium">Through The Veil</p>
        </motion.div>
      </div>
    );
  }

  if (error || volumes.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <X className="w-6 h-6 text-red-400" />
          </div>
          <p className="text-red-300 mb-2 font-medium">{error || 'Failed to load content'}</p>
          <p className="text-slate-500 text-sm mb-6">Please try again or return to the book page.</p>
          <Link href="/veil">
            <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-lg shadow-purple-500/20">
              Return to Veil
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const volume = volumes[currentVolume];
  const chapter = volume.chapters[currentChapter];
  
  const totalChapters = volumes.reduce((acc, v) => acc + v.chapters.length, 0);
  const currentGlobalIndex = volumes.slice(0, currentVolume).reduce((acc, v) => acc + v.chapters.length, 0) + currentChapter;

  const goNext = () => {
    if (currentChapter < volume.chapters.length - 1) {
      setCurrentChapter(currentChapter + 1);
    } else if (currentVolume < volumes.length - 1) {
      setCurrentVolume(currentVolume + 1);
      setCurrentChapter(0);
    }
    window.scrollTo(0, 0);
  };

  const goPrev = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
    } else if (currentVolume > 0) {
      setCurrentVolume(currentVolume - 1);
      setCurrentChapter(volumes[currentVolume - 1].chapters.length - 1);
    }
    window.scrollTo(0, 0);
  };

  const goToChapter = (volIndex: number, chapIndex: number) => {
    setCurrentVolume(volIndex);
    setCurrentChapter(chapIndex);
    setSidebarOpen(false);
    window.scrollTo(0, 0);
  };

  const hasNext = currentChapter < volume.chapters.length - 1 || currentVolume < volumes.length - 1;
  const hasPrev = currentChapter > 0 || currentVolume > 0;

  return (
    <div className="min-h-screen bg-slate-950 relative">
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-purple-500/20 shadow-lg shadow-purple-500/5">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-300 hover:text-purple-300 hover:bg-purple-500/10 transition-all"
              data-testid="button-toggle-sidebar"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30">
                <BookOpen className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <p className="text-xs font-medium bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">{volume.title}</p>
                <p className="text-sm text-white font-medium truncate max-w-[180px] md:max-w-[400px]">{chapter.title}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 md:gap-2">
            {(speechSupported || useAIVoice) && (
              <div className="flex items-center gap-1.5 group relative">
                {isLoading ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30">
                    <div className="w-3.5 h-3.5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-purple-300 hidden sm:inline">Loading Nova...</span>
                  </div>
                ) : isPlaying ? (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-500/15 border border-purple-500/30">
                    <div className="flex items-center gap-0.5 mr-1">
                      <div className="w-0.5 h-3 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                      <div className="w-0.5 h-4 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                      <div className="w-0.5 h-2.5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                      <div className="w-0.5 h-3.5 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
                    </div>
                    <Button 
                      size="icon" 
                      onClick={handlePause}
                      className="bg-amber-500/90 hover:bg-amber-500 text-white rounded-full w-7 h-7 shadow-lg shadow-amber-500/20"
                      data-testid="button-pause-chapter"
                      title="Pause"
                    >
                      <Pause className="w-3.5 h-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleStop}
                      className="text-slate-400 hover:text-white w-7 h-7"
                      title="Stop"
                    >
                      <VolumeX className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ) : (
                  <Button 
                    size="icon" 
                    onClick={handlePlay}
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-full w-8 h-8 shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/40 hover:scale-105"
                    data-testid="button-play-chapter"
                    title={isPaused ? 'Resume' : (useAIVoice ? 'Listen with Nova AI' : 'Listen (Browser Voice)')}
                  >
                    <Play className="w-4 h-4 ml-0.5" />
                  </Button>
                )}
                {isPaused && !isPlaying && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleStop}
                    className="text-slate-400 hover:text-white w-7 h-7"
                    title="Stop"
                  >
                    <VolumeX className="w-3.5 h-3.5" />
                  </Button>
                )}
                <div className="absolute top-full right-0 mt-2 w-72 p-4 bg-slate-900/95 backdrop-blur-xl border border-purple-500/20 rounded-xl shadow-2xl shadow-purple-500/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
                      <Volume2 className="w-3 h-3 text-white" />
                    </div>
                    <p className="text-white font-semibold text-sm">Nova AI Voice</p>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed mb-2">Powered by OpenAI. Nova provides natural, expressive narration. Falls back to browser voice if unavailable.</p>
                  <p className="text-purple-400 text-xs">For offline listening, download and use your device's reader.</p>
                </div>
                {ttsError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full right-0 mt-2 w-72 p-3 bg-red-950/90 backdrop-blur-xl border border-red-500/30 rounded-xl shadow-2xl z-50 text-xs"
                  >
                    <p className="text-red-200">{ttsError}</p>
                    <a href="/veil" className="text-cyan-400 hover:text-cyan-300 underline mt-1 block transition-colors">Go to download page</a>
                  </motion.div>
                )}
              </div>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDownloadPDF}
              className="text-slate-400 hover:text-purple-300 hover:bg-purple-500/10 transition-all"
              title="Download"
              data-testid="button-download-md"
            >
              <Download className="w-4 h-4" />
            </Button>

            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/50 border border-slate-700/50">
              <BookMarked className="w-3 h-3 text-purple-400" />
              <span className="text-xs text-slate-400 font-mono">
                {currentGlobalIndex + 1}<span className="text-slate-600">/</span>{totalChapters}
              </span>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowWhatsNew(true)}
              className="text-slate-300 hover:text-purple-300 hover:bg-purple-500/10 relative transition-all"
              title="What's New"
              data-testid="button-whats-new"
            >
              <Sparkles className="w-4 h-4" />
              {newUpdatesSinceVisit.length > 0 && !hasSeenUpdates && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-pulse shadow-lg shadow-purple-500/50" />
              )}
            </Button>
            
            <Link href="/veil">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-purple-300 hover:bg-purple-500/10 transition-all" data-testid="button-home">
                <Home className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* What's New Modal */}
      <AnimatePresence>
        {showWhatsNew && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-[60]"
              onClick={() => { setShowWhatsNew(false); setHasSeenUpdates(true); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-lg max-h-[80vh] overflow-auto"
            >
              <GlassCard glow className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-xl font-bold text-white">What's New</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setShowWhatsNew(false); setHasSeenUpdates(true); }}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                <p className="text-sm text-slate-400 mb-4">
                  Current Version: <span className="text-cyan-400 font-mono">{CURRENT_VERSION}</span>
                </p>
                
                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                  {EBOOK_CHANGELOG.map((entry, i) => (
                    <div key={entry.version} className={`${i < newUpdatesSinceVisit.length ? 'bg-cyan-500/5 border border-cyan-500/20' : 'bg-slate-800/30 border border-slate-700/50'} rounded-lg p-3`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-sm text-white">v{entry.version}</span>
                        <span className="text-xs text-slate-500">{entry.date}</span>
                      </div>
                      <ul className="space-y-2">
                        {entry.updates.map((update, j) => (
                          <li key={j} className="text-sm">
                            <div className="text-left w-full p-2 rounded">
                              <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium mr-2 ${
                                update.type === 'added' ? 'bg-green-500/20 text-green-400' :
                                update.type === 'updated' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {update.type.toUpperCase()}
                              </span>
                              <span className="text-slate-300">{update.description}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <Button
                    onClick={() => { setShowWhatsNew(false); setHasSeenUpdates(true); }}
                    className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
                  >
                    Continue Reading
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-slate-950/95 backdrop-blur-xl z-50 overflow-y-auto border-r border-purple-500/20 shadow-2xl shadow-purple-500/10"
            >
              <div className="p-5 border-b border-purple-500/15 flex items-center justify-between bg-gradient-to-r from-purple-500/5 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/30 to-cyan-500/30 border border-purple-500/30 flex items-center justify-center">
                    <ScrollText className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Contents</h2>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">{totalChapters} chapters</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white hover:bg-purple-500/10">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="py-2">
                {volumes.map((vol, volIndex) => (
                  <div key={vol.id} className="px-3 py-3">
                    <div className="flex items-center gap-2 mb-2 px-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400" />
                      <h3 className="font-semibold text-xs uppercase tracking-wider bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        {vol.title}
                      </h3>
                    </div>
                    <p className="text-[10px] text-slate-600 mb-2 px-2">{vol.subtitle}</p>
                    
                    <div className="space-y-0.5">
                      {vol.chapters.map((chap, chapIndex) => {
                        const isActive = currentVolume === volIndex && currentChapter === chapIndex;
                        return (
                          <button
                            key={chap.id}
                            onClick={() => goToChapter(volIndex, chapIndex)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                              isActive
                                ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/10 text-white border border-purple-500/30 shadow-sm shadow-purple-500/10'
                                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                            }`}
                            data-testid={`chapter-nav-${volIndex}-${chapIndex}`}
                          >
                            <div className="flex items-center gap-2">
                              {isActive && <div className="w-1 h-4 rounded-full bg-gradient-to-b from-purple-400 to-cyan-400 flex-shrink-0" />}
                              <span className={`text-xs leading-snug ${isActive ? 'font-medium' : ''}`}>{chap.title}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-purple-500/15 mt-2">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Progress</span>
                  <span className="font-mono text-purple-400">{Math.round(((currentGlobalIndex + 1) / totalChapters) * 100)}%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentGlobalIndex + 1) / totalChapters) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="pt-28 pb-36 px-8 sm:px-10 md:px-12">
        <motion.div
          key={`${currentVolume}-${currentChapter}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" as const }}
          className="max-w-3xl mx-auto"
        >
          <div className="mb-16 pt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
              <span className="text-xs font-medium uppercase tracking-[0.2em] bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent px-2">
                {volume.title}
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center leading-tight" data-testid="chapter-title">
              {chapter.title}
            </h1>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="w-8 h-px bg-gradient-to-r from-purple-500 to-transparent" />
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <div className="w-8 h-px bg-gradient-to-l from-cyan-500 to-transparent" />
            </div>
          </div>

          <div className="prose prose-invert prose-lg max-w-none 
            prose-p:text-slate-300 prose-p:leading-[1.9] prose-p:mb-7 prose-p:text-[17px]
            prose-headings:text-white
            prose-h2:text-2xl prose-h2:mt-14 prose-h2:mb-7 prose-h2:font-bold
            prose-h3:text-xl prose-h3:mt-12 prose-h3:mb-5 prose-h3:text-purple-300
            prose-strong:text-white prose-strong:font-semibold
            prose-em:text-purple-200/90
            prose-ul:text-slate-300 prose-ul:space-y-2
            prose-ol:text-slate-300 prose-ol:space-y-2
            prose-li:text-slate-300 prose-li:leading-relaxed prose-li:text-[17px]
            prose-blockquote:border-l-2 prose-blockquote:border-l-purple-500/60 prose-blockquote:bg-purple-500/5 prose-blockquote:px-5 prose-blockquote:py-3 prose-blockquote:rounded-r-lg
            prose-blockquote:text-slate-200 prose-blockquote:italic prose-blockquote:not-italic prose-blockquote:text-[17px]
            prose-hr:border-purple-500/20 prose-hr:my-10
            prose-a:text-purple-400 prose-a:no-underline hover:prose-a:text-purple-300
            prose-code:text-cyan-300 prose-code:bg-slate-800/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:border prose-code:border-slate-700/50
            prose-img:rounded-xl prose-img:border prose-img:border-purple-500/20 prose-img:shadow-xl prose-img:shadow-purple-500/10
            [&>p:first-of-type]:first-letter:text-5xl [&>p:first-of-type]:first-letter:font-bold [&>p:first-of-type]:first-letter:text-purple-400 [&>p:first-of-type]:first-letter:float-left [&>p:first-of-type]:first-letter:mr-3 [&>p:first-of-type]:first-letter:mt-1 [&>p:first-of-type]:first-letter:leading-none
          ">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ node, children, ...props }) => (
                  <h2 {...props} className="flex items-center gap-3">
                    <div className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-400 to-cyan-500 flex-shrink-0" />
                    <span className="bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">{children}</span>
                  </h2>
                ),
                blockquote: ({ node, children, ...props }) => (
                  <blockquote {...props} className="border-l-2 border-l-purple-500/60 bg-purple-500/5 backdrop-blur-sm px-5 py-4 rounded-r-lg my-6 not-italic">
                    <div className="text-slate-200 italic text-[17px] leading-relaxed">{children}</div>
                  </blockquote>
                ),
                img: ({ node, ...props }) => (
                  <figure className="my-8 flex flex-col items-center">
                    <div className="bg-slate-900/60 backdrop-blur-sm p-4 rounded-xl border border-purple-500/20 shadow-xl shadow-purple-500/5 max-w-lg w-full">
                      <img {...props} className="w-full rounded-lg" loading="lazy" />
                      {props.alt && (
                        <p className="text-center text-sm text-slate-400 mt-3 italic">{props.alt}</p>
                      )}
                    </div>
                  </figure>
                ),
                hr: () => (
                  <div className="my-10 flex items-center justify-center gap-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-purple-500/30" />
                    <div className="flex gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-purple-400/60" />
                      <div className="w-1 h-1 rounded-full bg-cyan-400/60" />
                      <div className="w-1 h-1 rounded-full bg-purple-400/60" />
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-purple-500/30" />
                  </div>
                ),
              }}
            >
              {chapter.content}
            </ReactMarkdown>
          </div>

          <div className="mt-16 mb-8 flex items-center justify-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-purple-500/20" />
            <div className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500/40" />
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-purple-500/20" />
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-xl border-t border-purple-500/20 shadow-lg shadow-purple-500/5 z-40">
        <div className="container mx-auto px-4 py-2.5">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              onClick={goPrev}
              disabled={!hasPrev}
              className="text-slate-300 hover:text-purple-300 hover:bg-purple-500/10 disabled:opacity-20 transition-all min-w-[100px] justify-start"
              data-testid="button-prev-chapter"
            >
              <ChevronLeft className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="hidden sm:inline text-sm">Previous</span>
            </Button>

            <div className="flex-1 max-w-md mx-auto flex flex-col items-center gap-1">
              <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 rounded-full"
                  initial={false}
                  animate={{ width: `${((currentGlobalIndex + 1) / totalChapters) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {Math.round(((currentGlobalIndex + 1) / totalChapters) * 100)}% complete
              </span>
            </div>

            <Button
              variant="ghost"
              onClick={goNext}
              disabled={!hasNext}
              className="text-slate-300 hover:text-purple-300 hover:bg-purple-500/10 disabled:opacity-20 transition-all min-w-[100px] justify-end"
              data-testid="button-next-chapter"
            >
              <span className="hidden sm:inline text-sm">Next</span>
              <ChevronRight className="w-4 h-4 ml-1 flex-shrink-0" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
