import React, { useState } from 'react';
import { TextField, Button, Autocomplete } from '@mui/material';

const FoodSearch = ({ foods, addLogEntry }) => {
  const [searchTerm, setSearchTerm] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    if (searchTerm && quantity > 0) {
      addLogEntry(searchTerm, quantity);
      setSearchTerm(null);
      setQuantity(1);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <Autocomplete
        options={foods}
        getOptionLabel={(option) => `${option.brand} ${option.food_name} (${option.serving_size})`}
        value={searchTerm}
        onChange={(e, newValue) => setSearchTerm(newValue)}
        renderInput={(params) => <TextField {...params} label="Search Foods" />}
        style={{ width: 300, display: 'inline-block', marginRight: '20px' }}
      />
      <TextField
        type="number"
        label="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        inputProps={{ min: 1 }}
        style={{ width: 100, marginRight: '20px' }}
      />
      <Button variant="contained" onClick={handleAdd}>Add</Button>
    </div>
  );
};

export default FoodSearch;