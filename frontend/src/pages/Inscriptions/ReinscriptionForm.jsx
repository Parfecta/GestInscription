import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ReinscriptionForm = () => {
  const navigate = useNavigate();
  const { keyetudiant } = useParams();

  const [etudiant, setEtudiant] = useState(null);
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    classe_id: '',
    montant_paye: '',
    annee_scolaire_id: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Récupération de l'étudiant
    axios.get(`http://localhost:5000/api/etudiants/${keyetudiant}`)
      .then(res => {
        const data = res.data;
        setEtudiant(data);
        setFormData(prev => ({
          ...prev,
          classe_id: data.keyclasse
        }));
      })
      .catch(err => {
        console.error("Erreur étudiant:", err);
        setError("Erreur lors du chargement de l'étudiant");
      });

    // Récupération des classes
    axios.get('http://localhost:5000/api/classes')
      .then(res => setClasses(res.data))
      .catch(err => console.error("Erreur classes :", err));

    // Récupération de l'année scolaire en cours
    axios.get('http://localhost:5000/api/annee')
      .then(res => {
        const currentYear = res.data.find(a => a.libelle === 'Année en cours');
        if (currentYear) {
          setFormData(prev => ({
            ...prev,
            annee_scolaire_id: currentYear.keyannee
          }));
        }
      })
      .catch(err => console.error("Erreur année scolaire :", err));
  }, [keyetudiant]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setMessage('');
    setError('');

    const payload = {
      classe_id: formData.classe_id,
      montant_paye: formData.montant_paye,
      annee_scolaire_id: formData.annee_scolaire_id
    };

    axios.put(`http://localhost:5000/api/etudiants/reinscrire/${keyetudiant}`, payload)
      .then(res => {
        setMessage(res.data.message || 'Réinscription réussie.');
        setTimeout(() => navigate('/inscriptions'), 1000);
      })
      .catch(err => {
        console.error("Erreur réinscription :", err);
        if (err.response) {
          setError(err.response.data.message || 'Erreur lors de la réinscription.');
        } else {
          setError("Erreur réseau ou serveur.");
        }
      });
  };

  return (
    <div className="container mt-4">
      <h3>Réinscription d’un étudiant</h3>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Étudiant</label>
          <input
            type="text"
            value={etudiant ? `${etudiant.nom} ${etudiant.prenom}` : ''}
            className="form-control"
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Classe</label>
          <select
            name="classe_id"
            value={formData.classe_id}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Sélectionnez une classe</option>
            {classes.map((classe, index) => (
              <option
                key={index}
                value={classe.keyclasse}
                disabled={classe.nombre_etudiants === 0}
              >
                {classe.nom} - {classe.montant} FCFA - {classe.nombre_etudiants} places restantes
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Montant payé</label>
          <input
            type="number"
            name="montant_paye"
            value={formData.montant_paye}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          <i className="fas fa-user-check me-2"></i> Réinscrire
        </button>
      </form>
    </div>
  );
};

export default ReinscriptionForm;
