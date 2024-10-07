import { useState, useEffect } from 'react';
import { useAccount, useReadContract} from 'wagmi';
import VerifiedAddressRegistryABI from '../abis/VerifiedAddressRegistry.json';
import {keccak256} from 'viem';


// Replace with your actual contract address
const VERIFIED_ADDRESS_REGISTRY_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const { abi } = VerifiedAddressRegistryABI.abi;


export function useAuth() {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const doctor_role = keccak256("DOCTOR_ROLE");
  const patient_role = keccak256("PATIENT_ROLE");

  // Read contract functions
  const { data: isPatient } = useReadContract({
    address: VERIFIED_ADDRESS_REGISTRY_ADDRESS,
    abi: abi,
    functionName: 'isVerified',
    args: [patient_role,address],
    enabled: !!address,
  });

  const { data: isDoctor } = useReadContract({
    address: VERIFIED_ADDRESS_REGISTRY_ADDRESS,
    abi: abi,
    functionName: 'isVerified',
    args: [doctor_role,address],
    enabled: !!address,
  });

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      if (isConnected && address) {
        setIsAuthenticated(true)
        if (isPatient) {
          setUserRole('patient')
          setIsRegistered(true)
        } else if (isDoctor) {
          setUserRole('doctor')
          setIsRegistered(true)
        } else {
          setUserRole(null)
          setIsRegistered(false)
        }
      } else {
        setIsAuthenticated(false)
        setIsRegistered(false)
        setUserRole(null)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [isConnected, address, isPatient, isDoctor])

  return { isAuthenticated, isRegistered, isLoading, address, userRole };
}