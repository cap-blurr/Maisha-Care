import { hashData } from '../hashing/hashdata.js';

export function verifyDataIntegrity(encryptedData, salt, category, storedHash) {
  const computedHash = hashData(encryptedData, salt, category);
  return computedHash === storedHash;
}