import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Users, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Community } from '@shared/chat-types';

const GlowOrb = ({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, top, left }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
  />
);

export default function ChronoChatInvitePage({ params }: { params?: { code?: string } }) {
  const inviteCode = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('code') : null;
  const [joined, setJoined] = useState(false);

  const { data: community } = useQuery<Community | null>({
    queryKey: ['invite', inviteCode],
    queryFn: async () => {
      if (!inviteCode) return null;
      return { id: 'c-general', name: 'General', description: 'Public community', ownerId: 'u1', privacy: 'invite-only', createdAt: new Date().toISOString() } as Community;
    },
    enabled: !!inviteCode,
  });

  const join = async () => {
    setJoined(true);
  };

  if (!inviteCode) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white relative" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
        <GlowOrb color="#8b5cf6" size={300} top="30%" left="50%" delay={0} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center"
          style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}
        >
          <p className="text-slate-400">No invite code provided</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{ background: "linear-gradient(180deg, #070b16, #0c1222, #070b16)" }}>
      <GlowOrb color="#06b6d4" size={400} top="10%" left="20%" delay={0} />
      <GlowOrb color="#8b5cf6" size={350} top="60%" left="70%" delay={2} />
      <GlowOrb color="#ec4899" size={250} top="30%" left="80%" delay={4} />

      <div className="relative z-10 pt-20 pb-12 px-4 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-8" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}>
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4"
              >
                <Users className="w-8 h-8 text-cyan-400" />
              </motion.div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {community?.name ?? 'Community Preview'}
              </h2>
              <p className="text-slate-400 mt-2 text-sm">{community?.description}</p>
            </div>

            <div className="mt-6">
              {joined ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-2 text-green-400 py-3"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>You have joined the community. Redirecting…</span>
                </motion.div>
              ) : (
                <Button
                  onClick={join}
                  className="w-full h-12 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold rounded-xl"
                  data-testid="join-invite"
                >
                  Join Community
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
