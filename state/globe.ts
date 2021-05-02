import React from 'react'
import { createContainer } from 'unstated-next'
import { useDisclosure } from '@chakra-ui/react'
import { User } from 'lib/types'

import type { ThreeGlobe } from 'components/GlobeVisualization/ThreeGlobe'

function useGlobe() {
  const [users, setUsers] = React.useState<User[]>([])
  const [isGlobeMode, setGlobeMode] = React.useState(true)
  const [focusedUser, setFocusedUser] = React.useState<User>()
  const [hoveredUser, setHoveredUser] = React.useState<User>(null)
  const [filterPublicOnly, setFilterPublicOnly] = React.useState<boolean>(false)
  const infoModal = useDisclosure()
  const globeRef = React.useRef<ThreeGlobe>(null)

  const onSetFocusedUser = React.useCallback(
    (user?: User) => {
      setFocusedUser(user)

      if (user && globeRef.current) {
        globeRef.current.zoomTo(500)
        globeRef.current.goToLocation(user.lat, user.lng)
      }
    },
    [setFocusedUser, globeRef]
  )

  return {
    users,
    setUsers,

    focusedUser,
    setFocusedUser: onSetFocusedUser,

    hoveredUser,
    setHoveredUser,

    filterPublicOnly,
    setFilterPublicOnly,

    isGlobeMode,
    setGlobeMode,

    globeRef,

    infoModal
  }
}

export const Globe = createContainer(useGlobe)
