// hooks/useContract.js

import { useAccount } from 'wagmi';
import { useState, useCallback } from 'react';
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
  useContractEvent,
} from 'wagmi';
import VerifiedAddressRegistryABI from '../abis/VerifiedAddressRegistry.json';
import RoleManagerABI from '../abis/RoleManager.json';
import TemporaryAccessABI from '../abis/TemporaryAccess.json';
import HealthRecordManagerABI from '../abis/HealthRecordManager.json';

export function useContract() {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const VERIFIED_ADDRESS_REGISTRY_ADDRESS = '0xYourVerifiedAddressRegistryAddress';
  const ROLE_MANAGER_ADDRESS = '0xYourRoleManagerAddress';
  const TEMPORARY_ACCESS_ADDRESS = '0xYourTemporaryAccessAddress';
  const HEALTH_RECORD_MANAGER_ADDRESS = '0xYourHealthRecordManagerAddress';

  // Move all useWriteContract calls to the top level
  const { writeAsync: verifyAddressWrite } = useWriteContract({
    address: VERIFIED_ADDRESS_REGISTRY_ADDRESS,
    abi: VerifiedAddressRegistryABI,
    functionName: 'verifyAddress',
  });

  const { writeAsync: registerAsPatientWrite } = useWriteContract({
    address: ROLE_MANAGER_ADDRESS,
    abi: RoleManagerABI,
    functionName: 'registerAsPatient',
  });

  const { writeAsync: registerAsDoctorWrite } = useWriteContract({
    address: ROLE_MANAGER_ADDRESS,
    abi: RoleManagerABI,
    functionName: 'registerAsDoctor',
  });

  const { writeAsync: requestAccessWrite } = useWriteContract({
    address: TEMPORARY_ACCESS_ADDRESS,
    abi: TemporaryAccessABI,
    functionName: 'requestAccess',
  });

  const { writeAsync: approveAccessWrite } = useWriteContract({
    address: TEMPORARY_ACCESS_ADDRESS,
    abi: TemporaryAccessABI,
    functionName: 'approveAccess',
  });

  const { writeAsync: initiateCurrentHealthUpdateWrite } = useWriteContract({
    address: HEALTH_RECORD_MANAGER_ADDRESS,
    abi: HealthRecordManagerABI,
    functionName: 'initiateCurrentHealthUpdate',
  });

  const handleError = useCallback((error) => {
    console.error('Contract interaction error:', error);
    setError(error.message);
  }, []);

  const executeWrite = useCallback(async (writeFunction, args = []) => {
    setLoading(true);
    setError(null);
    try {
      const tx = await writeFunction({ args });
      await tx.wait();
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Refactored contract interaction functions
  const verifyAddress = useCallback((role) => 
    executeWrite(verifyAddressWrite, [ethers.utils.id(role), address]),
  [executeWrite, verifyAddressWrite, address]);

  const registerAsPatient = useCallback(() => 
    executeWrite(registerAsPatientWrite),
  [executeWrite, registerAsPatientWrite]);

  const registerAsDoctor = useCallback(() => 
    executeWrite(registerAsDoctorWrite),
  [executeWrite, registerAsDoctorWrite]);

  const requestAccess = useCallback((patientAddress) => 
    executeWrite(requestAccessWrite, [patientAddress]),
  [executeWrite, requestAccessWrite]);

  const approveAccess = useCallback((doctorAddress) => 
    executeWrite(approveAccessWrite, [doctorAddress]),
  [executeWrite, approveAccessWrite]);

  const initiateCurrentHealthUpdate = useCallback((patientAddress, dataHash) => 
    executeWrite(initiateCurrentHealthUpdateWrite, [patientAddress, dataHash]),
  [executeWrite, initiateCurrentHealthUpdateWrite]);

  return {
    loading,
    error,
    verifyAddress,
    registerAsPatient,
    registerAsDoctor,
    requestAccess,
    approveAccess,
    initiateCurrentHealthUpdate,
  };
}