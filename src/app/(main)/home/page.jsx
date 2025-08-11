"use client";

import React, { useState, useMemo } from 'react';
import Header from '@/components/header';
import CategoryBar from '@/features/rental-shop-dashboard/components/category-bar';
import Sidebar from '@/features/rental-shop-dashboard/components/sidebar';
import ProductControls from '@/features/rental-shop-dashboard/components/product-controls';
import ProductGrid from '@/features/rental-shop-dashboard/components/product-grid';
import Pagination from '@/components/pagination';
import MobileBottomNav from '@/components/mobile-bottom-nav';
import { useResponsive } from '@/hooks/useResponsive';

function HomePage() {
  const { isMobile } = useResponsive();
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('category');
  const [sortBy, setSortBy] = useState('featured');
  const [priceList, setPriceList] = useState('regular');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedColors, setSelectedColors] = useState([]);

  // Sample product data
  const [products, setProducts] = useState([
    { id: 1, name: 'Product 1', price: 120, image: '', inWishlist: false, quantity: 1 },
    { id: 2, name: 'Product 2', price: 160, image: '', inWishlist: true, quantity: 1 },
    { id: 3, name: 'Product 3', price: 200, image: '', inWishlist: false, quantity: 1 },
    { id: 4, name: 'Product 4', price: 89, image: '', inWishlist: false, quantity: 1 },
    { id: 5, name: 'Product 5', price: 250, image: '', inWishlist: true, quantity: 1 },
    { id: 6, name: 'Product 6', price: 180, image: '', inWishlist: false, quantity: 1 },
    { id: 7, name: 'Product 7', price: 95, image: '', inWishlist: false, quantity: 1 },
    { id: 8, name: 'Product 8', price: 300, image: '', inWishlist: false, quantity: 1 },
    { id: 9, name: 'Product 9', price: 150, image: '', inWishlist: true, quantity: 1 },
    { id: 10, name: 'Product 10', price: 75, image: '', inWishlist: false, quantity: 1 },
    { id: 11, name: 'Product 11', price: 220, image: '', inWishlist: false, quantity: 1 },
    { id: 12, name: 'Product 12', price: 190, image: '', inWishlist: false, quantity: 1 },
    { id: 13, name: 'Product 13', price: 450, image: '', inWishlist: false, quantity: 1 },
    { id: 14, name: 'Product 14', price: 680, image: '', inWishlist: false, quantity: 1 },
    { id: 15, name: 'Product 15', price: 1200, image: '', inWishlist: false, quantity: 1 },
    { id: 16, name: 'Product 16', price: 1800, image: '', inWishlist: false, quantity: 1 },
    { id: 17, name: 'Product 17', price: 2500, image: '', inWishlist: false, quantity: 1 },
    { id: 18, name: 'Product 18', price: 3200, image: '', inWishlist: false, quantity: 1 },
  ]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply price range filter
    if (selectedPriceRange !== 'all') {
      const [min, max] = selectedPriceRange.split('-').map(Number);
      if (selectedPriceRange === '5000+') {
        filtered = filtered.filter(product => product.price >= 5000);
      } else {
        filtered = filtered.filter(product => product.price >= min && product.price <= max);
      }
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        // Featured - keep original order
        break;
    }

    return filtered;
  }, [products, searchTerm, selectedPriceRange, sortBy]);

  // Pagination
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleAddToCart = (productId) => {
    console.log('Added to cart:', productId);
  };

  const handleToggleWishlist = (productId) => {
    setProducts(prev => prev.map(product =>
      product.id === productId
        ? { ...product, inWishlist: !product.inWishlist }
        : product
    ));
  };

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;
    setProducts(prev => prev.map(product =>
      product.id === productId
        ? { ...product, quantity }
        : product
    ));
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header isMobile={isMobile} showMobileHeader={isMobile} />
      
      {/* Category Bar - Hidden on mobile */}
      {!isMobile && <CategoryBar />}

      <div className="flex">
        {/* Sidebar - Hidden on mobile */}
        {!isMobile && (
          <Sidebar
            selectedPriceRange={selectedPriceRange}
            onPriceRangeChange={setSelectedPriceRange}
            selectedColors={selectedColors}
            onColorChange={setSelectedColors}
          />
        )}

        {/* Main Content */}
        <div className="flex-1">
          {/* Product Controls */}
          {!isMobile && (
            <ProductControls
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortBy={sortBy}
              onSortChange={setSortBy}
              priceList={priceList}
              onPriceListChange={setPriceList}
            />
          )}

          {/* Products */}
          <div className={`p-6 ${isMobile ? 'pb-20' : ''}`}>
            <ProductGrid
              products={paginatedProducts}
              viewMode={viewMode}
              isMobile={isMobile}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              onQuantityChange={isMobile ? handleQuantityChange : undefined}
            />

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <MobileBottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}
    </div>
  );
}

export default HomePage;