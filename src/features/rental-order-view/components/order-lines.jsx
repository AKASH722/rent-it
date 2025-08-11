import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

const defaultItems = [
  {
    id: "1",
    product: "Professional Drill Set",
    quantity: 5,
    unitPrice: 200,
    tax: 100,
    subTotal: 1000
  },
  {
    id: "2",
    product: "Industrial Generator",
    quantity: 2,
    unitPrice: 500,
    tax: 100,
    subTotal: 1000
  },
  {
    id: "3",
    product: "Safety Equipment Package",
    quantity: 10,
    unitPrice: 50,
    tax: 50,
    subTotal: 500
  }
];

export function OrderLines({
  items = defaultItems,
  untaxedTotal = 2500,
  totalTax = 250,
  total = 2750
}) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Order Bill</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Desktop Table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Product</TableHead>
                <TableHead className="font-semibold text-right">Quantity</TableHead>
                <TableHead className="font-semibold text-right">Unit Price</TableHead>
                <TableHead className="font-semibold text-right">Tax</TableHead>
                <TableHead className="font-semibold text-right">Sub Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium text-foreground">{item.product}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{item.quantity}</TableCell>
                  <TableCell className="text-right text-muted-foreground">${item.unitPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">${item.tax.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-medium text-foreground">${item.subTotal.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-background border border-border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-foreground">{item.product}</h3>
                <span className="text-lg font-bold text-foreground">${item.subTotal.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Quantity:</span>
                  <span className="ml-2 font-medium">{item.quantity}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Unit Price:</span>
                  <span className="ml-2 font-medium">${item.unitPrice.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Tax:</span>
                  <span className="ml-2 font-medium">${item.tax.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-foreground">Sub Total:</span>
                  <span className="ml-2 font-bold">${item.subTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Totals */}
        <Separator />
        <div className="flex flex-col sm:flex-row sm:justify-end gap-2 text-sm">
          <div className="flex justify-between sm:justify-end gap-2">
            <span className="text-muted-foreground">Untaxed Total:</span>
            <span className="font-medium">${untaxedTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between sm:justify-end gap-2">
            <span className="text-muted-foreground">Total Tax:</span>
            <span className="font-medium">${totalTax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between sm:justify-end gap-2">
            <span className="text-foreground font-semibold">Total:</span>
            <span className="font-bold text-foreground">${total.toFixed(2)}</span>
          </div>
        </div>
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Terms & Conditions</h4>
          <p className="text-xs text-muted-foreground">
            Equipment must be returned in the same condition as received.
            Late returns will incur additional charges. All equipment is
            subject to inspection upon return.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
