import React, { useState } from 'react';
import { List, ListItem, ListItemText, Box, Typography, CircularProgress } from '@mui/material';
import Form from '../components/common/Form';
import ErrorAlert from '../components/common/ErrorAlert';
import { createOrder } from '../api/orders';
import { useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';

function CreateOrder() {
  const [items, setItems] = useState([]);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { loading, error, execute } = useApi();

  const handleAddItem = (e) => {
    e.preventDefault();
    if (productId && quantity > 0) {
      setItems([...items, { productId: parseInt(productId), quantity: parseInt(quantity) }]);
      setProductId('');
      setQuantity(1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await execute(() => createOrder({ items }));
      navigate('/orders/history');
    } catch (err) {}
  };

  const fields = [
    {
      name: 'productId',
      label: 'Product ID',
      value: productId,
      onChange: (e) => setProductId(e.target.value),
      type: 'number',
    },
    {
      name: 'quantity',
      label: 'Quantity',
      type: 'number',
      value: quantity,
      onChange: (e) => setQuantity(e.target.value),
    },
  ];

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Create Order</Typography>
      <Box sx={{ mb: 2 }}>
        <Form fields={fields} onSubmit={handleAddItem} submitLabel="Add Item" disabled={loading} />
      </Box>
      <List>
        {items.map((item, i) => (
          <ListItem key={i}>
            <ListItemText primary={`Product ${item.productId}: Qty ${item.quantity}`} />
          </ListItem>
        ))}
      </List>
      <Form fields={[]} onSubmit={handleSubmit} submitLabel="Create Order" disabled={loading || !items.length} />
      {loading && <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}
      <ErrorAlert error={error} onClose={() => {}} />
    </Box>
  );
}

export default CreateOrder;