import React from 'react'
import cs from 'classnames'

import { User } from 'lib/types'
import { BlockImage } from '../BlockImage/BlockImage'

import styles from './styles.module.css'

const defaultProfileImageUrl = '/profile.png'

export const UserMarker: any = ({
  user,
  className,
  style,
  $hover
}: {
  user: User
  className?: string
  style?: any
  $hover?: boolean
}) => {
  return (
    <BlockImage
      src={user.fellow?.imageUrl || defaultProfileImageUrl}
      fallback={defaultProfileImageUrl}
      className={cs(
        styles.userMarker,
        className,
        $hover && styles.hover,
        user.isPublic && styles.public
      )}
      style={style}
    />
  )
}
