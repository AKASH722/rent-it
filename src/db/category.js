import prisma from "@/lib/prisma";

/**
 * Fetches all categories from the database.
 */
export const fetchAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
};
