import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { keccak256, encodePacked } from "viem";
import { ROLE_MANAGER_ADDRESS, VERIFIED_ADDRESS_REGISTRY_ADDRESS } from "../constants";
import { VerifiedAddressRegistry } from "../abi/VerifiedAddressRegistry";
import { RoleManager } from "../abi/RoleManager";

// Define the role hashes
const roleHashes = {
  patient: keccak256(encodePacked(["string"], ["patient"])),
  doctor: keccak256(encodePacked(["string"], ["doctor"])),
  researcher: keccak256(encodePacked(["string"], ["researcher"])),
  builder: keccak256(encodePacked(["string"], ["builder"])),
};

// Define types
export type FormData = {
  name: string;
  dateOfBirth: string;
  nationalID: string;
};

export type SignUpData = {
  role: string;
  address: string;
  formData: FormData;
};

export function useSignUp() {
  const [error, setError] = useState<string | null>(null);

  // Contract write hook for verifyAddress
  const { data: hash, writeContract } = useWriteContract();

  // Hook to wait for transaction receipt
  const { data: receipt, isLoading: isWaiting, isSuccess: isReceiptSuccess } = useWaitForTransactionReceipt({
    hash: hash as `0x${string}` | undefined,
  });

  // Hook to read contract
  const { data: isVerifiedData, refetch: refetchIsVerified } = useReadContract({
    address: VERIFIED_ADDRESS_REGISTRY_ADDRESS,
    abi: VerifiedAddressRegistry,
    functionName: 'isVerified',
    args: ["0xec03945fa2196716a09674e2cd6a57153479ecb05ea91e189e2688f793ab5381", "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"] 
  });

  const signUp = async (userData: SignUpData) => {
    try {
      setError(null);

      // Step 1: Validate role and generate hashes
      const roleHash = roleHashes[userData.role.toLowerCase() as keyof typeof roleHashes];
      if (!roleHash) {
        throw new Error('Invalid role');
      }

      const uniqueHash = keccak256(
        encodePacked(
          ["string", "address", "string", "uint256"],
          [userData.role, userData.address as `0x${string}`, JSON.stringify(userData.formData), BigInt(Date.now())]
        )
      );
      
      // Step 2: Call verifyAddress function
      try {
        console.log("roleHash:", roleHash, "data.address:", userData.address, "uniqueHash:", uniqueHash);
        
        writeContract({
          abi: VerifiedAddressRegistry,
          address: VERIFIED_ADDRESS_REGISTRY_ADDRESS,
          functionName: 'verifyAddress',
          args: [roleHash, userData.address, uniqueHash],
        });

        // Wait for the transaction to be mined
        while (!isReceiptSuccess) {
          if (isWaiting) {
            console.log("Waiting for transaction to be mined...");
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before checking again
          } else {
            break;
          }
        }

        if (isReceiptSuccess) {
          console.log("Transaction mined successfully:", receipt);
          
          // Now that the transaction is mined, check if the address is verified
          await refetchIsVerified();
          
          if (!isVerifiedData) {
            throw new Error('Address verification failed');
          }
          
          console.log("Address verified successfully");
        } else {
          throw new Error('Transaction failed or was not mined');
        }

      } catch (verifyError) {
        throw new Error(`Failed to verify address: ${(verifyError as Error).message}`);
      }

      // Step 3: Grant role based on user's role
      try {
        if (userData.role.toLowerCase() === 'doctor') {
          writeContract({
            abi: RoleManager,
            address: ROLE_MANAGER_ADDRESS,
            functionName: 'registerAsDoctor',
          });
        } else if (userData.role.toLowerCase() === 'patient') {
          await writeContract({
            abi: RoleManager,
            address: ROLE_MANAGER_ADDRESS,
            functionName: 'registerAsPatient',
          });
        } else {
          throw new Error('Unsupported role');
        }
      } catch (roleError) {
        throw new Error(`Failed to grant role: ${(roleError as Error).message}`);
      }

      return {
        success: true,
        message: 'User registered and role granted successfully',
        roleHash,
        uniqueHash,
      };
    } catch (error) {
      setError((error as Error).message);
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  };

  return { signUp, error, isWaiting };
}