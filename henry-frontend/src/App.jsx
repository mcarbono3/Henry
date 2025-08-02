import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { BookOpen, Users, Brain, Presentation, GraduationCap, Settings } from 'lucide-react'
import './App.css'

// Componentes principales
import LandingPage from './components/LandingPage'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import Dashboard from './components/Dashboard'
import Navigation from './components/Navigation'
import AIAssistant from './components/AIAssistant'
import ClassManagement from './components/ClassManagement'
import PresentationCreator from './components/PresentationCreator'

// Context para autenticación
import { AuthProvider, useAuth } from './contexts/AuthContext'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando HENRY...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
        <Route 
          path="/dashboard" 
          element={user ? (
            <div className="flex">
              <Navigation />
              <main className="flex-1 ml-64">
                <Dashboard />
              </main>
            </div>
          ) : <Navigate to="/login" />} 
        />
        <Route 
          path="/classes" 
          element={user ? (
            <div className="flex">
              <Navigation />
              <main className="flex-1 ml-64">
                <ClassManagement />
              </main>
            </div>
          ) : <Navigate to="/login" />} 
        />
        <Route 
          path="/presentations" 
          element={user ? (
            <div className="flex">
              <Navigation />
              <main className="flex-1 ml-64">
                <PresentationCreator />
              </main>
            </div>
          ) : <Navigate to="/login" />} 
        />
        <Route 
          path="/ai-assistant" 
          element={user ? (
            <div className="flex">
              <Navigation />
              <main className="flex-1 ml-64">
                <AIAssistant />
              </main>
            </div>
          ) : <Navigate to="/login" />} 
        />
        <Route 
          path="/profile" 
          element={user ? (
            <div className="flex">
              <Navigation />
              <main className="flex-1 ml-64">
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Mi Perfil</h1>
                  <p>Configuración de perfil en desarrollo...</p>
                </div>
              </main>
            </div>
          ) : <Navigate to="/login" />} 
        />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router basename="/Henry"> 
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App

