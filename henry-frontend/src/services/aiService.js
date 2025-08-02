// Servicio de IA simulado para desarrollo y demostración
// Simula la integración con Gemini API sin necesidad de configuración real

class MockAIService {
  constructor() {
    this.isConnected = true
    this.responses = {
      // Respuestas para profesores/investigadores
      profesor: {
        'crear presentación': 'Te ayudo a crear una presentación sobre el tema que necesites. ¿Podrías especificar el tema, el nivel académico de la audiencia y la duración aproximada? Puedo sugerir una estructura, generar contenido para cada diapositiva y recomendar elementos visuales apropiados.',
        
        'generar cuestionario': 'Perfecto, puedo ayudarte a crear un cuestionario personalizado. Necesito saber: ¿Sobre qué tema será el cuestionario? ¿Qué tipo de preguntas prefieres (opción múltiple, verdadero/falso, desarrollo)? ¿Cuántas preguntas necesitas? ¿Cuál es el nivel de dificultad deseado?',
        
        'planificar clase': 'Excelente idea planificar la clase con anticipación. Para ayudarte mejor, dime: ¿Cuál es el tema de la clase? ¿Cuánto tiempo durará? ¿Qué nivel académico tienen los estudiantes? ¿Hay algún objetivo de aprendizaje específico? Puedo sugerir una estructura, actividades interactivas y recursos complementarios.',
        
        'evaluar estudiantes': 'Te puedo ayudar a diseñar estrategias de evaluación efectivas. ¿Qué tipo de evaluación necesitas (formativa, sumativa, diagnóstica)? ¿Cuáles son los criterios de evaluación? ¿Prefieres rúbricas, escalas de calificación o evaluación narrativa? Puedo generar instrumentos de evaluación personalizados.',
        
        'investigación': 'Como asistente de investigación, puedo ayudarte con: análisis de literatura, diseño de metodologías, interpretación de datos, redacción académica, y búsqueda de fuentes relevantes. ¿En qué aspecto específico de tu investigación necesitas apoyo?',
        
        'default': 'Como tu asistente de IA especializado en docencia e investigación, estoy aquí para ayudarte con la creación de contenido educativo, planificación de clases, evaluación de estudiantes, investigación académica y cualquier tarea relacionada con tu labor educativa. ¿En qué puedo asistirte hoy?'
      },
      
      // Respuestas para estudiantes
      estudiante: {
        'explicar concepto': 'Te ayudo a entender cualquier concepto de manera clara y sencilla. ¿Qué tema específico te gustaría que te explique? Puedo usar ejemplos, analogías y diferentes enfoques para asegurarme de que comprendas completamente el material.',
        
        'resolver ejercicio': 'Perfecto, puedo guiarte paso a paso para resolver ejercicios. Comparte conmigo el ejercicio o problema que necesitas resolver, y te ayudaré con una explicación detallada del proceso, mostrándote cada paso y el razonamiento detrás de la solución.',
        
        'estudiar examen': 'Te ayudo a prepararte para tu examen de manera efectiva. ¿Sobre qué materia es el examen? ¿Qué temas específicos necesitas repasar? Puedo crear un plan de estudio personalizado, generar preguntas de práctica y explicarte los conceptos más importantes.',
        
        'resumir material': 'Puedo crear resúmenes claros y concisos de cualquier material de estudio. Comparte conmigo el contenido que necesitas resumir (texto, PDF, enlaces) y te proporcionaré un resumen estructurado con los puntos más importantes y conceptos clave.',
        
        'tareas': 'Te ayudo con tus tareas académicas proporcionando orientación, explicaciones y recursos. ¿Qué tipo de tarea necesitas completar? Puedo ayudarte a entender los requisitos, estructurar tu trabajo y revisar tu progreso.',
        
        'default': 'Soy tu tutor virtual personalizado, diseñado para apoyarte en tu proceso de aprendizaje. Puedo ayudarte a entender conceptos difíciles, resolver ejercicios, prepararte para exámenes, resumir material de estudio y mucho más. ¿En qué puedo ayudarte hoy?'
      },
      
      // Respuestas para administradores
      administrador: {
        'estadísticas': 'Te proporciono análisis detallados sobre el uso de la plataforma: usuarios activos, cursos más populares, rendimiento del sistema, métricas de engagement y tendencias de uso. ¿Qué tipo de estadísticas específicas necesitas revisar?',
        
        'gestión usuarios': 'Puedo ayudarte con la administración de usuarios: crear reportes de actividad, identificar patrones de uso, sugerir mejoras en la experiencia del usuario y analizar métricas de retención. ¿Qué aspecto de la gestión de usuarios te interesa?',
        
        'optimización': 'Analizo el rendimiento de la plataforma y sugiero optimizaciones basadas en datos de uso, feedback de usuarios y mejores prácticas. ¿Hay algún área específica que te gustaría optimizar?',
        
        'default': 'Como asistente administrativo de HENRY, puedo ayudarte con análisis de datos, gestión de usuarios, optimización del sistema, generación de reportes y toma de decisiones basada en métricas. ¿En qué aspecto de la administración necesitas apoyo?'
      }
    }
  }

  // Simular respuesta de IA basada en el rol del usuario y el mensaje
  async generateResponse(message, userRole = 'estudiante', context = {}) {
    return new Promise((resolve) => {
      // Simular tiempo de respuesta de API
      setTimeout(() => {
        const roleResponses = this.responses[userRole] || this.responses.estudiante
        const lowerMessage = message.toLowerCase()
        
        // Buscar respuesta específica basada en palabras clave
        let response = roleResponses.default
        
        for (const [key, value] of Object.entries(roleResponses)) {
          if (key !== 'default' && lowerMessage.includes(key)) {
            response = value
            break
          }
        }
        
        // Personalizar respuesta con contexto si está disponible
        if (context.userName) {
          response = `Hola ${context.userName}, ${response.toLowerCase()}`
        }
        
        resolve({
          success: true,
          response: response,
          timestamp: new Date().toISOString(),
          model: 'gemini-pro-mock',
          usage: {
            promptTokens: message.length,
            completionTokens: response.length,
            totalTokens: message.length + response.length
          }
        })
      }, 1000 + Math.random() * 2000) // 1-3 segundos de delay
    })
  }

  // Simular generación de contenido educativo
  async generateEducationalContent(type, topic, parameters = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let content = {}
        
        switch (type) {
          case 'presentation':
            content = this.generatePresentationContent(topic, parameters)
            break
          case 'quiz':
            content = this.generateQuizContent(topic, parameters)
            break
          case 'lesson_plan':
            content = this.generateLessonPlan(topic, parameters)
            break
          case 'summary':
            content = this.generateSummary(topic, parameters)
            break
          default:
            content = { error: 'Tipo de contenido no soportado' }
        }
        
        resolve({
          success: true,
          content: content,
          type: type,
          topic: topic,
          timestamp: new Date().toISOString()
        })
      }, 2000 + Math.random() * 3000)
    })
  }

  // Generar estructura de presentación
  generatePresentationContent(topic, params) {
    const slides = [
      {
        id: 1,
        title: `Introducción a ${topic}`,
        content: `Bienvenidos al estudio de ${topic}. En esta presentación exploraremos los conceptos fundamentales y aplicaciones prácticas.`,
        type: 'intro'
      },
      {
        id: 2,
        title: 'Objetivos de Aprendizaje',
        content: `Al finalizar esta sesión, los estudiantes podrán:\n• Comprender los conceptos básicos de ${topic}\n• Identificar aplicaciones prácticas\n• Analizar casos de estudio relevantes`,
        type: 'objectives'
      },
      {
        id: 3,
        title: 'Conceptos Fundamentales',
        content: `Los pilares fundamentales de ${topic} incluyen varios aspectos teóricos y prácticos que debemos dominar para una comprensión completa.`,
        type: 'content'
      },
      {
        id: 4,
        title: 'Aplicaciones Prácticas',
        content: `${topic} tiene múltiples aplicaciones en el mundo real, desde casos académicos hasta implementaciones industriales.`,
        type: 'applications'
      },
      {
        id: 5,
        title: 'Conclusiones',
        content: `Hemos explorado los aspectos más importantes de ${topic}. Las próximas sesiones profundizarán en temas específicos.`,
        type: 'conclusion'
      }
    ]
    
    return {
      title: `Presentación: ${topic}`,
      slides: slides,
      duration: params.duration || '45 minutos',
      audience: params.audience || 'Estudiantes universitarios',
      suggestions: [
        'Incluir ejemplos visuales para cada concepto',
        'Agregar actividades interactivas entre secciones',
        'Preparar preguntas para fomentar la participación'
      ]
    }
  }

  // Generar cuestionario
  generateQuizContent(topic, params) {
    const questions = [
      {
        id: 1,
        type: 'multiple_choice',
        question: `¿Cuál es el concepto más importante relacionado con ${topic}?`,
        options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
        correct: 0,
        explanation: `La respuesta correcta se basa en los fundamentos teóricos de ${topic}.`
      },
      {
        id: 2,
        type: 'true_false',
        question: `${topic} tiene aplicaciones prácticas en múltiples disciplinas.`,
        correct: true,
        explanation: `Verdadero. ${topic} es un campo interdisciplinario con amplia aplicabilidad.`
      },
      {
        id: 3,
        type: 'short_answer',
        question: `Explica brevemente la importancia de ${topic} en el contexto actual.`,
        sample_answer: `${topic} es relevante porque proporciona herramientas y metodologías esenciales para abordar desafíos contemporáneos.`
      }
    ]
    
    return {
      title: `Cuestionario: ${topic}`,
      questions: questions,
      totalQuestions: questions.length,
      estimatedTime: '15-20 minutos',
      difficulty: params.difficulty || 'intermedio'
    }
  }

  // Generar plan de clase
  generateLessonPlan(topic, params) {
    return {
      title: `Plan de Clase: ${topic}`,
      duration: params.duration || '90 minutos',
      objectives: [
        `Introducir los conceptos fundamentales de ${topic}`,
        'Fomentar la participación activa de los estudiantes',
        'Aplicar conocimientos a través de ejercicios prácticos'
      ],
      structure: [
        {
          phase: 'Introducción',
          duration: '15 min',
          activities: ['Presentación del tema', 'Activación de conocimientos previos']
        },
        {
          phase: 'Desarrollo',
          duration: '50 min',
          activities: ['Explicación teórica', 'Ejemplos prácticos', 'Discusión grupal']
        },
        {
          phase: 'Cierre',
          duration: '20 min',
          activities: ['Síntesis de conceptos', 'Evaluación formativa', 'Asignación de tareas']
        },
        {
          phase: 'Evaluación',
          duration: '5 min',
          activities: ['Retroalimentación de la sesión']
        }
      ],
      resources: [
        'Presentación digital',
        'Material de lectura complementario',
        'Ejercicios prácticos',
        'Plataforma HENRY para seguimiento'
      ]
    }
  }

  // Generar resumen
  generateSummary(topic, params) {
    return {
      title: `Resumen: ${topic}`,
      keyPoints: [
        `${topic} es un área de conocimiento fundamental en el contexto educativo actual`,
        'Los conceptos principales incluyen aspectos teóricos y aplicaciones prácticas',
        'La comprensión profunda requiere estudio sistemático y práctica constante',
        'Las aplicaciones se extienden a múltiples disciplinas y contextos profesionales'
      ],
      mainConcepts: [
        'Fundamentos teóricos',
        'Metodologías de aplicación',
        'Casos de estudio relevantes',
        'Tendencias futuras'
      ],
      recommendations: [
        'Revisar material complementario',
        'Practicar con ejercicios adicionales',
        'Participar en discusiones grupales',
        'Buscar aplicaciones en proyectos personales'
      ],
      estimatedReadingTime: '10-15 minutos'
    }
  }

  // Verificar estado de conexión
  async checkConnection() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          connected: this.isConnected,
          service: 'Gemini API Mock',
          version: '1.0.0',
          features: [
            'Conversación natural',
            'Generación de contenido educativo',
            'Análisis de texto',
            'Respuestas contextuales'
          ]
        })
      }, 500)
    })
  }
}

// Crear instancia global del servicio
const aiService = new MockAIService()

export default aiService

