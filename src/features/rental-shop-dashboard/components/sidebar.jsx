import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const Sidebar = ({ selectedPriceRange, onPriceRangeChange }) => {
  const [showPriceRange, setShowPriceRange] = useState(true);

  const priceRanges = [
    { label: "All Prices", value: "all" },
    { label: "₹0 - ₹500", value: "0-500" },
    { label: "₹500 - ₹1000", value: "500-1000" },
    { label: "₹1000 - ₹2000", value: "1000-2000" },
    { label: "₹2000 - ₹5000", value: "2000-5000" },
    { label: "₹5000+", value: "5000+" },
  ];

  return (
    <div className="bg-card border-border sticky top-0 h-screen w-64 overflow-hidden border-r p-6">
      <h3 className="text-foreground mb-6 text-lg font-semibold">
        Product Attributes
      </h3>

      <div className="flex h-full flex-col overflow-hidden">
        <div className="mb-6 flex-shrink-0">
          <button
            onClick={() => setShowPriceRange(!showPriceRange)}
            className="group mb-3 flex w-full items-center justify-between text-left"
          >
            <h4 className="text-foreground group-hover:text-primary font-medium transition-colors duration-200">
              Price Range
            </h4>
            <div
              className={`transform transition-transform duration-200 ${showPriceRange ? "rotate-180" : ""}`}
            >
              <ChevronDown className="text-muted-foreground group-hover:text-primary h-4 w-4" />
            </div>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showPriceRange ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="space-y-2 pt-1">
              {priceRanges.map((range) => (
                <label
                  key={range.value}
                  className="group flex cursor-pointer items-center"
                >
                  <div className="relative">
                    <input
                      type="radio"
                      name="priceRange"
                      value={range.value}
                      checked={selectedPriceRange === range.value}
                      onChange={() => onPriceRangeChange(range.value)}
                      className="sr-only"
                    />
                    <div
                      className={`h-5 w-5 rounded-full border-2 transition-all duration-200 ${
                        selectedPriceRange === range.value
                          ? "border-primary shadow-md"
                          : "border-border group-hover:border-primary/60"
                      }`}
                    >
                      {selectedPriceRange === range.value && (
                        <div className="bg-primary absolute top-1 left-1 h-2.5 w-2.5 scale-0 transform animate-ping rounded-full"></div>
                      )}
                      {selectedPriceRange === range.value && (
                        <div className="bg-primary absolute top-1 left-1 h-2.5 w-2.5 rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <span className="text-muted-foreground group-hover:text-foreground ml-3 text-sm transition-colors duration-200">
                    {range.label}
                  </span>
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
