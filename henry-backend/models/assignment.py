from app import db
from datetime import datetime

class Assignment(db.Model):
    __tablename__ = 'assignments'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    type = db.Column(db.String(50), default='essay')  # 'essay', 'quiz', 'project', 'presentation'
    max_points = db.Column(db.Float, default=100.0)
    due_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), default='active')  # 'active', 'draft', 'closed'
    
    # Configuración de la tarea
    allow_late_submission = db.Column(db.Boolean, default=False)
    max_attempts = db.Column(db.Integer, default=1)
    time_limit = db.Column(db.Integer)  # en minutos
    
    # Relaciones
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'), nullable=False)
    professor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relaciones
    submissions = db.relationship('Submission', backref='assignment', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'type': self.type,
            'max_points': self.max_points,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'status': self.status,
            'allow_late_submission': self.allow_late_submission,
            'max_attempts': self.max_attempts,
            'time_limit': self.time_limit,
            'class_id': self.class_id,
            'class_name': self.class_ref.name if self.class_ref else None,
            'professor_id': self.professor_id,
            'professor_name': self.professor.full_name if self.professor else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'submissions_count': self.submissions.count()
        }
    
    def is_overdue(self):
        """Verifica si la tarea está vencida"""
        return datetime.utcnow() > self.due_date
    
    def days_until_due(self):
        """Calcula los días restantes hasta la fecha límite"""
        if self.due_date:
            delta = self.due_date - datetime.utcnow()
            return delta.days
        return None
    
    def get_submission_stats(self):
        """Retorna estadísticas de entregas"""
        total_submissions = self.submissions.count()
        graded_submissions = self.submissions.filter(Submission.grade.isnot(None)).count()
        
        return {
            'total_submissions': total_submissions,
            'graded_submissions': graded_submissions,
            'pending_grading': total_submissions - graded_submissions,
            'submission_rate': 0  # Calcular basado en estudiantes inscritos
        }
    
    def __repr__(self):
        return f'<Assignment {self.title}>'


class Submission(db.Model):
    __tablename__ = 'submissions'
    
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text)
    file_path = db.Column(db.String(255))
    grade = db.Column(db.Float)
    feedback = db.Column(db.Text)
    attempt_number = db.Column(db.Integer, default=1)
    status = db.Column(db.String(20), default='submitted')  # 'submitted', 'graded', 'returned'
    
    # Relaciones
    assignment_id = db.Column(db.Integer, db.ForeignKey('assignments.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Timestamps
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    graded_at = db.Column(db.DateTime)
    
    # Relación con usuario (estudiante)
    student = db.relationship('User', backref='submissions')
    
    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'file_path': self.file_path,
            'grade': self.grade,
            'feedback': self.feedback,
            'attempt_number': self.attempt_number,
            'status': self.status,
            'assignment_id': self.assignment_id,
            'student_id': self.student_id,
            'student_name': self.student.full_name if self.student else None,
            'submitted_at': self.submitted_at.isoformat() if self.submitted_at else None,
            'graded_at': self.graded_at.isoformat() if self.graded_at else None
        }
    
    def is_late(self):
        """Verifica si la entrega fue tardía"""
        if self.assignment and self.submitted_at:
            return self.submitted_at > self.assignment.due_date
        return False
    
    def __repr__(self):
        return f'<Submission {self.id} for Assignment {self.assignment_id}>'

