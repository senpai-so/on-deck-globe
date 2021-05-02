import React from 'react'

import { FaTwitter, FaLinkedin } from 'react-icons/fa'

import { signupLink } from 'lib/config'
import { User } from 'lib/types'
import { Globe } from 'state/globe'

import { Paper } from '../Paper/Paper'
import { Button } from '../Button/Button'
import styles from './styles.module.css'

export const UserProfile = ({ user }: { user: User }) => {
  const { isGlobeMode, onToggleGlobeMode } = Globe.useContainer()

  if (!user) return null

  const userData = user.fellow

  return (
    <div className={styles.container}>
      <Paper className={styles.content}>
        {userData ? (
          <React.Fragment>
            {userData.twitterId ? (
              <a
                className={styles.profileImages}
                href={`https://twitter.com/${userData.twitterId}`}
                title={`Twitter @${userData.twitterId}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                <img src={userData.imageUrl} />
              </a>
            ) : (
              userData.imageUrl && (
                <div className={styles.profileImages}>
                  <img src={userData.imageUrl} />
                </div>
              )
            )}

            {userData.twitterId ? (
              <div>
                <a
                  href={`https://twitter.com/${userData.twitterId}`}
                  title={`Twitter @${userData.twitterId}`}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <h3>{userData.name}</h3>
                </a>
              </div>
            ) : (
              <h3>{userData.name}</h3>
            )}

            {(userData.twitterId || (userData as any).linkedinId) && (
              <div className={styles.social}>
                {userData.twitterId && (
                  <a
                    className={styles.twitter}
                    href={`https://twitter.com/${userData.twitterId}`}
                    title={`Twitter @${userData.twitterId}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <FaTwitter size={24} />
                  </a>
                )}

                {userData.linkedinId && (
                  <a
                    className={styles.linkedin}
                    href={`https://linkedin.com/in/${userData.linkedinId}`}
                    title={`LinkedIn ${userData.name || userData.linkedinId}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <FaLinkedin size={24} />
                  </a>
                )}
              </div>
            )}

            <Button
              href={`https://community.beondeck.com/user/${user.userId}`}
              target='_blank'
              rel='noreferrer noopener'
              className={styles.button}
            >
              View On Deck Profile
            </Button>

            <Button onClick={onToggleGlobeMode} className={styles.button}>
              {isGlobeMode ? 'View on 2D Map' : 'View on 3D Globe'}
            </Button>
          </React.Fragment>
        ) : (
          <div className={styles.notPublic}>
            <p>
              This On Deck Fellow is private. If this is you, you can{' '}
              <a href={signupLink} target='_blank' rel='noreferrer noopener'>
                make your profile public here
              </a>
              .
            </p>

            <Button onClick={onToggleGlobeMode} className={styles.button}>
              {isGlobeMode ? 'View on 2D Map' : 'View on 3D Globe'}
            </Button>
          </div>
        )}
      </Paper>
    </div>
  )
}
