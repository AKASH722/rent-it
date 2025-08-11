"use client"

import { useState, useEffect } from "react"
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, User, Phone, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Header from "@/components/header"
import { cartUtils, wishlistUtils } from "@/features/rental-shop-dashboard/util"
import { useResponsive } from "@/hooks/useResponsive"
import { toast } from 'sonner';

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const { isMobile } = useResponsive();

  useEffect(() => {
    // Initialize wishlist items and cart count
    setWishlistItems(wishlistUtils.getWishlistItems());
    setCartCount(cartUtils.getCartItemCount());

    // Subscribe to changes
    const unsubscribeWishlist = wishlistUtils.subscribe(() => {
      setWishlistItems(wishlistUtils.getWishlistItems());
    });

    const unsubscribeCart = cartUtils.subscribe(() => {
      setCartCount(cartUtils.getCartItemCount());
    });

    // Cleanup subscriptions
    return () => {
      unsubscribeWishlist();
      unsubscribeCart();
    };
  }, []);

  const updateQuantity = (id, change) => {
    wishlistUtils.updateWishlistQuantity(id, Math.max(1, (wishlistItems.find(item => item.id === id)?.quantity || 1) + change));
  }

  const removeItem = (id) => {
    wishlistUtils.removeFromWishlist(id);
    toast.success("Item removed from wishlist!");
  }

  const handleAddToCart = (id) => {
    const item = wishlistItems.find(item => item.id === id);
    if (item) {
      cartUtils.addToCart(item);
      toast.success(`${item.name} added to cart!`);
    }
  }

  const addAllToCart = () => {
    wishlistItems.forEach(item => {
      cartUtils.addToCart(item);
    });
    toast.success(`All ${wishlistItems.length} items added to cart!`);
  }

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 max-w-md mx-auto">
      <div className="w-24 h-24 md:w-32 md:h-32 mb-6 bg-muted rounded-full flex items-center justify-center">
        <Heart className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">Your wishlist is empty</h3>
      <p className="text-muted-foreground mb-8 text-center leading-relaxed">
        Discover amazing products and save your favorites to shop them later. 
        Start exploring and add items to your wishlist!
      </p>
      <Button 
        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
        onClick={() => window.location.href = '/home'}
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        Browse Products
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header Component */}
      <Header isMobile={isMobile} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {wishlistItems.length > 0 ? (
          <>
            {/* Header Section with Title and Add All Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-primary">My Wishlist</h1>
                <p className="text-muted-foreground mt-1">{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist</p>
              </div>
              <Button
                onClick={addAllToCart}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 w-full sm:w-auto"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add All to Cart
              </Button>
            </div>

            {/* Wishlist Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                >
                  {/* Product Image */}
                  <div className="aspect-square mb-4 bg-muted rounded-lg overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-muted-foreground text-sm">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-foreground text-lg leading-tight mb-2">{item.name}</h3>
                      <p className="text-2xl font-bold text-primary">₹{item.price.toLocaleString()}</p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Quantity:</span>
                      <div className="flex items-center border border-border rounded-lg bg-background">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-2 hover:bg-muted h-9 w-9"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="px-3 py-2 text-sm font-medium min-w-[3rem] text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-2 hover:bg-muted h-9 w-9"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-2">
                      <Button
                        onClick={() => handleAddToCart(item.id)}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 rounded-lg transition-all duration-200"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        onClick={() => removeItem(item.id)}
                        variant="outline"
                        className="w-full border-border hover:bg-muted text-muted-foreground hover:text-foreground py-2.5 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <EmptyState />
          </div>
        )}
      </main>
    </div>
  )
}
