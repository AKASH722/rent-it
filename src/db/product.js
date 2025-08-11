
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
    imageUrl = null
}) {
    const user = await findCurrentUser();

    return prisma.product.create({
        data: {
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

export async function updateProductRecord(productId, updates) {
    if (!productId) {
        throw new Error("Product ID is required");
    }

    const user = await findCurrentUser();
    const existing = await prisma.product.findUnique({
        where: { id: productId },
        select: { ownerId: true },
    });

    if (!existing) {
        throw new Error("Product not found");
    }
    if (existing.ownerId !== user.id) {
        throw new Error("You do not have permission to edit this product");
    }

    const { categoryId, attributes, ...others } = updates;

    return prisma.product.update({
        where: { id: productId },
        data: {
            ...(categoryId ? {
                category: { connect: { id: categoryId } }
            } : {
                category: { disconnect: true }
            }),
            ProductAttribute: {
                deleteMany: {},
                create: attributes?.map(attr => ({
                    key: attr.key,
                    value: attr.value
                })) || []
            },
            ...others
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