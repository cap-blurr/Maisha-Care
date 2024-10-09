'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import styles from '../form.module.css';
import VerifiedAddressJSON from '../../abis/VerifiedAddressRegistry.json';
import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  parseAbiItem,
  getAddress,
  keccak256
} from 'viem';
import { foundry } from 'viem/chains';

// Smart contract address and RPC URL for the Ethereum network
const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const RPC_URL = 'http://127.0.0.1:8545'; 

// Mapping of roles to their keccak256 hashes
// This is used for role-based access control in the smart contract
const roleHashes = {
  patient: keccak256('patient'),
  doctor: keccak256('doctor'),
  researcher: keccak256('researcher'),
  builder: keccak256('builder'),
};

// Reverse mapping of hashes to role names
// This is used to decode roles from events
const roleNamesByHash = {};
for (const [name, hash] of Object.entries(roleHashes)) {
  roleNamesByHash[hash] = name;
}

export default function Form({ params }) {
  // Extract ABI from the imported JSON
  const { abi } = VerifiedAddressJSON;
  const router = useRouter();
  const { setRole } = useAuth();

  // State variables
  const [address, setAddress] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    specialization: '',
  });
  const [loading, setLoading] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);
  const [error, setError] = useState('');

  // Initialize Viem public client for read operations
  const publicClient = createPublicClient({
    chain: foundry,
    transport: http(RPC_URL),
  });

  // Initialize Viem wallet client for write operations
  let walletClient;
  try {
    walletClient = createWalletClient({
      chain: foundry,
      transport: custom(window.ethereum),
    });
  } catch (error) {
    console.error('Failed to create wallet client:', error);
  }

  // Effect to get user's Ethereum address
  useEffect(() => {
    async function getUserAddress() {
      if (!walletClient) {
        setError('Wallet not connected. Please make sure MetaMask is installed and connected.');
        return;
      }
      try {
        const [addr] = await walletClient.getAddresses();
        setAddress(addr);
      } catch (error) {
        console.error('Failed to get address:', error);
        setError('Failed to get address from wallet. Please make sure MetaMask is connected.');
      }
    }
    getUserAddress();
  }, []);

  // Effect to set up event listener for AddressVerified event
  useEffect(() => {
    if (!address) return;

    const handleAddressVerified = (logs) => {
      console.log('Received AddressVerified event. Raw logs:', logs);

      const log = logs[0];
      const [roleTopic, verifiedAddressTopic] = log.topics.slice(1);
      const uniqueHash = log.data;

      const checksumAddress = getAddress('0x' + verifiedAddressTopic.slice(26));

      console.log('Current user address:', address);
      console.log('Checksum address from event:', checksumAddress);

      // Check if the event is for the current user
      if (checksumAddress.toLowerCase() === address.toLowerCase()) {
        console.log('Address match confirmed');

        // Decode the event log
        const abiItem = parseAbiItem(
          'event AddressVerified(bytes32 indexed role, address indexed account, bytes32 uniqueHash)'
        );
        const decodedData = publicClient.decodeEventLog({
          abi: [abiItem],
          data: log.data,
          topics: log.topics,
        });

        const parsedRole = decodedData.args.role;
        const roleName = roleNamesByHash[parsedRole];

        if (roleName) {
          setRole(roleName);
          console.log(`Redirecting to dashboard/${roleName}`);
          router.push(`/dashboard/${roleName}`);
        } else {
          console.error('Unknown role hash:', parsedRole);
        }
      } else {
        console.log('Address mismatch. Event not for current user.');
      }
    };

    // Set up event listener
    const unwatch = publicClient.watchContractEvent({
      address: CONTRACT_ADDRESS,
      abi,
      eventName: 'AddressVerified',
      onLogs: handleAddressVerified,
    });

    // Cleanup function to remove the event listener
    return () => unwatch();
  }, [address]);

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (!walletClient) {
        throw new Error('Wallet not connected');
      }
      if (!address) {
        throw new Error('No address available');
      }

      // Step 1: Prepare verification data
      const prepareResponse = await fetch(
        'http://localhost:5000/api/prepare-verification',
        {
          method: 'POST',
          body: JSON.stringify({ role: params.role, address, formData }),
          headers: { 'Content-Type': 'application/json' },
        }
      );
      const prepareData = await prepareResponse.json();

      if (!prepareData.success) {
        throw new Error(prepareData.error || 'Failed to prepare verification data');
      }

      // Step 2: Simulate the contract call
      const { request } = await publicClient.simulateContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'verifyAddress',
        args: [prepareData.roleHash, address, prepareData.uniqueHash],
        account: address,
      });

      console.log('Simulation successful:', request);

      // Step 3: Send the transaction using writeContract
      const hash = await walletClient.writeContract(request);

      console.log('Transaction sent:', hash);
      setVerificationPending(true);

      // Step 4: Wait for transaction receipt
      const receipt = await publicClient.waitForTransactionReceipt({ 
        hash,
        timeout: 60000 // 60 seconds timeout
      });

      if (receipt.status === 'success') {
        console.log('Verification successful. Waiting for event...');
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError(error.message || 'An error occurred during verification');
      setVerificationPending(false);
    } finally {
      setLoading(false);
    }
  };

  // Render loading message if wallet is not connected
  if (!walletClient) {
    return <div>Please connect your wallet to continue.</div>;
  }

  // Check for valid route parameters
  if (!params || !params.role) {
    console.error('Invalid route parameters');
    return <div>Invalid route parameters</div>;
  }

  const isDoctor = params.role === 'doctor';

  // Render the form
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {isDoctor ? 'Doctor' : 'Patient'} Registration
      </h1>
      {error && <p className={styles.error}>{error}</p>}
      {verificationPending && (
        <p>Verification pending. Please wait for blockchain confirmation...</p>
      )}
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Full Name"
          required
          className={styles.input}
        />
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
          className={styles.input}
        />
        <input
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
          required
          className={styles.input}
        />
        {isDoctor && (
          <input
            name="specialization"
            value={formData.specialization}
            onChange={handleInputChange}
            placeholder="Specialization"
            required
            className={styles.input}
          />
        )}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading || verificationPending}
        >
          {loading ? 'Submitting...' : 'Register'}
        </button>
      </form>
    </div>
  );
}