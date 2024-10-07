'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import styles from '../form.module.css';

export default function Form({ params }) {
  const router = useRouter();
  const { address, setRole } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    specialization: '', // Only for doctors
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!params || !params.role) {
    return <div>Invalid route parameters</div>;
  }

  const isDoctor = params.role === 'doctor';

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Send form data to backend for verification, IPFS storage, and contract interaction
      const response = await fetch('http://localhost:5000/api/verify-and-store', {
        method: 'POST',
        body: JSON.stringify({ role: params.role, address, formData }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.success) {
        setRole(params.role);
        router.push(`/dashboard/${params.role}`);
      } else {
        setError(data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('An error occurred during verification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {isDoctor ? 'Doctor' : 'Patient'} Registration
      </h1>
      {error && <p className={styles.error}>{error}</p>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Full Name"
          required
          className={styles.input}
        />
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
          className={styles.input}
        />
        <input
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
          required
          className={styles.input}
        />
        {isDoctor && (
          <input
            name="specialization"
            value={formData.specialization}
            onChange={handleInputChange}
            placeholder="Specialization"
            required
            className={styles.input}
          />
        )}
        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Submitting...' : 'Register'}
        </button>
      </form>
    </div>
  );
}