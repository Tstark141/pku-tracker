import React from 'react';
import { TextField, Typography, LinearProgress, Box, useTheme } from '@mui/material';

const PheGoal = ({ pheGoal, setPheGoal, totalPhe }) => {
  const theme = useTheme();
  const progress = Math.min((totalPhe / pheGoal) * 100, 100); // Cap at 100% for the bar, but allow > 100% for text
  const isOverGoal = totalPhe > pheGoal; // Check if total Phe exceeds the goal

  // Determine colors and styling based on whether the goal is exceeded
  const progressBarColor = isOverGoal ? '#F44336' : theme.palette.primary.main; // Red if over goal, blue if under
  const percentageColor = isOverGoal ? '#F44336' : 'inherit'; // Red for over goal, default (black) otherwise

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <TextField
          type="number"
          label="Daily Phe Goal (mg)"
          value={pheGoal}
          onChange={(e) => setPheGoal(Number(e.target.value))}
          sx={{ marginRight: '20px' }}
        />
        <Typography>
          Progress: {totalPhe.toFixed(0)} mg / {pheGoal} mg (
          <span style={{ color: percentageColor, fontWeight: isOverGoal ? 'bold' : 'normal' }}>
            {Math.min(progress, 100).toFixed(0)}%
          </span>
          )
        </Typography>
      </Box>
      {/* Progress bar with conditional color */}
      <LinearProgress
        variant="determinate"
        value={Math.min(progress, 100)} // Cap the bar at 100%, even if over goal
        sx={{
          height: '10px',
          borderRadius: '5px',
          backgroundColor: '#f5f5f5',
          '& .MuiLinearProgress-bar': {
            backgroundColor: progressBarColor, // Use conditional color (blue or red)
          },
        }}
      />
    </Box>
  );
};

export default PheGoal;