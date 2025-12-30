import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Palette, Upload, Sparkles, Loader2, CheckCircle,
  Image as ImageIcon, FileText, Tag, Layers, Plus, X
} from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

interface Attribute {
  trait_type: string;
  value: string;
}

export default function NftCreator() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    collection: "new",
    collectionName: "",
    royalties: "5",
    supply: "1",
  });

  const mintMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/nft/mint", {
        name: formData.name,
        description: formData.description,
        imageUrl: imagePreview,
        attributes: JSON.stringify(attributes),
        collection: formData.collection === "new" ? formData.collectionName : formData.collection,
        royalties: formData.royalties,
        supply: formData.supply,
      });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "NFT Minted!", description: "Your NFT has been created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/nft"] });
      setStep(4);
    },
    onError: (error: any) => {
      toast({ title: "Minting Failed", description: error.message, variant: "destructive" });
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addAttribute = () => {
    setAttributes([...attributes, { trait_type: "", value: "" }]);
  };

  const updateAttribute = (index: number, field: "trait_type" | "value", value: string) => {
    const updated = [...attributes];
    updated[index][field] = value;
    setAttributes(updated);
  };

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const canProceed = () => {
    if (step === 1) return !!imagePreview;
    if (step === 2) return !!formData.name;
    if (step === 3) return true;
    return false;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-orange-500/50 text-orange-400 text-[10px]">Creator</Badge>
            <BackButton />
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-16 pb-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <motion.div className="p-2 rounded-xl bg-orange-500/20 border border-orange-500/30" animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                <Palette className="w-6 h-6 text-orange-400" />
              </motion.div>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
              NFT <span className="text-orange-400">Creator</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Create and mint your own NFTs on DarkWave Smart Chain. No code required.
            </p>
          </motion.div>

          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step >= s ? 'bg-orange-500 text-white' : 'bg-white/10 text-muted-foreground'
                  }`}>
                    {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                  </div>
                  {s < 4 && <div className={`w-8 h-0.5 ${step > s ? 'bg-orange-500' : 'bg-white/10'}`} />}
                </div>
              ))}
            </div>
          </div>

          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <GlassCard>
                <div className="p-6">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-orange-400" /> Upload Artwork
                  </h2>
                  
                  <div className="mb-6">
                    <label className={`block aspect-square max-w-sm mx-auto rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                      imagePreview ? 'border-orange-500' : 'border-white/20 hover:border-white/40'
                    }`}>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" data-testid="input-nft-image" />
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                          <Upload className="w-12 h-12 text-white/30 mb-3" />
                          <p className="text-sm text-white/50 mb-1">Click to upload</p>
                          <p className="text-xs text-white/30">PNG, JPG, GIF, SVG (max 10MB)</p>
                        </div>
                      )}
                    </label>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setStep(2)} disabled={!canProceed()} data-testid="button-next-step">
                      Next Step
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <GlassCard>
                <div className="p-6">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-400" /> NFT Details
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs">Name *</Label>
                      <Input placeholder="My Awesome NFT" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-white/5 border-white/10" data-testid="input-nft-name" />
                    </div>
                    
                    <div>
                      <Label className="text-xs">Description</Label>
                      <Textarea placeholder="Describe your NFT..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="bg-white/5 border-white/10 min-h-[100px]" data-testid="input-nft-description" />
                    </div>
                    
                    <div>
                      <Label className="text-xs">Collection</Label>
                      <Select value={formData.collection} onValueChange={(v) => setFormData({...formData, collection: v})}>
                        <SelectTrigger className="bg-white/5 border-white/10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Create New Collection</SelectItem>
                          <SelectItem value="darkwave-genesis">DarkWave Genesis</SelectItem>
                          <SelectItem value="user-created">My Collection</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {formData.collection === "new" && (
                      <div>
                        <Label className="text-xs">Collection Name</Label>
                        <Input placeholder="My Collection" value={formData.collectionName} onChange={(e) => setFormData({...formData, collectionName: e.target.value})} className="bg-white/5 border-white/10" />
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Royalties (%)</Label>
                        <Input type="number" min="0" max="15" value={formData.royalties} onChange={(e) => setFormData({...formData, royalties: e.target.value})} className="bg-white/5 border-white/10" />
                      </div>
                      <div>
                        <Label className="text-xs">Supply</Label>
                        <Input type="number" min="1" value={formData.supply} onChange={(e) => setFormData({...formData, supply: e.target.value})} className="bg-white/5 border-white/10" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" className="border-white/10" onClick={() => setStep(1)}>Back</Button>
                    <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setStep(3)} disabled={!canProceed()} data-testid="button-next-step-2">
                      Next Step
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <GlassCard>
                <div className="p-6">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-orange-400" /> Attributes (Optional)
                  </h2>
                  
                  <div className="space-y-3 mb-4">
                    {attributes.map((attr, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input placeholder="Trait (e.g., Color)" value={attr.trait_type} onChange={(e) => updateAttribute(index, "trait_type", e.target.value)} className="flex-1 bg-white/5 border-white/10 text-sm" />
                        <Input placeholder="Value (e.g., Blue)" value={attr.value} onChange={(e) => updateAttribute(index, "value", e.target.value)} className="flex-1 bg-white/5 border-white/10 text-sm" />
                        <Button variant="ghost" size="icon" className="shrink-0 hover:bg-red-500/20" onClick={() => removeAttribute(index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full border-dashed border-white/20" onClick={addAttribute}>
                    <Plus className="w-4 h-4 mr-2" /> Add Attribute
                  </Button>
                  
                  <div className="mt-6 p-4 rounded-lg bg-white/5">
                    <h3 className="text-sm font-bold mb-3">Preview</h3>
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-white/10 flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-white/30" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white truncate">{formData.name || "Untitled"}</p>
                        <p className="text-xs text-muted-foreground truncate">{formData.description || "No description"}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant="outline" className="text-[9px]">{formData.royalties}% royalty</Badge>
                          <Badge variant="outline" className="text-[9px]">Supply: {formData.supply}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" className="border-white/10" onClick={() => setStep(2)}>Back</Button>
                    <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => mintMutation.mutate()} disabled={mintMutation.isPending} data-testid="button-mint-nft">
                      {mintMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                      Mint NFT
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <GlassCard glow>
                <div className="p-8 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-2">NFT Minted Successfully!</h2>
                  <p className="text-muted-foreground mb-6">Your NFT is now on the DarkWave blockchain</p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/nft">
                      <Button className="bg-primary hover:bg-primary/90">View in Marketplace</Button>
                    </Link>
                    <Button variant="outline" className="border-white/10" onClick={() => {
                      setStep(1);
                      setImagePreview(null);
                      setAttributes([]);
                      setFormData({ name: "", description: "", collection: "new", collectionName: "", royalties: "5", supply: "1" });
                    }}>
                      Create Another
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
