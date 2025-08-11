"use server";

import { confirmBooking, cancelBooking } from "@/db/rentals";

export async function confirmBookingAction(bookingId) {
    try {
        return await confirmBooking(bookingId);
    } catch (error) {
        console.error("Error confirming booking:", error);
        throw error;
    }
}

export async function cancelBookingAction(bookingId) {
    try {
        return await cancelBooking(bookingId);
    } catch (error) {
        console.error("Error cancelling booking:", error);
        throw error;
    }
}
