import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import PartsList from './components/PartsList'
import SectionPlaceholder from './components/SectionPlaceholder'
import { flagships } from './data/projects'

export default function App() {
  return (
    <div id="top" className="page">
      <Header />
      <main>
        <Hero />
        {flagships.map((project) => (
          <SectionPlaceholder key={project.id} project={project} />
        ))}
        <PartsList />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
