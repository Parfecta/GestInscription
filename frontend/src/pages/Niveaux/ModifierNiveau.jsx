import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api/niveau";

const ModifierNiveau = () => {
  const { keyniveau } = useParams(); // Récupère le keyniveau depuis l'URL
  const [nom, setNom] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNiveau = async () => {
      try {
        const response = await axios.get(`${API_URL}/${keyniveau}`);
        setNom(response.data.nom);
      } catch (err) {
        setError("Erreur lors du chargement du niveau !");
        console.error("Erreur:", err.response?.data || err.message);
      }
    };

    fetchNiveau();
  }, [keyniveau]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${keyniveau}`, { nom });
      navigate("/niveaux", { state: { successMessage: "Niveau modifié avec succès !" } });
    } catch (err) {
      setError("Erreur lors de la modification !");
      console.error("Erreur:", err.response?.data || err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Modifier le Niveau</h2>

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

        <button type="submit" className="btn btn-success">Modifier</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate("/niveaux")}>
          Annuler
        </button>
      </form>
    </div>
  );
};

export default ModifierNiveau;
