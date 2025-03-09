import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import {
  Autocomplete,
  TextField,
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
} from '@mui/material';
import Navigation from './Navigation';

const PheLookupPage = () => {
  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('servings');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'PKU Tracker | Phe Lookup';
  }, []);

  useEffect(() => {
    Papa.parse('/foods.csv', {
      download: true,
      header: true,
      complete: (results) => {
        setFoods(
          results.data.map((item) => ({
            ...item,
            id: Number(item.id),
            weight_g: Number(item.weight_g),
            phe_mg: item.phe_mg ? Number(item.phe_mg) : null,
            protein_g: Number(item.protein_g),
            calories_kcal: item.calories_kcal ? Number(item.calories_kcal) : null,
          }))
        );
      },
      error: (error) => console.error('Error parsing CSV:', error),
    });
  }, []);

  const calculateResults = () => {
    if (!selectedFood) return null;

    const phe_mg = selectedFood.phe_mg ? selectedFood.phe_mg : selectedFood.protein_g * 50;
    let weight_g, multiplier;

    if (unit === 'grams') {
      weight_g = quantity;
      multiplier = quantity / selectedFood.weight_g;
    } else if (unit === 'servings' || unit === 'quantity') {
      weight_g = quantity * selectedFood.weight_g;
      multiplier = quantity;
    }

    return {
      weight_g: weight_g,
      protein_g: selectedFood.protein_g * multiplier,
      phe_mg: phe_mg * multiplier,
      calories_kcal: selectedFood.calories_kcal ? selectedFood.calories_kcal * multiplier : null,
    };
  };

  const results = calculateResults();

  const goToTracker = () => {
    navigate('/tracker', { 
      state: { 
        selectedFood,
        quantity,
        unit
      } 
    });
  };

  return (
    <Container maxWidth="md" sx={{ paddingTop: '20px' }}>
      <Box sx={{ position: 'absolute', top: '20px', left: '20px' }}>
        <a href="https://gamifydata.com" rel="noopener noreferrer">
          <img src="/Gamify_Logo.png" alt="Gamify Data Logo" style={{ width: '100px', height: 'auto' }} />
        </a>
      </Box>
      <Box sx={{ textAlign: 'center', marginBottom: '20px', paddingLeft: '120px' }}>
        <Typography variant="h4" color="primary">
          PKU Tracker
        </Typography>
      </Box>
      
      <Navigation />

      <Box sx={{ marginBottom: '30px' }}>
        <Typography variant="h6" gutterBottom>
          Look up Phe content in foods
        </Typography>
        <Autocomplete
          freeSolo
          options={foods}
          getOptionLabel={(option) =>
            typeof option === 'string'
              ? option
              : `${option.brand || 'Unknown'} ${option.food_name || 'Unknown'} (${option.serving_size || 'Unknown'})`
          }
          onChange={(event, newValue) => {
            setSelectedFood(newValue);
          }}
          renderInput={(params) => <TextField {...params} label="Search Foods" />}
        />
      </Box>

      {selectedFood && (
        <>
          <Card sx={{ marginBottom: '30px' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {selectedFood.brand} {selectedFood.food_name}
              </Typography>
              <Typography variant="body1">
                Serving Size: {selectedFood.serving_size}
              </Typography>
              <Typography variant="body1">
                Weight: {selectedFood.weight_g}g per serving
              </Typography>
              <Typography variant="body1">
                Protein: {selectedFood.protein_g}g per serving
              </Typography>
              <Typography variant="body1">
                Phe: {selectedFood.phe_mg ? selectedFood.phe_mg : selectedFood.protein_g * 50}mg per serving
              </Typography>
              {selectedFood.calories_kcal && (
                <Typography variant="body1">
                  Calories: {selectedFood.calories_kcal} kcal per serving
                </Typography>
              )}
            </CardContent>
          </Card>

          <Box sx={{ marginBottom: '30px' }}>
            <Typography variant="h6" gutterBottom>
              Calculate custom amount
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                type="number"
                label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                inputProps={{ min: 0, step: 0.1 }}
                sx={{ width: '150px' }}
              />
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel id="unit-select-label">Unit</InputLabel>
                <Select
                  labelId="unit-select-label"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  label="Unit"
                >
                  <MenuItem value="servings">Servings</MenuItem>
                  <MenuItem value="grams">Grams</MenuItem>
                  <MenuItem value="quantity">Quantity</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>

          {results && (
            <Card sx={{ marginBottom: '30px', bgcolor: '#f5f5f5' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Results for {quantity} {unit} of {selectedFood.food_name}
                </Typography>
                <Typography variant="body1">
                  Weight: {results.weight_g.toFixed(1)}g
                </Typography>
                <Typography variant="body1">
                  Protein: {results.protein_g.toFixed(1)}g
                </Typography>
                <Typography variant="body1">
                  Phe: {results.phe_mg.toFixed(1)}mg
                </Typography>
                {results.calories_kcal && (
                  <Typography variant="body1">
                    Calories: {results.calories_kcal.toFixed(1)} kcal
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={goToTracker}
              sx={{ minWidth: '200px' }}
            >
              Log This Food
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default PheLookupPage; 