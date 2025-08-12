import { RentalOrderView } from "@/features/rental-order-view";
import { getBookingById } from "@/db/rentals";
import React from 'react'


async function page({ params }) {
  const id = (await params).id;
  const booking = await getBookingById(id);
  return (
    <div>
      <RentalOrderView booking={booking} />
    </div>
  )
}
export default page
