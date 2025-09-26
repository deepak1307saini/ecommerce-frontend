import React from 'react';
import { Pagination as MuiPagination, Box } from '@mui/material';

const Pagination = ({ count, page, onChange }) => (
  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
    <MuiPagination count={count} page={page} onChange={onChange} />
  </Box>
);

export default Pagination;