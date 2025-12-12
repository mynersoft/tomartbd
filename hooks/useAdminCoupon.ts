"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export type CouponForm = {
  id?: string;
  code: string;
  discount: number;
  expiry: string;
  usageLimit: number;
};

export function useCoupons() {
  return useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const res = await api.get("/coupon");
      return res.data.coupons;
    },
  });
}

export function useCreateCoupon() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CouponForm) => api.post("/coupon", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["coupons"] }),
  });
}

export function useUpdateCoupon() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CouponForm) => api.put("/coupon", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["coupons"] }),
  });
}

export function useDeleteCoupon() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete("/coupon", { data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["coupons"] }),
  });
}