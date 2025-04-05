
from app import db,app
from models import User


with app.app_context():
    admin = User(username="admin", password="admin123", role="admin", email = "admin@gmail.com")
    medecin = User(username="medecin", password="medecin123",role="medecin", email="medecin@gmail.com")

    db.session.add(admin)
    db.session.add(medecin)
    db.session.commit()

    print("Admin et médecin crées avec succès")
