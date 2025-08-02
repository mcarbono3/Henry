import { createContext, useContext, useEffect, useState } from 'react'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  doc,
  setDoc,
  getDoc,
  db
} from '../config/firebase'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Función para registrar usuario
  async function register(email, password, userData) {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(email, password)
      
      // Actualizar perfil de Firebase Auth
      await updateProfile(firebaseUser, {
        displayName: userData.fullName
      })

      // Crear documento de usuario en Firestore
      const userDoc = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        fullName: userData.fullName,
        role: userData.role,
        createdAt: new Date().toISOString(),
        ...userData
      }

      await setDoc(doc(db, 'users', firebaseUser.uid), userDoc)
      
      return firebaseUser
    } catch (error) {
      console.error('Error en registro:', error)
      throw error
    }
  }

  // Función para iniciar sesión
  async function login(email, password) {
    try {
      const result = await signInWithEmailAndPassword(email, password)
      return result.user
    } catch (error) {
      console.error('Error en login:', error)
      throw error
    }
  }

  // Función para cerrar sesión
  async function logout() {
    try {
      await signOut()
      setUser(null)
      setUserProfile(null)
    } catch (error) {
      console.error('Error en logout:', error)
      throw error
    }
  }

  // Función para obtener perfil de usuario
  async function getUserProfile(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        return userDoc.data()
      }
      return null
    } catch (error) {
      console.error('Error obteniendo perfil:', error)
      return null
    }
  }

  // Función para actualizar perfil
  async function updateUserProfile(uid, updates) {
    try {
      await setDoc(doc(db, 'users', uid), updates, { merge: true })
      const updatedProfile = await getUserProfile(uid)
      setUserProfile(updatedProfile)
      return updatedProfile
    } catch (error) {
      console.error('Error actualizando perfil:', error)
      throw error
    }
  }

  // Efecto para escuchar cambios de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        // Obtener perfil del usuario desde Firestore
        const profile = await getUserProfile(firebaseUser.uid)
        setUserProfile(profile)
      } else {
        setUser(null)
        setUserProfile(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    user,
    userProfile,
    loading,
    register,
    login,
    logout,
    getUserProfile,
    updateUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

