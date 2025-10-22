import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sky, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { useOcean } from '../../contexts/OceanContext.jsx'

const OceanPlane = ({ position = [0, 0, 0] }) => {
  const meshRef = useRef()
  const { waveIntensity, isUnderwater } = useOcean()

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime()
      meshRef.current.material.uniforms.time.value = time * waveIntensity
      
      // Add gentle floating motion
      meshRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.1
      meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.05
    }
  })

  const waterMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        waveIntensity: { value: waveIntensity },
        color: { value: new THREE.Color(isUnderwater ? 0x001d3d : 0x003566) },
        opacity: { value: isUnderwater ? 0.9 : 0.7 },
        caustics: { value: isUnderwater ? 1.0 : 0.0 }
      },
      vertexShader: `
        uniform float time;
        uniform float waveIntensity;
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          vUv = uv;
          vPosition = position;
          vNormal = normal;
          
          vec3 pos = position;
          
          // Multiple wave layers for realistic water
          pos.y += sin(pos.x * 2.0 + time) * 0.15 * waveIntensity;
          pos.y += sin(pos.z * 1.5 + time * 0.8) * 0.12 * waveIntensity;
          pos.y += sin(pos.x * 3.0 + pos.z * 2.0 + time * 1.2) * 0.08 * waveIntensity;
          pos.y += sin(pos.x * 0.5 + pos.z * 0.3 + time * 0.3) * 0.2 * waveIntensity;
          
          // Add caustic-like distortions
          pos.x += sin(pos.z * 2.0 + time * 1.5) * 0.05;
          pos.z += cos(pos.x * 2.0 + time * 1.3) * 0.05;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform float opacity;
        uniform float caustics;
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          vec2 uv = vUv;
          
          // Create realistic wave patterns
          float wave1 = sin(uv.x * 15.0 + time * 2.0) * 0.5 + 0.5;
          float wave2 = sin(uv.y * 12.0 + time * 1.5) * 0.5 + 0.5;
          float wave3 = sin((uv.x + uv.y) * 8.0 + time * 2.5) * 0.5 + 0.5;
          float wave4 = sin((uv.x - uv.y) * 6.0 + time * 1.8) * 0.5 + 0.5;
          
          float combinedWave = (wave1 + wave2 + wave3 + wave4) / 4.0;
          
          // Create depth and caustic effects
          float depth = 1.0 - (vPosition.y + 1.0) / 2.0;
          
          // Caustic light patterns
          float causticPattern = 0.0;
          if (caustics > 0.5) {
            causticPattern = sin(uv.x * 20.0 + time * 3.0) * sin(uv.y * 20.0 + time * 2.5);
            causticPattern = abs(causticPattern) * 0.5 + 0.5;
          }
          
          // Mix colors based on depth and waves
          vec3 deepColor = vec3(0.0, 0.1, 0.2);
          vec3 surfaceColor = vec3(0.0, 0.4, 0.8);
          vec3 causticColor = vec3(0.0, 0.8, 1.0);
          
          vec3 finalColor = mix(deepColor, surfaceColor, combinedWave);
          finalColor = mix(finalColor, causticColor, causticPattern * 0.3);
          finalColor = mix(finalColor, color, 0.7);
          
          // Add subtle glow
          float glow = sin(time * 2.0 + uv.x * 10.0) * 0.1 + 0.9;
          finalColor *= glow;
          
          gl_FragColor = vec4(finalColor, opacity);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    })
  }, [waveIntensity, isUnderwater])

  return (
    <mesh ref={meshRef} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[200, 200, 128, 128]} />
      <primitive object={waterMaterial} />
    </mesh>
  )
}

const FloatingParticles = () => {
  const particlesRef = useRef()
  const particleCount = 500
  const { isUnderwater } = useOcean()

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200
      positions[i * 3 + 1] = Math.random() * 40 - 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.05
      velocities[i * 3 + 1] = Math.random() * 0.02 + 0.01
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.05
      
      // Bioluminescent colors
      const color = new THREE.Color()
      if (isUnderwater) {
        color.setHSL(0.5 + Math.random() * 0.2, 0.8, 0.6)
      } else {
        color.setHSL(0.6 + Math.random() * 0.1, 0.7, 0.8)
      }
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
      
      sizes[i] = Math.random() * 0.2 + 0.05
    }
    
    return { positions, velocities, colors, sizes }
  }, [isUnderwater])

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array
      const velocities = particles.velocities
      const time = state.clock.getElapsedTime()
      
      for (let i = 0; i < particleCount; i++) {
        // Add wave-like motion
        positions[i * 3] += velocities[i * 3] + Math.sin(time + i * 0.1) * 0.01
        positions[i * 3 + 1] += velocities[i * 3 + 1] + Math.cos(time + i * 0.15) * 0.005
        positions[i * 3 + 2] += velocities[i * 3 + 2] + Math.sin(time + i * 0.12) * 0.01
        
        // Reset particles that go too far
        if (positions[i * 3 + 1] > 30) {
          positions[i * 3 + 1] = -20
        }
        if (Math.abs(positions[i * 3]) > 100) {
          positions[i * 3] = (Math.random() - 0.5) * 200
        }
        if (Math.abs(positions[i * 3 + 2]) > 100) {
          positions[i * 3 + 2] = (Math.random() - 0.5) * 200
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={particles.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={particles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color={isUnderwater ? "#00ffff" : "#0080ff"}
        transparent
        opacity={0.8}
        sizeAttenuation
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

const OceanBackground = () => {
  const { isUnderwater } = useOcean()

  return (
    <div className="ocean-background">
      <Canvas
        camera={{ position: [0, isUnderwater ? -5 : 10, 10], fov: 75 }}
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}
        shadows
      >
        {/* Enhanced Lighting */}
        <ambientLight intensity={isUnderwater ? 0.2 : 0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={isUnderwater ? 0.3 : 0.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        {/* Caustic Light Effects */}
        <pointLight
          position={[0, 15, 0]}
          color={isUnderwater ? "#00ffff" : "#0080ff"}
          intensity={isUnderwater ? 0.5 : 0.3}
          distance={100}
          decay={2}
        />
        
        <pointLight
          position={[-20, 10, -20]}
          color={isUnderwater ? "#00ff80" : "#0066ff"}
          intensity={0.2}
          distance={80}
        />
        
        <pointLight
          position={[20, 8, 20]}
          color={isUnderwater ? "#ff4081" : "#0044aa"}
          intensity={0.2}
          distance={80}
        />
        
        {/* Environment */}
        {!isUnderwater && (
          <Sky
            distance={450000}
            sunPosition={[0, 1, 0]}
            inclination={0.49}
            azimuth={0.25}
          />
        )}
        
        {/* Multiple Ocean Layers */}
        <OceanPlane position={[0, 0, 0]} />
        <OceanPlane position={[0, -5, 0]} />
        <OceanPlane position={[0, -10, 0]} />
        
        {/* Floating Particles */}
        <FloatingParticles />
        
        {/* Underwater Environment */}
        {isUnderwater && (
          <Environment preset="night" />
        )}
        
        {/* Fog for depth */}
        <fog
          attach="fog"
          args={[isUnderwater ? "#000814" : "#001d3d", 10, 100]}
        />
      </Canvas>
      
      {/* Enhanced CSS Gradient Overlay */}
      <div 
        className={`ocean-overlay ${isUnderwater ? 'underwater' : 'surface'}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: isUnderwater 
            ? 'radial-gradient(ellipse at center, rgba(0, 8, 20, 0.3) 0%, rgba(0, 29, 61, 0.6) 50%, rgba(0, 0, 0, 0.8) 100%)'
            : 'radial-gradient(ellipse at center, rgba(0, 53, 102, 0.2) 0%, rgba(0, 20, 40, 0.4) 50%, rgba(0, 0, 0, 0.6) 100%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
    </div>
  )
}

export default OceanBackground
