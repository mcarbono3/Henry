from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from models.class_model import Class
from models.material import Material
from models.assignment import Assignment
from app import db
from datetime import datetime

classes_bp = Blueprint('classes', __name__)

@classes_bp.route('/', methods=['GET'])
@jwt_required()
def get_classes():
    """Obtener clases del usuario autenticado"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        if user.role == 'profesor':
            # Profesores ven sus clases creadas
            classes = Class.query.filter_by(professor_id=user_id).all()
        elif user.role == 'estudiante':
            # Estudiantes ven clases en las que están inscritos
            # Por ahora retornamos todas las clases activas como demo
            classes = Class.query.filter_by(status='active').all()
        else:
            # Administradores ven todas las clases
            classes = Class.query.all()
        
        classes_data = []
        for class_obj in classes:
            class_data = class_obj.to_dict()
            # Agregar estadísticas adicionales
            class_data['materials'] = [m.to_dict() for m in class_obj.materials.limit(5)]
            class_data['recent_assignments'] = [a.to_dict() for a in class_obj.assignments.limit(3)]
            classes_data.append(class_data)
        
        return jsonify({
            'classes': classes_data,
            'total': len(classes_data)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@classes_bp.route('/', methods=['POST'])
@jwt_required()
def create_class():
    """Crear nueva clase (solo profesores)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'profesor':
            return jsonify({'error': 'Solo los profesores pueden crear clases'}), 403
        
        data = request.get_json()
        
        # Validar datos requeridos
        required_fields = ['name', 'subject', 'semester']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'El campo {field} es requerido'}), 400
        
        # Crear nueva clase
        new_class = Class(
            name=data['name'],
            description=data.get('description', ''),
            subject=data['subject'],
            semester=data['semester'],
            schedule=data.get('schedule', ''),
            capacity=data.get('capacity', 30),
            status=data.get('status', 'active'),
            professor_id=user_id
        )
        
        db.session.add(new_class)
        db.session.commit()
        
        return jsonify({
            'message': 'Clase creada exitosamente',
            'class': new_class.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error interno del servidor'}), 500

@classes_bp.route('/<int:class_id>', methods=['GET'])
@jwt_required()
def get_class_detail(class_id):
    """Obtener detalles de una clase específica"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        class_obj = Class.query.get(class_id)
        if not class_obj:
            return jsonify({'error': 'Clase no encontrada'}), 404
        
        # Verificar permisos
        if user.role == 'profesor' and class_obj.professor_id != user_id:
            return jsonify({'error': 'No tienes permisos para ver esta clase'}), 403
        
        return jsonify({
            'class': class_obj.get_detailed_info()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@classes_bp.route('/<int:class_id>', methods=['PUT'])
@jwt_required()
def update_class(class_id):
    """Actualizar información de una clase"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        class_obj = Class.query.get(class_id)
        if not class_obj:
            return jsonify({'error': 'Clase no encontrada'}), 404
        
        # Solo el profesor de la clase puede actualizarla
        if class_obj.professor_id != user_id:
            return jsonify({'error': 'No tienes permisos para modificar esta clase'}), 403
        
        data = request.get_json()
        
        # Campos actualizables
        updatable_fields = [
            'name', 'description', 'subject', 'semester', 
            'schedule', 'capacity', 'status'
        ]
        
        for field in updatable_fields:
            if field in data:
                setattr(class_obj, field, data[field])
        
        class_obj.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Clase actualizada exitosamente',
            'class': class_obj.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error interno del servidor'}), 500

@classes_bp.route('/<int:class_id>', methods=['DELETE'])
@jwt_required()
def delete_class(class_id):
    """Eliminar una clase"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        class_obj = Class.query.get(class_id)
        if not class_obj:
            return jsonify({'error': 'Clase no encontrada'}), 404
        
        # Solo el profesor de la clase puede eliminarla
        if class_obj.professor_id != user_id:
            return jsonify({'error': 'No tienes permisos para eliminar esta clase'}), 403
        
        db.session.delete(class_obj)
        db.session.commit()
        
        return jsonify({
            'message': 'Clase eliminada exitosamente'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error interno del servidor'}), 500

@classes_bp.route('/<int:class_id>/enroll', methods=['POST'])
@jwt_required()
def enroll_in_class(class_id):
    """Inscribirse en una clase (estudiantes)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'estudiante':
            return jsonify({'error': 'Solo los estudiantes pueden inscribirse en clases'}), 403
        
        class_obj = Class.query.get(class_id)
        if not class_obj:
            return jsonify({'error': 'Clase no encontrada'}), 404
        
        if not class_obj.can_enroll():
            return jsonify({'error': 'La clase no tiene cupos disponibles o no está activa'}), 400
        
        # Aquí se implementaría la lógica de inscripción
        # Por ahora solo incrementamos el contador
        if class_obj.enroll_student():
            return jsonify({
                'message': 'Inscripción exitosa',
                'class': class_obj.to_dict()
            }), 200
        else:
            return jsonify({'error': 'No se pudo completar la inscripción'}), 400
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error interno del servidor'}), 500

@classes_bp.route('/demo-data', methods=['POST'])
@jwt_required()
def create_demo_data():
    """Crear datos de demostración para clases"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'profesor':
            return jsonify({'error': 'Solo los profesores pueden crear datos de demo'}), 403
        
        # Verificar si ya existen clases de demo
        existing_classes = Class.query.filter_by(professor_id=user_id).count()
        if existing_classes > 0:
            return jsonify({'message': 'Ya existen clases de demostración'}), 200
        
        # Crear clases de demostración
        demo_classes = [
            {
                'name': 'Introducción a la Inteligencia Artificial',
                'description': 'Curso fundamental sobre conceptos básicos de IA, machine learning y sus aplicaciones.',
                'subject': 'Ciencias de la Computación',
                'semester': '2025-1',
                'schedule': 'Lunes y Miércoles 10:00-12:00',
                'capacity': 25,
                'enrolled_count': 18
            },
            {
                'name': 'Algoritmos y Estructuras de Datos',
                'description': 'Estudio profundo de algoritmos fundamentales y estructuras de datos eficientes.',
                'subject': 'Ciencias de la Computación',
                'semester': '2025-1',
                'schedule': 'Martes y Jueves 14:00-16:00',
                'capacity': 30,
                'enrolled_count': 22
            },
            {
                'name': 'Machine Learning en la Práctica',
                'description': 'Aplicación práctica de técnicas de aprendizaje automático en proyectos reales.',
                'subject': 'Ciencias de la Computación',
                'semester': '2025-1',
                'schedule': 'Viernes 9:00-12:00',
                'capacity': 20,
                'enrolled_count': 15
            }
        ]
        
        created_classes = []
        for class_data in demo_classes:
            new_class = Class(
                professor_id=user_id,
                **class_data
            )
            db.session.add(new_class)
            db.session.flush()  # Para obtener el ID
            
            # Agregar materiales de demostración
            demo_materials = [
                {
                    'name': 'Syllabus del Curso',
                    'description': 'Plan de estudios completo del curso',
                    'type': 'pdf',
                    'url': 'https://example.com/syllabus.pdf'
                },
                {
                    'name': 'Presentación Introducción',
                    'description': 'Slides de la primera clase',
                    'type': 'presentation',
                    'url': 'https://example.com/intro.pptx'
                },
                {
                    'name': 'Video Tutorial',
                    'description': 'Tutorial básico sobre el tema',
                    'type': 'video',
                    'url': 'https://youtube.com/watch?v=example'
                }
            ]
            
            for material_data in demo_materials:
                material = Material(
                    class_id=new_class.id,
                    uploaded_by=user_id,
                    **material_data
                )
                db.session.add(material)
            
            created_classes.append(new_class)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Datos de demostración creados exitosamente',
            'classes': [c.to_dict() for c in created_classes]
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error interno del servidor'}), 500

@classes_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_class_stats():
    """Obtener estadísticas de clases del usuario"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        if user.role == 'profesor':
            classes = Class.query.filter_by(professor_id=user_id)
            total_classes = classes.count()
            active_classes = classes.filter_by(status='active').count()
            total_students = sum([c.enrolled_count for c in classes])
            total_materials = Material.query.join(Class).filter(Class.professor_id == user_id).count()
            
            return jsonify({
                'stats': {
                    'total_classes': total_classes,
                    'active_classes': active_classes,
                    'total_students': total_students,
                    'total_materials': total_materials
                }
            }), 200
        
        return jsonify({'error': 'Estadísticas no disponibles para este rol'}), 403
        
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

