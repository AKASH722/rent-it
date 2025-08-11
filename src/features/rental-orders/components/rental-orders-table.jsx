import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

export function RentalOrdersTable({
  filteredOrders,
  statusColors = statusColorMap,
  invoiceStatusColors = invoiceStatusColorMap,
}) {
  return (
    <div className="bg-background overflow-x-auto rounded-lg border">
      <Table className="min-w-[700px]">
        <TableHeader>
          <TableRow>
            <TableHead>Order Reference</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Created by user</TableHead>
            <TableHead>Rental Status</TableHead>
            <TableHead>Invoice Status</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {order.createdBy.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{order.createdBy}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={statusColors[order.rentalStatus]}>
                  {order.rentalStatus}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={invoiceStatusColors[order.invoiceStatus]}>
                  {order.invoiceStatus.replace("-", " ")}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-medium">
                ₹{order.total}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
