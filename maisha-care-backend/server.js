import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { createPublicClient, http, keccak256 } from 'viem';
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

const publicClient = createPublicClient({
  chain: config.chain,
  transport: http(config.rpcUrl),
});

const VERIFIED_ADDRESS_REGISTRY_ADDRESS = config.verifiedAddressRegistry;

EventEmitter.defaultMaxListeners = 1500;

// Helia setup
let helia;
let jsonStore;

async function setupIPFS() {
  helia = await createHelia();
  jsonStore = json(helia);
}

setupIPFS().catch(console.error);

// Middleware
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  })
);
app.use(express.json());

// Role hashes mapping
const roleHashes = {
  patient: keccak256('patient'),
  doctor: keccak256('doctor'),
  researcher: keccak256('researcher'),
  builder: keccak256('builder'),
};

// Prepare Verification Data Endpoint
app.post('/api/prepare-verification', async (req, res) => {
  console.log('Received preparation request:', req.body);
  try {
    const { role, address, formData } = req.body;

    // Validate and get the correct role hash
    const roleHash = roleHashes[role.toLowerCase()];
    if (!roleHash) {
      throw new Error('Invalid role');
    }

    // Store form data in IPFS
    const cid = await jsonStore.add(formData);
    console.log('Data stored in IPFS with CID:', cid.toString());

    // Generate unique identifier hash
    const uniqueHash = keccak256(
      JSON.stringify({
        role,
        address,
        cid: cid.toString(),
        timestamp: Date.now(),
      })
    );
    console.log('Generated unique hash:', uniqueHash);

    // Prepare transaction data
    const { request } = await publicClient.simulateContract({
      address: VERIFIED_ADDRESS_REGISTRY_ADDRESS,
      abi: abi,
      functionName: 'verifyAddress',
      args: [roleHash, address, uniqueHash],
      account: address, 
    });

    console.log('Full transaction request:', request);

    console.log('Transaction data prepared for address:', address);
    res.json({
      success: true,
      message: 'Verification data prepared',
      transactionData: {
        to: VERIFIED_ADDRESS_REGISTRY_ADDRESS,
        data: request.data,
        value: request.value,
        chainId: publicClient.chain.id,
      },
      roleHash,
      uniqueHash,
      cid: cid.toString(),
    });
  } catch (error) {
    console.error('Preparation error:', error);
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
