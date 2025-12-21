import ProductCardSkeleton from "./ProductCardSkeleton";

export default function ProductSectionSkeleton({ title }) {
  return (
    <section className="my-10">
      <div className="h-6 bg-gray-200 rounded w-48 mb-6 animate-pulse" />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}