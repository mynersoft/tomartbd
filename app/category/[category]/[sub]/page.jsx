export default function SubCategoryPage({ params }) {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold capitalize">
        {params.sub.replace("-", " ")}
      </h1>
    </div>
  );
}