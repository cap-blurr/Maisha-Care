import { publicClient } from './viemclient.js';
import  VerifiedAddressRegistryJSON  from '../abis/VerifiedAddressRegistry.json' assert { type: 'json' };

const { abi } = VerifiedAddressRegistryJSON;

export async function retrieveMetadata(useraddress,function_name,contract_address) {
    const data = await publicClient.readContract({
      address: contract_address,
      abi: abi,
      functionName: function_name,
      args: [useraddress],
    });
  
    return data;
  }