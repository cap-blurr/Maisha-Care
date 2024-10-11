"use client";

import { verifyABI } from "@/abi/verify-abi";
import DashboardAdmin from "@/components/dashboard/DashboardAdmin";
import PatientTableContainer from "@/components/patient-table/patient-table-container";
import React from "react";
import { useReadContract, useWriteContract } from "wagmi";

const Doctor = () => {
  const { writeContract } = useWriteContract();
  // const {readContract} = useReadContract()

  return (
    <div>
      <DashboardAdmin />
      <PatientTableContainer />
      <button
        onClick={()=>writeContract({
          abi: verifyABI,
          address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
          functionName: "verifyAddress",
          args: [
            "0xec03945fa2196716a09674e2cd6a57153479ecb05ea91e189e2688f793ab5381",
            "0xBd41795def27c74870364e2e1Ed9aC7A4166A68A",
            "0xec03945fa2196716a09674e2cd6a57153479ecb05ea91e189e2688f793ab5381"
          ],
        })}
      >WriteContract</button>
    </div>
  );
};

export default Doctor;
