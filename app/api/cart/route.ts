import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User, { IUserDocument } from "@/models/User";
import { getUserFromToken } from "@/lib/auth";
import { TokenPayload } from "@/lib/types";

export async function GET(req: NextRequest) {
	await connectDB();

	const user: TokenPayload | null = await getUserFromToken(req);

	let cart: any[] = [];

	if (user) {
		const dbUser = (await User.findById(user.id).populate(
			"cart.product"
		)) as IUserDocument;
		cart = dbUser?.cart || [];
	} else {
		const cookieCart = req.cookies.get("cart")?.value;
		cart = cookieCart ? JSON.parse(cookieCart) : [];
	}

	return NextResponse.json({ cart });
}

export async function POST(req: NextRequest) {
	await connectDB();

	const { productId } = await req.json();
	const user: TokenPayload | null = await getUserFromToken(req);

	if (user) {
		const dbUser = (await User.findById(user.id)) as IUserDocument;
		if (!dbUser)
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);

		const existing = dbUser.cart.find(
			(c) => c.product.toString() === productId
		);

		if (existing) {
			dbUser.cart = dbUser.cart.filter(
				(c) => c.product.toString() !== productId
			);
		} else {
			dbUser.cart.push({ product: productId, quantity: 1 });
		}

		await dbUser.save();
		return NextResponse.json({ success: true, cart: dbUser.cart });
	}

	// Guest
	const cookieCart = req.cookies.get("cart")?.value;
	const cart = cookieCart ? JSON.parse(cookieCart) : [];

	const existing = cart.find((c: any) => c.product === productId);

	if (existing) {
		const newCart = cart.filter((c: any) => c.product !== productId);
		const res = NextResponse.json({ success: true, cart: newCart });
		res.cookies.set("cart", JSON.stringify(newCart), { path: "/" });
		return res;
	}

	const newCart = [...cart, { product: productId, quantity: 1 }];
	const res = NextResponse.json({ success: true, cart: newCart });
	res.cookies.set("cart", JSON.stringify(newCart), { path: "/" });
	return res;
}
