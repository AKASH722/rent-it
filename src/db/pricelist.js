import prisma from "@/lib/prisma";

export async function getPriceListMultiplier({
  productId,
  customerGroupId,
  fromDate,
  toDate,
}) {
  if (!productId || !customerGroupId) return 1;

  const priceList = await prisma.priceList.findFirst({
    where: {
      productId,
      customerGroup: { some: { id: customerGroupId } },
      startDate: { lte: new Date(fromDate) },
      endDate: { gte: new Date(toDate) },
    },
    orderBy: { multiplier: "desc" },
  });

  return priceList?.multiplier ?? 1;
}
