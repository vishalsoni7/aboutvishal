import { hero } from '../data/profile'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.intro}>
        <p className="label label-accent">{hero.label}</p>
        <h1 id="hero-title" className={styles.title}>
          {hero.headline.map((line, i) => (
            <span key={i} className={styles.line}>
              {line.map((part) =>
                'accent' in part ? (
                  <span key={part.text} className={styles.accent}>
                    {part.text}
                  </span>
                ) : (
                  part.text
                ),
              )}{' '}
            </span>
          ))}
        </h1>
        <p className={styles.lede}>{hero.intro}</p>
      </div>

      <div className={styles.spec}>
        <dl className={styles.specList}>
          {hero.spec.map((row) => (
            <div key={row.label} className={styles.specRow}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
        <a
          href={hero.resume.href}
          className={`btn btn-primary ${styles.resume}`}
          target="_blank"
          rel="noreferrer"
        >
          {hero.resume.label}
        </a>
      </div>
    </section>
  )
}
