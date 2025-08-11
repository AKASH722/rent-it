"use client";

import React from "react";
import Link from "next/link";
import { Heart, Minus, Plus } from "lucide-react";

const ProductGrid = ({
  products,
  viewMode,
  isMobile,
  onToggleWishlist,
  onQuantityChange,
}) => {
  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-card border-border rounded-lg border p-4 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center">
              {/* Product Image */}
              <div className="bg-muted flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-muted-foreground text-sm">
                    No Image
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="ml-4 flex-1">
                <h3 className="text-foreground font-medium">{product.name}</h3>

                {isMobile ? (
                  <>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="text-foreground text-lg font-semibold">
                        ₹{product.price}
                      </span>
                      <span className="bg-primary/10 text-primary flex-shrink-0 rounded-lg px-2 py-1 text-xs font-medium whitespace-nowrap">
                        {product.category}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {onQuantityChange && (
                          <div className="border-border flex items-center overflow-hidden rounded-lg border shadow-sm">
                            <button
                              onClick={() =>
                                onQuantityChange(
                                  product.id,
                                  (product.quantity || 1) - 1
                                )
                              }
                              className="hover:bg-muted active:bg-muted p-2 transition-colors duration-150"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="bg-muted px-4 py-2 text-sm font-medium">
                              {product.quantity || 1}
                            </span>
                            <button
                              onClick={() =>
                                onQuantityChange(
                                  product.id,
                                  (product.quantity || 1) + 1
                                )
                              }
                              className="hover:bg-muted active:bg-muted p-2 transition-colors duration-150"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                        <button
                          onClick={() => onToggleWishlist(product.id)}
                          className={`transform rounded-full p-2 transition-all duration-200 hover:scale-110 ${
                            product.inWishlist
                              ? "bg-red-50 text-red-500 shadow-md"
                              : "text-muted-foreground hover:bg-red-50 hover:text-red-500"
                          }`}
                        >
                          <Heart
                            className="h-4 w-4"
                            fill={product.inWishlist ? "currentColor" : "none"}
                          />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mt-2 flex items-center gap-4">
                      <Link
                        href={`/product/${product.slug}`}
                        className="from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80 block transform rounded-lg bg-gradient-to-r px-6 py-2 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => onToggleWishlist(product.id)}
                        className={`transform rounded-full p-2 transition-all duration-200 hover:scale-110 ${
                          product.inWishlist
                            ? "bg-red-50 text-red-500 shadow-md"
                            : "text-muted-foreground hover:bg-red-50 hover:text-red-500"
                        }`}
                      >
                        <Heart
                          className="h-5 w-5"
                          fill={product.inWishlist ? "currentColor" : "none"}
                        />
                      </button>
                    </div>
                  </>
                )}
              </div>

              {!isMobile && (
                <div className="flex min-w-[140px] flex-col items-end gap-2 text-right">
                  <span className="bg-primary/10 text-primary rounded-lg px-2 py-1 text-xs font-medium whitespace-nowrap">
                    {product.category}
                  </span>
                  <span className="text-foreground pt-4 text-xl leading-none font-semibold">
                    ₹{product.price}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Grid View
  const gridCols = isMobile ? "grid-cols-1" : "grid-cols-4";

  return (
    <div className={`grid ${gridCols} gap-4 sm:grid-cols-2 lg:grid-cols-4`}>
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-card border-border group transform overflow-hidden rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <Link href={`/product/${product.slug}`}>
            <div className="bg-muted relative flex h-48 items-center justify-center overflow-hidden">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-muted-foreground">No Image</span>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </div>
          </Link>

          <div className="p-4">
            <Link href={`/product/${product.slug}`}>
              <h3 className="text-foreground hover:text-primary mb-2 cursor-pointer font-medium transition-colors">
                {product.name}
              </h3>
            </Link>

            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-primary text-lg font-bold">
                ₹{product.price}
              </span>
              <span className="bg-primary/10 text-primary flex-shrink-0 rounded-lg px-2 py-1 text-xs font-medium whitespace-nowrap">
                {product.category}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <Link
                href={`/product/${product.slug}`}
                className="from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80 mr-2 block transform rounded-lg bg-gradient-to-r p-4 py-2.5 text-sm font-medium shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                View
              </Link>
              <button
                onClick={() => onToggleWishlist(product.id)}
                className={`transform rounded-lg p-2.5 transition-all duration-200 hover:scale-110 ${
                  product.inWishlist
                    ? "bg-red-50 text-red-500 shadow-md"
                    : "text-muted-foreground hover:bg-red-50 hover:text-red-500"
                }`}
              >
                <Heart
                  className="h-4 w-4"
                  fill={product.inWishlist ? "currentColor" : "none"}
                />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
