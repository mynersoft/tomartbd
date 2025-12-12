// app/shop/page.tsx
import ShopClient from "./ShopClient";

export const metadata = {
	title: "Shop | TomartBD",
	description: "Buy electronics, hardware, fashion and more from TomartBD",
};

export default function Page() {
	return <ShopClient />;
}
