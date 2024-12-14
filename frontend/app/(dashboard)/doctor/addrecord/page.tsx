'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const AddMedicalRecordContent = dynamic(
  () => import('./AddMedicalRecordContent'),
  { 
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    )
  }
);

export default function AddMedicalRecordPage() {
  return <AddMedicalRecordContent />;
}