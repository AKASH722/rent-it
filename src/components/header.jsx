"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  Filter,
  Heart,
  Home,
  MessageCircle,
  Search,
  ClipboardList,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { LogoutDialog } from "@/features/auth";

const Header = () => {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  if (isMobile) {
    return (
      <header className="bg-card border-border flex items-center justify-between border-b p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <ArrowLeft className="text-muted-foreground h-5 w-5" />
          <h1 className="text-foreground text-lg font-semibold">
            Rental shop page
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Search className="text-muted-foreground h-5 w-5" />
          <Filter className="text-muted-foreground h-5 w-5" />
        </div>
      </header>
    );
  }

  return (
    <header className="bg-card border-border border-b shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo + Navigation */}
          <div className="flex items-center space-x-8">
            <Link
              href="/dashboard"
              className="flex cursor-pointer items-center transition-opacity hover:opacity-80"
            >
              <Home className="text-primary h-8 w-8" />
              <span className="text-foreground ml-2 text-xl font-bold">
                RentShop
              </span>
            </Link>

            <nav className="flex space-x-6">
              <Link
                href="/dashboard"
                className={`font-medium transition-colors ${
                  isActive("/dashboard")
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                Dashboard
              </Link>

              <Link
                href="/booking"
                className={`flex items-center gap-1 transition-colors ${
                  isActive("/bookings")
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                <ClipboardList className="h-5 w-5" />
                Bookings
              </Link>

              <Link
                href="/wishlist"
                className={`flex items-center gap-1 transition-colors ${
                  isActive("/wishlist")
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                <Heart className="h-5 w-5" />
                Wishlist
              </Link>
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-lg px-4 py-2 transition-colors">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Contact Us</span>
            </button>

            <div className="relative">
              <LogoutDialog />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
