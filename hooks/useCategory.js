import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import {
  setCategories,
  addCategory,
  updateCategory,
  removeCategory,
} from '@/store/slices/categorySlice';

// Fetch categories
export function useCategories() {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axios.get('/api/categories');
      dispatch(setCategories(res.data));
      return res.data;
    },
    onError: (err) => toast.error(`Failed to fetch categories: ${err.message}`),
    onSuccess: () => toast.success('Categories fetched successfully'),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

// Add category
export function useAddCategory() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (categoryData) => {
      const res = await axios.post('/api/categories', categoryData);
      return res.data;
    },
    onMutate: () => toast.loading('Adding category...', { id: 'add-cat' }),
    onSuccess: (newCategory) => {
      dispatch(addCategory(newCategory));
      queryClient.invalidateQueries(['categories']);
      toast.success('Category added successfully', { id: 'add-cat' });
    },
    onError: (err) => {
      let message = 'Failed to add category';
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || err.message;
      } else if (err instanceof Error) message = err.message;
      toast.error(message, { id: 'add-cat' });
    },
  });
}

// Update category
export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await axios.put(`/api/categories/${id}`, data);
      return res.data;
    },
    onMutate: () => toast.loading('Updating category...', { id: 'update-cat' }),
    onSuccess: (updatedCategory) => {
      dispatch(updateCategory(updatedCategory));
      queryClient.invalidateQueries(['categories']);
      toast.success('Category updated successfully', { id: 'update-cat' });
    },
    onError: (err) => {
      let message = 'Failed to update category';
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || err.message;
      } else if (err instanceof Error) message = err.message;
      toast.error(message, { id: 'update-cat' });
    },
  });
}

// Delete category
export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(`/api/categories/${id}`);
      return res.data;
    },
    onMutate: () => toast.loading('Deleting category...', { id: 'delete-cat' }),
    onSuccess: (_, id) => {
      dispatch(removeCategory(id));
      queryClient.invalidateQueries(['categories']);
      toast.success('Category deleted successfully', { id: 'delete-cat' });
    },
    onError: (err) => toast.error('Failed to delete category: ' + err.message, { id: 'delete-cat' }),
  });
}