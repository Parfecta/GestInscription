import os
from dotenv import load_dotenv
from flask import app
load_dotenv()  # Charge les variables du fichier .env

class Config:
    SQLALCHEMY_DATABASE_URI=os.environ.get('DATABASE_URL','postgresql://postgres:abichou123@localhost:5432/gest_inscription')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "supersecretkey")

    
