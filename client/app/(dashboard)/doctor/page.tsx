"use client"

import { verifyABI } from '@/abi/verify-abi'
import DashboardAdmin from '@/components/dashboard/DashboardAdmin'
import PatientTableContainer from '@/components/patient-table/patient-table-container'
import React from 'react'
import { useReadContract } from 'wagmi'

const Doctor = () => {
  const { data, isError, isLoading } = useReadContract({
    abi: verifyABI,
    address: "0xBd41795def27c74870364e2e1Ed9aC7A4166A68A",
    functionName: 'isVerified',
    args: ["0xec03945fa2196716a09674e2cd6a57153479ecb05ea91e189e2688f793ab5381", "0xBd41795def27c74870364e2e1Ed9aC7A4166A68A"] 
  })

  console.log(data, isError, isLoading);
  
  return (
    <div>
      <DashboardAdmin />
      <PatientTableContainer />
    </div>
  )
}

export default Doctor