// src/views/ProductView.js
import ProductHeader from "../components/product-header";
import ProductInfoSection from "../components/product-info";
import RentalPricingSection from "../components/retail-details";
import { fetchAllCategories } from "@/db/category";
import { currentUserProduct } from "@/db/product";

import { findProductBySlug } from "@/db/product";


export default async function ProductView({ params }) {
    const categories = await fetchAllCategories()
    const products = await currentUserProduct()

    let product = null
    if (params) {
        product = await findProductBySlug(params)
    }




    return (
        <div className="bg-background text-foreground min-h-screen p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <ProductHeader categories={categories} product={product} products={products} key={"/"} />

                {product && (
                    <div className="grid md:grid-cols-2 gap-8 border border-border rounded-lg p-6 md:p-8">
                        <ProductInfoSection product={product} />
                        <RentalPricingSection
                            product={product}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

