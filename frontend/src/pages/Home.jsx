import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  ArrowRight, 
  BarChart3, 
  MessageCircle, 
  Map, 
  Waves,
  Droplets,
  Thermometer,
  Compass
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { useOcean } from '../contexts/OceanContext.jsx'

const Home = () => {
  const { t } = useLanguage()
  const { isUnderwater, currentDepth } = useOcean()

  const features = [
    {
      icon: MessageCircle,
      title: t('nav.chat'),
      description: 'Ask questions about ocean data in natural language',
      link: '/chat',
      color: 'var(--neon-cyan)',
      glow: 'var(--shadow-neon)'
    },
    {
      icon: BarChart3,
      title: t('nav.dashboard'),
      description: 'View comprehensive ocean data analytics',
      link: '/dashboard',
      color: 'var(--bioluminescent)',
      glow: '0 0 20px rgba(0, 255, 128, 0.5)'
    },
    {
      icon: Map,
      title: t('nav.data'),
      description: 'Explore interactive ocean data visualizations',
      link: '/data',
      color: 'var(--coral-glow)',
      glow: '0 0 20px rgba(255, 64, 129, 0.5)'
    }
  ]

  return (
    <div className={`home-page ${isUnderwater ? 'underwater' : 'surface'}`}>
      {/* Hero Section */}
      <motion.section 
        className="hero"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content">
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Waves size={20} />
            <span>Ocean Data Intelligence</span>
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {t('home.title')}
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {t('home.subtitle')}
          </motion.p>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {t('home.description')}
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link to="/chat" className="btn btn-primary">
              {t('home.getStarted')}
              <ArrowRight size={20} />
            </Link>
            <Link to="/dashboard" className="btn btn-secondary">
              {t('home.exploreData')}
            </Link>
          </motion.div>
        </div>


      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="features-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.2, duration: 0.6 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  boxShadow: feature.glow
                }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="feature-icon" style={{ color: feature.color }}>
                  <Icon size={32} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <Link to={feature.link} className="feature-link">
                  Explore <ArrowRight size={16} />
                </Link>
              </motion.div>
            )
          })}
        </div>
      </motion.section>
    </div>
  )
}

export default Home
