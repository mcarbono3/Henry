from flask import Blueprint, request, jsonify
# Mantengo los imports comentados por si quieres volver a activarlos fácilmente
# from flask_jwt_extended import jwt_required, get_jwt_identity
from models.presentation import Presentation
from app import db
import json
import os
from werkzeug.utils import secure_filename

# Asegúrate de que este import es correcto y que tienes un blueprint 'ai_bp'
# from routes.ai import generate_ai_presentation

presentations_bp = Blueprint('presentations', __name__)

# --- CONFIGURACIÓN PARA SUBIDA DE ARCHIVOS ---
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'ppt', 'pptx'}

def allowed_file(filename):
    """
    Verifica si la extensión del archivo está permitida.
    """
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Asegúrate de que la carpeta de subida existe
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@presentations_bp.route('/', methods=['GET', 'POST'])
# @jwt_required() # <--- Deshabilitado: No se requiere token JWT
def handle_presentations():
    """
    Maneja las solicitudes GET para obtener presentaciones y POST para crear una nueva.
    Ahora no requiere autenticación JWT y recibe el user_id en la solicitud.
    """
    # Para GET, el user_id viene como query parameter
    if request.method == 'GET':
        user_id = request.args.get('user_id', type=int)
        if user_id is None:
            return jsonify({'error': 'Falta el user_id en los parámetros de la solicitud'}), 400
        
        try:
            presentations = Presentation.query.filter_by(author_id=user_id).all()
            return jsonify([p.to_dict() for p in presentations]), 200
        except Exception as e:
            # Manejo de errores genérico para GET
            return jsonify({'error': str(e)}), 500

    # Para POST, el user_id viene en el cuerpo (JSON o form-data)
    elif request.method == 'POST':
        try:
            # Determinar si es JSON o form-data
            if request.content_type and 'application/json' in request.content_type:
                data = request.get_json()
            else: # Asumir form-data para uploads y links
                data = request.form

            user_id = data.get('user_id', type=int)
            if user_id is None:
                return jsonify({'error': 'Falta el user_id en los datos de la solicitud'}), 400
            
            source_type = data.get('source_type', 'ai') # Por defecto, generamos con IA

            if source_type == 'link':
                link_url = data.get('source_url')
                title = data.get('title', 'Presentación Externa')
                # Asegurarse de que los campos NotNull tengan valores por defecto
                topic = data.get('topic', 'General') 
                audience = data.get('audience', 'Público general')
                duration = data.get('duration', 'N/A')
                style = data.get('style', 'professional')
                
                if not link_url:
                    return jsonify({'error': 'El link de la presentación es obligatorio'}), 400
                
                new_presentation = Presentation(
                    author_id=user_id,
                    title=title,
                    topic=topic,
                    audience=audience,
                    duration=duration,
                    style=style,
                    source_type='link',
                    source_url=link_url,
                    content_json=json.dumps({}) # Asegurar que content_json no sea null
                )
            
            elif source_type == 'upload':
                if 'file' not in request.files:
                    return jsonify({'error': 'No se encontró el archivo en la solicitud'}), 400
                
                file = request.files['file']
                title = data.get('title', 'Presentación Subida')
                # Asegurarse de que los campos NotNull tengan valores por defecto
                topic = data.get('topic', 'General') 
                audience = data.get('audience', 'Público general')
                duration = data.get('duration', 'N/A')
                style = data.get('style', 'professional')
                
                if file.filename == '':
                    return jsonify({'error': 'No se seleccionó un archivo'}), 400
                
                if file and allowed_file(file.filename):
                    filename = secure_filename(file.filename)
                    file_path = os.path.join(UPLOAD_FOLDER, filename)
                    file.save(file_path)
                    
                    new_presentation = Presentation(
                        author_id=user_id,
                        title=title,
                        topic=topic,
                        audience=audience,
                        duration=duration,
                        style=style,
                        source_type='upload',
                        source_url=file_path,
                        content_json=json.dumps({}) # Asegurar que content_json no sea null
                    )
                else:
                    return jsonify({'error': 'Formato de archivo no permitido'}), 400

            elif source_type == 'ai':
                # Para AI, esperamos JSON
                data_ai = request.get_json() 
                required_fields = ['title', 'topic', 'audience', 'duration', 'style']
                if not all(field in data_ai and data_ai[field] for field in required_fields):
                    return jsonify({'error': 'Campos obligatorios faltantes para IA'}), 400
                
                new_presentation = Presentation(
                    author_id=user_id,
                    title=data_ai.get('title'),
                    topic=data_ai.get('topic'),
                    audience=data_ai.get('audience'),
                    duration=data_ai.get('duration'),
                    style=data_ai.get('style'),
                    source_type='ai',
                    content_json=json.dumps({'slides': []})
                )
            
            else:
                return jsonify({'error': 'Tipo de fuente no válido'}), 400

            db.session.add(new_presentation)
            db.session.commit()
            
            return jsonify(new_presentation.to_dict()), 201
        
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

# NUEVA RUTA para manejar la actualización de presentaciones (PUT)
@presentations_bp.route('/<int:presentation_id>', methods=['PUT'])
# @jwt_required() # <--- Deshabilitado: No se requiere token JWT
def update_presentation(presentation_id):
    """
    Actualiza una presentación por su ID.
    Ahora no requiere autenticación JWT y recibe el user_id en la solicitud.
    """
    user_id = request.args.get('user_id', type=int) # User ID from query param
    if user_id is None:
        return jsonify({'error': 'Falta el user_id en los parámetros de la solicitud'}), 400

    try:
        presentation = Presentation.query.filter_by(id=presentation_id, author_id=user_id).first()

        if not presentation:
            return jsonify({'error': 'Presentación no encontrada o no pertenece al usuario'}), 404

        data = request.get_json()
        if not data:
            return jsonify({'error': 'No se proporcionaron datos para actualizar'}), 400

        # Actualizar campos de la presentación
        presentation.title = data.get('title', presentation.title)
        presentation.topic = data.get('topic', presentation.topic)
        presentation.audience = data.get('audience', presentation.audience)
        presentation.duration = data.get('duration', presentation.duration)
        presentation.style = data.get('style', presentation.style)
        presentation.source_url = data.get('source_url', presentation.source_url)
        # No actualizamos source_type ni content_json directamente aquí,
        # ya que la lógica de carga/generación es más compleja.
        # Si se necesita actualizar slides_count o views_count, se haría con lógica específica.

        db.session.commit()
        return jsonify(presentation.to_dict()), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@presentations_bp.route('/<int:presentation_id>', methods=['DELETE'])
# @jwt_required() # <--- Deshabilitado: No se requiere token JWT
def delete_presentation(presentation_id):
    """
    Elimina una presentación por su ID.
    Ahora no requiere autenticación JWT y recibe el user_id en la URL.
    """
    user_id = request.args.get('user_id', type=int)
    if user_id is None:
        return jsonify({'error': 'Falta el user_id en los parámetros de la solicitud'}), 400
    
    try:
        presentation = Presentation.query.filter_by(id=presentation_id, author_id=user_id).first()

        if not presentation:
            return jsonify({'error': 'Presentación no encontrada o no pertenece al usuario'}), 404

        db.session.delete(presentation)
        db.session.commit()

        return jsonify({'message': 'Presentación eliminada exitosamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
