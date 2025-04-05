// import React from 'react';
// import { Card, CardContent, Typography } from '@mui/material';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import { Pie } from 'react-chartjs-2';

// ChartJS.register(ArcElement, Tooltip, Legend);

// const EtudiantsParClasseChart = ({ data, loading }) => {
//   if (loading) return <Typography>Chargement...</Typography>;

//   const chartData = {
//     labels: data.map(item => item.classe),
//     datasets: [
//       {
//         data: data.map(item => item.total),
//         backgroundColor: [
//           'rgba(255, 99, 132, 0.6)',
//           'rgba(54, 162, 235, 0.6)',
//           'rgba(255, 206, 86, 0.6)',
//           'rgba(75, 192, 192, 0.6)',
//           'rgba(153, 102, 255, 0.6)',
//           'rgba(255, 159, 64, 0.6)',
//         ],
//         borderColor: [
//           'rgba(255, 99, 132, 1)',
//           'rgba(54, 162, 235, 1)',
//           'rgba(255, 206, 86, 1)',
//           'rgba(75, 192, 192, 1)',
//           'rgba(153, 102, 255, 1)',
//           'rgba(255, 159, 64, 1)',
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'right',
//       },
//       title: {
//         display: true,
//         text: 'Répartition des étudiants par classe',
//       },
//     },
//   };

//   return (
//     <Card sx={{ mt: 3 }}>
//       <CardContent>
//         <Pie data={chartData} options={options} />
//       </CardContent>
//     </Card>
//   );
// };

// export default EtudiantsParClasseChart;