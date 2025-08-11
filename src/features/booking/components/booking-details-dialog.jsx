import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function formatDateTime(date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatCurrency(amount) {
  return `₹${amount?.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
  })}`;
}

export function BookingDetailsDialog({ booking, onClose }) {
  if (!booking) return null;

  return (
    <Dialog open={!!booking} onOpenChange={onClose}>
      <DialogContent className="max-h-[calc(100dvh-5rem)] max-w-3xl overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Booking Details
          </DialogTitle>
          <p className="text-muted-foreground text-sm">ID: {booking.id}</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payments */}
          <section className="bg-muted/30 rounded-md border p-4">
            <h3 className="mb-3 font-semibold">Payments</h3>
            {booking.Payment.length ? (
              <ul className="space-y-2">
                {booking.Payment.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm"
                  >
                    <div>
                      <p className="font-medium">{formatCurrency(p.amount)}</p>
                      <p className="text-muted-foreground text-xs">
                        {formatDateTime(p.createdAt)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        p.status === "PAID"
                          ? "success"
                          : p.status === "PARTIAL"
                            ? "warning"
                            : "secondary"
                      }
                    >
                      {p.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">No payments yet.</p>
            )}
          </section>

          {/* Invoices */}
          <section className="bg-muted/30 rounded-md border p-4">
            <h3 className="mb-3 font-semibold">Invoices</h3>
            {booking.Invoice.length ? (
              <ul className="space-y-2">
                {booking.Invoice.map((inv) => (
                  <li
                    key={inv.id}
                    className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm"
                  >
                    <div>
                      <p className="font-medium">
                        Total: {formatCurrency(inv.totalAmount)}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Due: {formatCurrency(inv.dueAmount)}
                      </p>
                    </div>
                    {inv.invoiceUrl && (
                      <Button size="sm" variant="outline" asChild>
                        <a
                          href={inv.invoiceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Invoice
                        </a>
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">
                No invoices issued.
              </p>
            )}
          </section>

          {/* Pickup */}
          <section className="bg-muted/30 rounded-md border p-4">
            <h3 className="mb-3 font-semibold">Pickup</h3>
            {booking.Pickup.length ? (
              <ul className="space-y-2">
                {booking.Pickup.map((pu) => (
                  <li key={pu.id} className="rounded-md bg-white p-3 shadow-sm">
                    <p>{pu.address}</p>
                    <p className="text-muted-foreground text-xs">
                      Scheduled: {formatDateTime(pu.scheduledAt)}
                    </p>
                    {pu.completedAt && (
                      <p className="text-xs text-green-600">
                        Completed: {formatDateTime(pu.completedAt)}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">
                No pickup scheduled.
              </p>
            )}
          </section>

          {/* Return */}
          <section className="bg-muted/30 rounded-md border p-4">
            <h3 className="mb-3 font-semibold">Return</h3>
            {booking.ReturnRecord.length ? (
              <ul className="space-y-2">
                {booking.ReturnRecord.map((rr) => (
                  <li key={rr.id} className="rounded-md bg-white p-3 shadow-sm">
                    <p>Returned: {formatDateTime(rr.returnedAt)}</p>
                    {rr.lateFee > 0 && (
                      <p className="text-xs text-red-600">
                        Late Fee: {formatCurrency(rr.lateFee)}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">
                No return recorded.
              </p>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
