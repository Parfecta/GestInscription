// import React from 'react';
// import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
// import { AttachMoney, People, School, Receipt } from '@mui/icons-material';

// const DashboardCards = ({ stats, loading }) => {
//   if (loading) return <Typography>Chargement...</Typography>;

//   const cards = [
//     {
//       title: "Étudiants",
//       value: stats?.total_etudiants || 0,
//       icon: <People fontSize="large" />,
//       color: "#3f51b5"
//     },
//     {
//       title: "Inscriptions",
//       value: stats?.total_inscriptions || 0,
//       icon: <School fontSize="large" />,
//       color: "#4caf50"
//     },
//     {
//       title: "Total Payé",
//       value: `${(stats?.total_paye || 0).toLocaleString()} FCFA`,
//       icon: <AttachMoney fontSize="large" />,
//       color: "#ff9800"
//     },
//     {
//       title: "Reste à Payer",
//       value: `${(stats?.total_restant || 0).toLocaleString()} FCFA`,
//       icon: <Receipt fontSize="large" />,
//       color: "#f44336"
//     }
//   ];

//   return (
//     <Grid container spacing={3}>
//       {cards.map((card, index) => (
//         <Grid item xs={12} sm={6} md={3} key={index}>
//           <Card sx={{ minHeight: 150 }}>
//             <CardContent>
//               <Box display="flex" justifyContent="space-between" alignItems="center">
//                 <Box>
//                   <Typography variant="h6" color="textSecondary">
//                     {card.title}
//                   </Typography>
//                   <Typography variant="h4" component="div">
//                     {card.value}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ color: card.color }}>
//                   {card.icon}
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       ))}
//     </Grid>
//   );
// };

// export default DashboardCards;