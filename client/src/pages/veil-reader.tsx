import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, ChevronLeft, ChevronRight, Menu, X, Home, 
  BookMarked, ScrollText, FileText, ExternalLink, Volume2, VolumeX, Pause, Play, Download, ArrowLeft, Sparkles, Bell, Loader2,
  Feather, Crown, Flame, Eye, Star
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
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [useAIVoice, setUseAIVoice] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastPlayedChapterRef = useRef<string | null>(null);

  useEffect(() => {
    async function loadEbook() {
      try {
        const response = await fetch('/api/veil/chapters');
        if (!response.ok) {
          throw new Error(`Failed to load ebook: ${response.status}`);
        }
        const parsedVolumes = await response.json();
        if (!Array.isArray(parsedVolumes) || parsedVolumes.length === 0) {
          throw new Error('Invalid ebook data received');
        }
        setVolumes(parsedVolumes);
        setLoading(false);
      } catch (err: any) {
        console.error('Error loading ebook:', err);
        setError(err?.message || 'Failed to load ebook content');
        setLoading(false);
      }
    }
    loadEbook();
  }, []);

  useEffect(() => {
    setSpeechSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  useEffect(() => {
    if (volumes.length === 0) return;
    
    const hash = window.location.hash.slice(1);
    if (hash) {
      for (let volIdx = 0; volIdx < volumes.length; volIdx++) {
        const vol = volumes[volIdx];
        for (let chapIdx = 0; chapIdx < vol.chapters.length; chapIdx++) {
          const chap = vol.chapters[chapIdx];
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
            window.history.replaceState(null, '', window.location.pathname);
            return;
          }
        }
      }
    }
  }, [volumes]);

  useEffect(() => {
    if (volumes.length === 0) return;
    
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

  useEffect(() => {
    if (volumes.length === 0) return;
    
    const data = {
      currentVolume,
      currentChapter,
      lastSeenVersion: hasSeenUpdates ? CURRENT_VERSION : undefined
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [currentVolume, currentChapter, hasSeenUpdates, volumes]);

  const [ttsError, setTtsError] = useState<string | null>(null);
  const [voiceProvider, setVoiceProvider] = useState<string>('');

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

      const provider = response.headers.get('X-Voice-Provider') || 'ai';
      const voiceName = response.headers.get('X-Voice-Name') || '';
      setVoiceProvider(provider === 'elevenlabs' ? `ElevenLabs ${voiceName}` : `OpenAI ${voiceName}`);

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
        tryBrowserSpeech(text);
      }
    } catch (err: any) {
      console.error('AI voice error:', err);
      setUseAIVoice(false);
      setIsLoading(false);
      tryBrowserSpeech(text);
    }
  };

  const tryBrowserSpeech = (text: string) => {
    setVoiceProvider('Browser');
    if ('speechSynthesis' in window) {
      playWithBrowserSpeech(text);
    } else {
      setTtsError('Voice not available on this device. Download the PDF and open in Adobe Reader for read-aloud.');
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
        setTtsError('Browser voice failed. Download PDF and use Adobe Reader for read-aloud.');
      };
      
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    } catch (e) {
      console.error('Browser speech exception:', e);
      setTtsError('Voice not available. Download PDF and use Adobe Reader for read-aloud.');
    }
  };

  useEffect(() => {
    if (ttsError) {
      const timer = setTimeout(() => setTtsError(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [ttsError]);

  const autoPlayNextRef = useRef(false);

  const handleNextChapterAuto = () => {
    if (volumes.length === 0) return;
    
    const volume = volumes[currentVolume];
    if (!volume) return;
    
    if (currentChapter < volume.chapters.length - 1) {
      const nextChapter = currentChapter + 1;
      setCurrentChapter(nextChapter);
      lastPlayedChapterRef.current = null;
      autoPlayNextRef.current = true;
      window.scrollTo(0, 0);
    } else if (currentVolume < volumes.length - 1) {
      const nextVolume = currentVolume + 1;
      setCurrentVolume(nextVolume);
      setCurrentChapter(0);
      lastPlayedChapterRef.current = null;
      autoPlayNextRef.current = true;
      window.scrollTo(0, 0);
    }
  };

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
    
    setUseAIVoice(true);
    
    const volume = volumes[currentVolume];
    const chapter = volume.chapters[currentChapter];
    const chapterId = `${currentVolume}-${currentChapter}`;
    
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
    
    try {
      const silentAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
      await silentAudio.play();
      silentAudio.pause();
    } catch (e) {}
    
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
    const a = document.createElement('a');
    a.href = '/api/veil/pdf';
    a.download = 'Through-The-Veil.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center relative z-10"
        >
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 animate-ping" />
            <div className="absolute inset-0 rounded-full border-2 border-t-purple-400 border-r-cyan-400 border-b-transparent border-l-transparent animate-spin" />
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-500/10 to-cyan-500/10 backdrop-blur-sm border border-white/5" />
            <BookOpen className="absolute inset-0 m-auto w-7 h-7 text-purple-400" />
          </div>
          <p className="text-slate-200 text-lg font-medium mb-2">Loading</p>
          <p className="text-sm bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent font-semibold tracking-wide">Through The Veil</p>
        </motion.div>
      </div>
    );
  }

  if (error || volumes.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm relative z-10"
        >
          <GlassCard glow className="p-8">
            <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/20 flex items-center justify-center shadow-lg shadow-red-500/10">
              <X className="w-7 h-7 text-red-400" />
            </div>
            <p className="text-red-300 mb-2 font-medium text-lg">{error || 'Failed to load content'}</p>
            <p className="text-slate-500 text-sm mb-6">Please try again or return to the book page.</p>
            <Link href="/veil">
              <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all w-full py-5">
                Return to Veil
              </Button>
            </Link>
          </GlassCard>
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
  const progressPercent = Math.round(((currentGlobalIndex + 1) / totalChapters) * 100);

  return (
    <div className="min-h-screen bg-slate-950 relative">
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-2xl border-b border-purple-500/15" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        <div className="container mx-auto px-4 py-2.5 relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-400 hover:text-purple-300 hover:bg-purple-500/10 transition-all rounded-xl"
              data-testid="button-toggle-sidebar"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/20 shadow-sm shadow-purple-500/10">
                <BookOpen className="w-4 h-4 text-purple-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-[0.15em] bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">{volume.title}</p>
                <p className="text-sm text-white font-medium truncate max-w-[160px] sm:max-w-[300px] md:max-w-[400px]">{chapter.title}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            {(speechSupported || useAIVoice) && (
              <div className="flex items-center gap-1.5 group relative">
                {isLoading ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/20 backdrop-blur-sm">
                    <div className="w-3.5 h-3.5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-purple-300 hidden sm:inline">Loading voice...</span>
                  </div>
                ) : isPlaying ? (
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-purple-500/15 to-cyan-500/10 border border-purple-500/20 backdrop-blur-sm">
                    <div className="flex items-center gap-0.5 mr-1">
                      {[0, 150, 300, 450].map((delay, i) => (
                        <motion.div
                          key={i}
                          className={`w-0.5 rounded-full ${i % 2 === 0 ? 'bg-purple-400' : 'bg-cyan-400'}`}
                          animate={{ height: [8, 14, 8] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: delay / 1000 }}
                        />
                      ))}
                    </div>
                    {voiceProvider && (
                      <span className="text-[9px] text-purple-300/70 font-mono hidden sm:inline mr-1">{voiceProvider}</span>
                    )}
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
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-full w-8 h-8 shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/40 hover:scale-110"
                    data-testid="button-play-chapter"
                    title={isPaused ? 'Resume' : (useAIVoice ? 'Listen with ElevenLabs' : 'Listen (Browser Voice)')}
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
                <div className="absolute top-full right-0 mt-2 w-72 p-4 bg-slate-900/95 backdrop-blur-2xl border border-purple-500/20 rounded-xl shadow-2xl shadow-purple-500/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center shadow-md shadow-purple-500/20">
                      <Volume2 className="w-3 h-3 text-white" />
                    </div>
                    <p className="text-white font-semibold text-sm">AI Narration</p>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed mb-2">
                    Powered by ElevenLabs Rachel voice with OpenAI Nova as backup. Natural, expressive narration for every chapter.
                  </p>
                  {voiceProvider && (
                    <p className="text-cyan-400 text-[10px] font-mono mb-2">Currently using: {voiceProvider}</p>
                  )}
                  <p className="text-purple-400 text-xs">For offline listening, download PDF and use Adobe Reader's read-aloud.</p>
                </div>
                {ttsError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full right-0 mt-2 w-72 p-3 bg-red-950/90 backdrop-blur-xl border border-red-500/30 rounded-xl shadow-2xl z-50 text-xs"
                  >
                    <p className="text-red-200 mb-2">{ttsError}</p>
                    <button 
                      onClick={() => handleDownloadPDF()} 
                      className="text-cyan-400 hover:text-cyan-300 underline block transition-colors mb-1"
                      data-testid="button-tts-error-pdf"
                    >
                      Download PDF for Adobe Reader
                    </button>
                    <a href="/veil" className="text-purple-400 hover:text-purple-300 underline block transition-colors">Go to download page</a>
                  </motion.div>
                )}
              </div>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDownloadPDF}
              className="text-slate-400 hover:text-purple-300 hover:bg-purple-500/10 transition-all rounded-xl"
              title="Download"
              data-testid="button-download-md"
            >
              <Download className="w-4 h-4" />
            </Button>

            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/60 border border-white/5 backdrop-blur-sm">
              <BookMarked className="w-3 h-3 text-purple-400" />
              <span className="text-xs text-slate-400 font-mono">
                {currentGlobalIndex + 1}<span className="text-slate-600">/</span>{totalChapters}
              </span>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowWhatsNew(true)}
              className="text-slate-400 hover:text-purple-300 hover:bg-purple-500/10 relative transition-all rounded-xl"
              title="What's New"
              data-testid="button-whats-new"
            >
              <Sparkles className="w-4 h-4" />
              {newUpdatesSinceVisit.length > 0 && !hasSeenUpdates && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-pulse shadow-lg shadow-purple-500/50" />
              )}
            </Button>
            
            <Link href="/veil">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-purple-300 hover:bg-purple-500/10 transition-all rounded-xl" data-testid="button-home">
                <Home className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {showWhatsNew && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
              onClick={() => { setShowWhatsNew(false); setHasSeenUpdates(true); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-lg max-h-[80vh] overflow-auto px-4"
            >
              <GlassCard glow className="p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-center justify-between mb-5 relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/20 flex items-center justify-center shadow-sm shadow-purple-500/10">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white">What's New</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setShowWhatsNew(false); setHasSeenUpdates(true); }}
                    className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 mb-5 relative z-10">
                  <Badge variant="outline" className="border-purple-500/30 text-purple-400 backdrop-blur-sm">
                    <Crown className="w-3 h-3 mr-1" />
                    v{CURRENT_VERSION}
                  </Badge>
                </div>
                
                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 relative z-10">
                  {EBOOK_CHANGELOG.map((entry, i) => (
                    <motion.div 
                      key={entry.version}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`rounded-xl p-4 transition-all ${
                        i < newUpdatesSinceVisit.length 
                          ? 'bg-gradient-to-r from-cyan-500/10 to-purple-500/5 border border-cyan-500/20 shadow-sm shadow-cyan-500/5' 
                          : 'bg-slate-900/40 border border-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-sm text-white font-medium">v{entry.version}</span>
                        <span className="text-xs text-slate-500">{entry.date}</span>
                      </div>
                      <ul className="space-y-2">
                        {entry.updates.map((update, j) => (
                          <li key={j} className="text-sm">
                            <div className="text-left w-full p-2 rounded-lg hover:bg-white/[0.02] transition-colors">
                              <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold mr-2 uppercase tracking-wider ${
                                update.type === 'added' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' :
                                update.type === 'updated' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' :
                                'bg-red-500/20 text-red-400 border border-red-500/20'
                              }`}>
                                {update.type}
                              </span>
                              <span className="text-slate-300 text-xs leading-relaxed">{update.description}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-5 pt-5 border-t border-white/5 relative z-10">
                  <Button
                    onClick={() => { setShowWhatsNew(false); setHasSeenUpdates(true); }}
                    className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all py-5"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Continue Reading
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
              className="fixed left-0 top-0 bottom-0 w-80 z-50 overflow-y-auto"
            >
              <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl border-r border-purple-500/15" />
              <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-purple-500/30 via-cyan-500/20 to-purple-500/30" />
              
              <div className="relative z-10">
                <div className="p-5 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-purple-500/5 to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/20 flex items-center justify-center shadow-lg shadow-purple-500/10">
                      <ScrollText className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Contents</h2>
                      <p className="text-[10px] text-slate-500 uppercase tracking-[0.15em]">{totalChapters} chapters</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white hover:bg-purple-500/10 rounded-xl">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="py-3">
                  {volumes.map((vol, volIndex) => (
                    <div key={vol.id} className="px-3 py-2">
                      <div className="flex items-center gap-2 mb-2 px-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400 shadow-sm shadow-purple-500/30" />
                        <h3 className="font-semibold text-[10px] uppercase tracking-[0.15em] bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                          {vol.title}
                        </h3>
                      </div>
                      <p className="text-[10px] text-slate-600 mb-2 px-2">{vol.subtitle}</p>
                      
                      <div className="space-y-0.5">
                        {vol.chapters.map((chap, chapIndex) => {
                          const isActive = currentVolume === volIndex && currentChapter === chapIndex;
                          return (
                            <motion.button
                              key={chap.id}
                              onClick={() => goToChapter(volIndex, chapIndex)}
                              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                                isActive
                                  ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/10 text-white border border-purple-500/25 shadow-md shadow-purple-500/10'
                                  : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-200'
                              }`}
                              data-testid={`chapter-nav-${volIndex}-${chapIndex}`}
                              whileHover={{ x: isActive ? 0 : 4 }}
                              transition={{ duration: 0.15 }}
                            >
                              <div className="flex items-center gap-2.5">
                                {isActive && (
                                  <motion.div 
                                    className="w-1 h-5 rounded-full bg-gradient-to-b from-purple-400 to-cyan-400 flex-shrink-0 shadow-sm shadow-purple-500/30"
                                    layoutId="activeChapterIndicator"
                                  />
                                )}
                                <span className={`text-xs leading-snug ${isActive ? 'font-medium' : ''}`}>{chap.title}</span>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-white/5 mt-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-3 h-3 text-purple-400" />
                      Progress
                    </span>
                    <span className="font-mono text-purple-400 font-medium">{progressPercent}%</span>
                  </div>
                  <div className="h-2 bg-slate-900/80 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 rounded-full shadow-sm shadow-purple-500/30"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-500/[0.04] rounded-full blur-3xl"
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 -right-32 w-80 h-80 bg-cyan-500/[0.03] rounded-full blur-3xl"
          animate={{ y: [0, 20, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
      </div>

      <div className="pt-20 pb-28 px-4 sm:px-6 md:px-8 relative z-10">
        <motion.div
          key={`${currentVolume}-${currentChapter}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto"
        >
          <div className="mb-12 sm:mb-16 pt-6 sm:pt-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
              <Badge variant="outline" className="border-purple-500/20 text-purple-400 backdrop-blur-sm text-[10px] uppercase tracking-[0.15em]">
                <Feather className="w-3 h-3 mr-1.5" />
                {volume.title}
              </Badge>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center leading-tight" data-testid="chapter-title">
              {chapter.title}
            </h1>
            <div className="flex items-center justify-center gap-3 mt-5">
              <div className="w-10 h-px bg-gradient-to-r from-transparent to-purple-500/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400 shadow-sm shadow-purple-500/30" />
              <div className="w-10 h-px bg-gradient-to-l from-transparent to-cyan-500/50" />
            </div>
          </div>

          <GlassCard className="p-5 sm:p-8 md:p-10 lg:p-14 relative overflow-hidden" glow>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-500/[0.03] to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-cyan-500/[0.02] to-transparent rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 prose prose-invert prose-lg max-w-none 
              prose-p:text-slate-300 prose-p:leading-[1.95] prose-p:mb-7 prose-p:text-[16px] sm:prose-p:text-[17px]
              prose-headings:text-white
              prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-12 sm:prose-h2:mt-14 prose-h2:mb-6 sm:prose-h2:mb-7 prose-h2:font-bold
              prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-10 sm:prose-h3:mt-12 prose-h3:mb-4 sm:prose-h3:mb-5 prose-h3:text-purple-300
              prose-strong:text-white prose-strong:font-semibold
              prose-em:text-purple-200/90
              prose-ul:text-slate-300 prose-ul:space-y-2
              prose-ol:text-slate-300 prose-ol:space-y-2
              prose-li:text-slate-300 prose-li:leading-relaxed prose-li:text-[16px] sm:prose-li:text-[17px]
              prose-blockquote:border-l-2 prose-blockquote:border-l-purple-500/60 prose-blockquote:bg-purple-500/5 prose-blockquote:px-4 sm:prose-blockquote:px-5 prose-blockquote:py-3 prose-blockquote:rounded-r-xl
              prose-blockquote:text-slate-200 prose-blockquote:italic prose-blockquote:not-italic prose-blockquote:text-[16px] sm:prose-blockquote:text-[17px] prose-blockquote:backdrop-blur-sm prose-blockquote:border prose-blockquote:border-purple-500/10
              prose-hr:border-purple-500/20 prose-hr:my-10
              prose-a:text-purple-400 prose-a:no-underline hover:prose-a:text-purple-300 prose-a:transition-colors
              prose-code:text-cyan-300 prose-code:bg-slate-800/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:border prose-code:border-slate-700/50
              prose-img:rounded-xl prose-img:border prose-img:border-purple-500/20 prose-img:shadow-xl prose-img:shadow-purple-500/10
              [&>p:first-of-type]:first-letter:text-5xl [&>p:first-of-type]:first-letter:font-bold [&>p:first-of-type]:first-letter:bg-gradient-to-b [&>p:first-of-type]:first-letter:from-purple-300 [&>p:first-of-type]:first-letter:to-cyan-400 [&>p:first-of-type]:first-letter:bg-clip-text [&>p:first-of-type]:first-letter:text-transparent [&>p:first-of-type]:first-letter:float-left [&>p:first-of-type]:first-letter:mr-3 [&>p:first-of-type]:first-letter:mt-1 [&>p:first-of-type]:first-letter:leading-none
            ">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ node, children, ...props }) => (
                    <h2 {...props} className="flex items-center gap-3 not-prose">
                      <div className="w-1 h-7 rounded-full bg-gradient-to-b from-purple-400 to-cyan-500 flex-shrink-0 shadow-sm shadow-purple-500/20" />
                      <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-200 to-cyan-200 bg-clip-text text-transparent mt-12 sm:mt-14 mb-6 sm:mb-7">{children}</span>
                    </h2>
                  ),
                  h3: ({ node, children, ...props }) => (
                    <h3 {...props} className="not-prose text-lg sm:text-xl font-semibold text-purple-300 mt-10 sm:mt-12 mb-4 sm:mb-5 flex items-center gap-2">
                      <Star className="w-3.5 h-3.5 text-purple-400/60 flex-shrink-0" />
                      {children}
                    </h3>
                  ),
                  blockquote: ({ node, children, ...props }) => (
                    <blockquote {...props} className="not-prose border-l-2 border-l-purple-500/60 bg-gradient-to-r from-purple-500/5 to-transparent backdrop-blur-sm px-4 sm:px-5 py-4 rounded-r-xl my-6 border border-purple-500/10">
                      <div className="text-slate-200 italic text-[16px] sm:text-[17px] leading-relaxed">{children}</div>
                    </blockquote>
                  ),
                  img: ({ node, ...props }) => (
                    <figure className="my-8 flex flex-col items-center not-prose">
                      <div className="bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-purple-500/20 shadow-xl shadow-purple-500/5 max-w-lg w-full">
                        <img {...props} className="w-full rounded-lg" loading="lazy" />
                        {props.alt && (
                          <p className="text-center text-sm text-slate-400 mt-3 italic">{props.alt}</p>
                        )}
                      </div>
                    </figure>
                  ),
                  hr: () => (
                    <div className="my-10 sm:my-12 flex items-center justify-center gap-3 not-prose">
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
          </GlassCard>

          <div className="mt-10 sm:mt-14 flex items-center justify-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-purple-500/20" />
            <div className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500/40" />
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-purple-500/20" />
          </div>

          <div className="mt-8 sm:mt-10 flex items-center justify-between gap-4 max-w-xl mx-auto">
            {hasPrev ? (
              <motion.button
                onClick={goPrev}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all group min-h-[44px]"
                whileHover={{ x: -4 }}
                data-testid="button-prev-inline"
              >
                <ChevronLeft className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
                <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors hidden sm:inline">Previous</span>
              </motion.button>
            ) : <div />}
            {hasNext ? (
              <motion.button
                onClick={goNext}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-cyan-500/5 border border-purple-500/20 hover:border-purple-500/40 hover:from-purple-500/15 hover:to-cyan-500/10 transition-all group min-h-[44px]"
                whileHover={{ x: 4 }}
                data-testid="button-next-inline"
              >
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors hidden sm:inline">Next Chapter</span>
                <ChevronRight className="w-4 h-4 text-purple-400 group-hover:text-cyan-400 transition-colors" />
              </motion.button>
            ) : <div />}
          </div>
        </motion.div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-2xl border-t border-purple-500/15" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        <div className="container mx-auto px-4 py-2.5 relative z-10">
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              onClick={goPrev}
              disabled={!hasPrev}
              className="text-slate-400 hover:text-purple-300 hover:bg-purple-500/10 disabled:opacity-20 transition-all min-w-[80px] sm:min-w-[100px] justify-start rounded-xl"
              data-testid="button-prev-chapter"
            >
              <ChevronLeft className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="hidden sm:inline text-sm">Previous</span>
            </Button>

            <div className="flex-1 max-w-md mx-auto flex flex-col items-center gap-1.5">
              <div className="w-full h-2 bg-slate-900/80 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  className="h-full bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 rounded-full shadow-sm shadow-purple-500/30"
                  initial={false}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                <Flame className="w-2.5 h-2.5 text-purple-400" />
                {progressPercent}% complete
              </span>
            </div>

            <Button
              variant="ghost"
              onClick={goNext}
              disabled={!hasNext}
              className="text-slate-400 hover:text-purple-300 hover:bg-purple-500/10 disabled:opacity-20 transition-all min-w-[80px] sm:min-w-[100px] justify-end rounded-xl"
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
