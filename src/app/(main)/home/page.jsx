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
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Sample product data with categories
  const [products, setProducts] = useState([
    { id: 1, name: 'Laptop Pro 15"', price: 1200, image: '', inWishlist: false, quantity: 1, category: 'Electronics' },
    { id: 2, name: 'Gaming Chair', price: 160, image: '', inWishlist: true, quantity: 1, category: 'Furniture' },
    { id: 3, name: 'Wireless Headphones', price: 200, image: '', inWishlist: false, quantity: 1, category: 'Electronics' },
    { id: 4, name: 'Coffee Table', price: 89, image: '', inWishlist: false, quantity: 1, category: 'Furniture' },
    { id: 5, name: 'Smart Watch', price: 250, image: '', inWishlist: true, quantity: 1, category: 'Electronics' },
    { id: 6, name: 'Bookshelf', price: 180, image: '', inWishlist: false, quantity: 1, category: 'Furniture' },
    { id: 7, name: 'Bluetooth Speaker', price: 95, image: '', inWishlist: false, quantity: 1, category: 'Electronics' },
    { id: 8, name: 'Office Desk', price: 300, image: '', inWishlist: false, quantity: 1, category: 'Furniture' },
    { id: 9, name: 'Running Shoes', price: 150, image: '', inWishlist: true, quantity: 1, category: 'Sports' },
    { id: 10, name: 'Tennis Racket', price: 75, image: '', inWishlist: false, quantity: 1, category: 'Sports' },
    { id: 11, name: 'Backpack', price: 220, image: '', inWishlist: false, quantity: 1, category: 'Travel' },
    { id: 12, name: 'Luggage Set', price: 190, image: '', inWishlist: false, quantity: 1, category: 'Travel' },
    { id: 13, name: 'Digital Camera', price: 450, image: '', inWishlist: false, quantity: 1, category: 'Electronics' },
    { id: 14, name: 'Sofa Set', price: 680, image: '', inWishlist: false, quantity: 1, category: 'Furniture' },
    { id: 15, name: 'Mountain Bike', price: 1200, image: '', inWishlist: false, quantity: 1, category: 'Sports' },
    { id: 16, name: 'Travel Bag', price: 1800, image: '', inWishlist: false, quantity: 1, category: 'Travel' },
    { id: 17, name: 'Yoga Mat', price: 2500, image: '', inWishlist: false, quantity: 1, category: 'Sports' },
    { id: 18, name: 'Camping Tent', price: 3200, image: '', inWishlist: false, quantity: 1, category: 'Travel' },
  ]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

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
  }, [products, searchTerm, selectedPriceRange, sortBy, selectedCategory]);

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
      {!isMobile && (
        <CategoryBar 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          products={products}
        />
      )}

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