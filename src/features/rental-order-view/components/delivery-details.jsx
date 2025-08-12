import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchPickupDateAction } from "../actions/rental";

export async function DeliveryDetails({
    booking,
    deliveryNumber = `PICKUP/OUT/${booking.id}`,
    customer = booking?.customer?.name || "Unknown Customer",
    invoiceAddress = booking?.billingAddress || "Not specified",
    deliveryAddress = booking?.deliveryAddress || "Not specified",
}) {
    // Call the server action to get the latest pickup date
    const pickupDate = await fetchPickupDateAction(booking.id);

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
                <CardTitle className="text-3xl font-bold text-foreground">
                    {deliveryNumber}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {details.map((detail, index) => (
                        <div key={index} className="space-y-1">
                            <div className="text-sm font-medium text-muted-foreground">
                                {detail.label}
                            </div>
                            <div className="text-sm text-foreground break-words">
                                {detail.value}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
