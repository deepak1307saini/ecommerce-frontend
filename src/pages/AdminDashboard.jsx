import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, CircularProgress } from '@mui/material';
import DataTable from '../components/common/DataTable';
import Pagination from '../components/common/Pagination';
import Form from '../components/common/Form';
import ErrorAlert from '../components/common/ErrorAlert';
import { fetchTenants, createTenant, deleteTenant, fetchUsers, createTenantAdmin } from '../api/tenants';
import useApi from '../hooks/useApi';

function AdminDashboard() {
  const [tenants, setTenants] = useState([]);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openTenant, setOpenTenant] = useState(false);
  const [newTenantName, setNewTenantName] = useState('');
  const [openTenantAdmin, setOpenTenantAdmin] = useState(false);
  const [tenantAdminData, setTenantAdminData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    tenantId: '',
    mobileNumber: '',
    profilePicturePath: '',
  });
  const { loading, error, execute } = useApi();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tenantsData, usersData] = await Promise.all([
          execute(() => fetchTenants({ page: page - 1, size: 5 })),
          execute(() => fetchUsers({ page: page - 1, size: 5 })),
        ]);
        setTenants(tenantsData.content);
        setUsers(usersData.content);
        setTotalPages(tenantsData.totalPages); // Assuming same pagination for both
      } catch (err) {}
    };
    loadData();
  }, [page, execute]);

  const handleCreateTenant = async (e) => {
    e.preventDefault();
    try {
      await execute(() => createTenant(newTenantName));
      setOpenTenant(false);
      setNewTenantName('');
      const { content, totalPages } = await execute(() => fetchTenants({ page: page - 1, size: 5 }));
      setTenants(content);
      setTotalPages(totalPages);
    } catch (err) {}
  };

  const handleDeleteTenant = async (name) => {
    try {
      await execute(() => deleteTenant(name));
      const { content, totalPages } = await execute(() => fetchTenants({ page: page - 1, size: 5 }));
      setTenants(content);
      setTotalPages(totalPages);
    } catch (err) {}
  };

  const handleCreateTenantAdmin = async (e) => {
    e.preventDefault();
    try {
      await execute(() => createTenantAdmin(tenantAdminData));
      setOpenTenantAdmin(false);
      setTenantAdminData({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        tenantId: '',
        mobileNumber: '',
        profilePicturePath: '',
      });
      const { content } = await execute(() => fetchUsers({ page: page - 1, size: 5 }));
      setUsers(content);
    } catch (err) {}
  };

  const tenantColumns = [
    { key: 'name', label: 'Tenant Name' },
  ];

  const userColumns = [
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
  ];

  const tenantActions = (row) => (
    <Button onClick={() => handleDeleteTenant(row.name)} color="error">
      Delete
    </Button>
  );

  const tenantFields = [
    {
      name: 'name',
      label: 'Tenant Name',
      value: newTenantName,
      onChange: (e) => setNewTenantName(e.target.value),
      required: true,
    },
  ];

  const tenantAdminFields = [
    {
      name: 'firstName',
      label: 'First Name',
      value: tenantAdminData.firstName,
      onChange: (e) => setTenantAdminData({ ...tenantAdminData, firstName: e.target.value }),
      required: true,
    },
    {
      name: 'lastName',
      label: 'Last Name',
      value: tenantAdminData.lastName,
      onChange: (e) => setTenantAdminData({ ...tenantAdminData, lastName: e.target.value }),
      required: true,
    },
    {
      name: 'username',
      label: 'Username',
      value: tenantAdminData.username,
      onChange: (e) => setTenantAdminData({ ...tenantAdminData, username: e.target.value }),
      required: true,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      value: tenantAdminData.email,
      onChange: (e) => setTenantAdminData({ ...tenantAdminData, email: e.target.value }),
      required: true,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      value: tenantAdminData.password,
      onChange: (e) => setTenantAdminData({ ...tenantAdminData, password: e.target.value }),
    },
    {
      name: 'tenantId',
      label: 'Tenant ID',
      type: 'number',
      value: tenantAdminData.tenantId,
      onChange: (e) => setTenantAdminData({ ...tenantAdminData, tenantId: e.target.value }),
    },
    {
      name: 'mobileNumber',
      label: 'Mobile Number',
      value: tenantAdminData.mobileNumber,
      onChange: (e) => setTenantAdminData({ ...tenantAdminData, mobileNumber: e.target.value }),
    },
    {
      name: 'profilePicturePath',
      label: 'Profile Picture Path',
      value: tenantAdminData.profilePicturePath,
      onChange: (e) => setTenantAdminData({ ...tenantAdminData, profilePicturePath: e.target.value }),
    },
  ];

  return (
    <Box sx={{ mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      {loading && <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}
      <Button onClick={() => setOpenTenant(true)} variant="contained" sx={{ mb: 2 }}>
        Create Tenant
      </Button>
      <Dialog open={openTenant} onClose={() => setOpenTenant(false)}>
        <DialogTitle>Create Tenant</DialogTitle>
        <DialogContent>
          <Form fields={tenantFields} onSubmit={handleCreateTenant} submitLabel="Create" disabled={loading} />
        </DialogContent>
      </Dialog>
      <Typography variant="h5" sx={{ mb: 2 }}>Tenants</Typography>
      <DataTable columns={tenantColumns} data={tenants} renderActions={tenantActions} />
      <Button onClick={() => setOpenTenantAdmin(true)} variant="contained" sx={{ mt: 4, mb: 2 }}>
        Create Tenant Admin
      </Button>
      <Dialog open={openTenantAdmin} onClose={() => setOpenTenantAdmin(false)}>
        <DialogTitle>Create Tenant Admin</DialogTitle>
        <DialogContent>
          <Form fields={tenantAdminFields} onSubmit={handleCreateTenantAdmin} submitLabel="Create" disabled={loading} />
        </DialogContent>
      </Dialog>
      <Typography variant="h5" sx={{ mt: 4 }}>Users</Typography>
      <DataTable columns={userColumns} data={users} />
      <Pagination count={totalPages} page={page} onChange={(e, v) => setPage(v)} />
      <ErrorAlert error={error} onClose={() => {}} />
    </Box>
  );
}

export default AdminDashboard;