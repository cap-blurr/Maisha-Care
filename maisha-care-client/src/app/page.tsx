"use client";

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { VerifiedAddressRegistry } from '../../abi/VerifiedAddressRegistry';
import { VERIFIED_ADDRESS_REGISTRY_ADDRESS } from '../../constants';

declare let window: any;

function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVerifiedData, setIsVerifiedData] = useState<any>(null);
  

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        const newSigner = newProvider.getSigner();
        const address = await newSigner.getAddress();
        const network = await newProvider.getNetwork();
  
        setProvider(newProvider);
        setSigner(newSigner);
        setAccount(address);
        setChainId(network.chainId);
  
        // Read contract data once connected
        readContractData(newProvider);
      } catch (err) {
        console.error(err);
        setError('Failed to connect wallet');
      }
    } else {
      setError('MetaMask is not installed');
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
    setIsVerifiedData(null);
  };

  const roleHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('patient'));
  const dataHash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(JSON.stringify({
      name: "Anthony Kimani",
      dateOfBirth: "2024-10-31",
      nationalID: "3456782",
    }))
  );

  const readContractData = async (currentProvider: ethers.providers.Web3Provider) => {
    if (currentProvider) {
      const contract = new ethers.Contract(
        VERIFIED_ADDRESS_REGISTRY_ADDRESS,
        VerifiedAddressRegistry,
        currentProvider
      );
      try {
        const data = await contract.isVerified(
          "0xec03945fa2196716a09674e2cd6a57153479ecb05ea91e189e2688f793ab5381",
          "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
        );
        setIsVerifiedData(data);
        console.log('verifiedData:', data);
      } catch (err) {
        console.error(err);
        setError('Failed to read contract data');
      }
    }
  };

  const writeContractData = async () => {
    if (signer) {
      const contract = new ethers.Contract(
        VERIFIED_ADDRESS_REGISTRY_ADDRESS,
        VerifiedAddressRegistry,
        signer
      );
      try {
        const tx = await contract.verifyAddress(
          roleHash,
          "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          dataHash
        );
        console.log('Transaction Hash:', tx.hash);
        const receipt = await tx.wait();
        console.log('Transaction was mined in block:', receipt.blockNumber);
      } catch (err) {
        console.error(err);
        setError('Failed to write to contract');
      }
    } else {
      setError('Please connect your wallet');
    }
  };

  const handleClick = () => {
    writeContractData();
  };

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          if (provider) {
            readContractData(provider);
          }
        } else {
          disconnectWallet();
        }
      });
  
      window.ethereum.on('chainChanged', (chainId: string) => {
        const newChainId = parseInt(chainId, 16);
        setChainId(newChainId);
        if (provider) {
          readContractData(provider);
        }
      });
    }
  
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, [provider]);
  

    return (
      <>
        <div>
          <h2>Account</h2>
          <div>
            status: {account ? 'Connected' : 'Disconnected'}
            <br />
            address: {account}
            <br />
            chainId: {chainId}
          </div>
    
          {account ? (
            <button type="button" onClick={disconnectWallet}>
              Disconnect
            </button>
          ) : (
            <button type="button" onClick={connectWallet}>
              Connect Wallet
            </button>
          )}
        </div>
    
        <div>
          <h2>Contract Interaction</h2>
          <div>
            isVerifiedData: {JSON.stringify(isVerifiedData)}
          </div>
          <button onClick={handleClick}>Sign Up</button>
          {error && <div>Error: {error}</div>}
        </div>
      </>
    ); 
}

export default App;
