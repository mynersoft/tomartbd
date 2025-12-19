"use client";

import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "@/store/slices/cartSlice";
import { useEffect, useState } from "react";
import { useAddOrder } from "@/hooks/useOrder";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const mutation = useAddOrder();

  const [processing, setProcessing] = useState(false);

  const [orderData, setOrderData] = useState({
    address: "",
    city: "",
    phone: "",
    totalAmount: 0,
    payment: {
      method: "COD",
      status: "unpaid",
      transactionId: null,
    },
    products: [],
  });

  /* ---------------- PRODUCTS ---------------- */
  useEffect(() => {
    setOrderData((prev) => ({
      ...prev,
      products: cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    }));
  }, [cart]);

  /* ---------------- TOTAL ---------------- */
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    setOrderData((prev) => ({
      ...prev,
      totalAmount,
    }));
  }, [totalAmount]);

  /* ---------------- INPUT ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (method) => {
    setOrderData((prev) => ({
      ...prev,
      payment: { ...prev.payment, method },
    }));
  };

  /* =====================================================
     MOCK PAYMENT GATEWAY (Stripe-like)
     ===================================================== */
  const openPaymentGateway = async () => {
    setProcessing(true);
    toast.loading("Redirecting to payment...", { id: "pay" });

    // simulate gateway delay
    await new Promise((res) => setTimeout(res, 2000));

    // simulate success
    const fakeTransactionId = "TXN_" + Date.now();

    toast.success("Payment Successful", { id: "pay" });

    return {
      success: true,
      transactionId: fakeTransactionId,
    };
  };

  /* ---------------- PLACE ORDER ---------------- */
  const placeOrder = (finalOrderData) => {
    mutation.mutate(finalOrderData, {
      onSuccess: (newOrder) => {
        dispatch(clearCart());
        router.push(`/checkout/success?orderId=${newOrder._id}`);
      },
      onError: () => {
        toast.error("Order failed");
        setProcessing(false);
      },
    });
  };

  /* ---------------- CONFIRM ---------------- */
  const handleConfirmOrder = async () => {
    if (!orderData.address || !orderData.city || !orderData.phone) {
      toast.error("Fill all fields");
      return;
    }

    // ✅ COD
    if (orderData.payment.method === "COD") {
      placeOrder({
        ...orderData,
        payment: {
          method: "COD",
          status: "unpaid",
        },
      });
      return;
    }

    // ✅ ONLINE PAYMENT
    const paymentResult = await openPaymentGateway();

    if (paymentResult.success) {
      placeOrder({
        ...orderData,
        payment: {
          method: orderData.payment.method,
          status: "paid",
          transactionId: paymentResult.transactionId,
        },
      });
    } else {
      toast.error("Payment failed");
      setProcessing(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <input
        className="w-full border p-2 mb-3 rounded"
        placeholder="Address"
        name="address"
        value={orderData.address}
        onChange={handleChange}
      />

      <input
        className="w-full border p-2 mb-3 rounded"
        placeholder="City"
        name="city"
        value={orderData.city}
        onChange={handleChange}
      />

      <input
        className="w-full border p-2 mb-4 rounded"
        placeholder="Phone"
        name="phone"
        value={orderData.phone}
        onChange={handleChange}
      />

      {/* PAYMENT */}
      <div className="mb-5">
        <h2 className="font-semibold mb-2">Payment Method</h2>

        {["COD", "bKash", "Nagad", "Rocket"].map((method) => (
          <label key={method} className="flex items-center gap-2 mb-2">
            <input
              type="radio"
              checked={orderData.payment.method === method}
              onChange={() => handlePaymentChange(method)}
            />
            {method}
          </label>
        ))}
      </div>

      <button
        disabled={processing}
        onClick={handleConfirmOrder}
        className="w-full bg-black text-white py-3 rounded"
      >
        {processing
          ? "Processing..."
          : `Confirm Order (${orderData.payment.method})`}
      </button>

      {/* SUMMARY */}
      <div className="mt-6 border-t pt-4">
        <h2 className="font-semibold mb-2">Order Summary</h2>
        {cart.map((item, i) => (
          <div key={i} className="flex justify-between">
            <span>{item.name} × {item.quantity}</span>
            <span>৳{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold mt-2">
          <span>Total</span>
          <span>৳{totalAmount}</span>
        </div>
      </div>
    </div>
  );
}