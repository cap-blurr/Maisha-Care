import React, { useState } from 'react'
import styles from './HospitalVisitsList.module.css'

const HospitalVisitCard = ({ visit, onClick }) => (
  <div className={styles.card} onClick={() => onClick(visit)}>
    <h3>{visit.date}</h3>
    <p>{visit.reason}</p>
  </div>
)

const VisitDetailsModal = ({ visit, onClose }) => (
  <div className={styles.modal}>
    <div className={styles.modalContent}>
      <h2>Visit Details</h2>
      <p>Date: {visit.date}</p>
      <p>Reason: {visit.reason}</p>
      <p>Doctor: {visit.doctor}</p>
      <p>Notes: {visit.notes}</p>
      <button onClick={onClose}>Close</button>
    </div>
  </div>
)

export default function HospitalVisitsList({ visits }) {
  const [selectedVisit, setSelectedVisit] = useState(null)

  const handleCardClick = (visit) => {
    setSelectedVisit(visit)
  }

  const handleCloseModal = () => {
    setSelectedVisit(null)
  }

  return (
    <div className={styles.container}>
      <h2>Previous Hospital Visits</h2>
      <div className={styles.list}>
        {visits.map((visit, index) => (
          <HospitalVisitCard key={index} visit={visit} onClick={handleCardClick} />
        ))}
      </div>
      {selectedVisit && (
        <VisitDetailsModal visit={selectedVisit} onClose={handleCloseModal} />
      )}
    </div>
  )
}