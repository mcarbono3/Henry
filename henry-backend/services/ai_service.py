import random
import time
from datetime import datetime, timedelta

class AIService:
    """Servicio de IA para generar contenido educativo y asistencia académica"""
    
    def __init__(self):
        self.response_templates = {
            'profesor': {
                'greeting': "¡Hola, {name}! Soy tu asistente de IA especializado en docencia e investigación. ¿En qué puedo ayudarte hoy?",
                'presentation': "Te ayudo a crear presentaciones profesionales para tus clases",
                'research': "Puedo asistirte con metodologías de investigación y análisis de datos",
                'quiz': "Genero cuestionarios personalizados para evaluar a tus estudiantes",
                'planning': "Te ayudo a planificar clases y estructurar contenido educativo"
            },
            'estudiante': {
                'greeting': "¡Hola, {name}! Soy tu tutor virtual personalizado. Estoy aquí para ayudarte con tus estudios. ¿Qué tema te gustaría explorar?",
                'explanation': "Puedo explicarte conceptos complejos de manera sencilla",
                'homework': "Te ayudo a resolver ejercicios paso a paso",
                'study': "Creo planes de estudio personalizados para tus exámenes",
                'summary': "Resumo materiales extensos para facilitar tu aprendizaje"
            },
            'administrador': {
                'greeting': "¡Hola, {name}! Soy tu asistente administrativo. Puedo ayudarte con análisis de datos, gestión de usuarios y optimización del sistema.",
                'analytics': "Genero reportes y análisis de rendimiento del sistema",
                'management': "Asisto en la gestión de usuarios y recursos",
                'optimization': "Proporciono recomendaciones para mejorar la plataforma"
            }
        }
    
    def generate_response(self, message, user_role, user_name):
        """Genera respuesta contextual basada en el rol del usuario"""
        message_lower = message.lower()
        
        # Respuestas específicas por palabras clave
        if any(word in message_lower for word in ['hola', 'hello', 'hi', 'buenos días', 'buenas tardes']):
            return self._get_greeting_response(user_role, user_name)
        
        if user_role == 'profesor':
            return self._generate_professor_response(message_lower, user_name)
        elif user_role == 'estudiante':
            return self._generate_student_response(message_lower, user_name)
        elif user_role == 'administrador':
            return self._generate_admin_response(message_lower, user_name)
        
        return self._generate_generic_response(message, user_name)
    
    def _get_greeting_response(self, user_role, user_name):
        """Genera respuesta de saludo personalizada"""
        templates = self.response_templates.get(user_role, {})
        greeting = templates.get('greeting', f"¡Hola, {user_name}! ¿En qué puedo ayudarte?")
        return greeting.format(name=user_name)
    
    def _generate_professor_response(self, message, user_name):
        """Genera respuestas específicas para profesores"""
        if any(word in message for word in ['presentación', 'presentation', 'slides']):
            return f"¡Perfecto, {user_name}! Puedo ayudarte a crear una presentación profesional. Para generar contenido personalizado, necesito conocer:\n\n• El tema principal de la presentación\n• La audiencia objetivo (estudiantes, colegas, etc.)\n• La duración deseada\n• El estilo preferido (académico, profesional, moderno)\n\n¿Podrías proporcionarme estos detalles?"
        
        elif any(word in message for word in ['cuestionario', 'quiz', 'examen', 'evaluación']):
            return f"Excelente idea, {user_name}. Puedo generar cuestionarios personalizados para evaluar a tus estudiantes. Puedo crear:\n\n• Preguntas de opción múltiple\n• Preguntas de verdadero/falso\n• Preguntas de respuesta corta\n• Preguntas de ensayo\n\n¿Sobre qué tema te gustaría crear el cuestionario y qué nivel de dificultad prefieres?"
        
        elif any(word in message for word in ['clase', 'planificar', 'lesson', 'plan']):
            return f"Te ayudo a planificar tu clase, {user_name}. Para crear un plan efectivo, considera:\n\n• Objetivos de aprendizaje claros\n• Actividades interactivas\n• Recursos multimedia\n• Evaluación formativa\n• Tiempo para preguntas\n\n¿Cuál es el tema de la clase que quieres planificar?"
        
        elif any(word in message for word in ['investigación', 'research', 'paper', 'artículo']):
            return f"Como investigador, {user_name}, puedo asistirte con:\n\n• Revisión de literatura\n• Diseño de metodología\n• Análisis de datos\n• Estructura de papers\n• Citas y referencias\n\n¿En qué aspecto específico de tu investigación necesitas apoyo?"
        
        return f"Entiendo tu consulta, {user_name}. Como profesor, puedo ayudarte con creación de contenido educativo, planificación de clases, generación de evaluaciones y apoyo en investigación. ¿Podrías ser más específico sobre lo que necesitas?"
    
    def _generate_student_response(self, message, user_name):
        """Genera respuestas específicas para estudiantes"""
        if any(word in message for word in ['explicar', 'explain', 'entender', 'understand', 'concepto']):
            return f"¡Por supuesto, {user_name}! Me encanta explicar conceptos. Para darte la mejor explicación posible:\n\n• Dime qué concepto específico quieres que explique\n• Indica la materia o área de estudio\n• Menciona tu nivel actual de conocimiento\n\nAsí podré adaptar mi explicación a tu nivel y estilo de aprendizaje."
        
        elif any(word in message for word in ['ejercicio', 'problema', 'tarea', 'homework']):
            return f"Te ayudo a resolver ejercicios paso a paso, {user_name}. Para darte la mejor asistencia:\n\n• Comparte el enunciado completo del problema\n• Indica la materia (matemáticas, física, química, etc.)\n• Dime qué parte específica te está causando dificultad\n\nTe guiaré a través de la solución de manera didáctica."
        
        elif any(word in message for word in ['examen', 'exam', 'estudiar', 'study', 'repasar']):
            return f"¡Perfecto, {user_name}! Te ayudo a prepararte para tu examen. Puedo:\n\n• Crear un plan de estudio personalizado\n• Generar preguntas de práctica\n• Resumir material extenso\n• Sugerir técnicas de memorización\n• Organizar sesiones de repaso\n\n¿De qué materia es tu examen y cuánto tiempo tienes para prepararte?"
        
        elif any(word in message for word in ['resumir', 'summary', 'resumen', 'material']):
            return f"Claro, {user_name}. Puedo resumir material de estudio para ti. Los resúmenes incluyen:\n\n• Puntos clave del contenido\n• Conceptos principales\n• Ejemplos importantes\n• Conexiones entre ideas\n\n¿Qué material específico te gustaría que resuma?"
        
        return f"Entiendo tu consulta, {user_name}. Como tu tutor virtual, puedo explicarte conceptos, ayudarte con ejercicios, crear planes de estudio y resumir material. ¿En qué tema específico necesitas ayuda?"
    
    def _generate_admin_response(self, message, user_name):
        """Genera respuestas específicas para administradores"""
        if any(word in message for word in ['estadísticas', 'stats', 'analytics', 'datos']):
            return f"Perfecto, {user_name}. Puedo generar análisis detallados del sistema:\n\n• Estadísticas de usuarios activos\n• Rendimiento de la plataforma\n• Uso de recursos\n• Patrones de actividad\n• Reportes de engagement\n\n¿Qué tipo de análisis específico necesitas?"
        
        elif any(word in message for word in ['usuarios', 'users', 'gestión', 'management']):
            return f"Te asisto con la gestión de usuarios, {user_name}:\n\n• Análisis de comportamiento de usuarios\n• Segmentación por roles\n• Identificación de usuarios inactivos\n• Recomendaciones de engagement\n\n¿Qué aspecto específico de la gestión de usuarios te interesa?"
        
        return f"Como administrador, {user_name}, puedo ayudarte con análisis de datos, gestión de usuarios, optimización del sistema y generación de reportes. ¿Qué necesitas específicamente?"
    
    def _generate_generic_response(self, message, user_name):
        """Genera respuesta genérica cuando no hay coincidencias específicas"""
        responses = [
            f"Interesante pregunta, {user_name}. ¿Podrías darme más detalles para poder ayudarte mejor?",
            f"Entiendo tu consulta, {user_name}. Para darte una respuesta más precisa, ¿podrías ser más específico?",
            f"Gracias por tu mensaje, {user_name}. ¿Podrías reformular tu pregunta o darme más contexto?",
            f"Estoy aquí para ayudarte, {user_name}. ¿Podrías explicarme mejor lo que necesitas?"
        ]
        return random.choice(responses)
    
    def generate_presentation(self, title, topic, duration, audience, style):
        """Genera estructura de presentación con IA"""
        # Simular tiempo de procesamiento
        time.sleep(2)
        
        # Determinar número de slides basado en duración
        duration_minutes = int(duration.split()[0])
        slides_count = max(5, duration_minutes // 3)  # Aproximadamente 3 minutos por slide
        
        # Generar estructura de presentación
        presentation = {
            'title': title,
            'topic': topic,
            'duration': duration,
            'audience': audience,
            'style': style,
            'slides_count': slides_count,
            'created_at': datetime.now().isoformat(),
            'slides': []
        }
        
        # Generar slides
        slide_templates = self._get_slide_templates(topic, audience, style)
        
        for i in range(slides_count):
            if i == 0:
                slide = {
                    'id': i + 1,
                    'type': 'title',
                    'title': title,
                    'subtitle': f'Una introducción completa a {topic}',
                    'content': f'Presentación dirigida a {audience}',
                    'notes': 'Slide de introducción - establecer el contexto y objetivos'
                }
            elif i == slides_count - 1:
                slide = {
                    'id': i + 1,
                    'type': 'conclusion',
                    'title': 'Conclusiones',
                    'content': self._generate_conclusion_content(topic),
                    'notes': 'Resumir puntos clave y próximos pasos'
                }
            else:
                template = random.choice(slide_templates)
                slide = {
                    'id': i + 1,
                    'type': 'content',
                    'title': template['title'].format(topic=topic),
                    'content': template['content'].format(topic=topic, audience=audience),
                    'notes': template['notes']
                }
            
            presentation['slides'].append(slide)
        
        return presentation
    
    def _get_slide_templates(self, topic, audience, style):
        """Obtiene plantillas de slides según el tema y audiencia"""
        templates = [
            {
                'title': 'Conceptos Fundamentales de {topic}',
                'content': '• Definición y alcance\n• Principios básicos\n• Importancia en el contexto actual\n• Aplicaciones principales',
                'notes': 'Establecer bases teóricas sólidas'
            },
            {
                'title': 'Historia y Evolución de {topic}',
                'content': '• Orígenes y desarrollo\n• Hitos importantes\n• Evolución tecnológica\n• Estado actual',
                'notes': 'Proporcionar contexto histórico'
            },
            {
                'title': 'Aplicaciones Prácticas',
                'content': '• Casos de uso reales\n• Ejemplos de implementación\n• Beneficios observados\n• Lecciones aprendidas',
                'notes': 'Conectar teoría con práctica'
            },
            {
                'title': 'Desafíos y Oportunidades',
                'content': '• Retos actuales\n• Limitaciones conocidas\n• Oportunidades futuras\n• Áreas de investigación',
                'notes': 'Discutir aspectos críticos'
            },
            {
                'title': 'Metodologías y Herramientas',
                'content': '• Enfoques metodológicos\n• Herramientas disponibles\n• Mejores prácticas\n• Recursos recomendados',
                'notes': 'Proporcionar recursos prácticos'
            }
        ]
        return templates
    
    def _generate_conclusion_content(self, topic):
        """Genera contenido de conclusión"""
        return f"""• Hemos explorado los aspectos fundamentales de {topic}
• Las aplicaciones prácticas demuestran su relevancia
• Los desafíos actuales representan oportunidades
• El futuro promete desarrollos emocionantes

¿Preguntas o comentarios?"""
    
    def generate_quiz(self, topic, difficulty, question_count, question_type):
        """Genera cuestionario con IA"""
        time.sleep(1.5)
        
        quiz = {
            'topic': topic,
            'difficulty': difficulty,
            'question_count': question_count,
            'question_type': question_type,
            'created_at': datetime.now().isoformat(),
            'questions': []
        }
        
        for i in range(question_count):
            if question_type == 'multiple_choice':
                question = self._generate_multiple_choice_question(topic, difficulty, i + 1)
            elif question_type == 'true_false':
                question = self._generate_true_false_question(topic, difficulty, i + 1)
            elif question_type == 'short_answer':
                question = self._generate_short_answer_question(topic, difficulty, i + 1)
            else:
                question = self._generate_essay_question(topic, difficulty, i + 1)
            
            quiz['questions'].append(question)
        
        return quiz
    
    def _generate_multiple_choice_question(self, topic, difficulty, number):
        """Genera pregunta de opción múltiple"""
        questions = [
            f"¿Cuál es el concepto fundamental de {topic}?",
            f"¿Qué característica principal define {topic}?",
            f"¿Cuál es la aplicación más común de {topic}?",
            f"¿Qué ventaja principal ofrece {topic}?"
        ]
        
        return {
            'id': number,
            'type': 'multiple_choice',
            'question': random.choice(questions),
            'options': [
                f"Opción A relacionada con {topic}",
                f"Opción B sobre {topic}",
                f"Opción C acerca de {topic}",
                f"Opción D referente a {topic}"
            ],
            'correct_answer': 0,
            'explanation': f"La respuesta correcta se basa en los principios fundamentales de {topic}",
            'points': 10 if difficulty == 'easy' else 15 if difficulty == 'medium' else 20
        }
    
    def _generate_true_false_question(self, topic, difficulty, number):
        """Genera pregunta verdadero/falso"""
        statements = [
            f"{topic} es un concepto fundamental en su área de estudio",
            f"Las aplicaciones de {topic} son limitadas en el contexto actual",
            f"{topic} requiere conocimientos especializados para su implementación",
            f"El futuro de {topic} depende de avances tecnológicos"
        ]
        
        return {
            'id': number,
            'type': 'true_false',
            'question': random.choice(statements),
            'correct_answer': random.choice([True, False]),
            'explanation': f"Esta afirmación sobre {topic} se basa en evidencia empírica",
            'points': 5 if difficulty == 'easy' else 8 if difficulty == 'medium' else 12
        }
    
    def _generate_short_answer_question(self, topic, difficulty, number):
        """Genera pregunta de respuesta corta"""
        questions = [
            f"Define brevemente {topic} y menciona sus características principales",
            f"Explica la importancia de {topic} en el contexto actual",
            f"Describe una aplicación práctica de {topic}",
            f"¿Cuáles son los principales desafíos de {topic}?"
        ]
        
        return {
            'id': number,
            'type': 'short_answer',
            'question': random.choice(questions),
            'sample_answer': f"Respuesta modelo sobre {topic} que incluye definición, características y ejemplos relevantes",
            'points': 15 if difficulty == 'easy' else 20 if difficulty == 'medium' else 25
        }
    
    def _generate_essay_question(self, topic, difficulty, number):
        """Genera pregunta de ensayo"""
        questions = [
            f"Analiza críticamente el impacto de {topic} en la sociedad moderna",
            f"Compara y contrasta diferentes enfoques de {topic}",
            f"Evalúa las ventajas y desventajas de implementar {topic}",
            f"Propone una solución innovadora utilizando {topic}"
        ]
        
        return {
            'id': number,
            'type': 'essay',
            'question': random.choice(questions),
            'rubric': {
                'content': 'Profundidad y precisión del contenido',
                'analysis': 'Calidad del análisis crítico',
                'structure': 'Organización y estructura del ensayo',
                'sources': 'Uso apropiado de fuentes y referencias'
            },
            'points': 25 if difficulty == 'easy' else 35 if difficulty == 'medium' else 50
        }
    
    def explain_concept(self, concept, subject, level, user_role):
        """Explica un concepto académico"""
        time.sleep(1)
        
        explanations = {
            'beginner': f"""
**{concept}** es un concepto fundamental en {subject}.

**Definición Simple:**
{concept} se puede entender como [definición básica adaptada al nivel principiante].

**¿Por qué es Importante?**
• Es la base para entender temas más avanzados
• Tiene aplicaciones prácticas en la vida real
• Te ayudará en cursos posteriores

**Ejemplo Sencillo:**
Imagina que {concept} es como [analogía simple y relatable].

**Para Recordar:**
• Punto clave 1 sobre {concept}
• Punto clave 2 sobre {concept}
• Punto clave 3 sobre {concept}
""",
            'intermediate': f"""
**{concept}** - Explicación Intermedia

**Definición:**
{concept} es [definición técnica pero accesible] en el contexto de {subject}.

**Características Principales:**
• Característica 1: [explicación detallada]
• Característica 2: [explicación detallada]
• Característica 3: [explicación detallada]

**Aplicaciones:**
• Aplicación práctica 1
• Aplicación práctica 2
• Aplicación en investigación

**Relación con Otros Conceptos:**
{concept} se relaciona con [otros conceptos] porque [explicación de conexiones].

**Ejemplo Práctico:**
[Ejemplo detallado que muestra el concepto en acción]
""",
            'advanced': f"""
**{concept}** - Análisis Avanzado

**Marco Teórico:**
{concept} se fundamenta en [teorías base] y representa [significado profundo] dentro de {subject}.

**Dimensiones del Concepto:**
• Dimensión teórica: [análisis profundo]
• Dimensión metodológica: [enfoques de aplicación]
• Dimensión práctica: [implementación real]

**Estado del Arte:**
• Desarrollos recientes en {concept}
• Debates actuales en la literatura
• Tendencias futuras de investigación

**Implicaciones:**
• Para la teoría: [implicaciones teóricas]
• Para la práctica: [implicaciones prácticas]
• Para la investigación: [direcciones futuras]

**Críticas y Limitaciones:**
[Análisis crítico de las limitaciones del concepto]
"""
        }
        
        return explanations.get(level, explanations['intermediate'])
    
    def solve_problem(self, problem, subject, user_role):
        """Resuelve un problema paso a paso"""
        time.sleep(2)
        
        return f"""
**Problema:** {problem}

**Análisis del Problema:**
1. **Identificación:** Este es un problema de {subject} que requiere [tipo de análisis]
2. **Datos Dados:** [Identificar información disponible]
3. **Objetivo:** [Clarificar qué se busca resolver]

**Estrategia de Solución:**
**Paso 1:** [Primer paso lógico]
- Explicación detallada del paso
- Por qué es necesario este paso

**Paso 2:** [Segundo paso]
- Desarrollo del procedimiento
- Cálculos o razonamiento necesario

**Paso 3:** [Tercer paso]
- Continuación del proceso
- Verificación de resultados parciales

**Solución Final:**
[Respuesta completa con explicación]

**Verificación:**
• Comprobar que la respuesta tiene sentido
• Revisar unidades (si aplica)
• Validar con el contexto del problema

**Conceptos Clave Utilizados:**
• Concepto 1: [breve explicación]
• Concepto 2: [breve explicación]

¿Te gustaría que profundice en algún paso específico?
"""
    
    def generate_study_plan(self, subject, duration, goals, current_level, available_time):
        """Genera plan de estudio personalizado"""
        time.sleep(1.5)
        
        # Calcular distribución de tiempo
        total_days = self._parse_duration(duration)
        daily_hours = self._parse_time(available_time)
        
        plan = {
            'subject': subject,
            'duration': duration,
            'total_days': total_days,
            'daily_hours': daily_hours,
            'current_level': current_level,
            'goals': goals,
            'created_at': datetime.now().isoformat(),
            'phases': []
        }
        
        # Generar fases del plan
        phases = [
            {
                'name': 'Fundamentos',
                'duration_days': total_days // 3,
                'objectives': [
                    f'Dominar conceptos básicos de {subject}',
                    'Establecer base sólida de conocimiento',
                    'Familiarizarse con terminología clave'
                ],
                'activities': [
                    'Lectura de material introductorio',
                    'Resolución de ejercicios básicos',
                    'Creación de mapas conceptuales'
                ]
            },
            {
                'name': 'Desarrollo',
                'duration_days': total_days // 3,
                'objectives': [
                    'Aplicar conceptos en problemas complejos',
                    'Conectar diferentes áreas del tema',
                    'Desarrollar pensamiento crítico'
                ],
                'activities': [
                    'Estudio de casos prácticos',
                    'Resolución de problemas intermedios',
                    'Discusión de temas avanzados'
                ]
            },
            {
                'name': 'Consolidación',
                'duration_days': total_days // 3,
                'objectives': [
                    'Integrar todo el conocimiento adquirido',
                    'Prepararse para evaluación final',
                    'Identificar áreas para estudio futuro'
                ],
                'activities': [
                    'Repaso general de todos los temas',
                    'Simulacros de examen',
                    'Síntesis y reflexión final'
                ]
            }
        ]
        
        plan['phases'] = phases
        
        # Generar cronograma semanal
        plan['weekly_schedule'] = self._generate_weekly_schedule(daily_hours, subject)
        
        return plan
    
    def _parse_duration(self, duration):
        """Parsea duración en días"""
        if 'semana' in duration.lower():
            weeks = int(''.join(filter(str.isdigit, duration)))
            return weeks * 7
        elif 'mes' in duration.lower():
            months = int(''.join(filter(str.isdigit, duration)))
            return months * 30
        else:
            return int(''.join(filter(str.isdigit, duration)))
    
    def _parse_time(self, time_str):
        """Parsea tiempo disponible por día"""
        hours = ''.join(filter(str.isdigit, time_str))
        return int(hours) if hours else 2
    
    def _generate_weekly_schedule(self, daily_hours, subject):
        """Genera horario semanal de estudio"""
        activities = [
            'Lectura y estudio teórico',
            'Resolución de ejercicios',
            'Repaso y síntesis',
            'Evaluación y autoevaluación'
        ]
        
        schedule = {}
        days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
        
        for day in days:
            if day in ['Sábado', 'Domingo']:
                schedule[day] = {
                    'hours': daily_hours // 2,
                    'activity': 'Repaso y consolidación',
                    'focus': 'Revisión de la semana'
                }
            else:
                schedule[day] = {
                    'hours': daily_hours,
                    'activity': random.choice(activities),
                    'focus': f'Tema específico de {subject}'
                }
        
        return schedule
    
    def provide_research_assistance(self, research_topic, assistance_type, academic_level, field_of_study):
        """Proporciona asistencia en investigación"""
        time.sleep(2)
        
        assistance_types = {
            'literature_review': f"""
**Revisión de Literatura para: {research_topic}**

**Estrategia de Búsqueda:**
• Bases de datos recomendadas: [lista específica para {field_of_study}]
• Palabras clave principales: [términos relevantes]
• Criterios de inclusión/exclusión
• Período de tiempo a cubrir

**Estructura Sugerida:**
1. **Introducción al tema**
2. **Marco teórico fundamental**
3. **Estudios empíricos relevantes**
4. **Gaps en la literatura**
5. **Síntesis y conclusiones**

**Fuentes Clave a Considerar:**
• Artículos seminales en {research_topic}
• Revisiones sistemáticas recientes
• Meta-análisis disponibles
• Trabajos de autores reconocidos

**Herramientas de Gestión:**
• Mendeley o Zotero para referencias
• Matrices de análisis de literatura
• Mapas conceptuales de relaciones
""",
            'methodology': f"""
**Diseño Metodológico para: {research_topic}**

**Enfoque de Investigación:**
• Paradigma: [Cuantitativo/Cualitativo/Mixto]
• Tipo de estudio: [Descriptivo/Exploratorio/Explicativo]
• Diseño específico: [Experimental/Correlacional/Estudio de caso]

**Población y Muestra:**
• Población objetivo
• Criterios de selección
• Tamaño de muestra recomendado
• Técnica de muestreo apropiada

**Instrumentos de Recolección:**
• Herramientas de medición
• Validación de instrumentos
• Procedimientos de aplicación
• Consideraciones éticas

**Plan de Análisis:**
• Análisis estadístico apropiado
• Software recomendado
• Interpretación de resultados
• Limitaciones metodológicas
""",
            'data_analysis': f"""
**Plan de Análisis de Datos para: {research_topic}**

**Análisis Descriptivo:**
• Estadísticas descriptivas básicas
• Visualizaciones apropiadas
• Identificación de patrones
• Detección de valores atípicos

**Análisis Inferencial:**
• Pruebas estadísticas apropiadas
• Verificación de supuestos
• Interpretación de p-valores
• Tamaño del efecto

**Herramientas Recomendadas:**
• Software estadístico: R, SPSS, Python
• Visualización: ggplot2, matplotlib
• Análisis cualitativo: NVivo, Atlas.ti

**Presentación de Resultados:**
• Tablas y figuras efectivas
• Narrativa clara de hallazgos
• Discusión de implicaciones
""",
            'writing': f"""
**Guía de Escritura Académica para: {research_topic}**

**Estructura del Paper:**
1. **Título:** Claro, específico y atractivo
2. **Resumen:** 150-250 palabras, estructura IMRAD
3. **Introducción:** Contexto, problema, objetivos
4. **Marco Teórico:** Fundamentos conceptuales
5. **Metodología:** Diseño y procedimientos
6. **Resultados:** Hallazgos principales
7. **Discusión:** Interpretación y implicaciones
8. **Conclusiones:** Síntesis y futuras direcciones

**Estilo Académico:**
• Voz activa vs. pasiva apropiada
• Tiempo verbal consistente
• Terminología precisa
• Transiciones efectivas

**Referencias y Citas:**
• Estilo APA/MLA según requerimientos
• Citas apropiadas y éticas
• Balance entre fuentes primarias y secundarias
"""
        }
        
        return assistance_types.get(assistance_type, "Tipo de asistencia no reconocido")
    
    def provide_feedback(self, content, content_type, criteria, academic_level):
        """Proporciona retroalimentación sobre trabajo académico"""
        time.sleep(1.5)
        
        feedback = {
            'content_type': content_type,
            'academic_level': academic_level,
            'overall_score': random.randint(70, 95),
            'timestamp': datetime.now().isoformat(),
            'detailed_feedback': {}
        }
        
        if content_type == 'essay':
            feedback['detailed_feedback'] = {
                'structure': {
                    'score': random.randint(75, 90),
                    'comments': 'La estructura del ensayo es clara con introducción, desarrollo y conclusión bien definidos.',
                    'suggestions': 'Considera agregar transiciones más fluidas entre párrafos.'
                },
                'content': {
                    'score': random.randint(80, 95),
                    'comments': 'El contenido demuestra comprensión profunda del tema.',
                    'suggestions': 'Incluye más ejemplos específicos para fortalecer argumentos.'
                },
                'style': {
                    'score': random.randint(70, 85),
                    'comments': 'El estilo académico es apropiado para el nivel.',
                    'suggestions': 'Varía la longitud de las oraciones para mejorar fluidez.'
                },
                'sources': {
                    'score': random.randint(75, 90),
                    'comments': 'Uso apropiado de fuentes académicas.',
                    'suggestions': 'Incluye más fuentes primarias para fortalecer argumentos.'
                }
            }
        
        # Generar comentarios generales
        feedback['general_comments'] = f"""
**Fortalezas Identificadas:**
• Demuestras comprensión sólida del tema
• La organización del contenido es lógica
• El nivel académico es apropiado

**Áreas de Mejora:**
• Considera profundizar en ciertos aspectos
• Revisa la gramática y ortografía
• Fortalece la argumentación con más evidencia

**Recomendaciones Específicas:**
• Revisa la introducción para mayor impacto
• Desarrolla más las ideas principales
• Mejora la conclusión con síntesis más clara

**Próximos Pasos:**
• Incorpora las sugerencias mencionadas
• Solicita revisión de pares
• Considera recursos adicionales de escritura académica
"""
        
        return feedback

