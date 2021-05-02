import React from 'react'
import { createContainer } from 'unstated-next'
import { useDisclosure } from '@chakra-ui/react'
import { User } from 'lib/types'

import type { ThreeGlobe } from 'components/GlobeVisualization/ThreeGlobe'

const defaultCenter = {
  lng: -74.016915901860472,
  lat: 40.69555921429896
}

function useGlobe() {
  const [users, setUsers] = React.useState<User[]>([])

  const [isGlobeMode, setGlobeMode] = React.useState(true)
  const [focusedUser, setFocusedUser] = React.useState<User>()
  const [center, setCenter] = React.useState(defaultCenter)

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

  const getUsersInBounds = React.useCallback(
    (bounds: any) => {
      return users.filter((user) => {
        const { lat, lng } = user
        if (
          lat < bounds.sw.lat ||
          lat > bounds.ne.lat ||
          lng < bounds.nw.lng ||
          lng > bounds.se.lng
        ) {
          return false
        }

        return true
      })
    },
    [users]
  )

  const onToggleGlobeMode = React.useCallback(() => {
    setGlobeMode((isGlobeMode) => {
      if (isGlobeMode) {
        const center = globeRef.current?.getCenterLatLng()
        console.log('map mode', center)

        if (center) {
          // TODO: if there are no users in bounds, then zoom out
          setCenter(center)
        }
      }

      return !isGlobeMode
    })
  }, [setGlobeMode, setCenter])

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
    onToggleGlobeMode,

    center,
    setCenter,

    getUsersInBounds,

    globeRef,

    infoModal
  }
}

export const Globe = createContainer(useGlobe)
