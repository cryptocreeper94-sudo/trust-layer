import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CommunityList } from '../components/chat/CommunityList';
import { ChannelList } from '../components/chat/ChannelList';
import { ChatContainer } from '../components/chat/ChatContainer';
import { MemberList } from '../components/chat/MemberList';
import { CreateCommunityModal } from '../components/chat/CreateCommunityModal';
import { CreateChannelModal } from '../components/chat/CreateChannelModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Community, Channel, Member } from '@shared/chat-types';
import { apiRequest } from '@/lib/queryClient';

const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

export default function ChronoChatPage() {
  const queryClient = useQueryClient();
  const [activeCommunity, setActiveCommunity] = useState<string | null>(null);
  const [activeChannel, setActiveChannel] = useState<string | null>(null);
  const [createCommunityOpen, setCreateCommunityOpen] = useState(false);
  const [createChannelOpen, setCreateChannelOpen] = useState(false);

  const { data: communitiesData } = useQuery<{ communities: Community[] }>({
    queryKey: ['/api/community/list'],
    queryFn: () => apiRequest('GET', '/api/community/list').then(r => r.json()),
  });
  const communities = communitiesData?.communities || [];

  const { data: channelsData } = useQuery<{ channels: Channel[] }>({
    queryKey: ['/api/community', activeCommunity, 'channels'],
    queryFn: () => apiRequest('GET', `/api/community/${activeCommunity}/channels`).then(r => r.json()),
    enabled: !!activeCommunity,
  });
  const channels = channelsData?.channels || [];

  const { data: membersData } = useQuery<{ members: Member[] }>({
    queryKey: ['/api/community', activeCommunity, 'members'],
    queryFn: () => apiRequest('GET', `/api/community/${activeCommunity}/members`).then(r => r.json()),
    enabled: !!activeCommunity,
  });
  const members = membersData?.members || [];

  const createCommunityMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const res = await apiRequest('POST', '/api/community/create', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/community/list'] });
      setCreateCommunityOpen(false);
    },
  });

  const createChannelMutation = useMutation({
    mutationFn: async (data: { name: string; category?: string }) => {
      const res = await apiRequest('POST', `/api/community/${activeCommunity}/channels`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/community', activeCommunity, 'channels'] });
      setCreateChannelOpen(false);
    },
  });

  useEffect(() => {
    if (!activeCommunity && communities.length > 0) {
      setActiveCommunity(communities[0].id);
    }
  }, [communities, activeCommunity]);

  useEffect(() => {
    if (!activeChannel && channels.length > 0) {
      setActiveChannel(channels[0].id);
    }
  }, [channels, activeChannel]);

  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="#06b6d4" size={400} top="10%" left="5%" delay={0} />
      <GlowOrb color="#8b5cf6" size={350} top="50%" left="80%" delay={2} />
      <GlowOrb color="#ec4899" size={300} top="80%" left="30%" delay={4} />

      <div className="relative z-10 pt-20 pb-12 px-2 md:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto mb-6"
        >
          <h1 className="text-2xl md:text-3xl font-bold">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">ChronoChat</span>
          </h1>
          <p className="text-sm text-white/50 mt-1">Community messaging platform</p>
        </motion.div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[240px,1fr,280px] gap-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="col-span-1 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
            style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}
          >
            <CommunityList 
              communities={communities} 
              activeCommunityId={activeCommunity} 
              onSelect={(id) => {
                setActiveCommunity(id);
                setActiveChannel(null);
              }} 
              onCreate={() => setCreateCommunityOpen(true)} 
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="col-span-1 md:col-span-1"
          >
            <div className="grid grid-cols-1 md:grid-cols-[200px,1fr] gap-3">
              <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}>
                <ChannelList 
                  channels={channels} 
                  onSelect={(id) => setActiveChannel(id)} 
                  onCreate={() => setCreateChannelOpen(true)} 
                />
              </div>
              <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-2 min-h-[500px]" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}>
                {activeChannel ? (
                  <ChatContainer channelId={activeChannel} />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    Select a channel to start chatting
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="col-span-1 md:col-span-1 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
            style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}
          >
            <MemberList 
              members={members as any} 
              onView={(id) => console.log('view member', id)} 
            />
          </motion.div>
        </div>
      </div>

      <CreateCommunityModal 
        open={createCommunityOpen} 
        onClose={() => setCreateCommunityOpen(false)} 
        onCreate={async (data) => {
          await createCommunityMutation.mutateAsync(data);
        }} 
      />
      <CreateChannelModal 
        open={createChannelOpen} 
        categories={['General', 'Voice', 'Announcements']} 
        onClose={() => setCreateChannelOpen(false)} 
        onCreate={async (data) => {
          await createChannelMutation.mutateAsync(data);
        }} 
      />
    </div>
  );
}
