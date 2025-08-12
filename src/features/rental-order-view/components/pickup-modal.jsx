"use client";
import { useState } from "react";
import { schedulePickup } from "../actions/rental";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateBookingAction } from "../actions/rental";
export function PickupModal({ isOpen, onClose, booking, pickUpAddress }) {
    const [scheduledAt, setScheduledAt] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await schedulePickup(booking.id, scheduledAt, pickUpAddress);

        if (res.success) {
            const res = await updateBookingAction(booking.id)
            toast(res.message);
            onClose();
        } else {
            toast(res.error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <Card className="border-0 shadow-none">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-between">
                            Schedule Pickup
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-normal"
                            >
                                ×
                            </button>
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Scheduled At Input */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="scheduledAt"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Scheduled Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    id="scheduledAt"
                                    value={scheduledAt}
                                    onChange={(e) => setScheduledAt(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    required
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                >
                                    Schedule Pickup
                                </button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
