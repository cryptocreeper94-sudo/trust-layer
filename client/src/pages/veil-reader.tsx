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
    
    // Detect PART headers
    if (line.match(/^# PART [IVXLC]+:/i) || line.match(/^# PART (ONE|TWO|THREE|FOUR|FIVE|SIX|SEVEN|EIGHT|NINE|TEN|ELEVEN|TWELVE):/i)) {
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

  // Load saved position and check for updates
  useEffect(() => {
    if (volumes.length === 0) return;
    
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

  // TTS functions
  const playWithAIVoice = async (text: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/voice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.substring(0, 4000) })
      });

      if (!response.ok) {
        throw new Error('AI voice failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      audioRef.current = new Audio(url);
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
        URL.revokeObjectURL(url);
        // Auto-advance to next chapter when audio ends
        handleNextChapterAuto();
      };
      audioRef.current.onerror = () => {
        setIsPlaying(false);
        setIsLoading(false);
        URL.revokeObjectURL(url);
      };
      
      await audioRef.current.play();
      setIsPlaying(true);
      setIsLoading(false);
    } catch (err) {
      console.error('AI voice error:', err);
      setUseAIVoice(false);
      setIsLoading(false);
      
      if (speechSupported) {
        playWithBrowserSpeech(text);
      }
    }
  };

  const playWithBrowserSpeech = (text: string) => {
    if (!speechSupported) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      // Auto-advance to next chapter when audio ends
      handleNextChapterAuto();
    };
    utterance.onerror = () => {
      setIsPlaying(false);
    };
    
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  // Auto-advance to next chapter (called when audio ends)
  const handleNextChapterAuto = () => {
    if (volumes.length === 0) return;
    
    const volume = volumes[currentVolume];
    if (!volume) return;
    
    // Check if there's a next chapter in this volume
    if (currentChapter < volume.chapters.length - 1) {
      const nextChapter = currentChapter + 1;
      setCurrentChapter(nextChapter);
      // Clear last played ref so next play starts fresh on new chapter
      lastPlayedChapterRef.current = null;
      window.scrollTo(0, 0);
    } 
    // Check if there's a next volume
    else if (currentVolume < volumes.length - 1) {
      const nextVolume = currentVolume + 1;
      setCurrentVolume(nextVolume);
      setCurrentChapter(0);
      // Clear last played ref so next play starts fresh on new chapter
      lastPlayedChapterRef.current = null;
      window.scrollTo(0, 0);
    }
    // End of book - just stop
  };

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

    // Clean text for TTS - remove emojis and formatting
    let text = chapter.content
      .replace(/[!]{2,}/g, '!')
      .replace(/[:;]/g, ',')
      .replace(/[*_~`#]/g, '')
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading Through The Veil...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || volumes.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Failed to load content'}</p>
          <Link href="/veil">
            <Button className="bg-cyan-600 hover:bg-cyan-500">Return to Veil</Button>
          </Link>
        </div>
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
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <p className="text-xs text-cyan-400">{volume.title}</p>
              <p className="text-sm text-white font-medium truncate max-w-[200px] md:max-w-none">{chapter.title}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* TTS Controls */}
            {(speechSupported || useAIVoice) && (
              <div className="flex items-center gap-2">
                {isLoading ? (
                  <Button 
                    size="sm" 
                    disabled
                    className="bg-cyan-600 text-white px-4"
                  >
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Loading...
                  </Button>
                ) : isPlaying ? (
                  <Button 
                    size="icon" 
                    onClick={handlePause}
                    className="bg-amber-500 hover:bg-amber-600 text-white rounded-full w-8 h-8"
                    data-testid="button-pause-chapter"
                    title="Pause"
                  >
                    <Pause className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button 
                    size="icon" 
                    onClick={handlePlay}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full w-8 h-8"
                    data-testid="button-play-chapter"
                    title={isPaused ? 'Resume' : 'Play'}
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                )}
                {(isPlaying || isPaused) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleStop}
                    className="text-slate-400 hover:text-white"
                    title="Stop"
                  >
                    <VolumeX className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDownloadPDF}
                className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                title="Download Markdown"
              >
                <Download className="w-4 h-4" />
                <span className="hidden md:inline text-xs ml-1">MD</span>
              </Button>
            </div>
            
            <span className="text-xs text-slate-500 hidden md:block">
              {currentGlobalIndex + 1} of {totalChapters}
            </span>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowWhatsNew(true)}
              className="text-slate-300 hover:text-white relative"
              title="What's New"
            >
              <Sparkles className="w-4 h-4" />
              {newUpdatesSinceVisit.length > 0 && !hasSeenUpdates && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              )}
            </Button>
            
            <Link href="/veil">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
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
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-slate-900 z-50 overflow-y-auto border-r border-slate-800"
            >
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Contents</h2>
                <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {volumes.map((vol, volIndex) => (
                <div key={vol.id} className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ScrollText className="w-4 h-4 text-cyan-400" />
                    <h3 className="font-semibold text-cyan-400 text-sm">
                      {vol.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{vol.subtitle}</p>
                  
                  <div className="space-y-1">
                    {vol.chapters.map((chap, chapIndex) => (
                      <button
                        key={chap.id}
                        onClick={() => goToChapter(volIndex, chapIndex)}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                          currentVolume === volIndex && currentChapter === chapIndex
                            ? 'bg-cyan-500/20 text-cyan-300'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        {chap.title}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="pt-20 pb-24 px-4">
        <motion.div
          key={`${currentVolume}-${currentChapter}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <div className="mb-8">
            <span className="text-sm text-cyan-400">
              {volume.title}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">{chapter.title}</h1>
          </div>

          <div className="prose prose-invert prose-lg max-w-none 
            prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-4
            prose-headings:text-white
            prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-cyan-400
            prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-purple-400
            prose-strong:text-white
            prose-ul:text-slate-300
            prose-li:text-slate-300
            prose-blockquote:border-l-cyan-500 prose-blockquote:bg-slate-900/50 prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:rounded-r
            prose-blockquote:text-slate-300 prose-blockquote:italic
            prose-hr:border-slate-700
          ">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {chapter.content}
            </ReactMarkdown>
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-800 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={goPrev}
            disabled={!hasPrev}
            className="text-slate-300 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span className="hidden md:inline">Previous</span>
          </Button>

          <div className="flex-1 mx-4">
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
                style={{ width: `${((currentGlobalIndex + 1) / totalChapters) * 100}%` }}
              />
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={goNext}
            disabled={!hasNext}
            className="text-slate-300 hover:text-white disabled:opacity-30"
          >
            <span className="hidden md:inline">Next</span>
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
