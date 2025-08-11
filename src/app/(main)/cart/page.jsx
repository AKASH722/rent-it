"use client";

import React, { useState, useEffect } from 'react';
import { cartUtils } from '@/features/rental-shop-dashboard/util';
import ReviewOrders from '@/features/product-cart/components/review-orders';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Initialize cart items
    setCartItems(cartUtils.getCartItems());

    // Subscribe to cart changes
    const unsubscribe = cartUtils.subscribe(() => {
      setCartItems(cartUtils.getCartItems());
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  const handleUpdateQuantity = (productId, quantity) => {
    cartUtils.updateCartQuantity(productId, quantity);
  };

  const handleRemoveFromCart = (productId) => {
    cartUtils.removeFromCart(productId);
  };
  
  return (
    <ReviewOrders 
      cartItems={cartItems}
      onUpdateQuantity={handleUpdateQuantity}
      onRemoveProduct={handleRemoveFromCart}
    />
  );
}
