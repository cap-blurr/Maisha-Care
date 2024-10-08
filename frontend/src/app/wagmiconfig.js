import { cookieStorage, createStorage,http,createConfig } from 'wagmi'
import {anvil,base,baseSepolia} from 'wagmi/chains'
import { metaMask,coinbaseWallet } from 'wagmi/connectors';

export const wagmiconfig = createConfig({
  chains: [anvil,base,baseSepolia],
  connectors: [
    coinbaseWallet({ appName: 'Maisha Care', preference: 'smartWalletOnly' }),
    metaMask()
  ],
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  transports: {
    [baseSepolia.id]: http(),
    [anvil.id] : http(),
    [base.id] : http(),

  },
});