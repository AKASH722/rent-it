import { useState } from "react"

export function RentalOrdersLegendPopover() {
  const [show, setShow] = useState(false)
  return (
    <div className="relative inline-block">
      <button
        type="button"
        aria-label="Show legend"
        className="ml-2 text-muted-foreground hover:text-primary"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
      >
        <span className="inline-block w-5 h-5 rounded-full border border-muted bg-background flex items-center justify-center text-xs font-bold">i</span>
      </button>
      {show && (
        <div className="absolute left-1/2 z-20 mt-2 w-96 -translate-x-1/2 rounded-lg border bg-background p-4 shadow-lg text-sm">
          <div className="mb-3">
            <h3 className="font-medium text-foreground mb-2">Rental Status Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded"></div>
                <span>Order being quoted</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-secondary rounded"></div>
                <span>Order is on hold</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-warning rounded"></div>
                <span>Order confirmed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded"></div>
                <span>Order Rental Pickup is done</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-danger rounded"></div>
                <span>Order rental Pickup is Returned</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-2">Invoice Status on Rental Order Level</h3>
            <div className="space-y-2">
              <div>
                <strong>Nothing to Invoice:</strong> When order just created, and rental order is not confirmed
              </div>
              <div>
                <strong>To Invoice:</strong> When order is confirmed but not create invoice
              </div>
              <div>
                <strong>Fully Invoiced:</strong> Invoice has been created for this rental order
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}