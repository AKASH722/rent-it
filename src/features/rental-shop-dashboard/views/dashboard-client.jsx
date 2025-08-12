"use client";

import React, { useEffect, useMemo, useState } from "react";
import CategoryBar from "@/features/rental-shop-dashboard/components/category-bar";
import Sidebar from "@/features/rental-shop-dashboard/components/sidebar";
import ProductControls from "@/features/rental-shop-dashboard/components/product-controls";
import ProductGrid from "@/features/rental-shop-dashboard/components/product-grid";
import Pagination from "@/components/pagination";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { wishlistUtils } from "@/features/wishlist/util";
import { useRouter } from "next/navigation";

export function DashboardClient({ products, totalProducts, page }) {
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(page);
  const [sortBy, setSortBy] = useState("featured");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [wishlist, setWishlist] = useState([]);
  const router = useRouter();
  useEffect(() => {
    setWishlist(wishlistUtils.getAll());
  }, []);

  useEffect(() => {
    router.replace(`?page=${currentPage}`);
  }, [currentPage]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(
        (product) =>
          selectedCategory === "All" || product.category === selectedCategory
      )
      .filter((product) => {
        const price = product.price || 0;
        if (selectedPriceRange === "all") return true;
        if (selectedPriceRange === "0-500") return price < 500;
        if (selectedPriceRange === "500-1000")
          return price >= 500 && price < 1000;
        if (selectedPriceRange === "1000-2000")
          return price >= 1000 && price < 2000;
        if (selectedPriceRange === "2000-5000")
          return price >= 2000 && price < 5000;
        if (selectedPriceRange === "5000+") return price > 5000;
        return true;
      })
      .map((product) => ({
        ...product,
        inWishlist: wishlist.some((w) => w.id === product.id),
      }))
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedPriceRange,
    sortBy,
    wishlist,
  ]);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const paginatedProducts = filteredProducts;

  const handleToggleWishlist = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      const wasInWishlist = wishlistUtils.has(productId);
      if (wasInWishlist) {
        wishlistUtils.remove(product.id);
      } else {
        wishlistUtils.add(product);
      }
      setWishlist(wishlistUtils.getAll());
      toast.success(
        wasInWishlist
          ? `${product.name} removed from wishlist!`
          : `${product.name} added to wishlist!`
      );
    }
  };

  return (
    <div className="h-full">
      {!isMobile && (
        <CategoryBar
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          products={products}
        />
      )}

      <div className="flex">
        {!isMobile && (
          <Sidebar
            selectedPriceRange={selectedPriceRange}
            onPriceRangeChange={setSelectedPriceRange}
          />
        )}

        <div className="flex-1">
          {!isMobile && (
            <ProductControls
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          )}

          <div className={`p-6 ${isMobile ? "pb-20" : ""}`}>
            <ProductGrid
              products={paginatedProducts}
              viewMode={viewMode}
              isMobile={isMobile}
              onToggleWishlist={handleToggleWishlist}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
