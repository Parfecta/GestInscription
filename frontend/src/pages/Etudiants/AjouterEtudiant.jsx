import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api/ajouter_etudiant";

const Etudiants = () => {
  const [etudiant, setEtudiant] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    sexe: "", // Valeur par défaut pour éviter une sélection vide
    keyclasse: "", // Utilisation de keyclasse au lieu de classe_id
    montant_paye: ""
  });

  const [classes, setClasses] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Charger les classes au montage
  useEffect(() => {
    axios.get("http://localhost:5000/api/classes")
      .then(response => setClasses(response.data))
      .catch(() => setError("Impossible de charger les classes"));
  }, []);

  // Gestion des champs
  const handleChange = (e) => {
    setEtudiant({ ...etudiant, [e.target.name]: e.target.value });
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Convertir les champs numériques
    const formData = {
      ...etudiant,
      keyclasse: etudiant.keyclasse ? etudiant.keyclasse : null, // Utiliser keyclasse
      montant_paye: parseFloat(etudiant.montant_paye) || 0
    };

    if (!formData.keyclasse) {
      setError("Veuillez sélectionner une classe valide.");
      return;
    }

    try {
      const response = await axios.post(API_URL, formData);
      setMessage("Étudiant ajouté avec succès !",response);
      setEtudiant({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        sexe: "",
        keyclasse: "",
        montant_paye: ""
      });

      // Redirection vers la liste des étudiants avec un message de succès
      navigate("/etudiants", { state: { successMessage: "Étudiant ajouté avec succès !" } });
    } catch (err) {
      setError("Erreur lors de l'ajout de l'étudiant.",err);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Ajouter un Étudiant</h2>

      {/* Afficher le message de succès ou l'erreur */}
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="shadow p-4 rounded">
        <div className="mb-3">
          <label className="form-label">Nom</label>
          <input
            type="text"
            className="form-control"
            name="nom"
            value={etudiant.nom}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Prénom</label>
          <input
            type="text"
            className="form-control"
            name="prenom"
            value={etudiant.prenom}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={etudiant.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Téléphone</label>
          <input
            type="text"
            className="form-control"
            name="telephone"
            value={etudiant.telephone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Sexe</label>
          <select
            name="sexe"
            value={etudiant.sexe}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Sélectionnez votre sexe</option>
            <option value="1">Masculin</option>
            <option value="2">Féminin</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Classe</label>
          <select
            name="keyclasse"
            value={etudiant.keyclasse}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Sélectionnez une classe</option>
            {classes.map((classe, index) => (
              <option key={index} value={classe.keyclasse} disabled={classe.nombre_etudiants === 0}>
                {classe.nom} - {classe.montant}FCFA - {classe.nombre_etudiants} Places restantes
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Montant payé</label>
          <input
            type="number"
            name="montant_paye"
            value={etudiant.montant_paye}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Ajouter</button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/etudiants")}
        >
          Annuler
        </button>
      </form>
    </div>
  );
};

export default Etudiants;
