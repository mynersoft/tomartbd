import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { paymentID, token } = await req.json();

  const res = await axios.post(
    `${process.env.BKASH_BASE_URL}/tokenized/checkout/execute`,
    { paymentID },
    {
      headers: {
        Authorization: token,
        "X-APP-Key": process.env.BKASH_APP_KEY,
      },
    }
  );

  return NextResponse.json(res.data);
}