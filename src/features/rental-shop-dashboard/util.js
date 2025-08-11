// Cart and Wishlist utility functions without React Context

// Cart state
let cartItems = [];
let cartSubscribers = [];

// Wishlist state
let wishlistItems = [];
let wishlistSubscribers = [];

// Cart utilities
export const cartUtils = {
  // Subscribe to cart changes
  subscribe: (callback) => {
    cartSubscribers.push(callback);
    return () => {
      cartSubscribers = cartSubscribers.filter(sub => sub !== callback);
    };
  },

  // Notify cart subscribers
  notifySubscribers: () => {
    cartSubscribers.forEach(callback => callback());
  },

  // Add item to cart
  addToCart: (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cartItems.push({ ...product, quantity: 1 });
    }
    
    cartUtils.notifySubscribers();
  },

  // Remove item from cart
  removeFromCart: (productId) => {
    cartItems = cartItems.filter(item => item.id !== productId);
    cartUtils.notifySubscribers();
  },

  // Update item quantity
  updateCartQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      cartUtils.removeFromCart(productId);
      return;
    }
    
    const item = cartItems.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
      cartUtils.notifySubscribers();
    }
  },

  // Get cart items
  getCartItems: () => [...cartItems],

  // Get cart item count
  getCartItemCount: () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  },

  // Get cart total
  getCartTotal: () => {
    return cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  },

  // Clear cart
  clearCart: () => {
    cartItems = [];
    cartUtils.notifySubscribers();
  }
};

// Wishlist utilities
export const wishlistUtils = {
  // Subscribe to wishlist changes
  subscribe: (callback) => {
    wishlistSubscribers.push(callback);
    return () => {
      wishlistSubscribers = wishlistSubscribers.filter(sub => sub !== callback);
    };
  },

  // Notify wishlist subscribers
  notifySubscribers: () => {
    wishlistSubscribers.forEach(callback => callback());
  },

  // Toggle item in wishlist
  toggleWishlist: (product) => {
    const existingIndex = wishlistItems.findIndex(item => item.id === product.id);
    
    if (existingIndex !== -1) {
      wishlistItems.splice(existingIndex, 1);
    } else {
      wishlistItems.push({ ...product, quantity: 1 });
    }
    
    wishlistUtils.notifySubscribers();
  },

  // Add item to wishlist
  addToWishlist: (product) => {
    const existingItem = wishlistItems.find(item => item.id === product.id);
    
    if (!existingItem) {
      wishlistItems.push({ ...product, quantity: 1 });
      wishlistUtils.notifySubscribers();
    }
  },

  // Remove item from wishlist
  removeFromWishlist: (productId) => {
    wishlistItems = wishlistItems.filter(item => item.id !== productId);
    wishlistUtils.notifySubscribers();
  },

  // Update wishlist item quantity
  updateWishlistQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      wishlistUtils.removeFromWishlist(productId);
      return;
    }
    
    const item = wishlistItems.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
      wishlistUtils.notifySubscribers();
    }
  },

  // Check if item is in wishlist
  isInWishlist: (productId) => {
    return wishlistItems.some(item => item.id === productId);
  },

  // Get wishlist items
  getWishlistItems: () => [...wishlistItems],

  // Get wishlist item count
  getWishlistItemCount: () => {
    return wishlistItems.length;
  },

  // Clear wishlist
  clearWishlist: () => {
    wishlistItems = [];
    wishlistUtils.notifySubscribers();
  }
};