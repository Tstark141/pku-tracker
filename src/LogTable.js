import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Papa from 'papaparse';

const LogTable = ({ logs, foods, onDeleteLog }) => {
  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Food</TableCell>
            <TableCell>Serving Size</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Protein (g)</TableCell>
            <TableCell>Phe (mg)</TableCell>
            <TableCell>Calories (kcal)</TableCell>
            <TableCell>Action</TableCell> {/* New column for delete button */}
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
                <TableCell>
                  <IconButton onClick={() => onDeleteLog(log)} aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default LogTable;