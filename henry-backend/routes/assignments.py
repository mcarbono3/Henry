from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from models.assignment import Assignment, Submission
from models.class_model import Class
from app import db
from datetime import datetime

assignments_bp = Blueprint('assignments', __name__)

@assignments_bp.route('/', methods=['GET'])
@jwt_required()
def get_assignments():
    """Obtener tareas según el rol del usuario"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        if user.role == 'profesor':
            # Profesores ven las tareas que han creado
            assignments = Assignment.query.filter_by(professor_id=user_id).all()
        elif user.role == 'estudiante':
            # Estudiantes ven tareas de sus clases (por ahora todas las activas)
            assignments = Assignment.query.filter_by(status='active').all()
        else:
            # Administradores ven todas las tareas
            assignments = Assignment.query.all()
        
        assignments_data = []
        for assignment in assignments:
            assignment_data = assignment.to_dict()
            assignment_data['stats'] = assignment.get_submission_stats()
            assignments_data.append(assignment_data)
        
        return jsonify({
            'assignments': assignments_data,
            'total': len(assignments_data)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@assignments_bp.route('/', methods=['POST'])
@jwt_required()
def create_assignment():
    """Crear nueva tarea (solo profesores)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'profesor':
            return jsonify({'error': 'Solo los profesores pueden crear tareas'}), 403
        
        data = request.get_json()
        
        # Validar datos requeridos
        required_fields = ['title', 'class_id', 'due_date']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'El campo {field} es requerido'}), 400
        
        # Verificar que la clase pertenece al profesor
        class_obj = Class.query.get(data['class_id'])
        if not class_obj or class_obj.professor_id != user_id:
            return jsonify({'error': 'Clase no encontrada o no tienes permisos'}), 403
        
        # Parsear fecha de entrega
        try:
            due_date = datetime.fromisoformat(data['due_date'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Formato de fecha inválido'}), 400
        
        # Crear nueva tarea
        assignment = Assignment(
            title=data['title'],
            description=data.get('description', ''),
            type=data.get('type', 'essay'),
            max_points=data.get('max_points', 100.0),
            due_date=due_date,
            allow_late_submission=data.get('allow_late_submission', False),
            max_attempts=data.get('max_attempts', 1),
            time_limit=data.get('time_limit'),
            class_id=data['class_id'],
            professor_id=user_id,
            status=data.get('status', 'active')
        )
        
        db.session.add(assignment)
        db.session.commit()
        
        return jsonify({
            'message': 'Tarea creada exitosamente',
            'assignment': assignment.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error interno del servidor'}), 500

@assignments_bp.route('/<int:assignment_id>', methods=['GET'])
@jwt_required()
def get_assignment_detail(assignment_id):
    """Obtener detalles de una tarea específica"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        assignment = Assignment.query.get(assignment_id)
        if not assignment:
            return jsonify({'error': 'Tarea no encontrada'}), 404
        
        # Verificar permisos
        if user.role == 'profesor' and assignment.professor_id != user_id:
            return jsonify({'error': 'No tienes permisos para ver esta tarea'}), 403
        
        assignment_data = assignment.to_dict()
        assignment_data['stats'] = assignment.get_submission_stats()
        
        # Si es profesor, incluir todas las entregas
        if user.role == 'profesor':
            submissions = Submission.query.filter_by(assignment_id=assignment_id).all()
            assignment_data['submissions'] = [s.to_dict() for s in submissions]
        
        return jsonify({
            'assignment': assignment_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@assignments_bp.route('/<int:assignment_id>/submit', methods=['POST'])
@jwt_required()
def submit_assignment(assignment_id):
    """Entregar tarea (estudiantes)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'estudiante':
            return jsonify({'error': 'Solo los estudiantes pueden entregar tareas'}), 403
        
        assignment = Assignment.query.get(assignment_id)
        if not assignment:
            return jsonify({'error': 'Tarea no encontrada'}), 404
        
        if assignment.status != 'active':
            return jsonify({'error': 'La tarea no está activa'}), 400
        
        # Verificar si ya pasó la fecha límite
        if assignment.is_overdue() and not assignment.allow_late_submission:
            return jsonify({'error': 'La fecha límite ha pasado'}), 400
        
        data = request.get_json()
        
        # Verificar intentos previos
        previous_attempts = Submission.query.filter_by(
            assignment_id=assignment_id,
            student_id=user_id
        ).count()
        
        if previous_attempts >= assignment.max_attempts:
            return jsonify({'error': 'Has excedido el número máximo de intentos'}), 400
        
        # Crear nueva entrega
        submission = Submission(
            content=data.get('content', ''),
            file_path=data.get('file_path'),
            attempt_number=previous_attempts + 1,
            assignment_id=assignment_id,
            student_id=user_id
        )
        
        db.session.add(submission)
        db.session.commit()
        
        return jsonify({
            'message': 'Tarea entregada exitosamente',
            'submission': submission.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error interno del servidor'}), 500

@assignments_bp.route('/submissions/<int:submission_id>/grade', methods=['POST'])
@jwt_required()
def grade_submission(submission_id):
    """Calificar entrega (profesores)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'profesor':
            return jsonify({'error': 'Solo los profesores pueden calificar'}), 403
        
        submission = Submission.query.get(submission_id)
        if not submission:
            return jsonify({'error': 'Entrega no encontrada'}), 404
        
        # Verificar que el profesor es dueño de la tarea
        if submission.assignment.professor_id != user_id:
            return jsonify({'error': 'No tienes permisos para calificar esta entrega'}), 403
        
        data = request.get_json()
        
        if 'grade' not in data:
            return jsonify({'error': 'La calificación es requerida'}), 400
        
        grade = float(data['grade'])
        if grade < 0 or grade > submission.assignment.max_points:
            return jsonify({'error': f'La calificación debe estar entre 0 y {submission.assignment.max_points}'}), 400
        
        # Actualizar entrega
        submission.grade = grade
        submission.feedback = data.get('feedback', '')
        submission.status = 'graded'
        submission.graded_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Entrega calificada exitosamente',
            'submission': submission.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error interno del servidor'}), 500

