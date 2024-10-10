import crypto from 'crypto';

export function encryptData(data, symmetricKey) {
  const iv = crypto.randomBytes(12); // 96-bit nonce for AES-GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', symmetricKey, iv);

  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted,
    authTag: authTag.toString('hex'),
  };
}