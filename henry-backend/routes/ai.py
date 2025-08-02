from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from services.ai_service import AIService
from app import db
import time
import random

ai_bp = Blueprint('ai', __name__)

# Instancia del servicio de IA
ai_service = AIService()

@ai_bp.route('/chat', methods=['POST'])
@jwt_required()
def chat_with_ai():
    """Chat con el asistente de IA"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        data = request.get_json()
        message = data.get('message', '').strip()
        
        if not message:
            return jsonify({'error': 'Mensaje es requerido'}), 400
        
        # Simular tiempo de procesamiento
        time.sleep(random.uniform(1, 3))
        
        # Generar respuesta basada en el rol del usuario
        response = ai_service.generate_response(message, user.role, user.full_name)
        
        return jsonify({
            'response': response,
            'timestamp': time.time(),
            'user_role': user.role
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@ai_bp.route('/generate-presentation', methods=['POST'])
@jwt_required()
def generate_presentation():
    """Generar presentación con IA"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        data = request.get_json()
        
        # Validar datos requeridos
        required_fields = ['title', 'topic', 'duration', 'audience', 'style']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'El campo {field} es requerido'}), 400
        
        # Simular proceso de generación
        presentation_data = ai_service.generate_presentation(
            title=data['title'],
            topic=data['topic'],
            duration=data['duration'],
            audience=data['audience'],
            style=data['style']
        )
        
        return jsonify({
            'presentation': presentation_data,
            'message': 'Presentación generada exitosamente'
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@ai_bp.route('/generate-quiz', methods=['POST'])
@jwt_required()
def generate_quiz():
    """Generar cuestionario con IA"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'profesor':
            return jsonify({'error': 'Solo los profesores pueden generar cuestionarios'}), 403
        
        data = request.get_json()
        
        # Validar datos requeridos
        required_fields = ['topic', 'difficulty', 'question_count', 'question_type']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'El campo {field} es requerido'}), 400
        
        # Generar cuestionario
        quiz_data = ai_service.generate_quiz(
            topic=data['topic'],
            difficulty=data['difficulty'],
            question_count=data['question_count'],
            question_type=data['question_type']
        )
        
        return jsonify({
            'quiz': quiz_data,
            'message': 'Cuestionario generado exitosamente'
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@ai_bp.route('/explain-concept', methods=['POST'])
@jwt_required()
def explain_concept():
    """Explicar concepto académico"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        data = request.get_json()
        concept = data.get('concept', '').strip()
        subject = data.get('subject', '')
        level = data.get('level', 'intermediate')
        
        if not concept:
            return jsonify({'error': 'Concepto es requerido'}), 400
        
        # Generar explicación
        explanation = ai_service.explain_concept(
            concept=concept,
            subject=subject,
            level=level,
            user_role=user.role
        )
        
        return jsonify({
            'explanation': explanation,
            'concept': concept,
            'level': level
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@ai_bp.route('/solve-problem', methods=['POST'])
@jwt_required()
def solve_problem():
    """Resolver problema paso a paso"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        data = request.get_json()
        problem = data.get('problem', '').strip()
        subject = data.get('subject', '')
        
        if not problem:
            return jsonify({'error': 'Problema es requerido'}), 400
        
        # Resolver problema
        solution = ai_service.solve_problem(
            problem=problem,
            subject=subject,
            user_role=user.role
        )
        
        return jsonify({
            'solution': solution,
            'problem': problem
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@ai_bp.route('/study-plan', methods=['POST'])
@jwt_required()
def generate_study_plan():
    """Generar plan de estudio personalizado"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        data = request.get_json()
        
        # Validar datos requeridos
        required_fields = ['subject', 'duration', 'goals']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'El campo {field} es requerido'}), 400
        
        # Generar plan de estudio
        study_plan = ai_service.generate_study_plan(
            subject=data['subject'],
            duration=data['duration'],
            goals=data['goals'],
            current_level=data.get('current_level', 'beginner'),
            available_time=data.get('available_time', '2 hours/day')
        )
        
        return jsonify({
            'study_plan': study_plan,
            'message': 'Plan de estudio generado exitosamente'
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@ai_bp.route('/research-assistance', methods=['POST'])
@jwt_required()
def research_assistance():
    """Asistencia en investigación académica"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role not in ['profesor', 'estudiante']:
            return jsonify({'error': 'Función disponible solo para profesores y estudiantes'}), 403
        
        data = request.get_json()
        
        # Validar datos requeridos
        required_fields = ['research_topic', 'assistance_type']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'El campo {field} es requerido'}), 400
        
        # Generar asistencia de investigación
        assistance = ai_service.provide_research_assistance(
            research_topic=data['research_topic'],
            assistance_type=data['assistance_type'],
            academic_level=data.get('academic_level', 'undergraduate'),
            field_of_study=data.get('field_of_study', '')
        )
        
        return jsonify({
            'assistance': assistance,
            'topic': data['research_topic'],
            'type': data['assistance_type']
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@ai_bp.route('/feedback', methods=['POST'])
@jwt_required()
def provide_feedback():
    """Proporcionar retroalimentación sobre trabajo académico"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        data = request.get_json()
        
        # Validar datos requeridos
        required_fields = ['content', 'content_type']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'El campo {field} es requerido'}), 400
        
        # Generar retroalimentación
        feedback = ai_service.provide_feedback(
            content=data['content'],
            content_type=data['content_type'],
            criteria=data.get('criteria', []),
            academic_level=data.get('academic_level', 'undergraduate')
        )
        
        return jsonify({
            'feedback': feedback,
            'content_type': data['content_type']
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@ai_bp.route('/status', methods=['GET'])
def ai_status():
    """Estado del servicio de IA"""
    return jsonify({
        'status': 'operational',
        'version': '1.0.0',
        'features': [
            'chat_assistance',
            'presentation_generation',
            'quiz_generation',
            'concept_explanation',
            'problem_solving',
            'study_planning',
            'research_assistance',
            'feedback_provision'
        ],
        'supported_roles': ['estudiante', 'profesor', 'administrador']
    }), 200

