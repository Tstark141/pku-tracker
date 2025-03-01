import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { format } from 'date-fns';
import { Select, MenuItem, TextField, Typography, Container, Box } from '@mui/material';
import FoodSearch from './FoodSearch';
import LogTable from './LogTable';
import SummaryMetrics from './SummaryMetrics';
import PheGoal from './PheGoal';


const App = () => {
  const [foods, setFoods] = useState([]);
  const [logs, setLogs] = useState({});
  const [selectedDaughter, setSelectedDaughter] = useState('Scarlett');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [pheGoal, setPheGoal] = useState(100); // Default 100 mg

  useEffect(() => {
    document.title = 'PKU Tracker | Gamify Data';
  }, []); // Empty dependency array ensures it runs only once on mount

  // Load foods from CSV on mount
  useEffect(() => {
    Papa.parse('/foods.csv', {
      download: true,
      header: true,
      complete: (results) => {
        setFoods(results.data.map(item => ({
          ...item,
          id: Number(item.id),
          weight_g: Number(item.weight_g),
          phe_mg: item.phe_mg ? Number(item.phe_mg) : null,
          protein_g: Number(item.protein_g),
          calories_kcal: item.calories_kcal ? Number(item.calories_kcal) : null,
        })));
      },
      error: (error) => console.error('Error parsing CSV:', error),
    });
  }, []);

  // Load logs and pheGoal from local storage
  useEffect(() => {
    const savedLogs = JSON.parse(localStorage.getItem('logs')) || {};
    const savedPheGoal = JSON.parse(localStorage.getItem('pheGoal')) || 100;
    setLogs(savedLogs);
    setPheGoal(savedPheGoal);
  }, []);

  // Save logs and pheGoal to local storage
  useEffect(() => {
    localStorage.setItem('logs', JSON.stringify(logs));
    localStorage.setItem('pheGoal', JSON.stringify(pheGoal));
  }, [logs, pheGoal]);

  // Add a log entry
  const addLogEntry = (food, quantity) => {
    const phe_mg = food.phe_mg ? food.phe_mg : food.protein_g * 50; // Default Phe = protein * 50 mg/g
    const logEntry = {
      food_id: food.id,
      quantity_servings: quantity,
      protein_g: food.protein_g * quantity,
      phe_mg: phe_mg * quantity,
      calories_kcal: food.calories_kcal ? food.calories_kcal * quantity : null,
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
  };

  const currentLogs = logs[selectedDaughter]?.[selectedDate] || [];

  return (
    <Container maxWidth="md" sx={{ paddingTop: '20px' }}>
      {/* Logo in top left corner with link to gamifydata.com */}
      <Box sx={{ position: 'absolute', top: '20px', left: '20px' }}>
        <a href="https://gamifydata.com" target="_blank" rel="noopener noreferrer">
          <img src="/Gamify_Logo.png" alt="Gamify Data Logo" style={{ width: '100px', height: 'auto' }} />
        </a>
      </Box>
      {/* Centered title, with padding to avoid overlapping with logo */}
      <Box sx={{ textAlign: 'center', marginBottom: '20px', paddingLeft: '120px' }}>
        <Typography variant="h4">PKU Tracker</Typography>
      </Box>
      <div style={{ marginBottom: '20px' }}>
        <Select
          value={selectedDaughter}
          onChange={(e) => setSelectedDaughter(e.target.value)}
          style={{ marginRight: '20px' }}
        >
          <MenuItem value="Scarlett">Scarlett</MenuItem>
          <MenuItem value="Holland">Holland</MenuItem>
        </Select>
        <TextField
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
      <FoodSearch foods={foods} setFoods={setFoods} addLogEntry={addLogEntry} />
      <SummaryMetrics logs={currentLogs} />
      <LogTable logs={currentLogs} foods={foods} />
      <PheGoal
        pheGoal={pheGoal}
        setPheGoal={setPheGoal}
        totalPhe={currentLogs.reduce((sum, entry) => sum + entry.phe_mg, 0)}
      />
    </Container>
  );
};

export default App;