import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function RentalPricingSection({ product }) {
    const { PriceList = [], LateFeePerHour } = product;

    return (
        <div className="space-y-4 sm:space-y-6 px-4 sm:px-0 md:border-l md:border-border md:pl-8">
            <h2 className="text-lg sm:text-xl font-semibold border-b border-border pb-2 sm:pb-3 mb-3 sm:mb-4">
                Rental Pricing
            </h2>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
                <Table className="w-full text-left">
                    <TableHeader>
                        <TableRow className="border-b border-border hover:bg-transparent">
                            <TableHead className="py-2 pr-4 text-muted-foreground">Rental Period</TableHead>
                            <TableHead className="py-2 px-4 text-muted-foreground">Pricelist</TableHead>
                            <TableHead className="py-2 pl-4 text-muted-foreground">Price</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {PriceList.map((item, index) => (
                            <TableRow key={index} className="border-b border-border hover:bg-muted">
                                <TableCell className="py-2 pr-4">{item.period}</TableCell>
                                <TableCell className="py-2 px-4">{item.name}</TableCell>
                                <TableCell className="py-2 pl-4 font-semibold text-green-600">
                                    ${item.price.toFixed(2)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card Layout */}
            <div className="sm:hidden space-y-3">
                {PriceList.map((item, index) => (
                    <div
                        key={index}
                        className="bg-muted/50 rounded-lg p-4 border border-border space-y-2"
                    >
                        <div className="flex justify-between items-start">
                            <span className="font-semibold text-sm">{item.period}</span>
                            <span className="font-bold text-green-600 text-sm">${item.price.toFixed(2)}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            <span className="font-medium">Pricelist:</span> {item.name}
                        </div>
                    </div>
                ))}
            </div>

            {/* Rental Reservation Charges */}
            {LateFeePerHour !== null && LateFeePerHour !== undefined && (
                <div className="space-y-2 sm:space-y-3 pt-4 sm:pt-6 border-t border-border">
                    <h3 className="text-base sm:text-lg font-semibold">Rental Reservation Charges</h3>
                    <div className="hidden sm:flex items-start text-sm">
                        <span className="font-medium w-32 shrink-0 text-gray-700">Late Fee/Hour:</span>
                        <span className="flex-1 font-semibold text-red-600">
                            ${LateFeePerHour.toFixed(2)} Rs
                        </span>
                    </div>
                    <div className="sm:hidden flex justify-between items-center p-3 bg-red-50 rounded border-l-4 border-red-400">
                        <span className="font-medium text-sm">Late Fee/Hour</span>
                        <span className="font-bold text-red-600 text-sm">${LateFeePerHour.toFixed(2)} Rs</span>
                    </div>
                </div>
            )}
        </div>
    );
}
