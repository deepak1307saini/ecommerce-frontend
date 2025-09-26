import axiosInstance from './axiosInstance';

export const fetchFavorites = async ({ page = 0, size = 5 }) => {
  const response = await axiosInstance.get('/favorites', { params: { page, size } });
  return {
    content: response.data.content || [],
    totalPages: response.data.totalPages || 1,
  };
};

export const removeFavorite = async (productId) => {
  await axiosInstance.delete('/favorites', { data: { productId } });
};