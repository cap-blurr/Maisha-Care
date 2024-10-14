import { ethers } from 'ethers';

declare let window: any; // Declare window for TypeScript

async function connectWallet() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Create an ethers provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Get the signer
      const signer = provider.getSigner();

      // Get the user's address
      const address = await signer.getAddress();

      console.log('Connected address:', address);
      return { provider, signer };
    } catch (error) {
      console.error('User rejected the request.');
    }
  } else {
    console.error('MetaMask is not installed.');
  }
}

connectWallet();