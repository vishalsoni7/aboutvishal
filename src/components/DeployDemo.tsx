import { useState } from 'react'
import { deployDemo as copy, demoBranches } from '../data/projects'
import styles from './DeployDemo.module.css'

type State = 0 | 1 | 2 // 0 shipped, 1 needs cherry-pick, 2 staging only
const STATUS_CLASS = [styles.shipped, styles.pending, styles.staging]

// Rows that start as "needs cherry-pick" toggle between pending and shipped; others are fixed.
export default function DeployDemo() {
  const [states, setStates] = useState<State[]>(() => demoBranches.map((b) => b.state))
  const pending = states.filter((s) => s === 1).length

  const toggle = (i: number) =>
    setStates((prev) =>
      prev.map((s, j) => (j !== i || demoBranches[i].state !== 1 ? s : s === 1 ? 0 : 1)),
    )

  return (
    <div className={styles.panel}>
      <div className={styles.head}>
        <span className={styles.headLabel}>{copy.header}</span>
        <span
          className={pending ? styles.pending : styles.shipped}
          role="status"
          aria-live="polite"
        >
          {pending ? copy.pending(pending) : copy.allClear}
        </span>
      </div>

      <ul className={styles.rows}>
        {demoBranches.map((branch, i) => {
          const state = states[i]
          const togglable = branch.state === 1
          const action = !togglable
            ? copy.actions.none
            : state === 1
              ? copy.actions.pick
              : copy.actions.undo
          return (
            <li key={branch.name}>
              <button
                type="button"
                className={`${styles.row} ${togglable ? '' : styles.fixed}`}
                aria-disabled={!togglable || undefined}
                onClick={() => togglable && toggle(i)}
              >
                <span className={styles.branch}>{branch.name}</span>
                <span className={`${styles.status} ${STATUS_CLASS[state]}`}>
                  <span className={styles.dot} aria-hidden="true" />
                  {copy.status[state]}
                </span>
                <span className={styles.action} aria-hidden={!togglable || undefined}>
                  {action}
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <p className={styles.caption}>{copy.caption}</p>
    </div>
  )
}
