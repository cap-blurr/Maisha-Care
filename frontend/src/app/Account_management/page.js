'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'
import Navbar from '../components/Navbar'
import styles from './AccountManagement.module.css'

export default function AccountManagement() {
  const router = useRouter()
  const { isAuthenticated, isRegistered, userRole } = useAuth()

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Instead of clearRole, we need to implement a new function to handle account deletion
      // This should interact with the smart contract to remove the user's role
      // For now, we'll just redirect to the registration page
      router.push('/registration')
    }
  }

  if (!isAuthenticated || !isRegistered) {
    router.push('/')
    return null
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.title}>Account Management</h1>
        <div className={styles.accountManagement}>
          <h2>Delete Account</h2>
          <button 
            className={styles.deleteButton}
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
          <p className={styles.warning}>
            Warning: This will remove your role and you&apos;ll need to register again.
          </p>
        </div>
      </main>
    </div>
  )
}