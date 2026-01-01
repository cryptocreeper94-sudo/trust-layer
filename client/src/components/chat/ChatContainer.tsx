import React, { useEffect, useRef, useState } from 'react';
import { MessageItem } from './MessageItem';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Message } from '@shared/chat-types';
import { Loader2 } from 'lucide-react';

export const ChatContainer: React.FC<{ channelId: string }> = ({ channelId }) => {
  const queryClient = useQueryClient();
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement | null>(null);

  const { data: messagesData, isLoading } = useQuery<{ messages: Message[] }>({
    queryKey: ['/api/channel', channelId, 'messages'],
    queryFn: () => apiRequest('GET', `/api/channel/${channelId}/messages?limit=50`).then(r => r.json()),
    enabled: !!channelId,
    refetchInterval: 5000,
  });
  const messages = messagesData?.messages || [];

  const sendMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest('POST', `/api/channel/${channelId}/messages`, { content });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/channel', channelId, 'messages'] });
    },
  });

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || sendMutation.isPending) return;
    sendMutation.mutate(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[400px]">
      <div ref={listRef} className="flex-1 overflow-auto p-3 space-y-2" data-testid="chat-message-list">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400 text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map(msg => <MessageItem key={msg.id} message={msg} />)
        )}
      </div>

      <div className="p-3 border-t border-slate-800/40 bg-slate-900/20">
        <div className="flex gap-2">
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={handleKeyDown}
            placeholder="Type a message..." 
            className="flex-1 p-3 rounded-md bg-slate-900/40 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50" 
            data-testid="chat-input" 
          />
          <button 
            onClick={sendMessage} 
            disabled={sendMutation.isPending || !input.trim()}
            className="px-4 py-3 rounded-md bg-cyan-500 text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-400 transition-colors" 
            data-testid="chat-send"
          >
            {sendMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};
