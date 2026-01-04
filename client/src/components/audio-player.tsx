import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Music, Settings, ChevronUp, ChevronDown, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

interface AudioPlayerProps {
  audioPreference: string;
  audioMood: string;
  compact?: boolean;
}

const MOOD_LABELS: Record<string, string> = {
  epic: "Epic & Cinematic",
  calm: "Calm & Ambient",
  medieval: "Medieval & Folk",
  electronic: "Electronic & Synth",
  nature: "Nature Sounds",
};

export function AudioPlayer({ audioPreference, audioMood, compact = false }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (audioPreference === "silent") {
    return null;
  }

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className="h-8 w-8 text-slate-400 hover:text-white"
          data-testid="button-audio-mute"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
        <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
          <Music className="w-3 h-3 mr-1" />
          {audioPreference === "spotify" ? "Spotify" : MOOD_LABELS[audioMood] || "Curated"}
        </Badge>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-40"
    >
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-xl overflow-hidden">
        <div 
          className="flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-800/50 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500/30 to-purple-500/30 flex items-center justify-center">
            <Music className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">
              {audioPreference === "spotify" ? "Spotify" : "Curated Audio"}
            </p>
            <p className="text-xs text-slate-400">
              {MOOD_LABELS[audioMood] || "Select a mood"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400"
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            data-testid="button-audio-play"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          )}
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-slate-700"
            >
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="h-8 w-8 text-slate-400 hover:text-white"
                    data-testid="button-audio-mute-expanded"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="flex-1"
                    data-testid="slider-audio-volume"
                  />
                </div>

                {audioPreference === "spotify" ? (
                  <div className="text-center py-4">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-2">
                      Spotify Integration
                    </Badge>
                    <p className="text-sm text-slate-400">
                      Connect your Spotify account in settings to play your playlists
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 border-green-500/30 text-green-400 hover:bg-green-500/10"
                      data-testid="button-connect-spotify"
                    >
                      Connect Spotify
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mb-2">
                      Season Zero Preview
                    </Badge>
                    <p className="text-xs text-slate-500">
                      Curated tracks coming soon. Your preference is saved!
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function AudioPlayerCompact({ audioPreference, audioMood }: AudioPlayerProps) {
  return <AudioPlayer audioPreference={audioPreference} audioMood={audioMood} compact />;
}
