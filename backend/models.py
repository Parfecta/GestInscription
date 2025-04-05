import random
import string
import uuid
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash


db = SQLAlchemy()

#modèle année scolaire
class AnneeScolaire(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    date_debut = db.Column(db.Date, nullable = False)
    date_fin = db.Column(db.Date, nullable = False)
    statut = db.Column(db.Integer, default = 0) #actif
    annee_en_cours = db.Column(db.Boolean, default=False)
    libelle = db.Column(db.String(255), nullable=False)
    keyannee = db.Column(db.String(32), nullable=False, default = lambda: str(uuid.uuid4().hex))
    created_at = db.Column(db.TIMESTAMP, default=datetime.utcnow)  # Utilisation de TIMESTAMP pour PostgreSQL


def __repr__(self):
        return f"<AnneeScolaire {self.libelle}>"

#modèle niveau
class Niveau(db.Model):
      id = db.Column(db.Integer, primary_key = True)
      nom = db.Column(db.String(50), nullable = False)
      statut = db.Column(db.Integer, default = 0) #actif
      keyniveau = db.Column(db.String(32), nullable=False, default = lambda: str(uuid.uuid4().hex))
      created_at = db.Column(db.TIMESTAMP, default=datetime.utcnow)  # Utilisation de TIMESTAMP pour PostgreSQL

      def __repr__(self):
       return f"<Niveau {self.nom}>"
      
#modèle classe
class Classe(db.Model):
     id = db.Column(db.Integer, primary_key = True)
     nom = db.Column(db.String(50), nullable = False, unique = True)
     libelle = db.Column(db.String(255), nullable = False, unique = True)
     nombre_etudiants = db.Column(db.Integer, nullable = False)
     montant = db.Column(db.Integer, nullable = False)
     niveau_id = db.Column(db.Integer, db.ForeignKey('niveau.id'), nullable = False)
     keyclasse = db.Column(db.String(32), nullable=False, unique= True, default= lambda: str(uuid.uuid4().hex))
     created_at = db.Column(db.TIMESTAMP, default=datetime.utcnow)  # Utilisation de TIMESTAMP pour PostgreSQL

     statut = db.Column(db.Integer, default = 0) #actif

     niveau = db.relationship('Niveau', backref=db.backref('classes', lazy=True))



     def decrementer_places(self):
        if self.nombre_etudiants > 0:
            self.nombre_etudiants -= 1
            db.session.commit()


        else:
            raise ValueError("Aucune place disponible dans cette classe")
        

def __repr__(self):
        return f"<Classe {self.nom}>"




#modele Etudiant
class Etudiant(db.Model):
     id = db.Column(db.Integer, primary_key = True)
     nom = db.Column(db.String(50), nullable = False)
     prenom = db.Column(db.String(50), nullable = False)
     matricule = db.Column(db.String(50), nullable = False, unique = True)
     email = db.Column(db.String(50), nullable = False, unique = True)
     telephone = db.Column(db.String(50), nullable = False)
     sexe = db.Column(db.Integer, nullable=False)  # 1 = Masculin, 2 = Féminin
     classe_id = db.Column(db.Integer, db.ForeignKey('classe.id'), nullable = False)
     statut = db.Column(db.Integer, default = 0)
     keyetudiant = db.Column(db.String(32), nullable=False, unique = True, default=lambda: str(uuid.uuid4().hex))
     created_at = db.Column(db.TIMESTAMP, default=datetime.utcnow)  # Utilisation de TIMESTAMP pour PostgreSQL

     
     classe = db.relationship('Classe', backref=db.backref('etudiants', lazy=True))
@property
def sexe_label(self):
        return "Masculin" if self.sexe == 1 else "Féminin"  
     

def __repr__(self):
        return f"<Etudiant {self.nom} {self.prenom}>"

     
 #modele inscription
class Inscription(db.Model):
          id = db.Column(db.Integer, primary_key = True)
          etudiant_id = db.Column(db.Integer, db.ForeignKey('etudiant.id'), nullable = False)
          classe_id = db.Column(db.Integer, db.ForeignKey('classe.id'), nullable = False)
          annee_scolaire_id = db.Column(db.Integer, db.ForeignKey('annee_scolaire.id'), nullable = False)
          date_inscription = db.Column(db.DateTime, nullable = False, default = datetime.utcnow)
          montant_paye = db.Column(db.Integer, nullable = False)
          reste_a_payer = db.Column(db.Integer, nullable = False)
          statut = db.Column(db.Integer, default = 0)
          keyinscription =db.Column(db.String(32), nullable=False, unique = True, default = lambda:str(uuid.uuid4().hex))
          created_at = db.Column(db.TIMESTAMP, default=datetime.utcnow)  # Utilisation de TIMESTAMP pour PostgreSQL


          etudiant = db.relationship('Etudiant', backref=db.backref('inscriptions', lazy=True))
          classe = db.relationship('Classe', backref=db.backref('inscriptions', lazy=True))
          annee_scolaire = db.relationship('AnneeScolaire', backref=db.backref('inscriptions', lazy=True))

          def __repr__(self):
               return f"<Inscription {self.etudiant.prenom}>"

# paiement
class Paiement(db.Model):
      id = db.Column(db.Integer, primary_key = True)
      inscription_id = db.Column(db.Integer, db.ForeignKey('inscription.id'), nullable = False)
      montant = db.Column(db.Integer, nullable = False)
      statut = db.Column(db.Integer, default = 0)
      date_paiement = db.Column(db.DateTime, nullable = False, default = datetime.utcnow)
      keypaiment = db.Column(db.String(32), nullable=False, unique = True, default = lambda:str(uuid.uuid4().hex))
      created_at = db.Column(db.TIMESTAMP, default=datetime.utcnow)  # Utilisation de TIMESTAMP pour PostgreSQL


      inscription = db.relationship('Inscription', backref=db.backref('paiements', lazy=True))

      def __repr__(self):
          return f"<Paiement {self.montant}>"

#users
class User(db.Model):
      id = db.Column(db.Integer, primary_key = True)
      username = db.Column(db.String(80), unique = True, nullable = False)
      email = db.Column(db.String, unique = True, nullable = False)
      password_hash = db.Column(db.String(255), unique = True, nullable = False)
      role = db.Column(db.String(20), nullable=False)  # "admin" ou "medecin"
      keyuser = db.Column(db.String(32), nullable=False, unique = True, default = lambda:str(uuid.uuid4().hex))
      
      def set_password(self, password):
        self.password_hash = generate_password_hash(password)


      def check_password(self, password):
            return check_password_hash(self.password_hash, password)
            
      
      def __repr__(self):
        return f"<User {self.username}>"
      
      # Générer un matricule sécurisé
def generate_matricule():
    current_year = datetime.utcnow().year % 100  # Récupérer les 2 derniers chiffres de l'année
    letters = ''.join(random.sample(string.ascii_uppercase, 2))
    numbers = ''.join(random.choices(string.digits, k=2))  # Deux chiffres
    return f"ETU-{current_year}{letters}{numbers}"
