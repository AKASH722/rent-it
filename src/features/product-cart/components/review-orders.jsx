import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingCart, 
  Heart, 
  Trash2, 
  Plus, 
  Minus, 
  User, 
  Home, 
  Grid3X3, 
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import Header from '@/components/header';
import Breadcrumb from '@/components/breadcrumb';
import { useResponsive } from '@/hooks/useResponsive';

function ReviewOrders({ cartItems = [], onUpdateQuantity, onRemoveProduct }) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const { isMobile } = useResponsive();

  const updateQuantity = (id, change) => {
    const product = cartItems.find(p => p.id === id);
    if (product && onUpdateQuantity) {
      const newQuantity = Math.max(1, product.quantity + change);
      onUpdateQuantity(id, newQuantity);
    }
  };

  const toggleLike = (id) => {
    // For now, we'll keep this as local state since it's not critical for cart functionality
    // In a real app, this might be managed in a separate wishlist context
    console.log('Toggle like for product:', id);
  };

  const removeProduct = (id) => {
    if (onRemoveProduct) {
      onRemoveProduct(id);
    }
  };

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === 'save10') {
      setAppliedCoupon({ code: couponCode, discount: 0.1 });
    } else if (couponCode.toLowerCase() === 'welcome20') {
      setAppliedCoupon({ code: couponCode, discount: 0.2 });
    } else {
      alert('Invalid coupon code');
    }
  };

  const subTotal = cartItems.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  const deliveryCharge = subTotal > 50 ? 0 : 9.99;
  const taxRate = 0.08;
  const taxAmount = subTotal * taxRate;
  const discount = appliedCoupon ? subTotal * appliedCoupon.discount : 0;
  const total = subTotal + deliveryCharge + taxAmount - discount;

  const cartItemCount = cartItems.reduce((sum, product) => sum + product.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header Component */}
      <Header isMobile={isMobile} showMobileHeader={isMobile} />

      {/* Breadcrumb */}
      <Breadcrumb currentStep="cart" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground hidden md:block">Order Overview</h2>
                <p className="text-muted-foreground hidden md:block">Review your selected items</p>
              </div>
              <div className="hidden md:flex items-center space-x-2 bg-muted rounded-full px-4 py-2">
                <ShoppingCart className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{cartItemCount} items</span>
              </div>
            </div>
            
            <div className="space-y-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Your cart is empty</h3>
                  <p className="text-muted-foreground mb-6">Add some products to your cart to get started.</p>
                  <Link href="/home" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors inline-block">
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                cartItems.map((product) => (
                <div key={product.id} className="bg-card rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-all duration-300 group">
                  <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                    <div className="relative">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full md:w-24 h-48 md:h-24 object-cover rounded-xl bg-muted shadow-md group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full md:w-24 h-48 md:h-24 bg-muted rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                          <span className="text-muted-foreground text-sm">No Image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl md:hidden"></div>
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-200">{product.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-2xl font-bold text-primary">₹{product.price.toFixed(2)}</span>
                          <span className="text-sm text-muted-foreground">each</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-center md:justify-start">
                        <div className="flex items-center bg-muted rounded-lg p-1">
                          <button 
                            onClick={() => updateQuantity(product.id, -1)}
                            disabled={product.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center rounded-md bg-background border border-border hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          
                          <div className="mx-3 text-center min-w-[2rem]">
                            <span className="text-sm font-semibold text-foreground">{product.quantity}</span>
                          </div>
                          
                          <button 
                            onClick={() => updateQuantity(product.id, 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-md bg-background border border-border hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          onClick={() => toggleLike(product.id)}
                          className={`p-2 rounded-lg transition-all duration-200 group/btn ${
                            product.isLiked 
                              ? 'bg-red-100 text-red-500 hover:bg-red-200' 
                              : 'bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary'
                          }`}
                        >
                          <Heart 
                            className={`h-4 w-4 group-hover/btn:scale-110 transition-transform duration-200 ${
                              product.isLiked ? 'fill-current' : ''
                            }`} 
                          />
                        </button>
                        <button 
                          onClick={() => removeProduct(product.id)}
                          className="p-2 rounded-lg bg-muted hover:bg-red-100 text-muted-foreground hover:text-red-500 transition-all duration-200 group/btn"
                        >
                          <Trash2 className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-200" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Subtotal for this product */}
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Subtotal</span>
                      <span className="text-lg font-bold text-primary">₹{(product.price * product.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))
              )}
            </div>
          </div>

          {/* Summary Section */}
          <div className="space-y-6">
            {/* Apply Coupon */}
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <h3 className="font-semibold text-foreground mb-4">Apply Coupon</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                />
                <button 
                  onClick={applyCoupon}
                  className="bg-foreground hover:bg-foreground/90 text-background px-6 py-2 rounded-lg transition-colors"
                >
                  Apply
                </button>
              </div>
              {appliedCoupon && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm">
                    Coupon "{appliedCoupon.code}" applied! {(appliedCoupon.discount * 100)}% off
                  </p>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sub Total</span>
                  <span className="font-medium">₹{subTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Charge</span>
                  <span className="font-medium">
                    {deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes</span>
                  <span className="font-medium">₹{taxAmount.toFixed(2)}</span>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between">
                    <span className="text-green-600">Discount</span>
                    <span className="font-medium text-green-600">-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold text-destructive">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <Link href="/cart/delivery" className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-4 px-6 rounded-lg hover:from-primary/90 hover:to-primary/70 transition-all duration-200 font-semibold flex items-center justify-center space-x-2 text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mt-6">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="grid grid-cols-5 h-16">
          {[
            { icon: Home, label: 'Home' },
            { icon: Grid3X3, label: 'Category' },
            { icon: ShoppingCart, label: 'Cart', badge: cartItemCount },
            { icon: Heart, label: 'Wishlist' },
            { icon: User, label: 'Profile' }
          ].map((item, index) => (
            <button key={index} className="flex flex-col items-center justify-center p-2 text-muted-foreground hover:text-foreground transition-colors relative">
              <item.icon className="h-5 w-5 mb-1" />
              {item.badge && (
                <span className="absolute top-1 right-3 bg-destructive text-destructive-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReviewOrders;