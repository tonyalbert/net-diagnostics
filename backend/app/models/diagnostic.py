from app.extensions import db


class Diagnostic(db.Model):
    """
    Modelo de diagnóstico de rede
    """
    __tablename__ = 'diagnostics'
    
    id = db.Column(db.Integer, primary_key=True)
    device_id = db.Column(db.String(50), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(50), nullable=False)
    latency_ms = db.Column(db.Float, nullable=False)
    packet_loss = db.Column(db.Float, nullable=False)
    quality_of_service = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    
    def __repr__(self):
        return f'<Diagnostic {self.id} - {self.device_id}>'

