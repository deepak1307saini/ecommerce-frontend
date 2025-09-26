import React, { useState, useEffect } from 'react';
import { Box, Typography, Dialog, DialogTitle, DialogContent, IconButton, CircularProgress } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { format, parseISO } from 'date-fns';
import DataTable from '../components/common/DataTable';
import Pagination from '../components/common/Pagination';
import ErrorAlert from '../components/common/ErrorAlert';
import { fetchOrders, fetchOrderById } from '../api/orders';
import useApi from '../hooks/useApi';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { loading, error, execute } = useApi();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { content, totalPages } = await execute(() => fetchOrders({ page: page - 1, size: 5 }));
        setOrders(content);
        setTotalPages(totalPages);
      } catch (err) {}
    };
    loadOrders();
  }, [page, execute]);

  const handleView = async (orderId) => {
    try {
      const order = await execute(() => fetchOrderById(orderId));
      setSelectedOrder(order);
    } catch (err) {}
  };

  const columns = [
    { key: 'id', label: 'Order ID' },
    { key: 'totalAmount', label: 'Total Amount', render: (row) => `$${row.totalAmount?.toFixed(2) || '0.00'}` },
    { key: 'status', label: 'Status', render: (row) => row.status || 'N/A' },
    {
      key: 'createdAt',
      label: 'Created Date',
      render: (row) => (row.createdAt ? format(parseISO(row.createdAt), 'MMM dd, yyyy, hh:mm a') : 'N/A'),
    },
  ];

  const renderActions = (row) => (
    <IconButton onClick={() => handleView(row.id)} color="primary">
      <VisibilityIcon />
    </IconButton>
  );

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Order History</Typography>
      {loading && <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}
      <DataTable columns={columns} data={orders} renderActions={renderActions} />
      <Pagination count={totalPages} page={page} onChange={(e, v) => setPage(v)} />
      <Dialog open={!!selectedOrder} onClose={() => setSelectedOrder(null)} maxWidth="md" fullWidth>
        <DialogTitle>Order Details - ID: {selectedOrder?.id}</DialogTitle>
        <DialogContent>
          <Typography>Total Amount: ${selectedOrder?.totalAmount?.toFixed(2) || '0.00'}</Typography>
          <Typography>Status: {selectedOrder?.status || 'N/A'}</Typography>
          <Typography>Created Date: {selectedOrder?.createdAt ? format(parseISO(selectedOrder.createdAt), 'MMM dd, yyyy, hh:mm a') : 'N/A'}</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>Ordered Items</Typography>
          <DataTable
            columns={[
              { key: 'productName', label: 'Product Name', render: (item) => item.product?.name || 'Unknown Product' },
              { key: 'price', label: 'Price', render: (item) => `$${(item.product?.price ?? item.price ?? 0).toFixed(2)}` },
              { key: 'quantity', label: 'Quantity', render: (item) => item.quantity || 0 },
              {
                key: 'subtotal',
                label: 'Subtotal',
                render: (item) => `$${((item.product?.price ?? item.price ?? 0) * (item.quantity || 0)).toFixed(2)}`,
              },
            ]}
            data={selectedOrder?.items || []}
          />
        </DialogContent>
      </Dialog>
      <ErrorAlert error={error} onClose={() => {}} />
    </Box>
  );
}

export default OrderHistory;