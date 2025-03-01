import React from 'react';
import { Box, Typography, Stack } from '@mui/material';

const SummaryMetrics = ({ logs }) => {
  // Calculate metrics
  const totalProtein = logs.reduce((sum, entry) => sum + entry.protein_g, 0);
  const totalPhe = logs.reduce((sum, entry) => sum + entry.phe_mg, 0);
  const totalCalories = logs.reduce((sum, entry) => sum + (entry.calories_kcal || 0), 0);
  const uniqueFoods = new Set(logs.map(entry => entry.food_id)).size;

  return (
    <Stack
      direction="row"
      spacing={2} // Horizontal spacing between widgets
      sx={{
        marginTop: '50px', // Increased padding above the boxes
        marginBottom: '50px', // Increased padding below the boxes
        flexWrap: 'wrap', // Allow wrapping on smaller screens
        justifyContent: 'center', // Center if wrapping occurs
      }}
    >
      {/* Foods Widget */}
      <Box
        sx={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '12px 16px',
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          minWidth: '120px', // Minimum width for consistency
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" sx={{ color: '#1976D2', fontWeight: 'bold' }}>
          Foods
        </Typography>
        <Typography variant="h6" sx={{ color: 'black' }}>
          {uniqueFoods}
        </Typography>
      </Box>

      {/* Total Protein Widget */}
      <Box
        sx={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '12px 16px',
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          minWidth: '120px',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" sx={{ color: '#1976D2', fontWeight: 'bold' }}>
          Total Protein
        </Typography>
        <Typography variant="h6" sx={{ color: 'black' }}>
          {totalProtein.toFixed(1)} g
        </Typography>
      </Box>

      {/* Total Phe Widget */}
      <Box
        sx={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '12px 16px',
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          minWidth: '120px',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" sx={{ color: '#1976D2', fontWeight: 'bold' }}>
          Total Phe
        </Typography>
        <Typography variant="h6" sx={{ color: 'black' }}>
          {totalPhe.toFixed(0)} mg
        </Typography>
      </Box>

      {/* Total Calories Widget */}
      <Box
        sx={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '12px 16px',
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          minWidth: '120px',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" sx={{ color: '#1976D2', fontWeight: 'bold' }}>
          Total Calories
        </Typography>
        <Typography variant="h6" sx={{ color: 'black' }}>
          {totalCalories.toFixed(0)} kcal
        </Typography>
      </Box>
    </Stack>
  );
};

export default SummaryMetrics;