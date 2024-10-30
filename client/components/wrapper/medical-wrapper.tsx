import React, { useState } from 'react';
import { ethers }from 'ethers';
import crypto from 'crypto';
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from "@coinbase/onchainkit/transaction";
import type {
  TransactionError,
  TransactionResponse,
} from "@coinbase/onchainkit/transaction";
import {
  type Address,
  type ContractFunctionParameters,
} from "viem";
import CryptoJS from 'crypto-js';
import { TEMPORARY_ACCESS_ADDRESS, HEALTH_RECORD_MANAGER_ADDRESS } from "../../constants";
import { TemporaryAccess } from '@/abi/TemporaryAccess';
import { HealthRecordManager } from '@/abi/HealthRecordManager';
import axios from 'axios';
import { MedicalFormData } from '@/types/api-types';

import { MedicalFormData } from '@/types/medical';

// Updated encryption utilities with proper typing
const encryptData = async (data: MedicalFormData, symmetricKey: Buffer) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', symmetricKey, iv);

  const jsonString = JSON.stringify(data);
  const encryptedBuffer = Buffer.concat([
    cipher.update(Buffer.from(jsonString, 'utf8')),
    cipher.final()
  ]);

  const authTag = cipher.getAuthTag();

  return {
    iv,
    encryptedData: encryptedBuffer,
    authTag
  };
};

const decryptData = async (
  encryptedPackage: {
    encryptedData: Buffer,
    iv: Buffer,
    authTag: Buffer,
    encryptedSymmetricKey: Buffer,
    signature: Buffer
  },
  privateKey: string,
  publicKey: string
) => {
  try {
    const pemPrivateKey = `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----`;
    const pemPublicKey = `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`;

    const decryptedSymmetricKey = crypto.privateDecrypt(
      {
        key: pemPrivateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      encryptedPackage.encryptedSymmetricKey
    );

    const verifier = crypto.createVerify('sha256');
    verifier.update(encryptedPackage.encryptedData);
    const isVerified = verifier.verify(pemPublicKey, encryptedPackage.signature);

    if (!isVerified) {
      throw new Error('Signature verification failed');
    }

    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      decryptedSymmetricKey,
      encryptedPackage.iv
    );
    decipher.setAuthTag(encryptedPackage.authTag);

    const decryptedBuffer = Buffer.concat([
      decipher.update(encryptedPackage.encryptedData),
      decipher.final()
    ]);

    return JSON.parse(decryptedBuffer.toString('utf8'));
  } catch (error) {
    console.error('Decryption failed:', error);
    throw error;
  }
};

export default function MedicalRecordWrapper({
  doctorAddress,
  patientAddress,
  formData,
}: {
  doctorAddress: Address;
  patientAddress: Address;
  formData: MedicalFormData;
}) {
  const [accessGranted, setAccessGranted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserKeys = async () => {
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask not installed');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Using ethers v6 syntax for message signing
      const message = "Please sign this message to access your public key for encryption";
      const signature = await signer.signMessage(message);
      
      // Get public key using SigningKey
      const messageHash = ethers.hashMessage(message);
      const signatureBytes = ethers.Signature.from(signature);
      const signingKey = ethers.SigningKey.recoverPublicKey(messageHash, signatureBytes);

      return {
        publicKey: signingKey,
        signer
      };
    } catch (error) {
      console.error('Error getting user keys:', error);
      throw error;
    }
  };

  const prepareEncryptedData = async () => {
    try {
      setLoading(true);
      setError(null);

      const symmetricKey = crypto.randomBytes(32);
      const { publicKey, signer } = await getUserKeys();

      const encryptedResult = await encryptData(formData, symmetricKey);

      const encryptedSymmetricKey = crypto.publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        symmetricKey
      );

      // Using ethers v6 syntax for keccak256
      const messageToSign = ethers.keccak256(
        ethers.solidityPacked(['bytes'], [encryptedResult.encryptedData])
      );
      const signature = await signer.signMessage(ethers.getBytes(messageToSign));

      return {
        encryptedData: encryptedResult.encryptedData,
        iv: encryptedResult.iv,
        authTag: encryptedResult.authTag,
        encryptedSymmetricKey,
        signature: Buffer.from(signature.slice(2), 'hex')
      };
    } catch (error) {
      console.error('Error preparing encrypted data:', error);
      setError('Failed to encrypt data');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const encryptData = (data: MedicalFormData) => {
    const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'defaultSecretKey';
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  };

  const storeDataOnIPFS = async (encryptedData: string) => {
    try {
      const response = await axios.post('/api/store-data', {
        patientId: patientAddress,
        dataType: 'currentHealth',
        encryptedDataPackage: { data: encryptedData }
      });
      return response.data.ipfsHash;
    } catch (error) {
      console.error('Error storing data on IPFS:', error);
      throw error;
    }
  };

  const requestAccessContract = {
    address: TEMPORARY_ACCESS_ADDRESS,
    abi: TemporaryAccess,
    functionName: "requestAccess",
    args: [patientAddress],
  } as unknown as ContractFunctionParameters;

  const addMedicalRecordContract = {
    address: HEALTH_RECORD_MANAGER_ADDRESS,
    abi: HealthRecordManager,
    functionName: "initiateCurrentHealthUpdate",
    args: [patientAddress, ipfsHash],
  } as unknown as ContractFunctionParameters;

  const handleError = (err: TransactionError) => {
    console.error("Transaction error:", err);
    setError(err.message);
    setError(err.message || "An error occurred during the transaction");
  };

  const handleSuccess = async (response: TransactionResponse) => {
    console.log("Transaction successful", response);
    if (!accessGranted) {
      setAccessGranted(true);
    }
  };

  const requestAccessContract = {
    address: TEMPORARY_ACCESS_ADDRESS,
    abi: TemporaryAccess,
    functionName: "requestAccess",
    args: [patientAddress],
  } as unknown as ContractFunctionParameters;

  const createMedicalRecordContract = async () => {
    const encryptedPackage = await prepareEncryptedData();
    const dataHash = ethers.keccak256(
      ethers.solidityPacked(['bytes'], [encryptedPackage.encryptedData])
    );

    return {
      address: HEALTH_RECORD_MANAGER_ADDRESS,
      abi: HealthRecordManager,
      functionName: "initiateCurrentHealthUpdate",
      args: [patientAddress, dataHash],
    } as unknown as ContractFunctionParameters;
  };

  return (
    <div className="flex w-[450px] flex-col space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {loading && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {!accessGranted ? (
        <Transaction
          contracts={[requestAccessContract]}
          chainId={84532}
          onError={handleError}
          onSuccess={handleSuccess}
        >
          <TransactionButton 
            className="w-full max-w-full text-white bg-blue-500 hover:bg-blue-600 py-2 rounded" 
            text='Request Access'
            disabled={loading} 
          />
          <TransactionStatus>
            <TransactionStatusLabel />
            <TransactionStatusAction />
          </TransactionStatus>
        </Transaction>
      ) : (
        <MedicalRecordTransaction 
          createContract={createMedicalRecordContract}
          onError={handleError}
          onSuccess={handleSuccess}
          loading={loading}
        />
      )}
    </div>
  );
}

// Separate component to handle async contract creation
const MedicalRecordTransaction = ({
  createContract,
  onError,
  onSuccess,
  loading
}: {
  createContract: () => Promise<ContractFunctionParameters>;
  onError: (error: TransactionError) => void;
  onSuccess: (response: TransactionResponse) => void;
  loading: boolean;
}) => {
  const [contract, setContract] = useState<ContractFunctionParameters | null>(null);

  React.useEffect(() => {
    createContract()
      .then(setContract)
      .catch(error => onError(error as TransactionError));
  }, [createContract, onError]);

  if (!contract) return null;

  return (
    <Transaction
      contracts={[contract]}
      chainId={84532}
      onError={onError}
      onSuccess={onSuccess}
    >
      <TransactionButton 
        className="w-full max-w-full text-white bg-green-500 hover:bg-green-600 py-2 rounded" 
        text='Add Medical Record'
        disabled={loading}
      />
      <TransactionStatus>
        <TransactionStatusLabel />
        <TransactionStatusAction />
      </TransactionStatus>
    </Transaction>
  );
};