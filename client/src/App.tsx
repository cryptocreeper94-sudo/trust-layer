import { useEffect, useMemo, lazy, Suspense } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PreferencesProvider, NotificationsProvider } from "@/lib/store";
import { WalletProvider } from "@/hooks/use-wallet";
import { AIAssistant } from "@/components/ai-assistant";
import { getAppFromHost } from "@/lib/app-config";
import { FavoritesProvider } from "@/components/favorites-watchlist";
import { FloatingChat } from "@/components/floating-chat";
import { GlobalSearch } from "@/components/global-search";

// Critical pages - load immediately
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import Terms from "@/pages/terms";
import DevelopersNote from "@/pages/developers-note";
import VirtualCurrencyTerms from "@/pages/virtual-currency-terms";
import Privacy from "@/pages/privacy";

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}

// Lazy-loaded pages - code splitting for smaller initial bundle
const Welcome = lazy(() => import("@/pages/welcome"));
const SignalCore = lazy(() => import("@/pages/signal-core"));
const SignalCoreOfficial = lazy(() => import("@/pages/signal-core-official"));
const Verify = lazy(() => import("@/pages/verify"));
const VerifyEmail = lazy(() => import("@/pages/verify-email"));
const GovernanceCharter = lazy(() => import("@/pages/governance-charter"));
const GovernanceTreasury = lazy(() => import("@/pages/governance-treasury"));
const TrustCooperative = lazy(() => import("@/pages/trust-cooperative"));
const TrustDocumentOps = lazy(() => import("@/pages/trust-document-ops"));
const TeamMessage = lazy(() => import("@/pages/team-message"));
const Philosophy = lazy(() => import("@/pages/philosophy"));
const GamesHome = lazy(() => import("@/pages/games-home"));
const GameDeveloper = lazy(() => import("@/pages/game-developer"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const ReferralProgram = lazy(() => import("@/pages/referral-program"));
const Developers = lazy(() => import("@/pages/developers"));
const DevelopersRegister = lazy(() => import("@/pages/developers-register"));
const Ecosystem = lazy(() => import("@/pages/ecosystem"));
const Token = lazy(() => import("@/pages/token"));
const Explorer = lazy(() => import("@/pages/explorer"));
const DocHub = lazy(() => import("@/pages/doc-hub"));
const DWSCExecutiveSummary = lazy(() => import("@/pages/dwsc-executive-summary"));
const ApiPlayground = lazy(() => import("@/pages/api-playground"));
const Treasury = lazy(() => import("@/pages/treasury"));
const DeveloperPortal = lazy(() => import("@/pages/developer-portal"));
const MarketingCatalogDev = lazy(() => import("@/pages/marketing-catalog-dev"));
const MarketingCatalogAdmin = lazy(() => import("@/pages/marketing-catalog-admin"));
const DevStudio = lazy(() => import("@/pages/dev-studio"));
const Billing = lazy(() => import("@/pages/billing"));
const Pricing = lazy(() => import("@/pages/pricing"));
const Studio = lazy(() => import("@/pages/studio"));
const StudioProjects = lazy(() => import("@/pages/studio-projects"));
const Team = lazy(() => import("@/pages/team"));
const Bridge = lazy(() => import("@/pages/bridge"));
const Staking = lazy(() => import("@/pages/staking"));
const Faucet = lazy(() => import("@/pages/faucet"));
const Swap = lazy(() => import("@/pages/swap"));
const Markets = lazy(() => import("@/pages/markets"));
const Pulse = lazy(() => import("@/pages/pulse"));
const MLDashboard = lazy(() => import("@/pages/ml-dashboard"));
const StrikeAgent = lazy(() => import("@/pages/strike-agent"));
const CoinAnalysis = lazy(() => import("@/pages/coin-analysis"));
const NftMarketplace = lazy(() => import("@/pages/nft-marketplace"));
const Portfolio = lazy(() => import("@/pages/portfolio"));
const Transactions = lazy(() => import("@/pages/transactions"));
const Launchpad = lazy(() => import("@/pages/launchpad"));
const Liquidity = lazy(() => import("@/pages/liquidity"));
const NftGallery = lazy(() => import("@/pages/nft-gallery"));
const NftCreator = lazy(() => import("@/pages/nft-creator"));
const Charts = lazy(() => import("@/pages/charts"));
const Webhooks = lazy(() => import("@/pages/webhooks"));
const MultiSig = lazy(() => import("@/pages/multisig"));
const ProofOfReserve = lazy(() => import("@/pages/proof-of-reserve"));
const LiquidStaking = lazy(() => import("@/pages/liquid-staking"));
const AdminRewards = lazy(() => import("@/pages/admin-rewards"));
const AdminHandoff = lazy(() => import("@/pages/admin-handoff"));
const AirdropClaim = lazy(() => import("@/pages/airdrop-claim"));
const Quests = lazy(() => import("@/pages/quests"));
const NetworkStats = lazy(() => import("@/pages/network-stats"));
const FounderProgram = lazy(() => import("@/pages/founder-program"));
const Validators = lazy(() => import("@/pages/validators"));
const Wallet = lazy(() => import("@/pages/wallet"));
const Status = lazy(() => import("@/pages/status"));
const ApiDocs = lazy(() => import("@/pages/api-docs"));
const AdminAnalytics = lazy(() => import("@/pages/admin-analytics"));
const AdminPartnerRequests = lazy(() => import("@/pages/admin-partner-requests"));
const AdminMarketing = lazy(() => import("@/pages/admin-marketing"));
const AdminDashboard = lazy(() => import("@/pages/admin-dashboard"));
const ChroniclesAIDemo = lazy(() => import("@/pages/chronicles-ai-demo"));
const BuildYourLegacy = lazy(() => import("@/pages/build-your-legacy"));
const ErrorPage = lazy(() => import("@/pages/error"));
const ForgotPassword = lazy(() => import("@/pages/forgot-password"));
const ResetPassword = lazy(() => import("@/pages/reset-password"));
const TokenCompare = lazy(() => import("@/pages/token-compare"));
const CodeSnippets = lazy(() => import("@/pages/code-snippets"));
const ApiUsage = lazy(() => import("@/pages/api-usage"));
const Referrals = lazy(() => import("@/pages/referrals"));
const DashboardPro = lazy(() => import("@/pages/dashboard-pro"));
const Trading = lazy(() => import("@/pages/trading"));
const WhaleTracker = lazy(() => import("@/pages/whale-tracker"));
const CopyTrading = lazy(() => import("@/pages/copy-trading"));
const DCABot = lazy(() => import("@/pages/dca-bot"));
const TokenAnalytics = lazy(() => import("@/pages/token-analytics"));
const Leaderboard = lazy(() => import("@/pages/leaderboard"));
const WalletProfiler = lazy(() => import("@/pages/wallet-profiler"));
const GasEstimator = lazy(() => import("@/pages/gas-estimator"));
const ActivityFeed = lazy(() => import("@/pages/activity-feed"));
const AINFTGenerator = lazy(() => import("@/pages/ai-nft-generator"));
const RarityAnalyzer = lazy(() => import("@/pages/rarity-analyzer"));
const UserProfiles = lazy(() => import("@/pages/user-profiles"));
const DAOGovernance = lazy(() => import("@/pages/dao-governance"));
const TxSimulator = lazy(() => import("@/pages/tx-simulator"));
const PortfolioRebalancer = lazy(() => import("@/pages/portfolio-rebalancer"));
const Arcade = lazy(() => import("@/pages/arcade"));
const Crash = lazy(() => import("@/pages/crash"));
const Predictions = lazy(() => import("@/pages/predictions"));
const PlayerProfile = lazy(() => import("@/pages/player-profile"));
const CoinStore = lazy(() => import("@/pages/coin-store"));
const DailyBonus = lazy(() => import("@/pages/daily-bonus"));
const Slots = lazy(() => import("@/pages/slots"));
const Coinflip = lazy(() => import("@/pages/coinflip"));
const SweepstakesRules = lazy(() => import("@/pages/sweepstakes-rules"));
const Spades = lazy(() => import("@/pages/spades"));
const Solitaire = lazy(() => import("@/pages/solitaire"));
const Minesweeper = lazy(() => import("@/pages/minesweeper"));
const Galaga = lazy(() => import("@/pages/galaga"));
const Tetris = lazy(() => import("@/pages/tetris"));
const Snake = lazy(() => import("@/pages/snake"));
const Pacman = lazy(() => import("@/pages/pacman"));
const Genesis = lazy(() => import("@/pages/genesis"));
const Veil = lazy(() => import("@/pages/veil"));
const VeilReader = lazy(() => import("@/pages/veil-reader"));
const VeilPrintVol2 = lazy(() => import("@/pages/veil-print-vol2"));
const ChronoChat = lazy(() => import("@/pages/chronochat"));
const ChronoChatInvite = lazy(() => import("@/pages/chronochat-invite"));
const CreatorProgram = lazy(() => import("@/pages/creator-program"));
const EraCodex = lazy(() => import("@/pages/era-codex"));
const ScenarioGenerator = lazy(() => import("@/pages/scenario-generator"));
const Crowdfund = lazy(() => import("@/pages/crowdfund"));
const Rewards = lazy(() => import("@/pages/rewards"));
const MyHub = lazy(() => import("@/pages/my-hub"));
const Members = lazy(() => import("@/pages/members"));
const MyTokens = lazy(() => import("@/pages/my-tokens"));
const CommunityHub = lazy(() => import("@/pages/community-hub"));
const Presale = lazy(() => import("@/pages/presale"));
const PresaleSuccess = lazy(() => import("@/pages/presale-success"));
const Founders = lazy(() => import("@/pages/founders"));
const InvestmentSimulator = lazy(() => import("@/pages/investment-simulator"));
const RoadmapChronicles = lazy(() => import("@/pages/roadmap-chronicles"));
const RoadmapEcosystem = lazy(() => import("@/pages/roadmap-ecosystem"));
const TechnicalRoadmap = lazy(() => import("@/pages/technical-roadmap"));
const Chronicles = lazy(() => import("@/pages/chronicles"));
const ChroniclesDemo = lazy(() => import("@/pages/chronicles-demo"));
const ChroniclesOnboarding = lazy(() => import("@/pages/chronicles-onboarding"));
const ChroniclesEstate = lazy(() => import("@/pages/chronicles-estate"));
const ChroniclesInterior = lazy(() => import("@/pages/chronicles-interior"));
const ChroniclesLife = lazy(() => import("@/pages/chronicles-life"));
const ChroniclesHub = lazy(() => import("@/pages/chronicles-hub"));
const ChroniclesTimePortal = lazy(() => import("@/pages/chronicles-time-portal"));
const ChroniclesLogin = lazy(() => import("@/pages/chronicles-login"));
const ChroniclesBuilder = lazy(() => import("@/pages/chronicles-builder"));
const SyndicateInvite = lazy(() => import("@/pages/syndicate-invite"));
const ChronoHome = lazy(() => import("@/pages/chrono-home"));
const ChronoEras = lazy(() => import("@/pages/chrono-eras"));
const ChronoGameplay = lazy(() => import("@/pages/chrono-gameplay"));
const ChronoEconomy = lazy(() => import("@/pages/chrono-economy"));
const ChronoCommunity = lazy(() => import("@/pages/chrono-community"));
const ChronoRoadmap = lazy(() => import("@/pages/chrono-roadmap"));
const ChronoDashboard = lazy(() => import("@/pages/chrono-dashboard"));
const ChronoTeam = lazy(() => import("@/pages/chrono-team"));
const ChronoCreators = lazy(() => import("@/pages/chrono-creators"));
const ChronoExecutiveSummary = lazy(() => import("@/pages/chrono-executive-summary"));
const SocialFeed = lazy(() => import("@/pages/social-feed"));
const InnovationHub = lazy(() => import("@/pages/innovation-hub"));
const Lottery = lazy(() => import("@/pages/lottery"));
const AIAdvisor = lazy(() => import("@/pages/ai-advisor"));
const PriceAlerts = lazy(() => import("@/pages/price-alerts"));
const PaperTrading = lazy(() => import("@/pages/paper-trading"));
const Achievements = lazy(() => import("@/pages/achievements"));
const Domains = lazy(() => import("@/pages/domains"));
const DomainManager = lazy(() => import("@/pages/domain-manager"));
const PartnerPortal = lazy(() => import("@/pages/partner-portal"));
const ChroniclesAdmin = lazy(() => import("@/pages/chronicles-admin"));
const Tokenomics = lazy(() => import("@/pages/tokenomics"));
const FAQ = lazy(() => import("@/pages/faq"));
const SupportPage = lazy(() => import("@/pages/support"));
const CompetitiveAnalysis = lazy(() => import("@/pages/competitive-analysis"));
const InvestorPitch = lazy(() => import("@/pages/investor-pitch"));
const Vision = lazy(() => import("@/pages/vision"));
const Learn = lazy(() => import("@/pages/learn"));
const EcosystemMap = lazy(() => import("@/pages/ecosystem-map"));
const SecurityPage = lazy(() => import("@/pages/security"));
const GuardianCertification = lazy(() => import("@/pages/guardian-certification"));
const GuardianRegistry = lazy(() => import("@/pages/guardian-registry"));
const GuardianPortal = lazy(() => import("@/pages/guardian-portal"));
const OwnerAdminPortal = lazy(() => import("@/pages/owner-admin"));
const OwnerAnalytics = lazy(() => import("@/pages/owner-admin/analytics"));
const OwnerSeoManager = lazy(() => import("@/pages/owner-admin/seo"));
const OwnerReferrals = lazy(() => import("@/pages/owner-admin/referrals"));
const OwnerUsers = lazy(() => import("@/pages/owner-admin/users"));
const OwnerGuardian = lazy(() => import("@/pages/owner-admin/guardian"));
const OwnerDomains = lazy(() => import("@/pages/owner-admin/domains"));
const OwnerFaucet = lazy(() => import("@/pages/owner-admin/faucet"));
const OwnerKyc = lazy(() => import("@/pages/owner-admin/kyc"));
const OwnerZealy = lazy(() => import("@/pages/owner-admin/zealy"));
const OwnerFeedback = lazy(() => import("@/pages/owner-admin/feedback"));
const OwnerMessaging = lazy(() => import("@/pages/owner-admin/messaging"));
const OwnerPresale = lazy(() => import("@/pages/owner-admin/presale"));
const Feedback = lazy(() => import("@/pages/feedback"));
const TeamAdminPortal = lazy(() => import("@/pages/team-admin"));
const TeamOperations = lazy(() => import("@/pages/team-operations"));
const GatewayError = lazy(() => import("@/pages/gateway-error"));
const AIAgentMarketplace = lazy(() => import("@/pages/ai-agent-marketplace"));
const RWATokenization = lazy(() => import("@/pages/rwa-tokenization"));
const InfluencerPartnership = lazy(() => import("@/pages/influencer-partnership"));
const ComingFeatures = lazy(() => import("@/pages/coming-features"));
const Blog = lazy(() => import("@/pages/blog"));
const BlogPost = lazy(() => import("@/pages/blog-post"));
const BlogAdmin = lazy(() => import("@/pages/blog-admin"));
const TrustLayer = lazy(() => import("@/pages/trust-layer"));
const GuardianScanner = lazy(() => import("@/pages/guardian-scanner"));
const GuardianScannerDetail = lazy(() => import("@/pages/guardian-scanner-detail"));

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

function GamesRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={GamesHome} />
        <Route path="/join/:code" component={SyndicateInvite} />
        <Route path="/arcade" component={Arcade} />
        <Route path="/arcade/profile" component={PlayerProfile} />
        <Route path="/arcade/profile/:userId" component={PlayerProfile} />
        <Route path="/coin-store" component={CoinStore} />
        <Route path="/daily-bonus" component={DailyBonus} />
        <Route path="/slots" component={Slots} />
        <Route path="/coinflip" component={Coinflip} />
        <Route path="/sweepstakes-rules" component={SweepstakesRules} />
        <Route path="/spades" component={Spades} />
        <Route path="/solitaire" component={Solitaire} />
        <Route path="/minesweeper" component={Minesweeper} />
        <Route path="/galaga" component={Galaga} />
        <Route path="/tetris" component={Tetris} />
        <Route path="/snake" component={Snake} />
        <Route path="/pacman" component={Pacman} />
        <Route path="/genesis" component={Genesis} />
        <Route path="/veil" component={Veil} />
        <Route path="/veil/read" component={VeilReader} />
        <Route path="/veil/print/vol2" component={VeilPrintVol2} />
        <Route path="/chronochat" component={ChronoChat} />
        <Route path="/chronochat/invite/:code" component={ChronoChatInvite} />
        <Route path="/creator-program" component={CreatorProgram} />
        <Route path="/era-codex" component={EraCodex} />
        <Route path="/scenario-generator" component={ScenarioGenerator} />
        <Route path="/crowdfund" component={Crowdfund} />
        <Route path="/community" component={CommunityHub} />
        <Route path="/presale" component={Presale} />
        <Route path="/presale/success" component={PresaleSuccess} />
        <Route path="/founders" component={Founders} />
        <Route path="/investment-simulator" component={InvestmentSimulator} />
        <Route path="/roadmap" component={RoadmapEcosystem} />
        <Route path="/roadmap-chronicles" component={RoadmapChronicles} />
        <Route path="/roadmap-ecosystem" component={RoadmapEcosystem} />
        <Route path="/crash" component={Crash} />
        <Route path="/predictions" component={Predictions} />
        <Route path="/lottery" component={Lottery} />
        <Route path="/wallet" component={Wallet} />
        <Route path="/game-developer" component={GameDeveloper} />
        <Route path="/terms" component={Terms} />
        <Route path="/virtual-currency-terms" component={VirtualCurrencyTerms} />
        <Route path="/privacy" component={Privacy} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}


function ChronoRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={ChronoHome} />
        <Route path="/chronicles" component={Chronicles} />
        <Route path="/chronicles/login" component={ChroniclesLogin} />
        <Route path="/chronicles/demo" component={ChroniclesDemo} />
        <Route path="/chronicles/ai" component={ChroniclesAIDemo} />
        <Route path="/chronicles/onboarding" component={ChroniclesOnboarding} />
        <Route path="/chronicles/estate" component={ChroniclesEstate} />
        <Route path="/chronicles/interior" component={ChroniclesInterior} />
        <Route path="/chronicles/life" component={ChroniclesLife} />
        <Route path="/chronicles/hub" component={ChroniclesHub} />
        <Route path="/chronicles/time-portal" component={ChroniclesTimePortal} />
        <Route path="/chronicles/builder" component={ChroniclesBuilder} />
        <Route path="/join/:code" component={SyndicateInvite} />
        <Route path="/chronicles-estate" component={ChroniclesEstate} />
        <Route path="/legacy" component={BuildYourLegacy} />
        <Route path="/eras" component={ChronoEras} />
        <Route path="/gameplay" component={ChronoGameplay} />
        <Route path="/economy" component={ChronoEconomy} />
        <Route path="/community" component={ChronoCommunity} />
        <Route path="/dashboard" component={ChronoDashboard} />
        <Route path="/team" component={ChronoTeam} />
        <Route path="/creators" component={ChronoCreators} />
        <Route path="/executive-summary" component={ChronoExecutiveSummary} />
        <Route path="/roadmap" component={ChronoRoadmap} />
        <Route path="/genesis" component={Genesis} />
        <Route path="/veil" component={Veil} />
        <Route path="/veil/read" component={VeilReader} />
        <Route path="/veil/print/vol2" component={VeilPrintVol2} />
        <Route path="/chronochat" component={ChronoChat} />
        <Route path="/chronochat/invite/:code" component={ChronoChatInvite} />
        <Route path="/creator-program" component={CreatorProgram} />
        <Route path="/era-codex" component={EraCodex} />
        <Route path="/crowdfund" component={Crowdfund} />
        <Route path="/presale" component={Presale} />
        <Route path="/presale/success" component={PresaleSuccess} />
        <Route path="/terms" component={Terms} />
        <Route path="/virtual-currency-terms" component={VirtualCurrencyTerms} />
        <Route path="/privacy" component={Privacy} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function DWSCRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Presale} />
        <Route path="/portal" component={Home} />
        <Route path="/home" component={Home} />
        <Route path="/note" component={DevelopersNote} />
        <Route path="/join/:code" component={SyndicateInvite} />
        <Route path="/rewards" component={Rewards} />
        <Route path="/referral-program" component={ReferralProgram} />
        <Route path="/referrals" component={ReferralProgram} />
        <Route path="/my-hub" component={MyHub} />
        <Route path="/members" component={Members} />
        <Route path="/my-tokens" component={MyTokens} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/developers" component={Developers} />
        <Route path="/developers/register" component={DevelopersRegister} />
        <Route path="/ecosystem" component={Ecosystem} />
        <Route path="/token" component={Token} />
        <Route path="/tokenomics" component={Tokenomics} />
        <Route path="/faq" component={FAQ} />
        <Route path="/welcome" component={Welcome} />
        <Route path="/signal-core" component={SignalCore} />
        <Route path="/signal-core/official" component={SignalCoreOfficial} />
        <Route path="/verify" component={Verify} />
        <Route path="/verify-email" component={VerifyEmail} />
        <Route path="/governance" component={SignalCore} />
        <Route path="/governance-charter" component={GovernanceCharter} />
        <Route path="/governance-treasury" component={GovernanceTreasury} />
        <Route path="/trust-cooperative" component={TrustCooperative} />
        <Route path="/cooperative" component={TrustCooperative} />
        <Route path="/trust-document/ops-lead" component={TrustDocumentOps} />
        <Route path="/team-message" component={TeamMessage} />
        <Route path="/philosophy" component={Philosophy} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/blog-admin" component={BlogAdmin} />
        <Route path="/support" component={SupportPage} />
        <Route path="/competitive-analysis" component={CompetitiveAnalysis} />
        <Route path="/security" component={SecurityPage} />
        <Route path="/guardian" component={GuardianCertification} />
        <Route path="/guardian-certification" component={GuardianCertification} />
        <Route path="/guardian-registry" component={GuardianRegistry} />
        <Route path="/guardian-portal" component={GuardianPortal} />
        <Route path="/explorer" component={Explorer} />
        <Route path="/doc-hub" component={DocHub} />
        <Route path="/executive-summary" component={DWSCExecutiveSummary} />
        <Route path="/api-playground" component={ApiPlayground} />
        <Route path="/treasury" component={Treasury} />
        <Route path="/marketing-catalog/dev" component={MarketingCatalogDev} />
        <Route path="/marketing-catalog/admin" component={MarketingCatalogAdmin} />
        <Route path="/developer-portal" component={DeveloperPortal} />
        <Route path="/billing" component={Billing} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/dev-studio" component={DevStudio} />
        <Route path="/studio" component={Studio} />
        <Route path="/studio/projects" component={StudioProjects} />
        <Route path="/team" component={Team} />
        <Route path="/bridge" component={Bridge} />
        <Route path="/staking" component={Staking} />
        <Route path="/faucet" component={Faucet} />
        <Route path="/swap" component={Swap} />
        <Route path="/markets" component={Markets} />
        <Route path="/pulse" component={Pulse} />
        <Route path="/ml-dashboard" component={MLDashboard} />
        <Route path="/strike-agent" component={StrikeAgent} />
        <Route path="/guardian-scanner" component={GuardianScanner} />
        <Route path="/guardian-scanner/:chain/:symbol" component={GuardianScannerDetail} />
        <Route path="/coin/:id" component={CoinAnalysis} />
        <Route path="/nft" component={NftMarketplace} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/transactions" component={Transactions} />
        <Route path="/launchpad" component={Launchpad} />
        <Route path="/liquidity" component={Liquidity} />
        <Route path="/nft-gallery" component={NftGallery} />
        <Route path="/nft-creator" component={NftCreator} />
        <Route path="/charts" component={Charts} />
        <Route path="/webhooks" component={Webhooks} />
        <Route path="/multisig" component={MultiSig} />
        <Route path="/proof-of-reserve" component={ProofOfReserve} />
        <Route path="/liquid-staking" component={LiquidStaking} />
        <Route path="/airdrop" component={AirdropClaim} />
        <Route path="/quests" component={Quests} />
        <Route path="/network" component={NetworkStats} />
        <Route path="/founder-program" component={FounderProgram} />
        <Route path="/validators" component={Validators} />
        <Route path="/wallet" component={Wallet} />
        <Route path="/status" component={Status} />
        <Route path="/api-docs" component={ApiDocs} />
        <Route path="/owner-admin" component={OwnerAdminPortal} />
        <Route path="/owner-admin/analytics" component={OwnerAnalytics} />
        <Route path="/owner-admin/seo" component={OwnerSeoManager} />
        <Route path="/owner-admin/referrals" component={OwnerReferrals} />
        <Route path="/owner-admin/users" component={OwnerUsers} />
        <Route path="/owner-admin/guardian" component={OwnerGuardian} />
        <Route path="/owner-admin/domains" component={OwnerDomains} />
        <Route path="/owner-admin/faucet" component={OwnerFaucet} />
        <Route path="/owner-admin/kyc" component={OwnerKyc} />
        <Route path="/owner-admin/zealy" component={OwnerZealy} />
        <Route path="/owner-admin/feedback" component={OwnerFeedback} />
        <Route path="/owner-admin/messaging" component={OwnerMessaging} />
        <Route path="/owner-admin/presale" component={OwnerPresale} />
        <Route path="/feedback" component={Feedback} />
        <Route path="/team-admin" component={TeamAdminPortal} />
        <Route path="/ops-center" component={TeamOperations} />
        <Route path="/chronicles-admin" component={ChroniclesAdmin} />
        <Route path="/terms" component={Terms} />
        <Route path="/virtual-currency-terms" component={VirtualCurrencyTerms} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/error" component={ErrorPage} />
        <Route path="/token-compare" component={TokenCompare} />
        <Route path="/investor-pitch" component={InvestorPitch} />
        <Route path="/vision" component={Vision} />
        <Route path="/trust-layer" component={TrustLayer} />
        <Route path="/learn" component={Learn} />
        <Route path="/ecosystem" component={EcosystemMap} />
        <Route path="/code-snippets" component={CodeSnippets} />
        <Route path="/api-usage" component={ApiUsage} />
        <Route path="/referrals" component={Referrals} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/dashboard-pro" component={DashboardPro} />
        <Route path="/trading" component={Trading} />
        <Route path="/whale-tracker" component={WhaleTracker} />
        <Route path="/copy-trading" component={CopyTrading} />
        <Route path="/dca-bot" component={DCABot} />
        <Route path="/token-analytics" component={TokenAnalytics} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route path="/wallet-profiler" component={WalletProfiler} />
        <Route path="/gas-estimator" component={GasEstimator} />
        <Route path="/activity" component={ActivityFeed} />
        <Route path="/ai-nft" component={AINFTGenerator} />
        <Route path="/rarity" component={RarityAnalyzer} />
        <Route path="/profile" component={UserProfiles} />
        <Route path="/governance" component={DAOGovernance} />
        <Route path="/simulate" component={TxSimulator} />
        <Route path="/rebalancer" component={PortfolioRebalancer} />
        <Route path="/arcade" component={Arcade} />
        <Route path="/crash" component={Crash} />
        <Route path="/predictions" component={Predictions} />
        <Route path="/social" component={SocialFeed} />
        <Route path="/lottery" component={Lottery} />
        <Route path="/ai-advisor" component={AIAdvisor} />
        <Route path="/alerts" component={PriceAlerts} />
        <Route path="/paper-trading" component={PaperTrading} />
        <Route path="/achievements" component={Achievements} />
        <Route path="/domains" component={Domains} />
        <Route path="/domain/:name" component={DomainManager} />
        <Route path="/partners" component={PartnerPortal} />
        <Route path="/influencer-partnership" component={InfluencerPartnership} />
        <Route path="/kol" component={InfluencerPartnership} />
        <Route path="/game-developer" component={GameDeveloper} />
        <Route path="/slots" component={Slots} />
        <Route path="/coinflip" component={Coinflip} />
        <Route path="/spades" component={Spades} />
        <Route path="/solitaire" component={Solitaire} />
        <Route path="/minesweeper" component={Minesweeper} />
        <Route path="/galaga" component={Galaga} />
        <Route path="/tetris" component={Tetris} />
        <Route path="/snake" component={Snake} />
        <Route path="/pacman" component={Pacman} />
        <Route path="/genesis" component={Genesis} />
        <Route path="/veil" component={Veil} />
        <Route path="/veil/read" component={VeilReader} />
        <Route path="/veil/print/vol2" component={VeilPrintVol2} />
        <Route path="/chronochat" component={ChronoChat} />
        <Route path="/chronochat/invite/:code" component={ChronoChatInvite} />
        <Route path="/creator-program" component={CreatorProgram} />
        <Route path="/era-codex" component={EraCodex} />
        <Route path="/scenario-generator" component={ScenarioGenerator} />
        <Route path="/crowdfund" component={Crowdfund} />
        <Route path="/community" component={CommunityHub} />
        <Route path="/presale" component={Presale} />
        <Route path="/presale/success" component={PresaleSuccess} />
        <Route path="/investment-simulator" component={InvestmentSimulator} />
        <Route path="/roadmap" component={RoadmapEcosystem} />
        <Route path="/roadmap-chronicles" component={RoadmapChronicles} />
        <Route path="/roadmap-ecosystem" component={RoadmapEcosystem} />
        <Route path="/technical-roadmap" component={TechnicalRoadmap} />
        <Route path="/innovation" component={InnovationHub} />
        <Route path="/ai-agents" component={AIAgentMarketplace} />
        <Route path="/rwa" component={RWATokenization} />
        <Route path="/chronicles" component={Chronicles} />
        <Route path="/chronicles/login" component={ChroniclesLogin} />
        <Route path="/chronicles/demo" component={ChroniclesDemo} />
        <Route path="/chronicles/ai" component={ChroniclesAIDemo} />
        <Route path="/chronicles/onboarding" component={ChroniclesOnboarding} />
        <Route path="/chronicles/estate" component={ChroniclesEstate} />
        <Route path="/chronicles/interior" component={ChroniclesInterior} />
        <Route path="/chronicles/life" component={ChroniclesLife} />
        <Route path="/chronicles/hub" component={ChroniclesHub} />
        <Route path="/chronicles/time-portal" component={ChroniclesTimePortal} />
        <Route path="/chronicles/builder" component={ChroniclesBuilder} />
        <Route path="/chronicles-estate" component={ChroniclesEstate} />
        <Route path="/legacy" component={BuildYourLegacy} />
        <Route path="/sweepstakes-rules" component={SweepstakesRules} />
        <Route path="/coin-store" component={CoinStore} />
        <Route path="/daily-bonus" component={DailyBonus} />
        <Route path="/gateway-error" component={GatewayError} />
        <Route path="/coming-features" component={ComingFeatures} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function Router() {
  const appType = useMemo(() => getAppFromHost(), []);
  
  if (appType === "games") {
    return <GamesRouter />;
  }
  if (appType === "chrono") {
    return <ChronoRouter />;
  }
  return <DWSCRouter />;
}

function App() {
  const appType = useMemo(() => getAppFromHost(), []);
  const showAIAssistant = appType === "dwsc";
  
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <PreferencesProvider>
          <NotificationsProvider>
            <FavoritesProvider>
              <TooltipProvider>
                <Toaster />
                <Router />
                {showAIAssistant && <AIAssistant />}
                <FloatingChat />
                <GlobalSearch />
              </TooltipProvider>
            </FavoritesProvider>
          </NotificationsProvider>
        </PreferencesProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
}

export default App;
