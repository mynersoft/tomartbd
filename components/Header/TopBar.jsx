import { Package, Phone, Shield, Truck } from "lucide-react";
import React from "react";

const TopBar = () => {
	return (
		<div className="bg-[#004488] text-white text-sm py-2 px-4">
			<div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2">
						<Phone size={14} />
						<span>Hotline: 01868944080</span>
					</div>
					<div className="hidden md:flex items-center gap-2">
						<Truck size={14} />
						<span>Free Shipping Over ৳2000</span>
					</div>
				</div>
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2">
						<Shield size={14} />
						<span>100% Secure Payment</span>
					</div>
					<div className="flex items-center gap-2">
						<Package size={14} />
						<span>Easy Returns</span>
					</div>
<Link href="/notifications" className="relative hidden md:block">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition">
                  <span className="text-lg">🔔</span>
                </div>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  3
                </span>
              </Link>
				</div>
			</div>
		</div>
	);
};

export default TopBar;
