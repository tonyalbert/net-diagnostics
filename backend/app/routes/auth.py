from flask import Blueprint, request, current_app
from datetime import datetime, timedelta
import jwt

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('auth/login', methods=['POST']) 
def login():
    """Endpoint para login do usuário"""
    try:
        data = request.get_json()

        if not data or 'username' not in data or 'password' not in data:
            return {'message': 'Invalid request'}, 400
        
        if data.get('username') == 'admin' and data.get('password') == 'admin':
            token = jwt.encode({
                'username': data.get('username'),
                'exp': datetime.utcnow() + timedelta(hours=24)
            }, current_app.config['SECRET_KEY'], algorithm='HS256')

            return {'token': token}, 200
        
        return {'message': 'Unauthorized'}, 401
    
    except Exception as e:
        return {'message': 'Internal server error'}, 500


@auth_bp.route('auth/verify', methods=['GET'])
def verify_token():
    """Endpoint para verificar token JWT"""
    try:
        token = request.headers.get('Authorization')
        if not token:
            return {'message': 'Token is missing'}, 401
        
        if token.startswith('Bearer '):
            token = token[7:]

        jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        return {'message': 'Token is valid'}, 200
        
    except jwt.ExpiredSignatureError:
        return {'message': 'Token has expired'}, 401
    except jwt.InvalidTokenError:
        return {'message': 'Invalid token'}, 401
    except Exception as e:
        return {'message': 'Internal server error'}, 500