import { projectCta, type Flagship } from '../data/projects'
import { externalProps } from '../lib/links'
import NearbyAtmsPreview from './NearbyAtmsPreview'
import ProjectText from './ProjectText'
import styles from './AtmSection.module.css'

export default function AtmSection({
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
      <div className={styles.text}>
        <ProjectText project={project} heading={standalone ? 'h1' : 'h2'}>
          <div className={styles.actions}>
            {project.codeUrl && (
              <a
                href={project.codeUrl}
                className="btn btn-primary"
                {...externalProps(project.codeUrl)}
              >
                {projectCta.code}
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                className="btn btn-ghost"
                {...externalProps(project.liveUrl)}
              >
                {projectCta.live}
              </a>
            )}
            {!standalone && (
              <a href={project.page.path} className="btn btn-ghost">
                {projectCta.page}
              </a>
            )}
          </div>
        </ProjectText>
      </div>
      <div className={styles.visual}>
        <NearbyAtmsPreview />
      </div>
    </section>
  )
}
