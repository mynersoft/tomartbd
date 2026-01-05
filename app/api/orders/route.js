import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { withErrorHandler } from '@/lib/withErrorHandler';
import { ApiError } from '@/lib/ApiError';
import crypto from 'crypto';
import { validateVoucher } from '@/lib/validateVoucher';
import { createAdminNotification } from "@/utils/createNotification";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    let orders;

    if (session.user.role === 'admin') {
      // Admin can see all orders
      orders = await Order.find().sort({ createdAt: -1 });
    } else {
      // User can see only their own orders
      orders = await Order.find({ userId: session.user.id }).sort({
        createdAt: -1,
      });
    }

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('GET ORDERS ERROR:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ Secure unique invoice
function generateInvoiceID() {
  return 'TMBD-' + crypto.randomBytes(3).toString('hex').toUpperCase();
}

export const POST = withErrorHandler(async (req) => {
  // 🔐 Auth
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new ApiError('Unauthorized', 401);
  }

  // 📦 Body
  let body;
  try {
    body = await req.json();
  } catch {
    throw new ApiError('Invalid JSON body', 400);
  }

  const { address, phone, cartItems, voucher, totalAmount, payment } = body;

  console.log(voucher, cartItems, '-------------------');

  if (!address || !cartItems) {
    throw new ApiError('Missing required fields', 400);
  }

  if (!address.area || !address.city || !address.thana) {
    throw new ApiError('Invalid address format', 400);
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new ApiError('Invalid products data', 400);
  }

  await connectDB();

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.discount
      ? (item.price * (100 - item.discount.value)) / 100
      : item.price;
    return sum + price * item.quantity;
  }, 0);

  // voucher validation


  const { discount } = await validateVoucher({
    voucherCode: voucher,
    cartItems,
    subtotal,
  });


  // 🔁 invoice retry (safe)
  let invoice;
  for (let i = 0; i < 5; i++) {
    invoice = generateInvoiceID();
    const exists = await Order.findOne({ invoice });
    if (!exists) break;
  }

  if (!invoice) {
    throw new ApiError('Invoice generation failed', 500);
  }

  // 🛒 Order create (NO TRANSACTION – safer on Vercel)
  const order = await Order.create({
    invoice,
    userId: session.user.id,
    customer: {
      name: session.user.name,
      email: session.user.email,
      phone,
    },
    total: totalAmount,
    subtotal: subtotal,
    shippingFee: 100,
    status: 'pending',
    payment: {
      method: payment?.method || 'COD',
      status: payment?.status || 'pending',
      transactionId: payment?.transactionId || null,
    },
    shippingAddress: {
      thana: address.thana,
      area: address.area,
      city: address.city,
      phone,
    },
    orderItems: cartItems.map((item) => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      image: item.image || '',
    })),
  });


await createAdminNotification({
    title: "New Order",
    message: `${session.user.name} placed an order`,
    type: "order",
    link: "/admin/orders",
  });



  return NextResponse.json(
    {
      success: true,
      message: 'Order created successfully',
      order: {
        id: order._id,
        invoice: order.invoice,
        subtotal: order.subtotal,
        total: order.total,
        status: order.status,
        shippingFee: order.shippingFee,
        createdAt: order.createdAt,
        voucher,
      },
    },
    { status: 200 }
  );
});
