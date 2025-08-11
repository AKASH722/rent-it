const WISHLIST_KEY = "wishlistItems";

// Load wishlist from localStorage
const loadWishlist = () => {
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save wishlist to localStorage
const saveWishlist = (items) => {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  } catch {}
};

export const wishlistUtils = {
  // Add an item
  add: (product) => {
    const wishlist = loadWishlist();
    const exists = wishlist.some((item) => item.id === product.id);
    if (!exists) {
      wishlist.push(product);
      saveWishlist(wishlist);
    }
  },

  // Remove an item
  remove: (productId) => {
    const wishlist = loadWishlist().filter((item) => item.id !== productId);
    saveWishlist(wishlist);
  },

  // Get all items
  getAll: () => {
    return loadWishlist();
  },

  // Check if item exists
  has: (productId) => {
    return loadWishlist().some((item) => item.id === productId);
  },

  // Clear wishlist
  clear: () => {
    saveWishlist([]);
  },
};
