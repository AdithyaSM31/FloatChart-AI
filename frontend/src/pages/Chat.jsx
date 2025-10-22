import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Mic,
  MicOff,
  Image,
  FileText,
  Trash2,
  Bot,
  User,
  Volume2,
  VolumeX,
  Download,
  Upload,
  RefreshCw,
  Copy,
  MapPin
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { useOcean } from '../contexts/OceanContext.jsx'
import toast from 'react-hot-toast'
import DataRenderer from './DataRenderer.jsx'
import OceanMap from '../components/Map/OceanMap.jsx'
import { detectLocationQuery, hasLocationData, extractLocationData, generateMockLocationData } from '../utils/locationUtils.js'
import useSpeechRecognition from '../hooks/useSpeechRecognition.js'
import RecordingButton from '../components/Recording/RecordingButton.jsx'

const Chat = () => {
  const { t, currentLanguage } = useLanguage()
  const { isUnderwater } = useOcean()
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)
  
  // Get API URL from environment variable or use default
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  // Speech Recognition
  const {
    isListening,
    transcript,
    interimTranscript,
    error: speechError,
    isSupported: speechSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition(currentLanguage)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Update input when speech recognition provides transcript
  useEffect(() => {
    if (transcript && !isListening) {
      setInputValue(prev => prev + transcript)
      resetTranscript()
      toast.success('Speech converted to text!')
    }
  }, [transcript, isListening, resetTranscript])

  // Show speech error notifications
  useEffect(() => {
    if (speechError) {
      toast.error(speechError)
    }
  }, [speechError])

  const exampleQueries = [
    t('chat.example1'),
    t('chat.example2'),
    t('chat.example3'),
    'Show me float locations near the equator',
    'Where are the deepest measurements located?',
    'Map ocean temperature data by region'
  ]

  const handleSendMessage = async (message = inputValue) => {
    if (!message.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date(),
      image: selectedImage
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setSelectedImage(null)
    setIsLoading(true)

    try {
      console.log('Sending request to backend:', message);
      
      // Add timeout to prevent indefinite hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
      
      const response = await fetch(`${API_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: message }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error:', errorText);
        throw new Error(`Backend error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Received data from backend:', data);
      
      let botMessage;

      if (data.is_multi_part) {
        botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: data.summary,
          subAnswers: data.sub_answers,
          timestamp: new Date()
        };
        toast.success('✅ Multi-part response from AI!');
      } else {
        botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: data.summary,
          subAnswers: [{
            question: message,
            summary: data.summary,
            data: data.data,
            sql_query: data.sql_query,
            total_rows: data.total_rows
          }],
          timestamp: new Date()
        };
        toast.success('✅ Response from AI backend!');
      }

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Backend error - falling back to demo mode:', error);
      
      // Check if it's a timeout error
      if (error.name === 'AbortError') {
        toast.error('⏱️ Request timeout - Query took too long. Try a more specific question.');
      } else {
        toast.error(`Backend error: ${error.message}`);
      }
      
      const mockResponse = generateMockResponse(message);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: mockResponse.content,
        subAnswers: [{
          question: message,
          data: mockResponse.data,
          sql_query: mockResponse.sqlQuery
        }],
        timestamp: new Date(),
        isMockResponse: true
      };
      setMessages(prev => [...prev, botMessage]);
      toast.warning('⚠️ Demo mode: Using mock data (Backend not available)');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockResponse = (question) => {
    const lowerQuestion = question.toLowerCase()
    
    // Check if this is a location query
    const isLocationQuery = detectLocationQuery(question)
    
    if (lowerQuestion.includes('deepest') || lowerQuestion.includes('deep')) {
      return {
        content: "Here's data from the deepest ocean measurements (4000m+ depth):",
        data: [
          { depth: '4500m', temperature: '1.2°C', salinity: '34.8 PSU', pressure: '450 bar', location: 'Mariana Trench', latitude: '11.5°N', longitude: '142.2°E' },
          { depth: '4200m', temperature: '1.5°C', salinity: '34.7 PSU', pressure: '420 bar', location: 'Pacific Abyss', latitude: '15.8°N', longitude: '145.3°E' },
          { depth: '4800m', temperature: '0.8°C', salinity: '34.9 PSU', pressure: '480 bar', location: 'Challenger Deep', latitude: '11.4°N', longitude: '142.1°E' }
        ],
        sqlQuery: "SELECT * FROM ocean_data WHERE depth > 4000 ORDER BY depth DESC LIMIT 10;"
      }
    }
    
    if (lowerQuestion.includes('salinity')) {
      const year = lowerQuestion.match(/\b(20\d{2})\b/)?.[1] || '2024'
      return {
        content: `Average salinity data for ${year}:`,
        data: [
          { year: year, avg_salinity: '34.7 PSU', min_salinity: '33.2 PSU', max_salinity: '36.1 PSU', samples: '15,420' },
          { region: 'Pacific', salinity: '34.8 PSU', trend: '+0.1 PSU/year', latitude: '0.0°', longitude: '180.0°E' },
          { region: 'Atlantic', salinity: '34.6 PSU', trend: '+0.05 PSU/year', latitude: '30.0°N', longitude: '30.0°W' },
          { region: 'Indian', salinity: '34.9 PSU', trend: '+0.08 PSU/year', latitude: '20.0°S', longitude: '80.0°E' }
        ],
        sqlQuery: `SELECT AVG(salinity) as avg_salinity, MIN(salinity) as min_salinity, MAX(salinity) as max_salinity FROM ocean_data WHERE year = ${year};`
      }
    }
    
    if (lowerQuestion.includes('temperature') || lowerQuestion.includes('temp')) {
      return {
        content: "Current ocean temperature data:",
        data: [
          { depth: 'Surface', temperature: '22.5°C', trend: '+0.3°C/year', region: 'Global Average', latitude: '0.0°', longitude: '0.0°' },
          { depth: '100m', temperature: '18.2°C', trend: '+0.2°C/year', region: 'Mixed Layer', latitude: '15.0°N', longitude: '45.0°E' },
          { depth: '500m', temperature: '8.7°C', trend: '+0.1°C/year', region: 'Thermocline', latitude: '30.0°S', longitude: '120.0°W' },
          { depth: '1000m', temperature: '4.2°C', trend: 'Stable', region: 'Deep Ocean', latitude: '45.0°N', longitude: '160.0°E' }
        ],
        sqlQuery: "SELECT depth_range, AVG(temperature) as avg_temp, STDDEV(temperature) as temp_variance FROM ocean_data GROUP BY depth_range ORDER BY depth_range;"
      }
    }
    
    if (lowerQuestion.includes('float') || lowerQuestion.includes('equator') || isLocationQuery) {
      // Generate location-specific data
      let locationData = generateMockLocationData(question)
      
      return {
        content: lowerQuestion.includes('equator') 
          ? "Argo float locations near the equator:"
          : "Ocean data with location information:",
        data: locationData,
        sqlQuery: lowerQuestion.includes('equator')
          ? "SELECT float_id, latitude, longitude, max_depth, status FROM argo_floats WHERE ABS(latitude) < 1.0 AND status = 'Active';"
          : "SELECT * FROM ocean_data WHERE latitude IS NOT NULL AND longitude IS NOT NULL;"
      }
    }
    
    return {
      content: `I understand you're asking about "${question}". Here's some relevant ocean data:`,
      data: [
        { parameter: 'Temperature', value: '22.5°C', unit: 'Celsius', location: 'Surface', latitude: '35.0°N', longitude: '25.0°E' },
        { parameter: 'Salinity', value: '34.7 PSU', unit: 'Practical Salinity Units', location: 'Global Average', latitude: '0.0°', longitude: '0.0°' }
      ],
      sqlQuery: "SELECT * FROM ocean_data LIMIT 2;"
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleExampleClick = (example) => {
    setInputValue(example)
    inputRef.current?.focus()
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setSelectedImage(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSpeechToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const clearChat = () => {
    setMessages([])
    toast.success('Chat cleared')
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  const downloadData = (data) => {
    const jsonData = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ocean-data.json'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Data downloaded')
  }

  const downloadChat = () => {
    const chatData = {
      messages: messages,
      timestamp: new Date().toISOString(),
      language: t('nav.language')
    }
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ocean-chat-history.json'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Chat history downloaded')
  }

  return (
    <div className={`chat-page ${isUnderwater ? 'underwater' : 'surface'}`}>
      <div className="chat-container">
        <motion.div 
          className="chat-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="header-content">
            <div className="header-title">
              <Bot size={32} />
              <h1>{t('chat.title')}</h1>
            </div>
            <div className="header-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setAudioEnabled(!audioEnabled)}
                title={audioEnabled ? 'Disable Audio' : 'Enable Audio'}
              >
                {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
              <button 
                className="btn btn-secondary"
                onClick={downloadChat}
                title="Download Chat"
                disabled={messages.length === 0}
              >
                <Download size={18} />
              </button>
              <button 
                className="btn btn-secondary"
                onClick={clearChat}
                title="Clear Chat"
                disabled={messages.length === 0}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </motion.div>

        <div className="messages-container">
          <AnimatePresence>
            {messages.length === 0 ? (
              <motion.div 
                className="welcome-message"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="welcome-content">
                  <Bot size={48} />
                  <h3>Welcome to Ocean Chat</h3>
                  <p>{t('chat.placeholder')}</p>
                  
                  <div className="example-queries">
                    <h4>{t('chat.examples')}</h4>
                    <div className="example-list">
                      {exampleQueries.map((example, index) => (
                        <motion.button
                          key={index}
                          className="example-query"
                          onClick={() => handleExampleClick(example)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {example}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="messages-list">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`message ${message.type}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="message-avatar">
                      {message.type === 'user' ? <User size={20} /> : <Bot size={20} />}
                    </div>
                    <div className="message-content">
                      {message.image && (
                        <div className="message-image">
                          <img src={message.image} alt="Uploaded" />
                        </div>
                      )}
                      <div className="message-text">
                        {message.content}
                        {message.isMockResponse && (
                          <div className="mock-indicator">
                            <span className="demo-badge">Demo Mode</span>
                          </div>
                        )}
                      </div>
                      
                      {message.subAnswers && message.subAnswers.map((answer, index) => (
                        <div key={index} className="sub-answer-container">
                          
                          {message.subAnswers.length > 1 && answer.question && (
                            <h4 className="sub-question-title">{answer.question}</h4>
                          )}

                          {answer.data && answer.data.length > 0 && (
                            <div className="message-data">
                              <div className="data-header">
                                <span>Data Results ({answer.total_rows ? `showing ${answer.data.length} of ${answer.total_rows.toLocaleString()} records` : `${answer.data.length} records`})</span>
                                <div className="data-actions">
                                  <button onClick={() => copyToClipboard(JSON.stringify(answer.data, null, 2))} title="Copy data"><Copy size={16} /></button>
                                  <button onClick={() => downloadData(answer.data)} title="Download data"><Download size={16} /></button>
                                </div>
                              </div>
                              <DataRenderer data={answer.data} />
                              
                              {/* Conditional Map Display */}
                              {hasLocationData(answer.data) && (
                                <div className="message-map">
                                  <div className="map-header">
                                    <MapPin size={16} />
                                    <span>Location Map</span>
                                  </div>
                                  <OceanMap 
                                    locationData={extractLocationData(answer.data)}
                                    className="chat-map"
                                  />
                                </div>
                              )}
                            </div>
                          )}
                          
                          {answer.sql_query && (
                            <div className="message-sql">
                              <div className="sql-header">
                                <span>SQL Query</span>
                                <button onClick={() => copyToClipboard(answer.sql_query)} title="Copy SQL"><Copy size={16} /></button>
                              </div>
                              <pre className="sql-code">{answer.sql_query}</pre>
                            </div>
                          )}
                        </div>
                      ))}

                      <div className="message-time">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </AnimatePresence>
        </div>

        <motion.div 
          className="input-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {selectedImage && (
            <motion.div 
              className="image-preview"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <img src={selectedImage} alt="Preview" />
              <button 
                className="remove-image"
                onClick={() => setSelectedImage(null)}
              >
                ×
              </button>
            </motion.div>
          )}
          
          <div className="input-area">
            <div className="input-actions">
              <button 
                className="input-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Upload Image"
              >
                <Image size={20} />
              </button>
            </div>
            
            <div className="input-field">
              <textarea
                ref={inputRef}
                value={inputValue + (interimTranscript ? ` ${interimTranscript}` : '')}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('chat.placeholder')}
                className="chat-input"
                rows={1}
                disabled={isLoading}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                className="send-btn"
              >
                <Send size={20} />
              </button>
            </div>
            
            {/* Speech Recognition Button */}
            <RecordingButton
              isListening={isListening}
              isSupported={speechSupported}
              onClick={handleSpeechToggle}
              error={speechError}
              interimTranscript={interimTranscript}
              className="speech-button"
            />
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </motion.div>
      </div>
    </div>
  )
}

export default Chat
