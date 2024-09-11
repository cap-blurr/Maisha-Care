'use client'

import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import Navbar from '../components/Navbar'
import styles from './enterpatientdata.module.css'

export default function EnterPatientData() {
  const { address } = useAuth()
  const [patientData, setPatientData] = useState({
    patientAddress: '',
    diagnosis: '',
    treatment: '',
    notes: ''
  })

  const handleInputChange = (e) => {
    setPatientData({ ...patientData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would implement the logic to submit the patient data
    console.log('Submitting patient data:', patientData)
    // Reset form after submission
    setPatientData({
      patientAddress: '',
      diagnosis: '',
      treatment: '',
      notes: ''
    })
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.title}>Enter Patient Data</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="patientAddress"
            value={patientData.patientAddress}
            onChange={handleInputChange}
            placeholder="Patient's Wallet Address"
            required
            className={styles.input}
          />
          <input
            type="text"
            name="diagnosis"
            value={patientData.diagnosis}
            onChange={handleInputChange}
            placeholder="Diagnosis"
            required
            className={styles.input}
          />
          <input
            type="text"
            name="treatment"
            value={patientData.treatment}
            onChange={handleInputChange}
            placeholder="Treatment"
            required
            className={styles.input}
          />
          <textarea
            name="notes"
            value={patientData.notes}
            onChange={handleInputChange}
            placeholder="Additional Notes"
            className={styles.textarea}
          ></textarea>
          <button type="submit" className={styles.submitButton}>Submit Patient Data</button>
        </form>
      </main>
    </div>
  )
}