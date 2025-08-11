"use server";

import { getPriceListMultiplier } from "@/db/pricelist";

export async function getMultiplierAction({
  productId,
  customerGroupId,
  fromDate,
  toDate,
}) {
  try {
    const multiplier = await getPriceListMultiplier({
      productId,
      customerGroupId,
      fromDate,
      toDate,
    });
    return { multiplier };
  } catch (err) {
    console.error("Error in getMultiplierAction:", err);
    return { multiplier: 1 };
  }
}
