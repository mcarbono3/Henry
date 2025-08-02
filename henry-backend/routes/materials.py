from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from models.material import Material
from models.class_model import Class
from app import db

materials_bp = Blueprint('materials', __name__)

@materials_bp.route('/', methods=['GET'])
@jwt_required()
def get_materials():
    """Obtener materiales según el rol del usuario"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        class_id = request.args.get('class_id')
        
        if class_id:
            # Filtrar por clase específica
            materials = Material.query.filter_by(class_id=class_id).all()
        elif user.role == 'profesor':
            # Profesores ven materiales de sus clases
            materials = Material.query.join(Class).filter(Class.professor_id == user_id).all()
        elif user.role == 'estudiante':
            # Estudiantes ven materiales públicos de sus clases (por ahora todos los públicos)
            materials = Material.query.filter_by(is_public=True).all()
        else:
            # Administradores ven todos los materiales
            materials = Material.query.all()
        
        materials_data = [m.to_dict() for m in materials]
        
        return jsonify({
            'materials': materials_data,
            'total': len(materials_data)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@materials_bp.route('/', methods=['POST'])
@jwt_required()
def upload_material():
    """Subir nuevo material (profesores)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'profesor':
            return jsonify({'error': 'Solo los profesores pueden subir materiales'}), 403
        
        data = request.get_json()
        
        # Validar datos requeridos
        required_fields = ['name', 'type', 'class_id']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'El campo {field} es requerido'}), 400
        
        # Verificar que la clase pertenece al profesor
        class_obj = Class.query.get(data['class_id'])
        if not class_obj or class_obj.professor_id != user_id:
            return jsonify({'error': 'Clase no encontrada o no tienes permisos'}), 403
        
        # Crear nuevo material
        material = Material(
            name=data['name'],
            description=data.get('description', ''),
            type=data['type'],
            file_path=data.get('file_path'),
            url=data.get('url'),
            file_size=data.get('file_size'),
            mime_type=data.get('mime_type'),
            is_public=data.get('is_public', True),
            class_id=data['class_id'],
            uploaded_by=user_id
        )
        
        db.session.add(material)
        db.session.commit()
        
        return jsonify({
            'message': 'Material subido exitosamente',
            'material': material.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error interno del servidor'}), 500

@materials_bp.route('/<int:material_id>', methods=['GET'])
@jwt_required()
def get_material_detail(material_id):
    """Obtener detalles de un material específico"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        material = Material.query.get(material_id)
        if not material:
            return jsonify({'error': 'Material no encontrado'}), 404
        
        # Verificar permisos
        if not material.is_public and user.role == 'estudiante':
            return jsonify({'error': 'No tienes permisos para ver este material'}), 403
        
        if user.role == 'profesor' and material.class_ref.professor_id != user_id:
            return jsonify({'error': 'No tienes permisos para ver este material'}), 403
        
        return jsonify({
            'material': material.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@materials_bp.route('/<int:material_id>/download', methods=['GET'])
@jwt_required()
def download_material(material_id):
    """Descargar material"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        material = Material.query.get(material_id)
        if not material:
            return jsonify({'error': 'Material no encontrado'}), 404
        
        # Verificar permisos
        if not material.is_public and user.role == 'estudiante':
            return jsonify({'error': 'No tienes permisos para descargar este material'}), 403
        
        if user.role == 'profesor' and material.class_ref.professor_id != user_id:
            return jsonify({'error': 'No tienes permisos para descargar este material'}), 403
        
        # Incrementar contador de descargas
        material.increment_download_count()
        
        download_url = material.get_download_url()
        if not download_url:
            return jsonify({'error': 'Material no disponible para descarga'}), 400
        
        return jsonify({
            'download_url': download_url,
            'material': material.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@materials_bp.route('/<int:material_id>', methods=['PUT'])
@jwt_required()
def update_material(material_id):
    """Actualizar material"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        material = Material.query.get(material_id)
        if not material:
            return jsonify({'error': 'Material no encontrado'}), 404
        
        # Solo el profesor que subió el material puede actualizarlo
        if material.uploaded_by != user_id:
            return jsonify({'error': 'No tienes permisos para modificar este material'}), 403
        
        data = request.get_json()
        
        # Campos actualizables
        updatable_fields = [
            'name', 'description', 'type', 'url', 'is_public'
        ]
        
        for field in updatable_fields:
            if field in data:
                setattr(material, field, data[field])
        
        material.updated_at = db.func.now()
        db.session.commit()
        
        return jsonify({
            'message': 'Material actualizado exitosamente',
            'material': material.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error interno del servidor'}), 500

@materials_bp.route('/<int:material_id>', methods=['DELETE'])
@jwt_required()
def delete_material(material_id):
    """Eliminar material"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        material = Material.query.get(material_id)
        if not material:
            return jsonify({'error': 'Material no encontrado'}), 404
        
        # Solo el profesor que subió el material puede eliminarlo
        if material.uploaded_by != user_id:
            return jsonify({'error': 'No tienes permisos para eliminar este material'}), 403
        
        db.session.delete(material)
        db.session.commit()
        
        return jsonify({
            'message': 'Material eliminado exitosamente'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error interno del servidor'}), 500

@materials_bp.route('/types', methods=['GET'])
def get_material_types():
    """Obtener tipos de materiales soportados"""
    material_types = [
        {
            'id': 'pdf',
            'name': 'Documento PDF',
            'description': 'Archivos PDF como libros, artículos, manuales',
            'icon': 'file-text',
            'extensions': ['.pdf']
        },
        {
            'id': 'presentation',
            'name': 'Presentación',
            'description': 'Slides y presentaciones',
            'icon': 'presentation',
            'extensions': ['.ppt', '.pptx', '.odp']
        },
        {
            'id': 'video',
            'name': 'Video',
            'description': 'Videos educativos y conferencias',
            'icon': 'video',
            'extensions': ['.mp4', '.avi', '.mov', '.wmv']
        },
        {
            'id': 'audio',
            'name': 'Audio',
            'description': 'Podcasts y grabaciones de audio',
            'icon': 'volume-2',
            'extensions': ['.mp3', '.wav', '.ogg']
        },
        {
            'id': 'image',
            'name': 'Imagen',
            'description': 'Diagramas, gráficos e imágenes',
            'icon': 'image',
            'extensions': ['.jpg', '.jpeg', '.png', '.gif', '.svg']
        },
        {
            'id': 'document',
            'name': 'Documento',
            'description': 'Documentos de texto',
            'icon': 'file-text',
            'extensions': ['.doc', '.docx', '.odt', '.txt']
        },
        {
            'id': 'link',
            'name': 'Enlace Web',
            'description': 'Enlaces a recursos online',
            'icon': 'link',
            'extensions': []
        }
    ]
    
    return jsonify({
        'material_types': material_types
    }), 200

