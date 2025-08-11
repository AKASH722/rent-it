"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Minus, Plus } from "lucide-react";
import Link from "next/link";
import RentalQuotationDialog from "../components/quote-dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function Product({ product, user }) {
  const [quantity, setQuantity] = useState(1);
  const [dateRange, setDateRange] = useState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleQuantityChange = (type) => {
    setQuantity((prev) =>
      type === "increment" ? prev + 1 : Math.max(1, prev - 1)
    );
  };

  const isInvalidRange =
    dateRange?.from && dateRange?.to && dateRange.to < dateRange.from;

  const canSubmit =
    quantity > 0 && dateRange?.from && dateRange?.to && !isInvalidRange;

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="text-muted-foreground mb-4 text-sm">
        <Link
          href="/dashboard"
          className="hover:text-primary transition-colors"
        >
          All Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground font-medium">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Image */}
        <Card>
          <CardContent className="p-0">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-muted-foreground flex h-96 items-center justify-center">
                No image available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              {product.category && (
                <p className="text-muted-foreground text-sm">
                  Category: {product.category.name}
                </p>
              )}
              <p className="text-muted-foreground text-sm">
                Owner: {product.owner.name}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Description */}
              <div>
                <p className="text-lg font-semibold">Description</p>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              {/* Pricing */}
              <div className="space-y-1">
                {product.basePricePerHour != null && (
                  <p className="text-sm">
                    <strong>Hourly Price:</strong> ₹{product.basePricePerHour}
                  </p>
                )}
                {product.basePricePerDay != null && (
                  <p className="text-sm">
                    <strong>Daily Price:</strong> ₹{product.basePricePerDay}
                  </p>
                )}
                {product.basePricePerWeek != null && (
                  <p className="text-sm">
                    <strong>Weekly Price:</strong> ₹{product.basePricePerWeek}
                  </p>
                )}
                {product.LateFeePerHour != null && (
                  <p className="text-sm text-red-600">
                    <strong>Late Fee (per hour):</strong> ₹
                    {product.LateFeePerHour}
                  </p>
                )}
              </div>

              {/* Date Range Picker */}
              <div className="grid gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a rental period</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={1}
                    />
                  </PopoverContent>
                </Popover>
                {isInvalidRange && (
                  <p className="text-sm text-red-600">
                    End date cannot be before start date.
                  </p>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange("decrement")}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="min-w-[2rem] text-center text-lg">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange("increment")}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Submit */}
              <Button
                className="w-full"
                disabled={!canSubmit}
                onClick={() => setIsDialogOpen(true)}
              >
                Submit Quotation
              </Button>
            </CardContent>
          </Card>

          {/* Terms & Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-1 text-sm">
              <p>• Rental price is exclusive of security deposit.</p>
              <p>• Late fee applies at ₹{product.LateFeePerHour}/hour.</p>
              <p>• Equipment must be returned in original condition.</p>
              <p>• Prices are subject to change without notice.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quotation Dialog */}
      <RentalQuotationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        product={product}
        fromDate={dateRange?.from}
        toDate={dateRange?.to}
        quantity={quantity}
        currentUser={user}
      />
    </div>
  );
}
