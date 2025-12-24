import { Minus, Plus, Shield, ShoppingCart, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { removeFromCart, updateQuantity } from '@/store/slices/cartSlice';
import { useDispatch } from 'react-redux';
import Link from 'next/link';

const CardDrawer = ({ items, isCartOpen, cartRef, qty, setIsCartOpen }) => {
	const dispatch = useDispatch();

	const totalPrice = items.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);
	const handleQuantityChange = (productId, newQty) => {
		if (newQty < 1) return;
		dispatch(updateQuantity({ productId, quantity: newQty }));
	};
	const handleCheckout = () => {
		setIsCartOpen(false);
		router.push('/checkout');
	};

	const handleQuickOrder = (item) => {
		dispatch({
			type: 'cart/addToCart',
			payload: { ...item, quantity: 1 },
		});
		setIsCartOpen(false);
		router.push('/checkout');
	};
	
	return (
		<div
			className={`fixed inset-0 z-50 transition-opacity duration-300 ${
				isCartOpen
					? 'opacity-100 pointer-events-auto'
					: 'opacity-0 pointer-events-none'
			}`}
			aria-hidden={!isCartOpen}>
			<div
				className="absolute inset-0 bg-black/40"
				onClick={() => setIsCartOpen(false)}
			/>

			<aside
				ref={cartRef}
				className={`absolute top-0 right-0 h-full w-full md:w-[420px] bg-white shadow-xl transform transition-transform duration-300 ${
					isCartOpen ? 'translate-x-0' : 'translate-x-full'
				}`}>
				<div className="flex flex-col h-full">
					{/* Header */}
					<div className="flex items-center justify-between p-4 border-b">
						<div>
							<h2 className="text-xl font-bold">Your Cart</h2>
						</div>
						<button
							onClick={() => setIsCartOpen(false)}
							className="p-2 hover:bg-gray-100 rounded-full"
							aria-label="Close cart">
							<X size={24} />
						</button>
					</div>

					{/* Items */}
					<div className="flex-1 overflow-y-auto p-4 space-y-3">
						{items.length > 0 ? (
							items.map((item, index) => (
								<div
									key={index}
									className="flex gap-3 border rounded-lg p-3 hover:shadow-sm transition-shadow">
									<Image
										src={
											item &&
											Array.isArray(item.images) &&
											item.images.length > 0
												? item.images[0]
												: '/placeholder.jpg'
										}
										alt={item?.name || 'Product'}
										width={80}
										height={80}
										className="rounded-lg object-cover"
									/>

									<div className="flex-1 min-w-0">
										<h3 className="font-medium">
											{item.name}
										</h3>
										<p className="text-lg font-bold text-[#004488] mt-1">
											৳{item.price}
										</p>
										{item.originalPrice && (
											<p className="text-sm text-gray-500 line-through">
												৳{item.originalPrice}
											</p>
										)}

										{/* Quantity Controls */}
										<div className="flex items-center justify-between mt-3">
											<div className="flex items-center border rounded-lg">
												<button
													onClick={() =>
														handleQuantityChange(
															item._id,
															item.quantity - 1
														)
													}
													className="p-2 hover:bg-gray-100"
													aria-label="Decrease quantity"
													disabled={
														item.quantity <= 1
													}>
													<Minus size={16} />
												</button>
												<span className="w-8 text-center font-medium">
													{item.quantity}
												</span>
												<button
													onClick={() =>
														handleQuantityChange(
															item._id,
															item.quantity + 1
														)
													}
													className="p-2 hover:bg-gray-100"
													aria-label="Increase quantity">
													<Plus size={16} />
												</button>
											</div>

											<div className="flex items-center gap-2">
												<button
													onClick={() =>
														dispatch(
															removeFromCart(
																item._id
															)
														)
													}
													className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
													aria-label="Remove item">
													<Trash2 size={18} />
												</button>
											</div>
										</div>
									</div>
								</div>
							))
						) : (
							<div className="text-center py-16">
								<ShoppingCart
									size={64}
									className="mx-auto text-gray-300 mb-4"
								/>
								<h3 className="text-xl font-semibold mb-2">
									Your cart is empty
								</h3>
								<p className="text-gray-500 mb-6">
									Add items to get started
								</p>
								<button
									onClick={() => setIsCartOpen(false)}
									className="px-6 py-3 bg-[#004488] text-white rounded-lg hover:bg-[#003366]">
									Continue Shopping
								</button>
							</div>
						)}
					</div>

					{/* Footer */}
					{items.length > 0 && (
						<div className="border-t p-4 space-y-4 bg-gray-50">
							<div className="space-y-2">
								<div className="flex justify-between">
									<span className="text-gray-600">
										Subtotal
									</span>
									<span className="font-semibold">
										৳{totalPrice}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">
										Shipping
									</span>
									<span className="text-green-600">
										{totalPrice > 2000 ? 'FREE' : '৳80'}
									</span>
								</div>
								<div className="flex justify-between text-lg font-bold pt-2 border-t">
									<span>Total</span>
									<span>
										৳
										{totalPrice +
											(totalPrice > 2000 ? 0 : 80)}
									</span>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-3">
								<Link
									href="/cart"
									onClick={() => setIsCartOpen(false)}
									className="text-center border-2 border-[#004488] text-[#004488] py-3 rounded-lg hover:bg-[#004488] hover:text-white transition-colors">
									View Cart
								</Link>
								<Link
									href="/checkout"
									onClick={() => setIsCartOpen(false)}
									className="text-center border-2 border-[#004488] text-[#004488] py-3 rounded-lg hover:bg-[#004488] hover:text-white transition-colors">
									Checkout
								</Link>
							</div>

							<div className="flex items-center justify-center gap-2 text-sm text-gray-500">
								<Shield size={16} />
								<span>
									Secure payment • 24/7 support • Easy returns
								</span>
							</div>
						</div>
					)}
				</div>
			</aside>
		</div>
	);
};

export default CardDrawer;
