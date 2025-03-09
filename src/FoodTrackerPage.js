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
  CircularProgress,
} from '@mui/material';
import FoodSearch from './FoodSearch';
import FoodInput from './FoodInput';
import LogTable from './LogTable';
import SummaryMetrics from './SummaryMetrics';
import PheGoal from './PheGoal';
import Header from './components/Header';
import { useAppContext } from './context/AppContext';

const FoodTrackerPage = () => {
  const { 
    foods, 
    logs, 
    pheGoal, 
    isLoading, 
    setPheGoal, 
    addLogEntry: contextAddLogEntry, 
    deleteLogEntry: contextDeleteLogEntry 
  } = useAppContext();
  
  const [selectedDaughter, setSelectedDaughter] = useState('Scarlett');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedFood, setSelectedFood] = useState(null);
  const [initialQuantity, setInitialQuantity] = useState('');
  const [initialUnit, setInitialUnit] = useState('grams');
  
  const location = useLocation();
  const navigate = useNavigate();
  const initialLoadRef = useRef(true);

  useEffect(() => {
    document.title = 'PKU Tracker | Food Tracker';
  }, []);

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

  const handleAddLogEntry = (food, multiplier, unit, value) => {
    contextAddLogEntry(selectedDaughter, selectedDate, food, multiplier, unit, value);
    setSelectedFood(null);
    setInitialQuantity('');
  };

  const handleDeleteLog = (log) => {
    contextDeleteLogEntry(selectedDaughter, selectedDate, log);
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

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ paddingTop: '20px' }}>
      <Header />
      
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
      <FoodSearch foods={foods} setSelectedFood={setSelectedFood} />
      {selectedFood && (
        <FoodInput 
          selectedFood={selectedFood} 
          addLogEntry={handleAddLogEntry} 
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