// Configuración simplificada de Firebase con soporte para mock

// Importar servicio mock para desarrollo
import mockAuthService, { 
  auth as mockAuth, 
  updateProfile as mockUpdateProfile,
  db as mockDb,
  doc as mockDoc,
  setDoc as mockSetDoc,
  getDoc as mockGetDoc
} from '../services/mockAuth'

// Para desarrollo, usar siempre el mock
const USE_MOCK = true

console.log('🔧 Usando servicios de autenticación simulados para desarrollo')

export const auth = mockAuth
export const db = mockDb
export const storage = null
export const updateProfile = mockUpdateProfile
export const doc = mockDoc
export const setDoc = mockSetDoc
export const getDoc = mockGetDoc

// Exportar también funciones específicas que necesita AuthContext
export const createUserWithEmailAndPassword = mockAuth.createUserWithEmailAndPassword
export const signInWithEmailAndPassword = mockAuth.signInWithEmailAndPassword
export const signOut = mockAuth.signOut
export const onAuthStateChanged = mockAuth.onAuthStateChanged

export default null

