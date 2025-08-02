from app import db
from datetime import datetime

class Material(db.Model):
    __tablename__ = 'materials'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    type = db.Column(db.String(50), nullable=False)  # 'pdf', 'presentation', 'video', 'link', 'image'
    file_path = db.Column(db.String(255))
    url = db.Column(db.String(500))
    file_size = db.Column(db.BigInteger)  # en bytes
    mime_type = db.Column(db.String(100))
    
    # Metadatos adicionales
    is_public = db.Column(db.Boolean, default=True)
    download_count = db.Column(db.Integer, default=0)
    
    # Relaciones
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'), nullable=False)
    uploaded_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relación con usuario
    uploader = db.relationship('User', backref='uploaded_materials')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'type': self.type,
            'file_path': self.file_path,
            'url': self.url,
            'file_size': self.file_size,
            'file_size_formatted': self.get_formatted_size(),
            'mime_type': self.mime_type,
            'is_public': self.is_public,
            'download_count': self.download_count,
            'class_id': self.class_id,
            'class_name': self.class_ref.name if self.class_ref else None,
            'uploaded_by': self.uploaded_by,
            'uploader_name': self.uploader.full_name if self.uploader else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def get_formatted_size(self):
        """Retorna el tamaño del archivo en formato legible"""
        if not self.file_size:
            return None
        
        # Convertir bytes a unidades más legibles
        for unit in ['B', 'KB', 'MB', 'GB']:
            if self.file_size < 1024.0:
                return f"{self.file_size:.1f} {unit}"
            self.file_size /= 1024.0
        return f"{self.file_size:.1f} TB"
    
    def increment_download_count(self):
        """Incrementa el contador de descargas"""
        self.download_count += 1
        db.session.commit()
    
    def get_download_url(self):
        """Retorna la URL de descarga del material"""
        if self.url:
            return self.url
        elif self.file_path:
            return f"/api/materials/{self.id}/download"
        return None
    
    def is_downloadable(self):
        """Verifica si el material se puede descargar"""
        return self.file_path is not None or self.url is not None
    
    def get_type_icon(self):
        """Retorna el ícono apropiado según el tipo de material"""
        type_icons = {
            'pdf': 'file-text',
            'presentation': 'presentation',
            'video': 'video',
            'link': 'link',
            'image': 'image',
            'audio': 'volume-2',
            'document': 'file-text'
        }
        return type_icons.get(self.type, 'file')
    
    def __repr__(self):
        return f'<Material {self.name}>'

