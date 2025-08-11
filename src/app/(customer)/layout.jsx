import React from "react";
import Header from "@/components/header";
import MobileBottomNav from "@/components/mobile-bottom-nav";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      {children}
      <MobileBottomNav />
    </>
  );
}
