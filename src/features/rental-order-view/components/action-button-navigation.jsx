import { Button } from "@/components/ui/button";
import { Plus, Send, Printer, Check, X, FileText, Truck } from "lucide-react";

export function ActionButtons({ orderStatus = "draft", onAction }) {
  const handleAction = (action) => {
    if (onAction) {
      onAction(action);
    }
  };

  return (
    <div className="bg-surface border-b px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Primary Action Buttons */}
          <div className="flex flex-wrap gap-2">

            <Button
              variant="outline"
              onClick={() => handleAction("send")}
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>

            <Button
              variant="outline"
              onClick={() => handleAction("print")}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>

            {orderStatus === "draft" ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleAction("confirm")}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Confirm
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleAction("cancel")}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleAction("invoice")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Invoice
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleAction("delivery")}
                >
                  <Truck className="h-4 w-4 mr-2" />
                  2 Delivery
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
