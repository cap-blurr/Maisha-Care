'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base,baseSepolia,anvil } from 'wagmi/chains';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

import { wagmiconfig } from './wagmiconfig';

const queryClient = new QueryClient();

export function Providers({ children, initialState }) {

  return (
    <WagmiProvider config={wagmiconfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_ONCHAINKIT_PUBLIC_API}
          chain={base}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}