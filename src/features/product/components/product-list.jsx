
import Link from "next/link";
import Image from "next/image";
export default function ProductsList({ products }) {
    

    const formatPrice = (price) => {
        if (!price) return "Not set";
        return `$${price.toFixed(2)}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (!products || products.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No products found</p>
                <p className="text-gray-400 text-sm mt-2">Create your first product to get started</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                
                {products.map((product) => (
                    
                    <Link href={`product/${product.slug}`} key={product.id}>
                    
                    <div
                       
                        className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                        {/* Product Image */}
                        <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                            {product.imageUrl ? (
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                    {product.name}
                                </h3>
                               
                            </div>

                            {/* Category */}
                            {product.category && (
                                <div className="mb-2">
                                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                        {product.category.name}
                                    </span>
                                </div>
                            )}

                            {/* Description */}
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {product.description}
                            </p>

                            {/* Pricing */}
                            <div className="space-y-1 mb-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Per Hour:</span>
                                    <span className="font-medium">{formatPrice(product.basePricePerHour)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Per Day:</span>
                                    <span className="font-medium">{formatPrice(product.basePricePerDay)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Per Week:</span>
                                    <span className="font-medium">{formatPrice(product.basePricePerWeek)}</span>
                                </div>
                                {product.LateFeePerHour > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-red-500">Late Fee/Hour:</span>
                                        <span className="font-medium text-red-600">{formatPrice(product.LateFeePerHour)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Units and Dates */}
                            <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-2">
                                <span>Units: {product.units}</span>
                                <span>Created: {formatDate(product.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                   
                        </Link >
                ))}
            </div>

           
        </div>
    );
}