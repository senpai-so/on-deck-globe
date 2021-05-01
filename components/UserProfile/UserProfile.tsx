import React from 'react'

import { FaTwitter, FaLinkedin } from 'react-icons/fa'

import { User } from 'lib/types'
import { Button } from '../Button/Button'
import styles from './styles.module.css'

export const UserProfile = ({ user }: { user: User }) => {
  if (!user) return null

  const userData = user.fellow

  return (
    <div className={styles.container}>
      {userData && (
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
        </React.Fragment>
      )}

      {!userData && (
        <div className={styles.notPublic}>
          This On Deck Fellow is not public yet.
        </div>
      )}

      <Button
        href={`https://community.beondeck.com/user/${user.userId}`}
        target='_blank'
        rel='noreferrer noopener'
      >
        View On Deck Profile
      </Button>
    </div>
  )
}