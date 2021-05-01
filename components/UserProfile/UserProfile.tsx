import { Button } from '@chakra-ui/button'
import { User } from 'lib/types'
import React from 'react'
import Link from 'next/link'
import styles from './styles.module.css'

export const UserProfile = ({ user }: { user: User }) => {
  if (!user) return null

  const userData = user.fellow

  return (
    <div className={styles.container}>
      {userData && (
        <React.Fragment>
          <div className={styles.profileImages}>
            {userData.imageUrl && <img src={userData.imageUrl} />}
          </div>

          <div>{userData.name}</div>

          <div className={styles.links}>
            {userData.twitterId && (
              <div>
                <Link
                  href={'https://twitter.com/' + userData.twitterId}
                  passHref={true}
                >
                  TW
                </Link>
              </div>
            )}
            {userData.twitterId && (
              <div>
                <Link
                  href={'https://linkedin.com/in/' + userData.linkedinId}
                  passHref={true}
                >
                  LI
                </Link>
              </div>
            )}
            {userData.twitterId && (
              <div>
                <Link href={userData.personalUrl} passHref={true}>
                  PR
                </Link>
              </div>
            )}
          </div>
        </React.Fragment>
      )}

      {!userData && (
        <div className={styles.notPublic}>
          This user did not choose to be public yet!
        </div>
      )}

      <Link
        href={'https://community.beondeck.com/user/' + user.userId}
        passHref={true}
      >
        <Button
          bgGradient='linear(90.68deg, #b439df 0.26%, #e5337e 102.37%)'
          _hover={{
            background:
              'linear-gradient(90.68deg, #b439df 0.26%, #e5337e 102.37%)'
          }}
          color='#fff'
        >
          View User on On Deck
        </Button>
      </Link>
    </div>
  )
}
