/**
 * Seed Marketing Posts Library
 * DarkWave Chronicles - Auto-deployment content
 */

import { db } from './db';
import { marketingPosts, marketingScheduleConfig } from '@shared/schema';

const SEED_POSTS = [
  // Discord Posts (longer, community-focused)
  {
    platform: 'discord',
    content: `🌌 **DarkWave Chronicles** is more than a game—it's YOUR legend across time.

70+ mission theaters. One parallel self. Infinite possibilities.

Every choice echoes through history. Every action shapes your legacy.

The question isn't whether you'll leave your mark...
It's HOW LEGENDARY will you become?

🎮 Coming July 4, 2026`,
    category: 'vision',
  },
  {
    platform: 'discord',
    content: `⚡ **BREAKING**: DarkWave Chronicles introduces "Many Lenses" design

The world ADAPTS to your beliefs. Your choices don't just affect outcomes—they reshape REALITY itself.

Imagine a game where:
• Your worldview matters
• NPCs remember and evolve
• History bends to YOUR interpretation

This isn't just gameplay. This is awakening.`,
    category: 'tech',
  },
  {
    platform: 'discord',
    content: `🔥 What makes a LEGENDARY campaign?

• Missions that matter
• Choices with consequences
• A parallel self that grows with YOU
• 70+ eras to conquer

DarkWave Chronicles isn't asking you to play a character.

We're asking: **Who will YOU become?**`,
    category: 'hype',
  },
  {
    platform: 'discord',
    content: `🚀 The DarkWave Studios team is building something unprecedented.

Not just another game.
Not just another blockchain.
An entire ECOSYSTEM designed for legends.

Follow our journey. Be part of the origin story.

🌊 www.darkwavegames.io`,
    category: 'community',
  },
  {
    platform: 'discord',
    content: `💎 Early believers get rewarded.

We're building the tools, the chain, and the experience—all from scratch.

No shortcuts. No compromises. Pure vision.

Those who join now will be remembered when the legends are written.

Are you ready to be a Founder?`,
    category: 'hype',
  },

  // Telegram Posts (medium length, announcement style)
  {
    platform: 'telegram',
    content: `🌊 <b>DarkWave Chronicles Update</b>

We're not building a game.
We're building a LEGEND FACTORY.

70+ mission theaters
YOUR parallel self as the hero
Choices that echo through eternity

Public beta: July 4, 2026 🎯

Join the journey → darkwavegames.io`,
    category: 'news',
  },
  {
    platform: 'telegram',
    content: `⚡ <b>Many Lenses Design Revealed</b>

What if the game world adapted to YOUR beliefs?

DarkWave Chronicles introduces a system where:
• Reality shifts based on player perspective
• Your worldview affects NPC behavior
• History itself becomes personal

This is next-gen storytelling.`,
    category: 'tech',
  },
  {
    platform: 'telegram',
    content: `🔥 <b>Why DarkWave Chronicles is Different</b>

No grind. Just glory.
No leveling. Just legends.
No NPCs. Just allies and enemies who REMEMBER.

This is YOUR story. YOUR legacy.

Coming 2026 🚀`,
    category: 'vision',
  },
  {
    platform: 'telegram',
    content: `💎 <b>Founder Program Now Open</b>

Early supporters get:
• Priority access
• Exclusive rewards
• Voice in development
• Legendary status forever

Be part of the origin story.

→ dwsc.io/founder-program`,
    category: 'community',
  },
  {
    platform: 'telegram',
    content: `🎮 <b>70+ Mission Theaters</b>

Ancient empires. Future frontiers. Everything in between.

Each era is a new chance to prove yourself.
Each mission is a step toward your legend.

DarkWave Chronicles - Where YOU are the prime hero.`,
    category: 'hype',
  },

  // Twitter/X Posts (280 chars max)
  {
    platform: 'twitter',
    content: `🌊 DarkWave Chronicles isn't a game.

It's a legend factory.

70+ eras. One parallel self. YOUR story.

Coming July 4, 2026 ⚡`,
    category: 'vision',
  },
  {
    platform: 'twitter',
    content: `What if the game world adapted to YOUR beliefs?

Introducing "Many Lenses" design—where reality itself shifts based on player perspective.

DarkWave Chronicles. Awakening disguised as entertainment. 🎮`,
    category: 'tech',
  },
  {
    platform: 'twitter',
    content: `No grind. No filler. Just legend-building.

DarkWave Chronicles puts YOU at the center of 70+ mission theaters.

Every choice echoes. Every action matters. 🔥`,
    category: 'hype',
  },
  {
    platform: 'twitter',
    content: `Building something unprecedented.

• Proprietary blockchain
• Next-gen gaming
• Player-first design

DarkWave Studios isn't following trends.

We're creating the future. 🚀`,
    category: 'general',
  },
  {
    platform: 'twitter',
    content: `Early believers will be remembered.

Founder Program now open.

Join the origin story → dwsc.io/founder-program 💎`,
    category: 'community',
  },
  {
    platform: 'twitter',
    content: `YOUR parallel self. 70+ eras. One legendary campaign.

DarkWave Chronicles.

Not life simulation. LEGEND building. ⚔️`,
    category: 'hype',
  },
  {
    platform: 'twitter',
    content: `The game that asks: Who will YOU become?

Choices that matter. Consequences that echo.

DarkWave Chronicles - July 2026 🌌`,
    category: 'vision',
  },
  {
    platform: 'twitter',
    content: `Every campaign. Every decision. Every moment.

Yours to shape. Yours to own. Yours to legend.

#DarkWaveChronicles ⚡`,
    category: 'hype',
  },

  // Facebook Posts (longer, storytelling style)
  {
    platform: 'facebook',
    content: `🌊 We're building DarkWave Chronicles—and it's unlike anything you've played before.

Imagine stepping into 70+ mission theaters across history as YOUR parallel self. Every choice matters. Every action shapes your legend. The world itself adapts to your beliefs through our revolutionary "Many Lenses" design.

This isn't about levels or loot. It's about WHO YOU BECOME.

Public beta: July 4, 2026. The legend begins.

Learn more at darkwavegames.io 🎮`,
    category: 'vision',
  },
  {
    platform: 'facebook',
    content: `What makes DarkWave Chronicles different?

⚡ YOU are the prime hero—not following someone else's story
🎯 70+ mission theaters across every era imaginable  
🌌 "Many Lenses" design where the world adapts to YOUR worldview
💎 No grind—just meaningful progression through legendary campaigns

We're not building just a game. We're building an awakening tool disguised as entertainment.

Coming 2026. Be part of the legend.`,
    category: 'tech',
  },
  {
    platform: 'facebook',
    content: `📢 The DarkWave Studios Founder Program is now open!

Early believers get:
✨ Priority access to beta
✨ Exclusive founder rewards
✨ Voice in development decisions
✨ Legendary status in our community

We're building this together. Your support now means everything.

Join us: dwsc.io/founder-program`,
    category: 'community',
  },
  {
    platform: 'facebook',
    content: `🎮 DarkWave Chronicles: 70+ Mission Theaters

Ancient empires rising and falling. Future frontiers waiting to be conquered. Medieval courts where words are weapons. Modern cities where every choice ripples outward.

Each era is YOUR chance to prove yourself. Each mission builds YOUR legend.

Not life simulation. Not passive entertainment.
LEGEND BUILDING.

Coming July 4, 2026 🚀`,
    category: 'hype',
  },
  {
    platform: 'facebook',
    content: `🌊 From DarkWave Studios

We're a small team with a massive vision. Building everything from scratch—our own blockchain, our own gaming experience, our own path forward.

No shortcuts. No compromises. Just pure dedication to creating something that matters.

Thank you for believing in us. The journey has just begun.

#DarkWaveStudios #DarkWaveChronicles`,
    category: 'general',
  },
];

async function seedMarketingPosts() {
  console.log('[Seed] Starting marketing posts seed...');
  
  try {
    // Clear existing posts (optional - comment out to append)
    // await db.delete(marketingPosts);
    
    // Insert seed posts
    for (const post of SEED_POSTS) {
      await db.insert(marketingPosts).values({
        platform: post.platform,
        content: post.content,
        category: post.category,
        status: 'active',
      });
    }
    
    console.log(`[Seed] Inserted ${SEED_POSTS.length} marketing posts`);
    
    // Initialize schedule configs for all platforms
    const platforms = ['discord', 'telegram', 'twitter', 'facebook'];
    const { eq } = await import('drizzle-orm');
    for (const platform of platforms) {
      const existing = await db.select().from(marketingScheduleConfig).where(eq(marketingScheduleConfig.platform, platform)).limit(1);
      if (existing.length === 0) {
        await db.insert(marketingScheduleConfig).values({
          platform,
          isActive: false,
          intervalMinutes: 180, // Default: every 3 hours
        });
        console.log(`[Seed] Created schedule config for ${platform}`);
      }
    }
    
    console.log('[Seed] Marketing seed complete!');
  } catch (error: any) {
    console.error('[Seed] Error:', error.message);
    throw error;
  }
}

// Run if called directly
seedMarketingPosts().catch(console.error);
