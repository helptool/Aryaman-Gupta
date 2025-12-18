import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useScroll, useVelocity, useSpring } from 'framer-motion';
import * as THREE from 'three';

// Vertex Shader: Standard full-screen quad setup
const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Fragment Shader: Liquid Metal (Optimized)
const fragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uScrollVelocity;

varying vec2 vUv;

// Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Fractal Brownian Motion - Optimized (3 iterations instead of 4)
float fbm(vec2 x) {
  float v = 0.0;
  float a = 0.5;
  vec2 shift = vec2(100.0);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
  for (int i = 0; i < 3; ++i) { // Reduced from 4 to 3 for performance
    v += a * snoise(x);
    x = rot * x * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  
  float time = uTime * 0.05; 
  
  // Incorporate scroll velocity - damped
  float scrollDistortion = uScrollVelocity * 0.0001;

  // --- FLUID SIMULATION ---
  vec2 q = vec2(
    fbm(uv + vec2(0.0, 0.0) + time + scrollDistortion),
    fbm(uv + vec2(5.2, 1.3) + time + scrollDistortion * 0.5)
  );

  vec2 r = vec2(
    fbm(uv + 4.0 * q + vec2(1.7, 9.2) + 0.15 * time),
    fbm(uv + 4.0 * q + vec2(8.3, 2.8) + 0.126 * time)
  );

  float f = fbm(uv + 4.0 * r);

  // Fluid Color Mixing
  vec3 colorBg = vec3(0.059, 0.059, 0.063); // #0F0F10
  vec3 colorMid = vec3(0.25, 0.25, 0.26);   
  vec3 colorLight = vec3(0.9, 0.88, 0.85);  // #E7E2D9

  vec3 fluidColor = mix(colorBg, colorMid, smoothstep(0.0, 0.7, f));
  float specular = smoothstep(0.8, 0.95, f) * 0.8;
  fluidColor = mix(fluidColor, colorLight, specular);
  
  vec3 finalColor = fluidColor;

  // Vignette
  float vignette = smoothstep(1.5, 0.5, length(vUv - 0.5));
  finalColor *= vignette;

  // --- INTERACTION ---
  float dist = distance(uv, uMouse);
  float mouseGlow = smoothstep(0.3, 0.0, dist) * 0.1;
  finalColor += vec3(mouseGlow);

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

// Bypass TypeScript checks for R3F elements by using aliases cast to any
const Mesh = 'mesh' as any;
const PlaneGeometry = 'planeGeometry' as any;
const ShaderMaterial = 'shaderMaterial' as any;

const FluidPlane = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  
  // Adjusted spring physics for smoother, less jittery response
  const smoothVelocity = useSpring(scrollVelocity, {
    stiffness: 10,  // Reduced from 15
    damping: 40,    // Increased from 30 to smooth out jitter
    mass: 1.0       // Increased mass
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uScrollVelocity: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    const { clock, pointer } = state;
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = clock.getElapsedTime();
      
      // Smoothly interpolate mouse to prevent jerky uniform updates
      material.uniforms.uMouse.value.lerp(new THREE.Vector2(pointer.x * 0.5 + 0.5, pointer.y * 0.5 + 0.5), 0.05);
      
      const rawVelocity = smoothVelocity.get();
      // Clamp velocity significantly to prevent shader blowouts
      const clampedVelocity = Math.max(Math.min(rawVelocity, 1000), -1000); 
      material.uniforms.uScrollVelocity.value = clampedVelocity;
    }
  });

  return (
    <Mesh ref={meshRef} scale={[2, 2, 1]}>
      <PlaneGeometry args={[1, 1, 16, 16]} />
      <ShaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </Mesh>
  );
};

const FluidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#0F0F10]">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 1.25]} // Capped at 1.25 for better mobile performance and less GPU load
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          alpha: false,
          stencil: false,
          depth: false
        }}
      >
        <FluidPlane />
      </Canvas>
    </div>
  );
};

export default FluidBackground;