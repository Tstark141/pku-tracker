import React, { createContext, useState, useEffect, useContext } from 'react';
import Papa from 'papaparse';

// Create the context
const AppContext = createContext();

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);

// Provider component
export const AppProvider = ({ children }) => {
  const [foods, setFoods] = useState([]);
  const [logs, setLogs] = useState({});
  const [pheGoal, setPheGoal] = useState(100);
  const [isLoading, setIsLoading] = useState(true);

  // Load foods from CSV
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
        setIsLoading(false);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        setIsLoading(false);
      },
    });
  }, []);

  // Load logs and pheGoal from localStorage on initial load
  useEffect(() => {
    const savedLogs = JSON.parse(localStorage.getItem('logs')) || {};
    const savedPheGoal = JSON.parse(localStorage.getItem('pheGoal')) || 100;
    setLogs(savedLogs);
    setPheGoal(savedPheGoal);
  }, []);

  // Save logs and pheGoal to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('pheGoal', JSON.stringify(pheGoal));
  }, [pheGoal]);

  // Function to add a log entry
  const addLogEntry = (daughter, date, food, multiplier, unit, value) => {
    const numericValue = Number(value);
    const phe_mg = food.phe_mg ? food.phe_mg : food.protein_g * 50;
    let weight_g;
    
    if (unit === 'grams') {
      weight_g = numericValue;
    } else if (unit === 'servings' || unit === 'quantity') {
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
      const daughterLogs = prevLogs[daughter] || {};
      const dateLogs = daughterLogs[date] || [];
      return {
        ...prevLogs,
        [daughter]: {
          ...daughterLogs,
          [date]: [...dateLogs, logEntry],
        },
      };
    });
  };

  // Function to delete a log entry
  const deleteLogEntry = (daughter, date, logToDelete) => {
    setLogs((prevLogs) => {
      if (!prevLogs[daughter]?.[date]) return prevLogs;
      
      const daughterLogs = { ...prevLogs[daughter] };
      daughterLogs[date] = daughterLogs[date].filter((log) => log !== logToDelete);
      
      return {
        ...prevLogs,
        [daughter]: daughterLogs,
      };
    });
  };

  // Provide the context value
  const contextValue = {
    foods,
    logs,
    pheGoal,
    isLoading,
    setPheGoal,
    addLogEntry,
    deleteLogEntry
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext; 