export default function ProductCardSkeleton() {
  return (
    <div className="bg-white shadow rounded overflow-hidden animate-pulse">
      {/* Image */}
      <div
        className="
          bg-gray-200
          h-40        /* mobile */
          sm:h-44     /* small tablet */
          md:h-48     /* desktop */
        "
      />

      {/* Content */}
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        {/* Title */}
        <div
          className="
            h-3 sm:h-4
            bg-gray-200
            rounded
            w-5/6
          "
        />

        {/* Brand */}
        <div
          className="
            h-2.5 sm:h-3
            bg-gray-200
            rounded
            w-2/3
          "
        />

        {/* Price */}
        <div
          className="
            h-4 sm:h-5
            bg-gray-200
            rounded
            w-1/3
          "
        />

        {/* Buttons */}
        <div className="flex gap-2 pt-2">
          <div
            className="
              h-8 sm:h-9
              bg-gray-200
              rounded
              flex-1
            "
          />
          <div
            className="
              h-8 sm:h-9
              bg-gray-200
              rounded
              flex-1
            "
          />
        </div>
      </div>
    </div>
  );
}