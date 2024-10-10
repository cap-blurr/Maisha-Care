import { createPublicClient,createWalletClient, http } from 'viem';
import { foundry } from 'viem/chains';

// Chain configuration
const activeNetwork = process.env.ACTIVE_NETWORK || 'anvil';

const networkConfig = {
  anvil: {
    rpcUrl: process.env.ANVIL_RPC_URL,
    verifiedAddressRegistry: process.env.ANVIL_VERIFIED_ADDRESS_REGISTRY,
    chain: foundry,
  },
  baseSepolia: {
    rpcUrl: process.env.BASE_SEPOLIA_RPC_URL,
    verifiedAddressRegistry: process.env.BASE_SEPOLIA_VERIFIED_ADDRESS_REGISTRY,
    chain: baseSepolia,
  },
};

const config = networkConfig[activeNetwork];

export const publicClient = createPublicClient({
    chain: config.chain,
    transport: http(config.rpcUrl),
  });

export const walletClient = createWalletClient({
chain: config.chain,
transport: custom(window.ethereum)
})