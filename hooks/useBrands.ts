"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export type BrandForm = {
  name: string;
  logo?: string;   // ✅ FIXED
};

export function useBrands() {
  const queryClient = useQueryClient();

  const brandsQuery = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const res = await api.get("/brands");
      return res.data.brands;
    },
  });

  const createBrand = useMutation({
    mutationFn: (data: BrandForm) => api.post("/brands", data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["brands"] }),
  });

  const updateBrand = useMutation({
    mutationFn: ({ id, data }: { id: string; data: BrandForm }) =>
      api.put(`/brands/${id}`, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["brands"] }),
  });

  const deleteBrand = useMutation({
    mutationFn: (id: string) => api.delete(`/brands/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["brands"] }),
  });

  return {
    ...brandsQuery,
    createBrand,
    updateBrand,
    deleteBrand,
  };
}