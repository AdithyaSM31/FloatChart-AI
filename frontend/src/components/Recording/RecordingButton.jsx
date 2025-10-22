import React from 'react'
import { useLanguage } from '../../contexts/LanguageContext'

const RecordingButton = ({ 
  isListening, 
  isSupported, 
  onClick, 
  error, 
  interimTranscript,
  className = ''
}) => {
  const { t } = useLanguage()

  if (!isSupported) {
    return (
      <div className="recording-button-container">
        <button 
          className={`recording-button unsupported ${className}`}
          disabled
          title="Speech recognition not supported"
        >
          <svg viewBox="0 0 24 24" className="mic-icon">
            <path d="M12 2C13.1 2 14 2.9 14 4V10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10V4C10 2.9 10.9 2 12 2Z" />
            <path d="M19 10V12C19 15.9 15.9 19 12 19C8.1 19 5 15.9 5 10V12H7V10C7 8.3 8.3 7 10 7V5C7.2 5 5 7.2 5 10V12C5 16.4 8.6 20 13 20H11V22H13V20C17.4 20 21 16.4 21 12V10H19Z" />
            <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
        <span className="recording-status unsupported">
          {t('chat.speechNotSupported') || 'Speech recognition not supported'}
        </span>
      </div>
    )
  }

  return (
    <div className="recording-button-container">
      <button 
        className={`recording-button ${isListening ? 'listening' : ''} ${error ? 'error' : ''} ${className}`}
        onClick={onClick}
        title={isListening ? 'Stop recording' : 'Start recording'}
      >
        <div className="mic-wrapper">
          <svg viewBox="0 0 24 24" className="mic-icon">
            <path d="M12 2C13.1 2 14 2.9 14 4V10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10V4C10 2.9 10.9 2 12 2Z" />
            <path d="M19 10V12C19 15.9 15.9 19 12 19C8.1 19 5 15.9 5 10V12H7V10C7 8.3 8.3 7 10 7V5C7.2 5 5 7.2 5 10V12C5 16.4 8.6 20 13 20H11V22H13V20C17.4 20 21 16.4 21 12V10H19Z" />
          </svg>
          
          {/* Recording animation */}
          {isListening && (
            <div className="recording-animation">
              <div className="wave wave-1"></div>
              <div className="wave wave-2"></div>
              <div className="wave wave-3"></div>
            </div>
          )}
          
          {/* Pulse effect when listening */}
          {isListening && <div className="pulse-ring"></div>}
        </div>
      </button>
      
      {/* Status text */}
      <div className="recording-status">
        {error && (
          <span className="error-text">{error}</span>
        )}
        {isListening && !error && (
          <span className="listening-text">
            {interimTranscript ? 
              `${t('chat.listening') || 'Listening'}: "${interimTranscript}"` : 
              t('chat.listening') || 'Listening...'
            }
          </span>
        )}
        {!isListening && !error && (
          <span className="idle-text">
            {t('chat.clickToSpeak') || 'Click to speak'}
          </span>
        )}
      </div>
    </div>
  )
}

export default RecordingButton