import React from 'react';
import { Typography } from '@mui/material';

const SummaryMetrics = ({ logs }) => {
  const totalProtein = logs.reduce((sum, entry) => sum + entry.protein_g, 0);
  const totalPhe = logs.reduce((sum, entry) => sum + entry.phe_mg, 0);
  const totalCalories = logs.reduce((sum, entry) => sum + (entry.calories_kcal || 0), 0);
  const uniqueFoods = new Set(logs.map(entry => entry.food_id)).size;

  return (
    <div style={{ marginBottom: '20px' }}>
      <Typography>Foods: {uniqueFoods}</Typography>
      <Typography>Total Protein: {totalProtein.toFixed(1)} g</Typography>
      <Typography>Total Phe: {totalPhe.toFixed(0)} mg</Typography>
      <Typography>Total Calories: {totalCalories.toFixed(0)} kcal</Typography>
    </div>
  );
};

export default SummaryMetrics;