import { findBookingsForCurrentUser } from "@/db/bookings";
import RentalOrdersPage from "./rental-orders-client";

export async function RentalOrders() {
  const bookings = await findBookingsForCurrentUser();

  const orders = bookings.map((b) => ({
    id: b.id,
    customer: b.customer?.name || "Unknown",
    createdBy: b.product?.owner?.name || "Unknown",
    rentalStatus: b.status.toLowerCase(),
    invoiceStatus:
      b.Invoice?.length > 0 ? "fully-invoiced" : "nothing-to-invoice",
    total: b.totalPrice,
    startDate: b.startDate,
    endDate: b.endDate,
  }));

  return <RentalOrdersPage orders={orders} />;
}
