import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PheLookupPage from './PheLookupPage';
import FoodTrackerPage from './FoodTrackerPage';
import HistoryPage from './HistoryPage';
import { AppProvider } from './context/AppContext';

const App = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PheLookupPage />} />
          <Route path="/tracker" element={<FoodTrackerPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;