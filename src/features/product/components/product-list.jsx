import Link from "next/link";

export default function ProductsList({ products }) {
  const formatPrice = (price) => {
    if (!price) return "Not set";
    return `₹${price.toFixed(2)}`;
  };

  if (!products || products.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-lg text-gray-500">No products found</p>
        <p className="mt-2 text-sm text-gray-400">
          Create your first product to get started
        </p>
      </div>
    );
  }

  function formatDate(date) {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link href={`/store/product/${product.slug}`} key={product.id}>
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
              {/* Product Image */}
              <div className="aspect-video overflow-hidden rounded-t-lg bg-gray-100">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    <svg
                      className="h-12 w-12"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-4">
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="truncate text-lg font-semibold text-gray-900">
                    {product.name}
                  </h3>
                </div>

                {/* Category */}
                {product.category && (
                  <div className="mb-2">
                    <span className="inline-block rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
                      {product.category.name}
                    </span>
                  </div>
                )}

                {/* Description */}
                <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                  {product.description}
                </p>

                {/* Pricing */}
                <div className="mb-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Per Hour:</span>
                    <span className="font-medium">
                      {formatPrice(product.basePricePerHour)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Per Day:</span>
                    <span className="font-medium">
                      {formatPrice(product.basePricePerDay)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Per Week:</span>
                    <span className="font-medium">
                      {formatPrice(product.basePricePerWeek)}
                    </span>
                  </div>
                  {product.LateFeePerHour > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-red-500">Late Fee/Hour:</span>
                      <span className="font-medium text-red-600">
                        {formatPrice(product.LateFeePerHour)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Units and Dates */}
                <div className="flex items-center justify-between border-t pt-2 text-xs text-gray-500">
                  <span>Units: {product.units}</span>
                  <span>Created: {formatDate(product.createdAt)}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
