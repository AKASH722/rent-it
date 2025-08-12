import prisma from "@/lib/prisma";
import { findCurrentUser } from "@/db/user";

export async function createProductRecord({
  name,
  description,
  units = 1,
  basePricePerHour = 0,
  basePricePerDay = 0,
  basePricePerWeek = 0,
  LateFeePerHour,
  categoryId = null,
  slug,
  imageUrl = null,
  priceList = null,
  attributes = [],
}) {
  const user = await findCurrentUser();

  const productData = {
    name,
    imageUrl,
    slug,
    description,
    units,
    basePricePerHour,
    basePricePerDay,
    basePricePerWeek,
    LateFeePerHour,
    ownerId: user.id,
    categoryId,
  };

  if (priceList) {
    productData.PriceList = {
      create: {
        name: priceList.name,
        startDate: priceList.startDate,
        endDate: priceList.endDate,
        multiplier: priceList.multiplier,
        // Connect customer groups if provided
        ...(priceList.customerGroups &&
          priceList.customerGroups.length > 0 && {
            customerGroup: {
              connect: priceList.customerGroups.map((groupId) => ({
                id: groupId,
              })),
            },
          }),
      },
    };
  }

  // Add ProductAttributes if provided
  if (attributes && attributes.length > 0) {
    productData.ProductAttribute = {
      create: attributes.map((attr) => ({
        key: attr.key,
        value: attr.value,
      })),
    };
  }

  return prisma.product.create({
    data: productData,
    include: {
      PriceList: {
        include: {
          customerGroup: true,
        },
      },
      ProductAttribute: true,
      category: true,
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}
export async function findProductBySlug(slug) {
  if (!slug) {
    throw new Error("Slug is required");
  }

  return prisma.product.findFirst({
    where: { slug },
    include: {
      ProductAttribute: true,
      category: true,
      PriceList: true,
    },
  });
}

export async function updateProduct(productId, updates) {
  if (!productId) {
    throw new Error("Product ID is required");
  }
  if (!updates || typeof updates !== "object") {
    throw new Error("Updates object is required");
  }
  return await updateProductRecord(productId, updates);
}

export async function updateProductRecord(productId, updates) {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  const user = await findCurrentUser();

  const existing = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      ownerId: true,
      PriceList: {
        include: {
          customerGroup: true, // fixed here
        },
      },
    },
  });

  if (!existing) {
    throw new Error("Product not found");
  }

  if (existing.ownerId !== user.id) {
    throw new Error("You do not have permission to edit this product");
  }

  const { categoryId, attributes, priceList, ...others } = updates;

  // Start building the update data
  const updateData = {
    // Handle category connection/disconnection
    ...(categoryId
      ? {
          category: { connect: { id: categoryId } },
        }
      : {
          category: { disconnect: true },
        }),

    // Handle attributes - delete all and recreate
    ProductAttribute: {
      deleteMany: {},
      create:
        attributes?.map((attr) => ({
          key: attr.key,
          value: attr.value,
        })) || [],
    },

    // Add other fields
    ...others,
  };

  // Handle price list operations
  if (priceList !== undefined) {
    if (priceList === null) {
      // Delete existing price lists
      updateData.PriceList = {
        deleteMany: {},
      };
    } else if (priceList) {
      if (priceList.id) {
        // Update existing price list
        updateData.PriceList = {
          update: {
            where: { id: priceList.id },
            data: {
              name: priceList.name,
              startDate: priceList.startDate,
              endDate: priceList.endDate,
              multiplier: priceList.multiplier,
              customerGroup: {
                deleteMany: {},
                create:
                  priceList.customerGroups?.map((groupId) => ({
                    id: groupId,
                  })) || [],
              },
            },
          },
        };
      } else {
        // Create new price list (delete existing first to avoid conflicts)
        updateData.PriceList = {
          deleteMany: {},
          create: {
            name: priceList.name,
            startDate: priceList.startDate,
            endDate: priceList.endDate,
            multiplier: priceList.multiplier,
            customerGroup: {
              create:
                priceList.customerGroups?.map((groupId) => ({
                  id: groupId,
                })) || [],
            },
          },
        };
      }
    }
  }

  return prisma.product.update({
    where: { id: productId },
    data: updateData,
    include: {
      category: true,
      ProductAttribute: true,
      PriceList: {
        include: {
          customerGroup: true,
        },
      },
    },
  });
}

export async function currentUserProduct() {
  const user = await findCurrentUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  return prisma.product.findMany({
    where: {
      ownerId: user.id,
    },
    orderBy: {
      name: "asc",
    },
    include: {
      category: true, // optional, include related category
    },
  });
}

export async function getAllProducts() {
  return prisma.product.findMany({
    include: {
      category: true,
      owner: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPaginatedProducts(page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize;

  return prisma.product.findMany({
    include: {
      category: true,
      owner: true,
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: pageSize,
  });
}

export async function getTotalProductsCount() {
  return prisma.product.count();
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
