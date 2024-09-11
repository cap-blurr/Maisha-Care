'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import Navbar from '../components/Navbar'
import HospitalVisitsList from '../components/HospitalVisitsLists'
import styles from './dashboard.module.css'

export default function DoctorDashboard() {
  const { address } = useAuth()
  const [patientAddress, setPatientAddress] = useState('')
  const [patientVisits, setPatientVisits] = useState([])

  const handleInputChange = (e) => {
    setPatientAddress(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically fetch the patient's visits from your backend or smart contract
    // For now, we'll use mock data
    const mockVisits = [
      { date: '2023-05-15', reason: 'Annual checkup', doctor: 'Dr. Smith', notes: 'Patient is in good health.' },
      { date: '2023-03-02', reason: 'Flu symptoms', doctor: 'Dr. Johnson', notes: 'Prescribed antiviral medication.' },
    ]
    setPatientVisits(mockVisits)
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.title}>Doctor Dashboard</h1>
        <p className={styles.address}>Wallet Address: {address}</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            className={styles.input}
            type="text"
            value={patientAddress}
            onChange={handleInputChange}
            placeholder="Patient's Wallet Address"
            required
          />
          <button className={styles.submitButton} type="submit">View Patient History</button>
        </form>
        {patientVisits.length > 0 && <HospitalVisitsList visits={patientVisits} />}
      </main>
    </div>
  )
}