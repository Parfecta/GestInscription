import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { FaEye, FaEdit, FaTrash, FaRedo } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api/etudiants';

function Etudiants() {
  const [etudiants, setEtudiants] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const etudiantsPerPage = 5;
  const navigate = useNavigate();
  const location = useLocation();

  // Fonction pour récupérer la liste des étudiants
  const fetchEtudiants = async () => {
    try {
      const response = await axios.get(API_URL);
      const etudiantsAvecSexe = response.data.map(etudiant => ({
        ...etudiant,
        sexe: etudiant.sexe === 1 ? "Masculin" : "Féminin",
      }));
      setEtudiants(etudiantsAvecSexe);
    } catch (error) {
      setError('Erreur lors de la récupération des étudiants');
      console.error('Erreur:', error);
    }
  };

  useEffect(() => {
    fetchEtudiants();

    // Affichage du message de succès temporaire
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      setTimeout(() => {
        setSuccessMessage('');
        navigate('/etudiants', { replace: true, state: {} });
      }, 3000);
    }
  }, [location, navigate]);

  // Fonction pour supprimer un étudiant
  const handleDelete = async (keyetudiant) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
      try {
        await axios.delete(`${API_URL}/${keyetudiant}`);
        setSuccessMessage('Étudiant supprimé avec succès.');
        fetchEtudiants();
      } catch (error) {
        setError("Erreur lors de la suppression de l'étudiant");
        console.error('Erreur:', error);
      }
    }
  };

  // Fonction pour réinscrire un étudiant
  const handleReinscrire = (keyetudiant) => {
    navigate(`/reinscrire/${keyetudiant}`);
  };
  

  // Pagination
  const pagesVisited = pageNumber * etudiantsPerPage;
  const pageCount = Math.ceil(etudiants.length / etudiantsPerPage);
  const changePage = ({ selected }) => setPageNumber(selected);

  // Affichage des étudiants
  const displayEtudiants = etudiants
    .slice(pagesVisited, pagesVisited + etudiantsPerPage)
    .map((etudiant, index) => (
      <tr key={index}>
        <td>{etudiant.nom}</td>
        <td>{etudiant.prenom}</td>
        <td>{etudiant.matricule}</td>
        <td>{etudiant.email}</td>
        <td>{etudiant.telephone}</td>
        <td>{etudiant.sexe}</td>
        <td>{etudiant.classe_nom}</td>
        <td className="align-middle">
          <div className="d-flex justify-content-center align-items-center gap-2">
            <button className="btn btn-info btn-sm" title="Voir">
              <FaEye />
            </button>

            <button className="btn btn-warning btn-sm" title="Modifier">
              <FaEdit />
            </button>

            <button 
              className="btn btn-danger btn-sm" 
              title="Supprimer"
              onClick={() => handleDelete(etudiant.keyetudiant)}
            >
              <FaTrash />
            </button>

            <button 
              className="btn btn-success btn-sm" 
              title="Réinscrire"
              onClick={() => handleReinscrire(etudiant.keyetudiant)}
            >
              <FaRedo />
            </button>
          </div>
        </td>
      </tr>
    ));

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Liste des Étudiants</h2>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <table className="table table-striped table-hover align-middle text-center">
        <thead className="table-dark">
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Matricule</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Sexe</th>
            <th>Classe</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayEtudiants.length > 0 ? displayEtudiants : (
            <tr>
              <td colSpan="8" className="text-center">
                Aucune donnée trouvée.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <ReactPaginate
        previousLabel={'Précédent'}
        nextLabel={'Suivant'}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={'pagination justify-content-start mt-3'}
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

export default Etudiants;
