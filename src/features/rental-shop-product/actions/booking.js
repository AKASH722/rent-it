"use server";

import { revalidatePath } from "next/cache";
import { createQuotationRecord } from "@/db/bookings";

export async function submitQuotationAction(data) {
  try {
    const booking = await createQuotationRecord({
      customerId: data.customerId,
      productId: data.productId,
      startDate: new Date(data.fromDate),
      endDate: new Date(data.toDate),
      quantity: data.quantity,
      billingAddress: data.billingAddress,
      deliveryAddress: data.deliveryAddress,
    });

    revalidatePath("/bookings");
    return { success: true, booking };
  } catch (error) {
    console.error("Error creating quotation:", error);
    return { success: false, error: error.message };
  }
}
