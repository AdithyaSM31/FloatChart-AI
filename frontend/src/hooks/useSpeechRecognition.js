import { useState, useEffect, useRef, useCallback } from 'react'

// Language mappings for Web Speech API
const SPEECH_LANG_MAP = {
  'en': 'en-US',
  'hi': 'hi-IN',
  'bn': 'bn-IN', 
  'te': 'te-IN',
  'mr': 'mr-IN',
  'ta': 'ta-IN',
  'ur': 'ur-IN',
  'gu': 'gu-IN',
  'kn': 'kn-IN',
  'or': 'or-IN',
  'ml': 'ml-IN',
  'pa': 'pa-IN'
}

export const useSpeechRecognition = (language = 'en') => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [error, setError] = useState(null)
  const [isSupported, setIsSupported] = useState(false)
  
  const recognitionRef = useRef(null)
  const timeoutRef = useRef(null)

  // Check browser support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    setIsSupported(!!SpeechRecognition)
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      
      // Configure recognition
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.maxAlternatives = 1
      
      // Set initial language
      recognitionRef.current.lang = SPEECH_LANG_MAP[language] || 'en-US'
      
      // Event handlers
      recognitionRef.current.onstart = () => {
        setIsListening(true)
        setError(null)
        console.log('Speech recognition started')
      }
      
      recognitionRef.current.onend = () => {
        setIsListening(false)
        console.log('Speech recognition ended')
      }
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setError(event.error)
        setIsListening(false)
        
        // Handle specific errors
        switch (event.error) {
          case 'no-speech':
            setError('No speech detected. Please try again.')
            break
          case 'audio-capture':
            setError('Microphone not accessible. Please check permissions.')
            break
          case 'not-allowed':
            setError('Microphone permission denied. Please allow microphone access.')
            break
          case 'network':
            setError('Network error. Please check your connection.')
            break
          case 'language-not-supported':
            setError(`Language ${language} not supported. Switching to English.`)
            break
          default:
            setError('An error occurred during speech recognition.')
        }
      }
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = ''
        let interimText = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          const transcriptText = result[0].transcript
          
          if (result.isFinal) {
            finalTranscript += transcriptText
          } else {
            interimText += transcriptText
          }
        }
        
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript)
          setInterimTranscript('')
          
          // Auto-stop after getting final result
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }
          timeoutRef.current = setTimeout(() => {
            stopListening()
          }, 2000) // Stop 2 seconds after last speech
        } else {
          setInterimTranscript(interimText)
        }
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Update language when it changes
  useEffect(() => {
    if (recognitionRef.current) {
      const newLang = SPEECH_LANG_MAP[language] || 'en-US'
      recognitionRef.current.lang = newLang
      console.log(`Speech recognition language set to: ${newLang}`)
    }
  }, [language])

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser.')
      return
    }
    
    if (recognitionRef.current && !isListening) {
      try {
        setTranscript('')
        setInterimTranscript('')
        setError(null)
        recognitionRef.current.start()
        
        // Auto-stop after 30 seconds
        timeoutRef.current = setTimeout(() => {
          stopListening()
        }, 30000)
        
      } catch (err) {
        console.error('Error starting speech recognition:', err)
        setError('Failed to start speech recognition.')
      }
    }
  }, [isSupported, isListening])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [isListening])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
  }, [])

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    toggleListening,
    currentLanguage: SPEECH_LANG_MAP[language] || 'en-US'
  }
}

export default useSpeechRecognition