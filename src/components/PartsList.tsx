import { partsList } from '../data/profile'
import { parts } from '../data/projects'
import { externalProps } from '../lib/links'
import styles from './PartsList.module.css'

export default function PartsList() {
  return (
    <section className={styles.section} aria-labelledby="parts-title">
      <div className={styles.head}>
        <h2 id="parts-title" className="label">
          {partsList.title}
        </h2>
        <a
          href={partsList.inventory.href}
          className={styles.inventory}
          {...externalProps(partsList.inventory.href)}
        >
          {partsList.inventory.label}
        </a>
      </div>
      <ul className={styles.list}>
        {parts.map((part) => (
          <li key={part.code}>
            <a href={part.codeUrl} className={styles.row} {...externalProps(part.codeUrl)}>
              <span className={styles.code}>{part.code}</span>
              <span className={styles.name}>{part.name}</span>
              <span className={styles.desc}>{part.description}</span>
              <span className={styles.stack}>{part.stack} ↗</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
