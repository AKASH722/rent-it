"use client";
import { useState } from "react";
import { TopNavigation } from "../../../components/top-navigation-props";

import { ActionButtons } from "../components/action-button-navigation";
import { StatusManagement } from "../components/status-management";
import { OrderDetails } from "../components/order-details";
import { TabbedContent } from "../components/tabbed-content";

export function RentalOrderView({ booking }) {

  const [orderStatus, setOrderStatus] = useState(
    booking.status === "QUOTATION" ? "draft" : booking.status.toLowerCase()
  );

  const [rentalState, setRentalState] = useState("rental-order");
  // You didn’t have this in booking, so keep default unless you have a rental state field

  const [orderState, setOrderState] = useState(
    booking.paymentStatus?.toLowerCase() || "pending"
  );

  const [activeTab, setActiveTab] = useState("order-lines");


  const handleAction = (action) => {
    console.log("Action:", action);
    if (action === "confirm") {
      setOrderStatus("confirmed");
      setOrderState("confirmed");
    }
  };

  const handleStateChange = (type, state) => {
    if (type === "rental") {
      setRentalState(state);
    } else {
      setOrderState(state);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <TopNavigation 
        activeTab="rental"
        username="John Smith"
      />

      
      <ActionButtons 
        orderStatus={orderStatus}
        onAction={handleAction}
        bookingId={booking.id}
      />

      <StatusManagement 
        orderStatus={orderStatus}
        rentalState={rentalState}
        orderState={orderState}
        onStateChange={handleStateChange}
      />

  
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <OrderDetails
          orderNumber={booking.id}
          customer={booking.customer.name}
          invoiceAddress={booking.billingAddress}
          deliveryAddress={booking.deliveryAddress}
          rentalTemplate={booking.product.name} // or a template name if you have one
          expiration={booking.endDate.toISOString().split("T")[0]} // or your own format
          orderDate={booking.startDate.toISOString().split("T")[0]}
          projects={booking.product.category?.name || "N/A"} // example mapping
          rentalPeriod={`${booking.startDate.toLocaleDateString()} - ${booking.endDate.toLocaleDateString()}`}
          rentalDuration={`${Math.ceil(
            (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) /
            (1000 * 60 * 60 * 24)
          )} days`}
        />


        {/* Tabbed Content */}
        <TabbedContent 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          booking={booking}
        />
      </div>
    </div>
  );
}
