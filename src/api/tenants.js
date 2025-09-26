import axiosInstance from './axiosInstance';

export const fetchTenants = async ({ page = 0, size = 5 }) => {
  const response = await axiosInstance.get('/admin/tenants', { params: { page, size } });
  return {
    content: response.data.content || [],
    totalPages: response.data.totalPages || 1,
  };
};

export const createTenant = async (name) => {
  await axiosInstance.post('/admin/tenants', { name });
};

export const deleteTenant = async (name) => {
  await axiosInstance.delete(`/admin/tenants/${name}`);
};

export const createTenantAdmin = async (adminData) => {
  await axiosInstance.post('/admin/tenant-admin', adminData);
};

export const fetchUsers = async ({ page = 0, size = 5 }) => {
  const response = await axiosInstance.get('/admin/users', { params: { page, size } });
  return {
    content: response.data.content || [],
    totalPages: response.data.totalPages || 1,
  };
};