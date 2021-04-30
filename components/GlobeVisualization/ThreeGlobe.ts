import * as THREE from 'three'

import { User } from 'lib/types'
import * as utils from './utils'

const shaders = {
  earth: {
    uniforms: {
      globe: { type: 't', value: null }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec2 vUv;
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vUv = uv;
      }
    `,
    fragmentShader: `
      uniform sampler2D globe;
      varying vec3 vNormal;
      varying vec2 vUv;
      void main() {
        vec3 diffuse = texture2D(globe, vUv).xyz;
        float intensity = 1.05 - dot(vNormal, vec3(0.0, 0.0, 1.0));
        vec3 atmosphere = vec3(1.0, 1.0, 1.0) * pow(intensity, 3.0);
        gl_FragColor = vec4(diffuse + atmosphere, 1.0);
      }
    `
  },
  weather: {
    uniforms: {
      weather: { type: 't', value: null }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec2 vUv;
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vUv = uv;
      }
    `,
    fragmentShader: `
      uniform sampler2D weather;
      varying vec3 vNormal;
      varying vec2 vUv;
      void main() {
        vec3 diffuse = texture2D(weather, vUv).xyz;
        float intensity = pow(dot(vNormal, vec3(0, 0, 1.0)), 2.0);
        float avg = (diffuse.x+diffuse.y+diffuse.z)/3.0;
        if (avg < 0.05 || intensity < 0.2) {
          discard;
        }

        gl_FragColor = vec4(diffuse, intensity);
      }
    `
  },
  atmosphere: {
    uniforms: {},
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.8 - dot(vNormal, vec3(0, 0, 1.0)), 8.0);
        gl_FragColor = vec4(0.5, 0.5, 0.5, 0.2) * intensity;
      }
    `
  }
}

const PI_HALF = Math.PI / 2

interface Vec2 {
  x: number
  y: number
}

// interface Callbacks {
//   onMouseDown: (event: MouseEvent) => void
//   onMouseMove: (event: MouseEvent) => void
//   onMouseUp: (event: MouseEvent) => void
//   onMouseOut: (event: MouseEvent) => void
//   onMouseWheel: (event: MouseEvent) => void
//   onDocumentKeyDown: (event: KeyboardEvent) => void
//   onWindowResize: (event: Event) => void
// }

export class ThreeGlobe {
  _camera: THREE.PerspectiveCamera
  _scene: THREE.Scene
  _renderer: THREE.WebGLRenderer
  _canvas: HTMLCanvasElement
  _globeMesh: THREE.Mesh
  _rafHandle?: number

  _mouse?: Vec2
  _mouseOnDown?: Vec2
  _rotation: Vec2
  _target: Vec2
  _targetOnDown?: Vec2

  _distance = 100000
  _distanceTarget = 100000
  _curZoomSpeed = 0
  _mouseDown = false

  _users: User[]

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

    const geometry = new THREE.SphereGeometry(200, 120, 120)
    const textureLoader = new THREE.TextureLoader()

    {
      // base globe
      const shader = shaders.earth
      const uniforms = THREE.UniformsUtils.clone(shader.uniforms)

      const worldImage = '/world2-opt.jpg'
      uniforms.globe.value = textureLoader.load(worldImage)

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

      const weatherImage = '/weather-opt.jpg'
      const uniforms = THREE.UniformsUtils.clone(shader.uniforms)
      uniforms.weather.value = textureLoader.load(weatherImage)

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
    this._zoom(event.nativeEvent.wheelDeltaY * 0.3)
    return false
  }

  onDocumentKeyDown(event: KeyboardEvent) {
    switch (event.keyCode) {
      case 38:
        this._zoom(100)
        event.preventDefault()
        break
      case 40:
        this._zoom(-100)
        event.preventDefault()
        break
    }
  }

  _zoom(delta) {
    this._distanceTarget -= delta
    this._distanceTarget = Math.max(350, Math.min(1000, this._distanceTarget))
  }

  render() {
    this._zoom(this._curZoomSpeed)

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
