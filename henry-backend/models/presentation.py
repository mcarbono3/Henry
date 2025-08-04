from app import db
from datetime import datetime
import json

class Presentation(db.Model):
    __tablename__ = 'presentations'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    topic = db.Column(db.String(100), nullable=False)
    audience = db.Column(db.String(100))
    duration = db.Column(db.String(20))
    style = db.Column(db.String(50), default='professional')
    status = db.Column(db.String(20), default='draft')  # 'draft', 'completed', 'generating'
    slides_count = db.Column(db.Integer, default=0)
    views_count = db.Column(db.Integer, default=0)
    
    # NUEVOS CAMPOS para manejar la fuente de la presentación
    source_type = db.Column(db.String(20), default='ai') # 'ai', 'link', 'upload'
    source_url = db.Column(db.String(500))
    
    # Contenido generado por IA
    content_json = db.Column(db.Text)  # JSON con slides y metadata
    
    # Relaciones
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'topic': self.topic,
            'audience': self.audience,
            'duration': self.duration,
            'style': self.style,
            'status': self.status,
            'slides_count': self.slides_count,
            'views_count': self.views_count,
            'author_id': self.author_id,
            'author_name': self.author.full_name if self.author else None,
            'source_type': self.source_type, # <--- AÑADIDO
            'source_url': self.source_url,   # <--- AÑADIDO
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def get_content(self):
        """Retorna el contenido de la presentación parseado"""
        if self.content_json:
            try:
                return json.loads(self.content_json)
            except json.JSONDecodeError:
                return None
        return None
    
    def set_content(self, content_dict):
        """Establece el contenido de la presentación"""
        self.content_json = json.dumps(content_dict, ensure_ascii=False)
        if 'slides' in content_dict:
            self.slides_count = len(content_dict['slides'])
    
    def increment_views(self):
        """Incrementa el contador de visualizaciones"""
        self.views_count += 1
        db.session.commit()
    
    def get_detailed_info(self):
        """Retorna información detallada incluyendo contenido"""
        base_info = self.to_dict()
        content = self.get_content()
        if content:
            base_info['content'] = content
        return base_info
    
    def __repr__(self):
        return f'<Presentation {self.title}>'
