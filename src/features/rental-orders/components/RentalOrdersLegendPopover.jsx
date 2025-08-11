import { useState } from "react";

export function RentalOrdersLegendPopover() {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        type="button"
        aria-label="Show legend"
        className="text-muted-foreground hover:text-primary ml-2"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
      >
        <span className="border-muted bg-background flex h-5 w-5 items-center justify-center rounded-full border text-xs font-bold">
          i
        </span>
      </button>
      {show && (
        <div className="bg-background absolute left-1/2 z-20 mt-2 w-96 -translate-x-1/2 rounded-lg border p-4 text-sm shadow-lg">
          <div className="mb-3">
            <h3 className="text-foreground mb-2 font-medium">
              Rental Status Legend
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="bg-primary h-3 w-3 rounded"></div>
                <span>Order being quoted</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-secondary h-3 w-3 rounded"></div>
                <span>Order is on hold</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-warning h-3 w-3 rounded"></div>
                <span>Order confirmed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-success h-3 w-3 rounded"></div>
                <span>Order Rental Pickup is done</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-danger h-3 w-3 rounded"></div>
                <span>Order rental Pickup is Returned</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-foreground mb-2 font-medium">
              Invoice Status on Rental Order Level
            </h3>
            <div className="space-y-2">
              <div>
                <strong>Nothing to Invoice:</strong> When order just created,
                and rental order is not confirmed
              </div>
              <div>
                <strong>To Invoice:</strong> When order is confirmed but not
                create invoice
              </div>
              <div>
                <strong>Fully Invoiced:</strong> Invoice has been created for
                this rental order
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
