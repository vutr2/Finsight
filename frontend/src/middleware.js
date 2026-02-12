import { authMiddleware } from "@descope/nextjs-sdk/server";

export default authMiddleware({
  projectId: process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID || "",
  redirectUrl: "/login",
  publicRoutes: ["/login", "/api/:path*"],
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/|.*\\.svg$).*)"],
};
