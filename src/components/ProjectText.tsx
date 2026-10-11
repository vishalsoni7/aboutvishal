import type { ReactNode } from 'react'
import type { Flagship } from '../data/projects'
import styles from './ProjectText.module.css'

// Text column shared by the two flagship sections: label, title, blurb, bullets, stack chips.
// The title is an h2 on the home page and the page's h1 on the project's own page.
export default function ProjectText({
  project,
  accent = 'cyan',
  heading: Heading = 'h2',
  children,
}: {
  project: Flagship
  accent?: 'cyan' | 'orange'
  heading?: 'h1' | 'h2'
  children?: ReactNode
}) {
  return (
    <div className={styles.text}>
      <p className={`label ${styles[accent]}`}>{project.fig}</p>
      <Heading id={`${project.id}-title`} className={styles.title}>
        {project.name}
      </Heading>
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
