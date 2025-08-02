import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { ScrollArea } from '@/components/ui/scroll-area.jsx'
import { 
  Brain, 
  Send, 
  Loader2, 
  User, 
  Bot, 
  Sparkles,
  MessageSquare,
  Clock,
  CheckCircle
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import aiService from '../services/aiService'

export default function AIAssistant() {
  const { userProfile } = useAuth()
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef(null)

  // Verificar conexión al cargar el componente
  useEffect(() => {
    checkAIConnection()
    // Mensaje de bienvenida
    const welcomeMessage = getWelcomeMessage()
    setMessages([{
      id: 1,
      type: 'ai',
      content: welcomeMessage,
      timestamp: new Date().toISOString()
    }])
  }, [userProfile])

  // Scroll automático a los nuevos mensajes
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const checkAIConnection = async () => {
    try {
      const status = await aiService.checkConnection()
      setIsConnected(status.connected)
    } catch (error) {
      console.error('Error verificando conexión IA:', error)
      setIsConnected(false)
    }
  }

  const getWelcomeMessage = () => {
    const role = userProfile?.role || 'estudiante'
    const name = userProfile?.fullName || 'Usuario'
    
    const welcomeMessages = {
      profesor: `¡Hola ${name}! Soy tu asistente de IA especializado en docencia e investigación. Puedo ayudarte con la creación de presentaciones, planificación de clases, generación de cuestionarios, evaluación de estudiantes y apoyo en investigación académica. ¿En qué puedo asistirte hoy?`,
      estudiante: `¡Hola ${name}! Soy tu tutor virtual personalizado. Estoy aquí para ayudarte con tus estudios: explicar conceptos difíciles, resolver ejercicios, prepararte para exámenes, resumir material de estudio y cualquier duda académica que tengas. ¿Qué te gustaría aprender hoy?`,
      administrador: `¡Hola ${name}! Soy tu asistente administrativo para la plataforma HENRY. Puedo ayudarte con análisis de datos, gestión de usuarios, optimización del sistema y generación de reportes. ¿En qué aspecto de la administración necesitas apoyo?`
    }
    
    return welcomeMessages[role] || welcomeMessages.estudiante
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await aiService.generateResponse(
        userMessage.content,
        userProfile?.role || 'estudiante',
        {
          userName: userProfile?.fullName?.split(' ')[0] || 'Usuario'
        }
      )

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.response,
        timestamp: response.timestamp,
        metadata: {
          model: response.model,
          usage: response.usage
        }
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error enviando mensaje:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo.',
        timestamp: new Date().toISOString(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRoleIcon = () => {
    const role = userProfile?.role || 'estudiante'
    switch (role) {
      case 'profesor':
        return <Brain className="w-5 h-5 text-blue-600" />
      case 'estudiante':
        return <Sparkles className="w-5 h-5 text-purple-600" />
      case 'administrador':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      default:
        return <Brain className="w-5 h-5 text-blue-600" />
    }
  }

  const getRoleTitle = () => {
    const role = userProfile?.role || 'estudiante'
    switch (role) {
      case 'profesor':
        return 'Asistente de Docencia e Investigación'
      case 'estudiante':
        return 'Tutor Virtual Personalizado'
      case 'administrador':
        return 'Asistente Administrativo'
      default:
        return 'Asistente de IA'
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getRoleIcon()}
              <div>
                <CardTitle className="text-xl">
                  {getRoleTitle()}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Potenciado por Inteligencia Artificial
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge 
                variant={isConnected ? "default" : "destructive"}
                className="flex items-center space-x-1"
              >
                <div className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-400' : 'bg-red-400'
                }`} />
                <span>{isConnected ? 'Conectado' : 'Desconectado'}</span>
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Chat Area */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-gray-600" />
            <span className="font-medium">Conversación</span>
            <Badge variant="outline" className="ml-auto">
              {messages.length} mensajes
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : message.isError
                        ? 'bg-red-50 text-red-800 border border-red-200'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.type === 'ai' && (
                        <Bot className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      )}
                      {message.type === 'user' && (
                        <User className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-xs ${
                            message.type === 'user' ? 'text-blue-200' : 'text-gray-500'
                          }`}>
                            <Clock className="w-3 h-3 inline mr-1" />
                            {formatTime(message.timestamp)}
                          </span>
                          {message.metadata && (
                            <span className="text-xs text-gray-400">
                              {message.metadata.model}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-5 h-5" />
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-gray-600">Pensando...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje aquí..."
                className="flex-1"
                disabled={isLoading || !isConnected}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading || !isConnected}
                className="px-4"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            {!isConnected && (
              <p className="text-sm text-red-600 mt-2">
                El asistente de IA no está disponible en este momento.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {userProfile?.role === 'profesor' && (
              <>
                <Button
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-center space-y-2"
                  onClick={() => setInputMessage('Ayúdame a crear una presentación')}
                >
                  <Brain className="w-5 h-5" />
                  <span className="text-xs">Crear Presentación</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-center space-y-2"
                  onClick={() => setInputMessage('Necesito generar un cuestionario')}
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-xs">Generar Quiz</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-center space-y-2"
                  onClick={() => setInputMessage('Ayúdame a planificar una clase')}
                >
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-xs">Planificar Clase</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-center space-y-2"
                  onClick={() => setInputMessage('Necesito ayuda con mi investigación')}
                >
                  <Sparkles className="w-5 h-5" />
                  <span className="text-xs">Investigación</span>
                </Button>
              </>
            )}
            
            {userProfile?.role === 'estudiante' && (
              <>
                <Button
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-center space-y-2"
                  onClick={() => setInputMessage('Explícame un concepto')}
                >
                  <Brain className="w-5 h-5" />
                  <span className="text-xs">Explicar Concepto</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-center space-y-2"
                  onClick={() => setInputMessage('Ayúdame a resolver un ejercicio')}
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-xs">Resolver Ejercicio</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-center space-y-2"
                  onClick={() => setInputMessage('Necesito estudiar para un examen')}
                >
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-xs">Estudiar Examen</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-center space-y-2"
                  onClick={() => setInputMessage('Ayúdame a resumir material')}
                >
                  <Sparkles className="w-5 h-5" />
                  <span className="text-xs">Resumir Material</span>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

