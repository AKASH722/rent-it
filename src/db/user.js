import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * Finds the currently authenticated user from the session.
 */
export const findCurrentUser = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  return prisma.user.findUnique({
    where: { id: session.user.id },
  });
};

/**
 * Finds a user by their email.
 * @param email - The username to look up.
 */
export const findByEmail = async (email) => {
  if (!email) {
    throw new Error("Username is required");
  }

  return prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
};

/**
 * Creates a user in the database.
 * @param {Object} data
 */
export const createUser = async (data) => {
  return prisma.user.create({ data });
};
