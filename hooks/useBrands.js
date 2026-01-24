'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import {
  setBrands,
  addBrand,
  removeBrand,
  setSingleBrand,
} from '@/store/slices/brandsSlice';
import toast from 'react-hot-toast';
import { clearCart } from '@/store/slices/cartSlice';

export function useBrands() {
  const dispatch = useDispatch();
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const res = await axios.get('/api/brands');
      dispatch(setBrands(res.data));
      return res.data.brands;
    },
    onError: (error) => {
      toast.error(`Failed to fetch Brands: ${error.message}`);
    },
    onSuccess: () => {
      toast.success('Brands fetched successfully');
    },
  });
}

// single brand  by userId
export function useSingleBrand(userId) {
  const dispatch = useDispatch();
  return useQuery({
    queryKey: ['brand', userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error('Brand ID is required');
      }
      try {
        const res = await axios.get(`/api/brands/userid/${userId}`);

        if (!res.data.success) {
          throw new Error(res.data.error || 'Failed to fetch brand');
        }
        // Dispatch to Redux store
        if (res.data.brand) {
          dispatch(setSingleBrand(res.data.brand));
        }

        return res.data.brand;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(
            error.response?.data?.error ||
              error.response?.data?.message ||
              'Failed to fetch brand'
          );
        }
        throw error;
      }
    },

    onSuccess: (data) => {
      if (data) {
        toast.success('Brand details loaded successfully');
      }
    },
  });
}

export function useAddBrand() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async (brandData) => {
      const res = await axios.post('/api/brands', brandData);
      dispatch(addBrand(res.data));
      return res.data.brand;
    },

    onSuccess: (newBrand) => {
      queryClient.invalidateQueries(['brands']);
      dispatch(clearCart());
      toast.success('Brand added successfully!', { id: 'add-brand' });
    },
    onError: (error) => {
      let message = 'Failed to add Brand';
      if (axios.isAxiosError(error)) {
        message =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message, { id: 'add-brand' });
    },
  });
}

export const useUpdateBrandstatus = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) =>
      axios.patch(`/api/brands/${id}`, { status }),
    onSuccess: () => qc.invalidateQueries(['brands']),
  });
};

export const useDeleteBrand = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(`/api/brands/${id}`);
      return res.data;
    },
    onSuccess: (_data, id) => {
      // Invalidate react-query
      qc.invalidateQueries(['brands']);
      // Update redux slice
      dispatch(removeBrand(id));
      toast.success('Brand deleted successfully');
    },
    onError: (err) => {
      toast.error(`Failed to delete brand: ${err.message}`);
    },
  });
};
