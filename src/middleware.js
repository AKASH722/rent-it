import { auth } from "@/lib/auth";

export default auth((req) => {
  const { auth: session, nextUrl } = req;

  const isAuthenticated = !!session;
  const userRole = session?.user?.role;
  const isOnEndUser = nextUrl.pathname.startsWith("/store");
  const isOnAuth = nextUrl.pathname === "/auth";

  const publicRoutes = ["/", "/auth"];
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  const isProtected = !isPublicRoute;

  if (!isAuthenticated && isProtected) {
    return Response.redirect(new URL("/auth", req.url));
  }

  if (isAuthenticated && isOnAuth) {
    if (userRole === "ENDUSER") {
      return Response.redirect(new URL("/store", req.url));
    } else if (userRole === "CUSTOMER") {
      return Response.redirect(new URL("/dashboard", req.url));
    } else {
      return Response.redirect(new URL("/", req.url));
    }
  }

  if (isOnEndUser && (!isAuthenticated || userRole !== "ENDUSER")) {
    return Response.redirect(new URL("/auth", req.url));
  }

  return null;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
