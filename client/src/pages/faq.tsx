import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, Coins, Shield, Gamepad2, Users, Code, Wallet, Calendar, Globe } from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/footer";
import { usePageAnalytics } from "@/hooks/use-analytics";
import { GlassCard } from "@/components/glass-card";
import orbitLogo from "@assets/generated_images/futuristic_abstract_geometric_logo_symbol_for_orbit.png";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  icon: any;
  color: string;
  items: FAQItem[];
}

const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: "general",
    title: "General",
    icon: Globe,
    color: "#06b6d4",
    items: [
      {
        question: "What is DarkWave Smart Chain?",
        answer: "DarkWave Smart Chain (DWSC) is a purpose-built Layer 1 blockchain ecosystem designed for high-performance gaming, digital asset ownership, and decentralized applications. Unlike general-purpose chains, DWSC is optimized for real-time interactive experiences with 400ms block times and 200K+ TPS."
      },
      {
        question: "Who is behind DarkWave?",
        answer: "DarkWave Studios is the parent company building the entire vertical stack - from blockchain infrastructure to end-user applications. The team includes experienced developers, gaming industry veterans, and blockchain specialists committed to building a sustainable ecosystem."
      },
      {
        question: "When does the token launch?",
        answer: "The DWC token is scheduled for launch on February 14, 2026 (Valentine's Day). The public beta of DarkWave Chronicles is targeted for July 4, 2026."
      },
      {
        question: "What makes DWSC different from other blockchains?",
        answer: "DWSC is purpose-built for gaming and interactive experiences. Key differentiators include: Proof-of-Authority consensus for speed and efficiency, 400ms block times, native gaming infrastructure, integrated DeFi services, and the DarkWave Chronicles flagship game that demonstrates the chain's capabilities."
      }
    ]
  },
  {
    id: "token",
    title: "Token & Tokenomics",
    icon: Coins,
    color: "#a855f7",
    items: [
      {
        question: "What is the total supply of DWC?",
        answer: "The total supply is fixed at 100 million DWC tokens. There will be no additional minting or burning - the supply is permanent and verifiable on-chain."
      },
      {
        question: "Is there a token burn mechanism?",
        answer: "No. DWC maintains a fixed supply without burn mechanics. We believe value should come from genuine utility and ecosystem growth, not artificial scarcity through token destruction."
      },
      {
        question: "What is the token allocation?",
        answer: "40% Community & Ecosystem (rewards, airdrops, grants), 20% Development Fund, 15% Team & Advisors (4-year vesting), 15% Treasury Reserve, and 10% Public Sale."
      },
      {
        question: "Is there a vesting schedule for team tokens?",
        answer: "Yes. Team tokens have a 12-month cliff followed by 48-month linear vesting. Advisor tokens have a 6-month cliff with 24-month vesting. This ensures long-term alignment with the project's success."
      },
      {
        question: "What can I use DWC for?",
        answer: "DWC is used for: transaction fees on the network, staking rewards, governance voting, in-game purchases in DarkWave Chronicles, DEX trading and liquidity provision, and NFT marketplace transactions."
      }
    ]
  },
  {
    id: "investing",
    title: "Investing & Presale",
    icon: Wallet,
    color: "#ec4899",
    items: [
      {
        question: "How can I participate in the presale?",
        answer: "Visit our Presale page to participate. We accept various payment methods including crypto and fiat. Early supporters receive bonus allocations and exclusive benefits like Founder NFTs."
      },
      {
        question: "What are the presale tiers?",
        answer: "We offer multiple presale tiers with increasing bonuses for larger contributions. Refer to the Presale page for current pricing and tier benefits. Early participants receive the best rates."
      },
      {
        question: "When will tokens be distributed?",
        answer: "Presale tokens will be distributed at the Token Generation Event (TGE) scheduled for February 14, 2026. Public sale participants receive 100% at TGE."
      },
      {
        question: "Is there a referral program?",
        answer: "Yes! Our affiliate program rewards you with bonus DWC tokens for every successful referral. Share your unique link and earn commissions that will be distributed at token launch."
      }
    ]
  },
  {
    id: "chronicles",
    title: "DarkWave Chronicles",
    icon: Gamepad2,
    color: "#f59e0b",
    items: [
      {
        question: "What is DarkWave Chronicles?",
        answer: "Chronicles is NOT a traditional RPG - it's a revolutionary parallel life social experiment where you experience yourself across 70+ historical eras. There are no levels, no XP, no forced progression. Your choices reveal who you truly are."
      },
      {
        question: "How is Chronicles different from other games?",
        answer: "Chronicles holds a mirror to who you truly are. Start in ANY era you choose (Quantum Leap style). The world continues 24/7 whether you're playing or not. Your beliefs, values, and emotional responses shape your experience - there's no 'good' or 'evil' path."
      },
      {
        question: "When can I play Chronicles?",
        answer: "The public beta is targeted for July 4, 2026. Before that, early supporters may receive alpha access and exclusive content based on their participation level."
      },
      {
        question: "Do I need DWC tokens to play?",
        answer: "Free-to-play content will be available. DWC tokens unlock premium features, exclusive eras, enhanced AI interactions, and cosmetic items. The game is designed to be enjoyable without spending, but rewarding for token holders."
      }
    ]
  },
  {
    id: "security",
    title: "Security & Trust",
    icon: Shield,
    color: "#22c55e",
    items: [
      {
        question: "Is the smart contract audited?",
        answer: "Yes. All smart contracts undergo rigorous security audits by reputable third-party firms before deployment. Audit reports will be published publicly for transparency."
      },
      {
        question: "How is the treasury managed?",
        answer: "The treasury is controlled by a multisig wallet requiring multiple team signatures for any transaction. This prevents any single point of failure or unauthorized access to funds."
      },
      {
        question: "Is DarkWave registered as a company?",
        answer: "DarkWave Studios operates as a legitimate business entity with proper legal structure. We're committed to regulatory compliance as the crypto landscape evolves."
      },
      {
        question: "How can I verify token allocations?",
        answer: "All token allocations and vesting schedules are enforced by smart contracts and verifiable on-chain. We provide a Proof of Reserve dashboard showing real-time treasury status."
      }
    ]
  },
  {
    id: "technical",
    title: "Technical",
    icon: Code,
    color: "#6366f1",
    items: [
      {
        question: "What consensus mechanism does DWSC use?",
        answer: "DWSC uses Proof-of-Authority (PoA) consensus with a Founders Validator system. This enables fast finality (400ms blocks) and high throughput (200K+ TPS) while maintaining security."
      },
      {
        question: "Is DWSC EVM compatible?",
        answer: "DWSC is designed for optimal performance with its native infrastructure. Cross-chain bridges allow interoperability with Ethereum and Solana ecosystems."
      },
      {
        question: "Can I build on DarkWave?",
        answer: "Yes! The Developer Portal provides SDKs, APIs, documentation, and grants for building on DWSC. We welcome developers to join the ecosystem and build innovative applications."
      },
      {
        question: "What wallets are supported?",
        answer: "The native DarkWave Wallet is integrated into the portal. We also support popular wallets through our wallet connection system. Hardware wallet support is planned for mainnet launch."
      }
    ]
  }
];

function FAQAccordion({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-white/5 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full py-4 px-5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
        data-testid={`faq-question-${item.question.slice(0, 20).replace(/\s/g, '-').toLowerCase()}`}
      >
        <span className="font-medium text-white text-sm pr-4">{item.question}</span>
        <ChevronDown className={`w-4 h-4 text-white/50 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 text-sm text-white/70 leading-relaxed">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  usePageAnalytics();
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const toggleItem = (key: string) => {
    const newOpen = new Set(openItems);
    if (newOpen.has(key)) {
      newOpen.delete(key);
    } else {
      newOpen.add(key);
    }
    setOpenItems(newOpen);
  };

  const displayedCategories = selectedCategory 
    ? FAQ_CATEGORIES.filter(c => c.id === selectedCategory)
    : FAQ_CATEGORIES;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={orbitLogo} alt="DarkWave" className="w-7 h-7" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">DarkWave</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 bg-cyan-500/10 text-[10px] sm:text-xs whitespace-nowrap">
              <HelpCircle className="w-3 h-3 mr-1" /> FAQ
            </Badge>
            <BackButton />
          </div>
        </div>
      </nav>

      <section className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Badge variant="outline" className="px-3 py-1 border-cyan-500/50 text-cyan-400 bg-cyan-500/10 rounded-full text-xs tracking-wider uppercase mb-4">
              Support Center
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">Frequently Asked Questions</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to know about DarkWave Smart Chain, $DWC token, and the ecosystem.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Button
              variant={selectedCategory === null ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={`h-8 text-xs ${selectedCategory === null ? 'bg-white text-black' : 'text-white/60'}`}
              data-testid="button-filter-all"
            >
              All Topics
            </Button>
            {FAQ_CATEGORIES.map(cat => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className={`h-8 text-xs gap-1.5 ${selectedCategory === cat.id ? 'bg-white text-black' : 'text-white/60'}`}
                data-testid={`button-filter-${cat.id}`}
              >
                <cat.icon className="w-3 h-3" />
                {cat.title}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-12 px-4">
        <div className="container mx-auto max-w-4xl space-y-6">
          {displayedCategories.map((category, catIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <category.icon className="w-4 h-4" style={{ color: category.color }} />
                </div>
                <h2 className="text-lg font-bold text-white">{category.title}</h2>
              </div>
              <GlassCard hover={false}>
                {category.items.map((item, itemIndex) => (
                  <FAQAccordion
                    key={`${category.id}-${itemIndex}`}
                    item={item}
                    isOpen={openItems.has(`${category.id}-${itemIndex}`)}
                    onToggle={() => toggleItem(`${category.id}-${itemIndex}`)}
                  />
                ))}
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-12 px-4 bg-white/[0.02]">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-display font-bold mb-3">Still Have Questions?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
              Can't find what you're looking for? Reach out to our community or support team.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/community-hub">
                <Button size="lg" className="bg-white text-black hover:bg-white/90 font-bold rounded-full" data-testid="button-community">
                  <Users className="w-4 h-4 mr-2" />
                  Join Community
                </Button>
              </Link>
              <Link href="/doc-hub">
                <Button size="lg" variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 rounded-full" data-testid="button-docs">
                  Read Documentation
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
