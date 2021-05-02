import React from 'react'
import GoogleMapReact from 'google-map-react'

import { googleMapsApiKey } from 'lib/config'
import { Globe } from 'state/globe'

import { UserMarker } from './UserMarker'
import { mapStyles } from './map-styles'

const googleMapOptions = {
  styles: mapStyles,
  minZoom: 8,
  fullscreenControl: false
}

const googleMapsKey = { key: googleMapsApiKey }

const defaultCenter = {
  lng: -74.016915901860472,
  lat: 40.69555921429896
}

export const GoogleMap: React.FC = () => {
  const {
    users,
    focusedUser,
    setFocusedUser,
    isGlobeMode
  } = Globe.useContainer()
  const [center, setCenter] = React.useState(
    focusedUser
      ? {
          lat: focusedUser.lat,
          lng: focusedUser.lng
        }
      : defaultCenter
  )
  const [bounds, setBounds] = React.useState({
    nw: { lat: -90, lng: -180 },
    ne: { lat: 90, lng: -180 },
    se: { lat: 90, lng: 180 },
    sw: { lat: -90, lng: 180 }
  })

  const [zoom, setZoom] = React.useState(12)

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
            const { lat, lng } = user
            if (
              lat < bounds.sw.lat ||
              lat > bounds.ne.lat ||
              lng < bounds.nw.lng ||
              lng > bounds.se.lng
            ) {
              return null
            }

            return (
              <UserMarker key={user.userId} lat={lat} lng={lng} user={user} />
            )
          })}
    </GoogleMapReact>
  )
}
