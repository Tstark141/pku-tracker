import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import Papa from 'papaparse';

const LogTable = ({ logs, foods }) => {
    const downloadLog = () => {
      const csvData = logs.map(log => {
        const food = foods.find(f => f.id === log.food_id);
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
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'daily_log.csv';
      a.click();
    };

  return (
    <div>
      <Button variant="outlined" onClick={downloadLog} style={{ marginBottom: '10px' }}>
        Download CSV
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Food</TableCell>
            <TableCell>Serving Size</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Protein (g)</TableCell>
            <TableCell>Phe (mg)</TableCell>
            <TableCell>Calories (kcal)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log, index) => {
            const food = foods.find(f => f.id === log.food_id);
            return (
              <TableRow key={index}>
                <TableCell>{food.food_name}</TableCell>
                <TableCell>{food.serving_size}</TableCell>
                <TableCell>{log.quantity_servings}</TableCell>
                <TableCell>{log.protein_g.toFixed(1)}</TableCell>
                <TableCell>{log.phe_mg.toFixed(0)}</TableCell>
                <TableCell>{log.calories_kcal ? log.calories_kcal.toFixed(0) : '-'}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default LogTable;