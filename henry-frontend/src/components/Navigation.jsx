import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Home,
  BookOpen, 
  Users, 
  Brain, 
  Presentation, 
  GraduationCap, 
  Settings,
  LogOut,
  FileText,
  BarChart3,
  Library,
  Calendar,
  Bell,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Navigation() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, userProfile, logout } = useAuth()
  const location = useLocation()

  const getNavigationItems = () => {
    const baseItems = [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: Home,
        current: location.pathname === '/dashboard'
      }
    ]

    if (userProfile?.role === 'profesor') {
      return [
        ...baseItems,
        {
          name: 'Mis Clases',
          href: '/classes',
          icon: BookOpen,
          current: location.pathname === '/classes'
        },
        {
          name: 'Presentaciones',
          href: '/presentations',
          icon: Presentation,
          current: location.pathname === '/presentations'
        },
        {
          name: 'Asistente IA',
          href: '/ai-assistant',
          icon: Brain,
          current: location.pathname === '/ai-assistant',
          badge: 'Nuevo'
        },
        {
          name: 'Investigación',
          href: '/research',
          icon: FileText,
          current: location.pathname === '/research'
        },
        {
          name: 'Evaluaciones',
          href: '/assessments',
          icon: BarChart3,
          current: location.pathname === '/assessments'
        },
        {
          name: 'Estudiantes',
          href: '/students',
          icon: Users,
          current: location.pathname === '/students'
        }
      ]
    }

    if (userProfile?.role === 'estudiante') {
      return [
        ...baseItems,
        {
          name: 'Mis Clases',
          href: '/classes',
          icon: BookOpen,
          current: location.pathname === '/classes'
        },
        {
          name: 'Tutor IA',
          href: '/ai-assistant',
          icon: Brain,
          current: location.pathname === '/ai-assistant',
          badge: 'Nuevo'
        },
        {
          name: 'Materiales',
          href: '/materials',
          icon: Library,
          current: location.pathname === '/materials'
        },
        {
          name: 'Calendario',
          href: '/calendar',
          icon: Calendar,
          current: location.pathname === '/calendar'
        },
        {
          name: 'Herramientas',
          href: '/tools',
          icon: Settings,
          current: location.pathname === '/tools'
        }
      ]
    }

    if (userProfile?.role === 'administrador') {
      return [
        ...baseItems,
        {
          name: 'Usuarios',
          href: '/admin/users',
          icon: Users,
          current: location.pathname === '/admin/users'
        },
        {
          name: 'Estadísticas',
          href: '/admin/stats',
          icon: BarChart3,
          current: location.pathname === '/admin/stats'
        },
        {
          name: 'Configuración',
          href: '/admin/settings',
          icon: Settings,
          current: location.pathname === '/admin/settings'
        }
      ]
    }

    return baseItems
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const getUserInitials = () => {
    const name = userProfile?.fullName || user?.displayName || 'Usuario'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const navigationItems = getNavigationItems()

  return (
    <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg transition-all duration-300 z-40 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">HENRY</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 h-8 w-8"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.photoURL} />
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userProfile?.fullName || user?.displayName || 'Usuario'}
              </p>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="secondary" 
                  className="text-xs"
                >
                  {userProfile?.role === 'profesor' ? 'Profesor' : 
                   userProfile?.role === 'estudiante' ? 'Estudiante' : 
                   userProfile?.role === 'administrador' ? 'Admin' : 'Usuario'}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
              item.current
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon
              className={`flex-shrink-0 h-5 w-5 ${
                item.current ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
              } ${collapsed ? 'mx-auto' : 'mr-3'}`}
            />
            {!collapsed && (
              <>
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <Badge 
                    variant={item.current ? "secondary" : "outline"} 
                    className="text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </>
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 p-2">
        <Link
          to="/profile"
          className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors ${
            location.pathname === '/profile' ? 'bg-gray-100' : ''
          }`}
        >
          <User className={`flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500 ${
            collapsed ? 'mx-auto' : 'mr-3'
          }`} />
          {!collapsed && <span>Mi Perfil</span>}
        </Link>

        <Button
          variant="ghost"
          onClick={handleLogout}
          className={`w-full justify-start text-gray-600 hover:bg-gray-50 hover:text-gray-900 ${
            collapsed ? 'px-2' : ''
          }`}
        >
          <LogOut className={`h-5 w-5 text-gray-400 ${
            collapsed ? 'mx-auto' : 'mr-3'
          }`} />
          {!collapsed && <span>Cerrar Sesión</span>}
        </Button>

        {!collapsed && (
          <div className="mt-4 px-2">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
              <div className="flex items-center">
                <Brain className="w-5 h-5 text-blue-600 mr-2" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-blue-900">IA Disponible</p>
                  <p className="text-xs text-blue-600">
                    {userProfile?.role === 'profesor' ? 'Asistente de docencia' : 'Tutor personal'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

