'use client';

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import styles from './enterpatientdata.module.css';
import { useContract } from '../hooks/useContract';

export default function EnterPatientData() {
  const { address, isAuthenticated, isRegistered, userRole } = useAuth();
  const { initiateCurrentHealthUpdate } = useContract();
  const [formData, setFormData] = useState({
    patientAddress: '',
    diagnosis: '',
    treatment: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated || !isRegistered || userRole !== 'doctor') {
    return <div>Unauthorized access</div>;
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send data to backend to store on IPFS
      const response = await fetch('http://localhost:5000/api/store-data', {
        method: 'POST',
        body: JSON.stringify({ data: formData }),
        headers: { 'Content-Type': 'application/json' },
      });
      const { cid } = await response.json();
      // Initiate update on blockchain
      await initiateCurrentHealthUpdate(formData.patientAddress, cid);
      alert('Data update initiated.');
      setFormData({
        patientAddress: '',
        diagnosis: '',
        treatment: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Failed to submit data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.title}>Enter Patient Data</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            name="patientAddress"
            value={formData.patientAddress}
            onChange={handleInputChange}
            placeholder="Patient's Wallet Address"
            required
            className={styles.input}
          />
          <input
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleInputChange}
            placeholder="Diagnosis"
            required
            className={styles.input}
          />
          <input
            name="treatment"
            value={formData.treatment}
            onChange={handleInputChange}
            placeholder="Treatment"
            required
            className={styles.input}
          />
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Additional Notes"
            className={styles.textarea}
          />
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Patient Data'}
          </button>
        </form>
      </main>
    </div>
  );
}
