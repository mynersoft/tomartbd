import { useSelector, useDispatch } from "react-redux";
import {
	addToCart,
	removeFromCart,
	updateQuantity,
	clearCart,
	setCart,
} from "@/store/slices/cartSlice";

export const useCart = () => {
	const items = useSelector((state) => state.cart.items);
	const dispatch = useDispatch();

	const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
	const totalPrice = items.reduce(
		(acc, item) =>
			acc +
			item.quantity *
				(item.discount
					? item.price * (1 - item.discount / 100)
					: item.price),
		0
	);

	return {
		items,
		totalItems,
		totalPrice,
		addToCart: (product, quantity = 1) =>
			dispatch(addToCart({ product, quantity })),
		removeFromCart: (productId) => dispatch(removeFromCart(productId)),
		updateQuantity: (productId, quantity) =>
			dispatch(updateQuantity({ productId, quantity })),
		clearCart: () => dispatch(clearCart()),
		setCart: (cart) => dispatch(setCart(cart)),
	};
};
