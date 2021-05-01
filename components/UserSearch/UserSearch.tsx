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
  const { globeRef, users } = Globe.useContainer()

  const onClickZoomToGoSelection = React.useCallback(
    (lat: number, lng: number) => {
      globeRef.current?.zoom(500)
      globeRef.current?.goToLocation(lat, lng)
    },
    [globeRef]
  )

  const onUserSelection = (event: React.ChangeEvent, value: User) => {
    // Jump to location and zoom in
    if (value) {
      onClickZoomToGoSelection(value.lat, value.lng)
    }
  }

  return (
    <div className={styles.search}>
      <UserSearchCombo users={users} onClick={onUserSelection} />
    </div>
  )
}
