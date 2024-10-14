import { http, cookieStorage, createConfig, createStorage } from 'wagmi';
import { anvil, base, foundry } from 'wagmi/chains'; 
import { coinbaseWallet } from 'wagmi/connectors';
 
export function Config() {
  return createConfig({
    chains: [anvil], 
    connectors: [
      coinbaseWallet({
        appName: "OnchainKit",
        preference: 'smartWalletOnly',
        version: '4',
      }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [anvil.id]: http(), 
    },
  });
}
 
declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof Config>;
  }
}