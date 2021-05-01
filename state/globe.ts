import React from 'react'
import { createContainer } from 'unstated-next'
import { useDisclosure } from '@chakra-ui/react'
import { User } from 'lib/types'

import type { ThreeGlobe } from 'components/GlobeVisualization/ThreeGlobe'

function useGlobe() {
  const [users, setUsers] = React.useState<User[]>([])
  const [focusedUser, setFocusedUser] = React.useState<User>(null)
  const infoModal = useDisclosure()
  const globeRef = React.useRef<ThreeGlobe>(null)

  return {
    users,
    setUsers,

    focusedUser,
    setFocusedUser,

    globeRef,

    infoModal
  }
}

export const Globe = createContainer(useGlobe)
