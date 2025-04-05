import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col } from "react-bootstrap";
import { FaUsers, FaMoneyBill, FaChartBar } from "react-icons/fa";
import InscriptionChart from "../components/InscriptionChart";


const Dashboard = () => {
  const [stats, setStats] = useState({
    total_etudiants: 0,
    total_inscriptions: 0,
    total_paye: 0,
    total_restant: 0,
  });

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/dashboard/stats")
      .then((response) => {
        setStats(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des stats:", error);
      });
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Tableau de Bord</h2>
      <Row className="g-4">
  <Col md={4}>
    <Card className="shadow-sm border-0 bg-primary text-white">
      <Card.Body className="d-flex align-items-center">
        <FaUsers size={30} className="me-3 text-white" />
        <div>
          <Card.Title>Total Étudiants</Card.Title>
          <Card.Text className="fs-4 fw-bold">{stats.total_etudiants}</Card.Text>
        </div>
      </Card.Body>
    </Card>
  </Col>
  <Col md={4}>
    <Card className="shadow-sm border-0 bg-success text-white">
      <Card.Body className="d-flex align-items-center">
        <FaMoneyBill size={30} className="me-3 text-white" />
        <div>
          <Card.Title>Total Inscriptions</Card.Title>
          <Card.Text className="fs-4 fw-bold">{stats.total_inscriptions}</Card.Text>
        </div>
      </Card.Body>
    </Card>
  </Col>
  <Col md={4}>
    <Card className="shadow-sm border-0 bg-warning text-dark">
      <Card.Body className="d-flex align-items-center">
        <FaChartBar size={30} className="me-3 text-dark" />
        <div>
          <Card.Title>Montant Payé</Card.Title>
          <Card.Text className="fs-4 fw-bold">{stats.total_paye} FCFA</Card.Text>
        </div>
      </Card.Body>
    </Card>
  </Col>
</Row>

       {/* Ajout du graphique */}
       <Row className="mt-4">
        <Col md={12}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="mb-3">Évolution des inscriptions</h5>
              <InscriptionChart /> {/* Ajout du composant graphique */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
