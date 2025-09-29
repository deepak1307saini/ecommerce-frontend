import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, Box, Typography, Card, CardContent, CardMedia, CardActions, Grid, CircularProgress, FormControl, InputLabel, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { fetchProducts, addToWishlist } from '../api/products';
import Pagination from '../components/common/Pagination';
import ErrorAlert from '../components/common/ErrorAlert';
import useApi from '../hooks/useApi';

function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();
  const { loading, error, execute } = useApi();

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setCategory(searchParams.get('category') || '');
  }, [searchParams]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { content, totalPages: newTotalPages } = await execute(() =>
          fetchProducts({ page: page - 1, size: 3, search, category })
        );
        setProducts(content);
        setTotalPages(newTotalPages);
      } catch (err) {}
    };
    loadProducts();
  }, [search, category, page, execute]);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [totalPages, page]);

  const handleAddToWishlist = async (productId) => {
    try {
      await execute(() => addToWishlist(productId));
    } catch (err) {}
  };

  const handleFilter = () => {
    setPage(1);
    setSearchParams({ search, category });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Products</Typography>
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          label="Search by Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1 }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="electronics">Electronics</MenuItem>
            <MenuItem value="clothing">Clothing</MenuItem>
          </Select>
        </FormControl>
        <Button onClick={handleFilter} variant="contained">
          Filter
        </Button>
      </Box>
      {loading && <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}
      <Grid container spacing={3}>
        {products.map((p) => {
          const inCart = cartItems.find((item) => item.id === p.id);
          return (
            <Grid item xs={12} sm={6} md={4} key={p.id}>
              <Card 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: '100%', 
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 6,
                  }
                }}
              >
                {p.thumbnail && p.thumbnail.startsWith('http') ? (
                  <CardMedia
                    component="img"
                    height="200"
                    image={p.thumbnail}
                    alt={p.name}
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                ) : (
                  <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.200' }}>
                    <Typography>No thumbnail</Typography>
                  </Box>
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{p.name}</Typography>
                  <Typography variant="body2" color="text.secondary">Price: ${p.price}</Typography>
                  <Typography variant="body2" color="text.secondary">Category: {p.category}</Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  {!inCart ? (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => addToCart(p)}
                      startIcon={<ShoppingCartIcon />}
                    >
                      Add to Cart
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          const newQty = inCart.quantity - 1;
                          if (newQty > 0) {
                            updateQuantity(p.id, newQty);
                          } else {
                            removeFromCart(p.id);
                          }
                        }}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography variant="body1" sx={{ mx: 1 }}>
                        {inCart.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(p.id, inCart.quantity + 1)}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  )}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleAddToWishlist(p.id)}
                    startIcon={<FavoriteIcon />}
                  >
                    Add to Wishlist
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <Pagination count={totalPages} page={page} onChange={(e, v) => setPage(v)} />
      <ErrorAlert error={error} onClose={() => {}} />
    </Box>
  );
}

export default ProductList;