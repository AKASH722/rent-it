"use server";

import { revalidatePath } from "next/cache";
import { getPickupDate, updateBooking } from "@/db/rentals";
import prisma from "@/lib/prisma";
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


export async function updateBookingAction(bookingId) {
    try {
        return await updateBooking(bookingId);
    } catch (error) {
        console.error("Error cancelling booking:", error);
        throw error;
    }
}

export async function schedulePickup(bookingId, scheduledAt, pickUpAddress ) {
    try {
        // Create pickup record
        const pickup = await prisma.pickup.create({
            data: {
                bookingId,
                address: pickUpAddress,
                scheduledAt: new Date(scheduledAt),
            },
        });

        // Update booking status
        await prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: "PICKEDUP",
                updatedAt: new Date(),
            },
        });

        // Revalidate booking page
        revalidatePath(`/rentals/${bookingId}`);

        return {
            success: true,
            pickup,
            message: "Pickup scheduled successfully",
        };
    } catch (error) {
        console.error("Error scheduling pickup:", error);
        return {
            success: false,
            error: error.message || "Failed to schedule pickup",
        };
    }
}






export async function fetchPickupDateAction(bookingId) {
    return await getPickupDate(bookingId);
}