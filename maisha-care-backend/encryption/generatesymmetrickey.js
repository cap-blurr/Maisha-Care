import crypto from 'crypto';

export function generateSymmetricKey() {
    // Generate a 256-bit (32-byte) symmetric key
    return crypto.randomBytes(32);
  }

