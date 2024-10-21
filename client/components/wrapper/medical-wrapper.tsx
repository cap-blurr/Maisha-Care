import React, { useState } from 'react';
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from "@coinbase/onchainkit/transaction";
import type {
  TransactionError,
  TransactionResponse,
} from "@coinbase/onchainkit/transaction";
import {
  keccak256,
  type Address,
  type ContractFunctionParameters,
  toBytes,
} from "viem";

import { TEMPORARY_ACCESS_ADDRESS, HEALTH_RECORD_MANAGER_ADDRESS } from "../../constants";
import { TemporaryAccess } from '@/abi/TemporaryAccess';
import CryptoJS from 'crypto-js';
import { HealthRecordManager } from '@/abi/HealthRecordManager';

export type MedicalFormData = {
  currentHealth: {
    vitalSigns: {
      bloodPressureSystolic: string;
      bloodPressureDiastolic: string;
      heartRate: string;
      respiratoryRate: string;
      bodyTemperature: string;
      oxygenSaturation: string;
    };
    bodyMeasurements: {
      height: string;
      weight: string;
    };
    generalHealth: {
      generalAppearance: string;
      levelOfConsciousness: string;
      painScore: string;
    };
    currentSymptoms: {
      primaryComplaint: string;
      durationOfSymptoms: string;
      severityOfSymptoms: string;
    };
    currentMedications: Array<{ name: string; dosage: string; frequency: string }>;
    allergies: Array<{ allergy: string; severity: string }>;
    lifestyleFactors: {
      smokingStatus: string;
      alcoholConsumption: string;
      exerciseHabits: string;
      dietOverview: string;
    };
  };
  medicalHistory: {
    pastMedicalConditions: Array<{
      condition: string;
      yearDiagnosed: string;
      currentStatus: string;
    }>;
    surgicalHistory: Array<{ surgery: string; date: string; complications: string }>;
    familyMedicalHistory: Array<{ condition: string; relationship: string }>;
    immunizationRecords: Array<{ vaccination: string; dateAdministered: string }>;
    majorInjuries: Array<{
      description: string;
      dateOccurred: string;
      treatmentReceived: string;
    }>;
    chronicMedications: Array<{ medication: string; durationOfUse: string }>;
    pastHospitalizations: Array<{ reason: string; dateAndDuration: string }>;
    mentalHealthHistory: {
      diagnosedConditions: string;
      treatmentsReceived: string;
    };
    reproductiveHistory: {
      pregnancies: string;
      childbirthDetails: string;
    };
  };
  treatmentRecords: {
    visitInformation: {
      dateOfVisit: string;
      reasonForVisit: string;
      treatingPhysician: string;
    };
    diagnosis: {
      primaryDiagnosis: string;
      secondaryDiagnoses: string;
      icdCodes: string;
    };
    treatmentPlan: {
      prescribedMedications: Array<{
        medication: string;
        dosage: string;
        instructions: string;
      }>;
      nonPharmacologicalInterventions: string;
    };
    proceduresPerformed: Array<{ name: string; date: string; outcome: string }>;
    laboratoryTests: Array<{ test: string; results: string; dateOfResults: string }>;
    imagingStudies: Array<{ type: string; date: string; resultsSummary: string }>;
    referrals: Array<{ specialist: string; reasonForReferral: string }>;
    followUpInstructions: {
      nextAppointmentDate: string;
      specificInstructions: string;
    };
    progressNotes: string;
  };
};

export default function MedicalRecordWrapper({
  doctorAddress,
  patientAddress,
  formData,
}: {
  doctorAddress: Address;
  patientAddress: Address;
  formData: MedicalFormData;
}) {
  const [accessGranted, setAccessGranted] = useState(false);
  
  
  const encryptData = (data: MedicalFormData) => {
    const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'defaultSecretKey';
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  };

  const encryptedData = encryptData(formData);
  const dataHash = keccak256(toBytes(encryptedData));
  console.log("datahash:", dataHash, "patientAddress:", patientAddress);

  const requestAccessContract = {
    address: TEMPORARY_ACCESS_ADDRESS,
    abi: TemporaryAccess,
    functionName: "requestAccess",
    args: [patientAddress],
  } as unknown as ContractFunctionParameters;

  const addMedicalRecordContract = {
    address: HEALTH_RECORD_MANAGER_ADDRESS,
    abi: HealthRecordManager,
    functionName: "initiateCurrentHealthUpdate",
    args: [patientAddress, dataHash],
  } as unknown as ContractFunctionParameters;

  const handleError = (err: TransactionError) => {
    console.error("Transaction error:", err);
  };

  const handleSuccess = (response: TransactionResponse) => {
    console.log("Transaction successful", response);
    if (!accessGranted) {
      setAccessGranted(true);
    }
  };

  return (
    <div className="flex w-[450px] flex-col space-y-4">
      {!accessGranted ? (
        <Transaction
          contracts={[requestAccessContract]}
          chainId={84532}
          onError={handleError}
          onSuccess={handleSuccess}
        >
          <TransactionButton className="w-full max-w-full text-white bg-blue-500 hover:bg-blue-600 py-2 rounded" text='Request Access' />
          <TransactionStatus>
            <TransactionStatusLabel />
            <TransactionStatusAction />
          </TransactionStatus>
        </Transaction>
      ) : (
        <Transaction
          contracts={[addMedicalRecordContract]}
          chainId={84532}
          onError={handleError}
          onSuccess={handleSuccess}
        >
          <TransactionButton className="w-full max-w-full text-white bg-green-500 hover:bg-green-600 py-2 rounded" text='Add Medical Record' />
          <TransactionStatus>
            <TransactionStatusLabel />
            <TransactionStatusAction />
          </TransactionStatus>
        </Transaction>
      )}
    </div>
  );
}