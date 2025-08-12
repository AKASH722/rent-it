import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const statusColorMap = {
  quotation: "bg-primary/10 text-primary border-primary/20",
  reserved: "bg-secondary/10 text-secondary border-secondary/20",
  pickup: "bg-warning/10 text-warning border-warning/20",
  returned: "bg-success/10 text-success border-success/20",
};
const invoiceStatusColorMap = {
  "fully-invoiced": "bg-success/10 text-success border-success/20",
  "nothing-to-invoice": "bg-muted text-muted-foreground border-muted",
  "to-invoice": "bg-warning/10 text-warning border-warning/20",
};

export function RentalOrdersGrid({
  filteredOrders,
  statusColors = statusColorMap,
  invoiceStatusColors = invoiceStatusColorMap,
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredOrders.map((order) => (
        <Link href={`store/rentals/${order.id}`}>
        <Card key={order.id} className="transition-shadow hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{order.id}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">{order.customer}</p>
              <p className="text-muted-foreground text-xs">
                Created by {order.createdBy}
              </p>
            </div>
            <div className="space-y-2">
              <Badge className={statusColors[order.rentalStatus]}>
                {order.rentalStatus}
              </Badge>
              <Badge className={invoiceStatusColors[order.invoiceStatus]}>
                {order.invoiceStatus.replace("-", " ")}
              </Badge>
            </div>
            <div className="text-right">
              <p className="font-semibold">₹{order.total}</p>
            </div>
          </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
