import Image from "next/image"

export default function ProductInfoSection({ product }) {
    return (
        <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
            <h2 className="text-lg sm:text-xl font-semibold border-border pb-2 sm:pb-3 mb-3 sm:mb-4">
                {product.name}
            </h2>

            {/* Product Image */}
            {product.imageUrl && (
                <div className="space-y-2 sm:space-y-3 pt-4 sm:pt-6 border-t border-border">
                    <h3 className="text-base sm:text-lg font-semibold">Product Image</h3>
                    <div className="flex justify-center items-center bg-muted rounded-md overflow-hidden p-2 sm:p-4">
                        <Image
                            src={product.imageUrl}
                            width={400}
                            height={300}
                            alt={`${product.name} image`}
                            className="object-contain max-h-[200px] sm:max-h-[300px] w-full sm:max-w-full"
                        />
                    </div>
                </div>
            )}

            {/* Product Details */}
            <div className="grid gap-3 sm:gap-4 text-sm">
                <div className="flex flex-col sm:flex-row sm:items-start space-y-1 sm:space-y-0">
                    <span className="font-medium w-full sm:w-32 sm:shrink-0 text-gray-700">Name:</span>
                    <span className="flex-1 break-words">{product.name}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start space-y-1 sm:space-y-0">
                    <span className="font-medium w-full sm:w-32 sm:shrink-0 text-gray-700">Slug:</span>
                    <span className="flex-1 break-words">{product.slug}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start space-y-1 sm:space-y-0">
                    <span className="font-medium w-full sm:w-32 sm:shrink-0 text-gray-700">Description:</span>
                    <span className="flex-1 break-words">{product.description}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start space-y-1 sm:space-y-0">
                    <span className="font-medium w-full sm:w-32 sm:shrink-0 text-gray-700">Units:</span>
                    <span className="flex-1">{product.units}</span>
                </div>

                {/* Pricing Information */}
                {product.basePricePerHour && (
                    <div className="flex flex-col sm:flex-row sm:items-start space-y-1 sm:space-y-0">
                        <span className="font-medium w-full sm:w-32 sm:shrink-0 text-gray-700">Price/Hour:</span>
                        <span className="flex-1 font-semibold text-green-600">${product.basePricePerHour.toFixed(2)}</span>
                    </div>
                )}

                {product.basePricePerDay && (
                    <div className="flex flex-col sm:flex-row sm:items-start space-y-1 sm:space-y-0">
                        <span className="font-medium w-full sm:w-32 sm:shrink-0 text-gray-700">Price/Day:</span>
                        <span className="flex-1 font-semibold text-green-600">${product.basePricePerDay.toFixed(2)}</span>
                    </div>
                )}

                {product.basePricePerWeek && (
                    <div className="flex flex-col sm:flex-row sm:items-start space-y-1 sm:space-y-0">
                        <span className="font-medium w-full sm:w-32 sm:shrink-0 text-gray-700">Price/Week:</span>
                        <span className="flex-1 font-semibold text-green-600">${product.basePricePerWeek.toFixed(2)}</span>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-start space-y-1 sm:space-y-0">
                    <span className="font-medium w-full sm:w-32 sm:shrink-0 text-gray-700">Late Fee/Hour:</span>
                    <span className="flex-1 font-semibold text-red-600">${product.LateFeePerHour.toFixed(2)}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start space-y-1 sm:space-y-0">
                    <span className="font-medium w-full sm:w-32 sm:shrink-0 text-gray-700">Owner:</span>
                    <span className="flex-1">{product.owner?.name || 'N/A'}</span>
                </div>

                {product.category && (
                    <div className="flex flex-col sm:flex-row sm:items-start space-y-1 sm:space-y-0">
                        <span className="font-medium w-full sm:w-32 sm:shrink-0 text-gray-700">Category:</span>
                        <span className="flex-1">{product.category.name}</span>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-start space-y-1 sm:space-y-0">
                    <span className="font-medium w-full sm:w-32 sm:shrink-0 text-gray-700">Created:</span>
                    <span className="flex-1">{new Date(product.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start space-y-1 sm:space-y-0">
                    <span className="font-medium w-full sm:w-32 sm:shrink-0 text-gray-700">Updated:</span>
                    <span className="flex-1">{new Date(product.updatedAt).toLocaleDateString()}</span>
                </div>
            </div>

            {/* Product Attributes */}
            {product.ProductAttribute && product.ProductAttribute.length > 0 && (
                <div className="space-y-2 sm:space-y-3 pt-4 sm:pt-6 border-t border-border">
                    <h3 className="text-base sm:text-lg font-semibold">Product Attributes</h3>
                    <div className="grid gap-2 sm:gap-3 text-sm">
                        {product.ProductAttribute.map((attr, index) => (
                            <div key={index} className="flex flex-col sm:flex-row sm:items-start space-y-1 sm:space-y-0 p-2 sm:p-0 bg-gray-50 sm:bg-transparent rounded sm:rounded-none">
                                <span className="font-medium w-full sm:w-32 sm:shrink-0 text-gray-700">{attr.key}:</span>
                                <span className="flex-1 break-words">{attr.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}