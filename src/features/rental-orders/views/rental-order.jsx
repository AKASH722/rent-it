import { findBookingsForCurrentUser } from "@/db/bookings";
import RentalOrdersPage from "./rental-orders-client";

export async function RentalOrders() {
  const bookings = await findBookingsForCurrentUser();

  const orders = bookings.map((b) => ({
    id: String(b.id),
    customer: b.customer?.name || "Unknown",
    createdBy: b.product?.owner?.name || "Unknown",
    rentalStatus: b.status?.toLowerCase() || "unknown",
    invoiceStatus: b.Invoice?.length > 0 ? "fully-invoiced" : "to-invoice",
    total: b.totalPrice.toFixed(2) ?? 0,
    startDate: b.startDate?.toISOString?.() || "",
    endDate: b.endDate?.toISOString?.() || "",
  }));

  return <RentalOrdersPage orders={orders} />;
}
