import { auth } from "@/lib/auth";

/**
 * Finds all bookings for products owned by the currently authenticated user.
 */
export const findBookingsForCurrentUser = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  return prisma.booking.findMany({
    where: {
      product: {
        ownerId: session.user.id,
      },
    },
    orderBy: { startDate: "desc" },
    include: {
      product: true,
      customer: true,
      Invoice: true,
      Pickup: true,
      ReturnRecord: true,
      Payment: true,
    },
  });
};
