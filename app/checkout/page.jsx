"use client";

import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "@/store/slices/cartSlice";
import { useEffect, useState } from "react";
import { useAddOrder } from "@/hooks/useOrder";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const mutation = useAddOrder();

  const [processing, setProcessing] = useState(false);
  const [bkashToken, setBkashToken] = useState(null);

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

  /* ================= PLACE ORDER ================= */
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

  /* ================= BKASH CREATE ================= */
  const startBkashPayment = async () => {
    setProcessing(true);
    toast.loading("Redirecting to bKash...", { id: "bkash" });

    const res = await fetch("/api/bkash/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: totalAmount,
        orderId: "ORD_" + Date.now(),
      }),
    });

    const data = await res.json();

    if (data.bkashURL && data.paymentID) {
      sessionStorage.setItem("bkash_paymentID", data.paymentID);
      sessionStorage.setItem("bkash_token", data.id_token);
      window.location.href = data.bkashURL;
    } else {
      toast.error("bKash initialization failed", { id: "bkash" });
      setProcessing(false);
    }
  };

  /* ================= BKASH EXECUTE (CALLBACK) ================= */
  useEffect(() => {
    const paymentID = searchParams.get("paymentID");

    if (!paymentID) return;

    const executeBkash = async () => {
      toast.loading("Confirming payment...", { id: "bkash-exec" });

      const token = sessionStorage.getItem("bkash_token");

      const res = await fetch("/api/bkash/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentID, token }),
      });

      const data = await res.json();

      if (data.statusCode === "0000") {
        toast.success("Payment successful", { id: "bkash-exec" });

        placeOrder({
          ...orderData,
          payment: {
            method: "bKash",
            status: "paid",
            transactionId: data.trxID,
          },
        });
      } else {
        toast.error("Payment failed", { id: "bkash-exec" });
        setProcessing(false);
      }
    };

    executeBkash();
  }, [searchParams]);

  /* ================= CONFIRM ORDER ================= */
  const handleConfirmOrder = async () => {
    if (!orderData.address || !orderData.city || !orderData.phone) {
      toast.error("Please fill all required fields");
      return;
    }

    if (orderData.payment.method === "COD") {
      placeOrder({
        ...orderData,
        payment: { method: "COD", status: "unpaid" },
      });
      return;
    }

    if (orderData.payment.method === "bKash") {
      startBkashPayment();
      return;
    }

    toast.error("Payment method not supported yet");
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

      {/* PAYMENT METHOD */}
      <div className="mb-5">
        <h2 className="font-semibold mb-2">Payment Method</h2>

        {["COD", "bKash"].map((method) => (
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
        className="w-full bg-black text-white py-3 rounded disabled:opacity-60"
      >
        {processing
          ? "Processing..."
          : `Confirm Order (${orderData.payment.method})`}
      </button>

      {/* ORDER SUMMARY */}
      <div className="mt-6 border-t pt-4">
        <h2 className="font-semibold mb-2">Order Summary</h2>
        {cart.map((item, i) => (
          <div key={i} className="flex justify-between">
            <span>
              {item.name} × {item.quantity}
            </span>
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