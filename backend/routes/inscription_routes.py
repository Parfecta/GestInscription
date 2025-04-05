# Route pour récupérer la liste des inscriptions avec les informations liées
from datetime import datetime
from flask import request, jsonify
import uuid


from flask import Blueprint, jsonify,request

from models import db,AnneeScolaire, Classe, Etudiant, Inscription


inscription_bp = Blueprint('inscription',__name__)

# Route pour récupérer la liste des inscriptions avec les informations liées
@inscription_bp.route('/api/inscriptions', methods=['GET'])
def get_inscriptions():
    inscriptions = Inscription.query.filter_by(statut=0).order_by(Inscription.created_at.desc()).all()
    inscriptions_list = []

    for inscription in inscriptions:
        # Récupérer l'étudiant lié à l'inscription
        etudiant = Etudiant.query.filter_by(id=inscription.etudiant_id).first()
        # Récupérer l'année scolaire liée à l'inscription
        annee_scolaire = AnneeScolaire.query.filter_by(id=inscription.annee_scolaire_id).first()
        # Récupérer la classe liée à l'inscription
        classe = Classe.query.filter_by(id=inscription.classe_id).first()

        # Ajouter les informations à la liste des inscriptions
        inscriptions_list.append({
            "id": inscription.id,
            "keyinscription": inscription.keyinscription,
            "etudiant_id": inscription.etudiant_id,
            "etudiant_nom": etudiant.nom,
            "etudiant_prenom": etudiant.prenom,
            "annee_scolaire_id": inscription.annee_scolaire_id,
            "annee_scolaire_libelle": annee_scolaire.libelle,
            "montant_paye": inscription.montant_paye,
            "reste_a_payer": inscription.reste_a_payer,
            "classe_id": inscription.classe_id,
            "classe_nom": classe.nom,
            "date_inscription": inscription.date_inscription.strftime("%d-%m-%Y") if inscription.date_inscription else None
        })

    return jsonify(inscriptions_list)


@inscription_bp.route('/api/inscriptions/<string:keyinscription>', methods=['GET'])
def get_inscription_detail(keyinscription):
    # Récupération de l'inscription par la clé unique
    inscription = Inscription.query.filter_by(keyinscription=keyinscription).first()
    
    # Si l'inscription n'existe pas, retour d'une erreur 404
    if not inscription:
        return jsonify({"message": "Inscription introuvable"}), 404

    # Vérification de la validité des relations
    classe_nom = inscription.classe.nom if inscription.classe else "Non spécifié"
    annee_scolaire_libelle = inscription.annee_scolaire.libelle if inscription.annee_scolaire else "Non spécifié"
    
    # Si l'étudiant n'existe pas (dans le cas improbable), gérer l'erreur
    if not inscription.etudiant:
        return jsonify({"message": "Étudiant introuvable pour cette inscription"}), 404

    inscription_detail = {
        "keyinscription": inscription.keyinscription,
        "nom": inscription.etudiant.nom,
        "prenom": inscription.etudiant.prenom,
        "matricule": inscription.etudiant.matricule,
        "montant_paye": inscription.montant_paye,
        "reste_a_payer": inscription.reste_a_payer,
        "annee_scolaire": annee_scolaire_libelle,
        "date_inscription":inscription.date_inscription,
        "classe": classe_nom
    }

    return jsonify(inscription_detail), 200

@inscription_bp.route('/api/inscriptions/<string:keyinscription>', methods=['PUT'])
def update_inscription(keyinscription):
    # Récupération de l'inscription
    inscription = Inscription.query.filter_by(keyinscription=keyinscription).first()

    # Vérifier si l'inscription existe
    if not inscription:
        return jsonify({"message": "Inscription introuvable"}), 404

    # Récupération des données envoyées par le frontend
    data = request.json
    montant_paye = data.get("montant_paye")
    reste_a_payer = data.get("reste_a_payer")

    # Vérification des données
    if montant_paye is None or reste_a_payer is None:
        return jsonify({"message": "Données invalides"}), 400

    try:
        # Mise à jour des montants
        inscription.montant_paye = montant_paye
        inscription.reste_a_payer = reste_a_payer

        # Enregistrer les modifications
        from app import db  # Importer l'instance db ici pour éviter les références circulaires
        db.session.commit()

        # Récupération des informations liées (étudiant et classe)
        etudiant = inscription.etudiant
        classe = inscription.classe

        # Préparer la réponse avec les informations mises à jour
        response = {
            "message": "Paiement mis à jour avec succès",
            "keyinscription": inscription.keyinscription,
            "montant_paye": inscription.montant_paye,
            "reste_a_payer": inscription.reste_a_payer,
            "etudiant_nom": etudiant.nom if etudiant else "Non spécifié",
            "etudiant_prenom": etudiant.prenom if etudiant else "Non spécifié",
            "classe_nom": classe.nom if classe else "Non spécifié"
        }

        return jsonify(response), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Erreur lors de la mise à jour", "error": str(e)}), 500


@inscription_bp.route('/api/etudiants/reinscrire/<string:keyetudiant>', methods=['PUT'])
def reinscrire_etudiant(keyetudiant):
    data = request.get_json()

    keyclasse = data.get("classe_id")  # c'est en réalité keyclasse
    montant_paye = data.get("montant_paye")

    if not all([keyclasse, montant_paye]):
        return jsonify({"message": "Données manquantes"}), 400

    try:
        etudiant = Etudiant.query.filter_by(keyetudiant=keyetudiant).first()
        if not etudiant:
            return jsonify({"message": "Étudiant introuvable"}), 404

        annee_en_cours = AnneeScolaire.query.filter_by(annee_en_cours=True).first()
        if not annee_en_cours:
            return jsonify({"message": "Aucune année scolaire active"}), 400

        existing = Inscription.query.filter_by(
            etudiant_id=etudiant.id,
            annee_scolaire_id=annee_en_cours.id).first()
        if existing:
            return jsonify({"message": "Déjà inscrit pour cette année"}), 409

        # ➤ Récupération de la classe par la clé
        classe = Classe.query.filter_by(keyclasse=keyclasse).first()
        if not classe:
            return jsonify({"message": "Classe introuvable"}), 404

        montant_total = classe.montant
        reste_a_payer = montant_total - float(montant_paye)
        if reste_a_payer < 0:
            return jsonify({"message": "Montant payé supérieur au montant total"}), 400

        nouvelle_inscription = Inscription(
            etudiant_id=etudiant.id,
            classe_id=classe.id,
            annee_scolaire_id=annee_en_cours.id,
            montant_paye=montant_paye,
            reste_a_payer=reste_a_payer,
            date_inscription=datetime.now()
        )

        db.session.add(nouvelle_inscription)
        db.session.commit()

        return jsonify({"message": "Réinscription réussie"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Erreur serveur", "error": str(e)}), 500
