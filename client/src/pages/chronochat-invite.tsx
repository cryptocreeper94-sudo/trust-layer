import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Community } from '../../shared/chat-types';

export default function ChronoChatInvitePage({ params }: { params?: { code?: string } }) {
  const inviteCode = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('code') : null;
  const [joined, setJoined] = useState(false);

  const { data: community } = useQuery<Community | null>(['invite', inviteCode], async () => {
    if (!inviteCode) return null;
    return { id: 'c-general', name: 'General', description: 'Public community', ownerId: 'u1', privacy: 'invite-only', createdAt: new Date().toISOString() } as Community;
  }, { enabled: !!inviteCode });

  const join = async () => {
    setJoined(true);
  };

  if (!inviteCode) return <div className="p-4 text-center text-slate-400">No invite code provided</div>;

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white">
      <div className="max-w-2xl mx-auto p-4 bg-slate-900/30 rounded-lg">
        <h2 className="text-2xl font-bold">{community?.name ?? 'Community preview'}</h2>
        <p className="text-slate-400 mt-2">{community?.description}</p>

        <div className="mt-4">
          {joined ? <div className="text-green-400">You have joined the community. Redirecting…</div> : <button onClick={join} className="py-3 px-4 rounded bg-cyan-500 text-black" data-testid="join-invite">Join</button>}
        </div>
      </div>
    </main>
  );
}
