// src/routes/index.jsx
import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import ProductList from '../pages/ProductList';
import OrderHistory from '../pages/OrderHistory';
import Favorites from '../pages/Favorites';
import CreateOrder from '../pages/CreateOrder';
import Cart from '../pages/Cart';
import Profile from '../pages/Profile';
import AdminDashboard from '../pages/AdminDashboard';
import TenantAdminDashboard from '../pages/TenantAdminDashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const params = useParams();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  if (user.role === 'TENANT_ADMIN' && params.tenantName !== user.tenantName) {
    return <Navigate to="/" />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductList />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/orders/create" element={<CreateOrder />} />
      <Route path="/orders/history" element={<OrderHistory />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/profile" element={<Profile />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['PLATFORM_ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tenant/:tenantName/dashboard"
        element={
          <ProtectedRoute allowedRoles={['TENANT_ADMIN']}>
            <TenantAdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;