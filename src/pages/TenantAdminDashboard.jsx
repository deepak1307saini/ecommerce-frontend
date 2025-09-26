import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, Tabs, Tab, CircularProgress } from '@mui/material';
import DataTable from '../components/common/DataTable';
import Pagination from '../components/common/Pagination';
import Form from '../components/common/Form';
import ErrorAlert from '../components/common/ErrorAlert';
import { fetchTenantProducts, saveProduct, deleteProduct } from '../api/products';
import { fetchOrders, updateOrderStatus } from '../api/orders';
import useApi from '../hooks/useApi';

function TenantAdminDashboard() {
  const { user } = useAuth();
  const tenantName = user?.tenantName;
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [productsPage, setProductsPage] = useState(1);
  const [ordersPage, setOrdersPage] = useState(1);
  const [productsTotalPages, setProductsTotalPages] = useState(1);
  const [ordersTotalPages, setOrdersTotalPages] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [openProduct, setOpenProduct] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', price: 0, category: '', availableQuantity: 0, thumbnail: '' });
  const [imageFile, setImageFile] = useState(null);
  const { loading, error, execute } = useApi();

  if (!tenantName) {
    return <Typography>Access denied: No tenant assigned</Typography>;
  }

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { content, totalPages } = await execute(() =>
          fetchTenantProducts({ tenantName, page: productsPage - 1, size: 5 })
        );
        setProducts(content);
        setProductsTotalPages(totalPages);
      } catch (err) {}
    };
    loadProducts();
  }, [productsPage, tenantName, execute]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { content, totalPages } = await execute(() =>
          fetchOrders({ page: ordersPage - 1, size: 5, tenantName })
        );
        setOrders(content);
        setOrdersTotalPages(totalPages);
      } catch (err) {}
    };
    loadOrders();
  }, [ordersPage, tenantName, execute]);

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      await execute(() => saveProduct({ tenantName, product: newProduct, imageFile, productId: editProduct?.id }));
      setOpenProduct(false);
      setNewProduct({ name: '', price: 0, category: '', availableQuantity: 0, thumbnail: '' });
      setImageFile(null);
      setEditProduct(null);
      const { content, totalPages } = await execute(() =>
        fetchTenantProducts({ tenantName, page: productsPage - 1, size: 5 })
      );
      setProducts(content);
      setProductsTotalPages(totalPages);
    } catch (err) {}
  };

  const handleDeleteProduct = async (id) => {
    try {
      await execute(() => deleteProduct({ tenantName, productId: id }));
      const { content, totalPages } = await execute(() =>
        fetchTenantProducts({ tenantName, page: productsPage - 1, size: 5 })
      );
      setProducts(content);
      setProductsTotalPages(totalPages);
    } catch (err) {}
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price,
      category: product.category,
      availableQuantity: product.availableQuantity,
      thumbnail: product.thumbnail || '',
    });
    setOpenProduct(true);
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await execute(() => updateOrderStatus({ tenantName, orderId, status }));
      const { content, totalPages } = await execute(() =>
        fetchOrders({ page: ordersPage - 1, size: 5, tenantName })
      );
      setOrders(content);
      setOrdersTotalPages(totalPages);
    } catch (err) {}
  };

  const productColumns = [
    { key: 'name', label: 'Name' },
    { key: 'price', label: 'Price', render: (row) => `$${row.price}` },
    { key: 'availableQuantity', label: 'Quantity' },
    {
      key: 'thumbnail',
      label: 'Thumbnail',
      render: (row) =>
        row.thumbnail && row.thumbnail.startsWith('http') ? (
          <img
            src={row.thumbnail}
            alt={row.name}
            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
            onError={(e) => (e.target.style.display = 'none')}
          />
        ) : (
          'No thumbnail'
        ),
    },
  ];

  const orderColumns = [
    { key: 'id', label: 'Order ID' },
    { key: 'totalAmount', label: 'Total Amount', render: (row) => `$${row.totalAmount}` },
    { key: 'status', label: 'Status' },
  ];

  const productActions = (row) => (
    <>
      <Button onClick={() => handleEdit(row)} variant="outlined" sx={{ mr: 1 }}>
        Edit
      </Button>
      <Button onClick={() => handleDeleteProduct(row.id)} color="error">
        Delete
      </Button>
    </>
  );

  const orderActions = (row) => (
    <Button onClick={() => handleUpdateStatus(row.id, 'SHIPPED')} variant="outlined">
      Ship
    </Button>
  );

  const productFields = [
    {
      name: 'name',
      label: 'Name',
      value: newProduct.name,
      onChange: (e) => setNewProduct({ ...newProduct, name: e.target.value }),
      required: true,
    },
    {
      name: 'price',
      label: 'Price',
      type: 'number',
      value: newProduct.price,
      onChange: (e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 }),
      required: true,
    },
    {
      name: 'category',
      label: 'Category',
      value: newProduct.category,
      onChange: (e) => setNewProduct({ ...newProduct, category: e.target.value }),
      required: true,
    },
    {
      name: 'availableQuantity',
      label: 'Available Quantity',
      type: 'number',
      value: newProduct.availableQuantity,
      onChange: (e) => setNewProduct({ ...newProduct, availableQuantity: parseInt(e.target.value) || 0 }),
      required: true,
    },
    {
      name: 'thumbnail',
      label: 'Thumbnail URL',
      value: newProduct.thumbnail,
      onChange: (e) => setNewProduct({ ...newProduct, thumbnail: e.target.value }),
    },
    {
      name: 'image',
      label: 'Image File',
      type: 'file',
      onChange: (e) => setImageFile(e.target.files[0]),
      slotProps: { htmlInput: { accept: 'image/*' }, inputLabel: { shrink: true } },
    },
  ];

  return (
    <Box sx={{ mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>Tenant Admin Dashboard</Typography>
      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
        <Tab label="Products" />
        <Tab label="Orders" />
      </Tabs>
      {loading && <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}
      {tabValue === 0 && (
        <Box>
          <Button
            onClick={() => {
              setEditProduct(null);
              setNewProduct({ name: '', price: 0, category: '', availableQuantity: 0, thumbnail: '' });
              setOpenProduct(true);
            }}
            variant="contained"
            sx={{ mb: 2 }}
          >
            Add Product
          </Button>
          <Typography variant="h5" sx={{ mb: 2 }}>Products</Typography>
          <DataTable columns={productColumns} data={products} renderActions={productActions} />
          <Pagination count={productsTotalPages} page={productsPage} onChange={(e, v) => setProductsPage(v)} />
        </Box>
      )}
      {tabValue === 1 && (
        <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>Orders</Typography>
          <DataTable columns={orderColumns} data={orders} renderActions={orderActions} />
          <Pagination count={ordersTotalPages} page={ordersPage} onChange={(e, v) => setOrdersPage(v)} />
        </Box>
      )}
      <Dialog open={openProduct} onClose={() => setOpenProduct(false)}>
        <DialogTitle>{editProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <Form fields={productFields} onSubmit={handleSaveProduct} submitLabel="Save" disabled={loading} />
        </DialogContent>
      </Dialog>
      <ErrorAlert error={error} onClose={() => {}} />
    </Box>
  );
}

export default TenantAdminDashboard;