import { BufferGeometry } from 'three'

export class ParticleSystem {
  geometry: BufferGeometry
  particles: Particle[]
}

export class Particle {
  main: boolean

  lat: number
  lng: number

  phi0: number
  theta0: number
  radius0: number

  phi: number
  theta: number
  radius: number

  // acceleration: [number, number, number]
  // velocity: [number, number, number]
  size: number
  // age: number

  userId: string
  userIndex: number
}
