"use client";
import { useState } from "react";
import { TopNavigation } from "../../../components/top-navigation-props";
import { ActionButtons } from "../components/action-button-navigation";
import { StatusManagement } from "../components/status-management";
import { OrderDetails } from "../components/order-details";
import { TabbedContent } from "../components/tabbed-content";
import { DeliveryDetails } from "../components/delivery-details";
import { ReturnDetails } from "../components/return-details";
import { PickupModal } from "../components/pickup-modal";

export function RentalOrderView({ booking }) {
  const [orderStatus, setOrderStatus] = useState(
    booking.status === "QUOTATION" ? "draft" : booking.status.toLowerCase()
  );

  const getRentalState = (status) => {
    switch (status) {
      case "QUOTATION":
        return "quote";
      case "QUOTATION_SENT":
        return "rental-order";
      case "QUOTATION_REJECT":
        return "quote";
      case "RESERVED":
        return "rental-order";
      case "PICKEDUP":
        return "delivery";
      case "RETURNED":
        return "return";
      default:
        return "rental-order";
    }
  };

  const [rentalState, setRentalState] = useState(getRentalState(booking.status));
  const [orderState, setOrderState] = useState(
    booking.paymentStatus?.toLowerCase() || "pending"
  );
  const [activeTab, setActiveTab] = useState("order-lines");

  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);

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

  const handlePickupSubmit = (data) => {
    console.log("Pickup form submitted:", data);
    setIsPickupModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation activeTab="rental" username="John Smith" />

      <ActionButtons
        orderStatus={orderStatus}
        onAction={handleAction}
        bookingId={booking.id}
      />

      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StatusManagement
          orderStatus={orderStatus}
          rentalState={rentalState}
          orderState={orderState}
          onStateChange={handleStateChange}
        />

        {/* ✅ Picker Button - opens modal when clicked */}
        {booking.status === "RESERVED" && (
          <button
            onClick={() => setIsPickupModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent 
                       text-sm font-medium rounded-md shadow-sm text-white 
                       bg-green-600 hover:bg-green-700 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Picker
          </button>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {rentalState === "delivery" ? (
          <DeliveryDetails booking={booking} />
        ) : rentalState === "return" ? (
          <ReturnDetails booking={booking} />
        ) : (
          <OrderDetails
            orderNumber={booking.id}
            customer={booking.customer.name}
            invoiceAddress={booking.billingAddress}
            deliveryAddress={booking.deliveryAddress}
            rentalTemplate={booking.product.name}
            expiration={booking.endDate.toISOString().split("T")[0]}
            orderDate={booking.startDate.toISOString().split("T")[0]}
            projects={booking.product.category?.name || "N/A"}
            rentalPeriod={`${booking.startDate.toLocaleDateString()} - ${booking.endDate.toLocaleDateString()}`}
            rentalDuration={`${Math.ceil(
              (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) /
              (1000 * 60 * 60 * 24)
            )} days`}
          />
        )}

        <TabbedContent
          activeTab={activeTab}
          onTabChange={setActiveTab}
          booking={booking}
        />

        <PickupModal
          pickUpAddress={booking.customer.deliveryAddress}
          isOpen={isPickupModalOpen}
          onClose={() => setIsPickupModalOpen(false)}
          booking={booking}
          onSubmit={handlePickupSubmit}
        />
      </div>
    </div>
  );
}
