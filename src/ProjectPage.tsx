import AtmSection from './components/AtmSection'
import Contact from './components/Contact'
import Crosshair from './components/Crosshair'
import DeploySection from './components/DeploySection'
import Footer from './components/Footer'
import Header from './components/Header'
import { flagships, projectPage, type Flagship } from './data/projects'
import styles from './ProjectPage.module.css'

// A flagship project on its own URL (/projects/<slug>/), so it can be found and shared on its own.
export default function ProjectPage({ id }: { id: Flagship['id'] }) {
  const project = flagships.find((p) => p.id === id)!
  return (
    <div id="top" className="page">
      <Header />
      <main>
        <a href="/" className={`label ${styles.back}`}>
          {projectPage.back}
        </a>
        {id === 'atm' ? (
          <AtmSection project={project} standalone />
        ) : (
          <DeploySection project={project} standalone />
        )}
        <Contact />
      </main>
      <Footer />
      <Crosshair />
    </div>
  )
}
