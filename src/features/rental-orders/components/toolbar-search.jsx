import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function ToolbarSearch({ searchQuery, setSearchQuery }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder="Search orders..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 w-80"
      />
    </div>
  )
}