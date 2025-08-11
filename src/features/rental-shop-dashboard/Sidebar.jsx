
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Sidebar = ({
  selectedPriceRange,
  onPriceRangeChange,
  selectedColors,
  onColorChange
}) => {
  const [showColors, setShowColors] = useState(true);
  const [showPriceRange, setShowPriceRange] = useState(true);

  const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Gray'];
  const priceRanges = [
    { label: 'All Prices', value: 'all' },
    { label: '₹0 - ₹500', value: '0-500' },
    { label: '₹500 - ₹1000', value: '500-1000' },
    { label: '₹1000 - ₹2000', value: '1000-2000' },
    { label: '₹2000 - ₹5000', value: '2000-5000' },
    { label: '₹5000+', value: '5000+' }
  ];

  const toggleColor = (color) => {
    const newColors = selectedColors.includes(color) 
      ? selectedColors.filter(c => c !== color)
      : [...selectedColors, color];
    onColorChange(newColors);
  };

  return (
    <div className="w-64 bg-card border-r border-border p-6 h-screen sticky top-0 overflow-hidden">
      <h3 className="text-lg font-semibold text-foreground mb-6">Product Attributes</h3>
      
      <div className="flex flex-col h-full overflow-hidden">
        {/* Colors Filter */}
        <div className="mb-6 flex-shrink-0">
          <button
            onClick={() => setShowColors(!showColors)}
            className="flex items-center justify-between w-full text-left mb-3 group"
          >
            <h4 className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">Colors</h4>
            <div className={`transform transition-transform duration-200 ${showColors ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
            </div>
          </button>
          
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showColors ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="space-y-3 pt-1">
              {colors.map(color => (
                <label key={color} className="flex items-center group cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(color)}
                      onChange={() => toggleColor(color)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-md border-2 transition-all duration-200 ${
                      selectedColors.includes(color)
                        ? 'bg-primary border-primary shadow-md'
                        : 'border-border group-hover:border-primary/60'
                    }`}>
                      {selectedColors.includes(color) && (
                        <svg className="w-3 h-3 text-primary-foreground absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="ml-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200">{color}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="mb-6 flex-shrink-0">
          <button
            onClick={() => setShowPriceRange(!showPriceRange)}
            className="flex items-center justify-between w-full text-left mb-3 group"
          >
            <h4 className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">Price Range</h4>
            <div className={`transform transition-transform duration-200 ${showPriceRange ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
            </div>
          </button>
          
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showPriceRange ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="space-y-2 pt-1">
              {priceRanges.map(range => (
                <label key={range.value} className="flex items-center group cursor-pointer">
                  <div className="relative">
                    <input
                      type="radio"
                      name="priceRange"
                      value={range.value}
                      checked={selectedPriceRange === range.value}
                      onChange={() => onPriceRangeChange(range.value)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                      selectedPriceRange === range.value
                        ? 'border-primary shadow-md'
                        : 'border-border group-hover:border-primary/60'
                    }`}>
                      {selectedPriceRange === range.value && (
                        <div className="w-2.5 h-2.5 bg-primary rounded-full absolute top-1 left-1 transform scale-0 animate-ping"></div>
                      )}
                      {selectedPriceRange === range.value && (
                        <div className="w-2.5 h-2.5 bg-primary rounded-full absolute top-1 left-1"></div>
                      )}
                    </div>
                  </div>
                  <span className="ml-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200">{range.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;