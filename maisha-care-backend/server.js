import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { keccak256 } from 'viem';


import { walletClient } from './chain-interactions/viemclient.js';
import { generateSymmetricKey } from './encryption/generatesymmetrickey.js';
import { encryptData } from './encryption/encryptdata.js';
import { encryptSymmetricKey } from './encryption/encryptsymmetrickey.js';
import { generateSalt } from './hashing/generatesalt.js';
import { hashData } from './hashing/hashdata.js';
import { storeDataOnIPFS } from './ipfs/storedata.js';
import { storeMetadata } from './chain-interactions/storemetadata.js';
import { retrieveMetadata } from './chain-interactions/retrievemetadata.js';
import { retrieveDataFromIPFS } from './ipfs/retrievedata.js';
import { verifyDataIntegrity } from './verification/verifydataintegrity.js';
import { decryptSymmetricKey } from './decryption/decryptsymmetrickey.js';
import { decryptData } from './decryption/decryptdata.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;



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

// store Data Endpoint
app.post('/api/store-data', async (req, res) => {
  try {
    const { role, address, formData, patientPublicKey } = req.body;

    // Validate and get the correct role hash
    const roleHash = roleHashes[role.toLowerCase()];
    if (!roleHash) {
      throw new Error('Invalid role');
    }

    // Step 1: Generate Symmetric Key
    const symmetricKey = generateSymmetricKey();

    // Step 2: Encrypt Data
    const encryptedDataObj = encryptData(formData, symmetricKey);

    // Step 3: Encrypt Symmetric Key with Patient's Public Key
    const encryptedSymmetricKey = encryptSymmetricKey(symmetricKey, patientPublicKey);

    // Step 4: Generate Salt
    const salt = generateSalt();

    // Step 5: Hash Data
    const dataHash = hashData(encryptedDataObj.encryptedData, salt, role);

    // Step 6: Store Encrypted Data on IPFS
    const cid = await storeDataOnIPFS({
      encryptedData: encryptedDataObj,
      encryptedSymmetricKey,
      salt,
      dataHash,
    });

    // Step 7: Generate Unique Identifier Hash
    const uniqueHash = keccak256(
      JSON.stringify({
        role,
        address,
        cid: cid.toString(),
        timestamp: Date.now(),
      })
    );

    // Step 8: Prepare Transaction Data
    const request = await storeMetadata(roleHash, address, uniqueHash, address);

    await walletClient.writeContract(request)

    res.json({
      success: true,
      message: 'Verification data prepared',
      transactionRequest: {
        to: request.to,
        data: request.data,
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
app.post('/api/retrieve-data', async (req, res) => {
  try {
    const { address, patientPrivateKey, role } = req.body;

    // Step 1: Retrieve Metadata from Blockchain
    const metadata = await retrieveMetadata(address);

    const { cid, salt, dataHash } = metadata;

    // Step 2: Retrieve Encrypted Data from IPFS
    const encryptedDataObj = await retrieveDataFromIPFS(cid);

    // Step 3: Verify Data Integrity
    const isDataValid = verifyDataIntegrity(
      encryptedDataObj.encryptedData.encryptedData,
      encryptedDataObj.salt,
      role,
      encryptedDataObj.dataHash
    );

    if (!isDataValid) {
      throw new Error('Data integrity verification failed');
    }

    // Step 4: Decrypt Symmetric Key
    const symmetricKey = decryptSymmetricKey(
      encryptedDataObj.encryptedSymmetricKey,
      patientPrivateKey
    );

    // Step 5: Decrypt Data
    const decryptedData = decryptData(encryptedDataObj.encryptedData, symmetricKey);

    res.json({ success: true, data: decryptedData });
  } catch (error) {
    console.error('Data retrieval error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
