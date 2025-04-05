import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaEnvelope, FaPhone, FaVenusMars, FaChalkboardTeacher, FaHashtag } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api/etudiants';

function EtudiantDetails({ etudiant }) {
  const sexeValue = Number(etudiant.sexe);

  return (
    <div className="card shadow-lg mt-4 border-0 rounded-4">
      <div className="card-body d-flex flex-column flex-md-row align-items-center">
        <img
          src={`https://ui-avatars.com/api/?name=${etudiant.prenom}+${etudiant.nom}&background=random&size=128`}
          alt="Avatar"
          className="rounded-circle mb-4 mb-md-0 me-md-4"
          style={{ width: '120px', height: '120px' }}
        />
        <div className="w-100">
          <h4 className="mb-3">
            <FaUser className="me-2 text-primary" />
            {etudiant.prenom} {etudiant.nom}
          </h4>
          <p><FaHashtag className="me-2 text-secondary" /><strong>Matricule:</strong> {etudiant.matricule}</p>
          <p><FaEnvelope className="me-2 text-secondary" /><strong>Email:</strong> {etudiant.email}</p>
          <p><FaPhone className="me-2 text-secondary" /><strong>Téléphone:</strong> {etudiant.telephone}</p>
          <p><FaVenusMars className="me-2 text-secondary" /><strong>Sexe:</strong> {sexeValue === 1 ? 'Masculin' : 'Féminin'}</p>
          <p><FaChalkboardTeacher className="me-2 text-secondary" /><strong>Classe:</strong> {etudiant.classe_nom}</p>
        </div>
      </div>
    </div>
  );
}

function VoirEtudiant() {
  const { keyetudiant } = useParams();
  const navigate = useNavigate();
  const [etudiant, setEtudiant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEtudiant = async () => {
      try {
        const response = await axios.get(`${API_URL}/${keyetudiant}`);
        if (response.data) {
          setEtudiant(response.data);
        } else {
          setError('Étudiant introuvable');
        }
      } catch (error) {
        setError('Erreur lors de la récupération des détails de l\'étudiant',error);
      } finally {
        setLoading(false);
      }
    };

    fetchEtudiant();
  }, [keyetudiant]);

  if (loading) {
    return <div className="text-center mt-5"><strong>Chargement...</strong></div>;
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-5 text-center">
        <p>{error}</p>
        <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Détails de l'Étudiant</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          ⬅ Retour
        </button>
      </div>
      <EtudiantDetails etudiant={etudiant} />
    </div>
  );
}

export default VoirEtudiant;
