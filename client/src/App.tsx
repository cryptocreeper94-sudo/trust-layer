import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PreferencesProvider, NotificationsProvider } from "@/lib/store";
import Home from "@/pages/home";
import Developers from "@/pages/developers";
import Ecosystem from "@/pages/ecosystem";
import Token from "@/pages/token";
import Explorer from "@/pages/explorer";
import DocHub from "@/pages/doc-hub";
import ApiPlayground from "@/pages/api-playground";
import Treasury from "@/pages/treasury";
import DeveloperPortal from "@/pages/developer-portal";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/developers" component={Developers} />
      <Route path="/ecosystem" component={Ecosystem} />
      <Route path="/token" component={Token} />
      <Route path="/explorer" component={Explorer} />
      <Route path="/doc-hub" component={DocHub} />
      <Route path="/api-playground" component={ApiPlayground} />
      <Route path="/treasury" component={Treasury} />
      <Route path="/developer-portal" component={DeveloperPortal} />
      <Route component={NotFound} />
    </Switch>
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
          </TooltipProvider>
        </NotificationsProvider>
      </PreferencesProvider>
    </QueryClientProvider>
  );
}

export default App;
