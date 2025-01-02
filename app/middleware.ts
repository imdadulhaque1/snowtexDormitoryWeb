// app/middleware.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
export function middleware(req: Request) {
  const cookieStore = cookies();
  const token: any = cookieStore.get("authToken")?.value || null;

  console.log("Token from Middleware: ", token); // Log token for debugging purposes (can be removed in production)

  // If no token is found, redirect to root page
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url)); // Redirect if no token
  }

  try {
    // Verify the token using the JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const { exp } = decoded as { exp: number }; // Extract expiration time from decoded token

    // If the token is expired, redirect to root page
    if (exp * 1000 < Date.now()) {
      return NextResponse.redirect(new URL("/", req.url)); // Redirect if expired
    }
  } catch (err) {
    // If token verification fails, log the error and redirect to root page
    console.error("Invalid token", err);
    return NextResponse.redirect(new URL("/", req.url)); // Redirect if invalid token
  }

  // If token is valid, proceed with the request
  return NextResponse.next();
}

export const config = {
  matcher: "/admin*", // Apply to all routes starting with /admin
};
