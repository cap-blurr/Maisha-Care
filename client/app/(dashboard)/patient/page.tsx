import DashboardHero from '@/components/dashboard/DashboardHero'
import MedicalRecordTableContainer from '@/components/medical-record-table/medical-record-table-container'
import React from 'react'

const Patient = () => {
  return (
    <div>
      <DashboardHero />
      <MedicalRecordTableContainer />
    </div>
  )
}

export default Patient