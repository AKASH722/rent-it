import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Home, 
  Heart, 
  ShoppingCart, 
  User, 
  Phone, 
  ChevronRight,
  MapPin,
  Truck,
  CreditCard
} from 'lucide-react';
import Header from '@/components/header';
import { useResponsive } from '@/hooks/useResponsive';

function Delivery() {
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [invoiceAddress, setInvoiceAddress] = useState('');
  const [sameAddress, setSameAddress] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const { isMobile } = useResponsive();

  const deliveryOptions = [
    { value: 'standard', label: 'Standard Delivery (3-5 days)', price: 99 },
    { value: 'express', label: 'Express Delivery (1-2 days)', price: 199 },
    { value: 'premium', label: 'Premium Delivery (Same day)', price: 299 }
  ];

  const selectedDeliveryOption = deliveryOptions.find(option => option.value === deliveryMethod);
  const deliveryCharge = selectedDeliveryOption ? selectedDeliveryOption.price : 0;
  const subTotal = 4000;
  const taxes = Math.round(subTotal * 0.18); // 18% GST
  const discount = couponApplied ? 200 : 0;
  const total = subTotal + deliveryCharge + taxes - discount;

  const handleToggleAddress = () => {
    setSameAddress(!sameAddress);
    if (!sameAddress) {
      setInvoiceAddress(deliveryAddress);
    } else {
      setInvoiceAddress('');
    }
  };

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'save200') {
      setCouponApplied(true);
      setCouponCode('');
    }
  };

  const cartItemCount = 2;

  return (
    <div className="min-h-screen bg-background">
      {/* Header Component */}
      <Header isMobile={isMobile} showMobileHeader={isMobile} />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <a href="/cart" className="hover:text-primary transition-colors">Review Order</a>
          <ChevronRight className="w-4 h-4" />
          <span className="text-destructive font-semibold">Delivery</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-muted-foreground">Payment</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Left Section - Address Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Delivery Address
              </h2>
              <textarea
                value={deliveryAddress}
                onChange={(e) => {
                  setDeliveryAddress(e.target.value);
                  if (sameAddress) {
                    setInvoiceAddress(e.target.value);
                  }
                }}
                placeholder="Enter your delivery address..."
                rows={4}
                className="w-full border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none bg-background text-foreground"
              />
            </div>

            {/* Invoice Address */}
            <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Invoice Address
              </h2>
              
              {/* Toggle Switch */}
              <div className="mb-4">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={sameAddress}
                      onChange={handleToggleAddress}
                      className="sr-only"
                    />
                    <div className={`w-10 h-6 rounded-full transition-colors ${sameAddress ? 'bg-primary' : 'bg-muted'}`}></div>
                    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-background transition-transform ${sameAddress ? 'translate-x-4' : ''}`}></div>
                  </div>
                  <span className="ml-3 text-primary font-medium">
                    Billing address same as delivery address
                  </span>
                </label>
              </div>

              <textarea
                value={invoiceAddress}
                onChange={(e) => setInvoiceAddress(e.target.value)}
                disabled={sameAddress}
                placeholder="Enter your billing address..."
                rows={4}
                className={`w-full border rounded-lg px-4 py-3 transition-all resize-none ${
                  sameAddress 
                    ? 'border-border bg-muted text-muted-foreground' 
                    : 'border-border focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground'
                }`}
              />
            </div>

            {/* Delivery Method */}
            <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center">
                <Truck className="w-5 h-5 mr-2" />
                Choose Delivery Method
              </h2>
              
              <div className="space-y-3">
                {deliveryOptions.map((option) => (
                  <label key={option.value} className="flex items-center cursor-pointer p-3 border border-border rounded-lg hover:bg-muted transition-colors">
                    <input
                      type="radio"
                      name="delivery"
                      value={option.value}
                      checked={deliveryMethod === option.value}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <div className="ml-3 flex-1">
                      <div className="text-foreground font-medium">{option.label}</div>
                    </div>
                    <div className="text-primary font-bold">
                      ₹{option.price}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section - Order Summary */}
          <div className="mt-8 lg:mt-0">
            <div className="bg-card rounded-lg shadow-sm p-6 sticky top-4 border border-border">
              {/* Order Summary Header */}
              <div className="border-b border-border pb-4 mb-4">
                <h3 className="text-xl font-bold text-primary">Order Summary</h3>
                <p className="text-muted-foreground text-sm mt-1">2 Items - ₹4000</p>
              </div>

              {/* Order Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sub Total</span>
                  <span className="text-foreground">₹{subTotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Charge</span>
                  <span className="text-foreground">
                    {deliveryCharge > 0 ? `₹${deliveryCharge}` : 'Select method'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes (GST 18%)</span>
                  <span className="text-foreground">₹{taxes.toLocaleString()}</span>
                </div>

                {couponApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (SAVE200)</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-foreground">Total</span>
                    <span className="text-lg font-bold text-destructive">₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-3 px-6 rounded-lg font-semibold text-lg hover:from-primary/90 hover:to-primary/70 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">
                  Confirm Order
                </button>
                
                <Link href="/cart">
                  <button className="w-full border-2 border-border text-muted-foreground py-3 px-6 rounded-lg font-medium hover:border-primary hover:bg-muted transition-colors">
                    Back to Cart
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Delivery;