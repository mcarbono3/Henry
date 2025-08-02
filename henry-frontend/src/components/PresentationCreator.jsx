import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { 
  Presentation, 
  Plus, 
  Brain, 
  Wand2, 
  Eye,
  Download,
  Share,
  Edit,
  Trash2,
  Clock,
  Users,
  Sparkles,
  FileText,
  Image,
  BarChart3,
  Loader2
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import aiService from '../services/aiService'

export default function PresentationCreator() {
  const { userProfile } = useAuth()
  const [presentations, setPresentations] = useState([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [newPresentation, setNewPresentation] = useState({
    title: '',
    topic: '',
    audience: '',
    duration: '',
    style: 'professional',
    includeImages: true,
    includeCharts: false
  })

  // Datos simulados de presentaciones
  useEffect(() => {
    const mockPresentations = [
      {
        id: 1,
        title: 'Introducción a la Inteligencia Artificial',
        topic: 'Inteligencia Artificial',
        audience: 'Estudiantes universitarios',
        duration: '45 minutos',
        slides: 12,
        status: 'completed',
        createdAt: '2025-01-20',
        lastModified: '2025-01-22',
        views: 45,
        style: 'professional',
        thumbnail: '/api/placeholder/300/200'
      },
      {
        id: 2,
        title: 'Machine Learning en la Práctica',
        topic: 'Machine Learning',
        audience: 'Profesionales',
        duration: '60 minutos',
        slides: 18,
        status: 'draft',
        createdAt: '2025-01-25',
        lastModified: '2025-01-25',
        views: 12,
        style: 'modern',
        thumbnail: '/api/placeholder/300/200'
      },
      {
        id: 3,
        title: 'Metodologías de Investigación Científica',
        topic: 'Metodología de Investigación',
        audience: 'Investigadores',
        duration: '90 minutos',
        slides: 25,
        status: 'completed',
        createdAt: '2025-01-15',
        lastModified: '2025-01-18',
        views: 78,
        style: 'academic',
        thumbnail: '/api/placeholder/300/200'
      }
    ]
    setPresentations(mockPresentations)
  }, [])

  const handleCreatePresentation = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)
    
    try {
      // Simular progreso de generación
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 500)

      // Generar contenido con IA
      const response = await aiService.generateEducationalContent(
        'presentation',
        newPresentation.topic,
        {
          audience: newPresentation.audience,
          duration: newPresentation.duration,
          style: newPresentation.style
        }
      )

      clearInterval(progressInterval)
      setGenerationProgress(100)

      // Crear nueva presentación
      const presentationData = {
        id: Date.now(),
        title: newPresentation.title,
        topic: newPresentation.topic,
        audience: newPresentation.audience,
        duration: newPresentation.duration,
        slides: response.content.slides.length,
        status: 'draft',
        createdAt: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0],
        views: 0,
        style: newPresentation.style,
        content: response.content,
        thumbnail: '/api/placeholder/300/200'
      }

      setPresentations(prev => [presentationData, ...prev])
      
      // Reset form
      setNewPresentation({
        title: '',
        topic: '',
        audience: '',
        duration: '',
        style: 'professional',
        includeImages: true,
        includeCharts: false
      })
      
      setTimeout(() => {
        setIsCreateDialogOpen(false)
        setIsGenerating(false)
        setGenerationProgress(0)
      }, 1000)

    } catch (error) {
      console.error('Error generando presentación:', error)
      setIsGenerating(false)
      setGenerationProgress(0)
    }
  }

  const handleDeletePresentation = (presentationId) => {
    setPresentations(prev => prev.filter(p => p.id !== presentationId))
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { label: 'Completada', variant: 'default', color: 'bg-green-100 text-green-800' },
      draft: { label: 'Borrador', variant: 'secondary', color: 'bg-yellow-100 text-yellow-800' },
      generating: { label: 'Generando', variant: 'outline', color: 'bg-blue-100 text-blue-800' }
    }
    const config = statusConfig[status] || statusConfig.draft
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getStyleIcon = (style) => {
    switch (style) {
      case 'professional':
        return <FileText className="w-4 h-4 text-blue-600" />
      case 'modern':
        return <Sparkles className="w-4 h-4 text-purple-600" />
      case 'academic':
        return <BarChart3 className="w-4 h-4 text-green-600" />
      default:
        return <Presentation className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Creador de Presentaciones</h1>
          <p className="text-gray-600 mt-2">
            Crea presentaciones profesionales asistidas por inteligencia artificial
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Nueva Presentación</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <span>Crear Presentación con IA</span>
              </DialogTitle>
            </DialogHeader>
            
            {isGenerating ? (
              <div className="space-y-6 py-6">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Generando tu presentación...
                  </h3>
                  <p className="text-gray-600 mb-4">
                    La IA está creando contenido personalizado para tu audiencia
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progreso</span>
                    <span>{generationProgress}%</span>
                  </div>
                  <Progress value={generationProgress} className="w-full" />
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <p>✓ Analizando tema y audiencia</p>
                  <p>✓ Generando estructura de contenido</p>
                  <p>✓ Creando diapositivas</p>
                  {generationProgress > 50 && <p>✓ Optimizando diseño</p>}
                  {generationProgress > 80 && <p>✓ Finalizando presentación</p>}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="title">Título de la Presentación</Label>
                    <Input
                      id="title"
                      value={newPresentation.title}
                      onChange={(e) => setNewPresentation(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ej: Introducción a la Inteligencia Artificial"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="topic">Tema Principal</Label>
                    <Input
                      id="topic"
                      value={newPresentation.topic}
                      onChange={(e) => setNewPresentation(prev => ({ ...prev, topic: e.target.value }))}
                      placeholder="Ej: Machine Learning"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="duration">Duración</Label>
                    <Select value={newPresentation.duration} onValueChange={(value) => setNewPresentation(prev => ({ ...prev, duration: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar duración" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15 minutos">15 minutos</SelectItem>
                        <SelectItem value="30 minutos">30 minutos</SelectItem>
                        <SelectItem value="45 minutos">45 minutos</SelectItem>
                        <SelectItem value="60 minutos">60 minutos</SelectItem>
                        <SelectItem value="90 minutos">90 minutos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="audience">Audiencia Objetivo</Label>
                  <Select value={newPresentation.audience} onValueChange={(value) => setNewPresentation(prev => ({ ...prev, audience: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar audiencia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Estudiantes universitarios">Estudiantes universitarios</SelectItem>
                      <SelectItem value="Profesionales">Profesionales</SelectItem>
                      <SelectItem value="Investigadores">Investigadores</SelectItem>
                      <SelectItem value="Público general">Público general</SelectItem>
                      <SelectItem value="Especialistas">Especialistas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="style">Estilo de Presentación</Label>
                  <Select value={newPresentation.style} onValueChange={(value) => setNewPresentation(prev => ({ ...prev, style: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Profesional</SelectItem>
                      <SelectItem value="modern">Moderno</SelectItem>
                      <SelectItem value="academic">Académico</SelectItem>
                      <SelectItem value="creative">Creativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Wand2 className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Asistencia de IA</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        La IA generará automáticamente el contenido, estructura y sugerencias visuales 
                        basándose en tu tema y audiencia objetivo.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleCreatePresentation}
                    disabled={!newPresentation.title || !newPresentation.topic || !newPresentation.audience}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Generar con IA
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Presentaciones</p>
                <p className="text-2xl font-bold text-gray-900">{presentations.length}</p>
              </div>
              <Presentation className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Diapositivas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {presentations.reduce((sum, p) => sum + p.slides, 0)}
                </p>
              </div>
              <FileText className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Visualizaciones</p>
                <p className="text-2xl font-bold text-gray-900">
                  {presentations.reduce((sum, p) => sum + p.views, 0)}
                </p>
              </div>
              <Eye className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {presentations.filter(p => p.status === 'completed').length}
                </p>
              </div>
              <Sparkles className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Presentations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {presentations.map((presentation) => (
          <Card key={presentation.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{presentation.title}</CardTitle>
                  <div className="flex items-center space-x-2 mb-3">
                    {getStatusBadge(presentation.status)}
                    <div className="flex items-center space-x-1">
                      {getStyleIcon(presentation.style)}
                      <span className="text-sm text-gray-600 capitalize">{presentation.style}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Presentation className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">{presentation.slides} diapositivas</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Audiencia</p>
                  <p className="text-gray-600">{presentation.audience}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Duración</p>
                  <p className="text-gray-600">{presentation.duration}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Creada</p>
                  <p className="text-gray-600">{presentation.createdAt}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Vistas</p>
                  <p className="text-gray-600">{presentation.views}</p>
                </div>
              </div>
              
              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" size="sm" className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>Presentar</span>
                </Button>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDeletePresentation(presentation.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {presentations.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Presentation className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes presentaciones creadas
            </h3>
            <p className="text-gray-600 mb-4">
              Utiliza la IA para crear presentaciones profesionales de manera rápida y eficiente.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Brain className="w-4 h-4 mr-2" />
              Crear con IA
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

