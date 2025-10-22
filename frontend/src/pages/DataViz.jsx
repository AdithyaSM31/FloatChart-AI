import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Map, 
  BarChart3, 
  LineChart, 
  PieChart, 
  Filter, 
  Calendar,
  Download,
  RefreshCw,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { useOcean } from '../contexts/OceanContext.jsx'

const DataViz = () => {
  const { t } = useLanguage()
  const { isUnderwater } = useOcean()
  const [activeTab, setActiveTab] = useState('map')
  const [filters, setFilters] = useState({
    timeRange: '30d',
    dataType: 'all',
    region: 'all',
    depth: 'all'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(true)

  const tabs = [
    { id: 'map', label: t('dataViz.map'), icon: Map },
    { id: 'charts', label: t('dataViz.charts'), icon: BarChart3 }
  ]

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' },
    { value: 'all', label: 'All time' }
  ]

  const dataTypes = [
    { value: 'all', label: 'All Data' },
    { value: 'temperature', label: 'Temperature' },
    { value: 'salinity', label: 'Salinity' },
    { value: 'pressure', label: 'Pressure' },
    { value: 'oxygen', label: 'Oxygen' },
    { value: 'ph', label: 'pH' }
  ]

  const regions = [
    { value: 'all', label: 'All Regions' },
    { value: 'pacific', label: 'Pacific Ocean' },
    { value: 'atlantic', label: 'Atlantic Ocean' },
    { value: 'indian', label: 'Indian Ocean' },
    { value: 'arctic', label: 'Arctic Ocean' }
  ]

  const depthRanges = [
    { value: 'all', label: 'All Depths' },
    { value: 'surface', label: 'Surface (0-100m)' },
    { value: 'intermediate', label: 'Intermediate (100-1000m)' },
    { value: 'deep', label: 'Deep (1000-4000m)' },
    { value: 'abyssal', label: 'Abyssal (4000m+)' }
  ]

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
    setIsLoading(true)
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const applyFilters = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  const resetFilters = () => {
    setFilters({
      timeRange: '30d',
      dataType: 'all',
      region: 'all',
      depth: 'all'
    })
  }

  const downloadData = () => {
    // Simulate data download
    const mockData = {
      filters,
      timestamp: new Date().toISOString(),
      data: 'Mock ocean data...'
    }
    
    const blob = new Blob([JSON.stringify(mockData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ocean-data-visualization.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={`dataviz-page ${isUnderwater ? 'underwater' : 'surface'}`}>
      <div className="dataviz-container">
        {/* Header */}
        <motion.div 
          className="dataviz-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="header-content">
            <div className="header-title">
              <Map size={32} />
              <h1>{t('dataViz.title')}</h1>
            </div>
            <div className="header-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? <EyeOff size={18} /> : <Eye size={18} />}
                {showFilters ? 'Hide' : 'Show'} Filters
              </button>
              <button 
                className="btn btn-secondary"
                onClick={downloadData}
              >
                <Download size={18} />
                Download
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              className="filters-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="filters-content">
                <div className="filters-header">
                  <Filter size={20} />
                  <h3>{t('dataViz.filters')}</h3>
                </div>
                
                <div className="filters-grid">
                  <div className="filter-group">
                    <label>{t('dataViz.timeRange')}</label>
                    <select 
                      value={filters.timeRange}
                      onChange={(e) => handleFilterChange('timeRange', e.target.value)}
                      className="filter-select"
                    >
                      {timeRanges.map(range => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-group">
                    <label>{t('dataViz.dataType')}</label>
                    <select 
                      value={filters.dataType}
                      onChange={(e) => handleFilterChange('dataType', e.target.value)}
                      className="filter-select"
                    >
                      {dataTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-group">
                    <label>{t('dataViz.region')}</label>
                    <select 
                      value={filters.region}
                      onChange={(e) => handleFilterChange('region', e.target.value)}
                      className="filter-select"
                    >
                      {regions.map(region => (
                        <option key={region.value} value={region.value}>
                          {region.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-group">
                    <label>Depth Range</label>
                    <select 
                      value={filters.depth}
                      onChange={(e) => handleFilterChange('depth', e.target.value)}
                      className="filter-select"
                    >
                      {depthRanges.map(depth => (
                        <option key={depth.value} value={depth.value}>
                          {depth.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="filters-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={applyFilters}
                    disabled={isLoading}
                  >
                    {isLoading ? <RefreshCw className="loading-spinner" size={18} /> : null}
                    {t('dataViz.apply')}
                  </button>
                  <button 
                    className="btn btn-ghost"
                    onClick={resetFilters}
                  >
                    {t('dataViz.reset')}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <motion.div 
          className="tabs-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="tabs-header">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Content Area */}
        <motion.div 
          className="content-area"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {isLoading ? (
            <div className="loading-container">
              <motion.div
                className="loading-spinner"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <RefreshCw size={48} />
              </motion.div>
              <p>Loading visualization...</p>
            </div>
          ) : (
            <div className="visualization-content">
              {activeTab === 'map' && (
                <div className="map-container">
                  <div className="map-placeholder">
                    <Map size={64} />
                    <h3>Interactive Ocean Map</h3>
                    <p>Visualize ocean data across different regions and depths</p>
                    <div className="map-features">
                      <div className="feature-item">
                        <div className="feature-dot" style={{ backgroundColor: '#ff6b6b' }} />
                        <span>Temperature readings</span>
                      </div>
                      <div className="feature-item">
                        <div className="feature-dot" style={{ backgroundColor: '#4ecdc4' }} />
                        <span>Salinity measurements</span>
                      </div>
                      <div className="feature-item">
                        <div className="feature-dot" style={{ backgroundColor: '#ffd93d' }} />
                        <span>Float locations</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'charts' && (
                <div className="charts-container">
                  <div className="charts-grid">
                    <div className="chart-card">
                      <div className="chart-header">
                        <BarChart3 size={24} />
                        <h3>Temperature Distribution</h3>
                      </div>
                      <div className="chart-placeholder">
                        <BarChart3 size={48} />
                        <p>Temperature data visualization</p>
                      </div>
                    </div>

                    <div className="chart-card">
                      <div className="chart-header">
                        <LineChart size={24} />
                        <h3>Salinity Trends</h3>
                      </div>
                      <div className="chart-placeholder">
                        <LineChart size={48} />
                        <p>Salinity trends over time</p>
                      </div>
                    </div>

                    <div className="chart-card">
                      <div className="chart-header">
                        <PieChart size={24} />
                        <h3>Ocean Coverage</h3>
                      </div>
                      <div className="chart-placeholder">
                        <PieChart size={48} />
                        <p>Data coverage by ocean</p>
                      </div>
                    </div>

                    <div className="chart-card">
                      <div className="chart-header">
                        <BarChart3 size={24} />
                        <h3>Depth Analysis</h3>
                      </div>
                      <div className="chart-placeholder">
                        <BarChart3 size={48} />
                        <p>Measurements by depth range</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default DataViz
