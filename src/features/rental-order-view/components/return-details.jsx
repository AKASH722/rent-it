import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchPickupDateAction } from "../actions/rental";

export async function ReturnDetails({
    booking,
    returnNumber = `Return/In/${booking.id}`,
    receivedFromCustomer = booking?.customer?.name || "Unknown Customer",
    pickupAddress = booking?.deliveryAddress || "Not specified",
}) {

    const pickupDate = await fetchPickupDateAction(booking.id);

    const scheduleDate = pickupDate
        ? new Date(pickupDate).toLocaleDateString()
        : "Not Scheduled";

    const details = [
        { label: "Received from Customer", value: receivedFromCustomer },
        { label: "Pickup Address", value: pickupAddress },
        { label: "Schedule Date", value: scheduleDate },
    ];

    return (
        <Card className="shadow-md">
            <CardHeader className="pb-4">
                <CardTitle className="text-3xl font-bold text-foreground">
                    {returnNumber}
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
