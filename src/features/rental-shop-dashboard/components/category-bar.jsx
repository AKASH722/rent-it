import React, { useMemo } from 'react';

const CategoryBar = ({ selectedCategory = 'All', onCategoryChange, products = [] }) => {
  // Get unique categories from products
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(product => product.category))];
    return ['All', ...uniqueCategories.sort()];
  }, [products]);

  return (
    <div className="bg-muted border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 py-3 overflow-x-auto">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => onCategoryChange(category)}
              className={`px-6 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 transform hover:-translate-y-0.5 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg scale-105'
                  : 'text-muted-foreground hover:text-primary hover:bg-card hover:shadow-md'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;