"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { base } from "viem/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import "@coinbase/onchainkit/styles.css";
import React, { useState, type ReactNode } from "react";
import * as dotenv from "dotenv";
import { WagmiProvider } from "wagmi";
import { getConfig } from "@/config/wagmi";
dotenv.config();



const { NEXT_PUBLIC_ONCHAINKIT_API_KEY } = process.env;

// Set up queryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // With SSR, we usually want to set some default staleTime
      // above 0 to avoid refetching immediately on the client
      staleTime: 0,
    },
  },
});

function ContextProvider({ children }: { children: ReactNode }) {
  const [config] = useState(() => getConfig());
  return (
    <OnchainKitProvider apiKey={NEXT_PUBLIC_ONCHAINKIT_API_KEY} chain={base}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </OnchainKitProvider>
  );
}

export default ContextProvider;
