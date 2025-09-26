import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import Form from '../../components/common/Form';
import ErrorAlert from '../../components/common/ErrorAlert';
import useApi from '../../hooks/useApi';
import { login } from '../../api/auth';

function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const { loading, error, execute } = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('tenantName');
      const { token, roles, tenant } = await execute(() => login(credentials));
      const role = roles?.[0] || 'USER';
      const tenantName = tenant?.name || null;
      authLogin(token, role, tenantName);
    } catch (err) {}
  };

  const fields = [
    {
      name: 'username',
      label: 'Username',
      value: credentials.username,
      onChange: (e) => setCredentials({ ...credentials, username: e.target.value }),
      required: true,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      value: credentials.password,
      onChange: (e) => setCredentials({ ...credentials, password: e.target.value }),
      required: true,
    },
  ];

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Login</Typography>
      <Form fields={fields} onSubmit={handleSubmit} submitLabel="Login" disabled={loading} />
      <Button href="/register" fullWidth sx={{ mt: 1 }}>Register instead</Button>
      <ErrorAlert error={error} onClose={() => {}} />
    </Box>
  );
}

export default Login;