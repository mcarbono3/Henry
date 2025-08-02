from app import db
from datetime import datetime

class Class(db.Model):
    __tablename__ = 'classes'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    subject = db.Column(db.String(100), nullable=False)
    semester = db.Column(db.String(20), nullable=False)
    schedule = db.Column(db.String(100))
    capacity = db.Column(db.Integer, default=30)
    enrolled_count = db.Column(db.Integer, default=0)
    status = db.Column(db.String(20), default='active')  # 'active', 'draft', 'completed', 'cancelled'
    
    # Relaciones
    professor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relaciones con otros modelos
    materials = db.relationship('Material', backref='class_ref', lazy='dynamic', cascade='all, delete-orphan')
    assignments = db.relationship('Assignment', backref='class_ref', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'subject': self.subject,
            'semester': self.semester,
            'schedule': self.schedule,
            'capacity': self.capacity,
            'enrolled_count': self.enrolled_count,
            'status': self.status,
            'professor_id': self.professor_id,
            'professor_name': self.professor.full_name if self.professor else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'materials_count': self.materials.count(),
            'assignments_count': self.assignments.count()
        }
    
    def get_detailed_info(self):
        """Retorna información detallada de la clase incluyendo materiales y tareas"""
        base_info = self.to_dict()
        
        # Agregar materiales
        materials_list = []
        for material in self.materials.all():
            materials_list.append(material.to_dict())
        
        # Agregar tareas
        assignments_list = []
        for assignment in self.assignments.all():
            assignments_list.append(assignment.to_dict())
        
        base_info.update({
            'materials': materials_list,
            'assignments': assignments_list
        })
        
        return base_info
    
    def can_enroll(self):
        """Verifica si la clase tiene cupo disponible"""
        return self.enrolled_count < self.capacity and self.status == 'active'
    
    def enroll_student(self):
        """Inscribe un estudiante a la clase"""
        if self.can_enroll():
            self.enrolled_count += 1
            db.session.commit()
            return True
        return False
    
    def unenroll_student(self):
        """Desinscribe un estudiante de la clase"""
        if self.enrolled_count > 0:
            self.enrolled_count -= 1
            db.session.commit()
            return True
        return False
    
    def __repr__(self):
        return f'<Class {self.name}>'

