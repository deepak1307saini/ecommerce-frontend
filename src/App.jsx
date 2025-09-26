// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Container } from '@mui/material';
import NavBar from './components/NavBar';
import { AuthContext } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import AppRoutes from './routes/index';

function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const tenantName = localStorage.getItem('tenantName');
    if (token && role) {
      setUser({ role, tenantName: tenantName === '' ? null : tenantName });
    }
    setLoading(false);
  }, []);

  const login = (token, role, tenantName = null) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('tenantName', tenantName || '');
    setUser({ role, tenantName });
    if (role === 'PLATFORM_ADMIN') navigate('/admin');
    else if (role === 'TENANT_ADMIN') navigate(`/tenant/${tenantName}/dashboard`);
    else navigate('/products');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('tenantName');
    setUser(null);
    navigate('/login');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <CartProvider>
        <NavBar user={user} logout={logout} />
        <Container sx={{ mt: 4 }}>
          <AppRoutes />
        </Container>
      </CartProvider>
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;