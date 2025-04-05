from flask import Blueprint, jsonify
from models import db, Etudiant, Inscription, Classe, AnneeScolaire
from datetime import datetime
from sqlalchemy import func

# Création du Blueprint pour le Dashboard
dashboard_bp = Blueprint('dashboard', __name__)

# Route pour les statistiques générales
@dashboard_bp.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    total_etudiants = Etudiant.query.count()
    annee_en_cours = AnneeScolaire.query.filter_by(annee_en_cours=True).first()
    total_inscriptions = Inscription.query.filter_by(annee_scolaire_id=annee_en_cours.id).count()
    total_paye = db.session.query(func.sum(Inscription.montant_paye)).scalar() or 0
    total_restant = db.session.query(func.sum(Inscription.reste_a_payer)).scalar() or 0
    
    return jsonify({
        "total_etudiants": total_etudiants,
        "total_inscriptions": total_inscriptions,
        "total_paye": total_paye,
        "total_restant": total_restant
    })

# Route pour les inscriptions par mois
@dashboard_bp.route('/api/dashboard/inscriptions-mensuelles', methods=['GET'])
def get_inscriptions_par_mois():
    annee_en_cours = AnneeScolaire.query.filter_by(annee_en_cours=True).first()
    
    if not annee_en_cours:
        return jsonify({"error": "Aucune année scolaire en cours trouvée"}), 404

    inscriptions_par_mois = db.session.query(
        func.extract('month', Inscription.date_inscription), func.count(Inscription.id)
    ).filter(Inscription.annee_scolaire_id == annee_en_cours.id) \
    .group_by(func.extract('month', Inscription.date_inscription)) \
    .order_by(func.extract('month', Inscription.date_inscription)) \
    .all()

    # Construction des données
    data = [{"mois": int(month), "total": count} for month, count in inscriptions_par_mois]
    
    print("Données envoyées:", data)  # Debugging
    
    return jsonify({"inscriptions": data})

# Route pour la répartition des étudiants par classe
@dashboard_bp.route('/api/dashboard/etudiants-par-classe', methods=['GET'])
def get_etudiants_par_classe():
    etudiants_par_classe = db.session.query(
        Classe.nom, func.count(Etudiant.id)
    ).join(Etudiant).group_by(Classe.nom).all()
    
    data = [{"classe": classe, "total": count} for classe, count in etudiants_par_classe]
    return jsonify(data)

# Route pour les inscriptions récentes
@dashboard_bp.route('/api/dashboard/inscriptions-recentes', methods=['GET'])
def get_inscriptions_recentes():
    inscriptions = Inscription.query.order_by(Inscription.date_inscription.desc()).limit(10).all()
    
    data = [{
        "nom": insc.etudiant.nom,
        "prenom": insc.etudiant.prenom,
        "classe": insc.classe.nom,
        "montant_paye": insc.montant_paye,
        "reste_a_payer": insc.reste_a_payer,
        "statut": "Payé" if insc.reste_a_payer == 0 else "Non payé",
        "date_inscription": insc.date_inscription.strftime('%Y-%m-%d')
    } for insc in inscriptions]
    
    return jsonify(data)

