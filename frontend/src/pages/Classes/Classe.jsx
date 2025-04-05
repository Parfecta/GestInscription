import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ReactPaginate from "react-paginate";

const API_URL = "http://127.0.0.1:5000/api/classes";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);  // Page actuelle
  const classesPerPage = 5;  // Nombre de classes par page
  const pagesVisited = pageNumber * classesPerPage;  // Définir la page à afficher

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(API_URL);
      if (response.data && Array.isArray(response.data)) {
        setClasses(response.data);
      } else {
        setClasses([]);
      }
    } catch (err) {
      setError("Erreur lors du chargement des classes !");
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (keyclasse) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette classe ?")) {
      try {
        await axios.delete(`${API_URL}/${keyclasse}`);
        setClasses((prevClasses) => prevClasses.filter((classe) => classe.keyclasse !== keyclasse));
      } catch (err) {
        setError(`Erreur lors de la suppression : ${err.message}`);
      }
    }
  };

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/classes", { replace: true, state: {} });
      }, 3000);
    }
  }, [location, navigate]);

  // Découpe les classes pour la page actuelle
  const displayClasses = classes
    .slice(pagesVisited, pagesVisited + classesPerPage)
    .map((classe, index) => (
      <tr key={classe.keyclasse}>
        <td>{pagesVisited + index + 1}</td> {/* Affichage de l'ordre au lieu de l'ID direct */}
        <td>{classe.nom}</td>
        <td>{classe.libelle}</td>
        <td>{classe.nombre_etudiants}</td>
        <td>{classe.niveau}</td>
        <td>{classe.montant} FCFA</td>
        <td>
          <Link to={`/modifier-classe/${classe.keyclasse}`} className="btn btn-warning btn-sm me-2">
            Modifier
          </Link>
          <button onClick={() => handleDelete(classe.keyclasse)} className="btn btn-danger btn-sm">
            Supprimer
          </button>
        </td>
      </tr>
    ));

  // Calcul du nombre total de pages
  const pageCount = Math.ceil(classes.length / classesPerPage);

  // Fonction pour changer de page
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Liste des Classes</h2>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="d-flex justify-content-end mb-3">
        <Link to="/ajouter-classe" className="btn btn-primary">
          + Ajouter une Classe
        </Link>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      ) : (
        <>
        <table className="table table-striped table-hover align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Nom</th>
                <th>Libellé</th>
                <th>Nombre de places restantes</th>
                <th>Niveau</th>
                <th>Montant</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayClasses.length > 0 ? displayClasses : (
                <tr>
                  <td colSpan="7" className="text-center">Aucune classe trouvée.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <ReactPaginate
            previousLabel={"Précédent"}
            nextLabel={"Suivant"}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={"pagination justify-content-start mt-3"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            activeClassName={"active"}
          />
        </>
      )}
    </div>
  );
};

export default Classes;