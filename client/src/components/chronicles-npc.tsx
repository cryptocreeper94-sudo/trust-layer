import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import { 
  MessageCircle, Send, User, Sparkles, Loader2, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";

interface ChroniclesNPCProps {
  characterName: string;
  personalityTraits: string[];
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  role: "user" | "npc";
  content: string;
  timestamp: Date;
}

const NPC_RESPONSES: Record<string, string[]> = {
  greeting: [
    "Greetings, traveler! I am Aldric, Keeper of the Chronicles. I see greatness within you.",
    "Welcome to your estate! I shall be your guide as you build your legacy in this realm.",
    "The winds of fate have brought you here. Your story is just beginning.",
  ],
  building: [
    "A wise choice to expand your domain! Every great legacy begins with a single stone.",
    "Your estate grows stronger. The Chronicles will remember your dedication.",
    "Building requires patience, but the rewards are eternal.",
  ],
  encouragement: [
    "You show the heart of a true leader. Continue on your path.",
    "Few have your determination. Your legend grows with each decision.",
    "The realm watches your progress with great interest.",
  ],
  question: [
    "That is a profound question. In the Chronicles, we believe that every choice shapes destiny.",
    "The wisdom you seek lies within your own journey. Trust your instincts.",
    "Many have asked similar questions. The answer reveals itself through action, not words.",
  ],
  farewell: [
    "May your path be true. I shall watch over your estate until we meet again.",
    "Until next time, traveler. The Chronicles await your next chapter.",
    "Go forth and build your legacy. The realm has faith in you.",
  ],
};

function generateNPCResponse(userMessage: string, traits: string[]): string {
  const msg = userMessage.toLowerCase();
  
  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey") || msg.includes("greet")) {
    return getRandomResponse("greeting");
  }
  if (msg.includes("build") || msg.includes("estate") || msg.includes("house") || msg.includes("expand")) {
    return getRandomResponse("building");
  }
  if (msg.includes("help") || msg.includes("what") || msg.includes("how") || msg.includes("why") || msg.includes("?")) {
    return getRandomResponse("question");
  }
  if (msg.includes("bye") || msg.includes("goodbye") || msg.includes("leave") || msg.includes("later")) {
    return getRandomResponse("farewell");
  }
  
  const traitResponse = traits.length > 0 
    ? `I sense your ${traits[0]} nature. ` 
    : "";
  
  return traitResponse + getRandomResponse("encouragement");
}

function getRandomResponse(category: keyof typeof NPC_RESPONSES): string {
  const responses = NPC_RESPONSES[category];
  return responses[Math.floor(Math.random() * responses.length)];
}

export function ChroniclesNPC({ 
  characterName, 
  personalityTraits, 
  isOpen, 
  onClose 
}: ChroniclesNPCProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "npc",
      content: `Greetings, ${characterName}! I am Aldric, Keeper of the Chronicles. How may I assist you on your journey today?`,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    const npcResponse = generateNPCResponse(inputValue, personalityTraits);
    
    const npcMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "npc",
      content: npcResponse,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, npcMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-4 right-4 z-50 w-80 md:w-96"
        >
          <Card className="bg-slate-900/95 border-slate-700 shadow-2xl backdrop-blur-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-600 to-purple-600 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Aldric</p>
                  <p className="text-xs text-white/70">Keeper of Chronicles</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-white/30 text-white/80 text-xs">
                  Season Zero
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClose}
                  className="text-white/80 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto p-3 space-y-3">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-2.5 text-sm ${
                      message.role === "user"
                        ? "bg-cyan-600 text-white"
                        : "bg-slate-800 text-slate-200 border border-slate-700"
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-400 flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Aldric is typing...
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-slate-700 bg-slate-800/50">
              <div className="flex gap-2">
                <Input
                  data-testid="input-npc-message"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Speak with Aldric..."
                  className="bg-slate-700 border-slate-600 text-white text-sm"
                  disabled={isTyping}
                />
                <Button
                  data-testid="button-send-message"
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  size="sm"
                  className="bg-cyan-600 hover:bg-cyan-500"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-center">
                AI responses coming in Season 1
              </p>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function NPCChatButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-4 right-4 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/30"
      data-testid="button-open-npc-chat"
    >
      <MessageCircle className="w-6 h-6 text-white" />
    </motion.button>
  );
}
