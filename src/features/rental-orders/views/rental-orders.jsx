"use client"

import { useState } from "react"
import { RentalStatusSidebar } from "../components/RentalStatusSidebar"
import { RentalOrdersToolbar } from "../components/RentalOrdersToolbar"
import { RentalOrdersGrid } from "../components/RentalOrdersGrid"
import { RentalOrdersTable } from "../components/RentalOrdersTable"

const mockOrders = [
  {
    id: "R0001",
    customer: "Customer 1",
    createdBy: "Adam",
    rentalStatus: "quotation",
    invoiceStatus: "nothing-to-invoice",
    total: 2000,
    startDate: "2024-01-15",
    endDate: "2024-01-20",
  },
  {
    id: "R0002",
    customer: "Customer 2",
    createdBy: "Adam",
    rentalStatus: "reserved",
    invoiceStatus: "to-invoice",
    total: 1500,
    startDate: "2024-01-16",
    endDate: "2024-01-21",
  },
  {
    id: "R0003",
    customer: "Customer 3",
    createdBy: "Adam",
    rentalStatus: "pickup",
    invoiceStatus: "fully-invoiced",
    total: 3000,
    startDate: "2024-01-17",
    endDate: "2024-01-22",
  },
  {
    id: "R0004",
    customer: "Customer 4",
    createdBy: "Adam",
    rentalStatus: "returned",
    invoiceStatus: "fully-invoiced",
    total: 2500,
    startDate: "2024-01-18",
    endDate: "2024-01-23",
  },
  {
    id: "R0005",
    customer: "Customer 5",
    createdBy: "Adam",
    rentalStatus: "quotation",
    invoiceStatus: "nothing-to-invoice",
    total: 1800,
    startDate: "2024-01-19",
    endDate: "2024-01-24",
  },
  {
    id: "R0006",
    customer: "Customer 6",
    createdBy: "Adam",
    rentalStatus: "reserved",
    invoiceStatus: "to-invoice",
    total: 2200,
    startDate: "2024-01-20",
    endDate: "2024-01-25",
  },
]

const statusColors = {
  quotation: "bg-blue-100 text-blue-800 border-blue-200",
  reserved: "bg-purple-100 text-purple-800 border-purple-200",
  pickup: "bg-orange-100 text-orange-800 border-orange-200",
  returned: "bg-green-100 text-green-800 border-green-200",
}

const invoiceStatusColors = {
  "fully-invoiced": "bg-green-100 text-green-800 border-green-200",
  "nothing-to-invoice": "bg-gray-100 text-gray-800 border-gray-200",
  "to-invoice": "bg-orange-100 text-orange-800 border-orange-200",
}

function getStatusCounts(orders) {
  return {
    all: orders.length,
    quotation: orders.filter((o) => o.rentalStatus === "quotation").length,
    reserved: orders.filter((o) => o.rentalStatus === "reserved").length,
    pickup: orders.filter((o) => o.rentalStatus === "pickup").length,
    returned: orders.filter((o) => o.rentalStatus === "returned").length,
  }
}

function getInvoiceStatusCounts(orders) {
  return {
    "fully-invoiced": orders.filter((o) => o.invoiceStatus === "fully-invoiced").length,
    "nothing-to-invoice": orders.filter((o) => o.invoiceStatus === "nothing-to-invoice").length,
    "to-invoice": orders.filter((o) => o.invoiceStatus === "to-invoice").length,
  }
}



function sortOrders(orders, field, order) {
  const sorted = [...orders].sort((a, b) => {
    if (field === "date") {
      return order === "asc"
        ? new Date(a.startDate) - new Date(b.startDate)
        : new Date(b.startDate) - new Date(a.startDate)
    }
    if (field === "customer") {
      return order === "asc"
        ? a.customer.localeCompare(b.customer)
        : b.customer.localeCompare(a.customer)
    }
    if (field === "total") {
      return order === "asc" ? a.total - b.total : b.total - a.total
    }
    return 0
  })
  return sorted
}


export function RentalOrdersPage() {
  const [viewMode, setViewMode] = useState("grid")
  const [selectedOrders, setSelectedOrders] = useState([])
  const [rentalStatusFilter, setRentalStatusFilter] = useState("all")
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState("date")
  const [sortOrder, setSortOrder] = useState("asc")
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const filteredOrders = mockOrders.filter((order) => {
    const matchesRentalStatus = rentalStatusFilter === "all" || order.rentalStatus === rentalStatusFilter
    const matchesInvoiceStatus = invoiceStatusFilter === "all" || order.invoiceStatus === invoiceStatusFilter
    const matchesSearch =
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesRentalStatus && matchesInvoiceStatus && matchesSearch
  })

  const sortedOrders = sortOrders(filteredOrders, sortField, sortOrder)

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]))
  }
  const handleSelectAll = () => {
    setSelectedOrders(selectedOrders.length === sortedOrders.length ? [] : sortedOrders.map((order) => order.id))
  }

  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const statusCounts = getStatusCounts(mockOrders)
  const invoiceStatusCounts = getInvoiceStatusCounts(mockOrders)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex ">
        {/* Sidebar: only visible on desktop, overlays on mobile */}
        <RentalStatusSidebar
          statusCounts={statusCounts}
          rentalStatusFilter={rentalStatusFilter}
          setRentalStatusFilter={setRentalStatusFilter}
          invoiceStatusCounts={invoiceStatusCounts}
          invoiceStatusFilter={invoiceStatusFilter}
          setInvoiceStatusFilter={setInvoiceStatusFilter}
          collapsed={sidebarCollapsed}
          onCollapse={() => setSidebarCollapsed((c) => !c)}
        />
        {/* Main content */}
        <main className="flex-1 max-w-full p-4 md:p-6 ">
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
            />
          ) : (
            <RentalOrdersTable
              filteredOrders={sortedOrders}
              statusColors={statusColors}
              invoiceStatusColors={invoiceStatusColors}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default RentalOrdersPage