"use server";

import bcrypt from "bcryptjs";
import { createUser, findByEmail } from "@/db/user";

export async function signupUser(data) {
  try {
    const { name, email, phone, password, role } = data;

    const existing = await findByEmail(email);

    if (existing) {
      return { success: false, error: "Email already registered" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await createUser({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role,
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
