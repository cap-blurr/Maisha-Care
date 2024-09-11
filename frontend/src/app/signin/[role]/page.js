'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'
import styles from '../signin.module.css'

export default function SignIn({ params }) {
  const router = useRouter()
  const { isAuthenticated, isLoading, address, userRole } = useAuth()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      router.push('/')
      return
    }

    if (!userRole) {
      router.push('/registration')
      return
    }

    if (params.role !== userRole) {
      setError(`You are registered as a ${userRole}. Redirecting to the correct signin page.`)
      setTimeout(() => router.push(`/signin/${userRole}`), 3000)
      return
    }

    setError(null)
  }, [isAuthenticated, isLoading, userRole, params.role, router,address])

  const handleSignIn = async () => {
    setIsSigningIn(true)
    try {
      // Here you would typically call your smart contract to sign in the user
      await new Promise(resolve => setTimeout(resolve, 2000))
      router.push(`/dashboard/${userRole}`)
    } catch (error) {
      console.error('Sign in error:', error)
      setError('Failed to sign in. Please try again.')
    } finally {
      setIsSigningIn(false)
    }
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sign In as {userRole}</h1>
      {error && <p className={styles.error}>{error}</p>}
      {!error && (
        <>
          <p className={styles.address}>Wallet Address: {address}</p>
          <button 
            className={styles.signInButton}
            onClick={handleSignIn} 
            disabled={isSigningIn}
          >
            {isSigningIn ? 'Signing In...' : 'Sign In'}
          </button>
        </>
      )}
    </div>
  )
}