import { useEffect, useContext, useState } from "react";
import { useLocation } from "react-router-dom";  
import feather from "feather-icons";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/Routes";
import AuthContext from "./context/AuthContext";

function App() {
  const { user } = useContext(AuthContext); // Vérifie si l'utilisateur est connecté
  const location = useLocation(); // Pour savoir sur quelle page on est
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // État pour afficher/cacher la sidebar

  useEffect(() => {
    feather.replace();
  }, []);

  // Vérifie si on est sur la page de connexion
  const isLoginPage = location.pathname === "/login";

  return (
    <div className={`wrapper ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      {/* Affiche la Sidebar seulement si l'utilisateur est connecté et qu'on n'est pas sur la page de connexion */}
      {!isLoginPage && user && <Sidebar isSidebarOpen={isSidebarOpen} />}
      <div className="main">
        {/* Affiche le Navbar seulement si l'utilisateur est connecté et qu'on n'est pas sur la page de connexion */}
        {!isLoginPage && user && <Navbar setIsSidebarOpen={setIsSidebarOpen} />}
        
        <main className="content">
          <div className="container-fluid p-0">
            <AppRoutes />
          </div>
        </main>

        {/* Affiche le Footer seulement si l'utilisateur est connecté et qu'on n'est pas sur la page de connexion */}
        {!isLoginPage && user && <Footer />}
      </div>
    </div>
  );
}

export default App;
