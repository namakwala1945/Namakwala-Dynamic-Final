"use client";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ReactNode, useState } from "react";
import FloatingButtons from "@/components/FloatingButtons";
const queryClient = new QueryClient();
export function Providers({ children }: { children: ReactNode }) {
  // ✅ Create QueryClient in the client environment
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            {children}
            <FloatingButtons/>
            <Toaster />
            <Sonner />
        </TooltipProvider>
    </QueryClientProvider>
  );
}
