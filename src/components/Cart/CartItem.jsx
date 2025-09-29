import React from 'react';
import { ListItem, ListItemText, TextField, IconButton, Box, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CartItem = ({ item, updateQuantity, removeFromCart }) => (
  <ListItem sx={{ py: 2 }}>
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
        {item.name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Price: ${item.price.toFixed(2)}
      </Typography>
    </Box>
    <TextField
      type="number"
      value={item.quantity}
      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
      sx={{ width: 60, mx: 2 }}
      inputProps={{ min: 1 }}
      size="small"
    />
    <Typography variant="body1" sx={{ mx: 2, fontWeight: 'bold' }}>
      ${(item.price * item.quantity).toFixed(2)}
    </Typography>
    <IconButton onClick={() => removeFromCart(item.id)} color="error">
      <DeleteIcon />
    </IconButton>
  </ListItem>
);

export default CartItem;