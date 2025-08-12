"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchPickupDateAction } from "../actions/rental";

export function ReturnDetails({
  booking,
  returnNumber,
  receivedFromCustomer,
  pickupAddress,
}) {
  const [pickupDate, setPickupDate] = useState(null);
  const [loading, setLoading] = useState(true);

  const finalReturnNumber = returnNumber || `Return/In/${booking.id}`;
  const finalReceivedFromCustomer =
    receivedFromCustomer || booking?.customer?.name || "Unknown Customer";
  const finalPickupAddress =
    pickupAddress || booking?.deliveryAddress || "Not specified";

  useEffect(() => {
    let isMounted = true;
    async function loadPickupDate() {
      try {
        const date = await fetchPickupDateAction(booking.id);
        if (isMounted) {
          setPickupDate(date);
        }
      } catch (err) {
        console.error("Failed to fetch pickup date:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadPickupDate();
    return () => {
      isMounted = false;
    };
  }, [booking.id]);

  const scheduleDate = loading
    ? "Loading..."
    : pickupDate
      ? new Date(pickupDate).toLocaleDateString()
      : "Not Scheduled";

  const details = [
    { label: "Received from Customer", value: finalReceivedFromCustomer },
    { label: "Pickup Address", value: finalPickupAddress },
    { label: "Schedule Date", value: scheduleDate },
  ];

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-foreground text-3xl font-bold">
          {finalReturnNumber}
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
