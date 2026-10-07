import { projectCta, type Flagship } from '../data/projects'
import { externalProps } from '../lib/links'
import NearbyAtmsPreview from './NearbyAtmsPreview'
import ProjectText from './ProjectText'
import styles from './AtmSection.module.css'

export default function AtmSection({ project }: { project: Flagship }) {
  return (
    <section id={project.id} className={styles.section} aria-labelledby={`${project.id}-title`}>
      <div className={styles.text}>
        <ProjectText project={project}>
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
          </div>
        </ProjectText>
      </div>
      <div className={styles.visual}>
        <NearbyAtmsPreview />
      </div>
    </section>
  )
}
