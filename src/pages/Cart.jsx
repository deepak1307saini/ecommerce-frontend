import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Paper, Divider } from '@mui/material';
import CartList from '../components/Cart/CartList';
import { useCart } from '../contexts/CartContext';
import { createOrder } from '../api/orders';
import useApi from '../hooks/useApi';
import ErrorAlert from '../components/common/ErrorAlert';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const { loading, error, execute } = useApi();

  const handleCheckout = async () => {
    try {
      const items = cartItems.map((i) => ({ productId: i.id, quantity: i.quantity }));
      await execute(() => createOrder({ items }));
      clearCart();
      navigate('/orders/history');
    } catch (err) {}
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', px: 2 }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 800, width: '100%', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Shopping Cart
        </Typography>
        {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>}
        <CartList
          cartItems={cartItems}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          handleCheckout={handleCheckout}
        />
        <ErrorAlert error={error} onClose={() => {}} />
      </Paper>
    </Box>
  );
}

export default Cart;