import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  BookOpen, 
  Users, 
  Brain, 
  Presentation, 
  GraduationCap, 
  Settings,
  Plus,
  TrendingUp,
  Clock,
  Bell,
  Calendar,
  FileText,
  BarChart3
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
  const { user, userProfile } = useAuth()
  const [stats, setStats] = useState({
    classes: 0,
    presentations: 0,
    students: 0,
    assignments: 0
  })

  useEffect(() => {
    // Simular carga de estadísticas
    setStats({
      classes: userProfile?.role === 'profesor' ? 5 : 3,
      presentations: userProfile?.role === 'profesor' ? 12 : 0,
      students: userProfile?.role === 'profesor' ? 45 : 0,
      assignments: userProfile?.role === 'estudiante' ? 8 : 15
    })
  }, [userProfile])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  const getRoleSpecificContent = () => {
    if (userProfile?.role === 'profesor') {
      return (
        <>
          {/* Stats Cards for Professor */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">Clases Activas</CardTitle>
                <BookOpen className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">{stats.classes}</div>
                <p className="text-xs text-blue-600">+2 este semestre</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">Presentaciones</CardTitle>
                <Presentation className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">{stats.presentations}</div>
                <p className="text-xs text-green-600">+3 esta semana</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-700">Estudiantes</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">{stats.students}</div>
                <p className="text-xs text-purple-600">En todas las clases</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-700">Evaluaciones</CardTitle>
                <FileText className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900">{stats.assignments}</div>
                <p className="text-xs text-orange-600">Pendientes de revisar</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions for Professor */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="w-5 h-5 mr-2 text-blue-600" />
                  Acciones Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Presentation className="w-4 h-4 mr-2" />
                  Crear Nueva Presentación
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Crear Nueva Clase
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Generar Cuestionario
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Brain className="w-4 h-4 mr-2" />
                  Consultar Asistente IA
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-green-600" />
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Presentación "Algoritmos IA" creada</p>
                    <p className="text-xs text-gray-500">Hace 2 horas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">15 estudiantes completaron tarea</p>
                    <p className="text-xs text-gray-500">Hace 4 horas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nueva clase "Machine Learning" publicada</p>
                    <p className="text-xs text-gray-500">Ayer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )
    }

    if (userProfile?.role === 'estudiante') {
      return (
        <>
          {/* Stats Cards for Student */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">Clases Inscritas</CardTitle>
                <BookOpen className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">{stats.classes}</div>
                <p className="text-xs text-blue-600">Este semestre</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-700">Tareas Pendientes</CardTitle>
                <FileText className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900">{stats.assignments}</div>
                <p className="text-xs text-orange-600">Por entregar</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">Progreso</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">85%</div>
                <p className="text-xs text-green-600">Promedio general</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-700">Horas de Estudio</CardTitle>
                <Clock className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">24h</div>
                <p className="text-xs text-purple-600">Esta semana</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions for Student */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-blue-600" />
                  Tutor Virtual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">
                  ¿Necesitas ayuda con algún tema? Tu tutor de IA está aquí para asistirte.
                </p>
                <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Brain className="w-4 h-4 mr-2" />
                  Iniciar Chat con IA
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Generar Resumen
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Crear Ejercicios
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-green-600" />
                  Próximas Entregas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Ensayo de Literatura</p>
                    <p className="text-xs text-gray-500">Literatura Contemporánea</p>
                  </div>
                  <Badge variant="destructive">Mañana</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Proyecto de Programación</p>
                    <p className="text-xs text-gray-500">Algoritmos y Estructuras</p>
                  </div>
                  <Badge variant="secondary">3 días</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Examen de Matemáticas</p>
                    <p className="text-xs text-gray-500">Cálculo Diferencial</p>
                  </div>
                  <Badge variant="outline">1 semana</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )
    }

    // Default content for admin or other roles
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Panel de Administración</CardTitle>
            <CardDescription>Gestiona usuarios y configuraciones del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Acceder al Panel Admin</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {getGreeting()}, {userProfile?.fullName || user?.displayName || 'Usuario'}
        </h1>
        <p className="text-gray-600">
          {userProfile?.role === 'profesor' && 'Gestiona tus clases y crea contenido educativo innovador'}
          {userProfile?.role === 'estudiante' && 'Continúa tu aprendizaje con el apoyo de la IA'}
          {userProfile?.role === 'administrador' && 'Supervisa y administra la plataforma HENRY'}
        </p>
      </div>

      {/* Role-specific content */}
      {getRoleSpecificContent()}

      {/* Recent Notifications */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2 text-blue-600" />
            Notificaciones Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Bienvenido a HENRY</p>
                <p className="text-xs text-gray-500">
                  Explora todas las funcionalidades de la plataforma y comienza a usar la IA para potenciar tu experiencia educativa.
                </p>
                <p className="text-xs text-gray-400 mt-1">Hace 5 minutos</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Sistema actualizado</p>
                <p className="text-xs text-gray-500">
                  Nuevas funcionalidades de IA disponibles. Descubre las mejoras en el asistente virtual.
                </p>
                <p className="text-xs text-gray-400 mt-1">Hace 2 horas</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

