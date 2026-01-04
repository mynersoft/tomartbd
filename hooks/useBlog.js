import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setBlogs, setBlogLoading } from "@/store/slices/blogSlice";

/* =====================
   GET ALL BLOGS
===================== */
export const useBlogs = () => {
	const dispatch = useDispatch();

	return useQuery({
		queryKey: ["blogs"],
		queryFn: async () => {
			dispatch(setBlogLoading(true));
			const { data } = await axios.get("/api/blog");
			dispatch(setBlogs(data));
			return data;
		},
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
	});
};

/* =====================
   CREATE BLOG
===================== */
export const useCreateBlog = () => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: (payload) => axios.post("/api/blog", payload),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["blogs"] });
		},
	});
};

/* =====================
   SINGLE BLOG
===================== */
export const useSingleBlog = (slug) =>
	useQuery({
		queryKey: ["blog", slug],
		queryFn: async () => {
			const { data } = await axios.get(`/api/blog/slug/${slug}`);
			return data;
		},
		enabled: !!slug,
	});
