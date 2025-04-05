import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer bg-light py-3">
      <div className="container-fluid">
        <div className="row text-muted justify-content-center">
          <div className="col-md-6 text-start text-center">
            <p className="mb-0">
              &copy; {currentYear} <strong>MonApplication</strong>. Tous droits réservés.
            </p>
          </div>
          {/* <div className="col-md-6 text-end">
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <Link className="text-muted" to="/support">Support</Link>
              </li>
              <li className="list-inline-item">
                <Link className="text-muted" to="/faq">FAQ</Link>
              </li>
              <li className="list-inline-item">
                <Link className="text-muted" to="/confidentialite">Confidentialité</Link>
              </li>
              <li className="list-inline-item">
                <Link className="text-muted" to="/conditions">Conditions</Link>
              </li>
            </ul>
          </div> */}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
