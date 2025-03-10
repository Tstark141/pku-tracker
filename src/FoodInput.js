import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, Button, Box } from '@mui/material';

const FoodInput = ({ selectedFood, addLogEntry, initialQuantity = '', initialUnit = 'grams' }) => {
  const [unit, setUnit] = useState(initialUnit);
  const [value, setValue] = useState(initialQuantity);

  // Update unit and value when initialUnit or initialQuantity changes
  useEffect(() => {
    if (initialUnit) {
      setUnit(initialUnit);
    }
    if (initialQuantity) {
      setValue(initialQuantity);
    }
  }, [initialUnit, initialQuantity]);

  const handleAdd = () => {
    if (selectedFood && value) {
      let multiplier;
      if (unit === 'grams') {
        multiplier = Number(value) / selectedFood.weight_g;
      } else if (unit === 'servings') {
        multiplier = Number(value);
      } else if (unit === 'quantity') {
        multiplier = Number(value);
      }
      addLogEntry(selectedFood, multiplier, unit, value);
      setValue('');
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={2} sx={{ marginTop: '20px' }}>
      <Select
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        sx={{ width: '150px' }}
      >
        <MenuItem value="grams">Grams</MenuItem>
        <MenuItem value="servings">Servings</MenuItem>
        <MenuItem value="quantity">Quantity</MenuItem>
      </Select>
      <TextField
        type="number"
        label={`Enter ${unit}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        sx={{ width: '150px' }}
        inputProps={{ min: 0, step: 0.1 }} // Allow decimals, prevent negative
      />
      <Button variant="contained" onClick={handleAdd} disabled={!selectedFood || !value}>
        Add
      </Button>
    </Box>
  );
};

export default FoodInput;