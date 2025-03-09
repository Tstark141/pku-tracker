import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem 
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';
import { format, subDays, subWeeks, subMonths, parseISO, isAfter } from 'date-fns';
import Navigation from './Navigation';

const HistoryPage = () => {
  const [selectedDaughter, setSelectedDaughter] = useState('Scarlett');
  const [timeFrame, setTimeFrame] = useState('1week');
  const [chartData, setChartData] = useState([]);
  const [pheGoal, setPheGoal] = useState(100);

  useEffect(() => {
    document.title = 'PKU Tracker | History';
  }, []);

  useEffect(() => {
    // Load phe goal from localStorage
    const savedPheGoal = JSON.parse(localStorage.getItem('pheGoal')) || 100;
    setPheGoal(savedPheGoal);

    // Load logs from localStorage
    const savedLogs = JSON.parse(localStorage.getItem('logs')) || {};
    const daughterLogs = savedLogs[selectedDaughter] || {};

    // Calculate start date based on selected time frame
    const today = new Date();
    let startDate;
    
    switch (timeFrame) {
      case '1week':
        startDate = subWeeks(today, 1);
        break;
      case '2weeks':
        startDate = subWeeks(today, 2);
        break;
      case '1month':
        startDate = subMonths(today, 1);
        break;
      case '3months':
        startDate = subMonths(today, 3);
        break;
      default:
        startDate = subWeeks(today, 1);
    }

    // Process data for the chart
    const data = [];
    
    // Create a map of dates to total phe
    const dateMap = {};
    
    // Populate the map with dates in the selected range
    for (const dateStr in daughterLogs) {
      const date = parseISO(dateStr);
      if (isAfter(date, startDate)) {
        const logs = daughterLogs[dateStr] || [];
        const totalPhe = logs.reduce((sum, entry) => sum + entry.phe_mg, 0);
        dateMap[dateStr] = totalPhe;
      }
    }
    
    // Convert the map to an array for the chart
    for (const dateStr in dateMap) {
      data.push({
        date: dateStr,
        displayDate: format(parseISO(dateStr), 'MM/dd'),
        phe: dateMap[dateStr],
        goal: savedPheGoal
      });
    }
    
    // Sort data by date
    data.sort((a, b) => {
      const dateA = parseISO(a.date);
      const dateB = parseISO(b.date);
      return dateA - dateB;
    });
    
    setChartData(data);
  }, [selectedDaughter, timeFrame]);

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
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="timeframe-select-label">Time Frame</InputLabel>
          <Select
            labelId="timeframe-select-label"
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
            variant="outlined"
          >
            <MenuItem value="1week">1 Week</MenuItem>
            <MenuItem value="2weeks">2 Weeks</MenuItem>
            <MenuItem value="1month">1 Month</MenuItem>
            <MenuItem value="3months">3 Months</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <Box sx={{ height: '400px', marginTop: '30px' }}>
        <Typography variant="h6" gutterBottom>
          Daily Phe Intake vs Goal
        </Typography>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="displayDate" />
              <YAxis label={{ value: 'Phe (mg)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <ReferenceLine y={pheGoal} stroke="red" strokeDasharray="3 3" label="Goal" />
              <Line 
                type="monotone" 
                dataKey="phe" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
                name="Phe Intake"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography variant="body1" color="text.secondary">
              No data available for the selected time frame
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default HistoryPage; 