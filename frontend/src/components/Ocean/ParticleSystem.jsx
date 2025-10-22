import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useOcean } from '../../contexts/OceanContext.jsx'

const ParticleSystem = () => {
  const [particles, setParticles] = useState([])
  const { currentDepth, waveIntensity } = useOcean()

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = []
      const particleCount = Math.floor(50 + currentDepth * 2)
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 1,
          delay: Math.random() * 5,
          duration: Math.random() * 10 + 5,
          opacity: Math.random() * 0.6 + 0.2
        })
      }
      
      setParticles(newParticles)
    }

    generateParticles()
    
    const interval = setInterval(generateParticles, 10000)
    return () => clearInterval(interval)
  }, [currentDepth, waveIntensity])

  return (
    <div className="particle-system">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.random() * 10 - 5, 0],
            scale: [1, 1.2, 1],
            opacity: [particle.opacity, particle.opacity * 0.3, particle.opacity]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

export default ParticleSystem
