import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api/classes";
const API_NIVEAUX = "http://127.0.0.1:5000/api/niveau";

const AjouterClasse = () => {
  const [nom, setNom] = useState("");
  const [libelle, setLibelle] = useState("");
  const [nombreEtudiants, setNombreEtudiants] = useState("");
  const [niveauId, setNiveauId] = useState("");
  const [montant, setMontant] = useState("");
  const [niveaux, setNiveaux] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNiveaux = async () => {
      try {
        const response = await axios.get(API_NIVEAUX);
        setNiveaux(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des niveaux !", err);
      }
    };

    fetchNiveaux();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, { nom, libelle, nombre_etudiants: nombreEtudiants, niveau_id: niveauId, montant });
      navigate("/classes", { state: { successMessage: "Classe ajoutée avec succès !" } });
    } catch (err) {
      setError("Erreur lors de l'ajout !", err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Ajouter une Classe</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="shadow p-4 rounded">
        <div className="mb-3">
          <label htmlFor="nom" className="form-label">Nom de la Classe</label>
          <input
            type="text"
            id="nom"
            className="form-control"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="libelle" className="form-label">Libellé</label>
          <input
            type="text"
            id="libelle"
            className="form-control"
            value={libelle}
            onChange={(e) => setLibelle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="nombreEtudiants" className="form-label">Nombre de places</label>
          <input
            type="number"
            id="nombreEtudiants"
            className="form-control"
            value={nombreEtudiants}
            onChange={(e) => setNombreEtudiants(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="niveau" className="form-label">Niveau de la classe</label>
          <select
            id="niveau"
            className="form-control select2"
            value={niveauId}
            onChange={(e) => setNiveauId(e.target.value)}
            required
          >
            <option value="">Sélectionner un niveau</option>
            {niveaux.map((niveau) => (
              <option key={niveau.keyniveau} value={niveau.keyniveau}>{niveau.nom}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="montant" className="form-label">Montant</label>
          <input
            type="number"
            id="montant"
            className="form-control"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Ajouter</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate("/classes")}>
          Annuler
        </button>      </form>
    </div>
  );
};

export default AjouterClasse;
