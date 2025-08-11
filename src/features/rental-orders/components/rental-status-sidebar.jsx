import { useState } from "react";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function RentalStatusSidebar({
  statusCounts,
  rentalStatusFilter,
  setRentalStatusFilter,
  invoiceStatusCounts,
  invoiceStatusFilter,
  setInvoiceStatusFilter,
}) {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <>
      {/* Rental Status Filter */}
      <div>
        <h3 className="text-foreground mb-3 font-medium">RENTAL STATUS</h3>
        <div className="space-y-2">
          {Object.keys(statusCounts).map((status) => (
            <button
              key={status}
              onClick={() => {
                setRentalStatusFilter(status);
                if (isMobile) setMobileOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded px-2 py-1 text-left text-sm transition ${
                rentalStatusFilter === status
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <span className="font-medium">{status.toUpperCase()}</span>
              <span className="bg-muted rounded px-2 py-0.5 text-xs">
                {statusCounts[status]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Invoice Status Filter */}
      <div>
        <h3 className="text-foreground mb-3 font-medium">INVOICE STATUS</h3>
        <div className="space-y-2">
          {Object.keys(invoiceStatusCounts).map((status) => (
            <button
              key={status}
              onClick={() => {
                setInvoiceStatusFilter(status);
                if (isMobile) setMobileOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded px-2 py-1 text-left text-sm transition ${
                invoiceStatusFilter === status
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <span>{status.replace("-", " ")}</span>
              <span className="bg-muted rounded px-2 py-0.5 text-xs">
                {invoiceStatusCounts[status]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile open button */}
      {isMobile && (
        <button
          className="bg-background fixed top-4 left-4 z-40 rounded border p-2 shadow md:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open sidebar"
          type="button"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`bg-background z-50 flex h-full flex-col overflow-hidden border-r transition-[width] duration-300 ease-in-out ${
          isMobile
            ? mobileOpen
              ? "fixed top-0 left-0 w-64 p-4"
              : "hidden"
            : collapsed
              ? "w-16 p-4"
              : "w-64 p-4"
        }`}
        style={{
          maxWidth: collapsed && !isMobile ? 64 : undefined,
          height: "100vh",
          position: isMobile ? "fixed" : "static",
        }}
      >
        {/* Top bar with close/collapse button */}
        <div className="mb-4 flex justify-end">
          {isMobile ? (
            <button
              className="text-muted-foreground hover:text-primary transition"
              onClick={() => setMobileOpen(false)}
              aria-label="Close sidebar"
              type="button"
            >
              <ChevronLeft size={24} />
            </button>
          ) : (
            <button
              className="text-muted-foreground hover:text-primary transition"
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              type="button"
            >
              {collapsed ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </button>
          )}
        </div>

        {/* Content with smooth fade */}
        <div
          className={`space-y-6 transition-opacity duration-200 ${
            collapsed && !isMobile ? "opacity-0" : "opacity-100"
          }`}
        >
          {sidebarContent}
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}
    </>
  );
}
