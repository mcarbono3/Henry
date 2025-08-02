from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from models.user import User
from app import db
import re

auth_bp = Blueprint('auth', __name__)

def validate_email(email):
    """Valida formato de email"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Valida que la contraseña cumpla con los requisitos mínimos"""
    if len(password) < 6:
        return False, "La contraseña debe tener al menos 6 caracteres"
    return True, "Contraseña válida"

@auth_bp.route('/register', methods=['POST'])
def register():
    """Registro de nuevos usuarios"""
    try:
        data = request.get_json()
        
        # Validar datos requeridos
        required_fields = ['email', 'password', 'full_name', 'role']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'El campo {field} es requerido'}), 400
        
        email = data['email'].lower().strip()
        password = data['password']
        full_name = data['full_name'].strip()
        role = data['role'].lower()
        
        # Validaciones
        if not validate_email(email):
            return jsonify({'error': 'Formato de email inválido'}), 400
        
        is_valid, message = validate_password(password)
        if not is_valid:
            return jsonify({'error': message}), 400
        
        if role not in ['estudiante', 'profesor', 'administrador']:
            return jsonify({'error': 'Rol inválido'}), 400
        
        # Verificar si el usuario ya existe
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'El email ya está registrado'}), 409
        
        # Crear nuevo usuario
        user = User(
            email=email,
            full_name=full_name,
            role=role,
            password_hash=generate_password_hash(password),
            institution=data.get('institution'),
            department=data.get('department'),
            student_id=data.get('student_id'),
            semester=data.get('semester'),
            career=data.get('career')
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Generar token de acceso
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'Usuario registrado exitosamente',
            'access_token': access_token,
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error interno del servidor'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Inicio de sesión de usuarios"""
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email y contraseña son requeridos'}), 400
        
        email = data['email'].lower().strip()
        password = data['password']
        
        # Buscar usuario
        user = User.query.filter_by(email=email).first()
        
        if not user or not user.check_password(password):
            return jsonify({'error': 'Credenciales inválidas'}), 401
        
        if not user.is_active:
            return jsonify({'error': 'Cuenta desactivada'}), 401
        
        # Generar token de acceso
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'Inicio de sesión exitoso',
            'access_token': access_token,
            'user': user.get_profile_data()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Obtener perfil del usuario autenticado"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        return jsonify({
            'user': user.get_profile_data()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Actualizar perfil del usuario autenticado"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        data = request.get_json()
        
        # Campos actualizables
        updatable_fields = [
            'full_name', 'institution', 'department', 
            'student_id', 'semester', 'career', 'avatar_url'
        ]
        
        for field in updatable_fields:
            if field in data:
                setattr(user, field, data[field])
        
        user.updated_at = db.func.now()
        db.session.commit()
        
        return jsonify({
            'message': 'Perfil actualizado exitosamente',
            'user': user.get_profile_data()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error interno del servidor'}), 500

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Cambiar contraseña del usuario autenticado"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        data = request.get_json()
        
        if not data.get('current_password') or not data.get('new_password'):
            return jsonify({'error': 'Contraseña actual y nueva son requeridas'}), 400
        
        # Verificar contraseña actual
        if not user.check_password(data['current_password']):
            return jsonify({'error': 'Contraseña actual incorrecta'}), 401
        
        # Validar nueva contraseña
        is_valid, message = validate_password(data['new_password'])
        if not is_valid:
            return jsonify({'error': message}), 400
        
        # Actualizar contraseña
        user.password_hash = generate_password_hash(data['new_password'])
        user.updated_at = db.func.now()
        db.session.commit()
        
        return jsonify({
            'message': 'Contraseña actualizada exitosamente'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error interno del servidor'}), 500

@auth_bp.route('/verify-token', methods=['POST'])
@jwt_required()
def verify_token():
    """Verificar validez del token"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or not user.is_active:
            return jsonify({'error': 'Token inválido'}), 401
        
        return jsonify({
            'valid': True,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Token inválido'}), 401

@auth_bp.route('/demo-accounts', methods=['GET'])
def get_demo_accounts():
    """Obtener cuentas de demostración disponibles"""
    demo_accounts = [
        {
            'email': 'admin@henry.edu',
            'password': 'demo123',
            'role': 'administrador',
            'name': 'Administrador HENRY'
        },
        {
            'email': 'profesor@henry.edu',
            'password': 'demo123',
            'role': 'profesor',
            'name': 'Dr. María González'
        },
        {
            'email': 'estudiante@henry.edu',
            'password': 'demo123',
            'role': 'estudiante',
            'name': 'Juan Carlos Pérez'
        }
    ]
    
    return jsonify({
        'demo_accounts': demo_accounts,
        'message': 'Cuentas de demostración disponibles para pruebas'
    }), 200

