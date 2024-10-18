import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import IPFSMedicalStorage from './IPFSMedicalStorage.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Initialize IPFSMedicalStorage
const ipfsMedicalStorage = new IPFSMedicalStorage(
  process.env.PINATA_API_KEY,
  process.env.PINATA_API_SECRET
);

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true,
}));
app.use(express.json());

// Initialize IPFS storage
(async () => {
  try {
    await ipfsMedicalStorage.initialize();
    console.log('IPFS Medical Storage initialized successfully');
  } catch (error) {
    console.error('Failed to initialize IPFS Medical Storage:', error);
    process.exit(1);
  }
})();

app.post('/api/store-data', async (req, res) => {
  try {
    const { patientId, dataType, encryptedDataPackage, identifier } = req.body;

    let result;
    if (dataType === 'attachment') {
      const { attachmentId, encryptedFile, extension } = encryptedDataPackage;
      result = await ipfsMedicalStorage.storeAttachment(patientId, attachmentId, encryptedFile, extension);
    } else {
      result = await ipfsMedicalStorage.storeEncryptedData(patientId, dataType, encryptedDataPackage, identifier);
    }

    res.json({
      success: true,
      message: 'Data stored successfully on IPFS',
      cid: result
    });
  } catch (error) {
    console.error('Data storage error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/retrieve-data', async (req, res) => {
  try {
    const { patientId, dataType, identifier } = req.body;

    let encryptedDataPackage;
    if (dataType === 'attachment') {
      const { attachmentId, extension } = req.body;
      encryptedDataPackage = await ipfsMedicalStorage.retrieveAttachment(patientId, attachmentId, extension);
    } else {
      encryptedDataPackage = await ipfsMedicalStorage.retrieveEncryptedData(patientId, dataType, identifier);
    }

    if (!encryptedDataPackage) {
      throw new Error('Data not found');
    }

    res.json({ 
      success: true, 
      message: 'Data retrieved successfully from IPFS',
      encryptedDataPackage 
    });
  } catch (error) {
    console.error('Data retrieval error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ success: false, error: 'An unexpected error occurred' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});