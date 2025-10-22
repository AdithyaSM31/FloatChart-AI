import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { OceanProvider } from './contexts/OceanContext.jsx'
import { LanguageProvider } from './contexts/LanguageContext.jsx'
import Layout from './components/Layout/Layout.jsx'
import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Chat from './pages/Chat.jsx'
import DataViz from './pages/DataViz.jsx'
import Guide from './pages/Guide.jsx'
import Incois from './pages/Incois.jsx'
import './App.css'

function App() {
  return (
    <LanguageProvider>
      <OceanProvider>
        <Router>
          <div className="app">
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/data" element={<DataViz />} />
                <Route path="/guide" element={<Guide />} />
                <Route path="/incois" element={<Incois />} />
              </Routes>
            </Layout>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'rgba(0, 20, 40, 0.95)',
                  color: '#ffffff',
                  border: '1px solid rgba(0, 150, 255, 0.3)',
                  backdropFilter: 'blur(10px)',
                },
              }}
            />
          </div>
        </Router>
      </OceanProvider>
    </LanguageProvider>
  )
}

export default App
