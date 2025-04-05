import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api/annee";

const AjouterAnnee = () => {
  const [libelle, setLibelle] = useState("");
  const [date_debut, setDateDebut] = useState("");
  const [date_fin, setDateFin] = useState("");
  const[error, setError] = useState(""); //pour stocker l'erreur
  const navigate = useNavigate();

    // Fonction pour mettre à jour le libellé
  const updateLibelle = (debut, fin) => {
    if (debut && fin) {
      const  debutDate = new Date(debut);
      const finDate = new Date(fin);

      if( debutDate >finDate){
        setError("la date de début ne peut pas être supérieure à la date de fin");
        setLibelle(""); 
        
      }else{
        setError("");
        const anneeDebut = new Date(debut).getFullYear();
        const anneeFin = new Date(fin).getFullYear();
        setLibelle(`${anneeDebut}-${anneeFin % 100}`); // Format 2024-25

      }



     
    }

  
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(error) return; //empêcher la soumission en cas d'erreur
    const nouvelleAnnee = { libelle, date_debut, date_fin, statut: 0 };

    await axios.post(API_URL, nouvelleAnnee);

    navigate("/annees"); // Redirection après l'ajout
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Ajouter une Année Scolaire</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded">
        <div className="mb-3">
          <label className="form-label">Date de début</label>
          <input
            type="date"
            className="form-control"
            value={date_debut}
            onChange={(e) => {
              setDateDebut(e.target.value);
              updateLibelle(e.target.value, date_fin);
            }}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Date de fin</label>
          <input
            type="date"
            className="form-control"
            value={date_fin}
            onChange={(e) => {
              setDateFin(e.target.value);
              updateLibelle(date_debut, e.target.value);
            }}
            required
          />
        </div>
        {/* Message d'erreur affiché si date_debut > date_fin */}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label className="form-label">Libellé de l'année</label>
          <input
            type="text"
            className="form-control"
            value={libelle}
            readOnly // Empêche l'édition manuelle
            disabled= "disable"
          />
        </div>

        <button type="submit" className="btn btn-success" >Ajouter</button>
      </form>
    </div>
  );
};

export default AjouterAnnee;
