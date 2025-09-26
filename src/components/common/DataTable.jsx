import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const DataTable = ({ columns, data, renderActions }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {columns.map((col) => (
            <TableCell key={col.key}>{col.label}</TableCell>
          ))}
          {renderActions && <TableCell>Actions</TableCell>}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            {columns.map((col) => (
              <TableCell key={col.key}>
                {col.render ? col.render(row) : row[col.key]}
              </TableCell>
            ))}
            {renderActions && <TableCell>{renderActions(row)}</TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DataTable;