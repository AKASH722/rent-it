import React, { useState } from 'react';
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

function App() {
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [invoiceAddress, setInvoiceAddress] = useState('');
  const [sameAddress, setSameAddress] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">ShopEase</h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button className="flex items-center text-gray-700 hover:text-red-600 transition-colors">
                <Home className="w-4 h-4 mr-1" />
                Home
              </button>
              <button className="text-gray-700 hover:text-red-600 transition-colors">
                Rental Shop
              </button>
              <button className="flex items-center text-gray-700 hover:text-red-600 transition-colors">
                <Heart className="w-4 h-4 mr-1" />
                Wishlist
              </button>
              <button className="flex items-center text-gray-700 hover:text-red-600 transition-colors relative">
                <ShoppingCart className="w-4 h-4 mr-1" />
                Cart
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
              <button className="flex items-center text-gray-700 hover:text-red-600 transition-colors">
                <User className="w-4 h-4 mr-1" />
                john_doe
              </button>
            </nav>

            {/* Contact Button */}
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              Contact Us
            </button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="relative">
                <ShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm">
          <span className="text-gray-500">Review Order</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-red-600 font-semibold">Delivery</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-500">Payment</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Left Section - Address Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center">
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
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Invoice Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center">
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
                    <div className={`w-10 h-6 rounded-full transition-colors ${sameAddress ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${sameAddress ? 'translate-x-4' : ''}`}></div>
                  </div>
                  <span className="ml-3 text-blue-600 font-medium">
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
                    ? 'border-gray-200 bg-gray-50 text-gray-500' 
                    : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                }`}
              />
            </div>

            {/* Delivery Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center">
                <Truck className="w-5 h-5 mr-2" />
                Choose Delivery Method
              </h2>
              
              <div className="space-y-3">
                {deliveryOptions.map((option) => (
                  <label key={option.value} className="flex items-center cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="delivery"
                      value={option.value}
                      checked={deliveryMethod === option.value}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="text-gray-900 font-medium">{option.label}</div>
                    </div>
                    <div className="text-red-600 font-bold">
                      ₹{option.price}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section - Order Summary */}
          <div className="mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              {/* Order Summary Header */}
              <div className="border-b pb-4 mb-4">
                <h3 className="text-xl font-bold text-blue-600">Order Summary</h3>
                <p className="text-gray-500 text-sm mt-1">2 Items - $4000</p>
              </div>

              {/* Order Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sub Total</span>
                  <span className="text-gray-900">₹{subTotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Charge</span>
                  <span className="text-gray-900">
                    {deliveryCharge > 0 ? `₹${deliveryCharge}` : 'Select method'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes (GST 18%)</span>
                  <span className="text-gray-900">₹{taxes.toLocaleString()}</span>
                </div>

                {couponApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (SAVE200)</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-red-600">₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Coupon Code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-green-600 text-sm mt-2">Coupon applied successfully!</p>
                )}
                {!couponApplied && (
                  <p className="text-gray-500 text-xs mt-1">Try "SAVE200" for ₹200 off</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-pink-500 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-pink-600 transition-colors transform hover:scale-[1.02] active:scale-[0.98]">
                  Confirm Order
                </button>
                
                <button className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors">
                  Back to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;