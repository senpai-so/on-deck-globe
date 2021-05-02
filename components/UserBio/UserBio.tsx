import React from 'react'
import cs from 'classnames'
import Linkify from 'react-linkify-twitter'

import { User } from 'lib/types'

import styles from './styles.module.css'

const decorateLink = (
  decoratedHref: string,
  decoratedText: string,
  key: number
) => (
  <a key={key} href={decoratedHref} target='_blank' rel='noopener noreferrer'>
    {decoratedText}
  </a>
)

export const UserBio = ({
  user,
  className
}: {
  user: User
  className?: string
}) => {
  return (
    <p className={cs(styles.bio, className)}>
      <Linkify componentDecorator={decorateLink}>{user.twitterBio}</Linkify>
    </p>
  )
}
