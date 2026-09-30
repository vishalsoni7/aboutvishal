import type { Flagship } from '../data/projects'
import styles from './SectionPlaceholder.module.css'

// Stand-in for the ATM (Phase 3) and Deploy (Phase 4) sections so anchors and h2s exist.
export default function SectionPlaceholder({ project }: { project: Flagship }) {
  return (
    <section
      id={project.id}
      className={`${styles.section} ${project.id === 'deploy' ? styles.flipped : ''}`}
      aria-labelledby={`${project.id}-title`}
    >
      <div className={styles.text}>
        <p className={`label ${styles.fig}`}>{project.fig}</p>
        <h2 id={`${project.id}-title`} className={styles.title}>
          {project.name}
        </h2>
      </div>
      <div className={styles.panel}>
        <span className="label">DEMO PLACEHOLDER</span>
      </div>
    </section>
  )
}
