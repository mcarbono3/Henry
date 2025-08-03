from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Configuración de la aplicación
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# --- Inicio del manejo robusto de la clave secreta ---
# Lee la clave secreta desde las variables de entorno
jwt_secret_key = os.environ.get("JWT_SECRET_KEY")

# **Punto de depuración crucial:** imprime el valor para confirmar que se carga.
print(f"DEBUG: JWT_SECRET_KEY cargada del entorno: '{jwt_secret_key}'")

# Verifica si la clave se cargó correctamente. Si no, lanza un error para detener la aplicación.
# Esto asegura que la aplicación no se ejecute con una clave insegura o nula.
if not jwt_secret_key:
    raise RuntimeError("La variable de entorno JWT_SECRET_KEY no está configurada. Por favor, establécela en Render y en tu entorno local.")

# Asigna la clave a la configuración de la aplicación
app.config["JWT_SECRET_KEY"] = jwt_secret_key
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)
# --- Fin del manejo robusto ---

# Inicializar extensiones
db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app, resources={r"/*": {"origins": "https://mcarbono3.github.io"}})

# Importar modelos
from models.user import User
from models.class_model import Class
from models.presentation import Presentation
from models.assignment import Assignment
from models.material import Material

# Importar rutas
from routes.auth import auth_bp
from routes.users import users_bp
from routes.classes import classes_bp
from routes.presentations import presentations_bp
from routes.ai import ai_bp
from routes.assignments import assignments_bp
from routes.materials import materials_bp

# Registrar blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(users_bp, url_prefix='/api/users')
app.register_blueprint(classes_bp, url_prefix='/api/classes')
app.register_blueprint(presentations_bp, url_prefix='/api/presentations', strict_slashes=False)
app.register_blueprint(ai_bp, url_prefix='/api/ai')
app.register_blueprint(assignments_bp, url_prefix='/api/assignments')
app.register_blueprint(materials_bp, url_prefix='/api/materials')

# Crear tablas
@app.before_request
def create_tables():
    db.create_all()

    # Crear usuarios de demostración si no existen
    if not User.query.filter_by(email='admin@henry.edu').first():
        admin = User(
            email='admin@henry.edu',
            full_name='Mario Carbonó Administrador',
            role='administrador',
            password_hash=generate_password_hash('demo123')
        )
        db.session.add(admin)

    if not User.query.filter_by(email='profesor@henry.edu').first():
        profesor = User(
            email='profesor@henry.edu',
            full_name='Dr. Mario Carbonó',
            role='profesor',
            password_hash=generate_password_hash('demo123')
        )
        db.session.add(profesor)

    if not User.query.filter_by(email='estudiante@henry.edu').first():
        estudiante = User(
            email='estudiante@henry.edu',
            full_name='Raquel Toloza',
            role='estudiante',
            password_hash=generate_password_hash('demo123')
        )
        db.session.add(estudiante)

    db.session.commit()

# Ruta principal
@app.route('/')
def index():
    return jsonify({
        'message': 'HENRY API - Holistic Educational Network for Research and Youth',
        'version': '1.0.0',
        'status': 'active',
        'endpoints': {
            'auth': '/api/auth',
            'users': '/api/users',
            'classes': '/api/classes',
            'presentations': '/api/presentations',
            'ai': '/api/ai',
            'assignments': '/api/assignments',
            'materials': '/api/materials'
        }
    })

# Ruta de salud del sistema
@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'database': 'connected',
        'ai_service': 'operational'
    })

# Manejo de errores
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint no encontrado'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Error interno del servidor'}), 500

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({'error': 'Token expirado'}), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({'error': 'Token inválido'}), 401

@jwt.unauthorized_loader
def missing_token_callback(error):
    return jsonify({'error': 'Token de autorización requerido'}), 401

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
