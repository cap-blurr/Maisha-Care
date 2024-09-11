import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

export function useAuth() {
  const { address, isConnected } = useAccount()
  const [userRole, setUserRole] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      if (isConnected && address) {
        setIsAuthenticated(true)
        const storedRole = localStorage.getItem(`userRole_${address}`)
        if (storedRole) {
          setUserRole(storedRole)
          setIsRegistered(true)
        } else {
          setIsRegistered(false)
        }
      } else {
        setIsAuthenticated(false)
        setIsRegistered(false)
        setUserRole(null)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [isConnected, address])

  const setRole = (role) => {
    setUserRole(role)
    localStorage.setItem(`userRole_${address}`, role)
    setIsRegistered(true)
  }

  const clearRole = () => {
    setUserRole(null)
    localStorage.removeItem(`userRole_${address}`)
    setIsRegistered(false)
  }

  return { isAuthenticated, isRegistered, isLoading, address, userRole, setRole, clearRole }
}