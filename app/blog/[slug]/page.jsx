// import ClientView from "./ClientView";

// // Fetch static params
// export async function generateStaticParams() {
// 	const posts = await fetch("https://your-api.com/blog").then((res) =>
// 		res.json()
// 	);
// 	return posts.map((post) => ({ slug: post.slug }));
// }

// // Optional: Metadata
// export async function generateMetadata({ params }) {
// 	const { slug } = params;
// 	const post = await fetch(`https://your-api.com/blog/${slug}`).then((res) =>
// 		res.json()
// 	);

// 	if (!post) return { title: "Post Not Found | TomartBD" };

// 	return {
// 		title: post.title,
// 		description: post.excerpt || post.content?.substring(0, 160),
// 	};
// }

// export default function BlogPostPage({ params }) {
// 	return <ClientView slug={params.slug} />;
// }


import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page