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
            {line}{' '}
          </span>
        ))}
      </h2>
      <div className={styles.actions}>
        <a
          href={contact.email.href}
          className={`btn btn-primary ${styles.btn}`}
          aria-label={contact.email.ariaLabel}
          title={contact.email.ariaLabel}
        >
          {contact.email.label}
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
