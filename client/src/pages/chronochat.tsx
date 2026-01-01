import React, { useEffect, useState } from 'react';
import { CommunityList } from '../components/chat/CommunityList';
import { ChannelList } from '../components/chat/ChannelList';
import { ChatContainer } from '../components/chat/ChatContainer';
import { MemberList } from '../components/chat/MemberList';
import { CreateCommunityModal } from '../components/chat/CreateCommunityModal';
import { CreateChannelModal } from '../components/chat/CreateChannelModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Community, Channel, Member } from '@shared/chat-types';
import { apiRequest } from '@/lib/queryClient';

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
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-2 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[240px,1fr,280px] gap-3">
        <div className="col-span-1">
          <CommunityList 
            communities={communities} 
            activeCommunityId={activeCommunity} 
            onSelect={(id) => {
              setActiveCommunity(id);
              setActiveChannel(null);
            }} 
            onCreate={() => setCreateCommunityOpen(true)} 
          />
        </div>

        <div className="col-span-1 md:col-span-1">
          <div className="grid grid-cols-1 md:grid-cols-[200px,1fr] gap-3">
            <div>
              <ChannelList 
                channels={channels} 
                onSelect={(id) => setActiveChannel(id)} 
                onCreate={() => setCreateChannelOpen(true)} 
              />
            </div>
            <div className="bg-slate-950/20 rounded-lg p-2 min-h-[500px]">
              {activeChannel ? (
                <ChatContainer channelId={activeChannel} />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  Select a channel to start chatting
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-1">
          <MemberList 
            members={members as any} 
            onView={(id) => console.log('view member', id)} 
          />
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
    </main>
  );
}
