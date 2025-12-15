import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Pages
import CardSelection from "./pages/CardSelection";
import MintID from "./pages/MintID";
import GameBoard from "./pages/GameBoard";
import CoffeeCorner from "./pages/CoffeeCorner";

function Router() {
  return (
    <Switch>
      <Route path="/" component={CardSelection} />
      <Route path="/mint-id" component={MintID} />
      <Route path="/game" component={GameBoard} />
      <Route path="/coffee" component={CoffeeCorner} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
