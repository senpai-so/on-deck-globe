import * as THREE from 'three'

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
        float intensity = pow(0.8 - dot(vNormal, vec3(0, 0, 1.0)), 12.0);
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0) * intensity;
      }
    `
  }
}

const worldImage = '/world.jpg'

export class ThreeGlobe {
  _camera: THREE.PerspectiveCamera
  _scene: THREE.Scene
  _renderer: THREE.WebGLRenderer
  _canvas: HTMLCanvasElement
  _globeMesh: THREE.Mesh
  _rafHandle?: number

  constructor({ canvas }: { canvas: HTMLCanvasElement }) {
    const width = canvas.width
    const height = canvas.height

    this._camera = new THREE.PerspectiveCamera(30, width / height, 1, 10000)
    this._camera.position.z = 1000

    this._scene = new THREE.Scene()

    const geometry = new THREE.SphereGeometry(200, 40, 30)

    {
      // base globe
      const shader = shaders.earth
      const uniforms = THREE.UniformsUtils.clone(shader.uniforms)

      uniforms.globe.value = THREE.ImageUtils.loadTexture(worldImage)

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
      // halo
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
      mesh.scale.set(1.1, 1.1, 1.1)
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

  render() {
    const distance = 1000
    const rotation = {
      x: 0,
      y: 0
    }

    this._camera.position.x =
      distance * Math.sin(rotation.x) * Math.cos(rotation.y)
    this._camera.position.y = distance * Math.sin(rotation.y)
    this._camera.position.z =
      distance * Math.cos(rotation.x) * Math.cos(rotation.y)

    this._camera.lookAt(this._globeMesh.position)

    this._renderer.render(this._scene, this._camera)
  }
}
