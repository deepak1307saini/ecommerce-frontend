import axiosInstance from './axiosInstance';
import { sanitizeUrl } from '../utils/sanitizeUrl';

export const fetchProducts = async ({ page = 0, size = 3, search = '', category = '' }) => {
  const params = { page, size, ...(search && { search }), ...(category && { category }) };
  const response = await axiosInstance.get('/public/products', { params });
  return {
    content: response.data.content.map((product) => ({
      ...product,
      thumbnail: sanitizeUrl(product.thumbnail),
    })),
    totalPages: response.data.page.totalPages || 1,
  };
};

export const addToWishlist = async (productId) => {
  await axiosInstance.post('/favorites', { productId });
};

export const fetchTenantProducts = async ({ tenantName, page = 0, size = 5 }) => {
  const response = await axiosInstance.get(`/tenant/${tenantName}/products`, { params: { page, size } });
  return {
    content: response.data.content.map((product) => ({
      ...product,
      thumbnail: sanitizeUrl(product.thumbnail),
    })),
    totalPages: response.data.page.totalPages || 1,
  };
};

export const saveProduct = async ({ tenantName, product, imageFile, productId }) => {
  const formData = new FormData();
  formData.append('product', new Blob([JSON.stringify({ ...product, thumbnail: sanitizeUrl(product.thumbnail) })], { type: 'application/json' }));
  if (imageFile) formData.append('image', imageFile);
  const url = productId ? `/tenant/${tenantName}/products/${productId}` : `/tenant/${tenantName}/products`;
  const method = productId ? axiosInstance.put : axiosInstance.post;
  await method(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};

export const deleteProduct = async ({ tenantName, productId }) => {
  await axiosInstance.delete(`/tenant/${tenantName}/products/${productId}`);
};