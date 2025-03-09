import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, Tab, Box } from '@mui/material';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleChange = (event, newValue) => {
    navigate(newValue);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
      <Tabs 
        value={currentPath} 
        onChange={handleChange} 
        centered
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="Phe Lookup" value="/" />
        <Tab label="Food Tracker" value="/tracker" />
        <Tab label="History" value="/history" />
      </Tabs>
    </Box>
  );
};

export default Navigation; 