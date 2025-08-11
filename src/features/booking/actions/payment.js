"use server";

import Razorpay from "razorpay";
import prisma from "@/lib/prisma";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import { revalidatePath } from "next/cache";
import { BOOKING_STATUS, PAYMENT_STATUS } from "@prisma/client";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function createPaymentRequestAction(bookingId) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true },
    });

    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    const order = await razorpay.orders.create({
      amount: Math.round(booking.totalPrice * 100), // in paise
      currency: "INR",
      receipt: booking.id,
    });

    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: booking.totalPrice,
        status: PAYMENT_STATUS.PENDING,
        orderId: order.id,
      },
    });

    return {
      success: true,
      data: {
        orderId: order.id,
        amount: booking.totalPrice,
        customer: {
          name: booking.customer.name,
          email: booking.customer.email,
          phone: booking.customer.phone,
        },
      },
    };
  } catch (err) {
    console.error("Error creating payment request:", err);
    return {
      success: false,
      error: err.message || "Unable to create payment request",
    };
  }
}

export async function verifyPaymentAction({
  orderId,
  razorpayPaymentId,
  razorpaySignature,
}) {
  try {
    const isValid = validatePaymentVerification(
      { order_id: orderId, payment_id: razorpayPaymentId },
      razorpaySignature,
      process.env.RAZORPAY_KEY_SECRET
    );

    if (!isValid) {
      return { success: false, error: "Payment verification failed" };
    }

    const payment = await prisma.payment.update({
      where: { orderId },
      data: {
        status: PAYMENT_STATUS.PAID,
        transactionId: razorpayPaymentId,
      },
    });

    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: {
        paymentStatus: PAYMENT_STATUS.PAID,
        status: BOOKING_STATUS.RESERVED,
      },
    });

    revalidatePath("/bookings");

    return { success: true, data: { bookingId: payment.bookingId } };
  } catch (err) {
    console.error("Error verifying payment:", err);
    return { success: false, error: err.message || "Unable to verify payment" };
  }
}
