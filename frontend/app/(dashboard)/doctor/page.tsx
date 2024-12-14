'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const DoctorContent = dynamic(
  () => import('./DoctorContent'),
  { 
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 text-lg">Loading dashboard...</div>
      </div>
    )
  }
);

export default function DoctorPage() {
  return <DoctorContent />;
}