import React, { useState } from 'react';
import { CommunityList } from '../components/chat/CommunityList';
import { ChannelList } from '../components/chat/ChannelList';
import { ChatContainer } from '../components/chat/ChatContainer';
import { MemberList } from '../components/chat/MemberList';
import { CreateCommunityModal } from '../components/chat/CreateCommunityModal';
import { CreateChannelModal } from '../components/chat/CreateChannelModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Community, Channel, Member } from '@shared/chat-types';
import { apiRequest } from '@/lib/queryClient';
import { useEffect } from 'react';

export default function SignalChatPage() {
  useEffect(() => {
    const existingManifest = document.querySelector('link[rel="manifest"]');
    if (existingManifest) existingManifest.remove();
    
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/signal-chat-manifest.json';
    document.head.appendChild(manifestLink);
    
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute('content', '#0891b2');
    
    document.title = 'Signal Chat | Trust Layer';
    
    return () => {
      manifestLink.remove();
    };
  }, []);
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
    <>
      <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-2 text-white" data-testid="signal-chat-page">
        <div className="max-w-7xl mx-auto">
          <header className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Signal Chat
                </h1>
                <p className="text-xs text-slate-400">Trust Layer Network</p>
              </div>
            </div>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-[240px,1fr,280px] gap-3">
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
                    <div className="flex items-center justify-center h-full text-slate-500">
                      Select a channel to start chatting
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="hidden md:block col-span-1">
              <MemberList 
                members={members as any} 
                onView={(id) => console.log('view member', id)} 
              />
            </div>
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
    </>
  );
}
