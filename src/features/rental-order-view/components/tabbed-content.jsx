
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderLines } from "./order-lines";

export function TabbedContent({ activeTab = "order-lines", onTabChange , booking }) {
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="order-lines" className="text-sm">
            Order Bill
          </TabsTrigger>
          <TabsTrigger value="other-details" className="text-sm">
            Other Details
          </TabsTrigger>
          <TabsTrigger value="rental-notes" className="text-sm">
            Rental Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="order-lines" className="mt-6">
          <OrderLines items={[
            {
              id: booking.product.id,
              product: booking.product.name,
              quantity: booking.quantity || 1, // if you store quantity somewhere
              unitPrice: booking.product.basePricePerDay || 0,
              tax: booking.taxAmount || 0, // adjust based on your tax logic
              subTotal: booking.totalPrice // or unitPrice * quantity + tax
            }
          ]}
            untaxedTotal={booking.totalPrice - (booking.taxAmount || 0)}
            totalTax={booking.taxAmount || 0}
            total={booking.totalPrice} />
        </TabsContent>  

        <TabsContent value="other-details" className="mt-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Other Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Special Instructions
                    </label>
                    <div className="text-sm text-foreground">
                      {booking.specialInstructions || "None"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Insurance Required
                    </label>
                    <div className="text-sm text-foreground">
                      {booking.insuranceRequired ? "Yes" : "No"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Pickup Location
                    </label>
                    <div className="text-sm text-foreground">
                      {booking.pickupLocation || booking.deliveryAddress}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Return Location
                    </label>
                    <div className="text-sm text-foreground">
                      {booking.returnLocation || "Same as pickup"}
                    </div>
                  </div>

                  {/* New suggested fields */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Late Fee Policy
                    </label>
                    <div className="text-sm text-foreground">
                      ₹{booking.product.LateFeePerHour}/hour after due time
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Security Deposit
                    </label>
                    <div className="text-sm text-foreground">
                      ₹{booking.securityDeposit || 0} (Refundable)
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Pricelist Applied
                    </label>
                    <div className="text-sm text-foreground">
                      {booking.product.PriceList?.[0]?.name || "Standard Rates"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Payment Terms
                    </label>
                    <div className="text-sm text-foreground">
                      {booking.Invoice[0]?.dueDate
                        ? `Due by ${new Date(booking.Invoice[0].dueDate).toLocaleDateString()}`
                        : "Due on delivery"}
                    </div>
                  </div>

                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>


        <TabsContent value="rental-notes" className="mt-6">
          <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="text-xl">Rental Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Internal Notes
                  </label>
                  <div className="text-sm text-foreground bg-muted p-3 rounded-md">
                    Customer has been with us for 5+ years. Excellent payment history. 
                    Previous rentals returned in good condition.
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Customer Notes
                  </label>
                  <div className="text-sm text-foreground bg-muted p-3 rounded-md">
                    Need delivery between 8-10 AM on start date. Site access requires 
                    advance notice to security.
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Maintenance Notes
                  </label>
                  <div className="text-sm text-foreground bg-muted p-3 rounded-md">
                    All equipment serviced and inspected on Jan 10, 2024. 
                    Next service due in 90 days.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
