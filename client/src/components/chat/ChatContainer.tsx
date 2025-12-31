import React, { useEffect, useRef, useState } from 'react';
import { MessageItem } from './MessageItem';
import type { Message } from '@shared/chat-types';

export const ChatContainer: React.FC<{ channelId: string }> = ({ channelId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
  }, [channelId]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, {
      id: `local-${Date.now()}`,
      channelId,
      author: { id: 'me', username: 'You' },
      content: input,
      createdAt: new Date().toISOString()
    }]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={listRef} className="flex-1 overflow-auto p-3 space-y-2" data-testid="chat-message-list">
        {messages.map(msg => <MessageItem key={msg.id} message={msg} />)}
      </div>

      <div className="p-3 border-t border-slate-800/40 bg-slate-900/20">
        <div className="flex gap-2">
          <button className="p-2 rounded-md bg-slate-800/40 text-white">😊</button>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Message #channel" className="flex-1 p-3 rounded-md bg-slate-900/40 text-white" data-testid="chat-input" />
          <button onClick={sendMessage} className="p-3 rounded-md bg-cyan-500 text-black" data-testid="chat-send">Send</button>
        </div>
      </div>
    </div>
  );
};
