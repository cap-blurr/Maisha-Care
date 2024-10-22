import React, { useState } from 'react';
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
  keccak256,
  type Address,
  type ContractFunctionParameters,
  toBytes,
} from "viem";
import CryptoJS from 'crypto-js';
import { TEMPORARY_ACCESS_ADDRESS, HEALTH_RECORD_MANAGER_ADDRESS } from "../../constants";
import { TemporaryAccess } from '@/abi/TemporaryAccess';
import { HealthRecordManager } from '@/abi/HealthRecordManager';
import axios from 'axios';
import { MedicalFormData } from '@/types/api-types';


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
    setError(err.message || "An error occurred during the transaction");
  };

  const handleSuccess = async (response: TransactionResponse) => {
    console.log("Transaction successful", response);
    if (!accessGranted) {
      setAccessGranted(true);
      // After access is granted, encrypt and store the data
      try {
        const encryptedData = encryptData(formData);
        const hash = await storeDataOnIPFS(encryptedData);
        setIpfsHash(hash);
      } catch (error) {
        console.error("Error storing data:", error);
        setError("Failed to store data. Please try again.");
      }
    }
  };

  return (
    <div className="flex w-[450px] flex-col space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      {!accessGranted ? (
        <Transaction
          contracts={[requestAccessContract]}
          chainId={84532}
          onError={handleError}
          onSuccess={handleSuccess}
        >
          <TransactionButton className="w-full max-w-full text-white bg-blue-500 hover:bg-blue-600 py-2 rounded" text='Request Access' />
          <TransactionStatus>
            <TransactionStatusLabel />
            <TransactionStatusAction />
          </TransactionStatus>
        </Transaction>
      ) : ipfsHash ? (
        <Transaction
          contracts={[addMedicalRecordContract]}
          chainId={84532}
          onError={handleError}
          onSuccess={handleSuccess}
        >
          <TransactionButton className="w-full max-w-full text-white bg-green-500 hover:bg-green-600 py-2 rounded" text='Add Medical Record' />
          <TransactionStatus>
            <TransactionStatusLabel />
            <TransactionStatusAction />
          </TransactionStatus>
        </Transaction>
      ) : (
        <div>Storing data... Please wait.</div>
      )}
    </div>
  );
}