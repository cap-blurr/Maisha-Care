"use client";

import { useAccount, useConnect, useDisconnect, useReadContract } from "wagmi";
import { VerifiedAddressRegistry } from "../../abi/VerifiedAddressRegistry";
import { VERIFIED_ADDRESS_REGISTRY_ADDRESS } from "../../constants";
import { useSignUp } from "../../hooks/useSignUp";

function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { signUp } = useSignUp();

  const { data: isVerifiedData, refetch: refetchIsVerified } = useReadContract({
    address: VERIFIED_ADDRESS_REGISTRY_ADDRESS,
    abi: VerifiedAddressRegistry,
    functionName: "isVerified",
    args: [
      "0xec03945fa2196716a09674e2cd6a57153479ecb05ea91e189e2688f793ab5381",
      "0xBd41795def27c74870364e2e1Ed9aC7A4166A68A",
    ],
  });

  console.log("verifiedData:", isVerifiedData);

  const handleClick = () => {
    signUp({
      role: "patient",
      address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      formData: {
        name: "Anthony Kimani ",
        dateOfBirth: "2024-10-31",
        nationalID: "3456782",
      },
    });
  };

  return (
    <>
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === "connected" && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>

        <button onClick={() => handleClick()}>signup</button>
      </div>
    </>
  );
}

export default App;
