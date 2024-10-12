"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { base, baseSepolia } from "viem/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import "@coinbase/onchainkit/styles.css";
import React, { useState, type ReactNode } from "react";
import * as dotenv from "dotenv";
import { State, WagmiProvider } from "wagmi";
import { getConfig } from "@/config/wagmi";
dotenv.config();

// Setup queryClient
const queryClient = new QueryClient();

const { NEXT_PUBLIC_ONCHAINKIT_API_KEY } = process.env;

export default function Web3ModalProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  const [config] = useState(() => getConfig());
  return (
    <OnchainKitProvider apiKey={NEXT_PUBLIC_ONCHAINKIT_API_KEY} chain={baseSepolia}>
      <WagmiProvider config={config} initialState={initialState}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </OnchainKitProvider>
  );
}
