import DashboardAdmin from '@/components/dashboard/DashboardAdmin'
import PatientTableContainer from '@/components/patient-table/patient-table-container'
import React from 'react'

const Doctor = () => {
  return (
    <div>
      <DashboardAdmin />
      <PatientTableContainer />
    </div>
  )
}

export default Doctor