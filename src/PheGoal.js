import React from 'react';
import { TextField, Typography } from '@mui/material';

const PheGoal = ({ pheGoal, setPheGoal, totalPhe }) => {
  return (
    <div style={{ marginTop: '20px' }}>
      <TextField
        type="number"
        label="Daily Phe Goal (mg)"
        value={pheGoal}
        onChange={(e) => setPheGoal(Number(e.target.value))}
        style={{ marginRight: '20px' }}
      />
      <Typography>
        Progress: {totalPhe.toFixed(0)} mg / {pheGoal} mg ({((totalPhe / pheGoal) * 100).toFixed(0)}%)
      </Typography>
    </div>
  );
};

export default PheGoal;