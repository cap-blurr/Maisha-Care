import crypto from 'crypto';

export function decryptData(encryptedDataObj, symmetricKey) {
  const { iv, encryptedData, authTag } = encryptedDataObj;
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    symmetricKey,
    Buffer.from(iv, 'hex')
  );
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));

  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
}