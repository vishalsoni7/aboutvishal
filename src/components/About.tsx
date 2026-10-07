import { about } from '../data/profile'
import styles from './About.module.css'

// One row per company: its roles on the left (a timeline when there's more than one),
// the skills used there on the right.
export default function About() {
  return (
    <section className={styles.section} aria-labelledby="log-title">
      <h2 id="log-title" className={`label ${styles.title}`}>
        {about.logTitle}
      </h2>
      <ol className={styles.companies}>
        {about.experience.map((company) => (
          <li key={company.name} className={styles.company}>
            <div className={styles.log}>
              <h3 className={styles.name}>{company.name}</h3>
              <p className={styles.location}>{company.location}</p>
              <ol className={styles.roles}>
                {company.roles.map((role) => (
                  <li
                    key={role.dates}
                    className={`${styles.role} ${role.current ? styles.current : ''}`}
                  >
                    <span className={styles.node} aria-hidden="true" />
                    <h4 className={styles.roleTitle}>{role.title}</h4>
                    <p className={styles.dates}>{role.dates}</p>
                    <p className={styles.type}>{role.type}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className={styles.materials}>
              <p className="label">{about.materialsTitle}</p>
              <ul className="chips" aria-label={`Skills used at ${company.name}`}>
                {company.skills.map((skill) => (
                  <li key={skill} className="chip">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
