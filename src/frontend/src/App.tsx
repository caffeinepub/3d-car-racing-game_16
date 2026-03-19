import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { GamePage } from "./pages/GamePage";
import { HomePage } from "./pages/HomePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

export default function App() {
  const [page, setPage] = useState<"home" | "game">("home");

  return (
    <QueryClientProvider client={queryClient}>
      {page === "home" ? (
        <HomePage onPlayGame={() => setPage("game")} />
      ) : (
        <GamePage onExit={() => setPage("home")} />
      )}
      <Toaster />
    </QueryClientProvider>
  );
}
