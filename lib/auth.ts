import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { TokenPayload } from "./types";

export async function getUserFromToken(req: NextRequest): Promise<TokenPayload | null> {
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");

    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
        const user = await User.findById(decoded.id);
        if (!user) return null;

        return {
            id: user.id,
            _id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
        };
    } catch (err) {
        console.error("Token verification failed:", err);
        return null;
    }
}