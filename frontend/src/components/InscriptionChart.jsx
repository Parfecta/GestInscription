import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col } from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";
import { PieChart, Pie, Cell } from "recharts";

// Liste des mois pour assurer un affichage correct
const MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

const DashboardCharts = () => {
  const [inscriptionData, setInscriptionData] = useState([]);
  const [classeData, setClasseData] = useState([]);

  useEffect(() => {
    // Récupération des inscriptions mensuelles
    axios.get("http://127.0.0.1:5000/api/dashboard/inscriptions-mensuelles")
      .then((response) => {
        console.log("Données Inscriptions:", response.data);
        if (response.data && Array.isArray(response.data.inscriptions)) {
          const formattedData = MONTHS.map((month, index) => {
            const moisData = response.data.inscriptions.find((item) => item.mois === index + 1);
            return {
              month,
              count: moisData ? moisData.total : 0
            };
          });
          setInscriptionData(formattedData);
        }
      })
      .catch((error) => console.error("Erreur chargement inscriptions:", error));

    // Récupération des étudiants par classe
    axios.get("http://127.0.0.1:5000/api/dashboard/etudiants-par-classe")
      .then((response) => {
        console.log("Données Étudiants par Classe:", response.data);
        setClasseData(response.data);
      })
      .catch((error) => console.error("Erreur chargement étudiants par classe:", error));
  }, []);

  return (
    <Row className="mt-4">
      {/* Graphique des inscriptions */}
      <Col md={6}>
        <Card className="shadow-sm border-0">
          <Card.Body>
            <Card.Title className="text-center font-weight-bold">📈 Évolution des Inscriptions</Card.Title>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={inscriptionData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, (dataMax) => (dataMax < 5 ? 5 : dataMax + 2)]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#007bff"
                  strokeWidth={3}
                  dot={{ stroke: "#007bff", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card>
      </Col>

      {/* Graphique des étudiants par classe */}
<Col md={6}>
  <Card className="shadow-sm border-0">
    <Card.Body>
      <Card.Title className="text-center font-weight-bold">🎓 Répartition des Étudiants par Classe</Card.Title>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={classeData}
            dataKey="total"
            nameKey="classe"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {classeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend layout="vertical" align="right" verticalAlign="middle" />
        </PieChart>
      </ResponsiveContainer>
    </Card.Body>
  </Card>
</Col>

    </Row>
  );
};

export default DashboardCharts;
