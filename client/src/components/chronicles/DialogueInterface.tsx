import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DialogueChoice {
  id: string;
  text: string;
  consequence?: string;
}

interface DialogueMessage {
  id: string;
  speaker: 'player' | 'npc' | 'narrator';
  speakerName?: string;
  content: string;
  choices?: DialogueChoice[];
  avatarUrl?: string;
}

interface DialogueInterfaceProps {
  messages: DialogueMessage[];
  onChoice: (messageId: string, choiceId: string) => void;
  isTyping?: boolean;
  npcName?: string;
  npcAvatar?: string;
  playerAvatar?: string;
}

export const DialogueInterface: React.FC<DialogueInterfaceProps> = ({
  messages,
  onChoice,
  isTyping,
  npcName,
  npcAvatar,
  playerAvatar
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-slate-950/60 backdrop-blur-sm rounded-xl border border-slate-800" data-testid="dialogue-interface">
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          {npcAvatar && <img src={npcAvatar} alt="" className="w-10 h-10 rounded-full" />}
          <div>
            <div className="text-white font-medium">{npcName || 'Unknown'}</div>
            <div className="text-xs text-slate-400">In conversation</div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="dialogue-messages">
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex gap-3 ${msg.speaker === 'player' ? 'flex-row-reverse' : ''}`}
              data-testid={`dialogue-message-${msg.id}`}
            >
              {msg.speaker !== 'narrator' && (
                <div className="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0 overflow-hidden">
                  {(msg.speaker === 'player' ? playerAvatar : npcAvatar) && (
                    <img 
                      src={msg.speaker === 'player' ? playerAvatar : npcAvatar} 
                      alt="" 
                      className="w-full h-full object-cover" 
                    />
                  )}
                </div>
              )}

              <div className={`max-w-[75%] ${msg.speaker === 'narrator' ? 'mx-auto text-center' : ''}`}>
                {msg.speakerName && msg.speaker !== 'narrator' && (
                  <div className={`text-xs mb-1 ${msg.speaker === 'player' ? 'text-right text-cyan-400' : 'text-purple-400'}`}>
                    {msg.speakerName}
                  </div>
                )}

                <div className={`rounded-xl px-4 py-2 ${
                  msg.speaker === 'narrator' 
                    ? 'bg-transparent text-slate-400 italic'
                    : msg.speaker === 'player'
                      ? 'bg-cyan-500/20 text-white'
                      : 'bg-slate-800 text-white'
                }`}>
                  {msg.content}
                </div>

                {msg.choices && msg.choices.length > 0 && (
                  <div className="mt-3 space-y-2" data-testid={`dialogue-choices-${msg.id}`}>
                    {msg.choices.map((choice) => (
                      <motion.button
                        key={choice.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onChoice(msg.id, choice.id)}
                        className="w-full text-left px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-cyan-400 hover:bg-cyan-400/10 text-white text-sm transition-all"
                        data-testid={`dialogue-choice-${choice.id}`}
                      >
                        {choice.text}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
            data-testid="dialogue-typing"
          >
            <div className="w-8 h-8 rounded-full bg-slate-700" />
            <div className="bg-slate-800 rounded-xl px-4 py-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DialogueInterface;
