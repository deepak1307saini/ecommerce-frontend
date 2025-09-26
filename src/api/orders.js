import axiosInstance from './axiosInstance';

export const fetchOrders = async ({ page = 0, size = 5, tenantName }) => {
  const url = tenantName ? `/tenant/${tenantName}/orders` : '/orders';
  const response = await axiosInstance.get(url, { params: { page, size } });
  return {
    content: response.data.content || [],
    totalPages: response.data.page.totalPages || 1,  // Corrected to access nested 'page.totalPages'
  };
};

export const fetchOrderById = async (orderId) => {
  const response = await axiosInstance.get(`/orders/${orderId}`);
  return response.data;
};

export const createOrder = async ({ items }) => {
  await axiosInstance.post('/orders', { items });
};

export const updateOrderStatus = async ({ tenantName, orderId, status }) => {
  await axiosInstance.put(`/tenant/${tenantName}/orders/${orderId}/status`, { status });
};