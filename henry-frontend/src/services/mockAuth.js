// Mock Authentication Service para desarrollo y demostración
// Simula Firebase Auth sin necesidad de configuración real

class MockAuthService {
  constructor() {
    this.users = [
      {
        uid: 'prof-001',
        email: 'profesor@henry.edu',
        displayName: 'Dr. María González',
        fullName: 'Dr. María González',
        role: 'profesor',
        institution: 'Universidad Nacional',
        department: 'Ciencias de la Computación',
        specialization: 'Inteligencia Artificial',
        researchAreas: 'Machine Learning, Deep Learning, NLP',
        bio: 'Profesora e investigadora especializada en IA aplicada a la educación.',
        createdAt: '2025-01-01T00:00:00Z'
      },
      {
        uid: 'student-001',
        email: 'estudiante@henry.edu',
        displayName: 'Carlos Rodríguez',
        fullName: 'Carlos Rodríguez',
        role: 'estudiante',
        institution: 'Universidad Nacional',
        academicLevel: 'pregrado',
        studyProgram: 'Ingeniería de Sistemas',
        interests: 'Desarrollo web, inteligencia artificial, bases de datos',
        bio: 'Estudiante apasionado por la tecnología y el aprendizaje continuo.',
        createdAt: '2025-01-15T00:00:00Z'
      },
      {
        uid: 'admin-001',
        email: 'admin@henry.edu',
        displayName: 'Ana Martínez',
        fullName: 'Ana Martínez',
        role: 'administrador',
        institution: 'HENRY Platform',
        department: 'Administración de Sistemas',
        bio: 'Administradora de la plataforma HENRY.',
        createdAt: '2024-12-01T00:00:00Z'
      }
    ]
    
    this.currentUser = null
    this.authStateListeners = []
  }

  // Simular login
  async signInWithEmailAndPassword(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (password === 'demo123') {
          const user = this.users.find(u => u.email === email)
          if (user) {
            this.currentUser = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: null
            }
            this.notifyAuthStateChange(this.currentUser)
            resolve({ user: this.currentUser })
          } else {
            reject({ code: 'auth/user-not-found' })
          }
        } else {
          reject({ code: 'auth/wrong-password' })
        }
      }, 1000)
    })
  }

  // Simular registro
  async createUserWithEmailAndPassword(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingUser = this.users.find(u => u.email === email)
        if (existingUser) {
          reject({ code: 'auth/email-already-in-use' })
        } else {
          const newUser = {
            uid: `user-${Date.now()}`,
            email: email,
            displayName: 'Nuevo Usuario',
            photoURL: null
          }
          this.currentUser = newUser
          this.notifyAuthStateChange(this.currentUser)
          resolve({ user: this.currentUser })
        }
      }, 1000)
    })
  }

  // Simular actualización de perfil
  async updateProfile(user, profile) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.currentUser) {
          this.currentUser.displayName = profile.displayName || this.currentUser.displayName
          this.currentUser.photoURL = profile.photoURL || this.currentUser.photoURL
        }
        resolve()
      }, 500)
    })
  }

  // Simular logout
  async signOut() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.currentUser = null
        this.notifyAuthStateChange(null)
        resolve()
      }, 500)
    })
  }

  // Simular listener de cambios de autenticación
  onAuthStateChanged(callback) {
    this.authStateListeners.push(callback)
    
    // Simular estado inicial
    setTimeout(() => {
      callback(this.currentUser)
    }, 100)

    // Retornar función para desuscribirse
    return () => {
      const index = this.authStateListeners.indexOf(callback)
      if (index > -1) {
        this.authStateListeners.splice(index, 1)
      }
    }
  }

  // Notificar cambios de estado a todos los listeners
  notifyAuthStateChange(user) {
    this.authStateListeners.forEach(callback => {
      callback(user)
    })
  }

  // Obtener perfil de usuario simulado
  async getUserProfile(uid) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userProfile = this.users.find(u => u.uid === uid)
        resolve(userProfile || null)
      }, 300)
    })
  }

  // Simular actualización de documento en Firestore
  async setDoc(docRef, data, options = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (options.merge) {
          // Simular merge de datos
          const existingUser = this.users.find(u => u.uid === docRef.id)
          if (existingUser) {
            Object.assign(existingUser, data)
          }
        } else {
          // Agregar nuevo usuario o reemplazar
          const existingIndex = this.users.findIndex(u => u.uid === docRef.id)
          if (existingIndex > -1) {
            this.users[existingIndex] = { ...this.users[existingIndex], ...data }
          } else {
            this.users.push(data)
          }
        }
        resolve()
      }, 500)
    })
  }

  // Simular obtención de documento
  async getDoc(docRef) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = this.users.find(u => u.uid === docRef.id)
        resolve({
          exists: () => !!user,
          data: () => user
        })
      }, 300)
    })
  }
}

// Crear instancia global del servicio mock
const mockAuthService = new MockAuthService()

// Simular objetos de Firebase
export const auth = {
  currentUser: null,
  signInWithEmailAndPassword: mockAuthService.signInWithEmailAndPassword.bind(mockAuthService),
  createUserWithEmailAndPassword: mockAuthService.createUserWithEmailAndPassword.bind(mockAuthService),
  signOut: mockAuthService.signOut.bind(mockAuthService),
  onAuthStateChanged: mockAuthService.onAuthStateChanged.bind(mockAuthService)
}

export const updateProfile = mockAuthService.updateProfile.bind(mockAuthService)

// Simular Firestore
export const db = {}

export const doc = (db, collection, id) => ({ collection, id })

export const setDoc = mockAuthService.setDoc.bind(mockAuthService)

export const getDoc = mockAuthService.getDoc.bind(mockAuthService)

export default mockAuthService

