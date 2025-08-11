"use client";

import React, { useState, useEffect } from 'react';
// import ProductDetailPage from '@/features/rental-shop-dashboard/components/product-details';
// Mock product data - replace with actual API call
const getProductById = (id) => {
  const products = {
    '1': {
      id: '1',
      name: 'Professional Camera Kit',
      price: 1000,
      unitPrice: 500,
      image: '',
      description: 'Professional DSLR camera kit perfect for photography enthusiasts and professionals.',
      longDescription: `This comprehensive package includes a high-resolution camera body, multiple lenses, 
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
    },
    '2': {
      id: '2',
      name: 'Audio Recording Equipment',
      price: 800,
      unitPrice: 400,
      image: '',
      description: 'Professional audio recording equipment for musicians and content creators.',
      longDescription: `Complete audio setup including microphones, audio interface, headphones, 
        and recording accessories. Perfect for podcast recording, music production, 
        and professional audio content creation.`,
      features: [
        'Studio-grade microphones',
        'Audio interface with USB connectivity',
        'Professional monitoring headphones',
        'Acoustic treatment panels'
      ],
      included: [
        'Condenser microphone',
        'Audio interface',
        'Studio headphones',
        'XLR cables',
        'Pop filter',
        'Boom arm',
        'Acoustic panels'
      ]
    }
    // Add more products as needed
  };
  
  return products[id] || null;
};

export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Unwrap params Promise using React.use()
  const unwrappedParams = React.use(params);

  useEffect(() => {
    try {
      // In a real app, you'd make an API call here
      const productData = getProductById(unwrappedParams.id);
      
      if (!productData) {
        setError('Product not found');
      } else {
        setProduct(productData);
      }
    } catch (err) {
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [unwrappedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
          <a 
            href="/home" 
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors inline-block"
          >
            Back to Products
          </a>
        </div>
      </div>
    );
  }

//   return <ProductDetailPage product={product} />;
return null; // Placeholder for the actual ProductDetailPage component
}
