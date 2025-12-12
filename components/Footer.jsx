"use client";

import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";

export default function Footer() {
	return (
		<footer className="bg-[#0b1220] text-gray-300 pt-16 pb-10 px-6">
			<div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
				{/* Brand */}
				<div>
					<img
						src="/logo.png"
						alt="TomartBD Logo"
						className="w-20 h-20 object-cover rounded-xl mb-4"
					/>
					<h2 className="text-3xl font-bold text-white">TomartBD</h2>
					<p className="mt-4 text-sm leading-relaxed text-gray-400">
						🌟 TomartBD – Your Trusted Hub for Quality Products.
						Fast delivery, excellent customer support & trusted by
						thousands nationwide.
					</p>

					<div className="flex space-x-4 mt-5 text-xl">
						<a href="#" className="hover:text-white transition">
							<FaFacebook />
						</a>
						<a href="#" className="hover:text-white transition">
							<FaInstagram />
						</a>
						<a href="#" className="hover:text-white transition">
							<FaYoutube />
						</a>
						<a href="#" className="hover:text-white transition">
							<FaTiktok />
						</a>
					</div>
				</div>

				{/* Quick Links */}
				<div>
					<h3 className="text-xl font-semibold text-white mb-4">
						Quick Links
					</h3>
					<ul className="space-y-3 text-gray-400 text-sm">
						<li>
							<a
								href="/shop"
								className="hover:text-white transition">
								Shop
							</a>
						</li>
						<li>
							<a
								href="/offers"
								className="hover:text-white transition">
								Offers
							</a>
						</li>
						<li>
							<a
								href="/top-sales"
								className="hover:text-white transition">
								Top Sales
							</a>
						</li>
						<li>
							<a
								href="/products"
								className="hover:text-white transition">
								All Products
							</a>
						</li>
						<li>
							<a
								href="/become-seller"
								className="hover:text-white transition">
								Become a Seller
							</a>
						</li>
					</ul>
				</div>

				{/* About */}
				<div>
					<h3 className="text-xl font-semibold text-white mb-4">
						About Business
					</h3>
					<ul className="space-y-3 text-gray-400 text-sm">
						<li>
							<a
								href="/about"
								className="hover:text-white transition">
								About us
							</a>
						</li>
						<li>
							<a
								href="/contact"
								className="hover:text-white transition">
								Contact us
							</a>
						</li>
						<li>
							<a
								href="/privacy"
								className="hover:text-white transition">
								Privacy Policy
							</a>
						</li>
						<li>
							<a
								href="/terms"
								className="hover:text-white transition">
								Terms & Conditions
							</a>
						</li>
					</ul>
				</div>

				{/* Contact */}
				<div>
					<h3 className="text-xl font-semibold text-white mb-4">
						Contact Us
					</h3>
					<p className="text-sm text-gray-400 leading-relaxed">
						Dokkhin Mugda, Bazar Masjid, Hamid Tower <br /> Dhaka,
						Bangladesh.
					</p>

					<ul className="mt-4 space-y-2 text-sm text-gray-400">
						<li>📞 +8801900000000</li>
						<li>📞 +8801700000000</li>
						<li>📧 support@tomartbd.shop</li>
						<li>🌐 tomartbd.shop</li>
					</ul>
				</div>
			</div>

			{/* Bottom Bar */}
			<div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400 text-sm">
				<p>©2025 TOMARTBD.SHOP — All Rights Reserved.</p>
				<p className="mt-1">Developed by Mahir</p>

				<div className="flex justify-center space-x-3 mt-3 text-xs">
					<a href="/reviews" className="hover:text-white">
						Customer Reviews
					</a>
					<span>|</span>
					<a href="/become-seller" className="hover:text-white">
						How to be a Seller
					</a>
					<span>|</span>
					<a href="/seller-benefits" className="hover:text-white">
						Seller Benefits
					</a>
					<span>|</span>
					<a href="/faqs" className="hover:text-white">
						FAQ’s
					</a>
				</div>
			</div>

			{/* WhatsApp Button */}
			<a
				href="https://wa.me/8801700000000"
				className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition">
				<img src="/whatsapp.svg" alt="WhatsApp" className="w-8 h-8" />
			</a>
		</footer>
	);
}
