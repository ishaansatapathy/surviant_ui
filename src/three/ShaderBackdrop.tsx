import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const vertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

// Domain-warped fbm in the brand blues, with a soft vignette and fine grain.
const fragment = /* glsl */ `
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uPointer;
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  vec2 p = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0) * 1.7;
  float t = uTime * 0.05;

  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(
    fbm(p + 3.2 * q + vec2(1.7, 9.2) + t * 1.4 + uPointer * 0.25),
    fbm(p + 3.2 * q + vec2(8.3, 2.8) - t * 1.1)
  );
  float f = fbm(p + 2.6 * r);

  // Near-black base with cold silver smoke drifting through it.
  vec3 black = vec3(0.027, 0.027, 0.031);
  vec3 graphite = vec3(0.075, 0.075, 0.085);
  vec3 smoke = vec3(0.42, 0.43, 0.47);
  vec3 silver = vec3(0.82, 0.83, 0.86);

  vec3 col = mix(black, graphite, smoothstep(0.2, 0.7, f));
  col = mix(col, smoke, smoothstep(0.55, 0.95, f * (1.0 - uv.y * 0.6)) * 0.35);
  col = mix(col, silver, smoothstep(0.74, 0.98, f * r.x * 1.7) * 0.22);

  col *= 1.0 - 0.35 * length(uv - vec2(0.5, 0.2));
  col += (hash(uv * uResolution + fract(uTime)) - 0.5) * 0.03;
  gl_FragColor = vec4(col, 1.0);
}
`

const pointer = new THREE.Vector2()

function Flow() {
  const material = useRef<THREE.ShaderMaterial>(null!)
  const { size } = useThree()
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2() },
    }),
    [],
  )

  useFrame((state, delta) => {
    const u = material.current.uniforms
    u.uTime.value += Math.min(delta, 1 / 20)
    u.uResolution.value.set(size.width, size.height)
    pointer.lerp(state.pointer, 0.04)
    u.uPointer.value.copy(pointer)
  })

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={material} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} />
    </mesh>
  )
}

export function ShaderBackdrop({ active }: { active: boolean }) {
  return (
    <Canvas frameloop={active ? 'always' : 'never'} dpr={[1, 1.5]} gl={{ antialias: false }}>
      <Flow />
    </Canvas>
  )
}
