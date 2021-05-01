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
        },
        {
          title: 'Stats',
          href: 'https://app.usefathom.com/share/psrvxdjz/ondeckglobe.com',
          target: '_blank',
          rel: 'noopener noreferrer'
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
              {section.links.map((link) => {
                const { title, href, ...rest } = link

                return (
                  <div key={title}>
                    <Link href={href}>
                      <a title={title} className={styles.link} {...rest}>
                        {title}
                      </a>
                    </Link>
                  </div>
                )
              })}
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
