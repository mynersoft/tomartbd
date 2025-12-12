"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export function useCategories() {
  const qc = useQueryClient();

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data.categories;
    },
  });

  const createCategory = useMutation({
    mutationFn: (data: any) => api.post("/categories", data),
    onSuccess: () => qc.invalidateQueries({queryKey:["categories"]})
  });

  const updateCategory = useMutation({
    mutationFn: ({ id, data }: any) => api.put(`/categories/${id}`, data),
    onSuccess: () => qc.invalidateQueries({queryKey:["categories"]})
  });

  const deleteCategory = useMutation({
    mutationFn: (id: string) => api.delete(`/categories/${id}`),
    onSuccess: () => qc.invalidateQueries({queryKey:["categories"]})
  });

  return {
    ...categoriesQuery,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}