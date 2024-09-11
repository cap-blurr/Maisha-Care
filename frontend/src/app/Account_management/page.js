'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'
import Navbar from '../components/Navbar'
import styles from './AccountManagement.module.css'

export default function AccountManagement() {
  const router = useRouter()
  const { clearRole } = useAuth()

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      clearRole()
      router.push('/registration')
    }
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
            Warning: This will remove your role and you'll need to register again.
          </p>
        </div>
      </main>
    </div>
  )
}