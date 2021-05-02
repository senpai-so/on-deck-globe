import React from 'react'

import { Globe } from 'state/globe'
import { User } from 'lib/types'

import UserSearchCombo from './UserSearchCombo'
import styles from './styles.module.css'

/**
 * Search component for filtering the Users by Name.
 * Selecting a user will jump to its position
 */
export const UserSearch = () => {
  const { users, setFocusedUser } = Globe.useContainer()
  const [hasMounted, setHasMounted] = React.useState(false)

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  const onUserSelection = React.useCallback(
    (event: React.ChangeEvent, user: User) => {
      // Jump to location and zoom in
      if (user) {
        setFocusedUser(user)
      }
    },
    [setFocusedUser]
  )

  if (!hasMounted) {
    return null
  }

  return (
    <div className={styles.search}>
      <UserSearchCombo users={users} onClick={onUserSelection} />
    </div>
  )
}
