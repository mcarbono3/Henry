from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.presentation import Presentation
from app import db

presentations_bp = Blueprint('presentations', __name__)

@presentations_bp.route('/', methods=['GET', 'POST'])
@jwt_required()
def handle_presentations():
    """
    Maneja las solicitudes GET para obtener presentaciones y POST para crear una nueva.
    """
    user_id = get_jwt_identity()
    
    if request.method == 'GET':
        try:
            presentations = Presentation.query.filter_by(user_id=user_id).all()
            return jsonify([p.to_dict() for p in presentations]), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    elif request.method == 'POST':
        try:
            data = request.get_json()
            
            # Validación de campos requeridos
            required_fields = ['title', 'topic', 'audience', 'duration', 'style']
            if not all(field in data and data[field] for field in required_fields):
                return jsonify({'error': 'Campos obligatorios faltantes'}), 400

            # TODO: Aquí va la lógica real para llamar a la IA
            # Por ahora, se guarda la presentación con un contenido vacío
            # Una vez implementada la IA, se actualizará `content` con la respuesta real.
            
            new_presentation = Presentation(
                user_id=user_id,
                title=data.get('title'),
                topic=data.get('topic'),
                audience=data.get('audience'),
                duration=data.get('duration'),
                style=data.get('style'),
                content={} 
            )
            
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
        presentation = Presentation.query.filter_by(id=presentation_id, user_id=user_id).first()

        if not presentation:
            return jsonify({'error': 'Presentación no encontrada o no pertenece al usuario'}), 404

        db.session.delete(presentation)
        db.session.commit()

        return jsonify({'message': 'Presentación eliminada exitosamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
