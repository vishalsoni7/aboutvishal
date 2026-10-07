import type { ReactNode } from 'react'
import type { Flagship } from '../data/projects'
import styles from './ProjectText.module.css'

// Text column shared by the two flagship sections: label, h2, blurb, bullets, stack chips.
export default function ProjectText({
  project,
  accent = 'cyan',
  children,
}: {
  project: Flagship
  accent?: 'cyan' | 'orange'
  children?: ReactNode
}) {
  return (
    <div className={styles.text}>
      <p className={`label ${styles[accent]}`}>{project.fig}</p>
      <h2 id={`${project.id}-title`} className={styles.title}>
        {project.name}
      </h2>
      <p className={styles.blurb}>{project.blurb}</p>
      <ul className={styles.points}>
        {project.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <ul className="chips" aria-label="Stack">
        {project.stack.map((tech) => (
          <li key={tech} className="chip">
            {tech}
          </li>
        ))}
      </ul>
      {children}
    </div>
  )
}
