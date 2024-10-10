import { publicClient } from './viemclient.js';

export async function readContractFunction(contractAddress, abi, functionName, ...args) {
    const data = await publicClient.readContract({
      address: contractAddress,
      abi: abi,
      functionName: functionName,
      args: [args],
    });
  
    return data;
  }