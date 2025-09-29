import React from 'react';
import { List, Typography, Button, Box, Divider } from '@mui/material';
import CartItem from './CartItem';

const CartList = ({ cartItems, updateQuantity, removeFromCart, handleCheckout }) => {
  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <Box>
      <List disablePadding>
        {cartItems.map((item) => (
          <React.Fragment key={item.id}>
            <CartItem
              item={item}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
            />
            <Divider />
          </React.Fragment>
        ))}
      </List>
      {cartItems.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Total: ${total.toFixed(2)}
          </Typography>
          <Button 
            onClick={handleCheckout} 
            variant="contained" 
            color="primary" 
            disabled={!cartItems.length}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold', px: 4 }}
          >
            Checkout
          </Button>
        </Box>
      )}
      {cartItems.length === 0 && (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          Your cart is empty.
        </Typography>
      )}
    </Box>
  );
};

export default CartList;