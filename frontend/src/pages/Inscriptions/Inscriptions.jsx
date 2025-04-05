import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { FaPlus, FaEye, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api/inscriptions';

function Inscriptions() {
  const [inscriptions, setInscriptions] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const inscriptionsPerPage = 5;
  const pagesVisited = pageNumber * inscriptionsPerPage;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchInscriptions = async () => {
      try {
        const response = await axios.get(API_URL);
        setInscriptions(response.data);
      } catch (error) {
        setError('Erreur lors de la récupération des inscriptions');
        console.error('Erreur:', error);
      }
    };

    fetchInscriptions();

    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      setTimeout(() => {
        setSuccessMessage('');
        navigate('/inscriptions', { replace: true, state: {} });
      }, 3000);
    }
  }, [location, navigate]);

  const displayInscriptions = inscriptions
    .slice(pagesVisited, pagesVisited + inscriptionsPerPage)
    .map((inscription, index) => (
      <tr key={inscription.id}>
        <td>{index + 1 + pagesVisited}</td>
        <td>{inscription.date_inscription}</td>
        <td>{inscription.etudiant_nom}</td>
        <td>{inscription.etudiant_prenom}</td>
        <td>{inscription.annee_scolaire_libelle}</td>
        <td>{inscription.classe_nom}</td>
        <td>{inscription.montant_paye} FCFA</td>
        <td>{inscription.reste_a_payer} FCFA</td>
        <td>
          <Link
            to={`/voir-inscription/${inscription.keyinscription}`}
            className="btn btn-outline-info btn-sm"
            title="Voir l'inscription"
          >
            <FaEye /> Voir
          </Link>
        </td>
        <td>
          <span className={`badge ${inscription.reste_a_payer === 0 ? 'bg-success' : 'bg-danger'}`}>
            {inscription.reste_a_payer === 0 ? (
              <>
                <FaCheckCircle className="me-1" /> Soldé
              </>
            ) : (
              <>
                <FaTimesCircle className="me-1" /> Non Soldé
              </>
            )}
          </span>
        </td>
      </tr>
    ));

  const pageCount = Math.ceil(inscriptions.length / inscriptionsPerPage);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Liste des Inscriptions</h2>
        <Link to="/ajouter-etudiant" className="btn btn-primary">
          <FaPlus className="me-2" /> Ajouter une inscription
        </Link>
      </div>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive shadow-sm rounded">
        <table className="table table-striped table-hover align-middle text-center">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Année</th>
              <th>Classe</th>
              <th>Payé</th>
              <th>Reste</th>
              <th>Action</th>
              <th>État de paiement</th>
            </tr>
          </thead>
          <tbody>
            {displayInscriptions.length > 0 ? (
              displayInscriptions
            ) : (
              <tr>
                <td colSpan="10" className="text-muted text-center py-3">
                  Aucune inscription trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ReactPaginate
        previousLabel={'← Précédent'}
        nextLabel={'Suivant →'}
        pageCount={pageCount}
        onPageChange={({ selected }) => setPageNumber(selected)}
        containerClassName={'pagination justify-content-start mt-4'}
        pageClassName={'page-item'}
        pageLinkClassName={'page-link'}
        previousClassName={'page-item'}
        previousLinkClassName={'page-link'}
        nextClassName={'page-item'}
        nextLinkClassName={'page-link'}
        activeClassName={'active'}
      />
    </div>
  );
}

export default Inscriptions;
