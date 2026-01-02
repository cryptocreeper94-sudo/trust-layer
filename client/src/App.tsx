import { useEffect, useMemo } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PreferencesProvider, NotificationsProvider } from "@/lib/store";
import { WalletProvider } from "@/hooks/use-wallet";
import { AIAssistant } from "@/components/ai-assistant";
import { getAppFromHost } from "@/lib/app-config";
import Home from "@/pages/home";
import GamesHome from "@/pages/games-home";
import StudiosHome from "@/pages/studios-home";
import GameDeveloper from "@/pages/game-developer";
import Dashboard from "@/pages/dashboard";
import Developers from "@/pages/developers";
import DevelopersRegister from "@/pages/developers-register";
import Ecosystem from "@/pages/ecosystem";
import Token from "@/pages/token";
import Explorer from "@/pages/explorer";
import DocHub from "@/pages/doc-hub";
import DWSCExecutiveSummary from "@/pages/dwsc-executive-summary";
import ApiPlayground from "@/pages/api-playground";
import Treasury from "@/pages/treasury";
import DeveloperPortal from "@/pages/developer-portal";
import DevStudio from "@/pages/dev-studio";
import Billing from "@/pages/billing";
import Studio from "@/pages/studio";
import StudioProjects from "@/pages/studio-projects";
import Team from "@/pages/team";
import Bridge from "@/pages/bridge";
import Staking from "@/pages/staking";
import Faucet from "@/pages/faucet";
import Swap from "@/pages/swap";
import NftMarketplace from "@/pages/nft-marketplace";
import Portfolio from "@/pages/portfolio";
import Transactions from "@/pages/transactions";
import Launchpad from "@/pages/launchpad";
import Liquidity from "@/pages/liquidity";
import NftGallery from "@/pages/nft-gallery";
import NftCreator from "@/pages/nft-creator";
import Charts from "@/pages/charts";
import Webhooks from "@/pages/webhooks";
import MultiSig from "@/pages/multisig";
import ProofOfReserve from "@/pages/proof-of-reserve";
import LiquidStaking from "@/pages/liquid-staking";
import AdminRewards from "@/pages/admin-rewards";
import AirdropClaim from "@/pages/airdrop-claim";
import Quests from "@/pages/quests";
import NetworkStats from "@/pages/network-stats";
import FounderProgram from "@/pages/founder-program";
import Validators from "@/pages/validators";
import Wallet from "@/pages/wallet";
import Status from "@/pages/status";
import ApiDocs from "@/pages/api-docs";
import AdminAnalytics from "@/pages/admin-analytics";
import AdminPartnerRequests from "@/pages/admin-partner-requests";
import AdminMarketing from "@/pages/admin-marketing";
import AdminDashboard from "@/pages/admin-dashboard";
import ChroniclesAIDemo from "@/pages/chronicles-ai-demo";
import BuildYourLegacy from "@/pages/build-your-legacy";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import ErrorPage from "@/pages/error";
import NotFound from "@/pages/not-found";
import TokenCompare from "@/pages/token-compare";
import CodeSnippets from "@/pages/code-snippets";
import ApiUsage from "@/pages/api-usage";
import Referrals from "@/pages/referrals";
import DashboardPro from "@/pages/dashboard-pro";
import Trading from "@/pages/trading";
import WhaleTracker from "@/pages/whale-tracker";
import CopyTrading from "@/pages/copy-trading";
import DCABot from "@/pages/dca-bot";
import TokenAnalytics from "@/pages/token-analytics";
import Leaderboard from "@/pages/leaderboard";
import WalletProfiler from "@/pages/wallet-profiler";
import GasEstimator from "@/pages/gas-estimator";
import ActivityFeed from "@/pages/activity-feed";
import AINFTGenerator from "@/pages/ai-nft-generator";
import RarityAnalyzer from "@/pages/rarity-analyzer";
import UserProfiles from "@/pages/user-profiles";
import DAOGovernance from "@/pages/dao-governance";
import TxSimulator from "@/pages/tx-simulator";
import PortfolioRebalancer from "@/pages/portfolio-rebalancer";
import Arcade from "@/pages/arcade";
import Crash from "@/pages/crash";
import Predictions from "@/pages/predictions";
import PlayerProfile from "@/pages/player-profile";
import CoinStore from "@/pages/coin-store";
import DailyBonus from "@/pages/daily-bonus";
import Slots from "@/pages/slots";
import Coinflip from "@/pages/coinflip";
import SweepstakesRules from "@/pages/sweepstakes-rules";
import Spades from "@/pages/spades";
import Solitaire from "@/pages/solitaire";
import Minesweeper from "@/pages/minesweeper";
import Galaga from "@/pages/galaga";
import Tetris from "@/pages/tetris";
import Snake from "@/pages/snake";
import Pacman from "@/pages/pacman";
import Genesis from "@/pages/genesis";
import CreatorProgram from "@/pages/creator-program";
import EraCodex from "@/pages/era-codex";
import ScenarioGenerator from "@/pages/scenario-generator";
import Crowdfund from "@/pages/crowdfund";
import Rewards from "@/pages/rewards";
import CommunityHub from "@/pages/community-hub";
import Presale from "@/pages/presale";
import PresaleSuccess from "@/pages/presale-success";
import InvestmentSimulator from "@/pages/investment-simulator";
import RoadmapChronicles from "@/pages/roadmap-chronicles";
import RoadmapEcosystem from "@/pages/roadmap-ecosystem";
import Chronicles from "@/pages/chronicles";
import ChronoHome from "@/pages/chrono-home";
import ChronoEras from "@/pages/chrono-eras";
import ChronoGameplay from "@/pages/chrono-gameplay";
import ChronoEconomy from "@/pages/chrono-economy";
import ChronoCommunity from "@/pages/chrono-community";
import ChronoRoadmap from "@/pages/chrono-roadmap";
import ChronoDashboard from "@/pages/chrono-dashboard";
import ChronoTeam from "@/pages/chrono-team";
import ChronoCreators from "@/pages/chrono-creators";
import ChronoExecutiveSummary from "@/pages/chrono-executive-summary";
import SocialFeed from "@/pages/social-feed";
import Lottery from "@/pages/lottery";
import AIAdvisor from "@/pages/ai-advisor";
import PriceAlerts from "@/pages/price-alerts";
import PaperTrading from "@/pages/paper-trading";
import Achievements from "@/pages/achievements";
import Domains from "@/pages/domains";
import DomainManager from "@/pages/domain-manager";
import PartnerPortal from "@/pages/partner-portal";
import Tokenomics from "@/pages/tokenomics";
import FAQ from "@/pages/faq";
import CompetitiveAnalysis from "@/pages/competitive-analysis";
import SecurityPage from "@/pages/security";
import GuardianCertification from "@/pages/guardian-certification";
import GuardianPortal from "@/pages/guardian-portal";
import OwnerAdminPortal from "@/pages/owner-admin";
import OwnerAnalytics from "@/pages/owner-admin/analytics";
import OwnerSeoManager from "@/pages/owner-admin/seo";
import OwnerReferrals from "@/pages/owner-admin/referrals";
import OwnerUsers from "@/pages/owner-admin/users";
import OwnerDomains from "@/pages/owner-admin/domains";
import GatewayError from "@/pages/gateway-error";
import { FavoritesProvider } from "@/components/favorites-watchlist";

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

function GamesRouter() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={GamesHome} />
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
        <Route path="/crash" component={Crash} />
        <Route path="/predictions" component={Predictions} />
        <Route path="/lottery" component={Lottery} />
        <Route path="/wallet" component={Wallet} />
        <Route path="/game-developer" component={GameDeveloper} />
        <Route path="/terms" component={Terms} />
        <Route path="/privacy" component={Privacy} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function StudiosRouter() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={StudiosHome} />
        <Route path="/terms" component={Terms} />
        <Route path="/privacy" component={Privacy} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function ChronoRouter() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={ChronoHome} />
        <Route path="/chronicles" component={Chronicles} />
        <Route path="/chronicles/ai" component={ChroniclesAIDemo} />
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
        <Route path="/creator-program" component={CreatorProgram} />
        <Route path="/era-codex" component={EraCodex} />
        <Route path="/crowdfund" component={Crowdfund} />
        <Route path="/presale" component={Presale} />
        <Route path="/presale/success" component={PresaleSuccess} />
        <Route path="/terms" component={Terms} />
        <Route path="/privacy" component={Privacy} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function DWSCRouter() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/rewards" component={Rewards} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/developers" component={Developers} />
        <Route path="/developers/register" component={DevelopersRegister} />
        <Route path="/ecosystem" component={Ecosystem} />
        <Route path="/token" component={Token} />
        <Route path="/tokenomics" component={Tokenomics} />
        <Route path="/faq" component={FAQ} />
        <Route path="/competitive-analysis" component={CompetitiveAnalysis} />
        <Route path="/security" component={SecurityPage} />
        <Route path="/guardian" component={GuardianCertification} />
        <Route path="/guardian-certification" component={GuardianCertification} />
        <Route path="/guardian-portal" component={GuardianPortal} />
        <Route path="/explorer" component={Explorer} />
        <Route path="/doc-hub" component={DocHub} />
        <Route path="/executive-summary" component={DWSCExecutiveSummary} />
        <Route path="/api-playground" component={ApiPlayground} />
        <Route path="/treasury" component={Treasury} />
        <Route path="/developer-portal" component={DeveloperPortal} />
        <Route path="/billing" component={Billing} />
        <Route path="/dev-studio" component={DevStudio} />
        <Route path="/studio" component={Studio} />
        <Route path="/studio/projects" component={StudioProjects} />
        <Route path="/team" component={Team} />
        <Route path="/bridge" component={Bridge} />
        <Route path="/staking" component={Staking} />
        <Route path="/faucet" component={Faucet} />
        <Route path="/swap" component={Swap} />
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
        <Route path="/admin/rewards" component={AdminRewards} />
        <Route path="/airdrop" component={AirdropClaim} />
        <Route path="/quests" component={Quests} />
        <Route path="/network" component={NetworkStats} />
        <Route path="/founder-program" component={FounderProgram} />
        <Route path="/validators" component={Validators} />
        <Route path="/wallet" component={Wallet} />
        <Route path="/status" component={Status} />
        <Route path="/api-docs" component={ApiDocs} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/analytics" component={AdminAnalytics} />
        <Route path="/admin/partner-requests" component={AdminPartnerRequests} />
        <Route path="/admin/marketing" component={AdminMarketing} />
        <Route path="/owner-admin" component={OwnerAdminPortal} />
        <Route path="/owner-admin/analytics" component={OwnerAnalytics} />
        <Route path="/owner-admin/seo" component={OwnerSeoManager} />
        <Route path="/owner-admin/referrals" component={OwnerReferrals} />
        <Route path="/owner-admin/users" component={OwnerUsers} />
        <Route path="/owner-admin/domains" component={OwnerDomains} />
        <Route path="/terms" component={Terms} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/error" component={ErrorPage} />
        <Route path="/token-compare" component={TokenCompare} />
        <Route path="/code-snippets" component={CodeSnippets} />
        <Route path="/api-usage" component={ApiUsage} />
        <Route path="/referrals" component={Referrals} />
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
        <Route path="/chronicles" component={Chronicles} />
        <Route path="/chronicles/ai" component={ChroniclesAIDemo} />
        <Route path="/legacy" component={BuildYourLegacy} />
        <Route path="/sweepstakes-rules" component={SweepstakesRules} />
        <Route path="/coin-store" component={CoinStore} />
        <Route path="/daily-bonus" component={DailyBonus} />
        <Route path="/gateway-error" component={GatewayError} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function Router() {
  const appType = useMemo(() => getAppFromHost(), []);
  
  if (appType === "games") {
    return <GamesRouter />;
  }
  if (appType === "studios") {
    return <StudiosRouter />;
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
              </TooltipProvider>
            </FavoritesProvider>
          </NotificationsProvider>
        </PreferencesProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
}

export default App;
