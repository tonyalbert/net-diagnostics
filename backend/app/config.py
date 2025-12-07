import os
from datetime import timedelta

class Config:
    """Configurações do flask"""

    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL', 'sqlite:///default.db'
    )
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SECRET_KEY = os.getenv('SECRET_KEY', 'ABC123@#$%')
    JWT_EXPIRATION = timedelta(hours=24)

    DEBUG = os.getenv('FLASK_DEBUG', 'True') == 'True'
    TESTING = False

