import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  CircularProgress
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
import { format, subWeeks, subMonths, parseISO, isAfter } from 'date-fns';
import Header from './components/Header';
import { useAppContext } from './context/AppContext';

const HistoryPage = () => {
  const { logs, pheGoal, isLoading } = useAppContext();
  const [selectedDaughter, setSelectedDaughter] = useState('Scarlett');
  const [timeFrame, setTimeFrame] = useState('1week');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    document.title = 'PKU Tracker | History';
  }, []);

  useEffect(() => {
    if (isLoading) return;
    
    const daughterLogs = logs[selectedDaughter] || {};

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
        goal: pheGoal
      });
    }
    
    // Sort data by date
    data.sort((a, b) => {
      const dateA = parseISO(a.date);
      const dateB = parseISO(b.date);
      return dateA - dateB;
    });
    
    setChartData(data);
  }, [selectedDaughter, timeFrame, logs, pheGoal, isLoading]);

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
        <Typography variant="h6" gutterBottom align="center">
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