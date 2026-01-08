/**
 * Updated Marketing Posts - 2026
 * DarkWave Studios - Auto-deployment content
 * Featuring: April 11 TGE, Guardian Certification, Public Registry
 */

import { db } from './db';
import { marketingPosts } from '@shared/schema';
import { eq } from 'drizzle-orm';

const UPDATED_POSTS = [
  // ============================================
  // DISCORD POSTS (longer, community-focused)
  // ============================================
  {
    platform: 'discord',
    content: `🚀 **TOKEN GENERATION EVENT: APRIL 11, 2026**

The countdown has begun. DarkWave Coin (DWC) launches on our own Layer 1 blockchain.

What you're getting:
• 200,000+ TPS throughput
• 400ms finality
• $0.0001 transaction fees
• Zero compromises

This isn't another token on someone else's chain.
This is OUR chain. OUR vision. YOUR opportunity.

🔗 Presale live now → dwsc.io/presale`,
    category: 'tge',
  },
  {
    platform: 'discord',
    content: `🛡️ **GUARDIAN CERTIFICATION PROGRAM LIVE**

We're not just building a blockchain—we're setting the security standard.

Guardian Security offers:
• Professional smart contract audits
• Blockchain-verified certifications
• Public registry for verified projects
• NFT-minted proof of audit

Every certification is permanently recorded on-chain.

Check verified projects → dwsc.io/guardian-registry`,
    category: 'security',
  },
  {
    platform: 'discord',
    content: `💎 **WHY DARKWAVE SMART CHAIN?**

Other chains: Promise speed, deliver compromise.
DWSC: 200K+ TPS. 400ms finality. Verifiable.

Other chains: Copy-paste code, hope it works.
DWSC: Built from scratch. Every line intentional.

Other chains: Talk about security.
DWSC: Guardian Certification with on-chain proof.

April 11, 2026. The real one launches.`,
    category: 'tech',
  },
  {
    platform: 'discord',
    content: `🎮 **DARKWAVE CHRONICLES UPDATE**

July 4, 2026. The legend begins.

70+ eras. YOUR parallel self. Real-time persistence.

While you sleep, your world hibernates.
When you return, time resumes.
Every choice echoes through eternity.

Not a game. A parallel life.

Join the waitlist → darkwavegames.io`,
    category: 'chronicles',
  },
  {
    platform: 'discord',
    content: `⚡ **FOUNDER REWARDS INCREASING**

Early believers aren't just participants—they're architects of what's coming.

Current Founder Benefits:
• Up to 25% bonus tokens on presale
• Priority beta access to Chronicles
• Governance voting rights
• Exclusive founder badges

The earlier you join, the more you earn.

Presale ends when we reach cap → dwsc.io/presale`,
    category: 'presale',
  },
  {
    platform: 'discord',
    content: `🔒 **SECURITY ISN'T A FEATURE. IT'S THE FOUNDATION.**

Every project on DWSC can get Guardian Certified.

What that means:
✅ Professional security audit
✅ Blockchain-verified score
✅ Public registry listing
✅ NFT-minted certification

Build trust. Build on DWSC.

View verified projects → dwsc.io/guardian-registry`,
    category: 'security',
  },

  // ============================================
  // TELEGRAM POSTS (medium length, announcement style)
  // ============================================
  {
    platform: 'telegram',
    content: `🚀 <b>APRIL 11, 2026 - TOKEN GENERATION EVENT</b>

DarkWave Coin (DWC) launches on our Layer 1 blockchain.

⚡ 200K+ TPS
⚡ 400ms finality  
⚡ $0.0001 fees

Not built on Ethereum. Not built on Solana.
Built from scratch. Built to last.

Presale live → dwsc.io/presale`,
    category: 'tge',
  },
  {
    platform: 'telegram',
    content: `🛡️ <b>GUARDIAN SECURITY LIVE</b>

Professional blockchain security audits with on-chain verification.

✅ Smart contract audits
✅ Public certification registry
✅ NFT-minted proof
✅ Blockchain-verified scores

Trust, verified → dwsc.io/guardian-registry`,
    category: 'security',
  },
  {
    platform: 'telegram',
    content: `💎 <b>PRESALE BONUSES</b>

Genesis Tier: 25% bonus
Founder Tier: 15% bonus
Pioneer Tier: 10% bonus
Early Bird: 5% bonus

TGE: April 11, 2026

The earlier you believe, the more you earn.

→ dwsc.io/presale`,
    category: 'presale',
  },
  {
    platform: 'telegram',
    content: `🎮 <b>CHRONICLES: JULY 4, 2026</b>

70+ eras. YOUR parallel self. Real-time world.

No grinding. No filler. Just legend-building.

The game that asks: Who will YOU become?

→ darkwavegames.io`,
    category: 'chronicles',
  },
  {
    platform: 'telegram',
    content: `⚡ <b>200K+ TPS. VERIFIED.</b>

Not theoretical. Not "up to."
Real throughput on a real chain.

DarkWave Smart Chain launches April 11, 2026.

See the metrics live → dwsc.io/explorer`,
    category: 'tech',
  },
  {
    platform: 'telegram',
    content: `🔥 <b>WHY BUILD ON DWSC?</b>

• Lowest fees in crypto
• Sub-second finality
• Guardian security audits
• Enterprise-grade infrastructure

April 11. The serious chain launches.

→ dwsc.io`,
    category: 'tech',
  },

  // ============================================
  // TWITTER/X POSTS (280 chars max, punchy)
  // ============================================
  {
    platform: 'twitter',
    content: `🚀 APRIL 11, 2026

DarkWave Coin launches on our own Layer 1.

200K+ TPS. 400ms finality. $0.0001 fees.

Not another token on someone else's chain.

The real one is coming. dwsc.io`,
    category: 'tge',
  },
  {
    platform: 'twitter',
    content: `Every project on DWSC can get Guardian Certified.

On-chain verified. NFT-minted. Public registry.

Security you can prove.

dwsc.io/guardian-registry 🛡️`,
    category: 'security',
  },
  {
    platform: 'twitter',
    content: `200K+ TPS.
400ms finality.
$0.0001 fees.

Not promises. Metrics.

DarkWave Smart Chain. April 11, 2026. ⚡`,
    category: 'tech',
  },
  {
    platform: 'twitter',
    content: `Presale bonuses up to 25%.

Genesis → Founder → Pioneer → Early Bird

TGE: April 11, 2026

The earlier you believe, the more you earn. 💎

dwsc.io/presale`,
    category: 'presale',
  },
  {
    platform: 'twitter',
    content: `DarkWave Chronicles drops July 4, 2026.

70+ eras. YOUR parallel self. Real-time persistence.

Not life simulation. LEGEND building. 🎮`,
    category: 'chronicles',
  },
  {
    platform: 'twitter',
    content: `Other chains copy-paste code and call it innovation.

We built everything from scratch.

Layer 1. 200K+ TPS. Guardian Security.

April 11, 2026. 🌊`,
    category: 'tech',
  },
  {
    platform: 'twitter',
    content: `Guardian Certification is LIVE.

Professional audits. On-chain proof. Public registry.

Building trust in crypto, one verification at a time.

dwsc.io/guardian-registry 🛡️`,
    category: 'security',
  },
  {
    platform: 'twitter',
    content: `The countdown to TGE has begun.

April 11, 2026.

DarkWave Coin. DarkWave Chain. DarkWave Future.

Presale live → dwsc.io/presale 🚀`,
    category: 'tge',
  },
  {
    platform: 'twitter',
    content: `Building a blockchain from scratch isn't easy.

But neither is building something that lasts.

DWSC. April 11, 2026. ⚡`,
    category: 'vision',
  },
  {
    platform: 'twitter',
    content: `Security shouldn't be optional in crypto.

Guardian Certification: audits verified on-chain.

Every certified project. Every score. Permanent record.

dwsc.io/guardian-registry 🔒`,
    category: 'security',
  },
  {
    platform: 'twitter',
    content: `70+ eras. One parallel self. Your legend.

DarkWave Chronicles. July 4, 2026.

The game that asks: Who will YOU become? 🌌`,
    category: 'chronicles',
  },
  {
    platform: 'twitter',
    content: `Early believers get rewarded.

Up to 25% bonus tokens in presale.
Governance rights.
Founder status forever.

TGE: April 11, 2026 💎`,
    category: 'presale',
  },
];

export async function seedUpdatedMarketingPosts() {
  console.log('[Seed] Starting updated 2026 marketing posts seed...');
  
  try {
    // Deactivate old posts instead of deleting
    await db.update(marketingPosts)
      .set({ status: 'inactive' })
      .where(eq(marketingPosts.status, 'active'));
    
    console.log('[Seed] Deactivated old posts');
    
    // Insert new posts
    for (const post of UPDATED_POSTS) {
      await db.insert(marketingPosts).values({
        platform: post.platform,
        content: post.content,
        category: post.category,
        status: 'active',
      });
    }
    
    console.log(`[Seed] Inserted ${UPDATED_POSTS.length} updated marketing posts`);
    
    // Count by platform
    const discordCount = UPDATED_POSTS.filter(p => p.platform === 'discord').length;
    const telegramCount = UPDATED_POSTS.filter(p => p.platform === 'telegram').length;
    const twitterCount = UPDATED_POSTS.filter(p => p.platform === 'twitter').length;
    
    console.log(`[Seed] Discord: ${discordCount}, Telegram: ${telegramCount}, Twitter/X: ${twitterCount}`);
    
    return { success: true, count: UPDATED_POSTS.length };
  } catch (error: any) {
    console.error('[Seed] Error seeding posts:', error.message);
    return { success: false, error: error.message };
  }
}

// Export posts for review
export const MARKETING_POSTS_2026 = UPDATED_POSTS;
