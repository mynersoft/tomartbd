"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogPost, clearCurrentPost } from "@/store/slices/blogSlice";

export default function ClientView({ slug }) {
	const dispatch = useDispatch();
	const { currentPost, loading, error } = useSelector((state) => state.blog);

	useEffect(() => {
		dispatch(fetchBlogPost(slug));
		return () => dispatch(clearCurrentPost());
	}, [slug, dispatch]);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;
	if (!currentPost) return <div>Post Not Found</div>;

	return (
		<div>
			<h1>{currentPost.title}</h1>
			<div dangerouslySetInnerHTML={{ __html: currentPost.content }} />
		</div>
	);
}
