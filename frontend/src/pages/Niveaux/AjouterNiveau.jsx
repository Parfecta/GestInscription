import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api/niveau";

const AjouterNiveau = () => {
  const [nom, setNom] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nom.trim()) {
      setError("Le nom du niveau est requis !");
      return;
    }

    try {
      await axios.post(API_URL, { nom });

      // Redirection avec un message de succès
      navigate("/niveaux", { state: { successMessage: "Niveau ajouté avec succès !" } });
    } catch (err) {
      setError("Erreur lors de l'ajout du niveau !",err);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Ajouter un Niveau</h2>

      {/* Afficher l'erreur s'il y en a une */}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="shadow p-4 rounded">
        <div className="mb-3">
          <label className="form-label">Nom du Niveau</label>
          <input
            type="text"
            className="form-control"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Ajouter</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate("/niveaux")}>
          Annuler
        </button>
      </form>
    </div>
  );
};

export default AjouterNiveau;
