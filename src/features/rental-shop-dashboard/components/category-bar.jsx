import React, { useState } from 'react';

const CategoryBar = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  
  const categories = [
    'Category 1',
    'Category 2', 
    'Category 3',
    'Category 4',
    'Category 5'
  ];

  return (
    <div className="bg-muted border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 py-3 overflow-x-auto">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(index)}
              className={`px-6 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 transform hover:-translate-y-0.5 ${
                activeCategory === index
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