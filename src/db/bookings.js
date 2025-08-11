import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getPriceListMultiplier } from "./pricelist.js";

/**
 * Finds all bookings for products owned by the currently authenticated user.
 */
export const findBookingsForCurrentUser = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  return prisma.booking.findMany({
    where: {
      product: {
        ownerId: session.user.id,
      },
    },
    orderBy: { startDate: "desc" },
    include: {
      product: {
        include: {
          owner: true,
        },
      },
      customer: true,
      Invoice: true,
      Pickup: true,
      ReturnRecord: true,
      Payment: true,
    },
  });
};

export async function createQuotationRecord(params) {
  const {
    customerId,
    productId,
    startDate,
    endDate,
    quantity,
    billingAddress,
    deliveryAddress,
  } = params;

  return prisma.$transaction(async (tx) => {
    // Update user addresses and get customerGroupId
    const user = await tx.user.update({
      where: { id: customerId },
      data: { billingAddress, deliveryAddress },
      select: { customerGroupId: true },
    });

    // Fetch product with units and pricing
    const product = await tx.product.findUnique({
      where: { id: productId },
      select: {
        basePricePerHour: true,
        basePricePerDay: true,
        basePricePerWeek: true,
        units: true,
        LateFeePerHour: true,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (quantity < 1) {
      throw new Error("Quantity must be at least 1");
    }

    if (product.units < quantity) {
      throw new Error(
        `Requested quantity (${quantity}) exceeds available stock (${product.units})`
      );
    }

    // Calculate rental duration in hours and days
    const hours = Math.max(
      1,
      Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60))
    );
    const days = Math.ceil(hours / 24);

    // Calculate week and day prices
    const weekPrice =
      product.basePricePerWeek ??
      (product.basePricePerDay ?? product.basePricePerHour * 24) * 7;
    const dayPrice = product.basePricePerDay ?? product.basePricePerHour * 24;

    let baseSubtotal;
    if (hours <= 24 && product.basePricePerHour != null) {
      baseSubtotal = hours * product.basePricePerHour * quantity;
    } else {
      const weeks = Math.floor(days / 7);
      const remDays = days % 7;
      baseSubtotal = (weeks * weekPrice + remDays * dayPrice) * quantity;
    }

    // Get multiplier from price list (custom pricing per customer group)
    const multiplier = await getPriceListMultiplier({
      productId,
      customerGroupId: user.customerGroupId,
      fromDate: startDate,
      toDate: endDate,
    });

    const finalPrice = baseSubtotal * multiplier;
    const taxes = Math.round(finalPrice * 0.18);
    const totalWithTax = finalPrice + taxes;

    // Create booking record
    const booking = await tx.booking.create({
      data: {
        customerId,
        productId,
        startDate,
        endDate,
        quantity,
        totalPrice: totalWithTax,
        billingAddress,
        deliveryAddress,
        status: "QUOTATION", // Or BOOKING_STATUS.QUOTATION if enum is imported
        paymentStatus: "PENDING", // Or PAYMENT_STATUS.PENDING if enum is imported
      },
    });

    // Deduct quantity from product units
    await tx.product.update({
      where: { id: productId },
      data: {
        units: {
          decrement: quantity,
        },
      },
    });

    return booking;
  });
}
