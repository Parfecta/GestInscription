import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/inscriptions';

function CompleterPaiement() {
  const { keyinscription } = useParams();
  // const navigate = useNavigate();
  const [inscription, setInscription] = useState(null);
  const [nouveauMontant, setNouveauMontant] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInscription = async () => {
      try {
        const response = await axios.get(`${API_URL}/${keyinscription}`);
        if (response.data) {
          setInscription(response.data);
          setNouveauMontant('');
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

  const handlePaiement = async () => {
    const montantFloat = parseFloat(nouveauMontant);

    if (isNaN(montantFloat) || montantFloat <= 0) {
      setError("Veuillez saisir un montant valide supérieur à 0.");
      return;
    }

    if (montantFloat > inscription.reste_a_payer) {
      setError("Le montant saisi dépasse le reste à payer.");
      return;
    }

    try {
      const response = await axios.put(`${API_URL}/${keyinscription}`, {
        montant_paye: inscription.montant_paye + montantFloat,
        reste_a_payer: inscription.reste_a_payer - montantFloat,
      });

      if (response.data) {
        setSuccess("Paiement mis à jour avec succès !");
        setError('');
        setNouveauMontant('');

        // Actualiser les données
        setInscription((prev) => ({
          ...prev,
          montant_paye: prev.montant_paye + montantFloat,
          reste_a_payer: prev.reste_a_payer - montantFloat,
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du paiement:', error);
      setError('Erreur lors de la mise à jour du paiement');
    }
  };

  if (loading) return <div className="text-center mt-5"><strong>Chargement...</strong></div>;

  if (error && !inscription) {
    return (
      <div className="alert alert-danger mt-5 text-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Compléter le Paiement</h2>

      <div className="card shadow-sm rounded-lg" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div className="card-body">
          {/* Infos étudiant */}
          <h5 className="text-center font-weight-bold mb-3">
            {inscription.nom} {inscription.prenom}
          </h5>
          <p className="text-center text-muted">Classe : {inscription.classe}</p>

          {/* Message succès ou erreur */}
          {success && (
            <div className="alert alert-success text-center" role="alert">
              {success}
            </div>
          )}
          {error && (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          )}

          {/* Tableau des montants */}
          <table className="table table-borderless">
            <tbody>
              <tr>
                <th>Montant déjà payé</th>
                <td>{inscription.montant_paye} FCFA</td>
              </tr>
              <tr>
                <th>Reste à payer</th>
                <td>{inscription.reste_a_payer} FCFA</td>
              </tr>
            </tbody>
          </table>

          {/* Champ de saisie du montant */}
          <div className="form-group mt-4">
            <label htmlFor="nouveauMontant">Saisir le montant à payer</label>
            <input
              type="number"
              className="form-control form-control-lg"
              id="nouveauMontant"
              value={nouveauMontant}
              onChange={(e) => setNouveauMontant(e.target.value)}
              min="0"
              max={inscription.reste_a_payer}
              placeholder="Entrez le montant"
            />
          </div>

          {/* Bouton */}
          <div className="d-grid gap-2 mt-4">
            <button className="btn btn-success btn-lg" onClick={handlePaiement}>
              Compléter le Paiement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompleterPaiement;
