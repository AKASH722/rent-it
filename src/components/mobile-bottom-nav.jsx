"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Home, LogOut, ShoppingCart } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { LogoutDialog } from "@/features/auth";

const MobileBottomNav = () => {
  const [activeTab, setActiveTab] = useState("category");

  const navItems = [
    { id: "home", label: "Home", icon: Home, href: "/dashboard" },
    { id: "cart", label: "Cart", icon: ShoppingCart, href: "/cart", badge: 3 },
    { id: "wishlist", label: "Wishlist", icon: Heart, href: "/wishlist" },
    { id: "logout", label: "Logout", icon: LogOut, action: "logout" },
  ];

  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="bg-card border-border fixed right-0 bottom-0 left-0 z-40 border-t px-4 py-2">
      <div className="flex items-center justify-around">
        {navItems.map(({ id, label, icon: Icon, href, badge, action }) => {
          const isActive = activeTab === id;

          const buttonContent = (
            <>
              <Icon className="mb-1 h-5 w-5" />
              <span className="text-xs font-medium">{label}</span>
              {badge && (
                <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-xs">
                  {badge}
                </span>
              )}
            </>
          );

          return action === "logout" ? (
            <div key={id} className="relative">
              <LogoutDialog
                trigger={
                  <button
                    onClick={() => setActiveTab(id)}
                    className={`flex flex-col items-center rounded-lg px-3 py-2 transition-colors ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {buttonContent}
                  </button>
                }
              />
            </div>
          ) : (
            <Link
              key={id}
              href={href || "#"}
              onClick={() => setActiveTab(id)}
              className={`relative flex flex-col items-center rounded-lg px-3 py-2 transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {buttonContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
