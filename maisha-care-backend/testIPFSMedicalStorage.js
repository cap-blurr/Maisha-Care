import dotenv from 'dotenv';
import IPFSMedicalStorage from './IPFSMedicalStorage.js';

dotenv.config();

const ipfsMedicalStorage = new IPFSMedicalStorage(
  process.env.JWT,
  process.env.PINATA_GATEWAY
);

const mockEncryptedDataPackage = {
  encryptedData: 'd96fd2e6a9f883242df1d7b03364508f2c2a2536cb45a9dec2ef7d7bb4eabc61c002a88600629da767bb620d27a559db3cf639d73e24799aa7152d80f1137c369ad4fa2234eb895692a9cad1b4e7cd6c917cd4ded68cc9572b380ef0ff15d86ed9857d7decb8ec4ac9d4d4c828090d11da80845f81809eeb5d7e18409f3c092ddd9b5a8671a9ea9bf0690c627f06f9a4a3c413ac956a4fc9479512639da9a15e37dfaf25384afc0474650facd23e11c225dec461fd4b7cdc6653c8d38a6a32e0454638b3c3ea057485ce59194418ab81dabd308f7920cfc24d8f47a10d113b6a80fa13aab6fb7e3386f2e894517cd7664b28df0fcb10bd00814012c8b9c2c641216936c62597ee131906c3ae31e48402',
  iv: '1785690293ba3c4c65aaa97b',
  authTag: 'f0c5af1f835ae84e4dacf22a26c1c7d6',
  encryptedSymmetricKey: '63b1932937b1a8358e7c5d7d66c0e9f4d80c45503376287233ed727a3d03168d8f5eecb04c334bc1608e99186c7f91d77673138830223e7cf04186f2a7fbcb60116845e13e1a4dae238d9b3661cc856612c1c22db2f393190767e99687bc3478215e384dc239424c0dfff9fe4d9f892a3fb5c52d4710a22545ad6071b47779c3b39c036a0bb9e2a880f07bc1158bc14b5212f5c2f453b88d5d7a42777caddc535819188808d322047811d6da3a3db6024fc2c2825e5cefdf448598a4c6b63b86cf0100a19cb8948536902331b0946517a7ec5e734ae03c71a5e415d80c605d90b2febc68627a694fc7c57f78359f595d0141b841ff6cab281bf02af455a8c567',
  signature: '96fd026cb0796d2df6333c9ef1602385ae8664ef44c58cb6fbb856b4e9551d4438f5bdb3d8f746e5bde9fe97262f19e8a000c88871702af0d87d9e5e49825bb18bdd9d6a1bf6359829107f1a24fcd02647e0f64b608aa1be5e095f1f6a37b5b21e98e65a18b72d075ebd606e5bf305592dcb704062eb954461bdc63b5656cc3c6788d1a0dbcf186c2e8d164bb762aed784208aaab87055bf4f738e30cb294e9025662c2573aee815d43f0d8b64432d59209e7ee8a6a74d93c84719d7f9bf66a2a18fc59d621eff8033a749a1793145554dbe28c7b7ca6baf9eac0fc24429a6de6b0173a51989e6dd371bb6eb64c6845966781091dd148c40fe24f0deb1f7de92'
};

async function testInitialize() {
  console.log('Testing initialize method...');
  await ipfsMedicalStorage.initialize();
  console.log('Initialization complete.');
}

async function testStoreEncryptedData() {
  console.log('Testing storeEncryptedData method...');
  const patientId = 'test-patient-001';
  const dataType = 'personal_info';
  const result = await ipfsMedicalStorage.storeEncryptedData(patientId, dataType, mockEncryptedDataPackage);
  console.log('Encrypted data stored. Result:', result);
  return result;
}

async function testRetrieveEncryptedData() {
  console.log('Testing retrieveEncryptedData method...');
  const patientId = 'test-patient-001';
  const dataType = 'personal_info';
  const result = await ipfsMedicalStorage.retrieveEncryptedData(patientId, dataType);
  console.log('Retrieved encrypted data:', result);
  return result;
}

async function testMultipleDataTypes() {
  console.log('Testing multiple data types...');
  const patientId = 'test-patient-002';
  const dataTypes = ['personal_info', 'current_health', 'medical_history', 'treatment_records'];
  
  for (const dataType of dataTypes) {
    const storeResult = await ipfsMedicalStorage.storeEncryptedData(patientId, dataType, mockEncryptedDataPackage);
    console.log(`Stored ${dataType}. Result:`, storeResult);
    
    const retrieveResult = await ipfsMedicalStorage.retrieveEncryptedData(patientId, dataType);
    console.log(`Retrieved ${dataType}:`, retrieveResult);
  }
}

async function testRetrieveNonExistentData() {
  console.log('Testing retrieval of non-existent data...');
  const patientId = 'non-existent-patient';
  const dataType = 'personal_info';
  const result = await ipfsMedicalStorage.retrieveEncryptedData(patientId, dataType);
  console.log('Result of retrieving non-existent data:', result);
}

async function runTests() {
  try {
    await testInitialize();
    const storedData = await testStoreEncryptedData();
    // Small delay to ensure data is stored before retrieval
    await new Promise(resolve => setTimeout(resolve, 1000));
    const retrievedData = await testRetrieveEncryptedData();
    
    console.log('Comparing stored and retrieved data:');
    console.log('Stored data:', JSON.stringify(storedData));
    console.log('Retrieved data:', JSON.stringify(retrievedData));

    if (JSON.stringify(mockEncryptedDataPackage) !== JSON.stringify(retrievedData)) {
      throw new Error('Stored and retrieved data do not match');
    } else {
      console.log('Stored and retrieved data match successfully.');
    }

    await testMultipleDataTypes();
    await testRetrieveNonExistentData();
    
    console.log('All tests completed successfully.');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTests();