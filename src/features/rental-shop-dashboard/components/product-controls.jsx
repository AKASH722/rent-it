import React, { useState } from "react";
import { ChevronDown, Grid3X3, List, Search } from "lucide-react";

const ProductControls = ({
  viewMode,
  onViewModeChange,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
}) => {
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const sortOptions = [
    { label: "Price: Low to High", value: "price-low" },
    { label: "Price: High to Low", value: "price-high" },
    { label: "Name", value: "name" },
  ];

  return (
    <div className="bg-card border-border border-b p-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="mx-8 max-w-md flex-1">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products..."
              className="border-border focus:ring-primary bg-muted focus:bg-card w-full rounded-xl border py-3 pr-4 pl-12 shadow-sm transition-all duration-200 focus:border-transparent focus:ring-2"
            />
          </div>
        </div>

        {/* Sort and View Controls */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="border-border hover:bg-muted flex items-center gap-2 rounded-xl border px-6 py-3 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <span className="text-foreground text-sm font-medium">
                {sortOptions.find((opt) => opt.value === sortBy)?.label ||
                  "Sort by"}
              </span>
              <ChevronDown
                className={`text-muted-foreground h-4 w-4 transition-transform duration-200 ${showSortDropdown ? "rotate-180" : ""}`}
              />
            </button>

            {showSortDropdown && (
              <div className="bg-card border-border animate-in slide-in-from-top-2 absolute top-full right-0 z-50 mt-2 w-48 rounded-xl border py-2 shadow-2xl duration-200">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onSortChange(option.value);
                      setShowSortDropdown(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-sm transition-colors duration-150 ${
                      sortBy === option.value
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-muted border-border flex items-center rounded-xl border p-1 shadow-inner">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`rounded-lg p-3 transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-card text-primary scale-105 transform shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/50"
              }`}
            >
              <Grid3X3 className="h-5 w-5" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`rounded-lg p-3 transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-card text-primary scale-105 transform shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/50"
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductControls;
