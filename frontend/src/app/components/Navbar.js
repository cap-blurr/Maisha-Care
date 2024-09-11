'use client'

import Link from 'next/link'
import { useAuth } from '../hooks/useAuth'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { userRole, clearRole } = useAuth()

  const handleSignOut = () => {
    clearRole()
    // Redirect to home page after signing out
    window.location.href = '/'
  }

  return (
    <nav className={styles.navbar}>
      <Link href={`/dashboard/${userRole}`}>Dashboard</Link>
      <Link href="/profile">Profile</Link>
      {userRole === 'patient' && (
        <Link href="/monetize-data">Monetize Data</Link>
      )}
      {userRole === 'doctor' && (
        <Link href="/enter-patient-data">Enter Patient Data</Link>
      )}
      <button className={styles.signOut} onClick={handleSignOut}>Sign Out</button>
    </nav>
  )
}