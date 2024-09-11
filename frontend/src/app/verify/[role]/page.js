'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'
import styles from '../verify.module.css'

export default function Verify({ params }) {
  const router = useRouter()
  const { isAuthenticated, isLoading, address } = useAuth()
  const [isVerifying, setIsVerifying] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  const handleVerify = async () => {
    setIsVerifying(true)
    // Here you would typically call your backend to initiate the verification process
    // For now, we'll simulate this with a timeout
    setTimeout(() => {
      router.push(`/form/${params.role}`)
    }, 2000)
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Verify as {params.role}</h1>
      <p className={styles.address}>Wallet Address: {address}</p>
      <button 
        className={styles.verifyButton} 
        onClick={handleVerify} 
        disabled={isVerifying}
      >
        {isVerifying ? 'Verifying...' : `Verify as ${params.role}`}
      </button>
    </div>
  )
}
