import ProductCardSkeleton from "./ProductCardSkeleton";

export default function ProductSectionSkeleton() {
  return (
    <section className="my-8 sm:my-10">
      {/* Section title */}
      <div
        className="
          h-5 sm:h-6
          bg-gray-200
          rounded
          w-40 sm:w-56
          mb-4 sm:mb-6
          animate-pulse
        "
      />

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}