
from flask import Blueprint, jsonify, request
from models import Classe,db

classe_bp =Blueprint('classe', __name__)

#route pour la liste des classes
@classe_bp.route('/api/classes', methods=['GET'])
def get_classes():
    # Récupérer toutes les classes
    classes = Classe.query.filter(Classe.statut == 0).order_by(Classe.created_at.desc()).all()

    result = []

    for classe in classes:
        result.append({
            'keyclasse': classe.keyclasse,
            'nom': classe.nom,
            'nombre_etudiants': classe.nombre_etudiants,
            'niveau': classe.niveau.nom,
            'montant': classe.montant,
            'libelle': classe.libelle,
            'keyclasse':classe.keyclasse,
            'statut': classe.statut
        })
    
    return jsonify(result), 200


#route pour la création d'une classe

@classe_bp.route('/api/classes', methods=['POST'])
def create_classe():
    data = request.get_json()
    
    new_class = Classe(
        nom=data['nom'],
        libelle =data['libelle'],
        nombre_etudiants=data['nombre_etudiants'],  
        niveau_id=data['niveau_id'],
        montant=data['montant'],
        statut=data['statut']
    )

    db.session.add(new_class)
    db.session.commit()
    
    return jsonify({'message': 'Classe créée avec succès'}), 201

#Route pour obtenir l'ancienne valeur avant la modification
@classe_bp.route('/api/classes/<string:keyclasse>', methods=['GET'])
def get_classes_id(keyclasse):
    classe = Classe.query.filter_by(keyclasse=keyclasse).first()  # Recherche par keyclasse
    if not classe:
        return jsonify({"message": "Classe non trouvée"}), 404
    return jsonify({
        'keyclasse': classe.keyclasse,
        'nom': classe.nom,
        'nombre_etudiants': classe.nombre_etudiants,
        'niveau_id': classe.niveau_id,
        'montant': classe.montant,
        'libelle': classe.libelle,
        'statut': classe.statut
    })



# Route pour la modification d'une classe

@classe_bp.route('/api/classes/<string:keyclasse>', methods=['PUT'])
def update_classe(keyclasse):
    classe = Classe.query.filter_by(keyclasse=keyclasse).first()
    if not classe:
        return jsonify({"message":"classe non trouvée"}),404
    data = request.get_json()
    classe.nom= data.get('nom', 'classe.nom')
    classe.libelle = data.get('libelle', 'classe.libelle')
    classe.nombre_etudiants= data.get('nombre_etudiants', 'classe.nombre_etudiants')
    classe.niveau_id= data.get('niveau_id', 'classe.niveau_id')
    classe. montant= data.get('montant', 'classe.montant')

    db.session.commit()
    return jsonify({"message":"classe modifiée avec succès"})
    
# route pour la suppressiion

@classe_bp.route('/api/classes/<string:keyclasse>', methods=['DELETE'])
def delete_classe(keyclasse):
    classe = Classe.query.filter_by(keyclasse=keyclasse).first()
    if not classe:
        return jsonify({'message': 'Classe non trouvée'}), 404

    classe.statut = 1  # Suppression logique
    db.session.commit()
    return jsonify({'message': 'Classe supprimée (logiquement)'}), 200