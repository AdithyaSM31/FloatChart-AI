import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, ChevronDown } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext.jsx'

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { currentLanguage, languages, changeLanguage, getCurrentLanguageInfo } = useLanguage()

  const currentLang = getCurrentLanguageInfo()

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode)
    setIsOpen(false)
  }

  return (
    <div className="language-switcher">
      <motion.button
        className="language-trigger"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Globe size={18} />
        <span>{currentLang.nativeName}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="language-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="language-dropdown"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="language-header">
                <Globe size={16} />
                <span>Select Language</span>
              </div>
              
              <div className="language-list">
                {languages.map((lang) => (
                  <motion.button
                    key={lang.code}
                    className={`language-option ${currentLanguage === lang.code ? 'active' : ''}`}
                    onClick={() => handleLanguageChange(lang.code)}
                    whileHover={{ backgroundColor: 'rgba(0, 170, 255, 0.1)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="language-name">{lang.nativeName}</span>
                    <span className="language-code">{lang.name}</span>
                    {currentLanguage === lang.code && (
                      <motion.div
                        className="language-check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500 }}
                      >
                        ✓
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LanguageSwitcher
