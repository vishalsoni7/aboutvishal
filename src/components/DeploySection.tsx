import { projectCta, type Flagship } from '../data/projects'
import DeployDemo from './DeployDemo'
import ProjectText from './ProjectText'
import styles from './DeploySection.module.css'

export default function DeploySection({
  project,
  standalone = false,
}: {
  project: Flagship
  standalone?: boolean // on its own page: h1 title, no link to itself
}) {
  return (
    <section
      id={project.id}
      className={`${styles.section} ${standalone ? styles.standalone : ''}`}
      aria-labelledby={`${project.id}-title`}
    >
      <div className={styles.visual} data-redline="DeployDemo">
        <DeployDemo />
      </div>
      <div className={styles.text}>
        <ProjectText project={project} accent="orange" heading={standalone ? 'h1' : 'h2'}>
          {project.note && <p className={styles.note}>{project.note}</p>}
          {!standalone && (
            <div className={styles.actions}>
              <a href={project.page.path} className="btn btn-ghost">
                {projectCta.page}
              </a>
            </div>
          )}
        </ProjectText>
      </div>
    </section>
  )
}
