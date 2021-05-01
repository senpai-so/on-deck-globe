import React from 'react'

import { Globe } from 'state/globe'
import UserSearchCombo from './UserSearchCombo'
import styles from './styles.module.css'
import { User } from 'lib/types'

/**
 * Search component for filtering the Users by Name.
 * Selecting a user will jump to its position
 */
export const UserSearch = () => {
  const { users, setFocusedUser } = Globe.useContainer()

  const onUserSelection = React.useCallback(
    (event: React.ChangeEvent, user: User) => {
      // Jump to location and zoom in
      if (user) {
        setFocusedUser(user)
      }
    },
    [setFocusedUser]
  )

  return (
    <div className={styles.search}>
      <UserSearchCombo users={users} onClick={onUserSelection} />
    </div>
  )
}
