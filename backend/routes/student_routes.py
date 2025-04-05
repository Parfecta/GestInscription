

from flask import Blueprint, jsonify, request

from models import AnneeScolaire, Classe, Etudiant, Inscription, generate_matricule,db


etudiant_bp = Blueprint('etudiant',__name__)

# Route pour ajouter un étudiant et l'inscrire
# Route pour ajouter un étudiant et l'inscrire
@etudiant_bp.route('/api/ajouter_etudiant', methods=['POST'])
def ajouter_etudiant():
    data = request.json

    nom = data.get('nom')
    prenom = data.get('prenom')
    email = data.get('email')
    telephone = data.get('telephone')
    sexe = data.get('sexe')
    keyclasse = data.get('keyclasse')  # Récupération de keyclasse
    montant_paye = data.get('montant_paye')

    # Vérification des champs requis
    if not all([nom, prenom, email, telephone, sexe, keyclasse, montant_paye]):
        return jsonify({"message": "Tous les champs sont requis"}), 400

    # Vérifier si l'email est déjà utilisé
    if Etudiant.query.filter_by(email=email).first():
        return jsonify({"message": "Cet email est déjà utilisé"}), 400

    # Générer un matricule unique
    while True:
        matricule = generate_matricule()
        if not Etudiant.query.filter_by(matricule=matricule).first():
            break

    # Récupérer l'année scolaire en cours
    annee_en_cours = AnneeScolaire.query.filter_by(annee_en_cours=True).first()
    if not annee_en_cours:
        return jsonify({"message": "Aucune année scolaire en cours trouvée"}), 400

    # Récupérer la classe à partir de keyclasse
    classe = Classe.query.filter_by(keyclasse=keyclasse).first()
    if not classe:
        return jsonify({"message": "Classe introuvable"}), 404

    # Récupérer le montant de la classe
    montant_classe = classe.montant  # Assurez-vous que 'montant' existe dans le modèle 'Classe'

    # Vérifier et décrémenter les places restantes
    try:
        classe.decrementer_places()
    except ValueError as e:
        return jsonify({"message": str(e)}), 400  

    # Calculer le reste à payer
    reste_a_payer = montant_classe - montant_paye
    if reste_a_payer < 0:
        return jsonify({"message": "Le montant payé ne peut pas être supérieur au montant de la classe"}), 400

    # Créer l'étudiant
    nouvel_etudiant = Etudiant(
        nom=nom,
        prenom=prenom,
        matricule=matricule,
        email=email,
        telephone=telephone,
        sexe=sexe,
        classe_id=classe.id  # On utilise l'ID de la classe récupérée via keyclasse
    )
    db.session.add(nouvel_etudiant)
    db.session.flush()  # Récupérer l'ID de l'étudiant

    # Créer l'inscription de l'étudiant
    nouvelle_inscription = Inscription(
        etudiant_id=nouvel_etudiant.id,
        classe_id=classe.id,
        annee_scolaire_id=annee_en_cours.id,
        montant_paye=montant_paye,
        reste_a_payer=reste_a_payer
    )
    db.session.add(nouvelle_inscription)
    db.session.commit()  # Commit des changements

    return jsonify({
        "message": "Étudiant ajouté et inscrit avec succès",
        "etudiant": {
            "id": nouvel_etudiant.id,
            "nom": nouvel_etudiant.nom,
            "prenom": nouvel_etudiant.prenom,
            "matricule": nouvel_etudiant.matricule,  
            "email": nouvel_etudiant.email,
        },
        "inscription": {
            "id": nouvelle_inscription.id,
            "date_inscription": nouvelle_inscription.date_inscription,
            "annee_scolaire_id": annee_en_cours.id,
            "montant_paye": montant_paye,
            "reste_a_payer": reste_a_payer
        },
    }), 201

# Route pour récupérer la liste des étudiants avec le nom de la classe
@etudiant_bp.route('/api/etudiants', methods=['GET'])
def get_etudiants():
    etudiants = Etudiant.query.filter_by(statut=0).order_by(Etudiant.created_at.desc()).all()
    etudiants_list = []

    for etudiant in etudiants:
        # Récupérer la classe liée à l'étudiant
        classe = Classe.query.filter_by(id=etudiant.classe_id).first()
        # Mapper les valeurs de sexe
# Mapper les valeurs de sexe
        # sexe = "Masculin" if etudiant.sexe == 1 else "Féminin" if etudiant.sexe == 2 else "Inconnu"


        # Ajouter l'étudiant et la classe à la liste
        etudiants_list.append({
            "id": etudiant.id,
            "keyetudiant": etudiant.keyetudiant,  # Assure-toi que cette clé existe

            "nom": etudiant.nom,
            "prenom": etudiant.prenom,
            "matricule": etudiant.matricule,
            "email": etudiant.email,
            "telephone": etudiant.telephone,
            "sexe": etudiant.sexe,
            "classe_id": etudiant.classe_id,
            "classe_nom": classe.nom if classe else None  # Le nom de la classe liée
        })

    return jsonify(etudiants_list)

@etudiant_bp.route('/api/etudiants/<string:keyetudiant>', methods=['GET'])
def detail_etudiant(keyetudiant):
    etudiant = Etudiant.query.filter_by(keyetudiant=keyetudiant, statut=0).first()  # Vérifier que l'étudiant est actif
    if not etudiant:
        return jsonify({"message": "Étudiant introuvable"}), 404

    classe = Classe.query.filter_by(id=etudiant.classe_id).first()

    return jsonify({
           
         "keyetudiant": etudiant.keyetudiant,  # Ajout ici

        "id": etudiant.id,
        "nom": etudiant.nom,
        "prenom": etudiant.prenom,
        "matricule": etudiant.matricule,
        "email": etudiant.email,
        "telephone": etudiant.telephone,
        "sexe": "Masculin" if etudiant.sexe == 1 else "Féminin",
        "classe_id": etudiant.classe_id,
        "classe_nom": classe.nom if classe else None
    })


# route pour modiifier un étudiant
@etudiant_bp.route('/api/etudiants/<string:keyetudiant>', methods=['PUT'])
def modifier_etudiant(keyetudiant):
    etudiant = Etudiant.query.filter_by(keyetudiant=keyetudiant, statut=0).first()  # Vérifier que l'étudiant est actif
    if not etudiant:
        return jsonify({"message": "Étudiant introuvable"}), 404

    data = request.json

    etudiant.nom = data.get('nom', etudiant.nom)
    etudiant.prenom = data.get('prenom', etudiant.prenom)
    etudiant.email = data.get('email', etudiant.email)
    etudiant.telephone = data.get('telephone', etudiant.telephone)
    etudiant.sexe = data.get('sexe', etudiant.sexe)
    
    keyclasse = data.get('keyclasse')
    if keyclasse:
        classe = Classe.query.filter_by(keyclasse=keyclasse).first()
        if not classe:
            return jsonify({"message": "Classe introuvable"}), 404
        etudiant.classe_id = classe.id

    db.session.commit()
    return jsonify({"message": "Étudiant modifié avec succès"})

@etudiant_bp.route('/api/etudiants/<string:keyetudiant>', methods=['DELETE'])
def supprimer_etudiant(keyetudiant):
    etudiant = Etudiant.query.filter_by(keyetudiant=keyetudiant, statut=0).first()  # Vérifier que l'étudiant est actif
    if not etudiant:
        return jsonify({"message": "Étudiant introuvable"}), 404

    etudiant.statut = 1  # Marquer l'étudiant comme supprimé
    db.session.commit()
    return jsonify({"message": "Étudiant supprimé avec succès"})
