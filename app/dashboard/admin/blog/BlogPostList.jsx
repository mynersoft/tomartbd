import BlogCard from './BlogCard';

export default function BlogList({ posts }) {
  if (!posts || posts.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No blog posts available.
      </p>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <BlogCard key={post._id} post={post} />
      ))}
    </div>
  );
}