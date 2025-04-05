import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_CLASSES = "http://127.0.0.1:5000/api/classes";
const API_NIVEAUX = "http://127.0.0.1:5000/api/niveau"; // API pour récupérer les niveaux disponibles

const ModifierClasse = () => {
  const { keyclasse } = useParams(); // Récupère l'ID depuis l'URL
  const navigate = useNavigate();

  // États pour stocker les données du formulaire
  const [nom, setNom] = useState("");
  const [libelle, setLibelle] = useState("");
  const [nombreEtudiants, setNombreEtudiants] = useState("");
  const [niveauId, setNiveauId] = useState(""); // Stocke l'ID du niveau
  const [niveaux, setNiveaux] = useState([]);
  const [montant, setMontant] = useState("");
  const [error, setError] = useState("");

  // Récupérer la liste des niveaux
  useEffect(() => {
    const fetchNiveaux = async () => {
      try {
        const response = await axios.get(API_NIVEAUX);
        setNiveaux(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des niveaux !");
        console.error("Erreur:", err);
      }
    };

    fetchNiveaux();
  }, []);

  // Récupérer les données de la classe à modifier
  useEffect(() => {
    const fetchClasse = async () => {
      try {
        const response = await axios.get(`${API_CLASSES}/${keyclasse}`);
        const data = response.data;

        setNom(data.nom);
        setLibelle(data.libelle);
        setNombreEtudiants(data.nombre_etudiants);
        setNiveauId(data.niveau_id); // Récupère l'ID du niveau
        setMontant(data.montant);
      } catch (err) {
        setError("Erreur lors du chargement de la classe !");
        console.error("Erreur:", err);
      }
    };

    fetchClasse();
  }, [keyclasse]);

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_CLASSES}/${keyclasse}`, {
        nom,
        libelle,
        nombre_etudiants: nombreEtudiants,
        niveau_id: niveauId, // Envoie l'ID du niveau
        montant,
      });

      navigate("/classes", { state: { successMessage: "Classe modifiée avec succès !" } });
    } catch (err) {
      setError("Erreur lors de la modification !");
      console.error("Erreur:", err);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Modifier la Classe</h2>

      {/* Afficher l'erreur si elle existe */}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="shadow p-4 rounded">
        <div className="mb-3">
          <label className="form-label">Nom</label>
          <input
            type="text"
            className="form-control"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Libellé</label>
          <input
            type="text"
            className="form-control"
            value={libelle}
            onChange={(e) => setLibelle(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Nombre de places restantes</label>
          <input
            type="number"
            className="form-control"
            value={nombreEtudiants}
            onChange={(e) => setNombreEtudiants(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="niveauId" className="form-label">Niveau de la classe</label>
          <select
            id="niveauId"
            className="form-control select2"
            value={niveauId}  
            onChange={(e) => setNiveauId(e.target.value)}
          >
            {/* <option value="">Sélectionnez un niveau</option> */}
            {niveaux.map((niveau) => (
              <option key={niveau.keyniveau} value={niveau.keyniveau}>
                {niveau.nom}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Montant</label>
          <input
            type="number"
            className="form-control"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-success">Modifier</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate("/classes")}>
          Annuler
        </button>
      </form>
    </div>
  );
};

export default ModifierClasse;
