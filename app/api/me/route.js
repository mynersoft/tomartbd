import { NextResponse } from "next/server";
export async function GET(req, { contexts }) {
    const id = contexts;
    console.log(id);
    return NextResponse.json({ success: true, message: id }, { status: 200 });
}
