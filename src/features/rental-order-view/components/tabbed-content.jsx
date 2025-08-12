
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderLines } from "./order-lines";

export function TabbedContent({ activeTab = "order-lines", onTabChange , booking }) {
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="order-lines" className="text-sm">
            Order Bill
          </TabsTrigger>
          <TabsTrigger value="other-details" className="text-sm">
            Other Details
          </TabsTrigger>
         
        </TabsList>

        <TabsContent value="order-lines" className="mt-6">
          <OrderLines items={[
            {
              id: booking.product.id,
              product: booking.product.name,
              quantity: booking.quantity || 1, 
              unitPrice: booking.product.basePricePerDay || 0,
              tax: booking.taxAmount || 0, 
              subTotal: booking.totalPrice 
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
                      Pickup Location
                    </label>
                    <div className="text-sm text-foreground">
                      { booking.deliveryAddress}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Billing address
                    </label>
                    <div className="text-sm text-foreground">
                      {booking.billingAddress || "Same as pickup"}
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
                      Pricelist Applied
                    </label>
                    <div className="text-sm text-foreground">
                      {booking.product.PriceList?.[0]?.name || "Standard Rates"}
                    </div>
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
