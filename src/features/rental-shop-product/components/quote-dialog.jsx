"use client";

import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreditCard, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitQuotationAction } from "@/features/rental-shop-product/actions/booking";
import { getMultiplierAction } from "@/features/rental-shop-product/actions/price-list";
import { toast } from "sonner";

export default function RentalQuotationDialog({
  isOpen,
  onClose,
  product,
  fromDate,
  toDate,
  quantity = 1,
  currentUser,
}) {
  const [step, setStep] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState(
    currentUser?.deliveryAddress || ""
  );
  const [invoiceAddress, setInvoiceAddress] = useState(
    currentUser?.billingAddress || ""
  );
  const [sameAddress, setSameAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const from = useMemo(
    () => (fromDate ? new Date(fromDate) : null),
    [fromDate]
  );
  const to = useMemo(() => (toDate ? new Date(toDate) : null), [toDate]);

  const validRange = useMemo(() => {
    if (!from || !to) return false;
    return (
      !Number.isNaN(from.getTime()) && !Number.isNaN(to.getTime()) && to >= from
    );
  }, [from, to]);

  const msDiff = useMemo(() => {
    if (!validRange) return 0;
    return Math.max(0, to.getTime() - from.getTime());
  }, [validRange, from, to]);

  const hoursFloat = msDiff / (1000 * 60 * 60);
  const ceilHours = Math.ceil(hoursFloat || 1);
  const ceilDays = Math.ceil(msDiff / (1000 * 60 * 60 * 24) || 1);

  const resolvedWeekPrice = useMemo(() => {
    if (product?.basePricePerWeek != null) return product.basePricePerWeek;
    if (product?.basePricePerDay != null) return product.basePricePerDay * 7;
    if (product?.basePricePerHour != null)
      return product.basePricePerHour * 24 * 7;
    return 0;
  }, [product]);

  const resolvedDayPrice = useMemo(() => {
    if (product?.basePricePerDay != null) return product.basePricePerDay;
    if (product?.basePricePerHour != null) return product.basePricePerHour * 24;
    return 0;
  }, [product]);

  const baseSubtotal = useMemo(() => {
    if (!validRange) return 0;

    if (hoursFloat <= 24 && product?.basePricePerHour != null) {
      return ceilHours * product.basePricePerHour * quantity;
    }

    const weeks = Math.floor(ceilDays / 7);
    const days = ceilDays % 7;
    return (weeks * resolvedWeekPrice + days * resolvedDayPrice) * quantity;
  }, [
    validRange,
    hoursFloat,
    ceilHours,
    ceilDays,
    resolvedWeekPrice,
    resolvedDayPrice,
    quantity,
    product,
  ]);

  const handlePreview = async () => {
    if (!step1Valid) return;
    setLoading(true);
    const res = await getMultiplierAction({
      productId: product.id,
      customerGroupId: currentUser.customerGroupId,
      fromDate,
      toDate,
    });
    const multiplier = res.multiplier ?? 1;
    const adjustedSubtotal = baseSubtotal * multiplier;
    const discountOrSurcharge = adjustedSubtotal - baseSubtotal;
    const taxes = Math.round(adjustedSubtotal * 0.18);
    const total = adjustedSubtotal + taxes;

    setPreviewData({
      multiplier,
      baseSubtotal,
      discountOrSurcharge,
      taxes,
      total,
    });
    setStep(2);
    setLoading(false);
  };

  const handleSubmitQuote = async () => {
    if (!previewData) return;
    setLoading(true);
    const payload = {
      customerId: currentUser.id,
      productId: product.id,
      fromDate: from.toISOString(),
      toDate: to.toISOString(),
      quantity,
      billingAddress: sameAddress ? deliveryAddress : invoiceAddress,
      deliveryAddress,
    };
    const result = await submitQuotationAction(payload);
    setLoading(false);
    if (result.success) {
      onClose?.();
      toast.success("Quote successful");
    } else {
      toast.error(result.error);
    }
  };

  const handleToggleAddress = () => {
    const newSame = !sameAddress;
    setSameAddress(newSame);
    if (newSame) {
      setInvoiceAddress(deliveryAddress);
    } else {
      setInvoiceAddress("");
    }
  };

  const step1Valid =
    deliveryAddress.trim().length > 0 &&
    (sameAddress || invoiceAddress.trim().length > 0) &&
    validRange &&
    quantity > 0;

  return (
    <Dialog
      open={Boolean(isOpen)}
      onOpenChange={(open) => {
        if (!open) onClose?.();
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Request Rental Quotation</DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-primary flex items-center text-lg font-bold">
                <MapPin className="mr-2 h-5 w-5" /> Delivery Address
              </h2>
              <textarea
                value={deliveryAddress}
                onChange={(e) => {
                  setDeliveryAddress(e.target.value);
                  if (sameAddress) setInvoiceAddress(e.target.value);
                }}
                className="w-full rounded-lg border p-3"
                placeholder="Enter your delivery address..."
                rows={4}
              />
            </div>

            <div>
              <h2 className="text-primary flex items-center text-lg font-bold">
                <CreditCard className="mr-2 h-5 w-5" /> Invoice Address
              </h2>
              <label className="mb-2 flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={sameAddress}
                  onChange={handleToggleAddress}
                />
                <span>Same as delivery address</span>
              </label>
              <textarea
                value={invoiceAddress}
                onChange={(e) => setInvoiceAddress(e.target.value)}
                disabled={sameAddress}
                className="w-full rounded-lg border p-3 disabled:bg-gray-100"
                placeholder="Enter your billing address..."
                rows={4}
              />
            </div>
          </div>
        )}

        {step === 2 && previewData && (
          <div className="space-y-4">
            <h2 className="text-primary text-lg font-bold">Order Summary</h2>
            <div className="flex justify-between">
              <span>Product</span>
              <span>{product?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Quantity</span>
              <span>{quantity}</span>
            </div>
            <div className="flex justify-between">
              <span>Base Sub Total</span>
              <span>₹{previewData.baseSubtotal.toLocaleString()}</span>
            </div>

            {previewData.multiplier < 1 && (
              <div className="flex justify-between text-green-600">
                <span>
                  Discount ({((1 - previewData.multiplier) * 100).toFixed(0)}%)
                </span>
                <span>
                  -₹{Math.abs(previewData.discountOrSurcharge).toLocaleString()}
                </span>
              </div>
            )}
            {previewData.multiplier > 1 && (
              <div className="flex justify-between text-red-600">
                <span>
                  Surcharge ({((previewData.multiplier - 1) * 100).toFixed(0)}%)
                </span>
                <span>
                  +₹{Math.abs(previewData.discountOrSurcharge).toLocaleString()}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Taxes (18% GST)</span>
              <span>₹{previewData.taxes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t pt-3 text-lg font-bold">
              <span>Total</span>
              <span>₹{previewData.total.toLocaleString()}</span>
            </div>
          </div>
        )}

        <DialogFooter className="mt-6 flex justify-end gap-3">
          {step === 1 && (
            <>
              <Button variant="secondary" onClick={() => onClose?.()}>
                Cancel
              </Button>
              <Button onClick={handlePreview} disabled={!step1Valid || loading}>
                Next
              </Button>
            </>
          )}
          {step === 2 && (
            <>
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleSubmitQuote} disabled={loading}>
                Submit Quotation
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
