import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Home, 
  BarChart3, 
  MessageCircle, 
  Map, 
  Settings, 
  Menu, 
  X,
  Waves,
  BookOpen,
  Globe
} from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext.jsx'
import { useOcean } from '../../contexts/OceanContext.jsx'

const Navigation = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation()
  const { t } = useLanguage()

  const navItems = [
    { path: '/', icon: Home, label: t('nav.home') },
    { path: '/dashboard', icon: BarChart3, label: t('nav.dashboard') },
    { path: '/chat', icon: MessageCircle, label: t('nav.chat') },
    { path: '/data', icon: Map, label: t('nav.data') },
    { path: '/guide', icon: BookOpen, label: t('nav.guide') },
    { path: '/incois', icon: Globe, label: t('nav.incois') },
  ]

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-btn"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay show"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop Navigation */}
      <nav className="nav-desktop">
        <div className="nav-brand">
          <div className="brand-icon">
            <Waves size={32} />
          </div>
          <span className="brand-text">FloatChat</span>
        </div>

        <div className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link key={item.path} to={item.path}>
                <div className={`nav-item ${isActive ? 'active' : ''}`}>
                  <Icon size={20} />
                  <span>{item.label}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <nav className={`nav-mobile ${sidebarOpen ? 'open' : ''}`}>
        <div className="mobile-nav-header">
          <div className="mobile-brand">
            <Waves size={28} />
            <span>FloatChat</span>
          </div>
          <button 
            className="close-btn"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <div className="mobile-nav-links">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link 
                key={item.path} 
                to={item.path}
                onClick={() => setSidebarOpen(false)}
              >
                <div className={`mobile-nav-item ${isActive ? 'active' : ''}`}>
                  <Icon size={20} />
                  <span>{item.label}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}

export default Navigation
