import React, { useEffect, useContext } from "react";
import feather from "feather-icons";
import "bootstrap/dist/js/bootstrap.bundle.min"; // Charge Bootstrap JS
import AuthContext from "../context/AuthContext";

function Navbar({ setIsSidebarOpen }) {
  const { user } = useContext(AuthContext); // Récupérer l'utilisateur depuis le contexte

  useEffect(() => {
    feather.replace(); // Remplace les icônes après le montage
  }, []);

  // Fonction pour basculer la Sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <nav className="navbar navbar-expand navbar-light navbar-bg">
      {/* Bouton Sidebar */}
      <a
  className="sidebar-toggle js-sidebar-toggle"
  onClick={toggleSidebar}
  style={{ position: "absolute", top: 5, left: 15, zIndex: 1050, cursor: "pointer" }}
>
  <i className="hamburger align-self-center"></i>
</a>

      {/* Navbar droite */}
      <div className="navbar-collapse collapse">
        <ul className="navbar-nav navbar-align">
          
          {/* Profil utilisateur */}
          <li className="nav-item dropdown">
            {/* Icône pour mobile */}
            <a className="nav-icon dropdown-toggle d-inline-block d-sm-none" href="#" data-bs-toggle="dropdown">
              <i className="align-middle" data-feather="settings"></i>
            </a>

            {/* Avatar et Nom utilisateur */}
            <img
              src="/adminkit/img/avatars/avatar.jpeg" 
              alt="User Avatar"
              className="avatar img-fluid rounded-circle"
            />
            <span className="navbar-user ms-2">
              Bienvenue, {user ? user.username : "Invité"}
            </span>

          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
