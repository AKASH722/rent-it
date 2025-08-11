
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Trash2, Copy } from "lucide-react";

export function RecordNavigation({
  currentRecord = 1,
  totalRecords = 20,
  onPrevious,
  onNext,
  onDelete,
  onDuplicate
}) {
  // Wrap handlers to show toast with label
  const handlePrev = () => {
    toast('Prev');
    onPrevious && onPrevious();
  };
  const handleNext = () => {
    toast('Next');
    onNext && onNext();
  };
  const handleDuplicate = () => {
    toast('Duplicate');
    onDuplicate && onDuplicate();
  };
  const handleDelete = () => {
    toast('Delete');
    onDelete && onDelete();
  };
  return (
    <div className="bg-surface border-b px-4 sm:px-6 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Navigation Controls */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={currentRecord === 1}
              className="flex items-center space-x-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Prev</span>
            </Button>

            <span className="text-sm font-medium bg-muted px-3 py-1 rounded-md">
              {currentRecord}/{totalRecords}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentRecord === totalRecords}
              className="flex items-center space-x-1"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDuplicate}
            className="flex items-center space-x-1 text-muted-foreground hover:text-foreground"
          >
            <Copy className="h-4 w-4" />
            <span className="hidden sm:inline">Duplicate</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="flex items-center space-x-1 text-destructive hover:text-destructive-foreground hover:bg-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
