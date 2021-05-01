export const earth = {
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
}

export const weather = {
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

        gl_FragColor = vec4(diffuse, intensity * 0.5);
      }
    `
}

export const atmosphere = {
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

export const particles = {
  uniforms: {
    tSprite: { type: 't', value: null }
  },
  vertexShader: `
    attribute float size;
    varying vec3 vColor;

    void main() {
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (1.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform sampler2D tSprite;
    varying vec3 vColor;

    void main() {
      gl_FragColor = vec4(vColor, 1.0);
      gl_FragColor = gl_FragColor * texture2D(tSprite, gl_PointCoord);
    }
  `
}
