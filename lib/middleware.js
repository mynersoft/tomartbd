import { withAuth } from "next-auth/middleware";

export default withAuth(
	function middleware(req) {},
	{
		callbacks: {
			authorized: ({ token }) => {
				return !!token; // logged in user only
			},
		},
	}
);

// Protected routes
export const config = {
	matcher: [
		"/dashboard/:path*",
		"/admin/:path*",
		"/api/orders/:path*",
	],
};