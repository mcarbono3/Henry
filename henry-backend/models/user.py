from app import db
from datetime import datetime
from werkzeug.security import check_password_hash

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    full_name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'estudiante', 'profesor', 'administrador'
    password_hash = db.Column(db.String(255), nullable=False)
    avatar_url = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Información adicional por rol
    institution = db.Column(db.String(100))
    department = db.Column(db.String(100))
    student_id = db.Column(db.String(20))
    semester = db.Column(db.String(10))
    career = db.Column(db.String(100))
    
    # Relaciones
    classes_teaching = db.relationship('Class', foreign_keys='Class.professor_id', backref='professor', lazy='dynamic')
    presentations = db.relationship('Presentation', backref='author', lazy='dynamic')
    assignments_created = db.relationship('Assignment', foreign_keys='Assignment.professor_id', backref='professor', lazy='dynamic')
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'role': self.role,
            'avatar_url': self.avatar_url,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'institution': self.institution,
            'department': self.department,
            'student_id': self.student_id,
            'semester': self.semester,
            'career': self.career
        }
    
    def get_profile_data(self):
        """Retorna datos específicos del perfil según el rol"""
        base_data = self.to_dict()
        
        if self.role == 'profesor':
            base_data.update({
                'classes_count': self.classes_teaching.count(),
                'presentations_count': self.presentations.count(),
                'assignments_count': self.assignments_created.count()
            })
        elif self.role == 'estudiante':
            # Aquí se podrían agregar estadísticas específicas del estudiante
            base_data.update({
                'enrolled_classes': 0,  # Implementar cuando se cree la relación
                'completed_assignments': 0,
                'average_grade': 0.0
            })
        
        return base_data
    
    def __repr__(self):
        return f'<User {self.email}>'

