"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchPickupDateAction } from "../actions/rental";

export function DeliveryDetails({
  booking,
  deliveryNumber: initialDeliveryNumber,
  customer: initialCustomer,
  invoiceAddress: initialInvoiceAddress,
  deliveryAddress: initialDeliveryAddress,
}) {
  const [pickupDate, setPickupDate] = useState(null);

  const deliveryNumber = initialDeliveryNumber || `PICKUP/OUT/${booking.id}`;
  const customer =
    initialCustomer || booking?.customer?.name || "Unknown Customer";
  const invoiceAddress =
    initialInvoiceAddress || booking?.billingAddress || "Not specified";
  const deliveryAddress =
    initialDeliveryAddress || booking?.deliveryAddress || "Not specified";

  useEffect(() => {
    async function loadPickupDate() {
      try {
        const date = await fetchPickupDateAction(booking.id);
        setPickupDate(date);
      } catch (error) {
        console.error("Failed to fetch pickup date:", error);
      }
    }

    if (booking?.id) {
      loadPickupDate();
    }
  }, [booking?.id]);

  const details = [
    { label: "Customer", value: customer },
    { label: "Invoice Address", value: invoiceAddress },
    { label: "Delivery Address", value: deliveryAddress },
    {
      label: "Schedule Date",
      value: pickupDate
        ? new Date(pickupDate).toLocaleDateString()
        : "Not Scheduled",
    },
  ];

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-foreground text-3xl font-bold">
          {deliveryNumber}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {details.map((detail, index) => (
            <div key={index} className="space-y-1">
              <div className="text-muted-foreground text-sm font-medium">
                {detail.label}
              </div>
              <div className="text-foreground text-sm break-words">
                {detail.value}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
