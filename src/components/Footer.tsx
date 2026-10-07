import { footer } from '../data/profile'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {footer.map((cell) => (
        <span key={cell} className={styles.cell}>
          {cell}
        </span>
      ))}
    </footer>
  )
}
