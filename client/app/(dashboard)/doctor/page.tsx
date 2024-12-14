"use client";

import { verifyABI } from "@/abi/verify-abi";
import DashboardAdmin from "@/components/dashboard/DashboardAdmin";
import PatientTableContainer from "@/components/patient-table/patient-table-container";
import React from "react";
import { useReadContract } from "wagmi";

const Doctor = () => {
  // Using React.useCallback for the read contract configuration
  const readConfig = React.useMemo(() => ({
    abi: verifyABI,
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3" as `0x${string}`,
    functionName: "isVerified",
    args: [
      "0xec03945fa2196716a09674e2cd6a57153479ecb05ea91e189e2688f793ab5381",
      "0xBd41795def27c74870364e2e1Ed9aC7A4166A68A",
    ],
  }), []); // Empty dependency array since values don't change

  const { data, isError, isLoading } = useReadContract(readConfig);

  // Add error handling
  React.useEffect(() => {
    if (isError) {
      console.error("Error reading contract:", isError);
      // Add your error handling logic here
    }
  }, [isError]);

  // Add loading state UI
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  // Uncomment and modify the write contract logic when needed
  /*
  const { writeContract } = useWriteContract({
    abi: verifyABI,
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    functionName: "yourWriteFunction",
  });

  const handleWrite = async () => {
    try {
      const tx = await writeContract({ args: [] });
      console.log("Transaction:", tx);
    } catch (err) {
      console.error("Error writing to contract:", err);
    }
  };
  */

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardAdmin />
      <PatientTableContainer />

    </div>
  );
};

export default Doctor;