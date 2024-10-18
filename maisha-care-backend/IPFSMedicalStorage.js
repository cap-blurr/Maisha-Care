import { PinataSDK } from 'pinata-web3';

class IPFSMedicalStorage {
  constructor(pinataJwt, pinataGateway) {
    this.pinata = new PinataSDK({
      pinataJwt: pinataJwt,
      pinataGateway: pinataGateway
    });
  }

  async storeEncryptedData(patientId, dataType, encryptedDataPackage) {
    const key = this.generateKey(patientId, dataType);
    
    try {
      const result = await this.pinata.upload.json({
        key,
        data: encryptedDataPackage
      });
      
      return {
        ipfsHash: result.IpfsHash,
        pinSize: result.PinSize,
        timestamp: result.Timestamp
      };
    } catch (error) {
      console.error('Error storing encrypted data:', error);
      throw error;
    }
  }

  async retrieveEncryptedData(patientId, dataType) {
    const key = this.generateKey(patientId, dataType);
    
    try {
      const result = await this.pinata.files.list({
        metadata: { key }
      });
      
      if (result.count > 0) {
        const file = result.items[0];
        const content = await this.pinata.gateway.getFileById(file.id);
        return JSON.parse(content);
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error retrieving encrypted data:', error);
      return null;
    }
  }

  generateKey(patientId, dataType) {
    return `${patientId}-${dataType}-${Date.now()}`;
  }
}

export default IPFSMedicalStorage;