import React, { useMemo } from "react";

const CategoryBar = ({
  selectedCategory = "All",
  onCategoryChange,
  products = [],
}) => {
  // Get unique categories from products
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(products.map((product) => product.category)),
    ];
    return ["All", ...uniqueCategories.sort()];
  }, [products]);

  return (
    <div className="bg-muted border-border flex items-center space-x-1 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
      {categories.map((category, index) => (
        <button
          key={index}
          onClick={() => onCategoryChange(category)}
          className={`transform rounded-xl px-6 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 ${
            selectedCategory === category
              ? "from-primary to-primary/80 text-primary-foreground scale-105 bg-gradient-to-r shadow-lg"
              : "text-muted-foreground hover:text-primary hover:bg-card hover:shadow-md"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryBar;
