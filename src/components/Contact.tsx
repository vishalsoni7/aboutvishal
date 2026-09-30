import { contact } from '../data/profile'
import { externalProps } from '../lib/links'
import styles from './Contact.module.css'

export default function Contact() {
  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-title">
      <p className="label label-accent">{contact.label}</p>
      <h2 id="contact-title" className={styles.title}>
        {contact.headline.map((line) => (
          <span key={line} className={styles.line}>
            {line}
          </span>
        ))}
      </h2>
      <div className={styles.actions}>
        <a href={`mailto:${contact.email}`} className={`btn btn-primary ${styles.btn}`}>
          {contact.email}
        </a>
        {contact.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`btn btn-ghost ${styles.btn}`}
            {...externalProps(link.href)}
          >
            {link.label}
          </a>
        ))}
      </div>
    </section>
  )
}
