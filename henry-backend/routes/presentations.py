from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.presentation import Presentation
from app import db

presentations_bp = Blueprint('presentations', __name__)

@presentations_bp.route('/', methods=['GET'])
@jwt_required()
def get_presentations():
    """Obtener todas las presentaciones del usuario autenticado."""
    try:
        user_id = get_jwt_identity()
        presentations = Presentation.query.filter_by(user_id=user_id).all()
        return jsonify([p.to_dict() for p in presentations]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@presentations_bp.route('/', methods=['POST'])
@jwt_required()
def create_presentation():
    """Generar y guardar una nueva presentación."""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # TODO: Implementar la lógica para llamar a la IA
        # Por ahora, solo guardaremos los datos que llegan
        
        new_presentation = Presentation(
            user_id=user_id,
            title=data.get('title'),
            topic=data.get('topic'),
            audience=data.get('audience'),
            duration=data.get('duration'),
            style=data.get('style'),
            # Guardar el contenido generado por la IA aquí
            content=data.get('content') 
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
    """Eliminar una presentación por ID."""
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
