from flask import Flask
from flask_cors import CORS
from routes.api import api_bp
from config import Config

def create_app():
    print("=== CREATING FLASK APPLICATION ===")
    app = Flask(__name__)
    app.config.from_object(Config)
    print("Flask app configuration loaded")
    
    # Enable CORS for React frontend
    CORS(app)
    print("CORS enabled for React frontend")
    
    # Register blueprints
    app.register_blueprint(api_bp, url_prefix='/api')
    print("API blueprint registered with prefix '/api'")
    
    print("Flask application created successfully")
    return app

if __name__ == '__main__':
    print("=== STARTING FLASK APPLICATION ===")
    app = create_app()
    print("Starting Flask development server on host='0.0.0.0', port=5000, debug=True")
    app.run(debug=True, host='0.0.0.0', port=5000)