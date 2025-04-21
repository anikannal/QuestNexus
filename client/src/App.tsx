import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import React from "react";
import { GameProvider } from "@/context/GameContext";
import Home from "@/pages/home";
import Game from "@/pages/game";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/game" component={Game} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GameProvider children={
          <>
            <Toaster />
            <Router />
          </>
        } /> {/* Wrap the Router with GameProvider */}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
