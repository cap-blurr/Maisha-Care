import crypto from 'crypto';

export function hashData(encryptedData, salt, category) {
  const hash = crypto.createHash('sha256');
  hash.update(encryptedData + salt + category);
  return hash.digest('hex');
}