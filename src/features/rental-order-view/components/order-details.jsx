import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function OrderDetails({
  orderNumber = "R0001",
  customer = "ABC Corporation Ltd.",
  invoiceAddress = "123 Business Street, City, State 12345",
  deliveryAddress = "456 Delivery Avenue, City, State 67890",
  expiration = "2024-12-31",
  orderDate = "2024-01-15",
  projects = "Office Renovation Project",
  rentalPeriod = "Q1 2024",
  rentalDuration = "30 days"
}) {
  const details = [
    { label: "Customer", value: customer },
    { label: "Invoice Address", value: invoiceAddress },
    { label: "Delivery Address", value: deliveryAddress },
    { label: "Expiration", value: expiration },
    { label: "Rental Order Date", value: orderDate },
    { label: "Project(s)", value: projects },
    { label: "Rental Period", value: rentalPeriod },
    { label: "Rental Duration", value: rentalDuration }
  ];

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-3xl font-bold text-foreground">
          Rental Order {orderNumber}
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
