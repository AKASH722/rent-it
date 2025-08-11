import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Home, 
  ShoppingCart, 
  Heart, 
  User, 
  ChevronDown, 
  MessageCircle,
  Search,
  Filter,
  ArrowLeft
} from 'lucide-react';
import { cartUtils, wishlistUtils } from '@/features/rental-shop-dashboard/util';

const Header = ({ isMobile, showMobileHeader = false }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [wishlistItemCount, setWishlistItemCount] = useState(0);

  useEffect(() => {
    // Initialize counts
    setCartItemCount(cartUtils.getCartItemCount());
    setWishlistItemCount(wishlistUtils.getWishlistItemCount());

    // Subscribe to changes
    const unsubscribeCart = cartUtils.subscribe(() => {
      setCartItemCount(cartUtils.getCartItemCount());
    });

    const unsubscribeWishlist = wishlistUtils.subscribe(() => {
      setWishlistItemCount(wishlistUtils.getWishlistItemCount());
    });

    // Cleanup subscriptions
    return () => {
      unsubscribeCart();
      unsubscribeWishlist();
    };
  }, []);

  if (showMobileHeader) {
    return (
      <header className="bg-card shadow-sm border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          <h1 className="text-lg font-semibold text-foreground">Rental shop page</h1>
        </div>
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Filter className="w-5 h-5 text-muted-foreground" />
        </div>
      </header>
    );
  }

  return (
    <header className="bg-card shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/home" className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
              <Home className="w-8 h-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-foreground">RentShop</span>
            </Link>
            
            {!isMobile && (
              <nav className="flex space-x-6">
                <Link href="/Home" className="text-primary font-medium hover:text-primary/80 transition-colors">Home</Link>
                {/* <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Rental Shop</a> */}
                <Link href="/wishlist" className="text-muted-foreground hover:text-primary transition-colors">Wishlist</Link>
              </nav>
            )}
          </div>

          {/* Right side - User Profile and Cart */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <Link href="/wishlist" className="relative p-2 text-muted-foreground hover:text-primary transition-colors">
              <Heart className="w-6 h-6" />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistItemCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-muted-foreground hover:text-primary transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Contact Us Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Contact Us</span>
            </button>

            {/* User Profile */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 p-2 rounded-xl hover:bg-muted transition-all duration-200 transform hover:scale-105"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center shadow-md">
                  <User className="w-5 h-5 text-primary-foreground" />
                </div>
                {!isMobile && (
                  <>
                    <span className="text-sm font-medium text-foreground">John Doe</span>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>

              {/* Profile Dropdown */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-card rounded-xl shadow-2xl border border-border py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                  <a href="#" className="block px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors duration-150">
                    My Profile
                  </a>
                  <a href="#" className="block px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors duration-150">
                    Logout
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;