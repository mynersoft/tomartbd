import { NextResponse } from "next/server";
import { verifyToken } from "./lib/jwt";

export function middleware(req) {
	const token = req.cookies.get("token")?.value;

	const url = req.nextUrl.pathname;

	// PROTECTED USER ROUTES
	if (url.startsWith("/dashboard")) {
		if (!token)
			return NextResponse.redirect(new URL("/auth/login", req.url));

		const decoded = verifyToken(token);
		if (!decoded)
			return NextResponse.redirect(new URL("/auth/login", req.url));
	}

	// ADMIN PROTECTED
	if (url.startsWith("/admin")) {
		if (!token)
			return NextResponse.redirect(new URL("/auth/login", req.url));

		const decoded = verifyToken(token);
		if (decoded.role !== "admin")
			return NextResponse.redirect(new URL("/dashboard", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*", "/admin/:path*"],
};
