import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { withErrorHandler } from '@/lib/withErrorHandler';
import { ApiError } from '@/lib/ApiError';
import crypto from 'crypto';
import { validateVoucher } from '@/lib/validateVoucher';
import { createAdminNotification } from '@/utils/createNotification';
import { shippingCost } from '@/utils/shippingCost';

// Types
interface CartItem {
  salePrice: number;
  productId: string;
  name: string;
  quantity: number;
  regularPrice: number;
  image?: string;
  discount?: {
    value: number;
  };
}

interface Address {
  thana: string;
  area: string;
  city: string;
}

interface PaymentInfo {
  method?: string;
  status?: 'unpaid' | 'paid' | 'failed';
  transactionId?: string;
}

interface OrderRequestBody {
  address: Address;
  phone: string;
  cartItems: CartItem[];
  voucherCode?: string;
  payment?: PaymentInfo;
}

interface VoucherResponse {
  valid: boolean;
  discount: number;
  message?: string;
}

export async function GET(req: NextRequest) {
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
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}

// ✅ Secure unique invoice
function generateInvoiceID(): string {
  return 'TMBD-' + crypto.randomBytes(3).toString('hex').toUpperCase();
}

export const POST = withErrorHandler(async (req: NextRequest) => {
  // 🔐 Auth
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new ApiError('Unauthorized', 401);
  }

  // 📦 Body
  let body: OrderRequestBody;
  try {
    body = await req.json();
  } catch {
    throw new ApiError('Invalid JSON body', 400);
  }

  const { address, phone, cartItems, voucherCode, payment } = body;

  // Validation
  if (!address || !phone || !cartItems) {
    throw new ApiError('Missing required fields', 400);
  }

  if (!address.area || !address.city || !address.thana) {
    throw new ApiError('Invalid address format', 400);
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new ApiError('Invalid products data', 400);
  }

  await connectDB();

  
  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.discount
      ? (item.salePrice * (100 - item.discount.value)) / 100
      : item.salePrice;
    return sum + price * item.quantity;
  }, 0);



  // Voucher validation
  let discountAmount = 0;

  if (voucherCode) {
    try {
      const voucherResponse = await validateVoucher({
        voucherCode,
        cartItems,
        subtotal,
      });
      const checkedVoucher: VoucherResponse = await voucherResponse.json();

      if (checkedVoucher.valid && checkedVoucher.discount) {
        discountAmount = checkedVoucher.discount;
      }
    } catch (error) {
      console.error('Voucher validation error:', error);
      // Continue without discount if voucher validation fails
    }
  }

  // Calculate shipping fee
  const shippingFee = shippingCost;

  // Calculate total (FIXED: proper calculation)
  const total = subtotal + shippingFee - discountAmount;

  // 🔁 Invoice retry (safe)
  let invoice: string | null = null;
  for (let i = 0; i < 5; i++) {
    invoice = generateInvoiceID();
    const exists = await Order.findOne({ invoice });
    if (!exists) break;
    invoice = null;
  }

  if (!invoice) {
    throw new ApiError('Invoice generation failed', 500);
  }

  // 🛒 Order create (NO TRANSACTION – safer on Vercel)
  const order = await Order.create({
    invoiceNo: invoice,
    userId: session.user.id,
    customer: {
      name: session.user.name,
      email: session.user.email,
      phone,
    },
    subtotal,
    total,
    shippingFee,
    status: 'pending',
    discount: discountAmount,
    payment: {
      method: payment?.method || 'COD',
      status: payment?.status || 'unpaid',
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

  // Optionally create admin notification
  // await createAdminNotification({
  //   title: 'New Order',
  //   message: `${session.user.name} placed an order`,
  //   type: 'order',
  //   link: '/admin/orders',
  // });

  return NextResponse.json(
    {
      success: true,
      message: 'Order created successfully',
      order,
    },
    { status: 200 }
  );
});
