import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import DataTable from '../components/common/DataTable';
import Pagination from '../components/common/Pagination';
import ErrorAlert from '../components/common/ErrorAlert';
import { fetchFavorites, removeFavorite } from '../api/favorites';
import useApi from '../hooks/useApi';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { loading, error, execute } = useApi();

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const { content, totalPages } = await execute(() => fetchFavorites({ page: page - 1, size: 5 }));
        setFavorites(content);
        setTotalPages(totalPages);
      } catch (err) {}
    };
    loadFavorites();
  }, [page, execute]);

  const handleRemove = async (productId) => {
    try {
      await execute(() => removeFavorite(productId));
      const { content, totalPages } = await execute(() => fetchFavorites({ page: page - 1, size: 5 }));
      setFavorites(content);
      setTotalPages(totalPages);
    } catch (err) {}
  };

  const columns = [
    { key: 'productId', label: 'Product ID' },
    { key: 'productName', label: 'Product Name' },
  ];

  const renderActions = (row) => (
    <Button onClick={() => handleRemove(row.productId)} variant="outlined" color="error">
      Remove
    </Button>
  );

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Favorites</Typography>
      {loading && <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}
      <DataTable columns={columns} data={favorites} renderActions={renderActions} />
      <Pagination count={totalPages} page={page} onChange={(e, v) => setPage(v)} />
      <ErrorAlert error={error} onClose={() => {}} />
    </Box>
  );
}

export default Favorites;