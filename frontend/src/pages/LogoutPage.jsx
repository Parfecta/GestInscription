import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Button } from "react-bootstrap"; // Importation des composants React Bootstrap
import AuthContext from "../context/AuthContext";

const Logout = () => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext); // Récupération de la fonction logout du contexte
    const [showModal, setShowModal] = useState(false); // État pour afficher/masquer la modale

    const handleLogout = () => {
        setShowModal(true); // Afficher la modale de confirmation
    };

    const handleConfirmLogout = async () => {
        try {
            // Faire la requête pour la déconnexion côté serveur
            await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });

            // Appeler la fonction logout du contexte pour réinitialiser l'état utilisateur
            logout();  // Réinitialiser l'utilisateur via le contexte

            console.log("Déconnexion réussie !");
            navigate("/login"); // Rediriger proprement vers la page de login
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
            alert("Une erreur est survenue lors de la déconnexion.");
        }
        setShowModal(false); // Cacher la modale après la déconnexion
    };

    const handleCancelLogout = () => {
        setShowModal(false); // Cacher la modale si l'utilisateur annule
    };

    return (
        <>
            <button onClick={handleLogout} className="btn btn-danger">
                Déconnexion
            </button>

            {/* Modale de confirmation avec React Bootstrap */}
            <Modal show={showModal} onHide={handleCancelLogout} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Êtes-vous sûr de vouloir vous déconnecter ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancelLogout}>
                        Annuler
                    </Button>
                    <Button variant="danger" onClick={handleConfirmLogout}>
                        Oui
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Logout;
