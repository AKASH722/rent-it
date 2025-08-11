"use client";
import { useState } from "react";
import { TopNavigation } from "../components/top-navigation-props";
import { RecordNavigation } from "../components/record-navigation";
import { ActionButtons } from "../components/action-button-navigation";
import { StatusManagement } from "../components/status-management";
import { OrderDetails } from "../components/order-details";
import { TabbedContent } from "../components/tabbed-content";

export function RentalOrderView() {
  const [orderStatus, setOrderStatus] = useState("draft");
  const [rentalState, setRentalState] = useState("rental-order");
  const [orderState, setOrderState] = useState("pending");
  const [activeTab, setActiveTab] = useState("order-lines");
  const [currentRecord, setCurrentRecord] = useState(1);

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

  const handleNavigation = (direction) => {
    if (direction === "prev" && currentRecord > 1) {
      setCurrentRecord(currentRecord - 1);
    } else if (direction === "next" && currentRecord < 20) {
      setCurrentRecord(currentRecord + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <TopNavigation 
        activeTab="rental"
        username="John Smith"
      />

      {/* Record Navigation */}
      <RecordNavigation 
        currentRecord={currentRecord}
        totalRecords={20}
        onPrevious={() => handleNavigation("prev")}
        onNext={() => handleNavigation("next")}
        onDelete={() => console.log("Delete record")}
        onDuplicate={() => console.log("Duplicate record")}
      />

      {/* Action Buttons */}
      <ActionButtons 
        orderStatus={orderStatus}
        onAction={handleAction}
      />

      {/* Status Management */}
      <StatusManagement 
        orderStatus={orderStatus}
        rentalState={rentalState}
        orderState={orderState}
        onStateChange={handleStateChange}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Order Details */}
        <OrderDetails 
          orderNumber="R0001"
          customer="ABC Corporation Ltd."
          invoiceAddress="123 Business Street, Suite 100, New York, NY 10001"
          deliveryAddress="456 Construction Site, Building A, Brooklyn, NY 11201"
          rentalTemplate="Construction Equipment Package"
          expiration="2024-12-31"
          orderDate="2024-01-15"
          projects="Downtown Office Complex Renovation"
          rentalPeriod="Q1 2024 (Jan 15 - Apr 15)"
          rentalDuration="90 days"
        />

        {/* Tabbed Content */}
        <TabbedContent 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  );
}
