"use client";

import { verifyABI } from "@/abi/verify-abi";
import DashboardAdmin from "@/components/dashboard/DashboardAdmin";
import PatientTableContainer from "@/components/patient-table/patient-table-container";
// import { config } from "@/config";
import React from "react";
import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi";

const Doctor = () => {
  // const {
  //   status,
  //   data: hash,
  //   writeContract,
  //   isPending,
  //   error,
  //   writeContractAsync,
  // } = useWriteContract({
  //   config,
  // });

  // const { isLoading: isConfirming, isSuccess: isConfirmed } =
  //   useWaitForTransactionReceipt({
  //     chainId: liskSepolia.id,
  //     hash,
  //   });

  // console.log({ isLoading: isConfirming, isSuccess: isConfirmed });

  const { data, isError, isLoading } = useReadContract({
    abi: verifyABI,
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    functionName: "isVerified",
    args: [
      "0xec03945fa2196716a09674e2cd6a57153479ecb05ea91e189e2688f793ab5381",
      "0xBd41795def27c74870364e2e1Ed9aC7A4166A68A",
      // "0xec03945fa2196716a09674e2cd6a57153479ecb05ea91e189e2688f793ab5381"
    ],
  });

  console.log("readContract Response:", { data, isError, isLoading });

  return (
    <div>
      <DashboardAdmin />
      <PatientTableContainer />
      <button>WriteContract</button>
    </div>
  );
};

export default Doctor;
