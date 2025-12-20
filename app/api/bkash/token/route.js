import axios from "axios";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const res = await axios.post(
      `${process.env.BKASH_BASE_URL}/tokenized/checkout/token/grant`,
      {
        app_key: process.env.BKASH_APP_KEY,
        app_secret: process.env.BKASH_APP_SECRET,
      },
      {
        headers: {
          username: process.env.BKASH_USERNAME,
          password: process.env.BKASH_PASSWORD,
        },
      }
    );

    return NextResponse.json(res.data);
  } catch (error) {
    return NextResponse.json(
      { message: "Token error" },
      { status: 500 }
    );
  }
}