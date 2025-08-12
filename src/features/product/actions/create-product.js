"use server";

import slugify from "slugify";
import prisma from "@/lib/prisma";
import { createProductRecord, findProductBySlug as findProductBySlugDb } from "@/db/product";
import { updateProductRecord } from "@/db/product";
import { fetchAllCategories } from "@/db/category";

export async function generateUniqueSlug(title) {
    const baseSlug = slugify(title, { lower: true, strict: true, trim: true });

    const existingSlugs = await fetchSlugsStartingWith(baseSlug);
    const slugSet = new Set(existingSlugs);

    if (!slugSet.has(baseSlug)) return baseSlug;

    let counter = 1;
    let newSlug = `${baseSlug}-${counter}`;

    while (slugSet.has(newSlug)) {
        counter += 1;
        newSlug = `${baseSlug}-${counter}`;
    }

    return newSlug;
}

async function fetchSlugsStartingWith(baseSlug) {
    const slugs = await prisma.product.findMany({
        where: { slug: { startsWith: baseSlug } },
        select: { slug: true },
    });

    return slugs.map((item) => item.slug);
}

export async function createProduct({
    name,
    description,
    units = 1,
    basePricePerHour = null,
    basePricePerDay = null,
    basePricePerWeek = null,
    LateFeePerHour,
    imageUrl = null,
    categoryId = null,
    priceList = [],
    attributes = []
}) {
    if (!name) throw new Error("Product name is required");
    if (LateFeePerHour == null) throw new Error("Late fee per hour is required");

    const slug = await generateUniqueSlug(name);

    return createProductRecord({
        name,
        description,
        units,
        basePricePerHour,
        basePricePerDay,
        basePricePerWeek,
        imageUrl,
        LateFeePerHour,
        categoryId,
        slug,
        priceList,
        attributes
    });
}


export async function findProductBySlug(slug) {
    if (!slug) throw new Error("Slug is required");
    return await findProductBySlugDb(slug);
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




export async function getCustomerGroups() {
    return await prisma.customerGroup.findMany({})
}