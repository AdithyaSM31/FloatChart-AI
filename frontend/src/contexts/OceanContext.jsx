import React, { createContext, useContext, useState, useEffect } from 'react'

const OceanContext = createContext()

export const useOcean = () => {
  const context = useContext(OceanContext)
  if (!context) {
    throw new Error('useOcean must be used within an OceanProvider')
  }
  return context
}

export const OceanProvider = ({ children }) => {
  const [isUnderwater, setIsUnderwater] = useState(false)
  const [currentDepth, setCurrentDepth] = useState(0)
  const [waveIntensity, setWaveIntensity] = useState(1)
  const [particlesEnabled, setParticlesEnabled] = useState(true)
  const [ambientSound, setAmbientSound] = useState(false)

  const toggleUnderwater = () => {
    setIsUnderwater(!isUnderwater)
  }

  const setDepth = (depth) => {
    setCurrentDepth(Math.max(0, Math.min(100, depth)))
  }

  const adjustWaveIntensity = (intensity) => {
    setWaveIntensity(Math.max(0.1, Math.min(3, intensity)))
  }

  const toggleParticles = () => {
    setParticlesEnabled(!particlesEnabled)
  }

  const toggleAmbientSound = () => {
    setAmbientSound(!ambientSound)
  }

  const value = {
    isUnderwater,
    currentDepth,
    waveIntensity,
    particlesEnabled,
    ambientSound,
    toggleUnderwater,
    setDepth,
    adjustWaveIntensity,
    toggleParticles,
    toggleAmbientSound
  }

  return (
    <OceanContext.Provider value={value}>
      {children}
    </OceanContext.Provider>
  )
}
