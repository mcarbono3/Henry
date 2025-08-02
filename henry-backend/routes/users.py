from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from app import db

users_bp = Blueprint('users', __name__)

@users_bp.route('/', methods=['GET'])
@jwt_required()
def get_users():
    """Obtener lista de usuarios (solo administradores)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'administrador':
            return jsonify({'error': 'Solo los administradores pueden ver la lista de usuarios'}), 403
        
        users = User.query.all()
        users_data = [u.to_dict() for u in users]
        
        return jsonify({
            'users': users_data,
            'total': len(users_data)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@users_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_detail(user_id):
    """Obtener detalles de un usuario específico"""
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        if not current_user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        # Solo el propio usuario o administradores pueden ver detalles
        if current_user_id != user_id and current_user.role != 'administrador':
            return jsonify({'error': 'No tienes permisos para ver este usuario'}), 403
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        return jsonify({
            'user': user.get_profile_data()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@users_bp.route('/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    """Actualizar información de usuario"""
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        if not current_user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        # Solo el propio usuario o administradores pueden actualizar
        if current_user_id != user_id and current_user.role != 'administrador':
            return jsonify({'error': 'No tienes permisos para modificar este usuario'}), 403
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        data = request.get_json()
        
        # Campos actualizables
        updatable_fields = [
            'full_name', 'institution', 'department', 
            'student_id', 'semester', 'career', 'avatar_url'
        ]
        
        # Solo administradores pueden cambiar el rol
        if current_user.role == 'administrador':
            updatable_fields.extend(['role', 'is_active'])
        
        for field in updatable_fields:
            if field in data:
                setattr(user, field, data[field])
        
        user.updated_at = db.func.now()
        db.session.commit()
        
        return jsonify({
            'message': 'Usuario actualizado exitosamente',
            'user': user.get_profile_data()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error interno del servidor'}), 500

@users_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_user_stats():
    """Obtener estadísticas de usuarios (solo administradores)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'administrador':
            return jsonify({'error': 'Solo los administradores pueden ver estadísticas'}), 403
        
        total_users = User.query.count()
        active_users = User.query.filter_by(is_active=True).count()
        professors = User.query.filter_by(role='profesor').count()
        students = User.query.filter_by(role='estudiante').count()
        admins = User.query.filter_by(role='administrador').count()
        
        return jsonify({
            'stats': {
                'total_users': total_users,
                'active_users': active_users,
                'professors': professors,
                'students': students,
                'administrators': admins,
                'inactive_users': total_users - active_users
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

