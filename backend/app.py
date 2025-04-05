
import os
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

# Initialisation de Flask
app = Flask(__name__)
CORS(app)

# Charger la configuration depuis config.py
app.config.from_object("config.Config")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-key")

# Initialiser Migrate et JWT AVANT d'importer les modèles
db = SQLAlchemy()  # Nous initialisons db ici sans l'app
migrate = Migrate(app, db)
jwt = JWTManager(app)

# Importer les modèles après l'initialisation de db
from models import db  # Importer db ici (mais ne pas réinitialiser)

# Importer les routes
from routes.auth_routes import auth_bp
from routes.annee_routes import annee_scolaire_bp
from routes.class_routes import classe_bp
from routes.niveau_routes import niveau_bp
from routes.student_routes import etudiant_bp
from routes.inscription_routes import inscription_bp
from routes.dashboard_routes import dashboard_bp
app.register_blueprint(auth_bp)
app.register_blueprint(annee_scolaire_bp)
app.register_blueprint(classe_bp)
app.register_blueprint(niveau_bp)
app.register_blueprint(inscription_bp)
app.register_blueprint(etudiant_bp)
app.register_blueprint(dashboard_bp)
# Initialiser la base de données
db.init_app(app)  

# Vérification de la base de données
with app.app_context():
    db.create_all()
    print("Base de données initialisée avec succès.")

if __name__ == "_main_":
    app.run(debug=True)
