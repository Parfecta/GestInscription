import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/etudiants';

function ModifierEtudiant() {
  const { keyetudiant } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    sexe: '', // Laisser ici vide pour gérer la valeur numérique
    classe_id: '',
    classe_nom: ''
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Ajout de l'état successMessage

  // Récupérer les informations de l'étudiant
  useEffect(() => {
    const fetchEtudiant = async () => {
      try {
        const response = await axios.get(`${API_URL}/${keyetudiant}`);
        if (response.data) {
          // Récupérer et transformer les données
          setFormData({
            ...response.data,
            sexe: response.data.sexe === 1 ? '1' : response.data.sexe === 2 ? '2' : ''
          });
        } else {
          setError("Étudiant introuvable");
        }
      } catch (error) {
        setError("Erreur lors de la récupération des détails de l'étudiant");
        console.error(error);
      }
    };

    fetchEtudiant();
  }, [keyetudiant]);

  // Mettre à jour les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convertir la valeur de sexe en entier
    const sexeValue = formData.sexe === "1" ? 1 : formData.sexe === "2" ? 2 : 0; // 0 si le sexe n'est pas défini

    // Préparer les données à envoyer
    const updatedData = {
      ...formData,
      sexe: sexeValue  // Remplacer le texte par la valeur numérique
    };

    try {
      // Envoyer la requête PUT avec les données modifiées
      await axios.put(`${API_URL}/${keyetudiant}`, updatedData);
      
      // Affichage du message de succès
      setSuccessMessage('Étudiant modifié avec succès.');

      // Attendre 3 secondes avant de rediriger pour laisser le temps au message de succès d'apparaître
      setTimeout(() => {
        navigate('/etudiants');
      }, 3000);  // 3 secondes d'attente
    } catch (error) {
      setError("Erreur lors de la modification de l'étudiant");
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Modifier l'Étudiant</h2>
      
      {/* Affichage du message de succès */}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      
      {/* Affichage du message d'erreur */}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nom</label>
          <input
            type="text"
            className="form-control"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Prénom</label>
          <input
            type="text"
            className="form-control"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Téléphone</label>
          <input
            type="tel"
            className="form-control"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Sexe</label>
          <select className="form-control" name="sexe" value={formData.sexe} onChange={handleChange} required>
            <option value="1">Masculin</option>
            <option value="2">Féminin</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Classe</label>
          <input
            type="text"
            className="form-control"
            name="classe_nom"
            value={formData.classe_nom}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Mettre à jour</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/etudiants')}>
          Annuler
        </button>
      </form>
    </div>
  );
}

export default ModifierEtudiant;
