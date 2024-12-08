'use client';

import { liskSepolia } from 'viem/chains';
import { createConfig, http } from 'wagmi';


export const config = createConfig({
  chains: [liskSepolia],
  transports: {
    [liskSepolia.id]: http(),
  },
});