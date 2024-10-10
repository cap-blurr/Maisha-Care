import crypto from 'crypto';

export function decryptSymmetricKey(encryptedSymmetricKey, patientPrivateKey) {
  const decryptedKey = crypto.privateDecrypt(
    {
      key: patientPrivateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    Buffer.from(encryptedSymmetricKey, 'base64')
  );

  return decryptedKey;
}