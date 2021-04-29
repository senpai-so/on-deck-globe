import React from 'react'
import { createContainer } from 'unstated-next'
import { useDisclosure } from '@chakra-ui/react'
import { User } from 'lib/types'

function useGlobe() {
  const [users, setUsers] = React.useState<User[]>([])
  const [focusedUser, setFocusedUser] = React.useState<User>(null)
  const infoModal = useDisclosure()

  return {
    users,
    setUsers,

    focusedUser,
    setFocusedUser,

    infoModal
  }
}

export const Globe = createContainer(useGlobe)
