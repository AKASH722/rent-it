import { Grid2X2, TableProperties } from "lucide-react";
import { RentalOrdersLegend } from "./rental-orders-legend";
import { ToolbarSort } from "./toolbar-sort";
import { ToolbarSearch } from "./toolbar-search";
import { Button } from "@/components/ui/button";

export function RentalOrdersToolbar({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  sortField,
  sortOrder,
  onSortChange,
}) {
  return (
    <>
      <div className="mb-6 flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <h1 className="text-foreground hidden text-xl font-semibold md:block">
            Rental Orders
          </h1>
          <RentalOrdersLegend />
        </div>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:gap-4">
          <ToolbarSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <ToolbarSort
            sortField={sortField}
            sortOrder={sortOrder}
            onSortChange={onSortChange}
          />
        </div>
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
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
  );
}
