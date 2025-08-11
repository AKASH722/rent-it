import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { BookingsTable } from "@/features/booking";

export default async function BookingsPage() {
  const { user } = await auth();
  if (!user) return null;

  const bookings = await prisma.booking.findMany({
    where: { customerId: user.id },
    include: {
      product: true,
      Payment: { orderBy: { createdAt: "desc" } },
      Invoice: { orderBy: { issueDate: "desc" } },
      Pickup: { orderBy: { scheduledAt: "desc" } },
      ReturnRecord: { orderBy: { returnedAt: "desc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return <BookingsTable bookings={bookings} />;
}
