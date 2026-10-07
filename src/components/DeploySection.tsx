import type { Flagship } from '../data/projects'
import DeployDemo from './DeployDemo'
import ProjectText from './ProjectText'
import styles from './DeploySection.module.css'

export default function DeploySection({ project }: { project: Flagship }) {
  return (
    <section id={project.id} className={styles.section} aria-labelledby={`${project.id}-title`}>
      <div className={styles.visual}>
        <DeployDemo />
      </div>
      <div className={styles.text}>
        <ProjectText project={project} accent="orange">
          {project.note && <p className={styles.note}>{project.note}</p>}
        </ProjectText>
      </div>
    </section>
  )
}
