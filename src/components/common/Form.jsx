import React from 'react';
import { Box, Button, TextField } from '@mui/material';

const Form = ({ fields, onSubmit, submitLabel = 'Submit', disabled }) => {
  return (
    <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
      {fields.map((field) => (
        <TextField
          key={field.name}
          fullWidth
          label={field.label}
          type={field.type || 'text'}
          value={field.value}
          onChange={field.onChange}
          margin="normal"
          required={field.required}
          slotProps={field.slotProps}
        />
      ))}
      <Button type="submit" fullWidth variant="contained" disabled={disabled}>
        {submitLabel}
      </Button>
    </Box>
  );
};

export default Form;