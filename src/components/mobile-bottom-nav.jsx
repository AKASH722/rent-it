import React from 'react';
import { Home, Grid3X3, ShoppingCart, Heart, User } from 'lucide-react';

const MobileBottomNav = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'category', label: 'Category', icon: Grid3X3 },
    { id: 'cart', label: 'Cart', icon: ShoppingCart },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2 z-40">
      <div className="flex items-center justify-around">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              activeTab === id
                ? 'text-primary'
                : 'text-muted-foreground hover:text-primary'
            }`}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
            {id === 'cart' && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNav;