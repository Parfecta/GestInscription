import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import LoginPage from "../pages/LoginPage";
import LogoutPage from "../pages/LogoutPage";
import ProtectedRoute from "../components/ProtectedRoute";
import AnneeScolaire from "../pages/Annees/AnneeScolaire";
import AjouterAnnee from "../pages/Annees/AjouterAnnee";
import AjouterNiveau from "../pages/Niveaux/AjouterNiveau";
import Niveau from "../pages/Niveaux/Niveau";
import ModifierNiveau from "../pages/Niveaux/ModifierNiveau";
import Classe from "../pages/Classes/Classe";
import ModifierClasse from "../pages/Classes/ModifierClasse";
import AjouterClasse from "../pages/Classes/AjouterClasse";
import Inscriptions from "../pages/Inscriptions/Inscriptions";
import Etudiants from "../pages/Etudiants/Etudiants";
import AjouterEtudiant from "../pages/Etudiants/AjouterEtudiant";
import ModifierEtudiant from "../pages/Etudiants/ModifierEtudiant";
import VoirEtudiant from "../pages/Etudiants/VoirEtudiant";
import VoirInscription from "../pages/Inscriptions/VoirInscription";
import CompleterPaiement from "../pages/Inscriptions/CompleterPaiement";
import ReinscriptionForm from "../pages/Inscriptions/ReinscriptionForm";

function AppRoutes() {
  return (
    <Routes>
      {/* Rediriger vers /login par défaut */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Route de connexion */}
      <Route path="/login" element={<LoginPage />} />

      {/* Route de déconnexion */}
      <Route path="/logout" element={<LogoutPage />} />

      {/* Routes protégées */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

      {/* Routes protégées pour Année Scolaire */}
      <Route path="/annees" element={<ProtectedRoute><AnneeScolaire /></ProtectedRoute>} />
      <Route path="/ajout-annee" element={<ProtectedRoute><AjouterAnnee /></ProtectedRoute>} />

      {/* Routes protégées pour Niveaux */}
      <Route path="/niveaux" element={<ProtectedRoute><Niveau /></ProtectedRoute>} />
      <Route path="/modifier-niveau/:keyniveau" element={<ProtectedRoute><ModifierNiveau /></ProtectedRoute>} />
      <Route path="/ajouter-niveau" element={<ProtectedRoute><AjouterNiveau /></ProtectedRoute>} />

      {/* Routes protégées pour Classes */}
      <Route path="/classes" element={<ProtectedRoute><Classe /></ProtectedRoute>} />
      <Route path="/modifier-classe/:keyclasse" element={<ProtectedRoute><ModifierClasse /></ProtectedRoute>} />
      <Route path="/ajouter-classe" element={<ProtectedRoute><AjouterClasse /></ProtectedRoute>} />

      {/* Routes protégées pour Inscriptions */}
      <Route path="/inscriptions" element={<ProtectedRoute><Inscriptions /></ProtectedRoute>} />
      <Route path="/voir-inscription/:keyinscription" element={<ProtectedRoute><VoirInscription /></ProtectedRoute>} />
      <Route path="/completer-paiement/:keyinscription" element={<ProtectedRoute><CompleterPaiement /></ProtectedRoute>} />
      <Route path="/reinscrire/:keyetudiant" element={<ProtectedRoute><ReinscriptionForm /></ProtectedRoute>} />

      {/* Routes protégées pour Étudiants */}
      <Route path="/etudiants" element={<ProtectedRoute><Etudiants /></ProtectedRoute>} />
      <Route path="/ajouter-etudiant" element={<ProtectedRoute><AjouterEtudiant /></ProtectedRoute>} />
      <Route path="/modifier-etudiant/:keyetudiant" element={<ProtectedRoute><ModifierEtudiant /></ProtectedRoute>} />
      <Route path="/voir-etudiant/:keyetudiant" element={<ProtectedRoute><VoirEtudiant /></ProtectedRoute>} />
    </Routes>
  );
}

export default AppRoutes;
