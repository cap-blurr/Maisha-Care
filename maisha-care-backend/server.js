require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ethers = require('ethers');
const { createHelia } = require('helia');
const { unixfs } = require('@helia/unixfs');

const app = express();
const port = process.env.PORT || 5000;

// Setup provider and signer
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// ABI and contract addresses (replace with your deployed contract addresses)
const VerifiedAddressRegistryABI = [/* Add ABI here */];
const RoleManagerABI = [/* Add ABI here */];

const verifiedAddressRegistryContract = new ethers.Contract(
  process.env.VERIFIED_ADDRESS_REGISTRY_ADDRESS,
  VerifiedAddressRegistryABI,
  wallet
);

const roleManagerContract = new ethers.Contract(
  process.env.ROLE_MANAGER_ADDRESS,
  RoleManagerABI,
  wallet
);

// IPFS setup
let helia;
let fs;

async function setupIPFS() {
  helia = await createHelia();
  fs = unixfs(helia);
}

setupIPFS();

// Middleware
app.use(cors());
app.use(express.json());

// Doctor verification endpoint
app.post('/api/verify-doctor', async (req, res) => {
  try {
    const { address } = req.body;
    const doctorRole = await roleManagerContract.getDoctorRole();
    
    // In a real-world scenario, you would perform actual verification here
    // For this demo, we'll assume the verification is always successful
    
    const tx = await verifiedAddressRegistryContract.verifyAddress(doctorRole, address);
    await tx.wait();
    
    res.json({ success: true, message: 'Doctor verified successfully' });
  } catch (error) {
    console.error('Doctor verification error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Patient registration endpoint
app.post('/api/register-patient', async (req, res) => {
  try {
    const { address, formData } = req.body;
    
    // Store form data in IPFS
    const cid = await fs.addBytes(Buffer.from(JSON.stringify(formData)));
    
    // Call contract function to register patient
    const tx = await roleManagerContract.registerAsPatient();
    await tx.wait();
    
    res.json({ success: true, message: 'Patient registered successfully', cid: cid.toString() });
  } catch (error) {
    console.error('Patient registration error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});