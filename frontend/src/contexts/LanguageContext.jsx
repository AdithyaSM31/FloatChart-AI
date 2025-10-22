import React, { createContext, useContext, useState, useEffect } from 'react'
import i18n from '../i18n'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en')
  const [isRTL, setIsRTL] = useState(false)

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' }
  ]

  const changeLanguage = (languageCode) => {
    setCurrentLanguage(languageCode)
    i18n.changeLanguage(languageCode)
    
    // Check if language is RTL
    const rtlLanguages = ['ar', 'he', 'fa', 'ur']
    setIsRTL(rtlLanguages.includes(languageCode))
    
    // Update document direction
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = languageCode
  }

  const getCurrentLanguageInfo = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0]
  }

  useEffect(() => {
    // Initialize with saved language or default
    const savedLanguage = localStorage.getItem('floatchat-language') || 'en'
    changeLanguage(savedLanguage)
  }, [])

  useEffect(() => {
    // Save language preference
    localStorage.setItem('floatchat-language', currentLanguage)
  }, [currentLanguage])

  const value = {
    currentLanguage,
    languages,
    isRTL,
    changeLanguage,
    getCurrentLanguageInfo,
    t: (key, options) => i18n.t(key, options)
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
