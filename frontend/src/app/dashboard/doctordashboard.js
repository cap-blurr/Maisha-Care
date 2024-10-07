'use client';

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import styles from './dashboard.module.css';
import { useContract } from '../hooks/useContract';

export default function DoctorDashboard() {
  const { address } = useAuth();
  const { requestAccess } = useContract();
  const [patientAddress, setPatientAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setPatientAddress(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestAccess(patientAddress);
      alert('Access request sent.');
      setPatientAddress('');
    } catch (error) {
      console.error('Request access error:', error);
      alert('Failed to send access request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.title}>Doctor Dashboard</h1>
        <p className={styles.address}>Wallet Address: {address}</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            className={styles.input}
            name="patientAddress"
            value={patientAddress}
            onChange={handleInputChange}
            placeholder="Patient's Wallet Address"
            required
          />
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Requesting...' : 'Request Access'}
          </button>
        </form>
      </main>
    </div>
  );
}
