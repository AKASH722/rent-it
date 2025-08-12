"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Script from "next/script";
import { toast } from "sonner";
import {
  createPaymentRequestAction,
  verifyPaymentAction,
} from "../actions/payment";
import { useState, useTransition } from "react";
import { BookingDetailsDialog } from "@/features/booking/components/booking-details-dialog";

function formatDate(date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date)); // e.g. "12 Aug 2025"
}

export function BookingsTable({ bookings }) {
  const [isPending, startTransition] = useTransition();
  const [selectedBooking, setSelectedBooking] = useState(null);

  const startPayment = async (booking) => {
    try {
      const res = await createPaymentRequestAction(booking.id);

      if (!res.success) {
        toast.error(res.error || "Unable to start payment");
        return;
      }

      const { orderId, amount, customer } = res.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: "INR",
        name: "Your Company",
        description: `Payment for booking ${booking.id}`,
        order_id: orderId,
        handler: async function (response) {
          startTransition(async () => {
            const verifyRes = await verifyPaymentAction({
              orderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            const params = new URLSearchParams();
            params.set("order-id", response.razorpay_order_id);

            if (verifyRes.success) {
              toast.success("Payment successful");
            } else {
              toast.error("Payment failed");
            }
          });
        },
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.phone,
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function () {
        toast.error("Payment failed");
      });
    } catch (err) {
      console.error("Payment initiation failed:", err);
      toast.error("Something went wrong starting the payment");
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <Card className="m-6">
        <CardHeader>
          <CardTitle>Your Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>From → To</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Booked On</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((b) => {
                const showPay = b.status === "QUOTATION_SENT";
                return (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">
                      {b.product.name}
                    </TableCell>
                    <TableCell>
                      {formatDate(b.startDate)} → {formatDate(b.endDate)}
                    </TableCell>
                    <TableCell>{b.quantity}</TableCell>
                    <TableCell>
                      <span
                        className={`rounded px-2 py-1 text-xs font-semibold ${
                          b.status === "CONFIRMED"
                            ? "bg-green-100 text-green-800"
                            : b.status === "QUOTATION_SENT"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {b.status}
                      </span>
                    </TableCell>
                    <TableCell>{b.paymentStatus}</TableCell>
                    <TableCell>
                      ₹{b.totalPrice.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>{formatDate(b.createdAt)}</TableCell>
                    <TableCell>
                      {showPay && (
                        <Button
                          onClick={() => startPayment(b)}
                          disabled={isPending}
                        >
                          {isPending ? "Processing..." : "Pay Now"}
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedBooking(b)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <BookingDetailsDialog
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </>
  );
}
