import React from 'react'
import Link from 'next/link'

import styles from './styles.module.css'

export const NavHeader: React.FC<{ full?: boolean }> = () => {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <Link href='/'>
          <a className={styles.brand}>
            <img className={styles.logo} src='/icon.png' alt='On Deck Globe' />
            On Deck Globe
          </a>
        </Link>
      </div>

      <nav className={styles.nav}>
        <Link href='/about'>
          <a className={styles.link}>About</a>
        </Link>
      </nav>
    </header>
  )
}
