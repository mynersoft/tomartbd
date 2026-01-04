"use client";

import { useProducts } from "@/hooks/useProducts";
import { useBlogs } from "./../hooks/useBlog";
import { useInitializeCart } from "@/hooks/useCart";
import useLoginUser from "@/hooks/useAuth";
import  {useNotifications} from " @/hooks/useNotifications";

export default function InitData() {
	const { user } = useLoginUser();
	useInitializeCart(user?.id);
	useProducts();
	useBlogs();
useNotifications();
	return null;
}
