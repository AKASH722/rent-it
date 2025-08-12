"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import EditProductModal from "./edit-product-model";
import CreateProductModal from "./create-product-model";
import ProductsList from "./product-list";

export default function ProductHeader({ product, categories, products }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    return (
        <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl font-bold mb-4">
                {product?.name ?? "Products"}
            </h1>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
                <Button
                    variant="outline"
                    className="bg-primary text-primary-foreground border-primary hover:bg-primary/90 px-4 sm:px-6 py-2 rounded-md shadow-sm text-sm sm:text-base"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    Create Product
                </Button>
                {product && (
                    <Button
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-4 sm:px-6 py-2 rounded-md shadow-sm text-sm sm:text-base"
                        onClick={() => setIsEditModalOpen(true)}
                    >
                        Edit Product
                    </Button>
                )}
            </div>

            {/* Conditionally render products list */}
            {!product && products && products.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">All Products</h2>
                    <ProductsList products={products} categories={categories} />
                </div>
            )}

            {/* Modals */}
            <CreateProductModal
                categories={categories}
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
            {product && (
                <EditProductModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    product={product}
                />
            )}
        </div>
    );
}