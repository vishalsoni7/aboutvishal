import { header } from '../data/profile'
import { externalProps } from '../lib/links'
import Redlines from './Redlines'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header} data-redline="Header">
      <a href="/" className={styles.brand} aria-label={header.brand}>
        <span className={styles.brandFull}>{header.brand}</span>
        <span className={styles.brandShort}>{header.brandShort}</span>
      </a>
      <span className={styles.sheet}>{header.sheet}</span>
      <nav aria-label="Primary">
        <ul className={styles.nav}>
          {header.nav.map((link) => (
            <li key={link.href} className={link.mobile ? undefined : styles.desktopOnly}>
              <a href={link.href} className={styles.link} {...externalProps(link.href)}>
                {link.label}
              </a>
            </li>
          ))}
          <li className={`${styles.desktopOnly} ${styles.finePointer}`}>
            <Redlines />
          </li>
        </ul>
      </nav>
    </header>
  )
}
