'use client';

import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '@/store/slices/cartSlice';
import { useEffect, useState } from 'react';
import { useAddOrder } from '@/hooks/useOrder';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import {
	CreditCard,
	Wallet,
	Truck,
	MapPin,
	Phone,
	Building,
	Lock,
	CheckCircle2,
	Loader2,
	ArrowLeft,
	ShoppingBag,
} from 'lucide-react';
import Image from 'next/image';
import { shippingCost, tax } from '../../utils/shippingCost';
import useLoginUser from '@/hooks/useAuth';

export default function CheckoutClient() {
	const { user } = useLoginUser();
	console.log(user);

	const router = useRouter();
	const searchParams = useSearchParams();
	const dispatch = useDispatch();
	const cart = useSelector((state) => state.cart.items);
	const mutation = useAddOrder();

	const [processing, setProcessing] = useState(false);

	const [orderData, setOrderData] = useState({
		address: '',
		city: '',
		phone: user?.phone || '',
		totalAmount: 0,
		payment: {
			method: 'COD',
			status: 'unpaid',
			transactionId: null,
		},
		products: [],
	});

	/* ================= PRODUCTS ================= */
	useEffect(() => {
		setOrderData((prev) => ({
			...prev,
			products: cart.map((item) => ({
				productId: item._id || item.productId,
				name: item.name,
				quantity: item.quantity,
				price: item.discount
					? (item.price * (100 - item.discount)) / 100
					: item.price,
				image: item.images?.[0],
			})),
		}));
	}, [cart]);

	/* ================= TOTAL ================= */
	const totalAmount = cart.reduce((sum, item) => {
		const itemPrice = item.discount
			? (item.price * (100 - item.discount)) / 100
			: item.price;
		return sum + itemPrice * item.quantity;
	}, 0);

	const shippingFee = totalAmount > 2000 ? 0 : 120;
	const taxData = tax;
	const grandTotal = totalAmount + shippingFee + taxData;

	useEffect(() => {
		setOrderData((prev) => ({
			...prev,
			totalAmount: grandTotal,
		}));
	}, [grandTotal]);

	/* ================= INPUT ================= */
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
	const placeOrder = (finalOrder) => {
		mutation.mutate(finalOrder, {
			onSuccess: (order) => {
				dispatch(clearCart());
				toast.success('Order placed successfully!');
				router.push(`/checkout/success?orderId=${order._id}`);
			},
			onError: () => {
				toast.error('Order failed. Please try again');
				setProcessing(false);
			},
		});
	};

	/* ================= BKASH CREATE ================= */
	const startBkashPayment = async () => {
		try {
			setProcessing(true);
			toast.loading('Redirecting to bKash...', { id: 'bkash' });

			const res = await fetch('/api/bkash/create', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					amount: grandTotal,
					orderId: 'ORD_' + Date.now(),
				}),
			});

			const data = await res.json();

			if (!data?.bkashURL || !data?.paymentID) {
				throw new Error('bKash initialization failed');
			}

			sessionStorage.setItem('bkash_token', data.id_token);
			window.location.href = data.bkashURL;
		} catch (err) {
			toast.error('bKash payment failed', { id: 'bkash' });
			setProcessing(false);
		}
	};

	/* ================= BKASH EXECUTE (CALLBACK) ================= */
	useEffect(() => {
		const paymentID = searchParams.get('paymentID');
		if (!paymentID) return;

		const executeBkashPayment = async () => {
			try {
				toast.loading('Confirming payment...', { id: 'bkash-exec' });

				const token = sessionStorage.getItem('bkash_token');

				const res = await fetch('/api/bkash/execute', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ paymentID, token }),
				});

				const data = await res.json();

				if (data?.statusCode !== '0000') {
					throw new Error('Payment not completed');
				}

				toast.success('Payment successful', { id: 'bkash-exec' });

				placeOrder({
					...orderData,
					payment: {
						method: 'bKash',
						status: 'paid',
						transactionId: data.trxID,
					},
				});
			} catch (err) {
				toast.error('Payment verification failed', {
					id: 'bkash-exec',
				});
				setProcessing(false);
			}
		};

		executeBkashPayment();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	/* ================= CONFIRM ORDER ================= */
	const handleConfirmOrder = () => {
		if (!orderData.address || !orderData.city || !orderData.phone) {
			toast.error('Please fill all required fields');
			return;
		}

		if (orderData.payment.method === 'COD') {
			setProcessing(true);
			placeOrder({
				...orderData,
				payment: {
					method: 'COD',
					status: 'unpaid',
					transactionId: null,
				},
			});
			return;
		}

		if (orderData.payment.method === 'bKash') {
			startBkashPayment();
			return;
		}

		toast.error('Payment method not supported');
	};

	if (!cart) {
		return <div>Not found</div>;
	}

	/* ================= UI ================= */
	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="flex items-center gap-3 mb-2">
				<button
					onClick={() => router.back()}
					className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
					aria-label="Go back">
					<ArrowLeft size={20} />
				</button>
				<h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
			</div>
			<p className="text-gray-600 mb-8 ml-12">Complete your order</p>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Left Column - Order Details */}
				<div className="space-y-8">
					{/* Shipping Information */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<div className="flex items-center gap-3 mb-6">
							<div className="p-2 bg-blue-100 rounded-lg">
								<MapPin className="text-blue-600" size={20} />
							</div>
							<h2 className="text-xl font-bold text-gray-900">
								Shipping Information
							</h2>
						</div>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									<div className="flex items-center gap-2">
										<Building size={16} />
										Address
									</div>
								</label>
								<input
									type="text"
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
									placeholder="Enter your full address"
									name="address"
									value={orderData.address}
									onChange={handleChange}
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									<div className="flex items-center gap-2">
										<MapPin size={16} />
										City
									</div>
								</label>
								<input
									type="text"
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
									placeholder="Enter your city"
									name="city"
									value={orderData.city}
									onChange={handleChange}
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									<div className="flex items-center gap-2">
										<Phone size={16} />
										Phone Number
									</div>
								</label>
								<input
									type="tel"
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
									placeholder="01XXXXXXXXX"
									name="phone"
									value={orderData.phone}
									onChange={handleChange}
								/>
							</div>
						</div>
					</div>

					{/* Payment Method */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<div className="flex items-center gap-3 mb-6">
							<div className="p-2 bg-blue-100 rounded-lg">
								<CreditCard
									className="text-blue-600"
									size={20}
								/>
							</div>
							<h2 className="text-xl font-bold text-gray-900">
								Payment Method
							</h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{/* Cash on Delivery */}
							<button
								onClick={() => handlePaymentChange('COD')}
								className={`p-4 border-2 rounded-xl transition-all ${
									orderData.payment.method === 'COD'
										? 'border-green-500 bg-green-50'
										: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
								}`}>
								<div className="flex items-center gap-3">
									<div
										className={`p-2 rounded-lg ${
											orderData.payment.method === 'COD'
												? 'bg-green-100 text-green-600'
												: 'bg-gray-100 text-gray-600'
										}`}>
										<Truck size={20} />
									</div>
									<div className="text-left">
										<div className="flex items-center gap-2">
											<span className="font-semibold">
												Cash on Delivery
											</span>
											{orderData.payment.method ===
												'COD' && (
												<CheckCircle2
													size={16}
													className="text-green-500"
												/>
											)}
										</div>
										<p className="text-sm text-gray-500 mt-1">
											Pay when you receive
										</p>
									</div>
								</div>
							</button>

							{/* bKash */}
							<button
								onClick={() => handlePaymentChange('bKash')}
								className={`p-4 border-2 rounded-xl transition-all ${
									orderData.payment.method === 'bKash'
										? 'border-pink-500 bg-pink-50'
										: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
								}`}>
								<div className="flex items-center gap-3">
									<div
										className={`p-2 rounded-lg ${
											orderData.payment.method === 'bKash'
												? 'bg-pink-100 text-pink-600'
												: 'bg-gray-100 text-gray-600'
										}`}>
										<Wallet size={20} />
									</div>
									<div className="text-left">
										<div className="flex items-center gap-2">
											<span className="font-semibold">
												bKash
											</span>
											{orderData.payment.method ===
												'bKash' && (
												<CheckCircle2
													size={16}
													className="text-pink-500"
												/>
											)}
										</div>
										<p className="text-sm text-gray-500 mt-1">
											Pay with mobile wallet
										</p>
									</div>
								</div>
							</button>
						</div>

						{orderData.payment.method === 'bKash' && (
							<div className="mt-4 p-4 bg-blue-50 rounded-lg">
								<div className="flex items-center gap-3">
									<Lock size={16} className="text-blue-600" />
									<p className="text-sm text-blue-700">
										You will be redirected to bKash for
										secure payment
									</p>
								</div>
							</div>
						)}
					</div>

					{/* Order Items */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<div className="flex items-center gap-3 mb-6">
							<div className="p-2 bg-blue-100 rounded-lg">
								<ShoppingBag
									className="text-blue-600"
									size={20}
								/>
							</div>
							<h2 className="text-xl font-bold text-gray-900">
								Order Items
							</h2>
							<span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
								{cart.length} items
							</span>
						</div>

						<div className="space-y-4">
							{cart.map((item, index) => {
								const itemPrice = item.discount
									? (item.price * (100 - item.discount)) / 100
									: item.price;
								const itemTotal = itemPrice * item.quantity;

								return (
									<div
										key={index}
										className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg">
										<div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
											<img
												src={
													item.images?.[0] ||
													'/default-image.png'
												}
												alt={item.name}
												className="w-full h-full object-cover"
											/>
										</div>
										<div className="flex-1">
											<h3 className="font-medium text-gray-900">
												{item.name}
											</h3>
											<p className="text-sm text-gray-500">
												{item.brand}
											</p>
											{item.discount > 0 && (
												<span className="text-xs text-red-600 font-medium">
													{item.discount}% OFF
												</span>
											)}
										</div>
										<div className="text-right">
											<div className="font-medium text-gray-900">
												৳{itemPrice.toFixed(2)}
											</div>
											<div className="text-sm text-gray-500">
												Qty: {item.quantity}
											</div>
											<div className="font-bold text-gray-900 mt-1">
												৳{itemTotal.toFixed(2)}
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>

				{/* Right Column - Order Summary & Checkout */}
				<div className="space-y-8">
					{/* Order Summary */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
						<h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
							Order Summary
						</h2>

						<div className="space-y-3 mb-4">
							<div className="flex justify-between">
								<span className="text-gray-600">Subtotal</span>
								<span className="font-medium">
									৳{totalAmount.toFixed(2)}
								</span>
							</div>

							<div className="flex justify-between">
								<span className="text-gray-600">Shipping</span>
								<span
									className={
										shippingFee === 0
											? 'text-green-600 font-medium'
											: 'font-medium'
									}>
									{shippingFee === 0
										? 'FREE'
										: `৳${shippingCost.toFixed(2)}`}
								</span>
							</div>

							<div className="flex justify-between">
								<span className="text-gray-600">
									Tax (VAT {taxData}%)
								</span>
								<span className="font-medium">
									৳{taxData.toFixed(2)}
								</span>
							</div>
						</div>

						<div className="border-t border-gray-200 pt-4 mb-6">
							<div className="flex justify-between items-center">
								<span className="text-lg font-bold text-gray-900">
									Total Amount
								</span>
								<div className="text-right">
									<div className="text-2xl font-bold text-blue-600">
										৳{grandTotal.toFixed(2)}
									</div>
									<p className="text-sm text-gray-500">
										Inclusive of all taxes
									</p>
								</div>
							</div>
						</div>

						{/* Shipping Notice */}
						{shippingFee === 0 && (
							<div className="mb-6 p-4 bg-green-50 rounded-lg">
								<div className="flex items-center gap-3">
									<Truck
										size={18}
										className="text-green-600"
									/>
									<p className="text-sm text-green-700 font-medium">
										🎉 Free shipping on orders over ৳2000!
									</p>
								</div>
							</div>
						)}

						{/* Terms & Conditions */}
						<div className="mb-6">
							<label className="flex items-start gap-3">
								<input
									type="checkbox"
									className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
									required
								/>
								<span className="text-sm text-gray-600">
									I agree to the{' '}
									<a
										href="/terms"
										className="text-blue-600 hover:underline">
										Terms & Conditions
									</a>{' '}
									and{' '}
									<a
										href="/privacy"
										className="text-blue-600 hover:underline">
										Privacy Policy
									</a>
								</span>
							</label>
						</div>

						{/* Confirm Order Button */}
						<button
							onClick={handleConfirmOrder}
							disabled={processing || cart.length === 0}
							className="w-full flex items-center justify-center gap-3 bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed">
							{processing ? (
								<>
									<Loader2
										size={20}
										className="animate-spin"
									/>
									Processing...
								</>
							) : (
								<>
									{orderData.payment.method === 'COD' ? (
										<>
											<Truck size={20} />
											Place Order (Cash on Delivery)
										</>
									) : (
										<>
											<Wallet size={20} />
											Pay with bKash
										</>
									)}
								</>
							)}
						</button>

						{/* Security Badge */}
						<div className="mt-6 pt-6 border-t border-gray-100">
							<div className="flex items-center justify-center gap-2">
								<Lock size={16} className="text-gray-400" />
								<p className="text-sm text-gray-500">
									Secure checkout • 256-bit SSL encryption
								</p>
							</div>
						</div>
					</div>

					{/* Need Help */}
					<div className="bg-blue-50 rounded-xl p-6">
						<h3 className="font-bold text-gray-900 mb-3">
							Need Help?
						</h3>
						<div className="space-y-2">
							<p className="text-sm text-gray-600">
								<span className="font-medium">Phone:</span>{' '}
								09678-123456
							</p>
							<p className="text-sm text-gray-600">
								<span className="font-medium">Email:</span>{' '}
								support@store.com
							</p>
							<p className="text-sm text-gray-600">
								<span className="font-medium">Hours:</span> 9AM
								- 11PM, 7 days a week
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
