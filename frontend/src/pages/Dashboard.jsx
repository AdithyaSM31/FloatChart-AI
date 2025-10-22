import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Thermometer, 
  Droplets, 
  Compass,
  Waves,
  Activity,
  Clock,
  MapPin,
  RefreshCw
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { useOcean } from '../contexts/OceanContext.jsx'

const Dashboard = () => {
  const { t } = useLanguage()
  const { isUnderwater } = useOcean()
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      setIsLoading(true)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock dashboard data
      const mockData = {
        metrics: {
          temperature: { value: 22.5, unit: '°C', trend: '+0.3', change: 'up' },
          salinity: { value: 35.2, unit: 'PSU', trend: '0.0', change: 'stable' },
          depth: { value: 1250, unit: 'm', trend: '-5.2', change: 'down' },
          pressure: { value: 125.8, unit: 'dbar', trend: '+1.2', change: 'up' },
          oxygen: { value: 4.2, unit: 'ml/L', trend: '-0.1', change: 'down' },
          ph: { value: 8.1, unit: 'pH', trend: '+0.05', change: 'up' }
        },
        recentQueries: [
          { id: 1, query: 'Average temperature in Pacific Ocean', timestamp: '2 minutes ago', results: 1247 },
          { id: 2, query: 'Deepest measurements this month', timestamp: '15 minutes ago', results: 89 },
          { id: 3, query: 'Salinity levels near equator', timestamp: '1 hour ago', results: 234 },
          { id: 4, query: 'Oxygen concentration trends', timestamp: '2 hours ago', results: 567 }
        ],
        dataOverview: {
          totalFloats: 3892,
          activeFloats: 3247,
          totalMeasurements: 2847392,
          lastUpdate: new Date().toISOString(),
          coverage: {
            pacific: 45,
            atlantic: 32,
            indian: 15,
            arctic: 8
          }
        }
      }
      
      setDashboardData(mockData)
      setIsLoading(false)
    }

    loadDashboardData()
  }, [])

  const refreshData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  if (isLoading) {
    return (
      <div className={`dashboard-page ${isUnderwater ? 'underwater' : 'surface'}`}>
        <div className="loading-container">
          <motion.div
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <RefreshCw size={48} />
          </motion.div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`dashboard-page ${isUnderwater ? 'underwater' : 'surface'}`}>
      <div className="dashboard-container">
        {/* Header */}
        <motion.div 
          className="dashboard-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="header-content">
            <div className="header-title">
              <BarChart3 size={32} />
              <h1>{t('dashboard.title')}</h1>
            </div>
            <button 
              className="btn btn-secondary"
              onClick={refreshData}
              disabled={isLoading}
            >
              <RefreshCw size={18} />
              {t('common.refresh')}
            </button>
          </div>
          <p className="header-subtitle">{t('dashboard.welcome')}</p>
        </motion.div>

        {/* Key Metrics */}
        <motion.section 
          className="metrics-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2>{t('dashboard.metrics')}</h2>
          <div className="metrics-grid">
            {dashboardData && Object.entries(dashboardData.metrics).map(([key, metric], index) => {
              const icons = {
                temperature: Thermometer,
                salinity: Droplets,
                depth: Waves,
                pressure: Activity,
                oxygen: Compass,
                ph: BarChart3
              }
              const Icon = icons[key] || Activity
              const TrendIcon = metric.change === 'up' ? TrendingUp : metric.change === 'down' ? TrendingDown : Activity
              
              return (
                <motion.div
                  key={key}
                  className="metric-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="metric-header">
                    <div className="metric-icon">
                      <Icon size={24} />
                    </div>
                    <div className="metric-trend">
                      <TrendIcon 
                        size={16} 
                        className={metric.change === 'up' ? 'trend-up' : metric.change === 'down' ? 'trend-down' : 'trend-stable'} 
                      />
                      <span className={metric.change === 'up' ? 'trend-up' : metric.change === 'down' ? 'trend-down' : 'trend-stable'}>
                        {metric.trend}
                      </span>
                    </div>
                  </div>
                  <div className="metric-content">
                    <div className="metric-value">
                      {metric.value}
                      <span className="metric-unit">{metric.unit}</span>
                    </div>
                    <div className="metric-label">
                      {t(`ocean.${key}`)}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Data Overview */}
        <motion.section 
          className="overview-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2>{t('dashboard.dataOverview')}</h2>
          <div className="overview-grid">
            <div className="overview-card">
              <div className="overview-header">
                <MapPin size={24} />
                <h3>Ocean Coverage</h3>
              </div>
              <div className="coverage-stats">
                {Object.entries(dashboardData.dataOverview.coverage).map(([ocean, percentage]) => (
                  <div key={ocean} className="coverage-item">
                    <div className="coverage-label">{ocean.charAt(0).toUpperCase() + ocean.slice(1)}</div>
                    <div className="coverage-bar">
                      <div 
                        className="coverage-fill"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="coverage-percentage">{percentage}%</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="overview-card">
              <div className="overview-header">
                <Activity size={24} />
                <h3>System Status</h3>
              </div>
              <div className="status-stats">
                <div className="status-item">
                  <div className="status-label">Total Floats</div>
                  <div className="status-value">{dashboardData.dataOverview.totalFloats.toLocaleString()}</div>
                </div>
                <div className="status-item">
                  <div className="status-label">Active Floats</div>
                  <div className="status-value">{dashboardData.dataOverview.activeFloats.toLocaleString()}</div>
                </div>
                <div className="status-item">
                  <div className="status-label">Total Measurements</div>
                  <div className="status-value">{dashboardData.dataOverview.totalMeasurements.toLocaleString()}</div>
                </div>
                <div className="status-item">
                  <div className="status-label">Last Update</div>
                  <div className="status-value">
                    <Clock size={16} />
                    {new Date(dashboardData.dataOverview.lastUpdate).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Recent Queries */}
        <motion.section 
          className="queries-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h2>{t('dashboard.recentQueries')}</h2>
          <div className="queries-list">
            {dashboardData.recentQueries.map((query, index) => (
              <motion.div
                key={query.id}
                className="query-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                whileHover={{ x: 10 }}
              >
                <div className="query-content">
                  <div className="query-text">{query.query}</div>
                  <div className="query-meta">
                    <span className="query-results">{query.results} results</span>
                    <span className="query-time">{query.timestamp}</span>
                  </div>
                </div>
                <div className="query-arrow">
                  →
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default Dashboard
