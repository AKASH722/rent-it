import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const rentalStates = [
  { id: "quote", label: "Quote" },
  { id: "rental-order", label: "Rental Order" },
  { id: "delivery", label: "Delivery" },
  { id: "return", label: "Return" },
];

const orderStates = [
  { id: "pending", label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "delivered", label: "Delivered" }
];

export function StatusManagement({ 
  orderStatus = "draft",
  rentalState = "rental-order",
  orderState = "pending",
  onStateChange 
}) {
  return (
    <div className="bg-surface border-b px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Rental State Management */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Rental State</h3>
          <div className="flex flex-wrap gap-2">
            {rentalStates.map((state, index) => {
              const isActive = state.id === rentalState;
              const isCompleted = rentalStates.findIndex(s => s.id === rentalState) > index;
              
              return (
                <Button
                  key={state.id}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "transition-all duration-base",
                    isActive && "bg-primary text-background border-rental-status shadow-status",
                    isCompleted && "bg-muted text-muted-foreground",
                    !isActive && !isCompleted && "bg-inactive-status text-inactive-status-foreground"
                  )}
                  // onClick={() => onStateChange?.("rental", state.id)}
                >
                  {state.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Order State Management (shown when confirmed) */}
        {/* {orderStatus === "confirmed" && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Order State</h3>
            <div className="flex flex-wrap gap-2">
              {orderStates.map((state, index) => {
                const isActive = state.id === orderState;
                const isCompleted = orderStates.findIndex(s => s.id === orderState) > index;
                
                return (
                  <Button
                    key={state.id}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "transition-all duration-base",
                      isActive && "bg-primary text-background border-confirmed-status",
                      isCompleted && "bg-muted text-muted-foreground",
                      !isActive && !isCompleted && "bg-inactive-status text-inactive-status-foreground"
                    )}
                    onClick={() => onStateChange?.("order", state.id)}
                  >
                    {state.label}
                  </Button>
                );
              })}
            </div>
          </div>
        )} */}

      </div>
    </div>
  );
}
