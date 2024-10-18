import { PinataSDK } from 'pinata-web3';
import { createHelia } from 'helia';
import { json } from '@helia/json';

class IPFSMedicalStorage {
  constructor(pinataJwt, pinataGateway) {
    this.pinata = new PinataSDK({
      pinataJwt: pinataJwt,
      pinataGateway: pinataGateway
    });
    this.helia = null;
    this.heliaJson = null;
  }

  async initialize() {
    this.helia = await createHelia();
    this.heliaJson = json(this.helia);
  }

  generateKey(patientId, dataType, identifier) {
    return `${patientId}-${dataType}-${identifier || Date.now()}`;
  }

  async storeEncryptedData(patientId, dataType, encryptedDataPackage, identifier = null) {
    if (!this.helia) await this.initialize();

    this.validateEncryptedDataPackage(encryptedDataPackage);

    const key = this.generateKey(patientId, dataType, identifier);
    
    // Store in Helia and get the CID
    const cid = await this.heliaJson.add(key, encryptedDataPackage);

    // Pin using Pinata
    return this.pinData(cid);
  }

  async retrieveEncryptedData(patientId, dataType, identifier = null) {
    if (!this.helia) await this.initialize();

    try {
      const key = this.generateKey(patientId, dataType, identifier);
      const data = await this.heliaJson.get(key);
      return data;
    } catch (error) {
      console.error('Error retrieving encrypted data:', error);
      return null;
    }
  }

  async pinData(cid) {
    console.log(`Pinning data with CID: ${cid}`);
    try {
      // Create a file containing the CID
      const cidString = cid.toString();
      const file = new File([cidString], 'cid.txt', { type: 'text/plain' });

      // Upload the file to Pinata
      const result = await this.pinata.upload.file(file);
      console.log(`Data pinned. IPFS Hash: ${result.IpfsHash}, Pin Size: ${result.PinSize}`);
      return {
        ipfsHash: cidString,
        pinataIpfsHash: result.IpfsHash,
        pinSize: result.PinSize
      };
    } catch (error) {
      console.error('Error pinning data:', error);
      return {
        ipfsHash: cid.toString(),
        pinataIpfsHash: null,
        pinSize: null
      };
    }
  }

  validateEncryptedDataPackage(encryptedDataPackage) {
    const requiredFields = ['encryptedData', 'iv', 'authTag', 'encryptedSymmetricKey', 'signature'];
    for (const field of requiredFields) {
      if (!encryptedDataPackage[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
  }
}

export default IPFSMedicalStorage;