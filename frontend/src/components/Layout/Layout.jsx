import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navigation from '../Navigation/Navigation.jsx'
import LanguageSwitcher from '../Language/LanguageSwitcher.jsx'
import OceanBackground from '../Ocean/OceanBackground.jsx'
import ParticleSystem from '../Ocean/ParticleSystem.jsx'
import { useOcean } from '../../contexts/OceanContext.jsx'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { particlesEnabled } = useOcean()

  return (
    <div className="layout">
      {/* Static Dark Blue Background */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #000814 0%, #001d3d 50%, #000000 100%)',
          zIndex: -2
        }}
      />
      
      {/* Enhanced Particle System */}
      {particlesEnabled && <ParticleSystem />}
      
      {/* Floating Navigation */}
      <Navigation 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      
      {/* Language Switcher */}
      <LanguageSwitcher />
      
      {/* Main Content with Smooth Transitions */}
      <motion.main 
        className="main-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ 
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.main>
      
      {/* Enhanced Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Layout
