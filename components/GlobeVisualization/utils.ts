export const latLngToSpherical = ({
  lat,
  lng
}: {
  lat: number
  lng: number
}) => {
  const phi = ((90 - lat) * Math.PI) / 180
  const theta = ((180 - lng) * Math.PI) / 180

  return {
    phi,
    theta
  }
}

export const sphericalToWorld = ({
  phi,
  theta,
  radius = 1.0
}: {
  phi: number
  theta: number
  radius?: number
}) => {
  const x = radius * Math.sin(phi) * Math.cos(theta)
  const y = radius * Math.cos(phi)
  const z = radius * Math.sin(phi) * Math.sin(theta)

  return {
    x,
    y,
    z
  }
}
