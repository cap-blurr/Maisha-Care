import { publicClient } from './viemclient.js';

export async function callContractFunction(contractAddress, abi, functionName, ...args) {
    const { request } = await publicClient.simulateContract({
      address: contractAddress,
      abi: abi,
      functionName: functionName,
      args: [args]
    });
  
    return request;
}
