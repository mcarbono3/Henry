from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
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
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Asegúrate de que la carpeta de subida existe
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@presentations_bp.route('/', methods=['GET', 'POST'])
@jwt_required()
def handle_presentations():
    """
    Maneja las solicitudes GET para obtener presentaciones y POST para crear una nueva.
    """
    user_id = get_jwt_identity()

    if request.method == 'GET':
        try:
            presentations = Presentation.query.filter_by(author_id=user_id).all()
            return jsonify([p.to_dict() for p in presentations]), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    elif request.method == 'POST':
        try:
            # Obtener el tipo de solicitud (IA, link o archivo)
            source_type = request.form.get('source_type', 'ai') # Por defecto, generamos con IA

            if source_type == 'link':
                # Lógica para cargar desde un link externo
                link_url = request.form.get('source_url')
                title = request.form.get('title', 'Presentación Externa')
                
                if not link_url:
                    return jsonify({'error': 'El link de la presentación es obligatorio'}), 400
                
                new_presentation = Presentation(
                    author_id=user_id,
                    title=title,
                    source_type='link',
                    source_url=link_url,
                    # No generamos contenido, solo almacenamos el link
                )
            
            elif source_type == 'upload':
                # Lógica para subir un archivo PPT
                if 'file' not in request.files:
                    return jsonify({'error': 'No se encontró el archivo en la solicitud'}), 400
                
                file = request.files['file']
                title = request.form.get('title', 'Presentación Subida')
                
                if file.filename == '':
                    return jsonify({'error': 'No se seleccionó un archivo'}), 400
                
                if file and allowed_file(file.filename):
                    filename = secure_filename(file.filename)
                    file_path = os.path.join(UPLOAD_FOLDER, filename)
                    file.save(file_path)
                    
                    new_presentation = Presentation(
                        author_id=user_id,
                        title=title,
                        source_type='upload',
                        source_url=file_path, # Guardamos la ruta del archivo
                        # Podrías agregar lógica aquí para parsear el PPT y extraer el contenido
                    )
                else:
                    return jsonify({'error': 'Formato de archivo no permitido'}), 400

            elif source_type == 'ai':
                # Lógica para generar con la IA (como estaba antes)
                data = request.get_json() or request.form
                
                required_fields = ['title', 'topic', 'audience', 'duration', 'style']
                if not all(field in data and data[field] for field in required_fields):
                    return jsonify({'error': 'Campos obligatorios faltantes'}), 400
                
                # Aquí llamarías a tu servicio de IA para generar el contenido
                # Por ahora, usamos un contenido vacío como marcador
                # ai_content = generate_ai_presentation(data)
                
                new_presentation = Presentation(
                    author_id=user_id,
                    title=data.get('title'),
                    topic=data.get('topic'),
                    audience=data.get('audience'),
                    duration=data.get('duration'),
                    style=data.get('style'),
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

@presentations_bp.route('/<int:presentation_id>', methods=['DELETE'])
@jwt_required()
def delete_presentation(presentation_id):
    """
    Elimina una presentación por su ID.
    """
    try:
        user_id = get_jwt_identity()
        presentation = Presentation.query.filter_by(id=presentation_id, author_id=user_id).first()

        if not presentation:
            return jsonify({'error': 'Presentación no encontrada o no pertenece al usuario'}), 404

        db.session.delete(presentation)
        db.session.commit()

        return jsonify({'message': 'Presentación eliminada exitosamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
