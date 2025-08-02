from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from models.presentation import Presentation  # Asumimos que tienes un modelo llamado Presentation
from app import db

presentations_bp = Blueprint('presentations', __name__)

@presentations_bp.route('/', methods=['GET'])
@jwt_required()
def get_presentations():
    """
    Obtener presentaciones según el rol del usuario.
    """
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        if user.role == 'profesor':
            # Los profesores ven las presentaciones que han creado
            presentations = Presentation.query.filter_by(creator_id=user_id).all()
        elif user.role == 'estudiante':
            # Los estudiantes ven presentaciones que son públicas o de sus clases
            presentations = Presentation.query.filter_by(is_public=True).all()
        else:
            # Los administradores ven todas las presentaciones
            presentations = Presentation.query.all()
        
        presentations_data = [p.to_dict() for p in presentations]
        
        return jsonify({
            'presentations': presentations_data,
            'total': len(presentations_data)
        }), 200
        
    except Exception as e:
        # En caso de un error en el servidor, devolvemos un 500
        return jsonify({'error': str(e)}), 500