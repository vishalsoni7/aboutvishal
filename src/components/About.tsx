import { about } from '../data/profile'
import { skills } from '../data/skills'
import styles from './About.module.css'

export default function About() {
  return (
    <section className={styles.section} aria-label="About">
      <div className={styles.log}>
        <h2 className="label">{about.logTitle}</h2>
        <h3 className={styles.role}>{about.role}</h3>
        <p className={styles.dates}>{about.dates}</p>
        <p className={styles.summary}>{about.summary}</p>
      </div>
      <div className={styles.materials}>
        <h2 className="label">{about.materialsTitle}</h2>
        <ul className="chips">
          {skills.map((skill) => (
            <li key={skill} className="chip">
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
