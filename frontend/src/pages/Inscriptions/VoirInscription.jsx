import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/inscriptions';

function VoirInscription() {
  const { keyinscription } = useParams();
  const navigate = useNavigate();
  const [inscription, setInscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInscription = async () => {
        try {
          const response = await axios.get(`${API_URL}/${keyinscription}`);
          if (response.data) {
            setInscription(response.data);
          } else {
            setError('Inscription introuvable');
          }
        } catch (error) {
          console.error('Erreur lors de la récupération de l\'inscription:', error);
          setError('Erreur lors de la récupération de l\'inscription');
        } finally {
          setLoading(false);
        }
      };

    fetchInscription();
  }, [keyinscription]);

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
      <h2>Détails de l'Inscription</h2>
      <div className="card mt-4">
        <div className="card-body">
          <p><strong>Année Scolaire:</strong> {inscription.annee_scolaire}</p>
          <p><strong>Matricule:</strong> {inscription.matricule}</p>
          <p><strong>Nom:</strong> {inscription.nom}</p>
          <p><strong>Prénom:</strong> {inscription.prenom}</p>
          <p><strong>Classe:</strong> {inscription.classe}</p>
          <p><strong>Montant Payé:</strong> {inscription.montant_paye} FCFA</p>
          <p><strong>Reste à Payer:</strong> {inscription.reste_a_payer} FCFA</p>

          {/* Bouton "Compléter le Paiement" si le reste à payer est supérieur à 0 */}
          {inscription.reste_a_payer > 0 && (
            <div className="mt-3">
              <button
                className="btn btn-warning"
                onClick={() => navigate(`/completer-paiement/${inscription.keyinscription}`)}
              >
                Compléter le Paiement
              </button>
            </div>
          )}
        </div>
      </div>

      <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
        Retour
      </button>
    </div>
  );
}

export default VoirInscription;
