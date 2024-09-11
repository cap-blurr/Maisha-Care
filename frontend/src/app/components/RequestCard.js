import styles from './RequestCard.module.css'

export default function RequestCard({ request, onAction }) {
  return (
    <div className={styles.card}>
      <p>Request from: {request.from}</p>
      <p>Type: {request.type}</p>
      <div className={styles.actions}>
        <button onClick={() => onAction(request.id, 'accept')}>Accept</button>
        <button onClick={() => onAction(request.id, 'decline')}>Decline</button>
      </div>
    </div>
  )
}