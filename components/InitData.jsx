"use client";

import { useProducts } from "@/hooks/useProducts";
import { useBlogs } from "./../hooks/useBlog";
import { useInitializeCart } from "@/hooks/useCart";
import useLoginUser from "@/hooks/useAuth";

export default function InitData() {
	const { user } = useLoginUser();
	useInitializeCart(user?.id);
	useProducts();
	useBlogs();
	return null;
}
