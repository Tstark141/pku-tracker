import React, { useState } from 'react';
import { Autocomplete, TextField, Box, Button } from '@mui/material';

const FoodSearch = ({ foods, setFoods, setSelectedFood }) => {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customFood, setCustomFood] = useState({ name: '', serving_size: '', protein_g: '', calories_kcal: '' });

  const handleCustomFoodChange = (field, value) => {
    setCustomFood(prev => ({ ...prev, [field]: value }));
  };

  const addCustomFood = () => {
    if (customFood.name && customFood.protein_g) {
      const newFood = {
        id: `custom_${Date.now()}`,
        brand: 'Custom',
        food_name: customFood.name,
        serving_size: customFood.serving_size || 'N/A',
        weight_g: 100, // Default reference weight (adjust as needed)
        protein_g: Number(customFood.protein_g),
        calories_kcal: customFood.calories_kcal ? Number(customFood.calories_kcal) : null,
        phe_mg: null,
      };
      setFoods(prev => [...prev, newFood]);
      setSelectedFood(newFood);
      setShowCustomForm(false);
      setCustomFood({ name: '', serving_size: '', protein_g: '', calories_kcal: '' });
    }
  };

  return (
    <>
      <Autocomplete
        freeSolo
        options={foods}
        getOptionLabel={(option) =>
          typeof option === 'string'
            ? option
            : `${option.brand || 'Unknown'} ${option.food_name || 'Unknown'} (${option.serving_size || 'Unknown'})`
        }
        onChange={(event, newValue) => {
          if (typeof newValue === 'string') {
            setShowCustomForm(true);
          } else {
            setSelectedFood(newValue);
          }
        }}
        renderInput={(params) => <TextField {...params} label="Search Foods" />}
      />
      {showCustomForm && (
        <Box sx={{ marginTop: '20px' }}>
          <TextField
            label="Food Name"
            value={customFood.name}
            onChange={(e) => handleCustomFoodChange('name', e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <TextField
            label="Serving Size"
            value={customFood.serving_size}
            onChange={(e) => handleCustomFoodChange('serving_size', e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <TextField
            label="Protein (g)"
            type="number"
            value={customFood.protein_g}
            onChange={(e) => handleCustomFoodChange('protein_g', e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <TextField
            label="Calories (kcal)"
            type="number"
            value={customFood.calories_kcal}
            onChange={(e) => handleCustomFoodChange('calories_kcal', e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <Button onClick={addCustomFood}>Add Custom Food</Button>
        </Box>
      )}
    </>
  );
};

export default FoodSearch;