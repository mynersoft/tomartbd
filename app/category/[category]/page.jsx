export default function CategoryPage({ params }) {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold capitalize">
        {params.category.replace("-", " ")}
      </h1>
    </div>
  );
}