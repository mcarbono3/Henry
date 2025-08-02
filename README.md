# HENRY: Holistic Educational Network for Research and Youth

## 🎓 Descripción del Proyecto

HENRY es una plataforma educativa integral diseñada para revolucionar la experiencia de aprendizaje mediante la integración de inteligencia artificial avanzada. La plataforma conecta a profesores, investigadores y estudiantes en un ecosistema colaborativo que optimiza tanto la enseñanza como el aprendizaje.

### ✨ Características Principales

- **🤖 Asistente de IA Personalizado**: Tutor virtual adaptado a cada rol de usuario
- **📚 Gestión Avanzada de Clases**: Administración completa de cursos y materiales
- **🎯 Creador de Presentaciones**: Generación automática de contenido educativo
- **📊 Sistema de Evaluaciones**: Herramientas inteligentes de evaluación
- **🔬 Apoyo en Investigación**: Asistencia especializada para investigadores
- **📱 Interfaz Responsiva**: Diseño adaptable a todos los dispositivos

## 🏗️ Arquitectura del Sistema

### Frontend (React)
- **Framework**: React 18 con Vite
- **UI Components**: Tailwind CSS + shadcn/ui
- **Estado**: Context API
- **Routing**: React Router v6
- **Autenticación**: JWT tokens

### Backend (Flask)
- **Framework**: Flask con extensiones
- **Base de Datos**: SQLAlchemy (SQLite/PostgreSQL)
- **Autenticación**: Flask-JWT-Extended
- **API**: RESTful con CORS habilitado
- **IA**: Servicio personalizado de generación de contenido

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js** 18+ y npm/yarn
- **Python** 3.8+ y pip
- **Git** para control de versiones

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd henry-project
```

### 2. Configurar el Backend

```bash
# Navegar al directorio del backend
cd backend/henry-backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En macOS/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Inicializar base de datos
python app.py
```

### 3. Configurar el Frontend

```bash
# Navegar al directorio del frontend
cd frontend/henry-frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus configuraciones

# Iniciar servidor de desarrollo
npm run dev
```

### 4. Acceder a la Aplicación

- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:5000
- **Documentación API**: http://localhost:5000/api/docs

## 👥 Cuentas de Demostración

Para probar la plataforma, utiliza estas cuentas predefinidas:

### Profesor/Investigador
- **Email**: profesor@henry.edu
- **Contraseña**: demo123
- **Características**: Gestión de clases, creación de presentaciones, evaluaciones

### Estudiante
- **Email**: estudiante@henry.edu
- **Contraseña**: demo123
- **Características**: Tutor virtual, materiales de estudio, evaluaciones

### Administrador
- **Email**: admin@henry.edu
- **Contraseña**: demo123
- **Características**: Gestión de usuarios, estadísticas del sistema

## 🎯 Funcionalidades por Rol

### 👨‍🏫 Profesor/Investigador

#### Gestión de Clases
- Crear y administrar cursos
- Subir materiales educativos
- Gestionar estudiantes inscritos
- Seguimiento de progreso

#### Asistente de IA Especializado
- Creación automática de presentaciones
- Generación de cuestionarios
- Planificación de clases
- Apoyo en investigación académica

#### Herramientas de Evaluación
- Crear evaluaciones personalizadas
- Calificación automática
- Análisis de rendimiento
- Retroalimentación inteligente

### 👨‍🎓 Estudiante

#### Tutor Virtual Personalizado
- Explicación de conceptos complejos
- Resolución de ejercicios paso a paso
- Preparación para exámenes
- Planes de estudio personalizados

#### Gestión de Aprendizaje
- Acceso a materiales de clase
- Seguimiento de tareas
- Calendario académico
- Progreso personalizado

#### Herramientas de Estudio
- Resúmenes automáticos
- Flashcards inteligentes
- Técnicas de estudio
- Grupos colaborativos

### 👨‍💼 Administrador

#### Gestión del Sistema
- Administración de usuarios
- Estadísticas de uso
- Configuración de la plataforma
- Monitoreo de rendimiento

## 📁 Estructura del Proyecto

```
henry-project/
├── frontend/henry-frontend/          # Aplicación React
│   ├── src/
│   │   ├── components/              # Componentes React
│   │   ├── contexts/                # Context API
│   │   ├── services/                # Servicios y APIs
│   │   └── config/                  # Configuraciones
│   ├── public/                      # Archivos estáticos
│   └── package.json                 # Dependencias del frontend
├── backend/henry-backend/           # API Flask
│   ├── models/                      # Modelos de base de datos
│   ├── routes/                      # Rutas de la API
│   ├── services/                    # Lógica de negocio
│   ├── utils/                       # Utilidades
│   └── app.py                       # Aplicación principal
├── docs/                            # Documentación
│   ├── Manual_Usuario_Profesor.md   # Manual para profesores
│   ├── Manual_Usuario_Estudiante.md # Manual para estudiantes
│   └── API_Documentation.md         # Documentación de API
└── README.md                        # Este archivo
```

## 🔧 Configuración Avanzada

### Base de Datos

#### SQLite (Desarrollo)
```python
DATABASE_URL=sqlite:///henry.db
```

#### PostgreSQL (Producción)
```python
DATABASE_URL=postgresql://username:password@localhost/henry_db
```

### Integración con IA

Para habilitar funcionalidades avanzadas de IA:

1. Obtén una API key de OpenAI
2. Configura en `.env`:
```bash
OPENAI_API_KEY=tu-api-key-aqui
OPENAI_API_BASE=https://api.openai.com/v1
```

### Configuración de Correo

Para notificaciones por email:

```bash
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=tu-email@gmail.com
MAIL_PASSWORD=tu-app-password
```

## 🧪 Pruebas

### Backend
```bash
cd backend/henry-backend
python -m pytest tests/
```

### Frontend
```bash
cd frontend/henry-frontend
npm run test
```

## 📦 Despliegue

### Desarrollo Local
```bash
# Terminal 1 - Backend
cd backend/henry-backend
python app.py

# Terminal 2 - Frontend
cd frontend/henry-frontend
npm run dev
```

### Producción

#### Backend (Flask)
```bash
cd backend/henry-backend
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

#### Frontend (React)
```bash
cd frontend/henry-frontend
npm run build
# Servir archivos estáticos con nginx o similar
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Equipo de Desarrollo

- **Arquitectura del Sistema**: Diseño escalable y modular
- **Frontend Development**: React + Tailwind CSS
- **Backend Development**: Flask + SQLAlchemy
- **IA Integration**: Servicios personalizados de IA
- **UX/UI Design**: Interfaz intuitiva y responsiva

## 📞 Soporte

- **Documentación**: Ver carpeta `docs/`
- **Issues**: Reportar en GitHub Issues
- **Email**: soporte@henry.edu
- **Chat**: Disponible en la plataforma

## 🔄 Roadmap

### Versión 1.1 (Próxima)
- [ ] Integración con LMS externos
- [ ] Aplicación móvil nativa
- [ ] Análisis avanzado de aprendizaje
- [ ] Gamificación del aprendizaje

### Versión 1.2 (Futuro)
- [ ] Realidad virtual para clases
- [ ] Blockchain para certificaciones
- [ ] IA multimodal (voz, imagen, texto)
- [ ] Colaboración en tiempo real

## 🙏 Agradecimientos

- Comunidad educativa por feedback valioso
- Desarrolladores de código abierto
- Investigadores en IA educativa
- Beta testers y usuarios pioneros

---

**HENRY** - Transformando la educación con inteligencia artificial 🚀

*Versión 1.0.0 - Enero 2025*

