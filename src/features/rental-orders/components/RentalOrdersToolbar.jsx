import { useState } from "react"
import { Grid2X2, TableProperties } from "lucide-react"
import { RentalOrdersLegendPopover } from "./RentalOrdersLegendPopover"
import { ToolbarSort } from "./ToolbarSort"
import { ToolbarSearch } from "./ToolbarSearch"
import { Button } from "@/components/ui/button"

export function RentalOrdersToolbar({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  sortField,
  sortOrder,
  onSortChange,
  onAddOrder,
  selectedOrders,
  onDeleteOrders,
  onDuplicateOrders,
}) {
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6 w-full">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">

          <h1 className="text-xl font-semibold text-foreground hidden md:block">Rental Orders</h1>
          <RentalOrdersLegendPopover />
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <ToolbarSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <ToolbarSort sortField={sortField} sortOrder={sortOrder} onSortChange={onSortChange} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("grid")}
        >
          <Grid2X2 />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("list")}
        >
          <TableProperties />
        </Button>
      </div>
    </>
  )
}