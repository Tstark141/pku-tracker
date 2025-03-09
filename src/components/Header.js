import React from 'react';
import { Box, Typography } from '@mui/material';
import Navigation from '../Navigation';

const Header = () => {
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative', marginBottom: '20px' }}>
        <Box sx={{ position: 'absolute', left: 0, top: 0 }}>
          <a href="https://gamifydata.com" rel="noopener noreferrer">
            <img src="/Gamify_Logo.png" alt="Gamify Data Logo" style={{ width: '100px', height: 'auto' }} />
          </a>
        </Box>
        <Typography variant="h4" color="primary" sx={{ textAlign: 'center' }}>
          PKU Tracker
        </Typography>
      </Box>
      
      <Navigation />
    </>
  );
};

export default Header; 