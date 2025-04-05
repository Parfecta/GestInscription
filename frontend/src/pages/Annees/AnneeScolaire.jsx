import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactPaginate from "react-paginate";

const API_URL = "http://127.0.0.1:5000/api/annee";

const AnneeScolaire = () => {
  const [annees, setAnnees] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [loading, setLoading] = useState(true);
  const anneesPerPage = 5;
  const pagesVisited = pageNumber * anneesPerPage;

  useEffect(() => {
    const fetchAnnees = async () => {
      try {
        setLoading(true);
        // Requête avec anti-cache
        const { data } = await axios.get(API_URL, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          params: { timestamp: Date.now() }
        });
  
        // Conversion forcée des types
        const formattedData = data.map(item => ({
          ...item,
          statut: Number(item.statut), // Garantit 1 ou 0
          annee_en_cours: Boolean(item.annee_en_cours) // Garantit true/false
        }));
  
        setAnnees(formattedData);
      } catch (error) {
        console.error("Erreur fetch:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAnnees();
  }, []);
  const toggleStatut = async (keyannee, currentStatus) => {
    const confirmation = window.confirm(
      `Voulez-vous vraiment ${currentStatus === 1 ? "désactiver" : "activer"} cette année scolaire ?`
    );
    if (!confirmation) return;
  
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/${keyannee}/activer`);
  
      if (response.data.success) {
        console.log("Réponse API : ", response.data.annees); // Ajoute ce log pour vérifier les données retournées
        setAnnees(response.data.annees);  // Met à jour toutes les années après activation
      } else {
        alert("Une erreur est survenue lors de l'activation de l'année scolaire.");
      }
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
      alert("Une erreur est survenue lors de la modification");
    } finally {
      setLoading(false);
    }
  };
  
  const displayAnnees = annees
    .slice(pagesVisited, pagesVisited + anneesPerPage)
    .map((annee, index) => (
      <tr key={annee.keyannee}>
        <td>{pagesVisited + index + 1}</td>
        <td>{annee.libelle}</td>
        <td>
          <span className={`badge ${annee.statut === 1 ? "bg-success" : "bg-danger"}`}>
            {annee.statut === 1 ? "Actif" : "Inactif"}
          </span>
        </td>
        <td>
          <button
            onClick={() => toggleStatut(annee.keyannee, annee.statut)}
            className={`btn btn-sm ${annee.statut === 1 ? "btn-warning" : "btn-success"}`}
            disabled={loading}
          >
            {annee.statut === 1 ? "Désactiver" : "Activer"}
          </button>
        </td>
      </tr>
    ));

  const pageCount = Math.ceil(annees.length / anneesPerPage);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestion des Années Scolaires</h2>
        <Link to="/ajout-annee" className="btn btn-primary">
          Ajouter +
        </Link>
      </div>

      {loading && (
        <div className="Statutext-center mb-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      )}

        <table className="table table-striped table-hover align-middle text-center">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Libellé</th>
            <th>Etat</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayAnnees.length > 0 ? (
            displayAnnees
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                {loading ? "Chargement..." : "Aucune année scolaire trouvée."}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {annees.length > anneesPerPage && (
        <ReactPaginate
          previousLabel={"Précédent"}
          nextLabel={"Suivant"}
          pageCount={pageCount}
          onPageChange={({ selected }) => setPageNumber(selected)}
          containerClassName={"pagination justify-content-start mt-3"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          activeClassName={"active"}
          disabledClassName={"disabled"}
          breakLabel="..."
        />
      )}
    </div>
  );
};

export default AnneeScolaire;