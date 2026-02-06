import { db } from './db';
import { chatChannels } from '@shared/schema';
import { eq } from 'drizzle-orm';

const DEFAULT_CHANNELS = [
  { name: 'general', description: 'General discussion for the DarkWave ecosystem', category: 'ecosystem', isDefault: true },
  { name: 'announcements', description: 'Official announcements and updates', category: 'ecosystem', isDefault: true },
  { name: 'darkwavestudios-support', description: 'Support for DarkWave Studios', category: 'app-support', isDefault: false },
  { name: 'garagebot-support', description: 'Support for GarageBot', category: 'app-support', isDefault: false },
  { name: 'tlid-marketing', description: 'TLID domain service marketing and discussion', category: 'app-support', isDefault: false },
  { name: 'guardian-ai', description: 'Guardian AI certification discussion', category: 'app-support', isDefault: false },
];

export async function seedChatChannels() {
  const existing = await db.select().from(chatChannels);
  if (existing.length > 0) {
    console.log(`[Signal Chat] ${existing.length} channels already exist, skipping seed`);
    return;
  }

  for (const channel of DEFAULT_CHANNELS) {
    await db.insert(chatChannels).values(channel).onConflictDoNothing();
  }

  console.log(`[Signal Chat] Seeded ${DEFAULT_CHANNELS.length} default channels`);
}
