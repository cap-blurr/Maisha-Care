import crypto from 'crypto';

export function encryptSymmetricKey(symmetricKey, patientPublicKey) {
  const encryptedKey = crypto.publicEncrypt(
    {
      key: patientPublicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    symmetricKey
  );

  return encryptedKey.toString('base64');
}