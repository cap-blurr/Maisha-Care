'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import RequestCard from '../components/RequestCard';
import styles from './dashboard.module.css';
import { useWatchContractEvent } from 'wagmi';
import TemporaryAccessABI from '../abis/TemporaryAccess.json';
// import { TEMPORARY_ACCESS_ADDRESS } from '../../config';

export default function PatientDashboard() {
  const { address } = useAuth();
  const [accessRequests, setAccessRequests] = useState([]);

  useWatchContractEvent({
    address: TEMPORARY_ACCESS_ADDRESS,
    abi: TemporaryAccessABI,
    eventName: 'AccessRequested',
    listener: (event) => {
      if (event.args.patient === address) {
        setAccessRequests((prev) => [...prev, event.args.doctor]);
      }
    },
  });

  const handleApprove = async (doctorAddress) => {
    // Implement approve access function
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.title}>Patient Dashboard</h1>
        <p className={styles.address}>Wallet Address: {address}</p>
        <h2>Access Requests</h2>
        {accessRequests.length > 0 ? (
          accessRequests.map((doctorAddress, index) => (
            <div key={index} className={styles.requestCard}>
              <p>Doctor Address: {doctorAddress}</p>
              <button onClick={() => handleApprove(doctorAddress)}>Approve</button>
            </div>
          ))
        ) : (
          <p>No access requests at this time.</p>
        )}
      </main>
    </div>
  );
}
