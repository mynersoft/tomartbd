import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { amount, orderId } = await req.json();

  const tokenRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/bkash/token`,
    { method: "POST" }
  );

  const tokenData = await tokenRes.json();

  const paymentRes = await axios.post(
    `${process.env.BKASH_BASE_URL}/tokenized/checkout/create`,
    {
      mode: "0011",
      payerReference: "customer",
      callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/bkash-callback`,
      amount,
      currency: "BDT",
      intent: "sale",
      merchantInvoiceNumber: orderId,
    },
    {
      headers: {
        Authorization: tokenData.id_token,
        "X-APP-Key": process.env.BKASH_APP_KEY,
      },
    }
  );

  return NextResponse.json(paymentRes.data);
}