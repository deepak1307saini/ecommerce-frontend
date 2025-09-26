import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import Form from '../../components/common/Form';
import ErrorAlert from '../../components/common/ErrorAlert';
import useApi from '../../hooks/useApi';
import { register } from '../../api/auth';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    mobileNumber: '',
    password: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate();
  const { loading, error, execute } = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (profilePicture) data.append('profilePicture', profilePicture);
    try {
      await execute(() => register(data));
      navigate('/login');
    } catch (err) {}
  };

  const fields = [
    {
      name: 'firstName',
      label: 'First Name',
      value: formData.firstName,
      onChange: (e) => setFormData({ ...formData, firstName: e.target.value }),
      required: true,
    },
    {
      name: 'lastName',
      label: 'Last Name',
      value: formData.lastName,
      onChange: (e) => setFormData({ ...formData, lastName: e.target.value }),
      required: true,
    },
    {
      name: 'username',
      label: 'Username',
      value: formData.username,
      onChange: (e) => setFormData({ ...formData, username: e.target.value }),
      required: true,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      value: formData.email,
      onChange: (e) => setFormData({ ...formData, email: e.target.value }),
      required: true,
    },
    {
      name: 'mobileNumber',
      label: 'Mobile Number',
      value: formData.mobileNumber,
      onChange: (e) => setFormData({ ...formData, mobileNumber: e.target.value }),
      required: true,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      value: formData.password,
      onChange: (e) => setFormData({ ...formData, password: e.target.value }),
      required: true,
    },
    {
      name: 'profilePicture',
      label: 'Profile Picture',
      type: 'file',
      onChange: (e) => setProfilePicture(e.target.files[0]),
      slotProps: { htmlInput: { accept: 'image/*' }, inputLabel: { shrink: true } },
    },
  ];

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Register</Typography>
      <Form fields={fields} onSubmit={handleSubmit} submitLabel="Register" disabled={loading} />
      <ErrorAlert error={error} onClose={() => {}} />
    </Box>
  );
}

export default Register;