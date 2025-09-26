import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const ErrorAlert = ({ error, onClose }) => (
  <Snackbar open={!!error} autoHideDuration={6000} onClose={onClose}>
    <Alert onClose={onClose} severity="error">{error}</Alert>
  </Snackbar>
);

export default ErrorAlert;