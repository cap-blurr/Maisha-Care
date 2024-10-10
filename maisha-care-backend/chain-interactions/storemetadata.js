import { publicClient } from './viemclient.js';
import { VerifiedAddressRegistryJSON } from '../abis/VerifiedAddressRegistry.json' assert { type: 'json' };

const { abi } = VerifiedAddressRegistryJSON;

export async function storeMetadata(roleHash, useraddress,contractaddress, uniqueHash, account,function_name) {
  const { request } = await publicClient.simulateContract({
    address: contractaddress,
    abi: abi,
    functionName: function_name,
    args: [roleHash, useraddress, uniqueHash]
  });

  return request;
}