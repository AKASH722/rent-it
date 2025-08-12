// app/api/verify-magic/route.js
import { NextResponse } from "next/server";
import { verifyMagicLink } from "@/lib/magic-link";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(
        new URL("/login?error=missing_token", req.url)
      );
    }

    const result = await verifyMagicLink(token);

    if (!result.success) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(result.error)}`, req.url)
      );
    }

    // Redirect to dashboard or home
    return NextResponse.redirect(new URL("/auth", req.url));
  } catch (error) {
    console.error("Error in verify-magic route:", error);
    return NextResponse.redirect(new URL("/login?error=server_error", req.url));
  }
}
