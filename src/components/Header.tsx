import { header } from '../data/profile'
import { externalProps } from '../lib/links'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <a href="#top" className={styles.brand}>
        {header.brand}
      </a>
      <span className={styles.sheet}>{header.sheet}</span>
      <nav aria-label="Primary">
        <ul className={styles.nav}>
          {header.nav.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={styles.link} {...externalProps(link.href)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
