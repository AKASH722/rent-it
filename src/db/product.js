import prisma from "@/lib/prisma";

export async function getAllProducts() {
  return prisma.product.findMany({
    include: {
      category: true,
      owner: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductBySlug(slug) {
  const product = await prisma.product.findFirst({
    where: { slug },
    include: {
      category: true,
      owner: true,
      ProductAttribute: true,
    },
  });

  if (!product) return null;

  // Map for safe client usage
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    units: product.units,
    basePricePerHour: product.basePricePerHour,
    basePricePerDay: product.basePricePerDay,
    basePricePerWeek: product.basePricePerWeek,
    lateFeePerHour: product.LateFeePerHour,
    imageUrl: product.imageUrl,
    owner: {
      id: product.owner.id,
      name: product.owner.name ?? "Unknown",
    },
    category: product.category
      ? { id: product.category.id, name: product.category.name }
      : null,
    attributes: product.ProductAttribute.map((attr) => ({
      key: attr.key,
      value: attr.value,
    })),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}
