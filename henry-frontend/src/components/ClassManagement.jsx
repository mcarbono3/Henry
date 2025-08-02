import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { 
  BookOpen, 
  Plus, 
  Users, 
  Calendar, 
  FileText, 
  Video,
  Link,
  Edit,
  Trash2,
  Eye,
  Upload,
  Download,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function ClassManagement() {
  const { userProfile } = useAuth()
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newClass, setNewClass] = useState({
    name: '',
    description: '',
    subject: '',
    semester: '',
    schedule: '',
    capacity: '',
    status: 'active'
  })

  // Datos simulados de clases
  useEffect(() => {
    const mockClasses = [
      {
        id: 1,
        name: 'Introducción a la Inteligencia Artificial',
        description: 'Curso fundamental sobre conceptos básicos de IA, algoritmos de aprendizaje automático y aplicaciones prácticas.',
        subject: 'Ciencias de la Computación',
        semester: '2025-1',
        schedule: 'Lunes y Miércoles 10:00-12:00',
        capacity: 30,
        enrolled: 25,
        status: 'active',
        createdAt: '2025-01-15',
        materials: [
          { id: 1, name: 'Introducción a IA.pdf', type: 'pdf', size: '2.5 MB' },
          { id: 2, name: 'Algoritmos ML.pptx', type: 'presentation', size: '5.1 MB' },
          { id: 3, name: 'Video: Redes Neuronales', type: 'video', url: 'https://example.com/video1' }
        ],
        assignments: [
          { id: 1, title: 'Ensayo sobre IA', dueDate: '2025-02-15', status: 'active' },
          { id: 2, title: 'Proyecto Final', dueDate: '2025-03-10', status: 'draft' }
        ]
      },
      {
        id: 2,
        name: 'Machine Learning Avanzado',
        description: 'Curso avanzado sobre técnicas de aprendizaje automático, deep learning y aplicaciones en investigación.',
        subject: 'Ciencias de la Computación',
        semester: '2025-1',
        schedule: 'Martes y Jueves 14:00-16:00',
        capacity: 20,
        enrolled: 18,
        status: 'active',
        createdAt: '2025-01-20',
        materials: [
          { id: 4, name: 'Deep Learning Fundamentals.pdf', type: 'pdf', size: '8.2 MB' },
          { id: 5, name: 'TensorFlow Tutorial', type: 'link', url: 'https://tensorflow.org/tutorials' }
        ],
        assignments: [
          { id: 3, title: 'Implementación CNN', dueDate: '2025-02-20', status: 'active' }
        ]
      },
      {
        id: 3,
        name: 'Metodología de la Investigación',
        description: 'Fundamentos de investigación científica, metodologías cualitativas y cuantitativas.',
        subject: 'Metodología',
        semester: '2025-1',
        schedule: 'Viernes 09:00-12:00',
        capacity: 25,
        enrolled: 22,
        status: 'active',
        createdAt: '2025-01-10',
        materials: [
          { id: 6, name: 'Guía de Investigación.pdf', type: 'pdf', size: '3.8 MB' }
        ],
        assignments: [
          { id: 4, title: 'Propuesta de Investigación', dueDate: '2025-02-28', status: 'active' }
        ]
      }
    ]
    setClasses(mockClasses)
  }, [])

  const handleCreateClass = () => {
    const classData = {
      id: Date.now(),
      ...newClass,
      capacity: parseInt(newClass.capacity),
      enrolled: 0,
      createdAt: new Date().toISOString().split('T')[0],
      materials: [],
      assignments: []
    }
    
    setClasses(prev => [...prev, classData])
    setNewClass({
      name: '',
      description: '',
      subject: '',
      semester: '',
      schedule: '',
      capacity: '',
      status: 'active'
    })
    setIsCreateDialogOpen(false)
  }

  const handleDeleteClass = (classId) => {
    setClasses(prev => prev.filter(c => c.id !== classId))
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Activa', variant: 'default' },
      draft: { label: 'Borrador', variant: 'secondary' },
      completed: { label: 'Completada', variant: 'outline' },
      cancelled: { label: 'Cancelada', variant: 'destructive' }
    }
    const config = statusConfig[status] || statusConfig.active
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-4 h-4 text-red-600" />
      case 'presentation':
        return <FileText className="w-4 h-4 text-orange-600" />
      case 'video':
        return <Video className="w-4 h-4 text-blue-600" />
      case 'link':
        return <Link className="w-4 h-4 text-green-600" />
      default:
        return <FileText className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Clases</h1>
          <p className="text-gray-600 mt-2">
            Administra tus clases, materiales y estudiantes
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Nueva Clase</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nueva Clase</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre de la Clase</Label>
                  <Input
                    id="name"
                    value={newClass.name}
                    onChange={(e) => setNewClass(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: Introducción a la IA"
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Materia</Label>
                  <Input
                    id="subject"
                    value={newClass.subject}
                    onChange={(e) => setNewClass(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Ej: Ciencias de la Computación"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={newClass.description}
                  onChange={(e) => setNewClass(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descripción detallada del curso..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="semester">Semestre</Label>
                  <Input
                    id="semester"
                    value={newClass.semester}
                    onChange={(e) => setNewClass(prev => ({ ...prev, semester: e.target.value }))}
                    placeholder="2025-1"
                  />
                </div>
                <div>
                  <Label htmlFor="capacity">Capacidad</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={newClass.capacity}
                    onChange={(e) => setNewClass(prev => ({ ...prev, capacity: e.target.value }))}
                    placeholder="30"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Estado</Label>
                  <Select value={newClass.status} onValueChange={(value) => setNewClass(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activa</SelectItem>
                      <SelectItem value="draft">Borrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="schedule">Horario</Label>
                <Input
                  id="schedule"
                  value={newClass.schedule}
                  onChange={(e) => setNewClass(prev => ({ ...prev, schedule: e.target.value }))}
                  placeholder="Lunes y Miércoles 10:00-12:00"
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateClass}>
                  Crear Clase
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clases</p>
                <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Estudiantes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {classes.reduce((sum, c) => sum + c.enrolled, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clases Activas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {classes.filter(c => c.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Materiales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {classes.reduce((sum, c) => sum + c.materials.length, 0)}
                </p>
              </div>
              <FileText className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{classItem.name}</CardTitle>
                  <p className="text-sm text-gray-600 mb-3">{classItem.description}</p>
                  {getStatusBadge(classItem.status)}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Materia</p>
                  <p className="text-gray-600">{classItem.subject}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Semestre</p>
                  <p className="text-gray-600">{classItem.semester}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Horario</p>
                  <p className="text-gray-600">{classItem.schedule}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Estudiantes</p>
                  <p className="text-gray-600">{classItem.enrolled}/{classItem.capacity}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700">Materiales</h4>
                  <Badge variant="outline">{classItem.materials.length}</Badge>
                </div>
                <div className="space-y-2 max-h-24 overflow-y-auto">
                  {classItem.materials.slice(0, 3).map((material) => (
                    <div key={material.id} className="flex items-center space-x-2 text-sm">
                      {getTypeIcon(material.type)}
                      <span className="flex-1 truncate">{material.name}</span>
                      {material.size && (
                        <span className="text-gray-400">{material.size}</span>
                      )}
                    </div>
                  ))}
                  {classItem.materials.length > 3 && (
                    <p className="text-xs text-gray-500">
                      +{classItem.materials.length - 3} más...
                    </p>
                  )}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700">Tareas</h4>
                  <Badge variant="outline">{classItem.assignments.length}</Badge>
                </div>
                <div className="space-y-2">
                  {classItem.assignments.slice(0, 2).map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between text-sm">
                      <span className="flex-1 truncate">{assignment.title}</span>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-500">{assignment.dueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" size="sm" className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>Ver Detalles</span>
                </Button>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDeleteClass(classItem.id)}
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

      {classes.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes clases creadas
            </h3>
            <p className="text-gray-600 mb-4">
              Comienza creando tu primera clase para gestionar estudiantes y materiales.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Primera Clase
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

