'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'
import PatientDashboard from '../patientdashboard'
import DoctorDashboard from '../doctordashboard'
import styles from '../dashboard.module.css'

export default function DashboardRouter({ params }) {
  const router = useRouter()
  const { isAuthenticated, isLoading, userRole } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/')
      } else if (userRole !== params.role) {
        router.push(`/dashboard/${userRole}`)
      }
    }
  }, [isAuthenticated, isLoading, userRole, params.role, router])

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>
  }

  if (!isAuthenticated || userRole !== params.role) {
    return null
  }

  const renderDashboard = () => {
    switch (userRole) {
      case 'patient':
        return <PatientDashboard />
      case 'doctor':
        return <DoctorDashboard />
      default:
        router.push('/404')
        return null
    }
  }

  return renderDashboard()
}