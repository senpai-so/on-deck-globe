import * as THREE from 'three'
import random from 'random'

import { User } from 'lib/types'
import * as utils from './utils'
import * as shaders from './shaders'
import { Particle, ParticleSystem } from './particle'

const PI_HALF = Math.PI / 2

interface Vec2 {
  x: number
  y: number
}

export class ThreeGlobe {
  _camera: THREE.PerspectiveCamera
  _scene: THREE.Scene
  _renderer: THREE.WebGLRenderer
  _canvas: HTMLCanvasElement
  _globeMesh: THREE.Mesh
  _particles: THREE.Group
  _raycaster: THREE.Raycaster

  _rafHandle?: number

  _mouse?: Vec2
  _mouseOnDown?: Vec2
  _rotation: Vec2
  _target: Vec2
  _targetOnDown?: Vec2

  _distance = 100000
  _distanceTarget = 1000
  _curZoomSpeed = 0
  _mouseDown = false
  _radius = 200

  _users: User[]

  _updateParticles: () => void

  constructor({
    canvas,
    users = []
  }: {
    canvas: HTMLCanvasElement
    users?: User[]
  }) {
    const width = canvas.width
    const height = canvas.height

    this._users = users

    this._mouse = { x: 0, y: 0 }
    this._mouseOnDown = { x: 0, y: 0 }
    this._rotation = { x: 0, y: 0 }
    this._target = { x: (Math.PI * 3) / 2, y: Math.PI / 6.0 }
    this._targetOnDown = { x: 0, y: 0 }

    this._camera = new THREE.PerspectiveCamera(30, width / height, 1, 10000)
    this._camera.position.z = this._distance

    this._scene = new THREE.Scene()
    this._raycaster = new THREE.Raycaster()

    const geometry = new THREE.SphereGeometry(this._radius, 120, 120)
    const textureLoader = new THREE.TextureLoader()

    {
      // base globe
      const shader = shaders.earth
      const uniforms = THREE.UniformsUtils.clone(shader.uniforms)
      uniforms.globe.value = textureLoader.load('/world2-opt.jpg')

      const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader
      })

      const mesh = new THREE.Mesh(geometry, material)
      mesh.rotation.y = Math.PI
      this._globeMesh = mesh
      this._scene.add(mesh)
    }

    {
      // weather
      const shader = shaders.weather
      const uniforms = THREE.UniformsUtils.clone(shader.uniforms)
      uniforms.weather.value = textureLoader.load('/weather-opt.jpg')

      const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      })

      const mesh = new THREE.Mesh(geometry, material)
      mesh.scale.set(1.01, 1.01, 1.01)
      this._scene.add(mesh)
    }

    {
      // atmosphere
      const shader = shaders.atmosphere
      const uniforms = THREE.UniformsUtils.clone(shader.uniforms)

      const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      })

      const mesh = new THREE.Mesh(geometry, material)
      mesh.scale.set(1.2, 1.2, 1.2)
      this._scene.add(mesh)
    }

    this._renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    })
    this._renderer.setClearColor(0x000000, 0)
    this._renderer.setPixelRatio(window.devicePixelRatio)

    this.resize(width, height)
  }

  setUsers(users: User[]) {
    this._users = users

    // user particles
    const numUsers = users.length
    const numParticlesPerUser = 30
    const particleSystems: ParticleSystem[] = []
    const particles = new THREE.Group()
    // const numParticles = numUsers * numParticlesPerUser

    // position
    // velocity
    // age
    // size
    // color

    const sprite = new THREE.TextureLoader().load('/disc.png')
    // const material = new THREE.PointsMaterial({
    //   size: 10,
    //   map: sprite,
    //   color: new THREE.Color('lightblue'),
    //   blending: THREE.AdditiveBlending,
    //   depthTest: true,
    //   depthWrite: false,
    //   transparent: true,
    //   sizeAttenuation: true,
    //   visible: true
    // })

    const material = new THREE.ShaderMaterial({
      uniforms: {
        tSprite: {
          value: sprite
        }
      },
      vertexShader: shaders.particles.vertexShader,
      fragmentShader: shaders.particles.fragmentShader,
      blending: THREE.AdditiveBlending,
      depthTest: true,
      depthWrite: false,
      transparent: true,
      vertexColors: true
    })

    const color = new THREE.Color()

    for (let i = 0; i < numUsers; ++i) {
      const user = users[i]
      const { lat, lng } = user
      if (!(lat && lng)) {
        continue
      }

      const { phi, theta } = utils.latLngToSpherical({ lat, lng })
      const particleSystem = new ParticleSystem()
      particleSystem.particles = []
      const vertices = []
      const colors = []
      const sizes = []

      for (let j = 0; j < numParticlesPerUser; ++j) {
        const particle = new Particle()
        particle.main = j === 0
        particle.lat = lat
        particle.lng = lng
        particle.phi0 = phi
        particle.theta0 = theta
        particle.radius0 = this._radius
        particle.userId = user.id
        particle.userIndex = i
        particleSystem.particles.push(particle)

        spawnParticle(particleSystem, particleSystem.particles.length - 1)

        const x =
          particle.radius * Math.sin(particle.phi) * Math.cos(particle.theta)
        const y = particle.radius * Math.cos(particle.phi)
        const z =
          particle.radius * Math.sin(particle.phi) * Math.sin(particle.theta)

        vertices.push(x, y, z)

        color.setHSL(
          (particle.lng + random.float(-5, 5) + 180) / 360,
          1.0,
          0.75
        )
        colors.push(color.r, color.g, color.b)

        sizes.push(particle.size)
      }

      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(vertices, 3).setUsage(
          THREE.DynamicDrawUsage
        )
      )

      geometry.setAttribute(
        'color',
        new THREE.Float32BufferAttribute(colors, 3)
      )
      geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))
      particleSystem.geometry = geometry
      particleSystems.push(particleSystem)

      const points = new THREE.Points(particleSystem.geometry, material)
      points.userData.userIndex = i
      particles.add(points)
    }

    function spawnParticle(particleSystem: ParticleSystem, index: number) {
      const particle = particleSystem.particles[index]
      if (particle.main) {
        particle.radius = particle.radius0 + 2
        particle.phi = particle.phi0
        particle.theta = particle.theta0
        particle.size = 20
        return
      }

      particle.age = random.int(80, 200)
      particle.acceleration = [
        random.float(-0.0000001, 0.0000001),
        random.float(-0.0000001, 0.0000001),
        random.float(0.000000001, 0.000001)
      ]
      particle.velocity = [
        random.float(-0.000001, 0.000001),
        random.float(-0.000001, 0.000001),
        random.float(0.000001, 0.0001)
      ]
      particle.size = random.float(1, 10)

      const r = particle.radius0 + random.float(0, 2)
      const phi = particle.phi0 + random.float(-0.001, 0.001) // horizontal
      const theta = particle.theta0 + random.float(-0.001, 0.001) // vertical
      particle.phi = phi
      particle.theta = theta
      particle.radius = r
    }

    function updateParticles() {
      for (const particleSystem of particleSystems) {
        const vertices = particleSystem.geometry.attributes.position
          .array as Float32Array
        const sizes = particleSystem.geometry.attributes.size
          .array as Float32Array

        for (let i = 0; i < particleSystem.particles.length; ++i) {
          const particle = particleSystem.particles[i]
          if (!particle.main) {
            particle.acceleration[0] += random.float(-0.0000001, 0.0000001)
            particle.acceleration[1] += random.float(-0.0000001, 0.0000001)
            particle.acceleration[2] += random.float(-0.00000001, 0.000001)

            particle.velocity[0] += particle.acceleration[0]
            particle.velocity[1] += particle.acceleration[1]
            particle.velocity[2] += particle.acceleration[2]

            particle.phi += particle.velocity[0]
            particle.theta += particle.velocity[1]
            particle.radius += particle.velocity[2]

            const x =
              particle.radius *
              Math.sin(particle.phi) *
              Math.cos(particle.theta)
            const y = particle.radius * Math.cos(particle.phi)
            const z =
              particle.radius *
              Math.sin(particle.phi) *
              Math.sin(particle.theta)

            vertices[3 * i + 0] = x
            vertices[3 * i + 1] = y
            vertices[3 * i + 2] = z

            sizes[i] = particle.size * (Math.min(25, particle.age) / 25)

            if (particle.age-- <= 0) {
              spawnParticle(particleSystem, i)
            }
          }
        }

        particleSystem.geometry.attributes.position.needsUpdate = true
        particleSystem.geometry.attributes.size.needsUpdate = true
      }
    }

    this._updateParticles = updateParticles

    if (this._particles) {
      this._scene.remove(this._particles)
    }

    this._particles = particles
    this._scene.add(this._particles)
  }

  resize = (width: number, height: number) => {
    this._camera.aspect = width / height
    this._camera.updateProjectionMatrix()
    this._renderer.setSize(width, height)
  }

  destroy() {
    if (this._rafHandle) {
      cancelAnimationFrame(this._rafHandle)
      this._rafHandle = null
    }
  }

  animate() {
    if (this._updateParticles) {
      this._updateParticles()
    }

    this.render()
    this._rafHandle = requestAnimationFrame(this.animate.bind(this))
  }

  onMouseDown(event) {
    event.preventDefault()

    this._mouseDown = true

    this._mouseOnDown.x = -event.clientX
    this._mouseOnDown.y = event.clientY

    this._targetOnDown.x = this._target.x
    this._targetOnDown.y = this._target.y
  }

  getUserAtMouse(event): User | null {
    const x = (event.clientX / window.innerWidth) * 2 - 1
    const y = -(event.clientY / window.innerHeight) * 2 + 1
    const point = new THREE.Vector2(x, y)
    this._raycaster.setFromCamera(point, this._camera)
    const intersects = this._raycaster.intersectObject(this._particles, true)

    if (intersects.length > 0) {
      const res = intersects.filter((res) => res?.object)[0]

      if (res?.object) {
        return this._users[res.object.userData.userIndex]
      }
    }

    return null
  }

  onMouseMove = (event) => {
    if (!this._mouseDown) return

    this._mouse.x = -event.clientX
    this._mouse.y = event.clientY

    const zoomDamp = this._distance / 1000

    this._target.x =
      this._targetOnDown.x +
      (this._mouse.x - this._mouseOnDown.x) * 0.005 * zoomDamp
    this._target.y =
      this._targetOnDown.y +
      (this._mouse.y - this._mouseOnDown.y) * 0.005 * zoomDamp

    this._target.y = this._target.y > PI_HALF ? PI_HALF : this._target.y
    this._target.y = this._target.y < -PI_HALF ? -PI_HALF : this._target.y
  }

  onMouseUp() {
    this._mouseDown = false
  }

  onMouseOut() {
    this._mouseDown = false
  }

  onMouseWheel(event) {
    event.stopPropagation()
    event.preventDefault()
    this.zoom(event.wheelDeltaY * 0.3)
  }

  onDocumentKeyDown(event: KeyboardEvent) {
    switch (event.keyCode) {
      case 38:
        this.zoom(100)
        event.preventDefault()
        break
      case 40:
        this.zoom(-100)
        event.preventDefault()
        break
    }
  }

  zoom(delta?: number) {
    if (delta === undefined) {
      this._distanceTarget = 1000
    } else {
      this._distanceTarget -= delta
      this._distanceTarget = Math.max(350, Math.min(2000, this._distanceTarget))
    }
  }

  render() {
    this.zoom(this._curZoomSpeed)

    this._rotation.x += (this._target.x - this._rotation.x) * 0.1
    this._rotation.y += (this._target.y - this._rotation.y) * 0.1
    this._distance += (this._distanceTarget - this._distance) * 0.3

    const cameraPos = utils.sphericalToWorld({
      phi: this._rotation.x,
      theta: this._rotation.y,
      radius: this._distance
    })
    this._camera.position.x = cameraPos.x
    this._camera.position.y = cameraPos.y
    this._camera.position.z = cameraPos.z

    this._camera.lookAt(this._globeMesh.position)
    this._renderer.render(this._scene, this._camera)
  }
}
