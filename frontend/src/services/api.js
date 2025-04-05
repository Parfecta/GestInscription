import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; 

export const fetchDashboardStats = () => axios.get(`${API_BASE_URL}/api/dashboard/stats`);
export const fetchInscriptionsMensuelles = () => axios.get(`${API_BASE_URL}/api/dashboard/inscriptions-mensuelles`);
export const fetchEtudiantsParClasse = () => axios.get(`${API_BASE_URL}/api/dashboard/etudiants-par-classe`);
export const fetchInscriptionsRecentes = () => axios.get(`${API_BASE_URL}/api/dashboard/inscriptions-recentes`);