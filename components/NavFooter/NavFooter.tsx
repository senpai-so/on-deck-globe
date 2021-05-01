import React from 'react'
import Link from 'next/link'
import cs from 'classnames'
import { FaTwitter, FaGithub } from 'react-icons/fa'

import styles from './styles.module.css'

export const NavFooter: React.FC = () => {
  const sections = [
    {
      title: 'Site',
      key: 'site',
      links: [
        {
          title: 'Globe',
          href: '/'
        },
        {
          title: 'About',
          href: '/about'
        }
      ].filter(Boolean)
    }
  ]

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={cs(styles.section)}>
          <Link href='/'>
            <a className={styles.brand}>
              <img
                className={styles.logo}
                src='/icon.png'
                alt='On Deck Globe'
              />
              On Deck Globe
            </a>
          </Link>
        </div>

        {sections.map((section) => (
          <div
            key={section.key}
            className={cs(styles.section, styles[section.key])}
          >
            <h3>{section.title}</h3>

            <div className={styles.links}>
              {section.links.map((link) => (
                <div key={link.title}>
                  <Link href={link.href}>
                    <a title={link.title} className={styles.link}>
                      {link.title}
                    </a>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div key='socials' className={cs(styles.section, styles.socials)}>
          <h3>Socials</h3>

          <div className={styles.social}>
            <a
              className={styles.twitter}
              href='https://twitter.com/ondeckglobe'
              title='Twitter @ondeckglobe'
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaTwitter size={24} />
            </a>

            <a
              className={styles.github}
              href='https://github.com/senpai-so/on-deck-globe'
              title='GitHub'
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaGithub size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
