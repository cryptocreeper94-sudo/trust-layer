import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PreferencesProvider, NotificationsProvider } from "@/lib/store";
import { WalletProvider } from "@/hooks/use-wallet";
import { AIAssistant } from "@/components/ai-assistant";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Developers from "@/pages/developers";
import DevelopersRegister from "@/pages/developers-register";
import Ecosystem from "@/pages/ecosystem";
import Token from "@/pages/token";
import Explorer from "@/pages/explorer";
import DocHub from "@/pages/doc-hub";
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
import Predictions from "@/pages/predictions";
import SocialFeed from "@/pages/social-feed";
import Lottery from "@/pages/lottery";
import AIAdvisor from "@/pages/ai-advisor";
import PriceAlerts from "@/pages/price-alerts";
import PaperTrading from "@/pages/paper-trading";
import Achievements from "@/pages/achievements";
import { FavoritesProvider } from "@/components/favorites-watchlist";

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/developers" component={Developers} />
        <Route path="/developers/register" component={DevelopersRegister} />
        <Route path="/ecosystem" component={Ecosystem} />
        <Route path="/token" component={Token} />
        <Route path="/explorer" component={Explorer} />
        <Route path="/doc-hub" component={DocHub} />
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
        <Route path="/admin/analytics" component={AdminAnalytics} />
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
        <Route path="/predictions" component={Predictions} />
        <Route path="/social" component={SocialFeed} />
        <Route path="/lottery" component={Lottery} />
        <Route path="/ai-advisor" component={AIAdvisor} />
        <Route path="/alerts" component={PriceAlerts} />
        <Route path="/paper-trading" component={PaperTrading} />
        <Route path="/achievements" component={Achievements} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <PreferencesProvider>
          <NotificationsProvider>
            <FavoritesProvider>
              <TooltipProvider>
                <Toaster />
                <Router />
                <AIAssistant />
              </TooltipProvider>
            </FavoritesProvider>
          </NotificationsProvider>
        </PreferencesProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
}

export default App;
