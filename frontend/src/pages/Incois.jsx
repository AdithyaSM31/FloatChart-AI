import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Globe, 
  RefreshCw, 
  ExternalLink, 
  AlertCircle,
  Maximize2,
  Minimize2,
  RotateCcw
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { useOcean } from '../contexts/OceanContext.jsx'
import toast from 'react-hot-toast'

const Incois = () => {
  const { t } = useLanguage()
  const { isUnderwater } = useOcean()
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [iframeKey, setIframeKey] = useState(0)

  const incoisUrl = 'https://incois.gov.in/OON/index.jsp'

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleIframeLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setHasError(true)
    toast.error(t('incois.error'))
  }

  const refreshPortal = () => {
    setIsLoading(true)
    setHasError(false)
    setIframeKey(prev => prev + 1)
    toast.success('Portal refreshed')
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const openInNewTab = () => {
    window.open(incoisUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={`incois-page ${isUnderwater ? 'underwater' : 'surface'} ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="incois-container">
        {/* Header */}
        <motion.div 
          className="incois-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="header-content">
            <div className="header-title">
              <Globe size={32} />
              <div className="title-text">
                <h1>{t('incois.title')}</h1>
                <p className="header-subtitle">{t('incois.subtitle')}</p>
              </div>
            </div>
            <div className="header-actions">
              <button 
                className="btn btn-secondary"
                onClick={refreshPortal}
                disabled={isLoading}
              >
                <RefreshCw className={isLoading ? 'loading-spinner' : ''} size={18} />
                {t('incois.refresh')}
              </button>
              <button 
                className="btn btn-secondary"
                onClick={openInNewTab}
              >
                <ExternalLink size={18} />
                Open in New Tab
              </button>
              <button 
                className="btn btn-secondary"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Portal Info */}
        <motion.div 
          className="portal-info"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="info-card">
            <div className="info-content">
              <h3>About INCOIS</h3>
              <p>
                The Indian National Centre for Ocean Information Services (INCOIS) provides 
                ocean information and advisory services to society, industry, government, 
                and scientific community through sustained ocean observations and constant 
                improvements through systematic and focused research.
              </p>
              <div className="info-features">
                <div className="feature-item">
                  <div className="feature-icon">🌊</div>
                  <span>Ocean Observations</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">📊</div>
                  <span>Data Services</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🔬</div>
                  <span>Research Support</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">⚡</div>
                  <span>Real-time Data</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Portal Container */}
        <motion.div 
          className="portal-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {isLoading && (
            <div className="loading-overlay">
              <motion.div
                className="loading-content"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <RefreshCw 
                  className="loading-spinner" 
                  size={48} 
                />
                <h3>{t('incois.loading')}</h3>
                <p>Connecting to INCOIS portal...</p>
              </motion.div>
            </div>
          )}

          {hasError && (
            <div className="error-overlay">
              <motion.div
                className="error-content"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <AlertCircle size={48} />
                <h3>Connection Error</h3>
                <p>{t('incois.error')}</p>
                <div className="error-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={refreshPortal}
                  >
                    <RotateCcw size={18} />
                    Try Again
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={openInNewTab}
                  >
                    <ExternalLink size={18} />
                    Open in New Tab
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          <div className="iframe-wrapper">
            <iframe
              key={iframeKey}
              src={incoisUrl}
              title="INCOIS Portal"
              className="incois-iframe"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
              allow="geolocation; microphone; camera"
            />
          </div>
        </motion.div>

        {/* Portal Controls */}
        <motion.div 
          className="portal-controls"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="controls-info">
            <div className="control-item">
              <div className="control-icon">🔄</div>
              <div className="control-text">
                <strong>Refresh:</strong> Reload the portal if content doesn't load properly
              </div>
            </div>
            <div className="control-item">
              <div className="control-icon">🔗</div>
              <div className="control-text">
                <strong>New Tab:</strong> Open INCOIS portal in a separate browser tab
              </div>
            </div>
            <div className="control-item">
              <div className="control-icon">⛶</div>
              <div className="control-text">
                <strong>Fullscreen:</strong> Expand the portal to full screen for better viewing
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Incois
