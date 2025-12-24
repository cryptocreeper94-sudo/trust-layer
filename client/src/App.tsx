import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PreferencesProvider, NotificationsProvider } from "@/lib/store";
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
import NotFound from "@/pages/not-found";

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
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PreferencesProvider>
        <NotificationsProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            <AIAssistant />
          </TooltipProvider>
        </NotificationsProvider>
      </PreferencesProvider>
    </QueryClientProvider>
  );
}

export default App;
