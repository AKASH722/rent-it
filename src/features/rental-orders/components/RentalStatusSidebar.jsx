import { useState } from "react"
import { ChevronLeft, ChevronRight, Menu } from "lucide-react"

export function RentalStatusSidebar({
  statusCounts,
  rentalStatusFilter,
  setRentalStatusFilter,
  invoiceStatusCounts,
  invoiceStatusFilter,
  setInvoiceStatusFilter,
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Responsive: show sidebar as overlay on mobile
  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="sm:hidden fixed top-4 left-4 z-40 bg-background border rounded p-2 shadow"
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
        type="button"
      >
        <Menu size={24} />
      </button>
      {/* Sidebar */}
      <div
  className={`
    bg-background border-r flex flex-col
    p-2 sm:p-4
    h-full
    z-50
    ${mobileOpen ? "fixed top-0 left-0 w-64 transition-all duration-300" : "hidden"}
    sm:static
    ${collapsed ? "sm:w-16" : ""}
  `}
  style={{
    maxWidth: collapsed ? 64 : undefined,
    height: "100vh",
  }}
>
        {/* Collapse/close button */}
        <div className="flex justify-end">
          {/* Desktop collapse */}
          <button
            className="mb-4 self-end text-muted-foreground hover:text-primary transition hidden sm:block"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            type="button"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          {/* Mobile close */}
          <button
            className="mb-4 self-end text-muted-foreground hover:text-primary transition sm:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
            type="button"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
        {!collapsed && (
          <div className="space-y-6">
            {/* Rental Status Filter */}
            <div>
              <h3 className="font-medium text-foreground mb-3">RENTAL STATUS</h3>
              <div className="space-y-2">
                {Object.keys(statusCounts).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setRentalStatusFilter(status)
                      setMobileOpen(false)
                    }}
                    className={`flex items-center justify-between w-full text-left px-2 py-1 rounded text-sm transition ${
                      rentalStatusFilter === status
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <span className="font-medium">{status.toUpperCase()}</span>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded">{statusCounts[status]}</span>
                  </button>
                ))}
              </div>
            </div>
            {/* Invoice Status Filter */}
            <div>
              <h3 className="font-medium text-foreground mb-3">INVOICE STATUS</h3>
              <div className="space-y-2">
                {Object.keys(invoiceStatusCounts).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setInvoiceStatusFilter(status)
                      setMobileOpen(false)
                    }}
                    className={`flex items-center justify-between w-full text-left px-2 py-1 rounded text-sm transition ${
                      invoiceStatusFilter === status
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <span>{status.replace("-", " ")}</span>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded">{invoiceStatusCounts[status]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 sm:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}
    </>
  )
}