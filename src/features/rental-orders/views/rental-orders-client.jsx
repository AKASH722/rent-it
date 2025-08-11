"use client";

import { useState, useMemo } from "react";
import { RentalStatusSidebar } from "../components/rental-status-sidebar";
import { RentalOrdersToolbar } from "../components/rental-orders-toolbar";
import { RentalOrdersGrid } from "../components/rental-orders-grid";
import { RentalOrdersTable } from "../components/rental-orders-table";

const statusColors = {
  quotation: "bg-blue-100 text-blue-800 border-blue-200",
  reserved: "bg-purple-100 text-purple-800 border-purple-200",
  pickup: "bg-orange-100 text-orange-800 border-orange-200",
  returned: "bg-green-100 text-green-800 border-green-200",
};

const invoiceStatusColors = {
  "fully-invoiced": "bg-green-100 text-green-800 border-green-200",
  "nothing-to-invoice": "bg-gray-100 text-gray-800 border-gray-200",
  "to-invoice": "bg-orange-100 text-orange-800 border-orange-200",
};

function getStatusCounts(orders) {
  return {
    all: orders.length,
    quotation: orders.filter((o) => o.rentalStatus === "quotation").length,
    reserved: orders.filter((o) => o.rentalStatus === "reserved").length,
    pickup: orders.filter((o) => o.rentalStatus === "pickup").length,
    returned: orders.filter((o) => o.rentalStatus === "returned").length,
  };
}

function getInvoiceStatusCounts(orders) {
  return {
    "fully-invoiced": orders.filter((o) => o.invoiceStatus === "fully-invoiced")
      .length,
    "nothing-to-invoice": orders.filter(
      (o) => o.invoiceStatus === "nothing-to-invoice"
    ).length,
    "to-invoice": orders.filter((o) => o.invoiceStatus === "to-invoice").length,
  };
}

function sortOrders(orders, field, order) {
  const sorted = [...orders];
  const compare = (a, b) => {
    if (field === "date") return new Date(a.startDate) - new Date(b.startDate);
    if (field === "customer") return a.customer.localeCompare(b.customer);
    if (field === "total") return a.total - b.total;
    return 0;
  };
  sorted.sort(compare);
  if (order === "desc") sorted.reverse();
  return sorted;
}

export function RentalOrdersPage({ orders }) {
  const [viewMode, setViewMode] = useState("grid");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [rentalStatusFilter, setRentalStatusFilter] = useState("all");
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Filtering
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesRentalStatus =
        rentalStatusFilter === "all" ||
        order.rentalStatus === rentalStatusFilter;
      const matchesInvoiceStatus =
        invoiceStatusFilter === "all" ||
        order.invoiceStatus === invoiceStatusFilter;
      const matchesSearch =
        order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRentalStatus && matchesInvoiceStatus && matchesSearch;
    });
  }, [orders, rentalStatusFilter, invoiceStatusFilter, searchQuery]);

  // Sorting
  const sortedOrders = useMemo(() => {
    return sortOrders(filteredOrders, sortField, sortOrder);
  }, [filteredOrders, sortField, sortOrder]);

  // Selection handlers
  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };
  const handleSelectAll = () => {
    setSelectedOrders(
      selectedOrders.length === sortedOrders.length
        ? []
        : sortedOrders.map((order) => order.id)
    );
  };

  // Sorting handler
  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <RentalStatusSidebar
          statusCounts={getStatusCounts(orders)}
          rentalStatusFilter={rentalStatusFilter}
          setRentalStatusFilter={setRentalStatusFilter}
          invoiceStatusCounts={getInvoiceStatusCounts(orders)}
          invoiceStatusFilter={invoiceStatusFilter}
          setInvoiceStatusFilter={setInvoiceStatusFilter}
          collapsed={sidebarCollapsed}
          onCollapse={() => setSidebarCollapsed((c) => !c)}
        />

        <main className="max-w-full flex-1 p-4 md:p-6">
          <RentalOrdersToolbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            viewMode={viewMode}
            setViewMode={setViewMode}
            sortField={sortField}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />

          {viewMode === "grid" ? (
            <RentalOrdersGrid
              filteredOrders={sortedOrders}
              statusColors={statusColors}
              invoiceStatusColors={invoiceStatusColors}
              selectedOrders={selectedOrders}
              onSelectOrder={handleSelectOrder}
              onSelectAll={handleSelectAll}
            />
          ) : (
            <RentalOrdersTable
              filteredOrders={sortedOrders}
              statusColors={statusColors}
              invoiceStatusColors={invoiceStatusColors}
              selectedOrders={selectedOrders}
              onSelectOrder={handleSelectOrder}
              onSelectAll={handleSelectAll}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default RentalOrdersPage;
