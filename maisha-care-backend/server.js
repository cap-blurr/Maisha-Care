import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { createPublicClient, http, createWalletClient, keccak256 } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia, foundry } from 'viem/chains';
import { createHelia } from 'helia';
import { json } from '@helia/json';
import { CID } from 'multiformats/cid';
import VerifiedAddressRegistryJSON from './abis/VerifiedAddressRegistry.json' assert { type: 'json' };
import { EventEmitter } from 'events';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const { abi } = VerifiedAddressRegistryJSON;

// Chain configuration
const activeNetwork = process.env.ACTIVE_NETWORK || 'anvil';

const networkConfig = {
  anvil: {
    rpcUrl: process.env.ANVIL_RPC_URL,
    privateKey: process.env.ANVIL_PRIVATE_KEY,
    verifiedAddressRegistry: process.env.ANVIL_VERIFIED_ADDRESS_REGISTRY,
    chain: foundry,
  },
  baseSepolia: {
    rpcUrl: process.env.BASE_SEPOLIA_RPC_URL,
    privateKey: process.env.BASE_SEPOLIA_PRIVATE_KEY,
    verifiedAddressRegistry: process.env.BASE_SEPOLIA_VERIFIED_ADDRESS_REGISTRY,
    chain: baseSepolia,
  }
};

const config = networkConfig[activeNetwork];

const publicClient = createPublicClient({
  chain: config.chain,
  transport: http(config.rpcUrl)
});

const account = privateKeyToAccount(config.privateKey);

const walletClient = createWalletClient({
  account,
  chain: config.chain,
  transport: http(config.rpcUrl)
});

const VERIFIED_ADDRESS_REGISTRY_ADDRESS = config.verifiedAddressRegistry;

EventEmitter.defaultMaxListeners = 150;
// Helia setup
let helia;
let jsonStore;

async function setupIPFS() {
  helia = await createHelia();
  jsonStore = json(helia);
}

setupIPFS().catch(console.error);

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Verify and Store Data Endpoint
app.post('/api/verify-and-store', async (req, res) => {
  console.log('Received verification and storage request:', req.body);
  try {
    const { role, address, formData } = req.body;

    // Store form data in IPFS
    const cid = await jsonStore.add(formData);
    console.log('Data stored in IPFS with CID:', cid.toString());

    // Generate unique identifier hash
    const uniqueHash = keccak256(
      JSON.stringify({
        role,
        address,
        cid: cid.toString(),
        timestamp: Date.now()
      })
    );
    console.log('Generated unique hash:', uniqueHash);

    // Verify address on smart contract
    const roleHash = keccak256(role);
    const { request } = await publicClient.simulateContract({
      address: VERIFIED_ADDRESS_REGISTRY_ADDRESS,
      abi: abi,
      functionName: 'verifyAddress',
      args: [roleHash, address, uniqueHash],
      account
    });
    const hash = await walletClient.writeContract(request);
    await publicClient.waitForTransactionReceipt({ hash });

    console.log('Verification successful for address:', address);
    res.json({ success: true, message: 'Verification and storage successful', uniqueHash, cid: cid.toString() });
  } catch (error) {
    console.error('Verification and storage error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Data Endpoint
app.get('/api/get-data/:cid', async (req, res) => {
  try {
    const cid = CID.parse(req.params.cid);
    const data = await jsonStore.get(cid);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Get data error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Event Listener
publicClient.watchContractEvent({
  address: VERIFIED_ADDRESS_REGISTRY_ADDRESS,
  abi: abi,
  eventName: 'AddressVerified',
  onLogs: (logs) => {
    console.log('AddressVerified event received:', logs);
    // Handle the event (e.g., update database, send notifications)
  },
});