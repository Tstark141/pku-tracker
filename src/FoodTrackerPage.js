import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { format } from 'date-fns';
import {
  Select,
  MenuItem,
  TextField,
  Typography,
  Container,
  Box,
  Stack,
  Button,
  FormControl,
  InputLabel,
} from '@mui/material';
import FoodSearch from './FoodSearch';
import FoodInput from './FoodInput';
import LogTable from './LogTable';
import SummaryMetrics from './SummaryMetrics';
import PheGoal from './PheGoal';
import Navigation from './Navigation';

const FoodTrackerPage = () => {
  const [foods, setFoods] = useState([]);
  const [logs, setLogs] = useState({});
  const [selectedDaughter, setSelectedDaughter] = useState('Scarlett');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [pheGoal, setPheGoal] = useState(100); // Default 100 mg
  const [selectedFood, setSelectedFood] = useState(null); // Track selected food
  const [initialQuantity, setInitialQuantity] = useState('');
  const [initialUnit, setInitialUnit] = useState('grams');
  const location = useLocation();
  const navigate = useNavigate();
  const initialLoadRef = useRef(true);

  useEffect(() => {
    document.title = 'PKU Tracker | Food Tracker';
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

  useEffect(() => {
    const savedLogs = JSON.parse(localStorage.getItem('logs')) || {};
    const savedPheGoal = JSON.parse(localStorage.getItem('pheGoal')) || 100;
    setLogs(savedLogs);
    setPheGoal(savedPheGoal);
  }, []);

  useEffect(() => {
    localStorage.setItem('logs', JSON.stringify(logs));
    localStorage.setItem('pheGoal', JSON.stringify(pheGoal));
  }, [logs, pheGoal]);

  // Handle food and quantity passed from PheLookupPage
  useEffect(() => {
    if (location.state && initialLoadRef.current) {
      if (location.state.selectedFood) {
        setSelectedFood(location.state.selectedFood);
      }
      
      if (location.state.quantity) {
        setInitialQuantity(location.state.quantity.toString());
      }
      
      if (location.state.unit) {
        setInitialUnit(location.state.unit);
      }
      
      initialLoadRef.current = false;
    }
  }, [location.state]);

  const addLogEntry = (food, multiplier, unit, value) => {
    const numericValue = Number(value); // Convert to number
    const phe_mg = food.phe_mg ? food.phe_mg : food.protein_g * 50;
    let weight_g;
    if (unit === 'grams') {
      weight_g = numericValue;
    } else if (unit === 'servings') {
      weight_g = numericValue * food.weight_g;
    } else if (unit === 'quantity') {
      weight_g = numericValue * food.weight_g;
    }
    const logEntry = {
      food_id: food.id,
      quantity_servings: multiplier,
      weight_g: weight_g,
      protein_g: food.protein_g * multiplier,
      phe_mg: phe_mg * multiplier,
      calories_kcal: food.calories_kcal ? food.calories_kcal * multiplier : null,
    };
    setLogs((prevLogs) => {
      const daughterLogs = prevLogs[selectedDaughter] || {};
      const dateLogs = daughterLogs[selectedDate] || [];
      return {
        ...prevLogs,
        [selectedDaughter]: {
          ...daughterLogs,
          [selectedDate]: [...dateLogs, logEntry],
        },
      };
    });
    setSelectedFood(null);
    setInitialQuantity('');
  };

  const handleDeleteLog = (log) => {
    setLogs((prevLogs) => {
      if (!prevLogs[selectedDaughter]?.[selectedDate]) return prevLogs;
      const daughterLogs = { ...prevLogs[selectedDaughter] };
      daughterLogs[selectedDate] = daughterLogs[selectedDate].filter((item) => item !== log);
      return {
        ...prevLogs,
        [selectedDaughter]: daughterLogs,
      };
    });
  };

  const downloadLog = () => {
    const currentLogs = logs[selectedDaughter]?.[selectedDate] || [];
    const csvData = currentLogs.map((log) => {
      const food = foods.find((f) => f.id === log.food_id);
      return {
        food_name: food.food_name,
        serving_size: food.serving_size,
        quantity_servings: log.quantity_servings,
        protein_g: log.protein_g,
        phe_mg: log.phe_mg,
        calories_kcal: log.calories_kcal != null ? log.calories_kcal : '-',
      };
    });

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'daily_log.csv';
    link.click();
  };

  const currentLogs = logs[selectedDaughter]?.[selectedDate] || [];

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
      
      <Box sx={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="person-select-label">Person</InputLabel>
          <Select
            labelId="person-select-label"
            value={selectedDaughter}
            onChange={(e) => setSelectedDaughter(e.target.value)}
            variant="outlined"
          >
            <MenuItem value="Scarlett">Scarlett</MenuItem>
            <MenuItem value="Holland">Holland</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
        />
      </Box>
      <FoodSearch foods={foods} setFoods={setFoods} setSelectedFood={setSelectedFood} />
      {selectedFood && (
        <FoodInput 
          selectedFood={selectedFood} 
          addLogEntry={addLogEntry} 
          initialQuantity={initialQuantity}
          initialUnit={initialUnit}
        />
      )}
      <SummaryMetrics logs={currentLogs} />
      <LogTable logs={currentLogs} foods={foods} onDeleteLog={handleDeleteLog} />
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ marginTop: '40px', paddingRight: '10px' }}>
        <PheGoal
          pheGoal={pheGoal}
          setPheGoal={setPheGoal}
          totalPhe={currentLogs.reduce((sum, entry) => sum + entry.phe_mg, 0)}
        />
        <Box>
          <Button variant="outlined" onClick={downloadLog}>
            Download CSV
          </Button>
        </Box>
      </Stack>
    </Container>
  );
};

export default FoodTrackerPage; 