from  flask import Blueprint, request, jsonify
from models import Niveau,db

niveau_bp = Blueprint('niveau', __name__)

#route poour lister les niveaux

@niveau_bp.route('/api/niveau',methods=['GET'])
def get_niveau():
    niveaux = Niveau.query.filter_by(statut=0).order_by(Niveau.created_at.desc()).all()
    result = []
    for niveau in niveaux:
        result.append({
        'keyniveau':niveau.keyniveau,
        'nom':niveau.nom,
        'statut':niveau.statut

    })
    return jsonify(result)

#route pour ajouter un niveau
@niveau_bp.route('/api/niveau',methods=['POST'])
def create_niveau():
    data = request.get_json()
    nom = data.get('nom')
    statut = data.get('statut')
    niveau = Niveau(nom=nom,statut=statut)
    db.session.add(niveau)
    db.session.commit()
    return jsonify({'message':'Niveau ajouté avec succès'}),201

# récuperer l'ancienne valzur avant la modification
@niveau_bp.route('/api/niveau/<string:keyniveau>', methods=['GET'])
def get_niveaux(keyniveau):
    niveau = Niveau.query.filter_by(keyniveau=keyniveau).first()
    if not niveau:
        return jsonify({"message": "niveau non trouvé"}), 404
    return jsonify({"keyniveau": niveau.keyniveau, "nom": niveau.nom})


# route pour modifier un niveau
from flask import request, jsonify
from app import db
from models import Niveau  # Assure-toi que ton modèle Niveau est bien importé

@niveau_bp.route('/api/niveau/<string:keyniveau>', methods=['PUT'])
def update_niveau(keyniveau):
    niveau = Niveau.query.filter_by(keyniveau=keyniveau).first()
    if not niveau:
        return jsonify({"message": "niveau non trouvé"}), 404

    data = request.get_json()
    niveau.nom = data.get('nom', niveau.nom)  # Mettre à jour le nom avec la valeur de la requête

    try:
        # Enregistrer les changements dans la base de données
        db.session.commit()
        return jsonify({"message": "niveau modifié avec succès"}), 200
    except Exception as e:
        db.session.rollback()  # En cas d'erreur, rollback des modifications
        return jsonify({"message": "Erreur lors de la mise à jour du niveau", "error": str(e)}), 500

#route pour la suppression logique

@niveau_bp.route('/api/niveau/<string:keyniveau>', methods=['DELETE'])
def delete_niveau(keyniveau):
    niveau = Niveau.query.filter_by(keyniveau=keyniveau).first()
    if not niveau:
        return jsonify({"message":"niveau non trouvé"}),404
    #suppression logique
    niveau.statut =1
    db.session.commit()
    return jsonify({"message": "niveau supprimé avec succès"})
    