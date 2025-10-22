import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  Download, 
  ChevronRight, 
  ChevronDown,
  FileText,
  MessageCircle,
  BarChart3,
  Map,
  Lightbulb,
  Waves,
  Droplets,
  Thermometer,
  Compass
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { useOcean } from '../contexts/OceanContext.jsx'
import toast from 'react-hot-toast'

const Guide = () => {
  const { t, currentLanguage } = useLanguage()
  const { isUnderwater } = useOcean()
  const [expandedSection, setExpandedSection] = useState('gettingStarted')

  const sections = [
    {
      id: 'gettingStarted',
      icon: BookOpen,
      title: t('guide.sections.gettingStarted'),
      content: t('guide.content.gettingStarted'),
      steps: [
        {
          title: 'Navigate to Chat',
          description: 'Click on the Chat icon in the navigation to start asking questions about ocean data.',
          icon: MessageCircle
        },
        {
          title: 'Ask Your First Question',
          description: 'Try asking: "What is the average temperature in the Pacific Ocean?"',
          icon: Thermometer
        },
        {
          title: 'Explore the Dashboard',
          description: 'Visit the Dashboard to see key ocean metrics and analytics.',
          icon: BarChart3
        },
        {
          title: 'Visualize Data',
          description: 'Use the Data Visualization page to explore interactive maps and charts.',
          icon: Map
        }
      ]
    },
    {
      id: 'chatInterface',
      icon: MessageCircle,
      title: t('guide.sections.chatInterface'),
      content: t('guide.content.chatInterface'),
      steps: [
        {
          title: 'Natural Language Queries',
          description: 'Ask questions in plain English or your preferred language. The AI understands context and intent.',
          icon: MessageCircle
        },
        {
          title: 'Example Queries',
          description: 'Try these sample questions: "Show me data from the deepest measurements", "Which floats are closest to the equator?"',
          icon: Lightbulb
        },
        {
          title: 'Data Export',
          description: 'Download query results as JSON files for further analysis.',
          icon: Download
        },
        {
          title: 'SQL Queries',
          description: 'View the generated SQL queries to understand how your questions are processed.',
          icon: FileText
        }
      ]
    },
    {
      id: 'dashboard',
      icon: BarChart3,
      title: t('guide.sections.dashboard'),
      content: t('guide.content.dashboard'),
      steps: [
        {
          title: 'Key Metrics',
          description: 'Monitor temperature, salinity, depth, pressure, oxygen levels, and pH measurements.',
          icon: Thermometer
        },
        {
          title: 'Trend Analysis',
          description: 'View trend indicators showing changes in ocean parameters over time.',
          icon: Compass
        },
        {
          title: 'Ocean Coverage',
          description: 'See data coverage across different ocean regions (Pacific, Atlantic, Indian, Arctic).',
          icon: Map
        },
        {
          title: 'System Status',
          description: 'Monitor active floats, total measurements, and system health.',
          icon: Waves
        }
      ]
    },
    {
      id: 'dataVisualization',
      icon: Map,
      title: t('guide.sections.dataVisualization'),
      content: t('guide.content.dataVisualization'),
      steps: [
        {
          title: 'Interactive Maps',
          description: 'Explore ocean data through interactive maps showing float locations and measurements.',
          icon: Map
        },
        {
          title: 'Chart Types',
          description: 'View data through various chart types: bar charts, line graphs, and pie charts.',
          icon: BarChart3
        },
        {
          title: 'Filtering Options',
          description: 'Filter data by time range, data type, region, and depth range.',
          icon: Droplets
        },
        {
          title: 'Data Export',
          description: 'Download filtered datasets for offline analysis.',
          icon: Download
        }
      ]
    },
    {
      id: 'tips',
      icon: Lightbulb,
      title: t('guide.sections.tips'),
      content: t('guide.content.tips'),
      steps: [
        {
          title: 'Be Specific',
          description: 'The more specific your question, the more accurate the results. Include location, time period, or depth when relevant.',
          icon: Lightbulb
        },
        {
          title: 'Use Ocean Terminology',
          description: 'Terms like "equator", "deepest", "surface", "salinity" help the AI understand your intent better.',
          icon: Waves
        },
        {
          title: 'Explore Different Views',
          description: 'Switch between surface and underwater views to get different perspectives on the data.',
          icon: Droplets
        },
        {
          title: 'Language Support',
          description: 'Use the language switcher to access FloatChat in your preferred language.',
          icon: MessageCircle
        }
      ]
    }
  ]

  const generatePDF = () => {
    // Create a comprehensive PDF guide
    const guideContent = {
      title: 'FloatChat User Guide',
      language: currentLanguage,
      sections: sections.map(section => ({
        title: section.title,
        content: section.content,
        steps: section.steps.map(step => ({
          title: step.title,
          description: step.description
        }))
      })),
      generatedAt: new Date().toISOString(),
      version: '1.0'
    }

    // Convert to PDF-ready format
    const pdfContent = `
# FloatChat User Guide
**Language:** ${currentLanguage}
**Generated:** ${new Date().toLocaleDateString()}

## Welcome
${t('guide.content.welcome')}

${sections.map(section => `
## ${section.title}
${section.content}

${section.steps.map((step, index) => `
### ${index + 1}. ${step.title}
${step.description}
`).join('')}
`).join('')}

---
*This guide was generated by FloatChat - Ocean Data Intelligence Platform*
    `.trim()

    // Create and download PDF
    const blob = new Blob([pdfContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `FloatChat-Guide-${currentLanguage}-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('Guide downloaded successfully!')
  }

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId)
  }

  return (
    <div className={`guide-page ${isUnderwater ? 'underwater' : 'surface'}`}>
      <div className="guide-container">
        {/* Header */}
        <motion.div 
          className="guide-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="header-content">
            <div className="header-title">
              <BookOpen size={32} />
              <h1>{t('guide.title')}</h1>
            </div>
            <button 
              className="btn btn-primary"
              onClick={generatePDF}
            >
              <Download size={18} />
              {t('guide.download')}
            </button>
          </div>
          <p className="header-subtitle">{t('guide.subtitle')}</p>
        </motion.div>

        {/* Welcome Section */}
        <motion.div 
          className="welcome-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="welcome-card">
            <div className="welcome-icon">
              <Waves size={48} />
            </div>
            <div className="welcome-content">
              <h2>Welcome to FloatChat</h2>
              <p>{t('guide.content.welcome')}</p>
            </div>
          </div>
        </motion.div>

        {/* Guide Sections */}
        <motion.div 
          className="guide-sections"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {sections.map((section, index) => {
            const Icon = section.icon
            const isExpanded = expandedSection === section.id
            
            return (
              <motion.div
                key={section.id}
                className="guide-section"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
              >
                <div 
                  className="section-header"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="section-title">
                    <Icon size={24} />
                    <h3>{section.title}</h3>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight size={20} />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      className="section-content"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="section-description">
                        <p>{section.content}</p>
                      </div>
                      
                      <div className="section-steps">
                        {section.steps.map((step, stepIndex) => {
                          const StepIcon = step.icon
                          return (
                            <motion.div
                              key={stepIndex}
                              className="step-item"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: stepIndex * 0.1, duration: 0.4 }}
                            >
                              <div className="step-icon">
                                <StepIcon size={20} />
                              </div>
                              <div className="step-content">
                                <h4>{step.title}</h4>
                                <p>{step.description}</p>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="quick-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            <motion.button
              className="action-card"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/chat'}
            >
              <MessageCircle size={32} />
              <h4>Start Chatting</h4>
              <p>Ask your first question about ocean data</p>
            </motion.button>

            <motion.button
              className="action-card"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/dashboard'}
            >
              <BarChart3 size={32} />
              <h4>View Dashboard</h4>
              <p>Explore ocean metrics and analytics</p>
            </motion.button>

            <motion.button
              className="action-card"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/data'}
            >
              <Map size={32} />
              <h4>Data Visualization</h4>
              <p>Explore interactive maps and charts</p>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Guide
