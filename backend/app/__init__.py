from flask import Flask
from flask_cors import CORS
from app.extensions import db
from app.config import Config

#Rotas
from app.routes.auth import auth_bp
from app.routes.diagnostics import diagnostics_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    db.init_app(app)
    CORS(app)

    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(diagnostics_bp, url_prefix='/api')

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return {'status': 'healthy'}, 200

    return app

