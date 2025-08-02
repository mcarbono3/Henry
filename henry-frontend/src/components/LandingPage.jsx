import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  BookOpen, 
  Users, 
  Brain, 
  Presentation, 
  GraduationCap, 
  Settings,
  ArrowRight,
  CheckCircle,
  Sparkles
} from 'lucide-react'

export default function LandingPage() {
  const features = [
    {
      icon: Brain,
      title: "Asistentes de IA Personalizados",
      description: "Agentes de inteligencia artificial especializados para profesores e investigadores, y tutores virtuales para estudiantes."
    },
    {
      icon: Presentation,
      title: "Creación de Presentaciones con IA",
      description: "Herramientas avanzadas para generar presentaciones dinámicas con visualizaciones 2D/3D interactivas."
    },
    {
      icon: BookOpen,
      title: "Gestión Integral de Clases",
      description: "Organiza y administra materiales de clase, incluyendo documentos, videos y enlaces externos."
    },
    {
      icon: Users,
      title: "Perfiles de Investigación",
      description: "Espacios dedicados para presentar CV, publicaciones, proyectos de investigación y enlaces relevantes."
    },
    {
      icon: GraduationCap,
      title: "Herramientas de Evaluación",
      description: "Generación automática de cuestionarios, quizzes y exámenes asistida por IA."
    },
    {
      icon: Settings,
      title: "Sistema de Notificaciones",
      description: "Mantente informado sobre eventos importantes, nuevas tareas y cambios en las clases."
    }
  ]

  const roles = [
    {
      title: "Profesores/Investigadores",
      description: "Herramientas especializadas para docencia e investigación",
      features: [
        "Asistente de IA para docencia",
        "Editor de presentaciones avanzado",
        "Gestión de clases y materiales",
        "Perfiles de investigación",
        "Generación de cuestionarios"
      ]
    },
    {
      title: "Estudiantes",
      description: "Apoyo personalizado para el aprendizaje",
      features: [
        "Tutor virtual de IA",
        "Acceso a materiales de clase",
        "Resúmenes automáticos",
        "Generador de ejercicios",
        "Librería de herramientas"
      ]
    },
    {
      title: "Administradores",
      description: "Control y gestión del sistema",
      features: [
        "Panel de control avanzado",
        "Gestión de usuarios",
        "Estadísticas del sistema",
        "Configuración global",
        "Monitoreo de actividad"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">HENRY</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Iniciar Sesión</Button>
              </Link>
              <Link to="/register">
                <Button>Registrarse</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
            <Sparkles className="w-4 h-4 mr-1" />
            Potenciado por Inteligencia Artificial
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              HENRY
            </span>
            <br />
            <span className="text-3xl md:text-4xl text-gray-700">
              Holistic Educational Network for Research and Youth
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Una plataforma educativa integral que revoluciona la experiencia de enseñanza-aprendizaje 
            mediante la integración de inteligencia artificial avanzada, diseñada específicamente para 
            la educación superior.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Comenzar Ahora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Ver Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Funcionalidades Innovadoras
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              HENRY combina herramientas tradicionales de gestión académica con capacidades 
              avanzadas de IA para crear una experiencia educativa única.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Diseñado para Cada Rol
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              HENRY se adapta a las necesidades específicas de cada usuario, 
              proporcionando herramientas y funcionalidades personalizadas.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-center">{role.title}</CardTitle>
                  <CardDescription className="text-center">{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {role.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para Transformar tu Experiencia Educativa?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Únete a HENRY y descubre cómo la inteligencia artificial puede potenciar 
            tu enseñanza o aprendizaje.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Registrarse Gratis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">HENRY</span>
            </div>
            <p className="text-gray-400 text-center md:text-right">
              © 2025 HENRY - Holistic Educational Network for Research and Youth
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

