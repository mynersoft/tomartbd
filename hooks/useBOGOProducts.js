import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import axios from 'axios';

// Fetch BOGO products
export const useBOGOProducts = () => {
  return useQuery({
    queryKey: ['bogo-products'],
    queryFn: async () => {
      const response = await axios.get('/api/bogo');
      return response.data;
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 'Failed to fetch BOGO products'
      );
    },
  });
};

// Fetch single BOGO product
export const useBOGOProduct = (productId) => {
  return useQuery({
    queryKey: ['bogo-product', productId],
    queryFn: async () => {
      const response = await axios.get(`/api/products/${productId}`);
      return response.data;
    },
    enabled: !!productId,
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to fetch product');
    },
  });
};

// Create BOGO product
export const useCreateBOGOProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData) => {
      const response = await axios.post('/api/admin/products', productData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('BOGO product created successfully!');
      queryClient.invalidateQueries(['bogo-products']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create product');
    },
  });
};

// Update BOGO product
export const useUpdateBOGOProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const response = await axios.put(`/api/admin/products/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Product updated successfully!');
      queryClient.invalidateQueries(['bogo-products']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update product');
    },
  });
};

// Calculate BOGO cart
export const useCalculateBOGOCart = () => {
  return useMutation({
    mutationFn: async (cartItems) => {
      const response = await axios.post('/api/cart/calculate-bogo', {
        cartItems,
      });
      return response.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to calculate BOGO');
    },
  });
};
