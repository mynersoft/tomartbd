import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

import {getIdFromReq} from "@/lib/getIdFromReq";


export async function PUT(req, { params }) {
	try {

const id = getIdFromReq(req);
if (!id) {
    return NextResponse.json(
      { success: false, message: 'User ID is required' },
      { status: 400 }
    );
  }

		await connectDB();
       
        
		const { role } = await req.json();

		const user = await User.findByIdAndUpdate(id, { role }, { new: true });

		if (!user) throw new Error("User not found");

		return new Response(JSON.stringify({ success: true, user }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		return new Response(
			JSON.stringify({ success: false, error: err.message }),
			{ status: 400, headers: { "Content-Type": "application/json" } }
		);
	}
}












export async function DELETE(req, { params }) {

  const id = getIdFromReq(req);

  if (!id) {
    return NextResponse.json(
      { success: false, message: 'User ID is required' },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
   
    return NextResponse.json(
      {
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
