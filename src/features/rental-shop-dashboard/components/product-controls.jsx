import React, { useState } from 'react';
import { Search, Grid3X3, List, ChevronDown } from 'lucide-react';

const ProductControls = ({
  viewMode,
  onViewModeChange,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  priceList,
  onPriceListChange
}) => {
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showPriceListDropdown, setShowPriceListDropdown] = useState(false);

  const sortOptions = [
    { label: 'Featured', value: 'featured' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Name: A to Z', value: 'name-asc' },
    { label: 'Name: Z to A', value: 'name-desc' },
    { label: 'Newest First', value: 'newest' }
  ];

  const priceListOptions = [
    { label: 'Regular Prices', value: 'regular' },
    { label: 'Member Prices', value: 'member' },
    { label: 'Bulk Prices', value: 'bulk' },
    { label: 'Seasonal Prices', value: 'seasonal' }
  ];

  return (
    <div className="bg-card border-b border-border p-4">
      <div className="flex items-center justify-between">
        {/* Price List Dropdown
        <div className="flex items-center relative">
          <button 
            onClick={() => setShowPriceListDropdown(!showPriceListDropdown)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-xl hover:from-primary/90 hover:to-primary/80 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span className="text-sm font-medium">{priceListOptions.find(opt => opt.value === priceList)?.label || 'Price List'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showPriceListDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showPriceListDropdown && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-card rounded-xl shadow-2xl border border-border py-2 z-50 animate-in slide-in-from-top-2 duration-200">
              {priceListOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    onPriceListChange(option.value);
                    setShowPriceListDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors duration-150 ${
                    priceList === option.value
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div> */}

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-muted focus:bg-card shadow-sm"
            />
          </div>
        </div>

        {/* Sort and View Controls */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-6 py-3 border border-border rounded-xl hover:bg-muted transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <span className="text-sm font-medium text-foreground">{sortOptions.find(opt => opt.value === sortBy)?.label || 'Sort by'}</span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${showSortDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showSortDropdown && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-card rounded-xl shadow-2xl border border-border py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                {sortOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onSortChange(option.value);
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors duration-150 ${
                      sortBy === option.value
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-muted rounded-xl p-1 shadow-inner border border-border">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-3 rounded-lg transition-all duration-200 ${
                viewMode === 'grid' 
                  ? 'bg-card text-primary shadow-md transform scale-105' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-3 rounded-lg transition-all duration-200 ${
                viewMode === 'list' 
                  ? 'bg-card text-primary shadow-md transform scale-105' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductControls;