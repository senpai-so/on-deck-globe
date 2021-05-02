import React from 'react'
import GoogleMapReact from 'google-map-react'

import { googleMapsApiKey } from 'lib/config'
import { Globe } from 'state/globe'

import { UserMarker } from './UserMarker'
import { mapStyles } from './map-styles'

const googleMapOptions = {
  styles: mapStyles,
  minZoom: 6,
  fullscreenControl: false
}

const googleMapsKey = { key: googleMapsApiKey }

export const GoogleMap: React.FC = () => {
  const {
    getUsersInBounds,
    focusedUser,
    setFocusedUser,
    isGlobeMode,
    center,
    setCenter
  } = Globe.useContainer()

  const [zoom, setZoom] = React.useState(9)
  const [bounds, setBounds] = React.useState({
    nw: { lat: 90, lng: -180 },
    ne: { lat: 90, lng: 180 },
    se: { lat: -90, lng: 180 },
    sw: { lat: -90, lng: -180 }
  })

  const onChildClick = React.useCallback(
    (event, child) => {
      setFocusedUser(child.user)
    },
    [setFocusedUser]
  )

  const onChange = React.useCallback(
    ({ center, zoom, bounds }) => {
      setCenter(center)
      setZoom(zoom)
      setBounds(bounds)
    },
    [setCenter, setZoom, setBounds]
  )

  React.useEffect(() => {
    if (focusedUser) {
      setCenter({ lat: focusedUser.lat, lng: focusedUser.lng })
    }
  }, [focusedUser, setCenter])

  // const userMarkerStyle = React.useMemo(() => {
  //   const scale = Math.max(0.1, Math.min(1, zoom > 9 ? 1 : (zoom - 3) / 9))

  //   return {
  //     transform: `scale(${scale}, ${scale})`
  //   }
  // }, [zoom])

  const users = getUsersInBounds(bounds)

  return (
    <GoogleMapReact
      bootstrapURLKeys={googleMapsKey}
      center={center}
      zoom={zoom}
      hoverDistance={40}
      options={googleMapOptions}
      onChildClick={onChildClick}
      onChange={onChange}
    >
      {isGlobeMode
        ? null
        : users.map((user) => {
            return (
              <UserMarker
                key={user.userId}
                lat={user.lat}
                lng={user.lng}
                user={user}
              />
            )
          })}
    </GoogleMapReact>
  )
}
