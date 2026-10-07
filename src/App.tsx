import About from './components/About'
import AtmSection from './components/AtmSection'
import Contact from './components/Contact'
import Crosshair from './components/Crosshair'
import DeploySection from './components/DeploySection'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import PartsList from './components/PartsList'
import { flagships } from './data/projects'

export default function App() {
  return (
    <div id="top" className="page">
      <Header />
      <main>
        <Hero />
        {flagships.map((project) =>
          project.id === 'atm' ? (
            <AtmSection key={project.id} project={project} />
          ) : (
            <DeploySection key={project.id} project={project} />
          ),
        )}
        <PartsList />
        <About />
        <Contact />
      </main>
      <Footer />
      <Crosshair />
    </div>
  )
}
