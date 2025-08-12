// lib/api/bookings.ts
import prisma from "@/lib/prisma";
import { BOOKING_STATUS } from "@prisma/client";
export async function getBookingById(id) {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id },
            include: {
                customer: true,  // User details
                product: {
                    include: {
                        category: true,
                        PriceList: true,
                        ProductAttribute: true,
                    },
                },
                Invoice: true,
                Pickup: true,
                ReturnRecord: true,
                Payment: true,
            },
        });

        if (!booking) {
            throw new Error("Booking not found");
        }

        return booking;
    } catch (error) {
        console.error("Error fetching booking:", error);
        throw error;
    }
}



export async function confirmBooking(id) {
    return await prisma.booking.update({
        where: { id },
        data: {
            status: BOOKING_STATUS.QUOTATION_SENT
        }
    });
}

export async function cancelBooking(id) {
    return await prisma.booking.update({
        where: { id },
        data: {
            status: BOOKING_STATUS.QUOTATION_REJECT
        }
    });
}


export async function updateBooking(id) {
    return await prisma.booking.update({
        where: { id },
        data: {
            status: BOOKING_STATUS.PICKEDUP
        }
    });
}

export async function getPickupDate(bookingId) {
    try {
        const pickup = await prisma.pickup.findFirst({
            where: { bookingId },
            select: { scheduledAt: true },
            orderBy: { scheduledAt: "desc" },
        });

        return pickup?.scheduledAt || null;
    } catch (error) {
        console.error("Error fetching pickup date:", error);
        return null;
    }
}