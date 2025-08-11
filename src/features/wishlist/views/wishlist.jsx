"use client";

import { useEffect, useState } from "react";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { wishlistUtils } from "@/features/wishlist/util";
import Link from "next/link";

export function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    setWishlistItems(wishlistUtils.getAll());
  }, []);

  const removeItem = (id) => {
    wishlistUtils.remove(id);
    setWishlistItems(wishlistUtils.getAll());
    toast.success("Item removed from wishlist!");
  };

  const EmptyState = () => (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-12">
      <div className="bg-muted mb-6 flex h-24 w-24 items-center justify-center rounded-full md:h-32 md:w-32">
        <Heart className="text-muted-foreground h-10 w-10 md:h-12 md:w-12" />
      </div>
      <h3 className="text-foreground mb-3 text-xl font-bold md:text-2xl">
        Your wishlist is empty
      </h3>
      <p className="text-muted-foreground mb-8 text-center leading-relaxed">
        Discover amazing products and save your favorites to shop them later.
        Start exploring and add items to your wishlist!
      </p>
      <Button
        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-8 py-3 font-medium shadow-sm transition-all duration-200 hover:shadow-md"
        onClick={() => (window.location.href = "/dashboard")}
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        Browse Products
      </Button>
    </div>
  );

  return (
    <div className="h-full">
      {/* Header Component */}
      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {wishlistItems.length > 0 ? (
          <>
            {/* Header Section with Title and Add All Button */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-primary text-2xl font-bold md:text-3xl">
                  My Wishlist
                </h1>
                <p className="text-muted-foreground mt-1">
                  {wishlistItems.length} item
                  {wishlistItems.length !== 1 ? "s" : ""} in your wishlist
                </p>
              </div>
            </div>

            {/* Wishlist Items */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-card border-border rounded-xl border p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  {/* Product Image */}
                  <div className="bg-muted mb-4 aspect-square overflow-hidden rounded-lg">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={200}
                        height={200}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="text-muted-foreground text-sm">
                          No Image
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-foreground mb-2 text-lg leading-tight font-bold">
                        {item.name}
                      </h3>
                      <p className="text-primary text-2xl font-bold">
                        ₹{item.price}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-2">
                      <Button
                        asChild
                        className="bg-primary hover:bg-primary/90 text-primary-foreground w-full rounded-lg py-2.5 font-medium transition-all duration-200"
                      >
                        <Link href={`/product/${item.slug}`}>View</Link>
                      </Button>
                      <Button
                        onClick={() => removeItem(item.id)}
                        variant="outline"
                        className="border-border hover:bg-muted text-muted-foreground hover:text-foreground w-full rounded-lg py-2.5 transition-all duration-200"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="py-16 text-center">
            <EmptyState />
          </div>
        )}
      </main>
    </div>
  );
}
