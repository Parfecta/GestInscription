from datetime import datetime
from flask import Blueprint, request,jsonify
from models import db, AnneeScolaire



annee_scolaire_bp = Blueprint('annee_scolaire',__name__)

#Routes pour récupérer les années scolaires

@annee_scolaire_bp.route('/api/annee',methods=['GET']) 

def get_annees_scolaire():
    # récupère toutes les lignes annéées scolaires
    annees = AnneeScolaire.query.order_by(AnneeScolaire.created_at.desc()).all()
    # renvoie les données sous forme de liste de dictionnaires
    result = [] 
    for annee in annees:
        result.append({
            'id':annee.id,
            'date_debut': annee.date_debut,
            'date_fin': annee.date_fin,
            'annee_en_cours': annee.annee_en_cours,
            'libelle': annee.libelle,
            'keyannee': annee.keyannee,
            'statut':annee.statut
        })
        # renvoie la liste des annéées scolaires
    return jsonify(result)
  

  #Création des annees scoalaires
@annee_scolaire_bp.route('/api/annee', methods=['POST'])
def create_annee():
    data = request.get_json()

    try:
        # Extraction et conversion des dates
        date_debut = datetime.strptime(data['date_debut'], "%Y-%m-%d")
        date_fin = datetime.strptime(data['date_fin'], "%Y-%m-%d")

        # Génération du libellé sous format "YYYY - YY"
        annee_debut = date_debut.year
        annee_fin = str(date_fin.year)[2:]  # Prendre les deux derniers chiffres
        libelle = f"{annee_debut} - {annee_fin}"

        # Création de l'année scolaire avec valeurs par défaut
        new_annee = AnneeScolaire(
            date_debut=date_debut,
            date_fin=date_fin,
            libelle=libelle
        )

        db.session.add(new_annee)
        db.session.commit()

        # Retourner la réponse avec toutes les infos
        return jsonify({
            "keyannee": new_annee.keyannee,
            "date_debut": new_annee.date_debut.strftime("%Y-%m-%d"),
            "date_fin": new_annee.date_fin.strftime("%Y-%m-%d"),
            "libelle": new_annee.libelle,
            "statut": new_annee.statut,
            "annee_en_cours": new_annee.annee_en_cours,
            "keyannee": new_annee.keyannee
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400
    # activer et désactiver une annee
@annee_scolaire_bp.route('/api/annee/<string:keyannee>/activer', methods=['PUT'])
def activer_annee(keyannee):
    try:
        # 1. Désactiver toutes les autres années
        AnneeScolaire.query.filter(AnneeScolaire.keyannee != keyannee)\
            .update({'annee_en_cours': False, 'statut': 0}, synchronize_session=False)

        # 2. Activer l'année spécifique
        annee = AnneeScolaire.query.filter_by(keyannee=keyannee).first()
        if not annee:
            db.session.rollback()
            return jsonify({"success": False, "error": "Année non trouvée"}), 404

        annee.annee_en_cours = True
        annee.statut = 1

        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Année activée avec succès",
            "annee_active": {
                "keyannee": annee.keyannee,
                "libelle": annee.libelle,
                "statut": annee.statut,
                "annee_en_cours": annee.annee_en_cours
            },
"annees": [
                {"keyannee": a.keyannee, "libelle": a.libelle,  "annee_en_cours": a.annee_en_cours} 
                for a in AnneeScolaire.query.order_by(AnneeScolaire.created_at.desc()).all()
            ]        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500
