const SORT_FIELDS = [
  { label: "Date", value: "date" },
  { label: "Customer", value: "customer" },
  { label: "Total", value: "total" },
]

export function ToolbarSort({ sortField, sortOrder, onSortChange }) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground">Sort by:</span>
      {SORT_FIELDS.map((field) => (
        <button
          key={field.value}
          className={`flex items-center px-2 py-1 rounded text-sm font-medium transition ${
            sortField === field.value
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted"
          }`}
          onClick={() => onSortChange(field.value)}
          type="button"
        >
          {field.label}
          {sortField === field.value && (
            <span className="ml-1">{sortOrder === "asc" ? "▲" : "▼"}</span>
          )}
        </button>
      ))}
    </div>
  )
}