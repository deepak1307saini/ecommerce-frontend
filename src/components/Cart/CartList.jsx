import React from 'react';
import { List, Typography, Button, Box } from '@mui/material';
import CartItem from './CartItem';

const CartList = ({ cartItems, updateQuantity, removeFromCart, handleCheckout }) => {
  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <Box>
      <List>
        {cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
          />
        ))}
      </List>
      <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
      <Button onClick={handleCheckout} variant="contained" sx={{ mt: 2 }} disabled={!cartItems.length}>
        Checkout
      </Button>
    </Box>
  );
};

export default CartList;