import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/brevo";

/**
 * Generates a magic login link for a user and sends it via Brevo email.
 *
 * @param {string} userEmail - The email of the user to send the magic link to.
 * @returns {Promise<{success: boolean, error?: string, message?: string}>}
 */
export async function sendMagicLink(userEmail) {
  // 1️⃣ Find user
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    return { success: false, error: "User not found" };
  }

  // 2️⃣ Create token
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // expires in 15 mins

  // 3️⃣ Save token in DB
  await prisma.magicLinkToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });

  // 4️⃣ Build magic link
  const magicLinkUrl = `${process.env.NEXT_PUBLIC_APP_URL}/magic-login?token=${token}`;

  // 5️⃣ Send email
  const emailSent = await sendEmail({
    recipients: [{ email: user.email, name: user.name || "" }],
    subject: "Your Magic Login Link",
    html: `
      <p>Hello ${user.name || "there"},</p>
      <p>Click below to log in. This link expires in 15 minutes:</p>
      <p><a href="${magicLinkUrl}" target="_blank">${magicLinkUrl}</a></p>
      <p>If you didn’t request this, you can ignore this email.</p>
    `,
    tags: ["magic-link"],
  });

  if (!emailSent) {
    return { success: false, error: "Failed to send magic link email" };
  }

  return { success: true, message: "Magic link sent successfully" };
}

/**
 * Verifies a magic link token
 * @param {string} token - The token from the magic link
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export async function verifyMagicLink(token) {
  try {
    const record = await prisma.magicLinkToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!record) {
      return { success: false, error: "Invalid or expired link" };
    }

    if (record.used) {
      return { success: false, error: "Link already used" };
    }

    if (record.expiresAt < new Date()) {
      return { success: false, error: "Link has expired" };
    }

    await prisma.magicLinkToken.update({
      where: { id: record.id },
      data: { used: true },
    });

    await prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: true },
    });

    return { success: true, user: { ...record.user, emailVerified: true } };
  } catch (error) {
    console.error("Error verifying magic link:", error);
    return { success: false, error: error.message };
  }
}
