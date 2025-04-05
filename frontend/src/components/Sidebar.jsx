import React, { useContext,  useState } from "react";
import AuthContext from "../context/AuthContext";
import { FiBook, FiSliders, FiCalendar, FiLayers, FiFileText, FiUsers, FiLogOut, FiChevronDown,FiSettings } from "react-icons/fi"; 

function Sidebar({ isSidebarOpen }) {
  const { logout } = useContext(AuthContext);
  const [isGestionAcademiqueOpen, setGestionAcademiqueOpen] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    console.log("Déconnexion réussie !");
    window.location.href = "/login";
  };

  return (
    <nav id="sidebar" className={`sidebar js-sidebar ${isSidebarOpen ? "expanded" : "collapsed"}`}>
      <div className="sidebar-content js-simplebar">
        <a className="sidebar-brand" href="/">
          <span className="align-middle">GESTINSCR</span>
        </a>

        <ul className="sidebar-nav">
          <li className="sidebar-item">
            <a className="sidebar-link" href="/dashboard">
              <FiSliders className="align-middle me-2" size={20} />
              <span className="align-middle">Dashboard</span>
            </a>
          </li>

          {/* Gestion Académique (Menu déroulant) */}
          <li className={`sidebar-item ${isGestionAcademiqueOpen ? "active" : ""}`}>
            <a
              className="sidebar-link"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setGestionAcademiqueOpen(!isGestionAcademiqueOpen);
              }}
            >
              <FiSettings className="align-middle me-2" size={20} />
              <span className="align-middle">Gestion Académique</span>
              <FiChevronDown className="align-middle float-end" size={18} />
            </a>
            {isGestionAcademiqueOpen && (
              <ul className="sidebar-dropdown list-unstyled">
                <li className="sidebar-item">
                  <a className="sidebar-link" href="/annees">
                    <FiCalendar className="align-middle me-2" size={18} />
                    <span className="align-middle">Gestion des Années</span>
                  </a>
                </li>
                <li className="sidebar-item">
                  <a className="sidebar-link" href="/niveaux">
                    <FiLayers className="align-middle me-2" size={18} />
                    <span className="align-middle">Gestion des Niveaux</span>
                  </a>
                </li>
                <li className="sidebar-item">
                  <a className="sidebar-link" href="/classes">
                    <FiLayers className="align-middle me-2" size={18} />
                    <span className="align-middle">Gestion des Classes</span>
                  </a>
                </li>
              </ul>
            )}
          </li>

          <li className="sidebar-item">
            <a className="sidebar-link" href="/inscriptions">
              <FiFileText className="align-middle me-2" size={20} />
              <span className="align-middle">Gestion des Inscriptions</span>
            </a>
          </li>

          <li className="sidebar-item">
            <a className="sidebar-link" href="/etudiants">
              <FiUsers className="align-middle me-2" size={20} />
              <span className="align-middle">Gestion des Étudiants</span>
            </a>
          </li>

          <li className="sidebar-item">
            <a className="sidebar-link" href="#" onClick={handleLogout}>
              <FiLogOut className="align-middle me-2 text-danger" size={20} />
              <span className="align-middle text-danger">Déconnexion</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Sidebar;
