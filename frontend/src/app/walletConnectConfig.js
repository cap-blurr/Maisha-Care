import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { cookieStorage, createStorage,http,createConfig } from 'wagmi'
import { mainnet, sepolia, anvil,baseSepolia } from 'wagmi/chains'
import {injected} from "@wagmi/connectors"

// Custom chain definition
const localChain = {
  id: 31337,
  name: 'Localhost',
  network: 'localhost',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
    public: {
      http: ['http://127.0.0.1:8545'],
    },
  },
  blockExplorers: {
    default: { name: 'Local Explorer', url: 'http://localhost:8545' },
  },
}

// Get projectId from https://cloud.walletconnect.com
export const projectId = "421c28cd3ea3110ae66c04e046a58522"

if (!projectId) throw new Error('Project ID is not defined')

export const metadata = {
  name: 'Maisha-Care',
  description: 'Maisha-Care Web3 Application',
  url: 'https://maisha-care-nextjs.vercel.app/', // Add this line
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, sepolia, anvil,baseSepolia,localChain]
export const config = defaultWagmiConfig({
  chains,
  projectId,
  transports : {
  [mainnet.id]: http(),
  [anvil.id] : http(),
  [sepolia.id] : http(),
  // [optimismSepolia.id] : http(),
  // [liskSepolia.id] : http(),
  [baseSepolia.id] : http(),
  [localChain.id] : http()
  
  },
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
})