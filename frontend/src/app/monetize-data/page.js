'use client'

import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import Navbar from '../components/Navbar'
import styles from './monetizedata.module.css'

export default function MonetizeData() {
  const { address } = useAuth()
  const [isMonetized, setIsMonetized] = useState(false)

  const handleMonetizeData = () => {
    // Here you would implement the logic to monetize the data
    // For now, we'll just toggle the state
    setIsMonetized(!isMonetized)
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.title}>Monetize Your Data</h1>
        <p className={styles.description}>
          Click the button below to {isMonetized ? 'stop monetizing' : 'start monetizing'} your health data.
        </p>
        <button 
          className={styles.monetizeButton} 
          onClick={handleMonetizeData}
        >
          {isMonetized ? 'Stop Monetizing Data' : 'Monetize Data'}
        </button>
        {isMonetized && (
          <p className={styles.status}>Your data is currently being monetized.</p>
        )}
      </main>
    </div>
  )
}