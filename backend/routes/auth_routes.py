from flask import Blueprint, request, jsonify, make_response
from flask_jwt_extended import create_access_token, get_jwt
from models import User, db
from datetime import timedelta

# Création d'un Blueprint pour la gestion de l'authentification
auth_bp = Blueprint("auth", __name__)

# Ajout de la table pour stocker les tokens blacklistés
class TokenBlacklist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(120), unique=True, nullable=False)  # ID unique du token
    created_at = db.Column(db.DateTime, default=db.func.now())

# Route de connexion
@auth_bp.route("/login", methods=['POST'])
def login():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()

    if not user or not user.check_password(password):
        return jsonify({"msg": "Nom d'utilisateur ou mot de passe incorrect"}), 401

    # Génération du token JWT
    access_token = create_access_token(identity={"username": user.username, "role": user.role})

    # Création de la réponse avec le token dans un cookie sécurisé
    response = make_response(jsonify({
        "msg": "Connexion réussie",
        "role": user.role  # Ajout du rôle dans la réponse
        # "access_token": access_token  # Ajout du token dans la réponse pour Postman
    }))

    # Définition du cookie avec le token
    response.set_cookie(
        'access_token',
        access_token,
        max_age=timedelta(hours=1),
        httponly=True,
        secure=True,
        samesite='Strict'
    )

    return response



# Route de déconnexion
@auth_bp.route("/logout", methods=['POST'])
def logout():
    jti = get_jwt()["jti"]  # Récupération de l'ID du JWT (JTI)

    # Ajouter le token à la blacklist
    db.session.add(TokenBlacklist(jti=jti))
    db.session.commit()

    # Supprimer le cookie contenant le token
    response = make_response(jsonify({"message": "Déconnexion réussie"}))
    response.delete_cookie('access_token')

    return response
