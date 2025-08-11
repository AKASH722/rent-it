"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Minus,
  Plus,
  Heart,
  ShoppingCart
} from 'lucide-react';
import Header from '@/components/header';

const ProductDetailPage = ({ product }) => {
  const [quantity, setQuantity] = useState(2);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Default product data if none provided (for standalone usage)
  const defaultProduct = {
    id: '1',
    name: 'Professional Camera Kit',
    price: 1000,
    unitPrice: 500,
    image: '',
    description: 'Professional DSLR camera kit perfect for photography enthusiasts and professionals.',
    longDescription: `Professional DSLR camera kit perfect for photography enthusiasts and professionals. 
      This comprehensive package includes a high-resolution camera body, multiple lenses, 
      tripod, and essential accessories. Features include 24.2MP sensor, 4K video recording, 
      built-in WiFi connectivity, and weather-sealed construction. Ideal for weddings, events, 
      portraits, and landscape photography.`,
    features: [
      '24.2MP sensor',
      '4K video recording',
      'Built-in WiFi connectivity',
      'Weather-sealed construction'
    ],
    included: [
      'Camera body',
      '18-55mm lens',
      '50mm prime lens',
      '70-200mm telephoto lens',
      'Professional tripod',
      'Camera bag',
      'Extra batteries',
      'Memory cards'
    ]
  };

  const productData = product || defaultProduct;

  const handleQuantityChange = (type) => {
    if (type === 'increment') {
      setQuantity(prev => prev + 1);
    } else {
      setQuantity(prev => Math.max(1, prev - 1));
    }
  };

  const handleAddToCart = () => {
    // Add cart animation or notification here
    console.log(`Added ${quantity} items to cart`);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Component */}
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="text-sm text-muted-foreground">
          <Link href="/home" className="hover:text-primary transition-colors">
            All Products
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium">{productData.name}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Left Column - Product Image */}
          <div className="mb-8 lg:mb-0">
            <div className="aspect-square bg-muted rounded-lg border-2 border-dashed border-border flex items-center justify-center mb-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-muted rounded-lg mx-auto mb-4"></div>
                <p className="text-muted-foreground font-medium">Product Image Placeholder</p>
                <p className="text-sm text-muted-foreground">1200 x 1200 pixels</p>
              </div>
            </div>

            {/* Add to Wishlist Button */}
            <button
              onClick={toggleWishlist}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full border-2 transition-all duration-200 w-full sm:w-auto justify-center ${
                isWishlisted
                  ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                  : 'bg-card border-border text-foreground hover:border-red-300 hover:text-red-600'
              }`}
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
              <span className="font-medium">
                {isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}
              </span>
            </button>

            {/* Product Description */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Product Description</h3>
              <div className="text-muted-foreground space-y-3">
                <p>{productData.description}</p>
                {productData.longDescription && (
                  <p>{productData.longDescription}</p>
                )}
                {productData.included && productData.included.length > 0 && (
                  <div>
                    <p className="font-medium text-foreground mt-4 mb-2">Kit includes:</p>
                    <p>{productData.included.join(', ')}</p>
                  </div>
                )}
              </div>
              <button className="text-primary hover:text-primary/80 font-medium mt-4 transition-colors">
                Read More →
              </button>
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            {/* Product Name and Price */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-4">{productData.name}</h1>
              <div className="flex items-baseline space-x-4">
                <span className="text-3xl font-bold text-primary">₹{productData.price}</span>
                <span className="text-lg text-muted-foreground">₹{productData.unitPrice}/unit</span>
              </div>
            </div>

            {/* Date Range Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-card"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-card"
                />
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Quantity</label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleQuantityChange('decrement')}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Minus className="h-4 w-4 text-muted-foreground" />
                </button>
                <span className="text-xl font-semibold text-foreground min-w-[2rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange('increment')}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-4 px-6 rounded-lg hover:from-primary/90 hover:to-primary/70 transition-all duration-200 font-semibold flex items-center justify-center space-x-2 text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Add to Cart</span>
            </button>

            {/* Terms & Conditions */}
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-sm font-medium text-foreground mb-3">Terms & Conditions</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Minimum rental period: 1 day</p>
                <p>• Security deposit required: ₹5,000 (refundable)</p>
                <p>• Late return charges: ₹200 per day</p>
                <p>• Damage/loss charges apply as per assessment</p>
                <p>• Valid ID proof required for rental</p>
                <p>• Equipment must be returned in original condition</p>
                <p>• Cancellation allowed up to 24 hours before rental date</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;