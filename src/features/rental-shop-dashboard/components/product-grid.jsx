"use client";

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Plus, Minus } from 'lucide-react';

const ProductGrid = ({
  products,
  viewMode,
  isMobile,
  onAddToCart,
  onToggleWishlist,
  onQuantityChange
}) => {
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map(product => (
          <div key={product.id} className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              {/* Product Image */}
              <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-muted-foreground text-sm">Image</span>
              </div>

              {/* Product Info */}
              <div className="flex-1 ml-4">
                {/* Title only for both mobile and desktop */}
                <h3 className="font-medium text-foreground">{product.name}</h3>
                
                {isMobile ? (
                  <>
                    {/* Price and Category on same line for mobile */}
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="text-lg font-semibold text-foreground">₹{product.price}</span>
                      <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-lg whitespace-nowrap flex-shrink-0">
                        {product.category}
                      </span>
                    </div>
                    
                    {/* Action buttons for mobile */}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {onQuantityChange && (
                          <div className="flex items-center border border-border rounded-lg overflow-hidden shadow-sm">
                            <button 
                              onClick={() => onQuantityChange(product.id, (product.quantity || 1) - 1)}
                              className="p-2 hover:bg-muted transition-colors duration-150 active:bg-muted"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 text-sm font-medium bg-muted">{product.quantity || 1}</span>
                            <button 
                              onClick={() => onQuantityChange(product.id, (product.quantity || 1) + 1)}
                              className="p-2 hover:bg-muted transition-colors duration-150 active:bg-muted"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        <button
                          onClick={() => onToggleWishlist(product.id)}
                          className={`p-2 rounded-full transition-all duration-200 transform hover:scale-110 ${
                            product.inWishlist ? 'text-red-500 bg-red-50 shadow-md' : 'text-muted-foreground hover:text-red-500 hover:bg-red-50'
                          }`}
                        >
                          <Heart className="w-4 h-4" fill={product.inWishlist ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          onClick={() => onAddToCart(product.id)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-full transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Actions for desktop */}
                    <div className="mt-2 flex items-center gap-4 ">
                      <button
                        onClick={() => onAddToCart(product.id)}
                        className="px-6 py-2 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-lg hover:from-primary/90 hover:to-primary/80 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => onToggleWishlist(product.id)}
                        className={`p-2 rounded-full transition-all duration-200 transform hover:scale-110 ${
                          product.inWishlist ? 'text-red-500 bg-red-50 shadow-md' : 'text-muted-foreground hover:text-red-500 hover:bg-red-50'
                        }`}
                      >
                        <Heart className="w-5 h-5 " fill={product.inWishlist ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Category and Price (Desktop List View) */}
              {!isMobile && (
                <div className="flex flex-col items-end text-right min-w-[140px] gap-2">
                  <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-lg whitespace-nowrap">
                    {product.category}
                  </span>
                  <span className="text-xl pt-4 font-semibold text-foreground leading-none">₹{product.price}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Grid View
  const gridCols = isMobile ? 'grid-cols-2' : 'grid-cols-4';
  
  return (
    <div className={`grid ${gridCols} gap-4`}>
      {products.map(product => (
        <div key={product.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
          {/* Product Image - Clickable */}
          <Link href={`/product/${product.id}`}>
            <div className="h-48 bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center relative overflow-hidden cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="text-muted-foreground">Image</span>
            </div>
          </Link>

          {/* Product Info */}
          <div className="p-4">
            <Link href={`/product/${product.id}`}>
              <h3 className="font-medium text-foreground mb-2 hover:text-primary transition-colors cursor-pointer">{product.name}</h3>
            </Link>
            
            {/* Price and Category Tag */}
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-lg font-bold text-primary">₹{product.price}</span>
              <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-lg whitespace-nowrap flex-shrink-0">
                {product.category}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                onClick={() => onAddToCart(product.id)}
                className="flex-1 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground text-sm font-medium rounded-lg hover:from-primary/90 hover:to-primary/80 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mr-2"
              >
                Add to Cart
              </button>
              <button
                onClick={() => onToggleWishlist(product.id)}
                className={`p-2.5 rounded-lg transition-all duration-200 transform hover:scale-110 ${
                  product.inWishlist ? 'text-red-500 bg-red-50 shadow-md' : 'text-muted-foreground hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <Heart className="w-4 h-4" fill={product.inWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;