import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useBlogs = () =>
  useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const { data } = await axios.get("/api/blog");
      return data;
    },
  });

export const useCreateBlog = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => axios.post("/api/blog", data),
    onSuccess: () => qc.invalidateQueries(["blogs"]),
  });
};




//single
export const useSingleBlog = (slug) =>
  useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const { data } = await axios.get(`/api/blog/slug/${slug}`);
      return data;
    },
  });