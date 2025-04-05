import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ReactPaginate from "react-paginate";

const API_URL = "http://127.0.0.1:5000/api/niveau";

const Niveaux = () => {
  const [niveaux, setNiveaux] = useState([]); 
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [pageNumber, setPageNumber] = useState(0);  // Page actuelle
  const niveauxPerPage = 5;  // Nombre de niveaux par page
  const pagesVisited = pageNumber * niveauxPerPage;  // Définir la page à afficher

  const location = useLocation();
  const navigate = useNavigate();

  // Fonction pour récupérer la liste des niveaux
  const fetchNiveaux = async () => {
    try {
      const response = await axios.get(API_URL);
      if (response.data && Array.isArray(response.data)) {
        setNiveaux(response.data);
      } else {
        setNiveaux([]);
      }
    } catch (err) {
      setError("Erreur lors du chargement des niveaux !");
      console.error("Erreur:", err);
    }
  };

  useEffect(() => {
    fetchNiveaux();

    // Vérifier s'il y a un message de succès à afficher
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);

      // Effacer le message après 3 secondes
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/niveaux", { replace: true, state: {} }); 
      }, 3000);
    }
  }, [location, navigate]);

  // Fonction pour supprimer un niveau
  const handleDelete = async (keyniveau) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce niveau ?")) {
      try {
        await axios.delete(`${API_URL}/${keyniveau}`);
        setNiveaux(niveaux.filter((niveau) => niveau.keyniveau !== keyniveau)); 
      } catch (err) {
        setError("Erreur lors de la suppression !");
        console.error("Erreur:", err);
      }
    }
  };

  // Découpe les niveaux pour la page actuelle
  const displayNiveaux = niveaux
    .slice(pagesVisited, pagesVisited + niveauxPerPage)
    .map((niveau, index) => (
      <tr key={niveau.keyniveau}>
        <td>{pagesVisited + index + 1}</td>  {/* Affichage de l'ordre au lieu de l'ID direct */}
        <td>{niveau.nom}</td>
        <td>
          <Link to={`/modifier-niveau/${niveau.keyniveau}`} className="btn btn-warning btn-sm me-2">
            Modifier
          </Link>
          <button onClick={() => handleDelete(niveau.keyniveau)} className="btn btn-danger btn-sm">
            Supprimer
          </button>
        </td>
      </tr>
    ));

  // Calcul du nombre total de pages
  const pageCount = Math.ceil(niveaux.length / niveauxPerPage);

  // Fonction pour changer de page
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Liste des Niveaux</h2>

      {/* Message de succès */}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      {/* Message d'erreur */}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="d-flex justify-content-end mb-3">
        <Link to="/ajouter-niveau" className="btn btn-primary">
          + Ajouter un Niveau
        </Link>
      </div>

      <table className="table table-bordered shadow-sm text-center">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Nom</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayNiveaux.length > 0 ? displayNiveaux : (
            <tr>
              <td colSpan="3" className="text-center">Aucun niveau trouvé.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination avec les classes Bootstrap ou AdminKit */}
      <ReactPaginate
        previousLabel={"Précédent"}
        nextLabel={"Suivant"}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={"pagination justify-content-start mt-3"}  // Modifié pour aligner à gauche
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        activeClassName={"active"}
      />
    </div>
  );
};

export default Niveaux;
