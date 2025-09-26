import React from 'react';
import { ListItem, ListItemText, TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CartItem = ({ item, updateQuantity, removeFromCart }) => (
  <ListItem>
    <ListItemText
      primary={item.name}
      secondary={`Price: $${item.price} | Total: $${(item.price * item.quantity).toFixed(2)}`}
    />
    <TextField
      type="number"
      value={item.quantity}
      onChange={(e) => updateQuantity(item.id, e.target.value)}
      sx={{ width: 60, mx: 2 }}
      inputProps={{ min: 1 }}
    />
    <IconButton onClick={() => removeFromCart(item.id)}>
      <DeleteIcon />
    </IconButton>
  </ListItem>
);

export default CartItem;