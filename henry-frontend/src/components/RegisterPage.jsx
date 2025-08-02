import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { GraduationCap, Eye, EyeOff, Loader2, User, BookOpen, Settings } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Datos básicos
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    
    // Datos específicos por rol
    institution: '',
    department: '',
    specialization: '',
    researchAreas: '',
    academicLevel: '',
    studyProgram: '',
    interests: '',
    bio: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const validateStep1 = () => {
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword || !formData.role) {
      setError('Todos los campos son obligatorios')
      return false
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return false
    }
    return true
  }

  const handleNextStep = () => {
    setError('')
    if (validateStep1()) {
      setStep(2)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await register(formData.email, formData.password, formData)
      navigate('/dashboard')
    } catch (error) {
      console.error('Error en registro:', error)
      setError(getErrorMessage(error.code))
    } finally {
      setLoading(false)
    }
  }

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Ya existe una cuenta con este correo electrónico.'
      case 'auth/invalid-email':
        return 'El formato del correo electrónico no es válido.'
      case 'auth/weak-password':
        return 'La contraseña es muy débil.'
      default:
        return 'Error al crear la cuenta. Intenta nuevamente.'
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'profesor':
        return <BookOpen className="w-5 h-5" />
      case 'estudiante':
        return <User className="w-5 h-5" />
      case 'administrador':
        return <Settings className="w-5 h-5" />
      default:
        return null
    }
  }

  const getRoleFields = () => {
    if (formData.role === 'profesor') {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="institution">Institución</Label>
              <Input
                id="institution"
                name="institution"
                placeholder="Universidad o institución"
                value={formData.institution}
                onChange={handleChange}
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Departamento/Facultad</Label>
              <Input
                id="department"
                name="department"
                placeholder="Departamento o facultad"
                value={formData.department}
                onChange={handleChange}
                className="bg-white"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialization">Especialización</Label>
            <Input
              id="specialization"
              name="specialization"
              placeholder="Tu área de especialización"
              value={formData.specialization}
              onChange={handleChange}
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="researchAreas">Áreas de Investigación</Label>
            <Textarea
              id="researchAreas"
              name="researchAreas"
              placeholder="Describe tus áreas de investigación..."
              value={formData.researchAreas}
              onChange={handleChange}
              className="bg-white"
              rows={3}
            />
          </div>
        </>
      )
    }

    if (formData.role === 'estudiante') {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="institution">Institución</Label>
              <Input
                id="institution"
                name="institution"
                placeholder="Universidad o institución"
                value={formData.institution}
                onChange={handleChange}
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="academicLevel">Nivel Académico</Label>
              <Select onValueChange={(value) => handleSelectChange('academicLevel', value)}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Selecciona tu nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pregrado">Pregrado</SelectItem>
                  <SelectItem value="posgrado">Posgrado</SelectItem>
                  <SelectItem value="maestria">Maestría</SelectItem>
                  <SelectItem value="doctorado">Doctorado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="studyProgram">Programa de Estudios</Label>
            <Input
              id="studyProgram"
              name="studyProgram"
              placeholder="Tu programa o carrera"
              value={formData.studyProgram}
              onChange={handleChange}
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interests">Intereses Académicos</Label>
            <Textarea
              id="interests"
              name="interests"
              placeholder="Describe tus intereses académicos..."
              value={formData.interests}
              onChange={handleChange}
              className="bg-white"
              rows={3}
            />
          </div>
        </>
      )
    }

    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">HENRY</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Crear Cuenta</h1>
          <p className="text-gray-600">Únete a la comunidad educativa de HENRY</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Datos Básicos</span>
            </div>
            <div className={`w-8 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Información Adicional</span>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">
              {step === 1 ? 'Información Básica' : 'Completa tu Perfil'}
            </CardTitle>
            <CardDescription className="text-center">
              {step === 1 
                ? 'Ingresa tus datos básicos para comenzar' 
                : 'Información adicional para personalizar tu experiencia'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNextStep(); } : handleSubmit} className="space-y-4">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nombre Completo</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Tu nombre completo"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Rol</Label>
                    <Select onValueChange={(value) => handleSelectChange('role', value)} required>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Selecciona tu rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="profesor">
                          <div className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Profesor/Investigador
                          </div>
                        </SelectItem>
                        <SelectItem value="estudiante">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            Estudiante
                          </div>
                        </SelectItem>
                        <SelectItem value="administrador">
                          <div className="flex items-center">
                            <Settings className="w-4 h-4 mr-2" />
                            Administrador
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Mínimo 6 caracteres"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="bg-white pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirma tu contraseña"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          className="bg-white pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Continuar
                  </Button>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      {getRoleIcon(formData.role)}
                      <span className="ml-2 font-medium text-blue-900">
                        Registrándose como: {formData.role === 'profesor' ? 'Profesor/Investigador' : 
                                           formData.role === 'estudiante' ? 'Estudiante' : 'Administrador'}
                      </span>
                    </div>
                  </div>

                  {getRoleFields()}

                  <div className="space-y-2">
                    <Label htmlFor="bio">Biografía (Opcional)</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      placeholder="Cuéntanos un poco sobre ti..."
                      value={formData.bio}
                      onChange={handleChange}
                      className="bg-white"
                      rows={3}
                    />
                  </div>

                  <div className="flex space-x-4">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1"
                    >
                      Atrás
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creando cuenta...
                        </>
                      ) : (
                        'Crear Cuenta'
                      )}
                    </Button>
                  </div>
                </>
              )}
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{' '}
                <Link 
                  to="/login" 
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Iniciar sesión
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

