import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { cookieStorage, createStorage,http } from 'wagmi'
import { mainnet, sepolia, anvil,liskSepolia,optimismSepolia,baseSepolia } from 'wagmi/chains'
import {injected} from "@wagmi/connectors"

// Get projectId from https://cloud.walletconnect.com
export const projectId = "421c28cd3ea3110ae66c04e046a58522"

if (!projectId) throw new Error('Project ID is not defined')

export const metadata = {
  name: 'Maisha-Care',
  description: 'Maisha-Care Web3 Application',
  url: 'https://minfundraiser.vercel.app/', // Add this line
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, sepolia, optimismSepolia, anvil,liskSepolia,baseSepolia]
export const config = defaultWagmiConfig({
  chains,
  projectId,
  transports : {
  [mainnet.id]: http(),
  [sepolia.id] : http(),
  [optimismSepolia.id] : http(),
  [liskSepolia.id] : http(),
  [baseSepolia.id] : http(),
  [anvil.id] : http(),
  },
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
})