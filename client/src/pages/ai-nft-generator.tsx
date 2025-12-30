import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Sparkles, Wand2, Image, Palette, Layers, Download,
  RefreshCw, Zap, Star, Heart, Share2, Settings, ChevronRight
} from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import darkwaveLogo from "@assets/generated_images/darkwave_token_transparent.png";

const STYLE_PRESETS = [
  { id: "cyberpunk", name: "Cyberpunk", preview: "🌃", desc: "Neon-lit futuristic aesthetics" },
  { id: "abstract", name: "Abstract", preview: "🎨", desc: "Bold shapes and colors" },
  { id: "anime", name: "Anime", preview: "✨", desc: "Japanese animation style" },
  { id: "pixel", name: "Pixel Art", preview: "👾", desc: "Retro 8-bit aesthetic" },
  { id: "3d", name: "3D Render", preview: "🔮", desc: "Modern 3D graphics" },
  { id: "watercolor", name: "Watercolor", preview: "🖼️", desc: "Soft painted look" },
  { id: "vaporwave", name: "Vaporwave", preview: "🌴", desc: "80s-90s aesthetic" },
  { id: "surreal", name: "Surreal", preview: "🌙", desc: "Dream-like imagery" },
];

const GENERATED_EXAMPLES = [
  { id: 1, style: "cyberpunk", prompt: "Neon dragon in rain", rarity: "Legendary" },
  { id: 2, style: "abstract", prompt: "Flowing energy waves", rarity: "Epic" },
  { id: 3, style: "pixel", prompt: "Space warrior", rarity: "Rare" },
  { id: 4, style: "3d", prompt: "Crystal skull", rarity: "Epic" },
];

export default function AINFTGenerator() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("cyberpunk");
  const [creativity, setCreativity] = useState([70]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedNFT, setGeneratedNFT] = useState<any>(null);
  const [step, setStep] = useState(1);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    setTimeout(() => {
      setIsGenerating(false);
      setGenerationProgress(100);
      setGeneratedNFT({
        id: Date.now(),
        style,
        prompt,
        rarity: ["Common", "Rare", "Epic", "Legendary"][Math.floor(Math.random() * 4)],
        traits: [
          { name: "Style", value: style },
          { name: "Creativity", value: `${creativity[0]}%` },
          { name: "Generation", value: "AI v2.0" },
        ],
      });
      setStep(2);
    }, 3000);
  };

  const rarityColors: Record<string, string> = {
    Common: "bg-gray-500/20 text-gray-400",
    Rare: "bg-blue-500/20 text-blue-400",
    Epic: "bg-purple-500/20 text-purple-400",
    Legendary: "bg-amber-500/20 text-amber-400",
  };

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
                className="p-3 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30"
                animate={{ 
                  boxShadow: ["0 0 20px rgba(236,72,153,0.2)", "0 0 50px rgba(236,72,153,0.4)", "0 0 20px rgba(236,72,153,0.2)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Wand2 className="w-7 h-7 text-pink-400" />
              </motion.div>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
              AI NFT <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Generator</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Create unique, one-of-a-kind NFTs with AI
            </p>
          </motion.div>

          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= s ? 'bg-primary text-primary-foreground' : 'bg-white/10 text-muted-foreground'
                }`}>
                  {s}
                </div>
                {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-primary' : 'bg-white/10'}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-4"
              >
                <GlassCard glow className="p-4">
                  <h2 className="font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-pink-400" />
                    Describe Your NFT
                  </h2>
                  <Textarea
                    placeholder="A majestic cyber dragon breathing neon flames in a futuristic cityscape..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px] bg-white/5 border-white/10"
                    data-testid="input-nft-prompt"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Be descriptive! Include colors, mood, setting, and style details.
                  </p>
                  
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Creativity Level</span>
                      <span className="text-sm font-mono">{creativity[0]}%</span>
                    </div>
                    <Slider
                      value={creativity}
                      onValueChange={setCreativity}
                      min={10}
                      max={100}
                      step={5}
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                      <span>Conservative</span>
                      <span>Wild</span>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-4">
                  <h2 className="font-bold mb-4 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-purple-400" />
                    Choose Style
                  </h2>
                  <div className="grid grid-cols-2 gap-2">
                    {STYLE_PRESETS.map((preset) => (
                      <motion.button
                        key={preset.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStyle(preset.id)}
                        className={`p-3 rounded-xl text-left transition-all ${
                          style === preset.id 
                            ? 'bg-primary/20 border-2 border-primary' 
                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{preset.preview}</span>
                          <span className="font-medium text-sm">{preset.name}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">{preset.desc}</p>
                      </motion.button>
                    ))}
                  </div>
                </GlassCard>

                <div className="lg:col-span-2">
                  <Button 
                    className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-lg"
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                    data-testid="button-generate-nft"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Generating... {generationProgress}%
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5 mr-2" />
                        Generate NFT
                      </>
                    )}
                  </Button>
                  {isGenerating && (
                    <Progress value={generationProgress} className="mt-2 h-1" />
                  )}
                </div>
              </motion.div>
            )}

            {step === 2 && generatedNFT && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-4"
              >
                <GlassCard glow className="p-4 aspect-square flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10" />
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative w-full h-full flex items-center justify-center"
                  >
                    <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center">
                      <Sparkles className="w-24 h-24 text-white/50" />
                    </div>
                    <Badge className={`absolute top-4 right-4 ${rarityColors[generatedNFT.rarity]}`}>
                      {generatedNFT.rarity}
                    </Badge>
                  </motion.div>
                </GlassCard>

                <div className="space-y-4">
                  <GlassCard className="p-4">
                    <h2 className="font-bold mb-3">NFT Details</h2>
                    <div className="space-y-2">
                      <div className="flex justify-between p-2 rounded bg-white/5">
                        <span className="text-muted-foreground text-sm">Prompt</span>
                        <span className="text-sm truncate max-w-[200px]">{generatedNFT.prompt}</span>
                      </div>
                      {generatedNFT.traits.map((trait: any, i: number) => (
                        <div key={i} className="flex justify-between p-2 rounded bg-white/5">
                          <span className="text-muted-foreground text-sm">{trait.name}</span>
                          <span className="text-sm capitalize">{trait.value}</span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  <GlassCard className="p-4">
                    <h2 className="font-bold mb-3">Actions</h2>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="gap-2">
                        <Heart className="w-4 h-4" />
                        Save
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Share2 className="w-4 h-4" />
                        Share
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                      <Button variant="outline" className="gap-2" onClick={() => { setStep(1); setGeneratedNFT(null); }}>
                        <RefreshCw className="w-4 h-4" />
                        Regenerate
                      </Button>
                    </div>
                  </GlassCard>

                  <Button 
                    className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                    onClick={() => setStep(3)}
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Mint as NFT
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <GlassCard glow className="p-6 text-center max-w-md mx-auto">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4"
                  >
                    <Sparkles className="w-10 h-10 text-green-400" />
                  </motion.div>
                  <h2 className="text-xl font-bold mb-2">Ready to Mint!</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your AI-generated NFT is ready to be minted on the DarkWave blockchain.
                  </p>
                  <div className="p-3 rounded-lg bg-white/5 mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Minting Fee</span>
                      <span>50 DWC</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Gas Fee</span>
                      <span>~0.1 DWC</span>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                    <Zap className="w-4 h-4 mr-2" />
                    Confirm Mint (50.1 DWC)
                  </Button>
                  <Button variant="ghost" className="w-full mt-2" onClick={() => setStep(2)}>
                    Back to Preview
                  </Button>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          {step === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <h2 className="font-bold mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                Recent Creations
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {GENERATED_EXAMPLES.map((example) => (
                  <GlassCard key={example.id} className="p-3 aspect-square relative overflow-hidden group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-12 h-12 text-white/20" />
                    </div>
                    <Badge className={`absolute top-2 right-2 ${rarityColors[example.rarity]} text-[9px]`}>
                      {example.rarity}
                    </Badge>
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-xs font-medium truncate">{example.prompt}</p>
                      <p className="text-[10px] text-muted-foreground capitalize">{example.style}</p>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
