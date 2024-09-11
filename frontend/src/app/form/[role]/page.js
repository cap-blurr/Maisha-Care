'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'
import styles from '../form.module.css'

export default function Form({ params }) {
  const router = useRouter()
  const { address, setRole } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: '', // Only for doctors
  })

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Registration successful')
      setRole(params.role)
      console.log('Role set:', params.role)
      
      console.log('Redirecting to:', `/dashboard/${params.role}`)
      router.push(`/dashboard/${params.role}`)
    } catch (error) {
      console.error('Registration error:', error)
      // Handle error (e.g., show error message to user)
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{params.role === 'doctor' ? 'Doctor' : 'Patient'} Registration</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Full Name"
          required
          className={styles.input}
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
          className={styles.input}
        />
        {params.role === 'doctor' && (
          <input
            type="text"
            name="specialization"
            value={formData.specialization}
            onChange={handleInputChange}
            placeholder="Specialization"
            required
            className={styles.input}
          />
        )}
        <button type="submit" className={styles.submitButton}>Register</button>
      </form>
    </div>
  )
}