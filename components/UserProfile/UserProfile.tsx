import { Button } from '@chakra-ui/button'
import { User } from 'lib/types'
import React from 'react'
import Link from 'next/link'
import styles from './styles.module.css'

export const UserProfile = ({ user }: { user: User }) => {
  if (!user) return null

  console.log('user', user)

  return (
    <div className={styles.container}>
      {user.fellow && (
        <div>
          <div>Image</div>
          <div>Links</div>
        </div>
      )}

      {!user.fellow && (
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
