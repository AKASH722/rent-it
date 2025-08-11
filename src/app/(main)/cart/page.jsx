"use client";

import React from 'react';
import { useCart } from '@/contexts/cart-context';
import ReviewOrders from '@/features/product-cart/components/review-orders';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  
  return (
    <ReviewOrders 
      cartItems={cartItems}
      onUpdateQuantity={updateQuantity}
      onRemoveProduct={removeFromCart}
    />
  );
}
