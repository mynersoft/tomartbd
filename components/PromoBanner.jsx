// components/PromoBanner.jsx
export default function PromoBanner() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-white mb-6 md:mb-0">
            <h3 className="text-2xl font-bold mb-2">
              🎉 Big Sale! Up to 50% OFF
            </h3>
            <p className="text-blue-100">
              Limited time offer on selected vendors. Hurry up!
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center bg-white/20 backdrop-blur-sm p-3 rounded-lg">
              <div className="text-2xl font-bold">02</div>
              <div className="text-sm">Days</div>
            </div>
            <div className="text-center bg-white/20 backdrop-blur-sm p-3 rounded-lg">
              <div className="text-2xl font-bold">14</div>
              <div className="text-sm">Hours</div>
            </div>
            <div className="text-center bg-white/20 backdrop-blur-sm p-3 rounded-lg">
              <div className="text-2xl font-bold">45</div>
              <div className="text-sm">Minutes</div>
            </div>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow">
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
